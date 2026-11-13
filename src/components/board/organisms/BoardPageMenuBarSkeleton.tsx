import { BOARD_CATEGORIES } from '../boardCategories';
import { TAB_WIDTH } from '../boardTabStyles';

// 카테고리 탭이 준비되기 전에 보여 주는 자리 표시입니다. BoardPageMenuBar 와 같은 폭·높이를 씁니다.
// 어느 탭이 선택됐는지는 주소(searchParams)를 읽어야 알 수 있어서 선택 표시는 하지 않습니다.
export default function BoardPageMenuBarSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse pt-5 pb-5">
      <div className="flex border-b border-zinc-200">
        {/* 전체 + 카테고리 수만큼 */}
        {Array.from({ length: BOARD_CATEGORIES.length + 1 }, (_, index) => (
          <div key={index} className={`-mb-px flex ${TAB_WIDTH} flex-col items-stretch gap-2 pt-2`}>
            <span className="flex h-[22.4px] items-center justify-center">
              <span className="h-4 w-8 rounded bg-zinc-200" />
            </span>
            <span className="h-0.5 bg-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}
