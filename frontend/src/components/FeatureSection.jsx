import { Users, FileText, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import matchImg from "../assets/images/main/featureSection/match.jpg";

export default function FeatureSection() {
  return (
    <section className="bg-[#FFF4F1] py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* 첫 번째 행: 맞춤형 매칭 시스템, 커뮤니티 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* 1. 맞춤형 매칭 영역 - 큰 카드 */}
          <Link to="/ai-recommend" className="md:col-span-2 flex bg-[#F4D19B] rounded-3xl p-6 items-center justify-between hover:shadow-lg transition-shadow cursor-pointer">
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
          </Link>

          {/* 2. 커뮤니티 영역 - 작은 카드 */}
          <Link to="/community" className="md:col-span-1 bg-[#DCE8C6] rounded-3xl p-6 flex flex-col justify-center hover:shadow-lg transition-shadow cursor-pointer">
            <Users className="w-8 h-8 text-green-700 mb-3" />
            <h3 className="text-lg font-bold mb-2">커뮤니티</h3>
            <p className="text-sm text-gray-700">
              서로의 경험을 나누고 응원하는 따뜻한 공간입니다.
            </p>
          </Link>
        </div>

        {/* 두 번째 행: 공지사항, 채용공고 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 3. 공지사항 영역 */}
          <Link to="/notice" className="bg-[#E8D5F2] rounded-3xl p-6 flex flex-col justify-center hover:shadow-lg transition-shadow cursor-pointer">
            <FileText className="w-8 h-8 text-purple-700 mb-3" />
            <h3 className="text-lg font-bold mb-2">공지사항</h3>
            <p className="text-sm text-gray-700">
              최신 채용 정보와 플랫폼 업데이트를 한눈에 확인하세요.
            </p>
          </Link>

          {/* 4. 채용공고 영역 */}
          <Link to="/jobs" className="bg-[#D4E4F7] rounded-3xl p-6 flex flex-col justify-center hover:shadow-lg transition-shadow cursor-pointer">
            <Briefcase className="w-8 h-8 text-blue-700 mb-3" />
            <h3 className="text-lg font-bold mb-2">채용공고</h3>
            <p className="text-sm text-gray-700">
              다양한 기업의 채용공고를 실시간으로 확인하세요.
            </p>
          </Link>
        </div>

      </div>
    </section>
  );
}