export default function MemberSidebar({ activeMenu, onChangeMenu }) {
    const menuClass = (menu) =>
        `w-full rounded-xl px-4 py-4 text-left font-medium border transition ${
            activeMenu === menu
                ? "bg-[#4A2E2A] text-white border-[#4A2E2A] shadow"
                : "bg-white text-[#5B4636] border-[#E8DCCB] hover:bg-[#FAF5EE]"
        }`;

    return (
        <aside className="w-full md:w-64 shrink-0 sticky top-20 self-start">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-[#3C2A21]">마이페이지</h2>
            </div>

            <div className="space-y-4">
                <button
                    className={menuClass("profile")}
                    onClick={() => onChangeMenu("profile")}
                >
                    내 프로필
                </button>

                <button
                    className={menuClass("resume")}
                    onClick={() => onChangeMenu("resume")}
                >
                    이력서 관리
                </button>

                <button
                    className={menuClass("scrap")}
                    onClick={() => onChangeMenu("scrap")}
                >
                    스크랩 목록
                </button>

                <button
                    className={menuClass("application")}
                    onClick={() => onChangeMenu("application")}
                >
                    지원 현황
                </button>
            </div>
        </aside>
    );
}
