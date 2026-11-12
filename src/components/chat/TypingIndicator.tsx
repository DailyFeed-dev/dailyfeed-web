import Image from 'next/image';

type TypingIndicatorProps = {
  name: string;
  typing: boolean;
};

export default function TypingIndicator({ name, typing }: TypingIndicatorProps) {
  return (
    <div role="status" className="bg-[#fcfcfe] px-4 sm:px-6">
      {typing && (
        <p className="flex items-center gap-2 pb-3 pl-[46px] text-xs leading-[1.45] text-(--color-text-muted)">
          <Image
            src="/chat/typing-dots.svg"
            alt=""
            width={50}
            height={24}
            unoptimized
            className="shrink-0 animate-pulse motion-reduce:animate-none"
          />
          {name}님이 입력 중...
        </p>
      )}
    </div>
  );
}
