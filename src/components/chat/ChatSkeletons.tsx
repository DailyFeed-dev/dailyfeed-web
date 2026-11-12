const LIST_LINE_WIDTHS = [
  [139, 162],
  [117, 126],
  [128, 144],
  [106, 108],
  [123, 135],
  [112, 117],
  [134, 153],
];

const MESSAGE_SKELETONS = [
  { mine: false, width: 320 },
  { mine: false, width: 220 },
  { mine: true, width: 360 },
  { mine: false, width: 280 },
  { mine: true, width: 200 },
  { mine: false, width: 340 },
];

export function ChatListSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="flex animate-pulse flex-col gap-1.5">
      {LIST_LINE_WIDTHS.map(([nameWidth, textWidth], index) => (
        <div key={index} className="flex h-[68px] items-center gap-3 p-3">
          <span className="size-11 shrink-0 rounded-full bg-(--color-border-default)" />
          <span className="flex min-w-0 flex-col gap-2">
            <span
              className="h-3 max-w-full rounded-md bg-(--color-border-default)"
              style={{ width: nameWidth }}
            />
            <span
              className="h-2.5 max-w-full rounded-md bg-(--color-bg-subtle)"
              style={{ width: textWidth }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

export function MessageSkeletonList() {
  return (
    <div
      role="status"
      aria-label="대화를 불러오는 중"
      className="flex min-h-0 flex-1 animate-pulse flex-col justify-end gap-[18px] overflow-hidden bg-[#fcfcfe] px-4 py-5 sm:px-6"
    >
      {MESSAGE_SKELETONS.map(({ mine, width }, index) =>
        mine ? (
          <div key={index} className="flex justify-end">
            <span
              className="h-10 max-w-[80%] rounded-[14px] bg-(--color-bg-brand-muted)"
              style={{ width }}
            />
          </div>
        ) : (
          <div key={index} className="flex gap-2.5">
            <span className="size-9 shrink-0 rounded-full bg-(--color-border-default)" />
            <span className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="h-2.5 w-20 rounded-md bg-(--color-bg-subtle)" />
              <span
                className="h-10 max-w-[80%] rounded-[14px] bg-(--color-border-default)"
                style={{ width }}
              />
            </span>
          </div>
        ),
      )}
    </div>
  );
}
