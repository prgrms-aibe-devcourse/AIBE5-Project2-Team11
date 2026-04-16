import { Link, useLocation } from 'react-router-dom';

export default function CompanySidebar() {
  const location = useLocation();
  
  const menus = [
    { name: '기업 정보', path: '/company-mypage', iconPath: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { name: '공고 관리', path: '/company-jobpost-manage', iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }
  ];

  return (
    <aside className="w-1/4">
      <nav className="flex flex-col gap-2 w-full items-start">
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path;
          return (
            <Link
              key={menu.name}
              to={menu.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all w-full ${
                isActive ? 'bg-[#3D2B24] text-white shadow-md' : 'bg-white text-[#6B5D4D] border border-[#F1EEE5] hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? 'bg-[#4D3A32]' : 'bg-[#F1EEE5]'}`}>
                  <svg className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-[#B5A991]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menu.iconPath} />
                  </svg>
                </div>
                <span className="text-[15px] font-bold">{menu.name}</span>
              </div>
              {isActive && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}