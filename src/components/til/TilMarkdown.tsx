import { isValidElement, type ReactElement, type ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import TilCopyButton from './TilCopyButton';
import { TilIcon } from './TilTempUi';
import { highlightCode, splitFileName } from './tilHighlightCode';

/**
 * article: 상세 페이지 본문 (디자인: Article Body 126:4860, 글자 17px)
 * preview: 작성 화면 미리보기 (디자인: Preview 75:8232, 글자 16px)
 */
export type TilMarkdownVariant = 'article' | 'preview';

const textOf = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return '';
};

type HastNode = { tagName?: string; properties?: { checked?: boolean }; children?: HastNode[] };
const isCheckedTask = (node?: HastNode) =>
  !!node?.children?.find((c) => c.tagName === 'input')?.properties?.checked;

/** 코드 블록 (디자인: Code Block 126:4877 / 75:8267). 첫 줄 `// 파일명` 은 머리글로 보여줍니다. */
function CodeBlock({
  code,
  language,
  variant,
}: {
  code: string;
  language?: string;
  variant: TilMarkdownVariant;
}) {
  const { fileName, body } = splitFileName(code);
  const isArticle = variant === 'article';
  const showHeader = isArticle || fileName || language;

  return (
    <div
      className={`flex flex-col bg-[#1f1d2b] ${
        isArticle
          ? 'gap-3 rounded-xl pt-4 pr-5 pb-5 pl-6'
          : 'gap-2.5 rounded-[10px] px-5 pt-4 pb-4.5'
      }`}
    >
      {showHeader && (
        <div className="flex items-center justify-between leading-[1.4] text-[#8e8ca3]">
          <span className="font-mono text-xs">{fileName ?? ''}</span>
          {isArticle ? (
            <TilCopyButton text={body} />
          ) : (
            language && <span className="text-[11px] font-semibold">{language.toUpperCase()}</span>
          )}
        </div>
      )}
      <pre className="m-0 overflow-x-auto font-mono text-sm leading-[1.7] text-[#e6e4f2]">
        <code>{highlightCode(body)}</code>
      </pre>
    </div>
  );
}

function makeComponents(variant: TilMarkdownVariant): Components {
  const isArticle = variant === 'article';
  const text = isArticle ? 'text-[17px] leading-[1.8]' : 'text-base leading-[1.75]';
  const heading = 'm-0 font-bold leading-[1.3] text-[#1f1d2b]';

  return {
    h1: ({ children }) => <h2 className={`${heading} text-[28px]`}>{children}</h2>,
    h2: ({ children }) => <h2 className={`${heading} text-2xl`}>{children}</h2>,
    h3: ({ children }) => <h3 className={`${heading} text-xl`}>{children}</h3>,
    h4: ({ children }) => <h4 className={`${heading} text-lg`}>{children}</h4>,
    p: ({ children }) => (
      <p className={`m-0 ${text} wrap-anywhere [&_strong]:font-bold`}>{children}</p>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-[#4b3fd6] underline underline-offset-2"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className={`m-0 flex list-none flex-col p-0 ${isArticle ? 'gap-2' : 'gap-1.5'} ${text}`}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        className={`m-0 flex list-decimal flex-col ${isArticle ? 'gap-2 pl-6' : 'gap-1.5 pl-5.5'} ${text}`}
      >
        {children}
      </ol>
    ),
    li: ({ children, className, node }) => {
      if (className?.includes('task-list-item')) {
        const done = isCheckedTask(node as HastNode);
        return (
          <li
            className={`flex items-center gap-2.5 ${isArticle && done ? 'text-[#9a99a8] line-through' : ''}`}
          >
            {children}
          </li>
        );
      }
      return (
        <li className="flex items-start gap-3">
          {/* 첫 줄 가운데에 오는 점 */}
          <span
            aria-hidden="true"
            className={`shrink-0 rounded-full bg-[#2e2d3a] ${isArticle ? 'mt-[12.5px] size-1.5' : 'mt-[11.5px] size-1.25'}`}
          />
          <div className="min-w-0 flex-1 [&>ol]:mt-2 [&>ul]:mt-2">{children}</div>
        </li>
      );
    },
    input: ({ checked }) =>
      checked ? (
        <span
          role="img"
          aria-label="완료"
          className="inline-flex size-4.5 shrink-0 items-center justify-center rounded bg-[#685cf0] text-white"
        >
          <TilIcon name="check" />
        </span>
      ) : (
        <span
          role="img"
          aria-label="미완료"
          className="inline-flex size-4.5 shrink-0 rounded border-[1.5px] border-[#c9c7d6] bg-white"
        />
      ),
    blockquote: ({ children }) => (
      <blockquote
        className={`m-0 border-l-4 border-[#685cf0] bg-[#f0eefe] text-[#6b6a7b] [&_p]:text-base [&_p]:text-[#6b6a7b] ${
          isArticle ? 'px-5 py-3.5 [&_p]:leading-[1.75]' : 'px-4 py-3 [&_p]:leading-[1.7]'
        }`}
      >
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded bg-[#fcebf1] px-1.5 py-0.5 font-mono text-[0.85em] text-[#d6336c]">
        {children}
      </code>
    ),
    pre: ({ children }) => {
      const codeEl = (Array.isArray(children) ? children[0] : children) as ReactElement<{
        className?: string;
        children?: ReactNode;
      }>;
      const language = /language-(\w+)/.exec(codeEl?.props?.className ?? '')?.[1];
      return (
        <CodeBlock code={textOf(codeEl?.props?.children)} language={language} variant={variant} />
      );
    },
    hr: () => <hr className="m-0 w-full border-t border-[#ecebf2]" />,
    table: ({ children }) => (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[15px]">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-[#ecebf2] bg-[#f6f5fb] px-3 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => <td className="border border-[#ecebf2] px-3 py-2">{children}</td>,
  };
}

const COMPONENTS: Record<TilMarkdownVariant, Components> = {
  article: makeComponents('article'),
  preview: makeComponents('preview'),
};

/** 저장된 마크다운을 화면에 그립니다. 이미지(![]())는 지원하지 않아서 그리지 않습니다. */
export default function TilMarkdown({
  source,
  variant = 'article',
}: {
  source: string;
  variant?: TilMarkdownVariant;
}) {
  return (
    <div className="flex w-full flex-col gap-5 text-[#2e2d3a]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={COMPONENTS[variant]}
        disallowedElements={['img']}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
