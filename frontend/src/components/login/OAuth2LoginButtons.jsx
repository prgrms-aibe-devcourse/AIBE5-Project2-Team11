import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * OAuth2 로그인/회원가입 버튼 컴포넌트
 * Google과 Naver 로그인/회원가입 버튼을 제공합니다.
 *
 * @param {string} mode - 'login' 또는 'signup' (기본값: 'login')
 */
const OAuth2LoginButtons = ({ mode = 'login' }) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 에러 메시지 처리
    const error = searchParams.get('error');
    if (error) {
      console.error('OAuth2 오류:', decodeURIComponent(error));
      alert('로그인/가입 실패: ' + decodeURIComponent(error));
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    console.log('Google ' + (mode === 'signup' ? '회원가입' : '로그인') + ' 시작...');
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleNaverLogin = () => {
    console.log('Naver ' + (mode === 'signup' ? '회원가입' : '로그인') + ' 시작...');
    window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
  };

  const googleText = mode === 'signup' ? 'Google 계정으로 회원가입' : 'Google 계정으로 로그인';
  const naverText = mode === 'signup' ? 'Naver 계정으로 회원가입' : 'Naver 계정으로 로그인';

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full h-14 bg-white border border-amber-200 text-[#451a03] rounded-xl flex items-center justify-center gap-3 font-bold hover:bg-amber-50 transition-colors"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          className="w-5 h-5"
        />
        {googleText}
      </button>

      <button
        type="button"
        onClick={handleNaverLogin}
        className="w-full h-14 bg-white border border-[#00C73C] text-[#00C73C] rounded-xl flex items-center justify-center gap-3 font-bold hover:bg-green-50 transition-colors"
      >
        <span className="text-xl font-bold">N</span>
        {naverText}
      </button>
    </div>
  );
};

export default OAuth2LoginButtons;

