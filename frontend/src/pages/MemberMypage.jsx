import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Header from "../components/Header";
import MemberSidebar from "../components/membermypage/MemberSidebar";
import MemberMypageBody from "../components/membermypage/MemberMypageBody";
import defaultUserPhoto from "../assets/images/resume/defalut_userPhoto.jpeg";

async function extractErrorMessage(response, fallbackMessage) {
    try {
        const errorBody = await response.json();
        return (
            errorBody?.message ||
            errorBody?.detail ||
            errorBody?.error ||
            fallbackMessage
        );
    } catch {
        return fallbackMessage;
    }
}

function getAccessToken() {
    return localStorage.getItem("authToken") || localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
}

const JOB_API_BASE = "http://localhost:8080";
const RESUME_API_BASE = "http://localhost:8080";

// 이력서 관리 섹션 - ResumeList 페이지로 이동하는 런처패드
function ResumeSection() {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(() => {
        // localStorage에서 페이지 상태 복원
        const savedPage = localStorage.getItem('memberMypage_resumePage');
        return savedPage ? parseInt(savedPage, 10) : 0;
    });
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                setLoading(true);
                const token = getAccessToken();
                if (!token) {
                    setError("로그인이 필요합니다.");
                    return;
                }

                const params = new URLSearchParams({ page: String(page), size: "5" });
                const url = `/resumes?${params.toString()}`;
                console.log("이력서 목록 요청:", url, "Token:", token ? "있음" : "없음");
                
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("응답 상태:", response.status, "Content-Type:", response.headers.get("content-type"));
                
                if (!response.ok) {
                    const serverMessage = await extractErrorMessage(
                        response,
                        "이력서 목록을 불러오는데 실패했습니다."
                    );
                    throw new Error(serverMessage);
                }

                const data = await response.json();
                setResumes(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
            } catch (err) {
                console.error('이력서 목록을 불러오는데 실패했습니다:', err);
                setError(err.message || '이력서 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchResumes();
    }, [page]);

    // 컴포넌트 마운트 후 localStorage 정리
    useEffect(() => {
        localStorage.removeItem('memberMypage_resumePage');
    }, []);

    const handleSetAsMainResume = async (resumeId) => {
        try {
            const token = getAccessToken();
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            const response = await fetch(`/resumes/${resumeId}/public`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const serverMessage = await extractErrorMessage(
                    response,
                    "대표 이력서 설정에 실패했습니다."
                );
                throw new Error(serverMessage);
            }

            // 성공 시 이력서 관리 탭의 첫 페이지로 이동
            localStorage.setItem('memberMypage_activeMenu', 'resume');
            localStorage.setItem('memberMypage_resumePage', '0');
            window.location.reload();
        } catch (err) {
            console.error('대표 이력서 설정 실패:', err);
            alert(err.message || '대표 이력서 설정에 실패했습니다.');
        }
    };

    const handleDeleteResume = async (resumeId) => {
        const isConfirmed = window.confirm('이력서를 삭제하시겠습니까?');
        if (!isConfirmed) return;

        try {
            const token = getAccessToken();
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            const response = await fetch(`/resumes/${resumeId}/status`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const serverMessage = await extractErrorMessage(
                    response,
                    "이력서 삭제에 실패했습니다."
                );
                throw new Error(serverMessage);
            }

            setResumes((prev) => prev.filter((resume) => resume.resumeId !== resumeId));
            setTotalElements((prev) => Math.max(0, prev - 1));
            alert('이력서가 삭제되었습니다.');
            // 성공 시 이력서 관리 탭의 첫 페이지로 이동
            setLoading(true);
            localStorage.setItem('memberMypage_activeMenu', 'resume');
            localStorage.setItem('memberMypage_resumePage', '0');
            window.location.reload();
        } catch (err) {
            console.error('이력서 삭제 실패:', err);
            alert(err.message || '이력서 삭제에 실패했습니다.');
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#3C2A21]">이력서 관리</h3>
                    <button
                        onClick={() => navigate("/memberMypage/resumes/new")}
                        className="text-sm bg-yellow-500 hover:opacity-90 text-white font-semibold px-4 py-2 rounded-lg transition-opacity flex items-center gap-1.5"
                    >
                        <i className="ri-add-line"></i> 새 이력서
                    </button>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-500">이력서를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#3C2A21]">이력서 관리</h3>
                    <button
                        onClick={() => navigate("/memberMypage/resumes/new")}
                        className="text-sm bg-yellow-500 hover:opacity-90 text-white font-semibold px-4 py-2 rounded-lg transition-opacity flex items-center gap-1.5"
                    >
                        <i className="ri-add-line"></i> 새 이력서
                    </button>
                </div>
                <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#3C2A21]">이력서 관리</h3>
                <button
                    onClick={() => navigate("/memberMypage/resumes/new")}
                    className="text-sm bg-yellow-500 hover:opacity-90 text-white font-semibold px-4 py-2 rounded-lg transition-opacity flex items-center gap-1.5"
                >
                    <i className="ri-add-line"></i> 새 이력서
                </button>
            </div>

            {resumes.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <i className="ri-file-list-line text-5xl block mb-3 text-gray-300"></i>
                    <p className="font-medium">등록된 이력서가 없습니다.</p>
                    <p className="text-sm mt-1">새 이력서를 작성해보세요!</p>
                    <button
                        onClick={() => navigate("/memberMypage/resumes/new")}
                        className="mt-4 text-sm bg-yellow-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
                    >
                        새 이력서 작성
                    </button>
                </div>
            ) : (
                resumes.map((resume) => (
                    <div
                        key={resume.resumeId}
                        className="bg-white border border-[#E8DCCB] rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-[#5D4037] text-base">{resume.title}</h4>
                            <button
                                onClick={() => handleSetAsMainResume(resume.resumeId)}
                                className="text-xl text-yellow-500 hover:scale-110 transition-transform"
                                title={resume.isPublic ? '대표 이력서' : '일반 이력서'}
                            >
                                {resume.isPublic ? (
                                    <i className="ri-pushpin-fill"></i>
                                ) : (
                                    <i className="ri-pushpin-line"></i>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">최종 수정일: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {resume.skills.map((skill) => (
                                <span
                                    key={skill.skillKeyword}
                                    className="text-xs bg-[#FFF8F0] text-[#8D6E63] border border-[#F3E8D0] px-2 py-0.5 rounded-full"
                                >
                                    {skill.skillKeyword}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/memberMypage/resumes/${resume.resumeId}`)}
                                className="flex-1 text-sm text-[#8D6E63] border border-[#D7B89C] rounded-lg py-2 hover:bg-[#FFF3E0] transition-colors font-medium"
                            >
                                상세보기
                            </button>
                            <button
                                onClick={() => navigate(`/memberMypage/resumes/${resume.resumeId}/edit`)}
                                className="flex-1 text-sm text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors font-medium"
                            >
                                수정
                            </button>
                            <button
                                onClick={() => handleDeleteResume(resume.resumeId)}
                                className="flex-1 text-sm text-red-600 border border-red-200 rounded-lg py-2 hover:bg-red-50 transition-colors font-medium"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* 페이지네이션 */}
            {resumes.length > 0 && totalPages > 1 && (() => {
                const maxPagesPerGroup = 5;
                const currentGroup = Math.floor(page / maxPagesPerGroup);
                const startPage = currentGroup * maxPagesPerGroup;
                const endPage = Math.min(startPage + maxPagesPerGroup, totalPages);

                return (
                    <div className="flex items-center justify-center gap-1 mt-6 pt-4 border-t border-[#E8DCCB]">
                        {/* 이전 버튼 */}
                        <button
                            onClick={() => setPage(Math.max(0, startPage - 1))}
                            disabled={page === startPage}
                            className="px-3 py-2 border border-[#D7B89C] rounded-lg text-sm text-[#8D6E63] cursor-pointer hover:bg-[#FFF3E0] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="ri-arrow-left-s-line"></i>
                        </button>

                        {/* 페이지 번호 버튼들 */}
                        {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    page === pageNum
                                        ? 'bg-yellow-500 text-white border border-yellow-500'
                                        : 'border border-[#D7B89C] text-[#8D6E63] hover:bg-[#FFF3E0]'
                                }`}
                            >
                                {pageNum + 1}
                            </button>
                        ))}

                        {/* 다음 버튼 */}
                        <button
                            onClick={() => setPage(endPage)}
                            disabled={endPage === totalPages}
                            className="px-3 py-2 border border-[#D7B89C] rounded-lg text-sm text-[#8D6E63] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF3E0] transition-colors font-medium"
                        >
                            <i className="ri-arrow-right-s-line"></i>
                        </button>
                    </div>
                );
            })()}
        </div>
    );
}

