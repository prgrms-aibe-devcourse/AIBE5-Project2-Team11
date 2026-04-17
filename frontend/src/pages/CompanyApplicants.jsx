import { useMemo, useState } from "react";
import Header from "../components/Header";
import ApplicantsStatusTabs from "../components/companyApplicants/ApplicantsStatusTabs";
import ApplicantsSidebar from "../components/companyApplicants/ApplicantsSidebar";
import ApplicantDetail from "../components/companyApplicants/ApplicantDetail";

export default function CompanyApplicants() {
    const applicants = useMemo(
        () => [
            {
                id: 1,
                name: "김지수",
                age: 28,
                gender: "여성",
                disability: "지체장애",
                status: "합격",
                appliedDate: "2026.04.08",
                phone: "010-2345-6789",
                email: "jisu.kim@email.com",
                education: "한양대학교 경영학과 졸업",
                career: "사무보조 2년",
                skills: ["Excel", "문서작성", "CS"],
                intro:
                    "꼼꼼한 성격과 빠른 업무 적응력을 바탕으로 사무 지원 업무에 강점이 있습니다.",
                motivation:
                    "안정적인 환경에서 꾸준히 성장하며 회사에 기여하고 싶습니다.",
            },
            {
                id: 2,
                name: "박민준",
                age: 32,
                gender: "남성",
                disability: "청각장애 2급",
                status: "검토 전",
                appliedDate: "2026.04.09",
                phone: "010-9876-5432",
                email: "minjun.park@email.com",
                education: "서울전문대학 컴퓨터정보과 졸업",
                career: "프리랜서 데이터 처리 3년",
                skills: ["Python", "데이터 분석", "Excel", "SQL"],
                intro:
                    "청각장애가 있지만 집중력과 꼼꼼함으로 데이터 관련 업무에서 강점을 발휘합니다.",
                motivation:
                    "데이터 입력 및 분석 분야에서 3년간의 프리랜서 경험을 바탕으로 귀사에 기여하고 싶습니다.",
            },
            {
                id: 3,
                name: "이서연",
                age: 25,
                gender: "여성",
                disability: "시각장애",
                status: "검토 전",
                appliedDate: "2026.04.10",
                phone: "010-1122-3344",
                email: "seoyeon.lee@email.com",
                education: "부산대학교 국어국문학과 졸업",
                career: "행정보조 인턴 1년",
                skills: ["한글", "문서정리", "전화응대"],
                intro:
                    "문서 정리와 행정 보조 업무에 익숙하며 책임감 있게 맡은 일을 수행합니다.",
                motivation:
                    "행정 및 사무 업무 경험을 바탕으로 회사 운영에 실질적인 도움을 드리고 싶습니다.",
            },
            {
                id: 4,
                name: "최동현",
                age: 35,
                gender: "남성",
                disability: "지체장애",
                status: "불합격",
                appliedDate: "2026.04.07",
                phone: "010-5566-7788",
                email: "donghyun.choi@email.com",
                education: "경기대학교 행정학과 졸업",
                career: "총무 및 관리 5년",
                skills: ["총무", "문서관리", "OA"],
                intro:
                    "장기간 총무 업무를 수행하며 조직 운영과 문서 관리 능력을 길렀습니다.",
                motivation:
                    "실무 경험을 살려 효율적인 사무 운영에 기여하고 싶습니다.",
            },
            {
                id: 5,
                name: "정하은",
                age: 29,
                gender: "여성",
                disability: "청년장애",
                status: "합격",
                appliedDate: "2026.04.06",
                phone: "010-2233-8899",
                email: "haeun.jung@email.com",
                education: "인덕대학교 세무회계과 졸업",
                career: "회계 보조 2년",
                skills: ["회계기초", "Excel", "전표입력"],
                intro:
                    "회계 보조 경험을 통해 반복적이고 정밀한 업무에 익숙합니다.",
                motivation:
                    "정확하고 성실한 업무 수행으로 회사의 회계 지원 업무에 도움이 되고 싶습니다.",
            },
        ],
        []
    );

    const [selectedStatus, setSelectedStatus] = useState("전체");
    const [selectedApplicantId, setSelectedApplicantId] = useState(2);

    const statusCount = {
        전체: applicants.length,
        검토전: applicants.filter((item) => item.status === "검토 전").length,
        합격: applicants.filter((item) => item.status === "합격").length,
        불합격: applicants.filter((item) => item.status === "불합격").length,
    };

    const filteredApplicants =
        selectedStatus === "전체"
            ? applicants
            : applicants.filter((item) =>
                selectedStatus === "검토전"
                    ? item.status === "검토 전"
                    : item.status === selectedStatus
            );

    const selectedApplicant =
        applicants.find((item) => item.id === selectedApplicantId) ||
        filteredApplicants[0] ||
        applicants[0];

    const handleChangeStatus = (newStatus) => {
        alert(`${selectedApplicant.name}님의 상태를 "${newStatus}"로 변경하는 로직을 연결하면 됩니다.`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            <Header />

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="mb-6">
                        <button
                            type="button"
                            className="text-sm text-[#8A6E5A] hover:text-[#5B4636] transition"
                        >
                            ← 공고 관리
                        </button>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-[#3C2A21]">지원자 관리</h1>
                        <p className="mt-2 text-sm text-[#9A7E6A]">
                            데이터 입력 및 사무 보조 (장애인 우대)
                        </p>
                    </div>

                    <ApplicantsStatusTabs
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        statusCount={statusCount}
                    />

                    <div className="mt-6 flex flex-col lg:flex-row gap-6">
                        <ApplicantsSidebar
                            applicants={filteredApplicants}
                            selectedApplicant={selectedApplicant}
                            setSelectedApplicantId={setSelectedApplicantId}
                        />

                        <ApplicantDetail
                            applicant={selectedApplicant}
                            onChangeStatus={handleChangeStatus}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}