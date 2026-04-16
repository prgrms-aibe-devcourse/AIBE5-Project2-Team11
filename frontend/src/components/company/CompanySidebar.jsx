import { Link, useLocation } from 'react-router-dom';

export default function CompanySidebar() {
  const location = useLocation();
  
  const menus = [
    { name: '기업 정보', path: '/company-mypage' },
    { name: '공고 관리', path: '/company-jobpost-manage' }
  ];

  const menuClass = (path) => {
    const isActive = location.pathname === path;
    return `w-full block rounded-xl px-4 py-4 text-left font-medium border transition ${
      isActive
        ? "bg-[#4A2E2A] text-white border-[#4A2E2A] shadow"
        : "bg-white text-[#5B4636] border-[#E8DCCB] hover:bg-[#FAF5EE]"
    }`;
  };

  return (
    <aside className="w-full md:w-64 shrink-0 sticky top-20 self-start">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-[#3C2A21]">기업 마이페이지</h2>
      </div>

      <nav className="space-y-4">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            to={menu.path}
            className={menuClass(menu.path)}
          >
            {menu.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
