// JWT를 이용한 API 요청 가이드

// 1. 로그인 후 토큰 저장
async function login(loginId, password) {
  const response = await fetch('http://localhost:8080/members/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      loginId,
      password,
    }),
  });

  const data = await response.json();

  if (data.success) {
    // 토큰을 로컬스토리지에 저장
    localStorage.setItem('accessToken', data.token);
    console.log('로그인 성공:', data);
    return data;
  } else {
    console.error('로그인 실패:', data.message);
    throw new Error(data.message);
  }
}

// 2. 현재 사용자 정보 조회 (/member/me)
async function getCurrentUser() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('토큰이 없습니다. 로그인해주세요.');
    return null;
  }

  try {
    const response = await fetch('http://localhost:8080/members/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success) {
      console.log('사용자 정보:', data);
      return data;
    } else {
      console.error('사용자 정보 조회 실패:', data.message);
      // 토큰이 만료된 경우 로컬스토리지에서 제거
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
      }
      return null;
    }
  } catch (error) {
    console.error('오류 발생:', error);
    return null;
  }
}

// 3. 토큰과 함께 다른 API 요청 예시
async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('토큰이 없습니다. 로그인해주세요.');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // 토큰이 만료된 경우
    localStorage.removeItem('accessToken');
    throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
  }

  return response.json();
}

// 4. 사용 예시

// 로그인
try {
  const loginData = await login('user123', 'password123');
  console.log('로그인한 사용자:', loginData.name);
} catch (error) {
  console.error('로그인 오류:', error);
}

// 현재 사용자 정보 조회
const userInfo = await getCurrentUser();
if (userInfo) {
  console.log('사용자 이름:', userInfo.name);
  console.log('사용자 이메일:', userInfo.email);
  console.log('사용자 역할:', userInfo.role);
}

// 토큰과 함께 다른 API 요청
try {
  const jobData = await fetchWithToken('http://localhost:8080/api/jobs', {
    method: 'GET',
  });
  console.log('채용공고:', jobData);
} catch (error) {
  console.error('채용공고 조회 오류:', error);
}

// 로그아웃
function logout() {
  localStorage.removeItem('accessToken');
  console.log('로그아웃 완료');
}

