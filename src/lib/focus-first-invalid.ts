/**
 * 제출했을 때 비어 있는 입력(:invalid)이 여러 개면 맨 위 하나만 포커스를 주고, 그 칸이 화면 가운데 오게 스크롤합니다.
 * 입력의 onInvalid 에서 부르면 됩니다.
 *
 * @param field  검사에 걸린 입력 (input, textarea 등)
 * @param target 실제로 포커스를 줄 요소. 생략하면 field 자신입니다. (숨은 입력 대신 버튼에 줄 때 씁니다)
 */
export function focusFirstInvalid(
  field: HTMLInputElement | HTMLTextAreaElement,
  target: HTMLElement = field,
) {
  if (field.form?.querySelector(':invalid') !== field) return;
  // 브라우저 기본 스크롤은 가장자리에 걸치면 멈추므로, 직접 가운데로 옮깁니다.
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
