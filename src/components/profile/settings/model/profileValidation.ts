import type { Schemas } from '@/lib/api';

import type { ProfileValidationResult } from './profileFormState';
import { presenceOptions } from '../../shared/model/profileOptions';

// 상황에 맞는 대응을 하는 부분으로 함수를 통해서 검증하게 한다.

function readText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === 'string' ? value : '';
}

export function validateProfileStatus(
  form: FormData,
): ProfileValidationResult<Schemas['UpdateStatusRequest']> {
  const selected = presenceOptions.find((option) => option.value === form.get('presenceStatus'));
  const statusMessage = readText(form, 'statusMessage');

  if (!selected) return { ok: false, errors: { presenceStatus: '접속 상태를 선택해 주세요.' } };
  if (statusMessage.length > 60)
    return { ok: false, errors: { statusMessage: '상태 메시지는 60자 이내로 입력해 주세요.' } };

  return { ok: true, value: { presenceStatus: selected.value, statusMessage } };
}
