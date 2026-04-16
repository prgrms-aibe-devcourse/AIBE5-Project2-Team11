 // 📌 게시글 데이터
// export const posts = [
//         { id: 1, category: "취업정보", title: "의무고용 기업 목록", author: "스택오버플로우중독자", date: "2026-04-01", views: 1200, likes: 87, commentsCount: 3, content: "2024년 장애인 의무고용 기업 리스트입니다. 삼성전자, LG전자 등이 포함되어 있습니다." },
//         { id: 2, category: "질문게시판", title: "사무직 가능?", author: "null포인터주의", date: "2026-04-02", views: 800, likes: 45, commentsCount: 2, content: "전산직이나 일반 사무직으로 취업하고 싶은데, 자격증 어떤 게 필요할까요?" },
//         { id: 3, category: "자유게시판", title: "서비스 후기", author: "성장하는개발자", date: "2026-03-30", views: 500, likes: 62, commentsCount: 1, content: "이번에 업데이트된 커뮤니티 기능이 정말 편리하네요. UI가 깔끔합니다." },
//         { id: 4, category: "취업정보", title: "채용 공고 공유", author: "신입탈출러", date: "2026-04-03", views: 300, likes: 15, commentsCount: 0, content: "현재 공공기관에서 체험형 인턴을 모집 중입니다. 링크 확인해보세요." },
//         { id: 5, category: "자유게시판", title: "오늘 날씨 좋다", author: "백엔드지망생", date: "2026-03-28", views: 150, likes: 10, commentsCount: 0, content: "오랜만에 산책 나왔는데 날씨가 정말 화창하네요. 다들 좋은 하루 보내세요!" },
//         { id: 6, category: "질문게시판", title: "면접 질문 뭐 나옴?", author: "김개발", date: "2026-04-04", views: 900, likes: 55, commentsCount: 2, content: "기술 면접에서 주로 어떤 걸 물어보나요? 신입 개발자 기준이 궁금합니다." },
//         { id: 7, category: "취업정보", title: "이력서 팁 공유", author: "박취준", date: "2026-04-05", views: 400, likes: 22, commentsCount: 0, content: "포트폴리오 구성할 때 프로젝트의 성과를 수치로 표현하는 것이 중요합니다." },
//         { id: 8, category: "자유게시판", title: "잡담 ㄱ", author: "합격메일기다림", date: "2026-03-27", views: 200, likes: 5, commentsCount: 0, content: "오늘 점심 메뉴 추천받습니다. 맛있는 거 먹고 싶네요." },
//         { id: 9, category: "질문게시판", title: "연봉 협상 팁?", author: "스킬업러", date: "2026-04-06", views: 1100, likes: 70, commentsCount: 0, content: "이직 시 연봉 협상할 때 이전 직장 연봉 증빙은 어떻게 하나요?" },
//         { id: 10, category: "취업정보", title: "추천 기업 리스트", author: "JOB메이커", date: "2026-04-07", views: 1300, likes: 95, commentsCount: 0, content: "복지가 좋은 강소기업 리스트를 정리했습니다. 파일 첨부 확인해주세요." },
//     ];


export const posts = [
  {
    post_id: 1,
    category: "취업정보",
    title: "의무고용 기업 목록",
    member_id: 1,
    content: "2024년 장애인 의무고용 기업 리스트입니다. 삼성전자, LG전자 등이 포함되어 있습니다.",
    views: 1200,
    is_deleted: false,
    created_at: "2026-04-01",
    updated_at: "2026-04-01"
  },
  {
    post_id: 2,
    category: "질문게시판",
    title: "사무직 가능?",
    member_id: 2,
    content: "전산직이나 일반 사무직으로 취업하고 싶은데, 자격증 어떤 게 필요할까요?",
    views: 800,
    is_deleted: false,
    created_at: "2026-04-02",
    updated_at: "2026-04-02"
  },
  {
    post_id: 3,
    category: "자유게시판",
    title: "서비스 후기",
    member_id: 3,
    content: "이번에 업데이트된 커뮤니티 기능이 정말 편리하네요. UI가 깔끔합니다.",
    views: 500,
    is_deleted: false,
    created_at: "2026-03-30",
    updated_at: "2026-03-30"
  },
  {
    post_id: 4,
    category: "취업정보",
    title: "채용 공고 공유",
    member_id: 4,
    content: "현재 공공기관에서 체험형 인턴을 모집 중입니다. 링크 확인해보세요.",
    views: 300,
    is_deleted: false,
    created_at: "2026-04-03",
    updated_at: "2026-04-03"
  },
  {
    post_id: 5,
    category: "자유게시판",
    title: "오늘 날씨 좋다",
    member_id: 5,
    content: "오랜만에 산책 나왔는데 날씨가 정말 화창하네요. 다들 좋은 하루 보내세요!",
    views: 150,
    is_deleted: false,
    created_at: "2026-03-28",
    updated_at: "2026-03-28"
  },
  {
    post_id: 6,
    category: "질문게시판",
    title: "면접 질문 뭐 나옴?",
    member_id: 6,
    content: "기술 면접에서 주로 어떤 걸 물어보나요? 신입 개발자 기준이 궁금합니다.",
    views: 900,
    is_deleted: false,
    created_at: "2026-04-04",
    updated_at: "2026-04-04"
  },
  {
    post_id: 7,
    category: "취업정보",
    title: "이력서 팁 공유",
    member_id: 7,
    content: "포트폴리오 구성할 때 프로젝트의 성과를 수치로 표현하는 것이 중요합니다.",
    views: 400,
    is_deleted: false,
    created_at: "2026-04-05",
    updated_at: "2026-04-05"
  },
  {
    post_id: 8,
    category: "자유게시판",
    title: "잡담 ㄱ",
    member_id: 8,
    content: "오늘 점심 메뉴 추천받습니다. 맛있는 거 먹고 싶네요.",
    views: 200,
    is_deleted: false,
    created_at: "2026-03-27",
    updated_at: "2026-03-27"
  },
  {
    post_id: 9,
    category: "질문게시판",
    title: "연봉 협상 팁?",
    member_id: 9,
    content: "이직 시 연봉 협상할 때 이전 직장 연봉 증빙은 어떻게 하나요?",
    views: 1100,
    is_deleted: false,
    created_at: "2026-04-06",
    updated_at: "2026-04-06"
  },
  {
    post_id: 10,
    category: "취업정보",
    title: "추천 기업 리스트",
    member_id: 10,
    content: "복지가 좋은 강소기업 리스트를 정리했습니다. 파일 첨부 확인해주세요.",
    views: 1300,
    is_deleted: false,
    created_at: "2026-04-07",
    updated_at: "2026-04-07"
  }
];