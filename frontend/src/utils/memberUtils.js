// 회원 타입 확인 유틸
export const isMemberTypeCompany = () => {
  const memberType = localStorage.getItem("memberType");
  return memberType === "COMPANY";
};

export const isMemberTypeJobSeeker = () => {
  const memberType = localStorage.getItem("memberType");
  return memberType === "JOB_SEEKER";
};

export const getMemberType = () => {
  return localStorage.getItem("memberType");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("accessToken") || !!localStorage.getItem("authToken");
};

