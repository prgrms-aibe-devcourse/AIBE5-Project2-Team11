import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Header from "../components/Header";
import MemberSidebar from "../components/membermypage/MemberSidebar";
import MemberMypageBody from "../components/membermypage/MemberMypageBody";

// 이력서 관리 섹션 - ResumeList 페이지로 이동하는 런처패드
function ResumeSection() {
    const navigate = useNavigate();

    const resumes = [
        {
            id: 1,
            title: "프론트엔드 개발자 이력서",
            updatedAt: "2025-03-10",
            isDefault: false,
            skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git"],
        },
        {
            id: 2,
            title: "경력기술서 (간소화)",
            updatedAt: "2025-02-20",
            isDefault: true,
            skills: ["React", "JavaScript", "HTML/CSS"],
        },
    ];

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

            {resumes.map((resume) => (
                <div
                    key={resume.id}
                    className="bg-white border border-[#E8DCCB] rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-[#5D4037] text-base">{resume.title}</h4>
                        {resume.isDefault && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">
                기본 이력서
              </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mb-3">최종 수정일: {resume.updatedAt}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {resume.skills.map((s) => (
                            <span
                                key={s}
                                className="text-xs bg-[#FFF8F0] text-[#8D6E63] border border-[#F3E8D0] px-2 py-0.5 rounded-full"
                            >
                {s}
              </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/memberMypage/resumes/${resume.id}`)}
                            className="flex-1 text-sm text-[#8D6E63] border border-[#D7B89C] rounded-lg py-2 hover:bg-[#FFF3E0] transition-colors font-medium"
                        >
                            미리보기
                        </button>
                        <button
                            onClick={() => navigate(`/memberMypage/resumes/${resume.id}/edit`)}
                            className="flex-1 text-sm text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors font-medium"
                        >
                            수정
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={() => navigate("/memberMypage/resumes")}
                className="w-full text-sm text-[#8D6E63] border border-[#D7B89C] rounded-xl py-3 hover:bg-[#FFF3E0] transition-colors font-medium"
            >
                전체 이력서 목록 보기 →
            </button>
        </div>
    );
}

// 스크랙 목록 섹션
function ScrapSection() {
    const navigate = useNavigate();

    const scraps = [
        {
            id: 1,
            company: "주식회사 모범기업",
            title: "백엔드 개발자 모집 (장애인 우대 채용)",
            deadline: "2025-04-30",
            scrappedAt: "2025-03-15",
        },
        {
            id: 2,
            company: "주식회사 한사랑",
            title: "UI/UX 디자이너 모집",
            deadline: "2025-05-10",
            scrappedAt: "2025-03-20",
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#3C2A21]">스크랩 목록</h3>
                <span className="text-sm text-gray-400">{scraps.length}개</span>
            </div>

            {scraps.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <i className="ri-bookmark-line text-5xl block mb-3 text-gray-300"></i>
                    <p className="font-medium">스크랩한 채용공고가 없습니다.</p>
                    <p className="text-sm mt-1">채용공고를 찾아보세요!</p>
                    <button
                        onClick={() => navigate("/jobs")}
                        className="mt-4 text-sm bg-yellow-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
                    >
                        채용공고 바로가기
                    </button>
                </div>
            ) : (
                scraps.map((scrap) => (
                    <div
                        key={scrap.id}
                        className="bg-white border border-[#E8DCCB] rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-[#8D6E63] font-medium mb-1">{scrap.company}</p>
                                <h4 className="font-bold text-[#5D4037] text-sm leading-snug">{scrap.title}</h4>
                                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                                    <span>마감: {scrap.deadline}</span>
                                    <span>스크랩: {scrap.scrappedAt}</span>
                                </div>
                            </div>
                            <button className="text-yellow-500 hover:text-yellow-600 text-xl ml-3">
                                <i className="ri-bookmark-fill"></i>
                            </button>
                        </div>
                        <button
                            onClick={() => navigate(`/jobs/${scrap.id}`)}
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

// 현재 경로에 따라 활성 메뉴를 판별하는 헬퍼
function useActiveMenu() {
    const location = useLocation();
    const path = location.pathname;
    if (path.includes("/memberMypage/resumes")) return "resume";
    if (path.includes("/memberMypage/scrap")) return "scrap";
    return "profile";
}

export default function MemberMypage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 중첩 라우트가 활성화된 경우(이력서 상세/수정/작성 등)에는 Outlet으로 렌더링
    const isNestedRoute =
        location.pathname !== "/memberMypage" &&
        location.pathname !== "/memberMypage/";

    // 중첩 라우트가 아닐 때만 탭 상태 관리
    const [activeMenu, setActiveMenu] = useState("profile");

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
    return "profile";
}
