'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from 'react';

import type { Schemas } from '@/lib/api';
import { TIL_BODY_MAX, TIL_TITLE_MAX } from '@/types/til';

import TilEditorTopBar, { type TilEditorMode } from './TilEditorTopBar';
import TilFormatToolbar from './TilFormatToolbar';
import TilMarkdownPreview from './TilMarkdownPreview';
import TilMarkdownSourceEditor from './TilMarkdownSourceEditor';
import { formatTilDateTime, tilErrorMessage } from './tilBoardUrl';
import { applyFormat, headingLevelAt, type FormatCommand } from './tilMarkdownCommands';

type TilInput = Schemas['CreateTilRequest'];
type SavedDraft = TilInput & { savedAt: number };

// ---- 임시저장 (이 브라우저에만 저장) ----

function readDraft(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // 사생활 보호 모드 등에서는 저장소를 못 쓸 수 있습니다.
  }
}

function parseDraft(raw: string | null): SavedDraft | null {
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as Partial<SavedDraft>;
    return typeof draft.title === 'string' && typeof draft.body === 'string'
      ? { title: draft.title, body: draft.body, savedAt: Number(draft.savedAt) || Date.now() }
      : null;
  } catch {
    return null;
  }
}

const subscribeStorage = (onChange: () => void) => {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
};

type Props = {
  /** 미리보기에 보여줄 작성자 이름 */
  authorName: string;
  /** 미리보기에 보여줄 날짜 ("2026.11.10") */
  date: string;
  day?: number;
  initialValue?: TilInput;
  submitLabel: string;
  /** 넘기면 임시저장 버튼과 '불러오기' 안내가 생깁니다. (새 글 작성에서만) */
  draftKey?: string;
  /** 저장하기. 실패하면 에러를 던지면 됩니다. (메시지를 알림으로 보여줍니다) */
  onSubmit: (input: TilInput) => Promise<void>;
};

