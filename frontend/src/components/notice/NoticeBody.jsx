import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NoticeBody() {
    const [notices, setNotices] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const itemsPerPage = 10;

    // 공지사항 조회
    const fetchNotices = async (page = 1, keyword = "") => {
        setLoading(true);
        try {
            let url = `http://localhost:8080/api/notices?page=${page}&size=${itemsPerPage}`;

            if (keyword) {
                url = `http://localhost:8080/api/notices/search?keyword=${keyword}&page=${page}&size=${itemsPerPage}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            const formattedNotices = data.content.map((notice) => ({
                id: notice.noticeId,
                category: "공지",
                title: notice.title,
                date: new Date(notice.createdAt).toLocaleDateString("ko-KR").replace(/\//g, "."),
            }));

            setNotices(formattedNotices);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error("공지사항 조회 실패:", error);
            alert(`공지사항 조회에 실패했습니다.\n상태: ${error.message}`);
            setNotices([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 공지사항 조회
    useEffect(() => {
        fetchNotices(1, "");
        setCurrentPage(1);
    }, []);

    // 검색 기능
    const handleSearch = () => {
        fetchNotices(1, searchKeyword);
    };

    // 페이지 변경
    const handlePageChange = (page) => {
        fetchNotices(page, searchKeyword);
    };

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

            {loading ? (
                <section className="max-w-5xl mx-auto px-6 py-10 text-center">
                    <p>로딩 중...</p>
                </section>
            ) : (
            <section className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <p className="text-sm text-[#8B6B4A]">
                        총 <span className="font-semibold">{notices.length}</span>개의 공지사항
                    </p>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="공지사항 검색"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            className="w-64 md:w-72 px-4 py-2 text-sm rounded-lg border border-[#E6D7C8] bg-white focus:outline-none"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 text-sm rounded-lg bg-[#3A2317] text-white">
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

                    {notices.map((notice) => (
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
                            onClick={() => handlePageChange(page)}
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
            )}
        </>
    );
}