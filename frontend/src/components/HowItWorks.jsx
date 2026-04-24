import { Link } from "react-router-dom";

const IconUserPlus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h10M17 14v6m-3-3h6" />
  </svg>
);

const IconFile = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconSparkles = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const IconCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "회원가입",
      description: "간편한 소셜 로그인으로\n다온일에 가입하세요",
      Icon: IconUserPlus,
      bgColor: "bg-white",
      borderColor: "border-[#F4D19B]",
      iconColor: "text-[#E8A04A]",
      stepColor: "text-[#E8A04A]",
      to: "/login",
    },
    {
      number: "02",
      title: "이력서 작성",
      description: "나만의 이력서를 등록하고\n강점을 어필하세요",
      Icon: IconFile,
      bgColor: "bg-[#DCE8C6]",
      borderColor: "border-[#DCE8C6]",
      iconColor: "text-green-700",
      stepColor: "text-green-700",
      to: "/memberMypage/resumes/new",
    },
    {
      number: "03",
      title: "AI 맞춤 추천",
      description: "AI가 분석한 최적의\n채용 공고를 만나보세요",
      Icon: IconSparkles,
      bgColor: "bg-[#E8D5F2]",
      borderColor: "border-[#E8D5F2]",
      iconColor: "text-purple-700",
      stepColor: "text-purple-700",
      to: "/ai-recommend",
    },
    {
      number: "04",
      title: "지원 & 합격",
      description: "원하는 공고에 간편 지원하고\n커뮤니티에서 응원받기",
      Icon: IconCheck,
      bgColor: "bg-[#D4E4F7]",
      borderColor: "border-[#D4E4F7]",
      iconColor: "text-blue-700",
      stepColor: "text-blue-700",
      to: "/jobs",
    },
  ];

  return (
    <section className="bg-[#FFF4F1] py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-[#F4D19B] text-[#8a5a1f] text-xs font-bold rounded-full mb-4 tracking-wider">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            다온일 이용 흐름
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            회원가입부터 합격까지, 단 4단계로 당신의 커리어를 시작하세요
          </p>
        </div>

        <div className="relative">
          <div
            className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 z-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, #F4A261 50%, transparent 0%)",
              backgroundSize: "12px 2px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
            }}
          ></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.Icon;
              return (
                <Link
                  key={idx}
                  to={step.to}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  <div
                    className={`w-24 h-24 rounded-full ${step.bgColor} border-4 ${step.borderColor} flex items-center justify-center shadow-lg mb-5 transition-transform group-hover:scale-110`}
                  >
                    <Icon className={`w-10 h-10 ${step.iconColor}`} />
                  </div>
                  <div className={`text-xs font-bold mb-1 tracking-wider ${step.stepColor}`}>
                    STEP {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {step.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-14">
          <Link
            to="/login"
            className="inline-block bg-[#E8A04A] hover:bg-[#d88d35] text-white font-bold px-8 py-3 rounded-full shadow-md transition-colors"
          >
            지금 시작하기 →
          </Link>
        </div>
      </div>
    </section>
  );
}