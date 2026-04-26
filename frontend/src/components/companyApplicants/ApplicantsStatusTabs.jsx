export default function ApplicantsStatusTabs({
                                                 selectedStatus,
                                                 setSelectedStatus,
                                                 statusCount,
                                             }) {
    const tabs = ["전체", "검토전", "면접검토", "최종합격", "불합격"];

    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map((status) => {
                const isActive = selectedStatus === status;

                return (
                    <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                            isActive
                                ? "bg-[#F4E4C6] text-[#5B4636] border-[#E4CAA0]"
                                : "bg-white text-[#8C715D] border-[#E8DCCB] hover:bg-[#FAF5EE]"
                        }`}
                    >
                        {status} {statusCount[status]}
                    </button>
                );
            })}
        </div>
    );
}