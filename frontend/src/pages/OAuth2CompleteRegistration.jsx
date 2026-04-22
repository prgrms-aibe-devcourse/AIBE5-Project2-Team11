import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

/**
 * OAuth2 회원가입 완료 페이지
 * PENDING 상태의 소셜 로그인 회원이 역할과 추가 정보를 입력하는 페이지
 */
const OAuth2CompleteRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { memberId, loginId, name, provider } = location.state || {};

  const [formData, setFormData] = useState({
    role: '',
    phoneNumber: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 역할 선택 확인
    if (!formData.role) {
      setError('역할을 선택해주세요.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.post(
        'http://localhost:8080/members/complete-registration',
        {
          role: formData.role,
          phoneNumber: formData.phoneNumber || null,
          address: formData.address || null
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // 로컬 스토리지 업데이트
        localStorage.setItem('role', response.data.role);

        console.log('회원 정보 설정 완료');

        // 홈으로 이동
        navigate('/');
      } else {
        setError(response.data.message || '정보 설정에 실패했습니다.');
      }
    } catch (err) {
      console.error('정보 설정 오류:', err);
      setError(err.response?.data?.message || '정보 설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!memberId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600">오류</h1>
          <p className="text-gray-600 mt-2">유효하지 않은 요청입니다.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {provider === 'GOOGLE' ? 'Google' : 'Naver'} 회원가입 완료
          </h1>
          <p className="text-gray-600 mt-2">
            환영합니다, <span className="font-semibold">{name}</span>님!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            추가 정보를 입력하여 회원가입을 완료해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* 역할 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              가입 유형 <span className="text-red-600">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer"
                style={{
                  borderColor: formData.role === 'JOB_SEEKER' ? '#3b82f6' : '#d1d5db',
                  backgroundColor: formData.role === 'JOB_SEEKER' ? '#eff6ff' : 'white'
                }}>
                <input
                  type="radio"
                  name="role"
                  value="JOB_SEEKER"
                  checked={formData.role === 'JOB_SEEKER'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <div>
                  <p className="font-semibold text-gray-800">개인 구직자</p>
                  <p className="text-sm text-gray-600">채용 공고 지원 및 이력서 관리</p>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer"
                style={{
                  borderColor: formData.role === 'COMPANY' ? '#3b82f6' : '#d1d5db',
                  backgroundColor: formData.role === 'COMPANY' ? '#eff6ff' : 'white'
                }}>
                <input
                  type="radio"
                  name="role"
                  value="COMPANY"
                  checked={formData.role === 'COMPANY'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <div>
                  <p className="font-semibold text-gray-800">기업 담당자</p>
                  <p className="text-sm text-gray-600">채용 공고 등록 및 지원자 관리</p>
                </div>
              </label>
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              휴대폰 번호 (선택)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="010-1234-5678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 주소 */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              주소 (선택)
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="서울시 강남구 테헤란로"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? '처리 중...' : '회원가입 완료'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            돌아가기
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600">
            💡 <strong>팁:</strong> 나중에 마이페이지에서 언제든지 정보를 수정할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuth2CompleteRegistration;

