import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NoticeDetailBody() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [allNotices, setAllNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    // 모든 공지사항과 현재 공지사항 조회
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                // 현재 공지사항 조회
                const noticeResponse = await fetch(`/api/notices/${id}`);
                if (!noticeResponse.ok) {
                    throw new Error(`공지사항 조회 실패: ${noticeResponse.status}`);
                }
                const noticeData = await noticeResponse.json();
                setNotice(noticeData);

                // 모든 공지사항 조회 (이전글/다음글을 위해)
                const allResponse = await fetch("/api/notices?page=1&size=1000");
                if (!allResponse.ok) {
                    throw new Error(`공지사항 목록 조회 실패: ${allResponse.status}`);
                }
                const allData = await allResponse.json();
                setAllNotices(allData.content);
            } catch (error) {
                console.error("공지사항 조회 실패:", error);
                alert(`공지사항 조회에 실패했습니다.\n${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, [id]);

    if (loading) {
        return <div className="p-10 text-center">로딩 중...</div>;
    }

    if (!notice) {
        return <div className="p-10">공지사항이 없습니다.</div>;
    }

    // 현재 공지사항의 인덱스 찾기
    const currentIndex = allNotices.findIndex((n) => n.noticeId === notice.noticeId);
    const prevNotice = allNotices[currentIndex - 1]; // 이전글 (최신순이므로 인덱스-1)
    const nextNotice = allNotices[currentIndex + 1]; // 다음글 (최신순이므로 인덱스+1)

    const formatDate = (createdAt) => {
        return new Date(createdAt).toLocaleDateString("ko-KR").replace(/\//g, ".");
    };

    return (
        <section className="max-w-4xl mx-auto px-6 py-10">
            <button
                onClick={() => navigate("/notice")}
                className="inline-flex items-center gap-2 px-4 py-2.5 mb-6 bg-white text-sm font-medium text-[#8B6B4A] hover:text-[#5D4037] border border-[#E8D5C4] rounded-lg hover:bg-[#FFF9F3] transition-all duration-200 hover:shadow-sm group"
            >
                <i className="ri-sparkling-2-line text-base group-hover:scale-110 transition-transform duration-200"></i>
                목록으로
            </button>

            <div className="bg-white rounded-2xl border border-[#EADFD3] overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-[#EFE4D8]">
                    <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 text-xs rounded-md bg-[#FFF3DD] text-[#D18A1D] font-semibold">
              공지
            </span>
                        <span className="text-sm text-[#B19A84]">{formatDate(notice.createdAt)}</span>
                    </div>

                    <h1 className="text-2xl font-bold text-[#3A2317]">{notice.title}</h1>
                </div>

                <div className="px-8 py-8 whitespace-pre-line text-[#4A3426] leading-8 text-sm">
                    {notice.content}
                </div>
            </div>

            {/* 이전글 다음글 */}
            <div className="mt-6 bg-white rounded-xl border border-[#EADFD3] overflow-hidden">
                {nextNotice && (
                    <div
                        onClick={() => navigate(`/notice/${nextNotice.noticeId}`)}
                        className="flex justify-between px-6 py-4 border-b cursor-pointer hover:bg-[#FFFCF8]"
                    >
                        <span className="text-[#8B6B4A]">← 다음글</span>
                        <span>{nextNotice.title}</span>
                        <span className="text-[#B19A84]">{formatDate(nextNotice.createdAt)}</span>
                    </div>
                )}

                {prevNotice && (
                    <div
                        onClick={() => navigate(`/notice/${prevNotice.noticeId}`)}
                        className="flex justify-between px-6 py-4 cursor-pointer hover:bg-[#FFFCF8]"
                    >
                        <span className="text-[#8B6B4A]">→ 이전글</span>
                        <span>{prevNotice.title}</span>
                        <span className="text-[#B19A84]">{formatDate(prevNotice.createdAt)}</span>
                    </div>
                )}
            </div>
        </section>
    );
}