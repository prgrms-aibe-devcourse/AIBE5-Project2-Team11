export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-bl from-[#FEB508] via-[#FFDFA4] to-[#FFF4F1] py-24 flex items-center justify-center">
      <div className="text-center max-w-3xl px-4">

        {/* 작은 배지 */}
        <div className="inline-block mb-6 px-4 py-1 bg-white/60 rounded-full text-sm text-gray-700">
          다온을 환영합니다
        </div>

        {/* 메인 타이틀 */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
          당신의 <span className="text-yellow-800">가능성</span>이 <br />
          빛나는 일자리
        </h1>

        {/* 서브 텍스트 */}
        <p className="text-gray-700 mb-8">
          누구에게나 열려있는 따뜻한 내일을 함께 만듭니다.
        </p>

        {/* 검색창 */}
        <div className="relative left-1/2 -translate-x-1/2 w-screen max-w-xl px-4">
          <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden mx-auto">
            <input
              type="text"
              placeholder="어떤 직무를 찾고 계신가요?"
              className="flex-1 px-6 py-4 outline-none"
            />
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full m-1
              transition duration-150 ease-in-out
              active:scale-95 active:shadow-inner">
              검색하기
            </button>
          </div>
        </div>

        {/* 하단 버튼들 */}
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <button className="px-4 py-2 bg-white/70 rounded-full text-sm 
            transition duration-200 ease-in-out
            hover:bg-white hover:shadow-md hover:-translate-y-0.5">
            글자 크게 보기
          </button>
          <button className="px-4 py-2 bg-white/70 rounded-full text-sm 
            transition duration-200 ease-in-out
            hover:bg-white hover:shadow-md hover:-translate-y-0.5">
            음성 지원 안내
          </button>
          <button className="px-4 py-2 bg-white/70 rounded-full text-sm 
            transition duration-200 ease-in-out
            hover:bg-white hover:shadow-md hover:-translate-y-0.5">
            고대비 모드
          </button>
        </div>

      </div>
    </section>
  );
}