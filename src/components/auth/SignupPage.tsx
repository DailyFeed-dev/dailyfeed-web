import SignupFlow from '@/components/auth/SignupFlow';

// 회원가입 화면 (Figma 02·03). 한 주소(/signup) 안에서 2단계로 진행하며,
// 단계마다 카드 내용이 바뀌므로 카드는 클라이언트 컴포넌트인 SignupFlow 가 그립니다.
export default function SignupPage() {
  return <SignupFlow />;
}
