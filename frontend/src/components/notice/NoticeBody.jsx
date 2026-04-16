import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NoticeBody() {
    const notices = [
        { id: 15, category: "공지", title: "다온팀 서비스 이용약관 개정 안내", date: "2025.04.12" },
        { id: 14, category: "공지", title: "개인정보 처리방침 변경 사전 안내", date: "2025.04.12" },
        { id: 13, category: "공지", title: "시스템 점검 일정 안내 (4월 20일)", date: "2025.04.10" },
        { id: 12, category: "공지", title: "모바일 앱 v2.3.0 업데이트 안내", date: "2025.04.08" },
        { id: 11, category: "공지", title: "새 봄맞이 서비스 기능 업데이트 안내", date: "2025.04.05" },
        { id: 10, category: "공지", title: "채용 공고 필터링 기능 개선 안내", date: "2025.04.01" },
        { id: 9, category: "공지", title: "장애인 고용 우수기업 인증 배지 도입 안내", date: "2025.03.28" },
        { id: 8, category: "공지", title: "커뮤니티 이용 규칙 안내", date: "2025.03.20" },
        { id: 7, category: "공지", title: "다온 서비스 임시 로그인 오류 관련 안내", date: "2025.03.15" },
        { id: 6, category: "공지", title: "기업 회원 공고 등록 가이드 업데이트", date: "2025.03.10" },
    ];

    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const itemsPerPage = 10;

    const filteredNotices = notices.filter((notice) =>
        notice.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

    const currentNotices = filteredNotices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <section className="w-full bg-[#2C160D] text-white">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <p className="text-sm text-[#F3C76B] mb-2">🔔 Notice</p>
                    <h1 className="text-4xl font-bold mb-3">공지사항</h1>
                    <p className="text-sm text-[#E8DCCB]">
                        다온의 중요알림과 공지를 확인해보세요.
                    </p>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <p className="text-sm text-[#8B6B4A]">
                        총 <span className="font-semibold">{filteredNotices.length}</span>개의 공지사항
                    </p>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="공지사항 검색"
                            value={searchKeyword}
                            onChange={(e) => {
                                setSearchKeyword(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-64 md:w-72 px-4 py-2 text-sm rounded-lg border border-[#E6D7C8] bg-white focus:outline-none"
                        />
                        <button className="px-4 py-2 text-sm rounded-lg bg-[#3A2317] text-white">
                            검색
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-[#EADFD3] overflow-hidden shadow-sm">
                    <div className="grid grid-cols-[80px_1fr_140px] bg-[#FCF8F3] text-[#8B6B4A] text-sm font-medium px-6 py-4 border-b border-[#EFE4D8]">
                        <div>번호</div>
                        <div>제목</div>
                        <div className="text-right">작성일</div>
                    </div>

                    {currentNotices.map((notice) => (
                        <div
                            key={notice.id}
                            onClick={() => navigate(`/notice/${notice.id}`)}
                            className="grid grid-cols-[80px_1fr_140px] items-center px-6 py-4 text-sm border-b border-[#F3EAE1] hover:bg-[#FFFCF8] cursor-pointer"
                        >
                            <div className="text-[#9C866F]">{notice.id}</div>

                            <div className="flex items-center gap-3">
                <span className="px-2 py-1 text-xs rounded-md bg-[#FFF3DD] text-[#D18A1D] font-semibold">
                  {notice.category}
                </span>
                                <span className="text-[#4A3426]">{notice.title}</span>
                            </div>

                            <div className="text-right text-[#B19A84]">{notice.date}</div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-md text-sm ${
                                currentPage === page
                                    ? "bg-[#3A2317] text-white"
                                    : "text-[#8B6B4A]"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </section>
        </>
    );
}