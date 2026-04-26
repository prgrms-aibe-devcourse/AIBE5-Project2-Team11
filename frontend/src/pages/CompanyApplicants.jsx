import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ApplicantsStatusTabs from "../components/companyApplicants/ApplicantsStatusTabs";
import ApplicantsSidebar from "../components/companyApplicants/ApplicantsSidebar";
import ApplicantDetail from "../components/companyApplicants/ApplicantDetail";
import { applyApi } from "../api/applyApi";
import { jobPostingApi } from "../api/jobPostingApi";

// 상태값 매핑 (한글 <-> 백엔드 Enum)
const STATUS_MAP = {
    "SUBMITTED": "검토전",
    "DOCUMENT_PASSED": "서류합격",
    "DOCUMENT_FAILED": "서류탈락",
    "INTERVIEW_PASSED": "면접합격",
    "INTERVIEW_FAILED": "면접탈락",
    "FINAL_ACCEPTED": "최종합격",
    "FINAL_REJECTED": "최종탈락"
};

const REVERSE_STATUS_MAP = {
    "검토전": "SUBMITTED",
    "서류합격": "DOCUMENT_PASSED",
    "서류탈락": "DOCUMENT_FAILED",
    "면접합격": "INTERVIEW_PASSED",
    "면접탈락": "INTERVIEW_FAILED",
    "최종합격": "FINAL_ACCEPTED",
    "최종탈락": "FINAL_REJECTED"
};

export default function CompanyApplicants() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [jobTitle, setJobTitle] = useState("불러오는 중...");
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("전체");
    const [selectedApplicantId, setSelectedApplicantId] = useState(null);

    // 나이 계산 함수 (만 나이)
    const calculateAge = (birthDateStr) => {
        if (!birthDateStr || birthDateStr === "정보 없음") return null;
        const birthDate = new Date(birthDateStr);
        if (isNaN(birthDate.getTime())) return null;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 공고 정보와 지원자 목록을 동시에 가져옴
                const [jobDetail, applicantsData] = await Promise.all([
                    jobPostingApi.getJobPostingDetail(jobId),
                    applyApi.getApplicants(jobId)
                ]);

                setJobTitle(jobDetail.title || "제목 없음");
                
                const formattedData = applicantsData.map(app => ({
                    id: app.applicationId,
                    name: app.applicantName,
                    email: app.applicantEmail,
                    status: STATUS_MAP[app.status] || "검토전",
                    appliedDate: new Date(app.appliedAt).toLocaleDateString(),
                    resumeId: app.resumeId,
                    age: calculateAge(app.birthDate),
                    birthDate: app.birthDate || null,
                    gender: app.gender || "정보 없음",
                    disability: app.disability || "정보 없음",
                    phone: app.phone || app.phoneNumber || "연락처 미등록",
                    education: app.education || "정보 없음", 
                    career: app.career || "신입",
                    skills: app.skills || [],
                    intro: app.intro || "자기소개가 없습니다.",
                    motivation: "이력서 상세를 확인해주세요.",
                    userPhoto: app.userPhoto
                }));
                
                setApplicants(formattedData);
                if (formattedData.length > 0) {
                    setSelectedApplicantId(formattedData[0].id);
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
                setJobTitle("정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (jobId) fetchData();
    }, [jobId]);

    const statusCount = {
        전체: applicants.length,
        검토전: applicants.filter((item) => item.status === "검토전").length,
        면접검토: applicants.filter((item) => ["서류합격", "면접합격"].includes(item.status)).length,
        최종합격: applicants.filter((item) => item.status === "최종합격").length,
        불합격: applicants.filter((item) => ["서류탈락", "면접탈락", "최종탈락"].includes(item.status)).length,
    };

    const filteredApplicants = useMemo(() => {
        if (selectedStatus === "전체") return applicants;
        if (selectedStatus === "검토전") return applicants.filter((item) => item.status === "검토전");
        if (selectedStatus === "면접검토") return applicants.filter((item) => ["서류합격", "면접합격"].includes(item.status));
        if (selectedStatus === "최종합격") return applicants.filter((item) => item.status === "최종합격");
        if (selectedStatus === "불합격") return applicants.filter((item) => ["서류탈락", "면접탈락", "최종탈락"].includes(item.status));
        return applicants.filter((item) => item.status === selectedStatus);
    }, [applicants, selectedStatus]);

    useEffect(() => {
        const isSelectedInFiltered = filteredApplicants.some(
            (item) => item.id === selectedApplicantId
        );

        if (!isSelectedInFiltered) {
            setSelectedApplicantId(filteredApplicants[0]?.id ?? null);
        }
    }, [selectedStatus, filteredApplicants, selectedApplicantId]);

    const selectedApplicant =
        filteredApplicants.find((item) => item.id === selectedApplicantId) ||
        filteredApplicants[0] ||
        null;

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
                            onClick={() => navigate("/company-jobpost-manage")}
                            className="group inline-flex items-center gap-2 text-sm text-[#8A6E5A] hover:text-[#5B4636] transition"
                        >
                            <i className="ri-sparkling-2-line group-hover:scale-110 transition-transform duration-200"></i>
                            공고 관리
                        </button>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-[#3C2A21]">지원자 관리</h1>
                        <p className="mt-2 text-sm text-[#9A7E6A]">
                            {jobTitle}
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
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
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