import ApplicantCard from "./ApplicantCard";

export default function ApplicantsSidebar({
                                              applicants,
                                              selectedApplicant,
                                              setSelectedApplicantId,
                                              selectedStatus,
                                              setSelectedStatus,
                                          }) {
    return (
        <section className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white border border-[#EADFCC] rounded-2xl p-4 shadow-sm">
                <div className="flex gap-2 mb-4">
                    <button 
                        onClick={() => setSelectedStatus("검토전")}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                            selectedStatus === "검토전" 
                            ? "bg-[#4A2E2A] text-white" 
                            : "bg-[#F7F1E8] text-[#B8A18C] border border-[#E8DCCB]"
                        }`}
                    >
                        📄 서류 검토
                    </button>
                    <button 
                        onClick={() => setSelectedStatus("면접검토")}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                            selectedStatus === "면접검토" 
                            ? "bg-[#4A2E2A] text-white" 
                            : "bg-[#F7F1E8] text-[#B8A18C] border border-[#E8DCCB]"
                        }`}
                    >
                        👥 면접 검토
                    </button>
                </div>

                <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                    {applicants.map((applicant) => (
                        <ApplicantCard
                            key={applicant.id}
                            applicant={applicant}
                            isSelected={selectedApplicant?.id === applicant.id}
                            onClick={() => setSelectedApplicantId(applicant.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}