import { useParams, useNavigate } from "react-router-dom";

export default function NoticeDetailBody() {
    const { id } = useParams();
    const navigate = useNavigate();

    const notices = [
        {
            id: 15,
            title: "구직자 프로필 작성 팁 안내",
            date: "2025.03.05",
            content: `
안녕하세요, 다온팀 운영팀입니다.

AI 매칭 정확도를 높이기 위한 프로필 작성 팁을 안내드립니다.

■ 프로필 완성도 높이는 방법

1. 장애 유형 및 등급 정확히 입력
- 세부 상태가 명확해질수록 매칭 정확도 40% 향상

2. 희망 근무 조건 상세 선택
- 근무 시간대, 출퇴근 거리, 급여 범위 모두 입력

3. 보유 자격증 및 경력 빠짐없이 등록
- 관련 없어 보여도 검색 AI가 분석에 활용

4. 자기소개 200자 이상 작성
- 구체적인 강점과 희망 직무 명시

프로필 완성도가 80% 이상이면 추천 공고 수가 3배 증가합니다!

감사합니다.
다온 운영팀 드림
      `,
        },
        {
            id: 14,
            title: "기업 회원 공고 등록 가이드 업데이트",
            date: "2025.03.10",
            content: "기업 회원용 공고 등록 가이드가 업데이트되었습니다.",
        },
        {
            id: 13,
            title: "2025년 1분기 고용 지원금 제도 변경 안내",
            date: "2025.02.25",
            content: "지원금 제도 변경 내용 안내.",
        },
    ];

    const currentIndex = notices.findIndex((n) => String(n.id) === id);
    const notice = notices[currentIndex];

    const prevNotice = notices[currentIndex + 1];
    const nextNotice = notices[currentIndex - 1];

    if (!notice) {
        return <div className="p-10">공지사항이 없습니다.</div>;
    }

    return (
        <section className="max-w-4xl mx-auto px-6 py-10">
            <button
                onClick={() => navigate("/notice")}
                className="text-sm text-[#8B6B4A] mb-5"
            >
                ← 목록으로
            </button>

            <div className="bg-white rounded-2xl border border-[#EADFD3] overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-[#EFE4D8]">
                    <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 text-xs rounded-md bg-[#FFF3DD] text-[#D18A1D] font-semibold">
              공지
            </span>
                        <span className="text-sm text-[#B19A84]">{notice.date}</span>
                    </div>

                    <h1 className="text-2xl font-bold text-[#3A2317]">{notice.title}</h1>
                </div>

                <div className="px-8 py-8 whitespace-pre-line text-[#4A3426] leading-8 text-sm">
                    {notice.content}
                </div>
            </div>

            {/* 이전글 다음글 */}
            <div className="mt-6 bg-white rounded-xl border border-[#EADFD3] overflow-hidden">
                {prevNotice && (
                    <div
                        onClick={() => navigate(`/notice/${prevNotice.id}`)}
                        className="flex justify-between px-6 py-4 border-b cursor-pointer hover:bg-[#FFFCF8]"
                    >
                        <span className="text-[#8B6B4A]">← 다음글</span>
                        <span>{prevNotice.title}</span>
                        <span className="text-[#B19A84]">{prevNotice.date}</span>
                    </div>
                )}

                {nextNotice && (
                    <div
                        onClick={() => navigate(`/notice/${nextNotice.id}`)}
                        className="flex justify-between px-6 py-4 cursor-pointer hover:bg-[#FFFCF8]"
                    >
                        <span className="text-[#8B6B4A]">→ 이전글</span>
                        <span>{nextNotice.title}</span>
                        <span className="text-[#B19A84]">{nextNotice.date}</span>
                    </div>
                )}
            </div>
        </section>
    );
}