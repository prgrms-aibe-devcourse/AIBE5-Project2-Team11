import video1 from "../assets/video/video1.mp4";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] min-h-[560px]">
      {/* 배경 비디오 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={video1} type="video/mp4" />
      </video>

      {/* 비디오 위 수채화 톤 오버레이 (텍스트 가독성 확보) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(253,251,247,0.85) 0%, rgba(253,251,247,0.7) 40%, rgba(244,209,155,0.55) 100%)",
        }}
      />

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
          opacity: 0.45,
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

      {/* 좌측 플로팅 카드 */}
      <div
        className="absolute left-[4%] md:left-[6%] top-[20%] hidden sm:block z-10"
        style={{ animation: "heroFloatA 6s ease-in-out infinite" }}
      >
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 border border-[#F3EAE1] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#DCE8C6] flex items-center justify-center text-base">
            💼
          </div>
          <div>
            <div className="text-[10px] text-[#8B6B4A]">추천 직무</div>
            <div className="text-sm font-bold text-[#2C160D]">프론트엔드 개발자</div>
          </div>
        </div>
      </div>
      <div
        className="absolute left-[6%] md:left-[10%] top-[60%] hidden sm:block z-10"
        style={{ animation: "heroFloatC 8s ease-in-out infinite" }}
      >
        <div className="bg-[#F4D19B] rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base">
            🎯
          </div>
          <div>
            <div className="text-[10px] text-[#8B6B4A]">AI 매칭률</div>
            <div className="text-sm font-black text-[#2C160D]">97%</div>
          </div>
        </div>
      </div>

      {/* 우측 플로팅 카드 */}
      <div
        className="absolute right-[4%] md:right-[8%] top-[22%] hidden sm:block z-10"
        style={{ animation: "heroFloatB 7s ease-in-out infinite" }}
      >
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 border border-[#F3EAE1] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E8D5F2] flex items-center justify-center text-base">
            ✨
          </div>
          <div>
            <div className="text-[10px] text-[#8B6B4A]">신규 공고</div>
            <div className="text-sm font-bold text-[#2C160D]">UX 디자이너</div>
          </div>
        </div>
      </div>
      <div
        className="absolute right-[3%] md:right-[6%] top-[62%] hidden sm:block z-10"
        style={{ animation: "heroFloatA 8s ease-in-out infinite" }}
      >
        <div className="bg-[#DCE8C6] rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base">
            🌱
          </div>
          <div>
            <div className="text-[10px] text-[#6B8B4A]">오늘 신규</div>
            <div className="text-sm font-black text-[#2C160D]">+128건</div>
          </div>
        </div>
      </div>

      {/* 플로팅 애니메이션 keyframes */}
      <style>{`
        @keyframes heroFloatA {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-10px) rotate(-4deg); }
        }
        @keyframes heroFloatB {
          0%, 100% { transform: translateY(0) rotate(8deg); }
          50% { transform: translateY(-8px) rotate(6deg); }
        }
        @keyframes heroFloatC {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(-1deg); }
        }
      `}</style>

      {/* 콘텐츠 */}
      <div className="relative z-10 px-10 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-[#2C160D]">
          당신의 <span className="text-[#D98E3A]">가능성</span>이<br />
          <span
            className="font-handwriting text-6xl md:text-8xl text-[#E8A94A]"
            style={{
              fontFamily: "'Gaegu', cursive",
              fontWeight: 400,
              fontSynthesis: "none",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            빛나는
          </span>{" "}
          일자리
        </h1>
        <p className="mt-6 text-[#6B4F33] text-lg md:text-xl">
          누구에게나 열려있는 따뜻한 내일을 함께 만듭니다
        </p>

        {/* CTA 버튼 */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="/ai-recommend"
            className="px-7 py-3 bg-[#2C160D] text-white font-bold rounded-full shadow-lg hover:bg-[#3A2317] transition"
          >
            AI 추천 받기 →
          </a>
          <a
            href="/jobs"
            className="px-7 py-3 bg-white text-[#2C160D] font-bold rounded-full border-2 border-[#2C160D]/10 hover:border-[#2C160D]/30 transition"
          >
            채용공고 보기
          </a>
        </div>
      </div>
    </section>
  );
}
