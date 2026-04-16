export function AiBanner() {
  return (
    <div className="w-full bg-[#2A1D16] py-10 h-[180px]">
      <div className="max-w-7xl mx-auto px-10 flex items-center justify-between h-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm">
            <i className="ri-chat-1-line"></i>
            <span>AI Recommend</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI 챗봇</h1>
          <p className="text-gray-300 text-sm">공고를 바탕으로 질문에 답하고 관련 공고를 추천합니다.</p>
        </div>
      </div>
    </div>
  );
}

export default AiBanner;