// 스크랩 목록 섹션
function ScrapSection() {
    const navigate = useNavigate();
    const [scraps, setScraps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const { default: api } = await import("../api/axios");
                const response = await api.get('/api/bookmarks');
                if (response.data && response.data.content) {
                    setScraps(response.data.content);
                }
            } catch (error) {
                console.error("북마크 목록을 불러오는데 실패했습니다.", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarks();
    }, []);

    const removeBookmark = async (id) => {
        try {
            const { default: api } = await import("../api/axios");
            await api.post(`/api/bookmarks/${id}`);
            // 서버 응답과 상관없이 스크랩 해제 되었을 것이므로 화면에서 즉시 제거
            setScraps(scraps.filter(scrap => scrap.jobPostingId !== id));
        } catch (error) {
            console.error("북마크 취소 실패:", error);
            alert("북마크 취소에 실패했습니다.");
        }
    };

    if (loading) return <div className="py-10 text-center">불러오는 중...</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#3C2A21]">스크랩 목록</h3>
                <span className="text-sm text-gray-400">{scraps.length}개</span>
            </div>

            {scraps.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <i className="ri-star-line text-5xl block mb-3 text-gray-300"></i>
                    <p className="font-medium">스크랩한 채용공고가 없습니다.</p>
                    <p className="text-sm mt-1">채용공고를 찾아보세요!</p>
                    <button
                        onClick={() => navigate("/jobs")}
                        className="mt-4 text-sm bg-[#E66235] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
                    >
                        채용공고 바로가기
                    </button>
                </div>
            ) : (
                scraps.map((scrap) => (
                    <div
                        key={scrap.jobPostingId}
                        className="bg-white border border-[#E8DCCB] rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-[#8D6E63] font-medium mb-1">{scrap.companyName}</p>
                                <h4 className="font-bold text-[#5D4037] text-sm leading-snug">{scrap.title}</h4>
                                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                                    <span>마감: {scrap.applicationEndDate || '상시'}</span>
                                    <span>작성일: {new Date(scrap.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button onClick={() => removeBookmark(scrap.jobPostingId)} className="text-yellow-500 hover:text-yellow-600 text-xl ml-3">
                                <i className="ri-star-fill"></i>
                            </button>
                        </div>
                        <button
                            onClick={() => navigate(`/jobs/${scrap.jobPostingId}`)}
                            className="mt-3 w-full text-sm text-[#8D6E63] border border-[#D7B89C] rounded-lg py-2 hover:bg-[#FFF3E0] transition-colors font-medium"
                        >
                            공고 확인
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

const APPLICATION_STATUS_LABELS = {
    SUBMITTED: "검토중",
    DOCUMENT_PASSED: "서류 합격",
    DOCUMENT_FAILED: "서류 불합격",
    INTERVIEW_PASSED: "면접 합격",
    INTERVIEW_FAILED: "면접 불합격",
    FINAL_ACCEPTED: "최종 합격",
    FINAL_REJECTED: "최종 불합격",
};

const APPLICATION_STATUS_BADGE_CLASSES = {
    SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
    DOCUMENT_PASSED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    DOCUMENT_FAILED: "bg-rose-50 text-rose-700 border-rose-200",
    INTERVIEW_PASSED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INTERVIEW_FAILED: "bg-rose-50 text-rose-700 border-rose-200",
    FINAL_ACCEPTED: "bg-green-50 text-green-700 border-green-200",
    FINAL_REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const APPLICATION_STATUS_OPTIONS = [
    { value: "", label: "전체 상태" },
    { value: "SUBMITTED", label: "검토중" },
    { value: "DOCUMENT_PASSED", label: "서류 합격" },
    { value: "DOCUMENT_FAILED", label: "서류 불합격" },
    { value: "INTERVIEW_PASSED", label: "면접 합격" },
    { value: "INTERVIEW_FAILED", label: "면접 불합격" },
    { value: "FINAL_ACCEPTED", label: "최종 합격" },
    { value: "FINAL_REJECTED", label: "최종 불합격" },
];

function formatAppliedAt(appliedAt) {
    if (!appliedAt) return "-";
    try {
        const date = new Date(appliedAt);
        if (Number.isNaN(date.getTime())) return appliedAt;
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return appliedAt;
    }
}

function formatSalary(salary, salaryType) {
    if (salary === null || salary === undefined) return "-";
    return `${Number(salary).toLocaleString()}${salaryType ? ` ${salaryType}` : ""}`;
}

function formatSalaryAmount(salary) {
    if (salary === null || salary === undefined) return "-";
    return Number(salary).toLocaleString();
}

function FieldItem({ label, value, className = "", valueClassName = "" }) {
    return (
        <div className={className}>
            <p className="text-xs font-semibold text-[#111111] mb-1">{label}</p>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className={`text-sm font-medium text-[#3C2A21] break-words ${valueClassName}`}>{value || "-"}</p>
            </div>
        </div>
    );
}

function ApplicationDetailModal({ isOpen, onClose, detail, isLoading, error, onCancel, isCancelling }) {
    if (!isOpen) return null;

    const statusLabel =
        APPLICATION_STATUS_LABELS[detail?.status] || detail?.status || "상태 확인 필요";
    const badgeClass =
        APPLICATION_STATUS_BADGE_CLASSES[detail?.status] || "bg-gray-50 text-gray-700 border-gray-200";
    const jobPosting = detail?.jobPosting || {};
    const resume = detail?.resume || {};
    const profileImageUrl = resume?.userPhoto
        ? `${RESUME_API_BASE}${resume.userPhoto}`
        : defaultUserPhoto;
    const disabilities = Array.isArray(resume?.resumeDisabilities) ? resume.resumeDisabilities : [];
    const careers = Array.isArray(resume?.careers) ? resume.careers : [];
    const educations = Array.isArray(resume?.educations) ? resume.educations : [];
    const skills = Array.isArray(resume?.skills) ? resume.skills : [];
    const certificates = Array.isArray(resume?.certificates) ? resume.certificates : [];
    const langQualifications = Array.isArray(resume?.langQualifications) ? resume.langQualifications : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#3C2A21]">지원 상세 정보</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="모달 닫기">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                {isLoading ? (
                    <div className="py-14 text-center text-gray-500">상세 정보를 불러오는 중...</div>
                ) : error ? (
                    <div className="py-14 text-center text-red-500">{error}</div>
                ) : (
                    <div className="p-5 space-y-5">
                        <div className="bg-[#FFF9F3] rounded-xl p-4 border border-[#F3E8D0]">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-[#8D6E63] mb-1">{jobPosting.companyName || "-"}</p>
                                    <p className="text-base font-bold text-[#5D4037]">{jobPosting.title || "-"}</p>
                                </div>
                                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}>
                                    {statusLabel}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">지원일: {formatAppliedAt(detail?.appliedAt)}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-[#3C2A21] mb-2">공고 정보</h4>
                            <div className="rounded-xl border border-[#E8DCCB] p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FieldItem label="직무 분류" value={jobPosting.mainCategory} />
                                <FieldItem label="세부 분류" value={jobPosting.subCategory} />
                                <FieldItem label="고용 형태" value={jobPosting.employmentType} />
                                <FieldItem
                                    label="지원 기간"
                                    value={`${jobPosting.applicationStartDate || "-"} ~ ${jobPosting.applicationEndDate || "-"}`}
                                />
                                <div>
                                    <p className="text-xs font-semibold text-[#111111] mb-1">급여</p>
                                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                        <p className="text-sm font-medium text-[#3C2A21] break-words">
                                            금액: {formatSalaryAmount(jobPosting.salary)} / 유형: {jobPosting.salaryType || "-"}
                                        </p>
                                    </div>
                                </div>
                                <FieldItem label="근무 지역" value={jobPosting.workRegion} />
                                <FieldItem label="자격 요건" value={jobPosting.qualification} className="sm:col-span-2" />
                            </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-[#3C2A21] mb-2">지원 이력서 정보</h4>
                            <div className="rounded-xl border border-[#E8DCCB] p-4">
                                <div className="flex gap-4 mb-4">
                                    <img
                                        src={profileImageUrl}
                                        alt="이력서 프로필"
                                        className="w-20 h-20 rounded-full object-cover border border-gray-200"
                                        onError={(e) => {
                                            e.currentTarget.src = defaultUserPhoto;
                                        }}
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                                        <FieldItem label="이름" value={resume.name} />
                                        <FieldItem label="생년월일" value={resume.birthDate} />
                                        <FieldItem label="연락처" value={resume.phoneNumber} />
                                        <FieldItem label="이메일" value={resume.email} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-100 pt-3">
                                    <FieldItem label="주소" value={resume.address} className="sm:col-span-2" />
                                    <FieldItem
                                        label="자기소개"
                                        value={resume.selfIntroduction}
                                        className="sm:col-span-2"
                                        valueClassName="whitespace-pre-line leading-relaxed"
                                    />
                                    {resume.portfolioUrl ? (
                                        <div className="sm:col-span-2">
                                            <p className="text-xs font-semibold text-[#111111] mb-1">포트폴리오</p>
                                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                                <a
                                                    href={resume.portfolioUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm font-medium text-blue-600 hover:underline break-all"
                                                >
                                                    {resume.portfolioUrl}
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <FieldItem label="포트폴리오" value="-" className="sm:col-span-2" />
                                    )}
                                </div>

                                {disabilities.length > 0 && (
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <p className="text-xs font-bold text-[#111111] mb-2">장애 정보</p>
                                        <div className="space-y-1.5 text-sm">
                                            {disabilities.map((item, idx) => (
                                                <p key={`${item.disabilityName}-${idx}`} className="text-[#5D4037]">
                                                    <span className="font-medium">{item.disabilityName || "-"}</span>
                                                    {item.description ? <span className="ml-1">({item.description})</span> : null}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {careers.length > 0 && (
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <p className="text-xs font-bold text-[#111111] mb-2">경력 사항</p>
                                        <div className="space-y-2 text-sm">
                                            {careers.map((career, idx) => (
                                                <div key={`${career.companyName || "career"}-${idx}`} className="py-1">
                                                    <p className="text-[#5D4037] font-medium">{career.companyName || "-"}</p>
                                                    <p className="text-[#5D4037]">{career.position || "-"}</p>
                                                    <p className="text-gray-500">{career.startDate || "-"} ~ {career.endDate || "-"}</p>
                                                    {career.content ? <p className="text-gray-600 mt-1 whitespace-pre-line">{career.content}</p> : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {educations.length > 0 && (
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <p className="text-xs font-bold text-[#111111] mb-2">학력 사항</p>
                                        <div className="space-y-1.5 text-sm">
                                            {educations.map((education, idx) => (
                                                <p key={`${education.schoolName || "education"}-${idx}`} className="text-[#5D4037]">
                                                    <span className="font-medium">{education.schoolName || "-"}</span>
                                                    <span className="ml-1">{education.major || "-"}</span>
                                                    <span className="ml-1">({education.degree || "-"})</span>
                                                    <span className="ml-1 text-gray-500">{education.startDate || "-"} ~ {education.endDate || "-"}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {skills.length > 0 && (
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <p className="text-xs font-bold text-[#111111] mb-2">보유 스킬</p>
                                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                                            {skills.map((skill, idx) => (
                                                <span
                                                    key={`${skill.skillKeyword || skill}-${idx}`}
                                                    className="text-xs bg-[#FFF8F0] text-[#8D6E63] border border-[#F3E8D0] px-2 py-0.5 rounded-full"
                                                >
                                                    {skill.skillKeyword || skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {certificates.length > 0 && (
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <p className="text-xs font-bold text-[#111111] mb-2">자격증</p>
                                        <div className="space-y-1 text-sm">
                                            {certificates.map((certificate, idx) => (
                                                <p key={`${certificate.certificateName || "certificate"}-${idx}`} className="text-[#5D4037]">
                                                    <span className="font-medium">{certificate.certificateName || "-"}</span>
                                                    <span className="ml-1 text-gray-500">{certificate.acquiredDate || "-"}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {langQualifications.length > 0 && (
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <p className="text-xs font-bold text-[#111111] mb-2">어학 자격</p>
                                        <div className="space-y-1 text-sm">
                                            {langQualifications.map((language, idx) => (
                                                <p key={`${language.languageName || "lang"}-${idx}`} className="text-[#5D4037]">
                                                    <span className="font-medium">{language.languageName || "-"}</span>
                                                    <span className="ml-1">{language.testName || "-"}</span>
                                                    <span className="ml-1">점수: {language.score || "-"}</span>
                                                    <span className="ml-1 text-gray-500">{language.acquiredDate || "-"} ~ {language.expirationDate || "-"}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {detail?.status === "SUBMITTED" && (
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={onCancel}
                                    disabled={isCancelling}
                                    className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCancelling ? "취소 처리중..." : "지원 취소하기"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ApplicationStatusSection() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedApplicationDetail, setSelectedApplicationDetail] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = getAccessToken();
                if (!token) {
                    setError("로그인이 필요합니다.");
                    return;
                }

                const params = new URLSearchParams({
                    page: String(page),
                    size: "5",
                });
                if (selectedStatus) {
                    params.append("status", selectedStatus);
                }
                const response = await fetch(`${JOB_API_BASE}/jobs/application?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const serverMessage = await extractErrorMessage(
                        response,
                        "지원 현황을 불러오는데 실패했습니다."
                    );
                    throw new Error(serverMessage);
                }

                const data = await response.json();
                setApplications(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
            } catch (err) {
                console.error("지원 현황 조회 실패:", err);
                setError(err.message || "지원 현황을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [page, selectedStatus]);

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setPage(0);
    };

    const handleOpenDetail = async (application) => {
        const applicationId = application?.applicationId ?? application?.id;
        if (!applicationId) {
            alert("지원 상세 정보를 확인할 수 없습니다. applicationId가 없습니다.");
            return;
        }

        const token = getAccessToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        setIsDetailModalOpen(true);
        setIsDetailLoading(true);
        setDetailError(null);
        setSelectedApplicationDetail(null);

        try {
            const response = await fetch(`${JOB_API_BASE}/jobs/application/${applicationId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const serverMessage = await extractErrorMessage(
                    response,
                    "지원 상세 정보를 불러오는데 실패했습니다."
                );
                throw new Error(serverMessage);
            }

            const data = await response.json();
            setSelectedApplicationDetail(data);
        } catch (err) {
            console.error("지원 상세 조회 실패:", err);
            setDetailError(err.message || "지원 상세 정보를 불러오는데 실패했습니다.");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedApplicationDetail(null);
        setDetailError(null);
    };

    const handleCancelApplication = async (applicationId) => {
        if (!applicationId) {
            alert("지원 취소에 필요한 applicationId가 없습니다.");
            return;
        }
        const isConfirmed = window.confirm("정말 지원을 취소하시겠습니까?");
        if (!isConfirmed) return;

        const token = getAccessToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        setIsCancelling(true);
        try {
            const response = await fetch(`${JOB_API_BASE}/jobs/application/${applicationId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const serverMessage = await extractErrorMessage(
                    response,
                    "지원 취소에 실패했습니다."
                );
                throw new Error(serverMessage);
            }

            setApplications((prev) =>
                prev.filter((item) => (item?.applicationId ?? item?.id) !== applicationId)
            );
            setTotalElements((prev) => Math.max(0, prev - 1));

            if ((selectedApplicationDetail?.applicationId ?? selectedApplicationDetail?.id) === applicationId) {
                handleCloseDetailModal();
            }

            alert("지원이 취소되었습니다.");
            localStorage.setItem("memberMypage_activeMenu", "application");
            window.location.href = "/memberMypage";
        } catch (err) {
            console.error("지원 취소 실패:", err);
            alert(err.message || "지원 취소에 실패했습니다.");
        } finally {
            setIsCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#3C2A21]">지원 현황</h3>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-500">지원 현황을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#3C2A21]">지원 현황</h3>
                </div>
                <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#3C2A21]">지원 현황</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{totalElements}건</span>
                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="text-sm border border-[#D7B89C] rounded-lg px-3 py-1.5 bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#E8DCCB]"
                    >
                        {APPLICATION_STATUS_OPTIONS.map((option) => (
                            <option key={option.value || "all"} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <i className="ri-briefcase-line text-5xl block mb-3 text-gray-300"></i>
                    <p className="font-medium">지원한 공고가 없습니다.</p>
                    <p className="text-sm mt-1">관심 있는 채용공고에 지원해보세요.</p>
                </div>
            ) : (
                applications.map((application, index) => {
                    const statusLabel =
                        APPLICATION_STATUS_LABELS[application.status] || application.status || "상태 확인 필요";
                    const badgeClass =
                        APPLICATION_STATUS_BADGE_CLASSES[application.status] ||
                        "bg-gray-50 text-gray-700 border-gray-200";
                    const isSubmitted = application.status === "SUBMITTED";

                    return (
                        <div
                            key={`${application.companyName}-${application.jobTitle}-${application.appliedAt}-${index}`}
                            className="bg-white border border-[#E8DCCB] rounded-xl p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-xs text-[#8D6E63] font-medium mb-1">{application.companyName || "-"}</p>
                                    <h4 className="font-bold text-[#5D4037] text-sm leading-snug">{application.jobTitle || "-"}</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {application.jobCategory && (
                                            <span className="text-xs bg-[#FFF8F0] text-[#8D6E63] border border-[#F3E8D0] px-2 py-0.5 rounded-full">
                                                {application.jobCategory}
                                            </span>
                                        )}
                                        {application.jobSubCategory && (
                                            <span className="text-xs bg-[#FFF8F0] text-[#8D6E63] border border-[#F3E8D0] px-2 py-0.5 rounded-full">
                                                {application.jobSubCategory}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3">지원일: {formatAppliedAt(application.appliedAt)}</p>
                                </div>
                                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}>
                                    {statusLabel}
                                </span>
                            </div>
                            <div className={`mt-3 grid gap-2 ${isSubmitted ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                                <button
                                    onClick={() => handleOpenDetail(application)}
                                    className="w-full text-sm text-[#8D6E63] border border-[#D7B89C] rounded-lg py-2 hover:bg-[#FFF3E0] transition-colors font-medium"
                                >
                                    지원 상세 보기
                                </button>
                                {isSubmitted && (
                                    <button
                                        onClick={() => handleCancelApplication(application?.applicationId ?? application?.id)}
                                        disabled={isCancelling}
                                        className="w-full text-sm text-red-600 border border-red-200 rounded-lg py-2 hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        지원 취소하기
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })
            )}

            {applications.length > 0 && totalPages > 1 && (() => {
                const maxPagesPerGroup = 5;
                const currentGroup = Math.floor(page / maxPagesPerGroup);
                const startPage = currentGroup * maxPagesPerGroup;
                const endPage = Math.min(startPage + maxPagesPerGroup, totalPages);

                return (
                    <div className="flex items-center justify-center gap-1 mt-6 pt-4 border-t border-[#E8DCCB]">
                        <button
                            onClick={() => setPage(Math.max(0, startPage - 1))}
                            disabled={page === startPage}
                            className="px-3 py-2 border border-[#D7B89C] rounded-lg text-sm text-[#8D6E63] cursor-pointer hover:bg-[#FFF3E0] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="ri-arrow-left-s-line"></i>
                        </button>

                        {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    page === pageNum
                                        ? "bg-yellow-500 text-white border border-yellow-500"
                                        : "border border-[#D7B89C] text-[#8D6E63] hover:bg-[#FFF3E0]"
                                }`}
                            >
                                {pageNum + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(endPage)}
                            disabled={endPage === totalPages}
                            className="px-3 py-2 border border-[#D7B89C] rounded-lg text-sm text-[#8D6E63] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF3E0] transition-colors font-medium"
                        >
                            <i className="ri-arrow-right-s-line"></i>
                        </button>
                    </div>
                );
            })()}

            <ApplicationDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                detail={selectedApplicationDetail}
                isLoading={isDetailLoading}
                error={detailError}
                onCancel={() =>
                    handleCancelApplication(
                        selectedApplicationDetail?.applicationId ?? selectedApplicationDetail?.id
                    )
                }
                isCancelling={isCancelling}
            />
        </div>
    );
}

// 현재 경로에 따라 활성 메뉴를 판별하는 헬퍼
export default function MemberMypage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 중첩 라우트가 활성화된 경우(이력서 상세/수정/작성 등)에는 Outlet으로 렌더링
    const isNestedRoute =
        location.pathname !== "/memberMypage" &&
        location.pathname !== "/memberMypage/";

    // 중첩 라우트가 아닐 때만 탭 상태 관리
    const [activeMenu, setActiveMenu] = useState(() => {
        // localStorage에서 탭 상태 복원
        return localStorage.getItem('memberMypage_activeMenu') || "profile";
    });

    // 컴포넌트 마운트 후 localStorage 정리
    useEffect(() => {
        localStorage.removeItem('memberMypage_activeMenu');
        localStorage.removeItem('memberMypage_resumePage');
    }, []);

    const handleChangeMenu = (menu) => {
        setActiveMenu(menu);
        // resume 메뉴 클릭 시 중첩 라우트 대신 인라인 섹션으로 처리
        navigate("/memberMypage");
    };

    const renderBody = () => {
        switch (activeMenu) {
            case "resume":
                return <ResumeSection />;
            case "scrap":
                return <ScrapSection />;
            case "application":
                return <ApplicationStatusSection />;
            case "profile":
            default:
                return <MemberMypageBody />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            <Header />

            <main className="flex-grow">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row gap-8">
                        <MemberSidebar
                            activeMenu={isNestedRoute ? useActiveMenuFromPath(location.pathname) : activeMenu}
                            onChangeMenu={handleChangeMenu}
                        />

                        <section className="flex-1">
                            {isNestedRoute ? <Outlet /> : renderBody()}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

// 경로 기반 활성 메뉴 판별 (hooks 규칙 우회용 일반 함수)
function useActiveMenuFromPath(pathname) {
    if (pathname.includes("/memberMypage/resumes")) return "resume";
    if (pathname.includes("/memberMypage/scrap")) return "scrap";
    if (pathname.includes("/memberMypage/application")) return "application";
    return "profile";
}
