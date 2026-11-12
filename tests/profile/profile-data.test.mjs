import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = fileURLToPath(new URL('../../', import.meta.url));
const loadPackage = createRequire(import.meta.url);

// Load the production TypeScript and JSX without adding a test-runner dependency.
function loadSource(relative, mocks = {}, cache = new Map()) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename);
  const exports = {};
  cache.set(filename, exports);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
  vm.runInNewContext(outputText, {
    exports,
    structuredClone,
    URL,
    require(name) {
      if (name in mocks) return mocks[name];
      if (!name.startsWith('.') && !name.startsWith('@/')) return loadPackage(name);
      const base = name.startsWith('@/')
        ? path.join(root, 'src', name.slice(2))
        : path.resolve(path.dirname(filename), name);
      const resolved = ['.ts', '.tsx', '/index.ts'].map((ext) => base + ext).find(fs.existsSync);
      assert.ok(resolved, `Unresolved import: ${name}`);
      return loadSource(path.relative(root, resolved), mocks, cache);
    },
  });
  return exports;
}

test('project names are looked up by ID with explicit missing-project labels', () => {
  const { getProfileProjectName } = loadSource('src/components/profile/profileActivity.ts');
  const projects = [{ id: 3, name: '프로젝트 이름' }];
  assert.equal(getProfileProjectName(projects, 3), '프로젝트 이름');
  assert.equal(getProfileProjectName(projects, 9), '프로젝트 9');
  assert.equal(getProfileProjectName(projects), '프로젝트 정보 없음');
  assert.equal(getProfileProjectName([{ name: 'ID 없는 프로젝트' }]), '프로젝트 정보 없음');
});

test('date labels preserve Korean timezone and invalid-date handling', () => {
  const { formatProfileDate, getProfileMonth } = loadSource(
    'src/components/profile/profileActivity.ts',
  );
  assert.match(formatProfileDate('2026-10-31T16:00:00Z'), /2026.*11.*01/);
  assert.equal(getProfileMonth('2026-10-31T16:00:00Z'), '2026-11');
  assert.equal(formatProfileDate('invalid'), '날짜 정보 없음');
  assert.equal(getProfileMonth('invalid'), '');
  assert.equal(formatProfileDate(), '날짜 정보 없음');
  assert.equal(getProfileMonth(), '');
});

test('sample service preserves pagination, copy isolation and cancellation', async () => {
  const service = loadSource('src/services/profileService.ts');
  const first = await service.getMyProfilePosts(0);
  assert.equal(first.size, 3);
  assert.equal(first.totalElements, 12);
  assert.equal(first.items.length, 3);
  assert.equal('projectName' in first.items[0], false);
  assert.equal((await service.getMyProfilePosts(3)).items.length, 3);
  assert.equal((await service.getMyProfilePosts(4)).items.length, 0);
  first.items[0].title = 'changed';
  assert.notEqual((await service.getMyProfilePosts(0)).items[0].title, 'changed');
  await assert.rejects(service.getMyProfilePosts(-1), /페이지 번호/);
  await assert.rejects(service.getMyProfilePosts(0.5), /페이지 번호/);
  await assert.rejects(service.getMyProfilePosts(0, AbortSignal.abort()));
  await assert.rejects(service.getProfileActivity(AbortSignal.abort()));
  await assert.rejects(service.getMyProfileProjects(AbortSignal.abort()));
  const projects = await service.getMyProfileProjects();
  projects[0].name = 'changed';
  assert.notEqual((await service.getMyProfileProjects())[0].name, 'changed');
});

function renderPosts(resource, services) {
  let load;
  const mocks = {
    react: {
      ...React,
      useState: (initial) => [initial, () => {}],
      useCallback: (callback) => callback,
    },
    '../shared/hooks/useProfileResource': {
      useProfileResource(_key, loader) {
        load = loader;
        return { data: resource, isLoading: false, error: '', retry() {} };
      },
    },
  };
  if (services) mocks['@/services/profileService'] = services;
  const Posts = loadSource('src/components/profile/posts/ProfilePosts.tsx', mocks).default;
  return {
    html: renderToStaticMarkup(React.createElement(Posts, { onViewChange() {} })),
    load: (signal) => load(signal),
  };
}

