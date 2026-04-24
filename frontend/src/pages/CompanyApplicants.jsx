import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ApplicantsStatusTabs from "../components/companyApplicants/ApplicantsStatusTabs";
import ApplicantsSidebar from "../components/companyApplicants/ApplicantsSidebar";
import ApplicantDetail from "../components/companyApplicants/ApplicantDetail";
import { applyApi } from "../api/applyApi";

// 상태값 매핑 (한글 <-> 백엔드 Enum)
const STATUS_MAP = {
    "SUBMITTED": "검토전",
    "FINAL_ACCEPTED": "합격",
    "FINAL_REJECTED": "불합격",
    "DOCUMENT_PASSED": "합격",     // 단순화를 위해 합격으로 매핑
    "INTERVIEW_PASSED": "합격",
    "DOCUMENT_FAILED": "불합격",   // 단순화를 위해 불합격으로 매핑
    "INTERVIEW_FAILED": "불합격"
};

const REVERSE_STATUS_MAP = {
    "검토전": "SUBMITTED",
    "합격": "FINAL_ACCEPTED",
    "불합격": "FINAL_REJECTED"
};

export default function CompanyApplicants() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("전체");
    const [selectedApplicantId, setSelectedApplicantId] = useState(null);

    // 데이터 가져오기
    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                setLoading(true);
                const data = await applyApi.getApplicants(jobId);
                
                // 백엔드 데이터를 프론트 구조에 맞게 가공
                const formattedData = data.map(app => ({
                    id: app.applicationId,
                    name: app.applicantName,
                    email: app.applicantEmail,
                    status: STATUS_MAP[app.status] || "검토전",
                    appliedDate: new Date(app.appliedAt).toLocaleDateString(),
                    resumeId: app.resumeId,
                    // 상세 정보는 나중에 이력서 API로 가져오거나 초기값 설정 (하드코딩 제거를 위한 예시 데이터)
                    age: "확인 필요",
                    gender: "확인 필요",
                    disability: "확인 필요",
                    phone: "관리자 확인 필요",
                    education: "이력서 상세 확인 필요",
                    career: "이력서 상세 확인",
                    skills: [],
                    intro: "이력서 상세를 확인해주세요.",
                    motivation: "이력서 상세를 확인해주세요."
                }));
                
                setApplicants(formattedData);
                if (formattedData.length > 0) {
                    setSelectedApplicantId(formattedData[0].id);
                }
            } catch (error) {
                console.error("지원자 목록 조회 실패:", error);
                alert("지원자 목록을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (jobId) fetchApplicants();
    }, [jobId]);

    const statusCount = {
        전체: applicants.length,
        검토전: applicants.filter((item) => item.status === "검토전").length,
        합격: applicants.filter((item) => item.status === "합격").length,
        불합격: applicants.filter((item) => item.status === "불합격").length,
    };

    const filteredApplicants =
        selectedStatus === "전체"
            ? applicants
            : applicants.filter((item) => item.status === selectedStatus);

    const selectedApplicant =
        applicants.find((item) => item.id === selectedApplicantId) ||
        filteredApplicants[0] ||
        applicants[0];

    const handleChangeStatus = async (newStatusLabel) => {
        if (!selectedApplicant) return;
        
        const newStatusEnum = REVERSE_STATUS_MAP[newStatusLabel];
        if (!newStatusEnum) return;

        try {
            await applyApi.updateStatus(selectedApplicant.id, newStatusEnum);
            
            // 로컬 상태 업데이트
            setApplicants(prev => prev.map(app => 
                app.id === selectedApplicant.id ? { ...app, status: newStatusLabel } : app
            ));
            
            alert(`${selectedApplicant.name}님의 상태가 "${newStatusLabel}"(으)로 변경되었습니다.`);
        } catch (error) {
            console.error("상태 변경 실패:", error);
            alert("상태 변경 중 오류가 발생했습니다.");
        }
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