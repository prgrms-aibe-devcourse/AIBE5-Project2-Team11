import { Users, Rocket, MessageCircle, Phone } from "lucide-react";
import matchImg from "../assets/images/main/featureSection/match.jpg";
import counselImg from "../assets/images/main/featureSection/counsel.jpg"

export default function FeatureSection() {
  return (
    <section className="bg-[#FFF4F1] py-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 1. 맞춤형 매칭 영역 - 큰 카드 */}
        <div className="md:col-span-2 flex bg-[#F4D19B] rounded-3xl p-6 items-center justify-between">
          <div className="max-w-xs">
            <h3 className="text-xl font-bold mb-2">맞춤형 매칭 시스템</h3>
            <p className="text-sm text-gray-700 mb-4">
              사용자의 편의와 역량에 최적화된 채용 정보를 AI가 분석하여 가장 먼저 제안합니다.
            </p>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm">
              시작하기 →
            </button>
          </div>
          {/* 이미지 자리 */}
          <img src={matchImg} alt="매칭 이미지"
            className="w-40 h-40 object-cover rounded-2xl hidden md:block"/>
        </div>

        {/* 2. 커뮤니티 영역 - 작은 카드 */}
        <div className="md:col-span-1 bg-[#DCE8C6] rounded-3xl p-6 flex flex-col justify-center">
          <Users className="w-8 h-8 text-green-700 mb-3" />
          <h3 className="text-lg font-bold mb-2">커뮤니티</h3>
          <p className="text-sm text-gray-700">
            서로의 경험을 나누고 응원하는 따뜻한 공간입니다.
          </p>
        </div>

        {/* 3. 빠른 취업 영역 - 작은 카드 */}
        <div className="md:col-span-1 bg-[#F1D6CC] rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <Rocket className="w-8 h-8 text-orange-500 mb-3" />
          <h3 className="font-semibold mb-1">빠른 취업 성공</h3>
          <p className="text-sm text-gray-600">
            지원부터 합격까지 평균 2주 소요
          </p>
        </div>

        {/* 4. 상담 지원 영역 - 큰 카드 */}
        <div className="md:col-span-2 bg-[#EFC4B6] rounded-3xl p-6 flex items-center gap-4">
          {/* 이미지 자리 */}
          <img src={counselImg} alt="상담 이미지"
            className="w-24 h-24 object-cover rounded-2xl"/>

          <div>
            <h3 className="text-lg font-bold mb-2">전문 상담 지원</h3>
            <p className="text-sm text-gray-700 mb-3">
              전문 직업 상담사가 여러분의 꿈을 향한 첫걸음을 1:1로 밀착 지원합니다.
            </p>

            <div className="flex gap-2">
              <button className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm">
                <MessageCircle className="w-4 h-4" />
                실시간 채팅
              </button>
              <button className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm">
                <Phone className="w-4 h-4" />
                전화 상담
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}