test('posts render a project name from projectId without a projectName field', () => {
  const { html } = renderPosts({
    posts: {
      items: [{ id: 1, projectId: 3, title: '게시글', body: '본문' }],
      size: 3,
      totalElements: 1,
    },
    projects: [{ id: 3, name: '서버 프로젝트 이름' }],
  });
  assert.match(html, /서버 프로젝트 이름/);
  assert.doesNotMatch(html, /프로젝트 3/);
  assert.match(html, /날짜 정보 없음/);
  assert.match(html, /전체 1개 중 1~1개/);
});

test('optional page fields and unmatched projects do not break rendering', () => {
  const empty = renderPosts({ posts: {}, projects: [] }).html;
  assert.match(empty, /작성한 게시글이 없습니다/);
  assert.match(empty, /전체 0개 중 0~0개/);
  const missingProject = renderPosts({
    posts: { items: [{ id: 1, projectId: 9 }] },
    projects: [],
  }).html;
  assert.match(missingProject, /프로젝트 9/);
});

test('posts load page and projects with one cancellation signal and propagate failures', async () => {
  const signal = new AbortController().signal;
  const calls = [];
  const services = {
    async getMyProfilePosts(page, receivedSignal) {
      calls.push({ page, signal: receivedSignal });
      return { items: [], size: 3, totalElements: 0 };
    },
    async getMyProfileProjects(receivedSignal) {
      calls.push({ signal: receivedSignal });
      return [{ id: 3, name: '프로젝트' }];
    },
  };
  const result = await renderPosts(null, services).load(signal);
  assert.equal(result.projects[0].name, '프로젝트');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].page, 0);
  assert.ok(calls.every((call) => call.signal === signal));
  await assert.rejects(
    renderPosts(null, {
      ...services,
      async getMyProfileProjects() {
        throw new Error('프로젝트 조회 실패');
      },
    }).load(signal),
    /프로젝트 조회 실패/,
  );
});

test('calendar accepts optional generated statistics and preserves leap-year dates', () => {
  const Calendar = loadSource(
    'src/components/profile/reflections/components/ProfileLearningCalendar.tsx',
  ).default;
  const html = renderToStaticMarkup(React.createElement(Calendar, { stats: {}, month: '2028-02' }));
  assert.match(html, /2028-02-29, TIL 0개/);
  assert.equal((html.match(/aria-pressed=/g) ?? []).length, 29);
  assert.match(html, /총 0개/);
});

test('reflections keep newest-first order without mutating generated records', () => {
  const records = [
    { id: 1, title: '날짜 없는 회고' },
    { id: 2, title: '둘째 회고', createdAt: '2026-11-02T00:00:00Z', kind: 'WEEKLY' },
    { id: 3, title: '최신 회고', createdAt: '2026-11-03T00:00:00Z', kind: 'TEAM' },
    { id: 4, title: '첫째 회고', createdAt: '2026-11-01T00:00:00Z', kind: 'DAILY' },
  ];
  const before = structuredClone(records);
  const Reflections = loadSource('src/components/profile/reflections/ProfileReflections.tsx', {
    '../shared/hooks/useProfileResource': {
      useProfileResource() {
        return {
          data: { month: '2026-11', projects: [], reflections: records, tilStats: {} },
          isLoading: false,
          error: '',
          retry() {},
        };
      },
    },
  }).default;
  const html = renderToStaticMarkup(React.createElement(Reflections));
  assert.ok(html.indexOf('최신 회고') < html.indexOf('둘째 회고'));
  assert.ok(html.indexOf('둘째 회고') < html.indexOf('첫째 회고'));
  assert.doesNotMatch(html, /날짜 없는 회고/);
  assert.match(html, /전체 4개 보기/);
  assert.deepEqual(records, before);
});
