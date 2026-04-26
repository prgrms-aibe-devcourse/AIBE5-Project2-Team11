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

    const currentStatus = applicant.status;

    const renderStatusButtons = () => {
        if (currentStatus === "검토전") {
            return (
                <>
                    <button onClick={() => onChangeStatus("서류합격")} className="px-4 py-2 rounded-full text-sm font-medium bg-[#6F8E9D] text-white hover:bg-[#5A7482] transition">서류 합격</button>
                    <button onClick={() => onChangeStatus("서류탈락")} className="px-4 py-2 rounded-full text-sm font-medium bg-white text-[#D9534F] border border-[#D9534F] hover:bg-[#FFF5F5] transition">서류 탈락</button>
                </>
            );
        }
        if (currentStatus === "서류합격") {
            return (
                <>
                    <button onClick={() => onChangeStatus("면접합격")} className="px-4 py-2 rounded-full text-sm font-medium bg-[#6F8E9D] text-white hover:bg-[#5A7482] transition">면접 합격</button>
                    <button onClick={() => onChangeStatus("면접탈락")} className="px-4 py-2 rounded-full text-sm font-medium bg-white text-[#D9534F] border border-[#D9534F] hover:bg-[#FFF5F5] transition">면접 탈락</button>
                </>
            );
        }
        if (currentStatus === "면접합격") {
            return (
                <>
                    <button onClick={() => onChangeStatus("최종합격")} className="px-4 py-2 rounded-full text-sm font-medium bg-[#E66235] text-white hover:bg-[#D45326] transition">최종 합격</button>
                    <button onClick={() => onChangeStatus("최종탈락")} className="px-4 py-2 rounded-full text-sm font-medium bg-white text-[#D9534F] border border-[#D9534F] hover:bg-[#FFF5F5] transition">최종 탈락</button>
                </>
            );
        }
        return (
            <span className="text-sm font-bold text-[#8A6E5A] bg-[#FBF6EE] px-4 py-2 rounded-full border border-[#E2C8A6]">
                {currentStatus} 상태입니다.
            </span>
        );
    };

    return (
        <section className="flex-1">
            <div className="bg-white border border-[#EADFCC] rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[#EEF2F5] border-b border-[#E0E6EA] flex flex-col md:flex-row md:items-center md:justify-end gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        {renderStatusButtons()}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-4 pb-6 border-b border-[#EFE3D2]">
                        <div className="w-20 h-24 rounded-lg bg-[#F2E3BF] text-[#6B4F3A] flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden border border-[#EFE3D2]">
                            {applicant.userPhoto ? (
                                <img 
                                    src={
                                        applicant.userPhoto.startsWith('http') 
                                        ? applicant.userPhoto 
                                        : `http://localhost:8080${applicant.userPhoto.startsWith('/') ? '' : '/'}${applicant.userPhoto}`
                                    } 
                                    alt={applicant.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = ""; // 로드 실패 시 빈 이미지 처리 (배경색/초성 노출)
                                        e.target.parentElement.innerHTML = getInitial(applicant.name);
                                    }}
                                />
                            ) : (
                                getInitial(applicant.name)
                            )}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-[#3C2A21]">{applicant.name}</h2>
                            <p className="mt-1 text-sm text-[#8C715D]">
                                {applicant.birthDate ? `${applicant.birthDate} (${applicant.age}세, 만)` : ""}{applicant.birthDate ? " · " : ""}{applicant.disability}
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

                    <div className="py-6">
                        <p className="text-sm text-[#A08670] mb-2">자기소개</p>
                        <p className="text-[#4C3A2F] leading-7">{applicant.intro}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}