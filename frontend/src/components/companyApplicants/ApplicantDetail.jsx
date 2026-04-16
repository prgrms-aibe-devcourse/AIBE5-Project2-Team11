export default function ApplicantDetail({ applicant, onChangeStatus }) {
    if (!applicant) {
        return (
            <section className="flex-1">
                <div className="bg-white border border-[#EADFCC] rounded-2xl p-10 shadow-sm text-center text-[#8C715D]">
                    선택된 지원자가 없습니다.
                </div>
            </section>
        );
    }

    const getInitial = (name) => name?.charAt(0) || "";

    return (
        <section className="flex-1">
            <div className="bg-white border border-[#EADFCC] rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[#EEF2F5] border-b border-[#E0E6EA] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-sm font-semibold text-[#6E7F8A]">📄 서류 검토</div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-[#97A7B1] mr-1">상태 변경</span>
                        <button
                            onClick={() => onChangeStatus("검토 전")}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-[#6F8E9D] text-white"
                        >
                            검토 전
                        </button>
                        <button
                            onClick={() => onChangeStatus("합격")}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-white text-[#8A6E5A] border border-[#E2C8A6] hover:bg-[#FBF6EE]"
                        >
                            합격
                        </button>
                        <button
                            onClick={() => onChangeStatus("불합격")}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-white text-[#8A6E5A] border border-[#E2C8A6] hover:bg-[#FBF6EE]"
                        >
                            불합격
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-4 pb-6 border-b border-[#EFE3D2]">
                        <div className="w-14 h-14 rounded-2xl bg-[#F2E3BF] text-[#6B4F3A] flex items-center justify-center text-2xl font-bold shrink-0">
                            {getInitial(applicant.name)}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-[#3C2A21]">{applicant.name}</h2>
                            <p className="mt-1 text-sm text-[#8C715D]">
                                {applicant.age}세 · {applicant.gender} · {applicant.disability}
                            </p>
                            <p className="mt-1 text-sm text-[#A08670]">
                                지원일 {applicant.appliedDate}
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 py-6 border-b border-[#EFE3D2]">
                        <div>
                            <p className="text-sm text-[#A08670] mb-2">연락처</p>
                            <p className="text-[#4C3A2F] font-medium">📞 {applicant.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#A08670] mb-2">이메일</p>
                            <p className="text-[#4C3A2F] font-medium">✉️ {applicant.email}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 py-6 border-b border-[#EFE3D2]">
                        <div>
                            <p className="text-sm text-[#A08670] mb-2">학력</p>
                            <p className="text-[#4C3A2F] font-medium leading-relaxed">
                                {applicant.education}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[#A08670] mb-2">경력</p>
                            <p className="text-[#4C3A2F] font-medium leading-relaxed">
                                {applicant.career}
                            </p>
                        </div>
                    </div>

                    <div className="py-6 border-b border-[#EFE3D2]">
                        <p className="text-sm text-[#A08670] mb-3">보유 스킬</p>
                        <div className="flex flex-wrap gap-2">
                            {applicant.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 rounded-full text-sm bg-[#F6EAD6] text-[#7A5B43] border border-[#E7D2B0]"
                                >
                  {skill}
                </span>
                            ))}
                        </div>
                    </div>

                    <div className="py-6 border-b border-[#EFE3D2]">
                        <p className="text-sm text-[#A08670] mb-2">자기소개</p>
                        <p className="text-[#4C3A2F] leading-7">{applicant.intro}</p>
                    </div>

                    <div className="py-6">
                        <p className="text-sm text-[#A08670] mb-2">지원 동기</p>
                        <p className="text-[#4C3A2F] leading-7">{applicant.motivation}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}