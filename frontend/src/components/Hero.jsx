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

      {/* 콘텐츠 */}
      <div className="relative z-10 px-10 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-[#2C160D]">
          당신의 <span className="text-[#D98E3A]">가능성</span>이<br />
          <span
            className="font-handwriting font-normal text-6xl md:text-8xl text-[#E8A94A]"
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