/** TIL 작성 · 수정 화면 (디자인: TIL Write – 마크다운 75:8143). 태그 입력은 없습니다. */
export default function TilEditor({
  authorName,
  date,
  day,
  initialValue,
  submitLabel,
  draftKey,
  onSubmit,
}: Props) {
  const [mode, setMode] = useState<TilEditorMode>('markdown');
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [body, setBody] = useState(initialValue?.body ?? '');
  const [caret, setCaret] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [draftDismissed, setDraftDismissed] = useState(false);

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<[number, number] | null>(null);

  // 서버 렌더링 때는 null, 브라우저에서는 저장된 값을 읽습니다. (화면 불일치 없이)
  const savedDraft = parseDraft(
    useSyncExternalStore(
      subscribeStorage,
      () => (draftKey ? readDraft(draftKey) : null),
      () => null,
    ),
  );
  const showDraftBanner = !!savedDraft && !draftDismissed && !title && !body;

  // 긴 제목은 줄바꿈되도록 제목 칸 높이를 내용에 맞춥니다.
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, [title, mode]);

  // 툴바 명령으로 본문이 바뀐 뒤 선택 범위를 되살립니다.
  useEffect(() => {
    const el = bodyRef.current;
    const sel = pendingSelection.current;
    if (el && sel) {
      el.focus();
      el.setSelectionRange(sel[0], sel[1]);
      pendingSelection.current = null;
    }
  }, [body]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const runCommand = useCallback(
    (command: FormatCommand) => {
      const el = bodyRef.current;
      if (!el) return;
      const next = applyFormat(
        { value: body, start: el.selectionStart, end: el.selectionEnd },
        command,
      );
      pendingSelection.current = [next.start, next.end];
      setBody(next.value);
      setCaret(next.start);
    },
    [body],
  );

  const onBodyKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const key = e.key.toLowerCase();
    if (mode === 'markdown' && (e.metaKey || e.ctrlKey) && ['b', 'i', 'k'].includes(key)) {
      e.preventDefault();
      runCommand(
        key === 'b' ? { type: 'bold' } : key === 'i' ? { type: 'italic' } : { type: 'link' },
      );
      return;
    }
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: en } = e.currentTarget;
      pendingSelection.current = [s + 2, s + 2];
      setBody(body.slice(0, s) + '  ' + body.slice(en));
    }
  };

  const handleSaveDraft = () => {
    if (!draftKey) return;
    try {
      const draft: SavedDraft = { title, body, savedAt: Date.now() };
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
      setToast('임시저장했어요');
    } catch {
      setToast('이 브라우저에서는 임시저장을 할 수 없어요');
    }
  };

  const restoreDraft = () => {
    if (!savedDraft) return;
    setTitle(savedDraft.title);
    setBody(savedDraft.body);
    setDraftDismissed(true);
  };

  const discardDraft = () => {
    if (draftKey) {
      try {
        window.localStorage.removeItem(draftKey);
      } catch {
        // 저장소를 못 쓰는 환경이면 그냥 넘어갑니다.
      }
    }
    setDraftDismissed(true);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setToast('제목을 입력해 주세요');
      titleRef.current?.focus();
      return;
    }
    if (!body.trim()) {
      setToast('내용을 입력해 주세요');
      bodyRef.current?.focus();
      return;
    }
    if (body.length > TIL_BODY_MAX) {
      setToast(`내용은 ${TIL_BODY_MAX.toLocaleString('ko-KR')}자까지 쓸 수 있어요`);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), body });
      if (draftKey) discardDraft(); // 올린 글의 임시저장은 지웁니다.
    } catch (error) {
      setToast(tilErrorMessage(error, '저장하지 못했어요'));
      setSubmitting(false);
    }
  };

  const isMarkdown = mode === 'markdown';

  return (
    // 헤더(100px) 아래 화면을 꽉 채웁니다. 음수 margin 은 (main)/layout.tsx 의 좌우 padding 과 맞춥니다.
    <div className="-mx-4 grid h-[calc(100dvh-6.25rem)] grid-rows-[72px_minmax(0,1fr)] bg-white sm:-mx-10 lg:-mx-20">
      <TilEditorTopBar
        mode={mode}
        onModeChange={setMode}
        onSaveDraft={draftKey ? handleSaveDraft : undefined}
        onSubmit={handleSubmit}
        submitLabel={submitLabel}
        submitting={submitting}
      />

      <div
        className={`grid min-h-0 grid-cols-1 overflow-y-auto ${isMarkdown ? 'min-[960px]:grid-cols-2 min-[960px]:overflow-visible' : ''}`}
      >
        <section
          aria-label="편집"
          className={`grid min-h-0 grid-rows-[auto_52px] bg-white ${isMarkdown ? 'min-[960px]:grid-rows-[minmax(0,1fr)_52px]' : ''}`}
        >
          <div
            className={`px-6 py-8 ${isMarkdown ? 'min-[960px]:overflow-y-auto min-[960px]:px-12 min-[960px]:py-10' : 'sm:px-12 sm:py-10'}`}
          >
            <div
              className={`flex w-full flex-col items-start gap-5 ${isMarkdown ? '' : 'mx-auto max-w-190'}`}
            >
              {showDraftBanner && savedDraft && (
                <div
                  role="status"
                  className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-[10px] bg-[#f0eefe] px-4 py-3 text-sm text-[#4b3fd6]"
                >
                  <span className="mr-auto">
                    임시저장한 글이 있어요 (
                    {formatTilDateTime(new Date(savedDraft.savedAt).toISOString())})
                  </span>
                  <button
                    type="button"
                    onClick={restoreDraft}
                    className="cursor-pointer font-semibold underline underline-offset-2"
                  >
                    불러오기
                  </button>
                  <button
                    type="button"
                    onClick={discardDraft}
                    className="cursor-pointer text-[#6b6a7b] hover:text-[#1f1d2b]"
                  >
                    삭제
                  </button>
                </div>
              )}

              <textarea
                ref={titleRef}
                value={title}
                rows={1}
                maxLength={TIL_TITLE_MAX}
                placeholder="제목을 입력하세요"
                aria-label="제목"
                onChange={(e) => setTitle(e.target.value.replace(/\n/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    bodyRef.current?.focus();
                  }
                }}
                className={`w-full resize-none overflow-hidden bg-transparent leading-[1.3] font-bold text-[#1f1d2b] outline-none placeholder:text-[#bdbcc8] ${isMarkdown ? 'text-[32px]' : 'text-4xl'}`}
              />
              <span aria-hidden="true" className="block h-1.25 w-16 rounded-[3px] bg-[#685cf0]" />

              {isMarkdown && (
                <TilFormatToolbar
                  activeHeading={headingLevelAt(body, caret)}
                  onCommand={runCommand}
                />
              )}

              <TilMarkdownSourceEditor
                ref={bodyRef}
                value={body}
                onChange={setBody}
                onSelectionChange={(start) => setCaret(start)}
                onKeyDown={onBodyKeyDown}
                highlight={isMarkdown}
                placeholder={
                  isMarkdown
                    ? '마크다운으로 오늘 배운 것을 기록해 보세요'
                    : '오늘 배운 것을 자유롭게 적어 보세요'
                }
              />
            </div>
          </div>

          <footer className="flex items-center justify-between border-t border-[#f0eff5] px-6 text-[13px] leading-[1.4] font-medium whitespace-nowrap text-[#9a99a8] sm:px-12">
            <span>
              {isMarkdown ? 'Markdown 문법 지원' : '서식이 필요하면 마크다운 모드로 전환하세요'}
            </span>
            <span className={body.length > TIL_BODY_MAX ? 'text-[#e5484d]' : ''}>
              {body.length.toLocaleString('ko-KR')} / {TIL_BODY_MAX.toLocaleString('ko-KR')}자
            </span>
          </footer>
        </section>

        {isMarkdown && (
          <section
            aria-label="미리보기"
            className="min-h-0 border-t border-[#f0eff5] bg-[#fbfbfe] px-6 py-8 min-[960px]:overflow-y-auto min-[960px]:border-t-0 min-[960px]:border-l min-[960px]:px-14 min-[960px]:py-10"
          >
            <TilMarkdownPreview
              title={title}
              body={body}
              author={authorName}
              date={date}
              day={day}
            />
          </section>
        )}
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-19 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#1f1d2b] px-4.5 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(31,28,43,0.18)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
