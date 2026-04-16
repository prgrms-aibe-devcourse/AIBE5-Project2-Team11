import ApplicantCard from "./ApplicantCard";

export default function ApplicantsSidebar({
                                              applicants,
                                              selectedApplicant,
                                              setSelectedApplicantId,
                                          }) {
    return (
        <section className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white border border-[#EADFCC] rounded-2xl p-4 shadow-sm">
                <div className="flex gap-2 mb-4">
                    <button className="flex-1 rounded-xl px-4 py-3 bg-[#4A2E2A] text-white text-sm font-semibold">
                        📄 서류 검토
                    </button>
                    <button className="flex-1 rounded-xl px-4 py-3 bg-[#F7F1E8] text-[#B8A18C] text-sm font-semibold border border-[#E8DCCB]">
                        □ 면접 검토
                    </button>
                </div>

                <button className="w-full rounded-xl px-4 py-3 mb-4 bg-[#F8EEDB] text-[#8A6E5A] border border-[#E7D7BD] text-sm font-medium text-left">
                    ⏰ 서류 검토 마감하기
                </button>

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