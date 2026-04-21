import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { sampleJobs } from "../../data/sampleJobs";
import { chatWithAi, getAiRecommendation } from "../../api/aiApi";
import { getQualificationsByCategory, getAllQualifications, getExamSchedules } from "../../api/qualificationApi";

export default function AiChat() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);

  // 채팅 상태
  const [messages, setMessages] = useState([
    { role: "bot", text: "안녕하세요! 저는 다온일 AI 어시스턴트입니다. 채용공고에 대해 궁금한 점이 있으시면 말씀해주세요! 😊" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatLoading, setCharLoading] = useState(false);

  // 필터링 상태
  const [filters, setFilters] = useState({
    region: "",
    jobCategory: "",
    workEnvironments: [],
  });

  // 추천 결과
  const [recommendations, setRecommendations] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [error, setError] = useState(null);

  // 지역 목록
  const regions = [
    "서울", "경기", "인천", "부산", "대구", "대전",
    "광주", "울산", "세종", "전북", "전남", "경북", "경남", "강원", "제주"
  ];

  // 직무 카테고리 (DB의 field 테이블 depth2 값과 일치해야 함)
  const jobCategories = [
    "사업관리", "경영", "경영(사회조사분석)", "경영(소비자전문상담)", "경영(컨벤션기획)",
    "회계", "사무", "생산관리", "금융.보험",
    "교육.자연.과학.사회과학", "법률.경찰.소방.교도.국방",
    "보건.의료", "보건.의료(국제의료관광코디네이터)", "사회복지.종교",
    "문화.예술", "디자인", "방송",
    "운전.운송", "영업.판매", "경비.청소", "이용.미용", "숙박.여행.오락.스포츠",
    "조리", "식당서비스",
    "건축", "토목", "조경", "도시.교통", "건설배관", "건설기계운전",
    "채광", "광해방지",
    "기계제작", "기계장비설비.설치", "철도", "조선", "항공", "자동차", "금형.공작기계",
    "금속.재료", "판금.제관.새시", "단조.주조", "용접", "도장.도금",
    "화공", "위험물",
    "섬유", "의복",
    "전기", "전자",
    "정보기술", "방송.무선", "통신",
    "식품", "제과.제빵",
    "인쇄.사진", "목재.가구.공예",
    "농업", "축산", "임업", "어업",
    "안전관리", "비파괴검사",
    "환경", "환경(자연환경,생물분류,토양환경)",
    "에너지.기상", "에너지.기상(기상)", "에너지.기상(신재생에너지)"
  ];

  // 작업환경
  const workEnvironmentOptions = [
    { id: "sitting", label: "앉아서 가능" },
    { id: "standing", label: "일부 서서 가능" },
    { id: "moving", label: "많이 이동" },
  ];

  // 가능한 질문 리스트 (필터 요구사항 포함)
  const suggestedQuestions = [
    { 
      text: "OO지역 OO직무 공고 추천해줘", 
      requiredFilters: ["region", "jobCategory"],
      type: "job",
      template: (region, jobCategory) => `${region} 지역의 ${jobCategory} 공고 추천해줘`
    },
    { 
      text: "OO지역 공고 추천해줘", 
      requiredFilters: ["region"],
      type: "job",
      template: (region) => `${region} 지역 공고 추천해줘`
    },
    { 
      text: "OO직무 공고 추천해줘", 
      requiredFilters: ["jobCategory"],
      type: "job",
      template: (_, jobCategory) => `${jobCategory} 공고 추천해줘`
    },
    { 
      text: "OO작업환경 직무 추천해줘", 
      requiredFilters: ["workEnvironments"],
      type: "job",
      template: (_, __, workEnv) => `${workEnv.join(", ")} 환경의 직무 추천해줘`
    },
    {
      text: "OO직무 자격증 추천해줘",
      requiredFilters: ["jobCategory"],
      type: "qualification",
      template: (_, jobCategory) => `${jobCategory}에 필요한 자격증 추천해줘`
    },
  ];

  // 필터 선택 상태 (질문 선택용)
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [tempFilters, setTempFilters] = useState({
    region: "",
    jobCategory: "",
    workEnvironments: [],
  });

  // 프로필 데이터 로드
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await fetch("/members/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const profile = data.data;
            const defaultEnvs = [];
            if (profile.envBothHands === "1") defaultEnvs.push("sitting");
            if (profile.envStndWalk === "1") defaultEnvs.push("standing");

            setFilters({
              region: profile.preferredRegion || "",
              jobCategory: profile.preferredJob || "",
              workEnvironments: defaultEnvs,
            });
          }
        }
      } catch (err) {
        console.error("프로필 로드 오류:", err);
      }
    };

    fetchProfileData();
  }, []);

  // 스크롤 자동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [recommendations]);

  // 채팅 전송
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setCharLoading(true);

    try {
      const isSearchQuery = /공고|직무|일자리|추천|찾아|알려/.test(userMsg);

      if (isSearchQuery && sampleJobs.length > 0) {
        // 필터링된 공고로 추천 요청
        let filteredJobs = sampleJobs;

        if (filters.region) {
          filteredJobs = filteredJobs.filter((job) =>
            job.location?.includes(filters.region) || job.compAddr?.includes(filters.region)
          );
        }

        if (filters.jobCategory) {
          filteredJobs = filteredJobs.filter((job) =>
            job.title?.includes(filters.jobCategory) ||
            job.jobCategory?.includes(filters.jobCategory) ||
            job.jobNm?.includes(filters.jobCategory)
          );
        }

        if (filteredJobs.length === 0) filteredJobs = sampleJobs;

        const response = await getAiRecommendation(userMsg, filteredJobs);

        if (response && response.explanation) {
          const topJobsText = response.topJobs
            ?.map((j, i) => `${i + 1}. ${j.title || j.jobNm} @ ${j.company || j.busplaName}`)
            .join("\n") || "";

          const fullResponse = `
✨ AI 추천 결과:

${topJobsText}

📝 추천 이유:
${response.explanation}`;

          setMessages((prev) => [...prev, { role: "bot", text: fullResponse }]);
          setRecommendations(response.topJobs || []);
        }
      } else {
        // 일반 채팅
        const aiResponse = await chatWithAi(userMsg);
        setMessages((prev) => [...prev, { role: "bot", text: aiResponse }]);
      }
    } catch (err) {
      console.error("채팅 오류:", err);
      setMessages((prev) => [...prev, { role: "bot", text: "죄송합니다. 요청을 처리할 수 없습니다." }]);
    } finally {
      setCharLoading(false);
    }
  };

  // 질문 선택 (필터 입력 페이지 표시)
  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setTempFilters({
      region: "",
      jobCategory: "",
      workEnvironments: [],
    });
  };

  // 임시 필터 변경
  const handleTempFilterChange = (key, value) => {
    if (key === "workEnvironments") {
      setTempFilters((prev) => {
        const updated = prev.workEnvironments.includes(value)
          ? prev.workEnvironments.filter((id) => id !== value)
          : [...prev.workEnvironments, value];
        return { ...prev, workEnvironments: updated };
      });
    } else {
      setTempFilters({ ...tempFilters, [key]: value });
    }
  };

  // 필터 선택 후 질문 전송
  const handleSendQuestionWithFilters = async () => {
    if (!selectedQuestion) return;

    // 필수 필터 체크
    const missingFilters = selectedQuestion.requiredFilters.filter((filterType) => {
      if (filterType === "region") return !tempFilters.region;
      if (filterType === "jobCategory") return !tempFilters.jobCategory;
      if (filterType === "workEnvironments") return tempFilters.workEnvironments.length === 0;
      return false;
    });

    if (missingFilters.length > 0) {
      alert(`다음 필터를 선택해주세요: ${missingFilters.join(", ")}`);
      return;
    }

    // 질문 생성
    const finalQuestion = selectedQuestion.template(
      tempFilters.region,
      tempFilters.jobCategory,
      tempFilters.workEnvironments.map((id) => {
        const opt = workEnvironmentOptions.find((o) => o.id === id);
        return opt?.label;
      })
    );

    setMessages((prev) => [...prev, { role: "user", text: finalQuestion }]);
    setSelectedQuestion(null);
    setRecLoading(true);

    try {
      // 자격증 추천
      if (selectedQuestion.type === "qualification") {
        const qualiList = await getQualificationsByCategory(tempFilters.jobCategory);
        
        if (qualiList.length > 0) {
          const qualiText = qualiList
            .slice(0, 5)
            .map((q, i) => `${i + 1}. ${q.name} (${q.jmcd})`)
            .join("\n");

          const fullResponse = `
✨ 자격증 추천 결과:

${qualiText}

📝 설명:
${tempFilters.jobCategory}에 필요한 자격증들입니다. 각 자격증의 상세 정보는 클릭하여 확인할 수 있습니다.`;

          setMessages((prev) => [...prev, { role: "bot", text: fullResponse }]);
          setQualifications(qualiList);
        } else {
          setMessages((prev) => [...prev, { role: "bot", text: "해당 직무분야의 자격증을 찾을 수 없습니다." }]);
        }
      } else {
        // 공고 추천
        let filteredJobs = sampleJobs;

        if (tempFilters.region) {
          filteredJobs = filteredJobs.filter((job) =>
            job.location?.includes(tempFilters.region) || job.compAddr?.includes(tempFilters.region)
          );
        }

        if (tempFilters.jobCategory) {
          filteredJobs = filteredJobs.filter((job) =>
            job.title?.includes(tempFilters.jobCategory) ||
            job.jobCategory?.includes(tempFilters.jobCategory) ||
            job.jobNm?.includes(tempFilters.jobCategory)
          );
        }

        if (filteredJobs.length === 0) filteredJobs = sampleJobs;

        const response = await getAiRecommendation(finalQuestion, filteredJobs);

        if (response && response.explanation) {
          const topJobsText = response.topJobs
            ?.map((j, i) => `${i + 1}. ${j.title || j.jobNm} @ ${j.company || j.busplaName}`)
            .join("\n") || "";

          const fullResponse = `
✨ AI 추천 결과:

${topJobsText}

📝 추천 이유:
${response.explanation}`;

          setMessages((prev) => [...prev, { role: "bot", text: fullResponse }]);
          setRecommendations(response.topJobs || []);
        }
      }
    } catch (err) {
      console.error("추천 오류:", err);
      setMessages((prev) => [...prev, { role: "bot", text: "죄송합니다. 요청을 처리할 수 없습니다." }]);
    } finally {
      setRecLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* 좌측: 채팅 영역 */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
        {/* 채팅 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-yellow-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 채팅 입력 영역 */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="메시지를 입력하세요..."
              disabled={chatLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={chatLoading || !inputMessage.trim()}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition"
            >
              {chatLoading ? "중..." : "전송"}
            </button>
          </div>
        </div>
      </div>

      {/* 우측: 필터/추천 정보 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-y-auto space-y-6">

        {/* 가능한 질문 */}
        {!selectedQuestion ? (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800">💡 추천 질문</h3>
            <div className="space-y-2">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectQuestion(question)}
                  disabled={recLoading}
                  className="w-full text-left px-3 py-2 text-sm bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition disabled:opacity-50 text-gray-800"
                >
                  ✨ {question.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // 필터 선택 모드
          <div className="space-y-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">필터 선택</h3>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            {/* 지역 필터 */}
            {selectedQuestion.requiredFilters.includes("region") && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">지역 선택</label>
                <select
                  value={tempFilters.region}
                  onChange={(e) => handleTempFilterChange("region", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">선택하세요</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 직무 필터 */}
            {selectedQuestion.requiredFilters.includes("jobCategory") && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">직무 선택</label>
                <select
                  value={tempFilters.jobCategory}
                  onChange={(e) => handleTempFilterChange("jobCategory", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">선택하세요</option>
                  {jobCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 작업환경 필터 */}
            {selectedQuestion.requiredFilters.includes("workEnvironments") && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">작업환경 선택</label>
                <div className="space-y-2">
                  {workEnvironmentOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempFilters.workEnvironments.includes(option.id)}
                        onChange={() => handleTempFilterChange("workEnvironments", option.id)}
                        className="w-4 h-4 text-yellow-500 rounded"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 전송 버튼 */}
            <button
              onClick={handleSendQuestionWithFilters}
              disabled={recLoading}
              className="w-full px-4 py-2 bg-yellow-500 text-white text-sm font-bold rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition"
            >
              {recLoading ? "처리 중..." : "질문 전송"}
            </button>
          </div>
        )}

        {/* 추천 결과 미리보기 */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800">📌 최근 공고 추천</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {recommendations.slice(0, 3).map((job, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:shadow-md transition text-sm"
                  onClick={() => navigate(`/jobs/${job.id || job.rno}`)}
                >
                  <p className="font-semibold text-gray-800 line-clamp-1">{job.title || job.jobNm}</p>
                  <p className="text-xs text-gray-600 line-clamp-1">{job.company || job.busplaName}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {Math.round(parseFloat(job.similarity) * 100)}% 유사
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 자격증 추천 결과 미리보기 */}
        {qualifications.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800">📌 최근 자격증 추천</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {qualifications.slice(0, 3).map((qual, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:shadow-md transition text-sm"
                >
                  <p className="font-semibold text-gray-800 line-clamp-1">{qual.name}</p>
                  <p className="text-xs text-gray-600 line-clamp-1">코드: {qual.jmcd}</p>
                  {qual.currentExam && (
                    <p className="text-xs text-blue-600 mt-1">
                      필기: {qual.currentExam.docExamStart ? new Date(qual.currentExam.docExamStart).toLocaleDateString() : "미정"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



