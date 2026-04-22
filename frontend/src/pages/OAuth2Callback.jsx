import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

/**
 * OAuth2 콜백 페이지
 * 소셜 로그인 성공 후 리다이렉트되는 페이지
 * 백엔드에서 받은 JWT 토큰을 저장하고 
 * PENDING 상태이면 추가 정보 입력 페이지로, 아니면 홈으로 이동
 */
const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOAuth2Callback = async () => {
      try {
        const token = searchParams.get('token');
        const memberId = searchParams.get('memberId');
        const loginId = searchParams.get('loginId');
        const name = searchParams.get('name');
        const role = searchParams.get('role');
        const provider = searchParams.get('provider');
        const error = searchParams.get('error');

        if (error) {
          console.error('OAuth2 로그인 실패:', error);
          navigate('/login?error=' + encodeURIComponent(error));
          return;
        }

        if (token && memberId) {
           // ✅ localStorage 완전히 초기화 (모든 이전 로그인 정보 제거!)
           localStorage.clear();
           sessionStorage.clear();
            
            // 새로운 로그인 정보 저장
           localStorage.setItem('authToken', token);
           localStorage.setItem('memberId', memberId);
           localStorage.setItem('loginId', loginId);
           localStorage.setItem('name', name);
           localStorage.setItem('role', role);
           localStorage.setItem('provider', provider);
           localStorage.setItem('isLogin', 'true');

           // ✅ axios 헤더 업데이트 (이전 토큰 제거 후 새로운 토큰 설정)
           delete axios.defaults.headers.common['Authorization'];
           axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

           console.log('OAuth2 로그인 성공:', {
             memberId,
             loginId,
             name,
             role,
             provider,
           });

           // ✅ 디버깅: role 값 확인
           console.log('받은 role 값:', role);
           console.log('role === PENDING?', role === 'PENDING');
           console.log('typeof role:', typeof role);

          // PENDING 상태면 추가 정보 입력 페이지로 이동
          if (role === 'PENDING') {
            console.log('PENDING 상태: 추가 정보 입력 페이지로 이동');
            navigate('/oauth2/complete-registration', { 
              state: { memberId, loginId, name, provider } 
            });
          } else {
            // 일반 회원이면 홈으로 이동
            console.log('로그인 완료: 홈으로 이동');
            navigate('/');
          }
        } else {
          console.error('필수 파라미터가 없습니다.');
          navigate('/login?error=필수_파라미터_부족');
        }
      } catch (err) {
        console.error('OAuth2 콜백 처리 중 오류:', err);
        navigate('/login?error=콜백_처리_오류');
      }
    };

    handleOAuth2Callback();
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <h1>로그인 중입니다...</h1>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default OAuth2Callback;

