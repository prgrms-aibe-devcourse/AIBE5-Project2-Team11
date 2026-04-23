export const INDUSTRY_TYPES = [
  { id: 1, name: "서비스업" },
  { id: 2, name: "금융·은행업" },
  { id: 3, name: "IT·정보통신업" },
  { id: 4, name: "판매·유통업" },
  { id: 5, name: "제조·생산·화학업" },
  { id: 6, name: "교육업" },
  { id: 7, name: "건설업" },
  { id: 8, name: "의료·제약업" },
  { id: 9, name: "미디어·광고업" },
  { id: 10, name: "문화·예술·디자인업" },
  { id: 11, name: "기관·협회" },
];

export const INDUSTRY_NAME_BY_ID = Object.fromEntries(
  INDUSTRY_TYPES.map(({ id, name }) => [id, name])
);

export const INDUSTRY_ID_BY_NAME = Object.fromEntries(
  INDUSTRY_TYPES.map(({ id, name }) => [name, id])
);

export const DETAIL_INDUSTRY_TYPES = [
  { id: 1, industryTypeId: 1, name: "호텔·여행·항공" },
  { id: 2, industryTypeId: 1, name: "음식료·외식·프랜차이즈" },
  { id: 3, industryTypeId: 1, name: "스포츠·여가·레저" },
  { id: 4, industryTypeId: 1, name: "뷰티·미용" },
  { id: 5, industryTypeId: 1, name: "콜센터·아웃소싱·기타" },
  { id: 6, industryTypeId: 1, name: "정비·A/S·카센터" },
  { id: 7, industryTypeId: 1, name: "렌탈·임대·리스" },
  { id: 8, industryTypeId: 1, name: "서치펌·헤드헌팅" },
  { id: 9, industryTypeId: 1, name: "시설관리·보안·경비" },
  { id: 10, industryTypeId: 1, name: "웨딩·상조·이벤트" },
  { id: 11, industryTypeId: 2, name: "은행·금융" },
  { id: 12, industryTypeId: 2, name: "캐피탈·대출" },
  { id: 13, industryTypeId: 2, name: "증권·보험·카드" },
  { id: 14, industryTypeId: 3, name: "솔루션·SI·CRM·ERP" },
  { id: 15, industryTypeId: 3, name: "웹에이전시" },
  { id: 16, industryTypeId: 3, name: "쇼핑몰·오픈마켓·소셜커머스" },
  { id: 17, industryTypeId: 3, name: "포털·컨텐츠·커뮤니티" },
  { id: 18, industryTypeId: 3, name: "네트워크·통신서비스" },
  { id: 19, industryTypeId: 3, name: "정보보안" },
  { id: 20, industryTypeId: 3, name: "컴퓨터·하드웨어·장비" },
  { id: 21, industryTypeId: 3, name: "게임·애니메이션" },
  { id: 22, industryTypeId: 3, name: "모바일·APP" },
  { id: 23, industryTypeId: 3, name: "IT컨설팅" },
  { id: 24, industryTypeId: 4, name: "백화점·유통·도소매" },
  { id: 25, industryTypeId: 4, name: "무역·상사" },
  { id: 26, industryTypeId: 4, name: "물류·운송·배송" },
  { id: 27, industryTypeId: 5, name: "전기·전자·제어" },
  { id: 28, industryTypeId: 5, name: "반도체·디스플레이·광학" },
  { id: 29, industryTypeId: 5, name: "기계·기계설비" },
  { id: 30, industryTypeId: 5, name: "자동차·조선·철강·항공" },
  { id: 31, industryTypeId: 5, name: "금속·재료·자재" },
  { id: 32, industryTypeId: 5, name: "화학·에너지·환경" },
  { id: 33, industryTypeId: 5, name: "섬유·의류·패션" },
  { id: 34, industryTypeId: 5, name: "생활화학·화장품" },
  { id: 35, industryTypeId: 5, name: "생활용품·소비재·기타" },
  { id: 36, industryTypeId: 5, name: "목재·제지·가구" },
  { id: 37, industryTypeId: 5, name: "식품가공" },
  { id: 38, industryTypeId: 5, name: "농축산·어업·임업" },
  { id: 39, industryTypeId: 6, name: "학교(초·중·고·대학·특수)" },
  { id: 40, industryTypeId: 6, name: "유아·유치원·어린이집" },
  { id: 41, industryTypeId: 6, name: "학원·어학원·교육원" },
  { id: 42, industryTypeId: 6, name: "학습지·방문교육" },
  { id: 43, industryTypeId: 7, name: "건축·설비·환경" },
  { id: 44, industryTypeId: 7, name: "건설·시공·토목·조경" },
  { id: 45, industryTypeId: 7, name: "인테리어·자재" },
  { id: 46, industryTypeId: 7, name: "부동산·중개·임대" },
  { id: 47, industryTypeId: 8, name: "의료(병원분류별)" },
  { id: 48, industryTypeId: 8, name: "의료(진료과별)" },
  { id: 49, industryTypeId: 8, name: "의료(간호·원무·상담)" },
  { id: 50, industryTypeId: 8, name: "제약·보건·바이오" },
  { id: 51, industryTypeId: 8, name: "사회복지·요양" },
  { id: 52, industryTypeId: 9, name: "방송·케이블·프로덕션" },
  { id: 53, industryTypeId: 9, name: "신문·잡지·언론사" },
  { id: 54, industryTypeId: 9, name: "광고·홍보·전시" },
  { id: 55, industryTypeId: 9, name: "영화·음반·배급" },
  { id: 56, industryTypeId: 9, name: "연예·엔터테인먼트" },
  { id: 57, industryTypeId: 9, name: "출판·인쇄·사진" },
  { id: 58, industryTypeId: 10, name: "문화·공연·예술" },
  { id: 59, industryTypeId: 10, name: "디자인·CAD" },
  { id: 60, industryTypeId: 11, name: "공기업·공공기관" },
  { id: 61, industryTypeId: 11, name: "협회·단체" },
  { id: 62, industryTypeId: 11, name: "컨설팅·연구·조사" },
  { id: 63, industryTypeId: 11, name: "회계·세무·법무" },
];

export const DETAIL_INDUSTRY_BY_TYPE_ID = DETAIL_INDUSTRY_TYPES.reduce(
  (acc, detail) => {
    if (!acc[detail.industryTypeId]) {
      acc[detail.industryTypeId] = [];
    }
    acc[detail.industryTypeId].push(detail.name);
    return acc;
  },
  {}
);

export const DETAIL_INDUSTRY_OBJECTS_BY_TYPE_ID = DETAIL_INDUSTRY_TYPES.reduce(
  (acc, detail) => {
    if (!acc[detail.industryTypeId]) {
      acc[detail.industryTypeId] = [];
    }
    acc[detail.industryTypeId].push(detail);
    return acc;
  },
  {}
);

export const DETAIL_INDUSTRY_NAME_BY_ID = Object.fromEntries(
  DETAIL_INDUSTRY_TYPES.map(({ id, name }) => [id, name])
);

export const DETAIL_INDUSTRY_ID_BY_NAME = Object.fromEntries(
  DETAIL_INDUSTRY_TYPES.map(({ id, name }) => [name, id])
);

export const DETAIL_INDUSTRY_BY_TYPE_NAME = Object.fromEntries(
  INDUSTRY_TYPES.map(({ id, name }) => [name, DETAIL_INDUSTRY_BY_TYPE_ID[id] ?? []])
);

export const INDUSTRY_SELECT_OPTIONS = INDUSTRY_TYPES.map(({ id, name }) => ({
  value: id,
  label: name,
}));
