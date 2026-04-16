export default function ApplicantCard({ applicant, isSelected, onClick }) {
    const getInitial = (name) => name?.charAt(0) || "";

    const getStatusStyle = (status) => {
        switch (status) {
            case "합격":
                return "bg-[#EAF7E8] text-[#3A8A42] border border-[#B7E0BC]";
            case "불합격":
                return "bg-[#FFF0F0] text-[#D65A5A] border border-[#F2B8B8]";
            case "검토 전":
            default:
                return "bg-[#EEF3F6] text-[#6A8593] border border-[#D7E1E7]";
        }
    };

    return (
        <button
            onClick={onClick}
            className={`w-full text-left rounded-2xl border p-4 transition ${
                isSelected
                    ? "border-[#E2B96E] bg-[#FFF9F1] shadow-sm"
                    : "border-[#E8DCCB] bg-white hover:bg-[#FCF8F2]"
            }`}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F3E5C8] text-[#6B4F3A] flex items-center justify-center font-bold shrink-0">
                    {getInitial(applicant.name)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#3C2A21]">{applicant.name}</div>
                    <div className="text-sm text-[#8C715D] truncate">
                        {applicant.age}세 · {applicant.gender} · {applicant.disability}
                    </div>
                </div>

                <span
                    className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${getStatusStyle(
                        applicant.status
                    )}`}
                >
          {applicant.status}
        </span>
            </div>
        </button>
    );
}