import Link from 'next/link';

export type SubMenuItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  tone?: 'default' | 'danger';
};

type SubMenuProps = {
  items: SubMenuItem[];
  className?: string;
};

const TONE_CLASS = {
  default: 'text-(--color-text-primary)',
  danger: 'text-(--color-text-danger)',
};

const itemClass =
  'block w-full cursor-pointer rounded-md px-[13px] py-[11px] text-left text-sm leading-[1.55] whitespace-nowrap transition-colors hover:bg-(--color-bg-subtle) focus-visible:bg-(--color-bg-subtle) focus-visible:outline-none';

/** 드롭다운 형태의 서브 메뉴입니다. 항목만 받아 그리며, 열고 닫는 것은 사용하는 쪽에서 합니다. */
export default function SubMenu({ items, className }: SubMenuProps) {
  return (
    <div
      role="menu"
      className={`flex flex-col gap-1 overflow-clip rounded-[10px] border border-(--color-border-default) bg-(--color-bg-surface) p-[3px] shadow-[0_2px_6px_rgba(31,28,43,0.06),0_16px_40px_rgba(31,28,43,0.14)] ${className ?? ''}`}
    >
      {items.map(({ label, href, onClick, tone = 'default' }) => {
        const cls = `${itemClass} ${TONE_CLASS[tone]}`;
        return href ? (
          <Link key={label} href={href} role="menuitem" onClick={onClick} className={cls}>
            {label}
          </Link>
        ) : (
          <button key={label} type="button" role="menuitem" onClick={onClick} className={cls}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
