import { company } from "../../mockData/company"; // 테스트용 회사 데이터

export default function CompanyProfileCard() {

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
      {/* 로고 영역 */}
      <div className="w-24 h-24 bg-[#EFECE5] rounded-xl flex items-center justify-center relative shrink-0">
        <svg className="w-12 h-12 text-[#B5A991]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>

      {/* 텍스트 영역 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {company.company_name}, 안녕하세요!
        </h1>
        <p className="text-gray-600 mt-1">
          {/* 백엔드 연결 시, IT·소프트웨어 이 부분은 Company테이블과 연결된 직종 필드로 연결  */}
          IT·소프트웨어 | {company.address}
        </p>
      </div>
    </section>
  );
}