export default function Footer() {
  return (
    <footer className="w-full bg-[#FFE2DA] rounded-t-3xl mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-8">

        {/* 왼쪽 (브랜드) */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#5D4037]">다온일</h2>

          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            모두에게 온 기회. 장애인 맞춤 일자리 추천 플랫폼 다온일입니다.
          </p>

          <p className="text-xs text-gray-400">
            © 2026 다온일. All rights reserved.
          </p>
        </div>

        {/* 오른쪽 (정보) */}
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <p>team Sprint</p>
          <p>사업자등록번호: 561-5-81-58140</p>
          <p>고객센터: 1588-8851 (평일 09:00~18:00)</p>
        </div>

      </div>
    </footer>
  );
}