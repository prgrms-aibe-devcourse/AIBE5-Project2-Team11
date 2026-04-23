export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] min-h-[540px]">
      {/* 수채화 파스텔 블롭 배경 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 520,
          height: 520,
          top: -140,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#F4D19B",
          filter: "blur(40px)",
          opacity: 0.5,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 260,
          height: 260,
          top: 60,
          left: "6%",
          background: "#E8D5F2",
          filter: "blur(40px)",
          opacity: 0.4,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 260,
          height: 260,
          top: 80,
          right: "6%",
          background: "#DCE8C6",
          filter: "blur(40px)",
          opacity: 0.45,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 340,
          height: 160,
          bottom: -80,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#FEB300",
          filter: "blur(40px)",
          opacity: 0.2,
        }}
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 px-10 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-[#2C160D]">
          당신의 <span className="text-[#D98E3A]">가능성</span>이<br />
          <span className="font-handwriting text-6xl md:text-8xl text-[#E8A94A]">
            빛나는
          </span>{" "}
          일자리
        </h1>
        <p className="mt-8 text-[#6B4F33] text-lg md:text-xl">
          누구에게나 열려있는 따뜻한 내일을 함께 만듭니다
        </p>

        {/* 신뢰 지표 */}
        <div className="mt-14 inline-flex items-center gap-8 bg-white/80 backdrop-blur px-10 py-6 rounded-full shadow-sm border border-[#F3EAE1]">
          <div className="text-left">
            <div className="text-2xl md:text-3xl font-black text-[#2C160D]">
              1,200+
            </div>
            <div className="text-xs text-[#8B6B4A] mt-1">채용 중인 기업</div>
          </div>
          <div className="w-px h-10 bg-[#EFE4D8]" />
          <div className="text-left">
            <div className="text-2xl md:text-3xl font-black text-[#2C160D]">
              8,500+
            </div>
            <div className="text-xs text-[#8B6B4A] mt-1">함께하는 구직자</div>
          </div>
          <div className="w-px h-10 bg-[#EFE4D8]" />
          <div className="text-left">
            <div className="text-2xl md:text-3xl font-black text-[#2C160D]">
              AI
            </div>
            <div className="text-xs text-[#8B6B4A] mt-1">맞춤 매칭 추천</div>
          </div>
        </div>
      </div>
    </section>
  );
}
