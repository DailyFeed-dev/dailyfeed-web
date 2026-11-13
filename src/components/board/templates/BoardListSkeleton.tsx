import BoardPageMenuBarSkeleton from '../organisms/BoardPageMenuBarSkeleton';
import BoardPostHeader from '../organisms/BoardPostHeader';
import BoardPostRowSkeleton from '../molecules/BoardPostRowSkeleton';
import BoardHeaderSkeleton from './BoardHeaderSkeleton';

const SKELETON_ROWS = 10;

// 게시판 목록 화면의 뼈대입니다. /board 로 이동하자마자(주소를 읽는 동안) 보여 줍니다.
export default function BoardListSkeleton() {
  return (
    <div role="status" aria-label="게시판을 불러오는 중">
      <BoardHeaderSkeleton />
      <BoardPageMenuBarSkeleton />
      <div className="overflow-hidden rounded-t-lg">
        <BoardPostHeader />
        <div className="animate-pulse">
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <BoardPostRowSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
