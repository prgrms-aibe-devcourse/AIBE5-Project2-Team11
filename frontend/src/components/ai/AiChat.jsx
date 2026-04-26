import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { sampleJobs } from "../../data/sampleJobs";
import { chatWithAi, getAiRecommendation, getDisabilityBasedRecommendations } from "../../api/aiApi";
import { getQualificationsByCategory, getAllQualifications, getExamSchedules, searchQualifications, getQualificationDetail, getAiQualificationRecommendation } from "../../api/qualificationApi";

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
    jobMinor: "",
    workEnvironments: [],
  });

  // 추천 결과
  const [recommendations, setRecommendations] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  // 장애 유형별 추천 상태
  const [disabilityRecommendations, setDisabilityRecommendations] = useState([]);
  const [selectedDisabilityForQuestion, setSelectedDisabilityForQuestion] = useState("");
  const [selectedRegionForDisability, setSelectedRegionForDisability] = useState("");
  const [showDisabilityTypeSelector, setShowDisabilityTypeSelector] = useState(false);

  const disabilityTypes = ["지체장애", "시각장애", "청각장애", "언어장애", "지적장애", "정신장애"];

  // 자격증 상세 정보 관련 상태
  const [qualificationSearchInput, setQualificationSearchInput] = useState("");
  const [qualificationSearchResults, setQualificationSearchResults] = useState([]);
  const [selectedQualification, setSelectedQualification] = useState(null);

  // 지역 목록
  const regions = [
    "전체", "서울", "경기", "인천", "부산", "대구", "대전",
    "광주", "울산", "세종", "전북", "전남", "경북", "경남", "강원", "제주"
  ];

  // work_region에서 광역시/도 추출 함수
  const extractRegionFromAddress = (address) => {
    if (!address) return "";

    const regionMap = {
      "서울": "서울",
      "경기": "경기",
      "인천": "인천",
      "부산": "부산",
      "대구": "대구",
      "대전": "대전",
      "광주": "광주",
      "울산": "울산",
      "세종": "세종",
      "전북": "전북",
      "전남": "전남",
      "경북": "경북",
      "경남": "경남",
      "강원": "강원",
      "제주": "제주",
      "충남": "전남",
      "충북": "전북",
      "충청남": "전남",
      "충청북": "전북"
    };

    for (const [key, value] of Object.entries(regionMap)) {
      if (address.includes(key)) {
        return value;
      }
    }
    return "";
  };

  // 직무 카테고리 (대분류 -> 소분류 구조)
  const jobCategoryMap = {
    "관리자": ["관리직(임원·부서장)"],
    "사무 종사자": ["경영·행정·사무직"],
    "서비스 종사자": ["청소 및 기타 개인서비스직", "음식 서비스직", "돌봄 서비스직(간병·육아)", "미용·예식 서비스직", "여행·숙박·오락 서비스직", "경호·경비직", "스포츠·레크리에이션직"],
    "판매 종사자": ["영업·판매직"],
    "전문가 및 관련 종사자": ["보건·의료직", "예술·디자인·방송직", "사회복지·종교직", "금융·보험직", "교육직", "인문·사회과학 연구직", "법률직", "자연·생명과학 연구직", "정보통신 연구개발직 및 공학기술직", "제조 연구개발직 및 공학기술직", "건설·채굴 연구개발직 및 공학기술직"],
    "기능원 및 관련 기능 종사자": ["인쇄·목재·공예 및 기타 설치·정비·생산직", "금속·재료 설치·정비·생산직(판금·단조·주조·용접·도장 등)", "전기·전자 설치·정비·생산직", "기계 설치·정비·생산직", "화학·환경 설치·정비·생산직", "정보통신 설치·정비직", "건설·채굴직"],
    "장치·기계조작 및 조립 종사자": ["식품 가공·생산직", "섬유·의복 생산직", "운전·운송직"],
    "농림어업 숙련 종사자": ["농림어업직"],
    "단순노무 종사자": ["제조 단순직"]
  };

  // 작업환경 옵션
  const workEnvironmentOptions = [
    { id: "sitting", label: "앉아서 하는 일" },
    { id: "standing", label: "서서 하는 일" }
  ];

  // 자격증 추천용 직무 카테고리 (기존 depth2 값)
  const qualificationCategories = [
    "전체", "사업관리", "경영", "경영(사회조사분석)", "경영(소비자전문상담)", "경영(컨벤션기획)",
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

  // 가능한 질문 리스트 (필터 요구사항 포함)
  const suggestedQuestions = [
    { 
      text: "OO지역 OO공고 추천해줘",
      requiredFilters: ["region", "jobMajor", "jobMinor"],
      type: "job",
      template: (region, jobMajor, jobMinor) => `${region} 지역의 ${jobMinor} 공고 추천해줘`
    },
    {
      text: "OO분야 자격증 추천해줘",
      requiredFilters: ["qualificationCategory"],
      type: "qualification",
      template: (_, __, ___, ____, qualCat) => `${qualCat} 분야에 필요한 자격증 추천해줘`
    },
    {
      text: "OO자격증 상세 일정 알려줘",
      requiredFilters: [],
      type: "qualificationDetail",
      template: () => `자격증 상세 일정`
    },
    {
       text: "OO장애 유형에 맞는 OO지역 공고 추천해줘",
       requiredFilters: ["disabilityType"],
       type: "disability",
       template: (_, __, ___, ____, _____, disabilityType, region) => {
         let msg = `${disabilityType} 유형에 맞는`;
         if (region && region !== "전체") {
           msg += ` ${region} 지역`;
         }
         msg += ` 공고 추천`;
         return msg;
       }
    },
  ];

  // 필터 선택 상태 (질문 선택용)
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [tempFilters, setTempFilters] = useState({
    region: "",
    jobMajor: "",
    jobMinor: "",
    workEnvironments: [],
    qualificationCategory: "",
  });

  // 프로필 데이터 로드
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("authToken") || localStorage.getItem("accessToken");
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
              jobMinor: profile.preferredJob || "",
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
    setRecommendations([]);  // 새 추천 시작 전 초기화
    setQualifications([]);   // 새 추천 시작 전 초기화
    setCharLoading(true);

     try {
       const isSearchQuery = /공고|직무|일자리|추천|알려/.test(userMsg);

       if (isSearchQuery) {
         // 백엔드에서 실제 job_posting 데이터 조회
         let jobs = [];
         try {
           const response = await fetch("/api/jobs?size=1000", {
             method: "GET",
             headers: { "Content-Type": "application/json" }
           });
           if (response.ok) {
             const data = await response.json();
             // Page 객체에서 content 추출
             jobs = data.content || data.data || data || [];
           }
         } catch (err) {
           console.log("API 조회 실패, 샘플 데이터 사용:", err);
         }

         if (jobs.length === 0) jobs = sampleJobs;

         // 필터링된 공고로 추천 요청
         let filteredJobs = jobs;

         // 지역 필터링 (work_region에서 광역시/도 추출하여 비교)
         if (filters.region && filters.region !== "전체") {
           filteredJobs = filteredJobs.filter((job) => {
             const jobRegion = extractRegionFromAddress(job.work_region || job.location || job.compAddr || "");
             return jobRegion === filters.region;
           });
         }

         // 소분류 필터링 (job_category 정확히 매칭)
         if (filters.jobMinor) {
           filteredJobs = filteredJobs.filter((job) => {
             // job_category 또는 jobCategory (스네이크케이스, 카멜케이스 모두 지원)
             const jobCat = job.job_category || job.jobCategory || "";
             return jobCat === filters.jobMinor;
           });
         }

         console.log("=== 필터링 결과 ===");
         console.log("필터 조건 - 지역:", filters.region, "소분류:", filters.jobMinor);
         console.log("필터링된 공고 개수:", filteredJobs.length);
         console.log("필터링된 공고:", filteredJobs.map(j => ({
           title: j.jobNm || j.jobTitle,
           company: j.busplaName || j.companyName,
           jobCat: j.job_category || j.jobCategory,
           region: j.work_region
         })));

         if (filteredJobs.length === 0) {
           filteredJobs = jobs;
           console.log("필터링 결과 없음. 전체 공고로 대체됨");
         }

         const response = await getAiRecommendation(userMsg, filteredJobs, filters.region, filters.jobMinor);

         if (response && response.explanation) {
           const topJobsText = response.topJobs
             ?.map((j, i) => `${i + 1}. ${j.title || j.jobNm || j.jobTitle} @ ${j.company || j.busplaName || j.companyName || "미정"}`)
             .join("\n") || "";

           const fullResponse = `
✨ AI 추천 결과:

${topJobsText}

📝 추천 이유:
${response.explanation}`;

          setMessages((prev) => [...prev, { role: "bot", text: fullResponse }]);

          // AI 응답 후 다시 한번 필터링된 공고만 저장
          const reFilteredJobs = (response.topJobs || []).filter((job) => {
            // 지역 필터 재확인
            if (filters.region && filters.region !== "전체") {
              const jobRegion = extractRegionFromAddress(job.work_region || job.location || job.compAddr || "");
              if (jobRegion !== filters.region) return false;
            }
            // 소분류 필터 재확인
            if (filters.jobMinor) {
              const jobCat = job.job_category || job.jobCategory || "";
              if (jobCat !== filters.jobMinor) return false;
            }
            return true;
          });
          setRecommendations(reFilteredJobs);
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
    setRecommendations([]);  // 이전 추천 결과 초기화
    setQualifications([]);   // 이전 자격증 추천 초기화
    setTempFilters({
      region: "",
      jobMajor: "",
      jobMinor: "",
      workEnvironments: [],
      qualificationCategory: "",
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
    } else if (key === "jobMajor") {
      // 대분류 선택 시 소분류 초기화
      setTempFilters({ ...tempFilters, [key]: value, jobMinor: "" });
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
      if (filterType === "jobMajor") return !tempFilters.jobMajor;
      if (filterType === "jobMinor") return !tempFilters.jobMinor;
      if (filterType === "workEnvironments") return tempFilters.workEnvironments.length === 0;
      if (filterType === "qualificationCategory") return !tempFilters.qualificationCategory;
      if (filterType === "disabilityType") return !selectedDisabilityForQuestion;
      return false;
    });

    if (missingFilters.length > 0) {
      alert(`다음 필터를 선택해주세요: ${missingFilters.join(", ")}`);
      return;
    }

    // 질문 생성
    const finalQuestion = selectedQuestion.template(
      tempFilters.region,
      tempFilters.jobMajor,
      tempFilters.jobMinor,
      tempFilters.workEnvironments.map((id) => {
        const opt = workEnvironmentOptions.find((o) => o.id === id);
        return opt?.label;
      }),
      tempFilters.qualificationCategory,
      selectedDisabilityForQuestion,
      selectedRegionForDisability
    );

    setMessages((prev) => [...prev, { role: "user", text: finalQuestion }]);
    setSelectedQuestion(null);
    setRecommendations([]);  // 새 추천 전 초기화
    setQualifications([]);   // 새 추천 전 초기화
    setRecLoading(true);

    try {
      // 장애 유형별 추천
      if (selectedQuestion.type === "disability") {
        const disabilityResponse = await getDisabilityBasedRecommendations(
          selectedDisabilityForQuestion,
          5,
          selectedRegionForDisability || "전체"
        );

        if (disabilityResponse && disabilityResponse.success) {
          const recs = disabilityResponse.recommendations || [];
          const explanation = disabilityResponse.explanation || "";

          const recsText = recs
            .map((job, i) => `${i + 1}. ${job.title} @ ${job.company || "미정"} (점수: ${(job.matchScore * 100).toFixed(1)}%)`)
            .join("\n");

          const fullResponse = `
🏥 ${selectedDisabilityForQuestion}${selectedRegionForDisability && selectedRegionForDisability !== "전체" ? ` (${selectedRegionForDisability})` : ""} 맞춤 공고 TOP 5:

${recsText}

📊 분석:
${explanation}`;

          setMessages((prev) => [...prev, { role: "bot", text: fullResponse }]);
          setDisabilityRecommendations(recs);
        } else {
          const errorMsg = disabilityResponse?.error || "추천을 불러올 수 없습니다";
          setMessages((prev) => [...prev, { role: "bot", text: `죄송합니다. ${errorMsg}` }]);
        }
       } else if (selectedQuestion.type === "qualification") {
         // AI 기반 자격증 추천 (depth2 필터링으로 자동 조회)
         const aiRecommendation = await getAiQualificationRecommendation(tempFilters.qualificationCategory);

         if (aiRecommendation && aiRecommendation.success) {
           const qualifications = aiRecommendation.qualifications || [];
           const explanation = aiRecommendation.explanation || "";

           const qualiText = qualifications
             .slice(0, 10)
             .map((name, i) => `${i + 1}. ${name}`)
             .join("\n");

           const fullResponse = `
✨ 자격증 추천 결과:

${qualiText}

📝 설명:
${explanation}

각 자격증의 상세 정보를 알고 싶으시면 자격증 이름을 입력하여 검색하실 수 있습니다.`;

           setMessages((prev) => [...prev, { role: "bot", text: fullResponse }]);

           // 각 자격증에 대해 검색해서 jmcd 정보 추가
           const qualiList = [];
           for (const name of qualifications) {
             try {
               const searchResults = await searchQualifications(name);
               if (searchResults && searchResults.length > 0) {
                 const qual = searchResults[0];
                 qualiList.push({
                   id: qualifications.indexOf(name),
                   name: name,
                   jmcd: qual.jmcd || ""
                 });
               } else {
                 qualiList.push({
                   id: qualifications.indexOf(name),
                   name: name,
                   jmcd: ""
                 });
               }
             } catch (err) {
               console.error(`자격증 검색 오류 (${name}):`, err);
               qualiList.push({
                 id: qualifications.indexOf(name),
                 name: name,
                 jmcd: ""
               });
             }
           }
           setQualifications(qualiList);
         } else {
           const errorMsg = aiRecommendation?.error || "자격증을 불러올 수 없습니다";
           setMessages((prev) => [...prev, { role: "bot", text: `죄송합니다. ${errorMsg}` }]);
         }
      } else if (selectedQuestion.type === "qualificationDetail") {
        // 자격증 상세 정보 검색 모드
        setMessages((prev) => [...prev, { role: "bot", text: "자격증 이름을 입력하세요. 예: 정보처리, 리눅스" }]);
        setSelectedQuestion(null);
      } else {
        // 공고 추천 - 백엔드에서 실제 데이터 조회
        let jobs = [];
        try {
          const response = await fetch("/api/jobs?size=1000", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
          if (response.ok) {
            const data = await response.json();
            // Page 객체에서 content 추출
            jobs = data.content || data.data || data || [];
          }
        } catch (err) {
          console.log("API 조회 실패, 샘플 데이터 사용:", err);
        }

        if (jobs.length === 0) jobs = sampleJobs;

        let filteredJobs = jobs;

        // 지역 필터링 (광역시/도 수준)
        if (tempFilters.region && tempFilters.region !== "전체") {
          filteredJobs = filteredJobs.filter((job) => {
            const jobRegion = extractRegionFromAddress(job.work_region || job.location || job.compAddr || "");
            return jobRegion === tempFilters.region;
          });
        }

        // 소분류 필터링 (job_category 정확히 매칭)
        if (tempFilters.jobMinor) {
          filteredJobs = filteredJobs.filter((job) => {
            // job_category 또는 jobCategory (스네이크케이스, 카멜케이스 모두 지원)
            const jobCat = job.job_category || job.jobCategory || "";
            return jobCat === tempFilters.jobMinor;
          });
        }

        if (filteredJobs.length === 0) filteredJobs = jobs;

        const response = await getAiRecommendation(finalQuestion, filteredJobs, tempFilters.region, tempFilters.jobMinor);

        if (response && response.explanation) {
          const topJobsText = response.topJobs
            ?.map((j, i) => `${i + 1}. ${j.title || j.jobNm || j.jobTitle} @ ${j.company || j.busplaName || j.companyName || "미정"}`)
            .join("\n") || "";

          const fullResponse = `
✨ AI 추천 결과:

${topJobsText}

📝 추천 이유:
${response.explanation}`;

          setMessages((prev) => [...prev, { role: "bot", text: fullResponse }]);
          
          // AI 응답 후 다시 한번 필터링된 공고만 저장
          const reFilteredJobs = (response.topJobs || []).filter((job) => {
            // 지역 필터 재확인
            if (tempFilters.region && tempFilters.region !== "전체") {
              const jobRegion = extractRegionFromAddress(job.work_region || job.location || job.compAddr || "");
              if (jobRegion !== tempFilters.region) return false;
            }
            // 소분류 필터 재확인
            if (tempFilters.jobMinor) {
              const jobCat = job.job_category || job.jobCategory || "";
              if (jobCat !== tempFilters.jobMinor) return false;
            }
            return true;
          });
          setRecommendations(reFilteredJobs);
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
          // 필터 선택 모드 또는 자격증 상세 검색 모드
          <>
            {selectedQuestion.type === "qualificationDetail" ? (
              // 자격증 상세 정보 검색 모드
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">자격증 검색</h3>
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>

                {/* 자격증 검색 입력 */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">자격증 이름 검색</label>
                  <input
                    type="text"
                    value={qualificationSearchInput}
                    onChange={async (e) => {
                      const keyword = e.target.value;
                      setQualificationSearchInput(keyword);
                      
                      if (keyword.trim().length > 0) {
                        const results = await searchQualifications(keyword);
                        setQualificationSearchResults(results);
                      } else {
                        setQualificationSearchResults([]);
                      }
                    }}
                    placeholder="예: 정보처리, 리눅스..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 검색 결과 */}
                {qualificationSearchResults.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">검색 결과</label>
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                       {qualificationSearchResults.map((qual, idx) => (
                         <button
                           key={idx}
                           type="button"
                           onClick={async (e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             
                             try {
                               console.log(`검색 결과 클릭: ${qual.name}`);
                               const detail = await getQualificationDetail(qual.name);
                               console.log("상세 정보 응답:", detail);
                               
                               if (!detail) {
                                 console.error("응답이 없습니다");
                                 alert("자격증 정보를 불러올 수 없습니다");
                                 return;
                               }
                               
                               if (detail.success === false) {
                                 console.error("API 오류:", detail.error);
                                 alert(detail.error || "자격증 정보를 불러올 수 없습니다");
                                 return;
                               }
                               
                               // 시험 일정 포맷팅
                               const formatSchedule = (schedule) => {
                                 const formatDate = (dateStr) => {
                                   if (!dateStr) return null;
                                   try {
                                     return new Date(dateStr).toLocaleDateString('ko-KR');
                                   } catch (e) {
                                     return null;
                                   }
                                 };
                                 
                                 let text = `【${schedule.year}년 ${schedule.period}회】\n`;
                                 
                                 // 필기시험
                                 if (schedule.docExam) {
                                   text += `┌ 필기시험\n`;
                                   if (schedule.docExam.regStart && schedule.docExam.regEnd) {
                                     const regStart = formatDate(schedule.docExam.regStart);
                                     const regEnd = formatDate(schedule.docExam.regEnd);
                                     if (regStart && regEnd) text += `│ • 접수: ${regStart} ~ ${regEnd}\n`;
                                   }
                                   if (schedule.docExam.examStart && schedule.docExam.examEnd) {
                                     const examStart = formatDate(schedule.docExam.examStart);
                                     const examEnd = formatDate(schedule.docExam.examEnd);
                                     if (examStart && examEnd) text += `│ • 시험: ${examStart} ~ ${examEnd}\n`;
                                   }
                                   if (schedule.docExam.passAnnounce) {
                                     const passAnnounce = formatDate(schedule.docExam.passAnnounce);
                                     if (passAnnounce) text += `│ • 합격공고: ${passAnnounce}\n`;
                                   }
                                 }
                                 
                                 // 실기시험
                                 if (schedule.pracExam && (schedule.pracExam.regStart || schedule.pracExam.examStart)) {
                                   text += `└ 실기시험\n`;
                                   if (schedule.pracExam.regStart && schedule.pracExam.regEnd) {
                                     const regStart = formatDate(schedule.pracExam.regStart);
                                     const regEnd = formatDate(schedule.pracExam.regEnd);
                                     if (regStart && regEnd) text += `  • 접수: ${regStart} ~ ${regEnd}\n`;
                                   }
                                   if (schedule.pracExam.examStart && schedule.pracExam.examEnd) {
                                     const examStart = formatDate(schedule.pracExam.examStart);
                                     const examEnd = formatDate(schedule.pracExam.examEnd);
                                     if (examStart && examEnd) text += `  • 시험: ${examStart} ~ ${examEnd}\n`;
                                   }
                                   if (schedule.pracExam.passAnnounce) {
                                     const passAnnounce = formatDate(schedule.pracExam.passAnnounce);
                                     if (passAnnounce) text += `  • 합격공고: ${passAnnounce}\n`;
                                   }
                                 }
                                 
                                 return text;
                               };

                               const examSchedulesText = detail.examSchedules && detail.examSchedules.length > 0
                                 ? detail.examSchedules.map(formatSchedule).join("\n")
                                 : "시험일정 정보 없음";

                               const detailText = `
📚 자격증 상세 일정

자격증명: ${detail.name}
자격증 코드: ${detail.jmcd}
${detail.depth1 ? `직무분야: ${detail.depth1} > ${detail.depth2}` : ''}
${detail.course ? `교육과정: ${detail.course}` : ''}

📅 시험 일정 정보
${examSchedulesText}

총 ${detail.scheduleCount || 0}개 회차의 일정이 있습니다.
이 자격증에 대해 더 알고 싶은 점이 있으신가요?`;
                                 
                                 console.log("메시지 추가 전:", detailText);
                                 
                                 // 메시지 추가 (먼저 사용자 질문, 그 다음 봇 답변)
                                 setMessages((prev) => [
                                   ...prev,
                                   { role: "user", text: `${detail.name} 상세 일정 알려줘` },
                                   { role: "bot", text: detailText }
                                 ]);
                                 
                                 // 그 다음 상태 정리 (선택 사항 초기화)
                                 setTimeout(() => {
                                   setSelectedQuestion(null);
                                   setQualificationSearchInput("");
                                   setQualificationSearchResults([]);
                                 }, 100);
                             } catch (error) {
                               console.error("검색 결과 클릭 오류:", error);
                               alert("오류가 발생했습니다: " + error.message);
                             }
                           }}
                           className="w-full text-left px-3 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition text-sm text-gray-800 cursor-pointer active:bg-blue-100"
                         >
                           <div className="font-semibold">{qual.name}</div>
                           <div className="text-xs text-gray-600">{qual.jmcd}</div>
                         </button>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 기본 필터 선택 모드
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

            {/* 대분류 필터 */}
            {selectedQuestion.requiredFilters.includes("jobMajor") && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">직무 대분류</label>
                <select
                  value={tempFilters.jobMajor}
                  onChange={(e) => handleTempFilterChange("jobMajor", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">선택하세요</option>
                  {Object.keys(jobCategoryMap).map((major) => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 소분류 필터 */}
            {selectedQuestion.requiredFilters.includes("jobMinor") && tempFilters.jobMajor && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">직무 소분류</label>
                <select
                  value={tempFilters.jobMinor}
                  onChange={(e) => handleTempFilterChange("jobMinor", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">선택하세요</option>
                  {jobCategoryMap[tempFilters.jobMajor]?.map((minor) => (
                    <option key={minor} value={minor}>{minor}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 자격증 카테고리 필터 */}
            {selectedQuestion.requiredFilters.includes("qualificationCategory") && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">분야 선택</label>
                <select
                  value={tempFilters.qualificationCategory}
                  onChange={(e) => handleTempFilterChange("qualificationCategory", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">선택하세요</option>
                  {qualificationCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 장애 유형 필터 */}
            {selectedQuestion.requiredFilters.includes("disabilityType") && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">🏥 장애 유형 선택</label>
                  <div className="grid grid-cols-2 gap-2">
                    {disabilityTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedDisabilityForQuestion(type)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg transition ${
                          selectedDisabilityForQuestion === type
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">📍 지역 필터 (선택)</label>
                  <select
                    value={selectedRegionForDisability}
                    onChange={(e) => setSelectedRegionForDisability(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">지역 선택 안함 (전체)</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
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
          </>
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
                  onClick={() => {
                    const jobId = job.id || job.job_posting_id || job.rno;
                    if (jobId) {
                      navigate(`/jobs/${jobId}`);
                    } else {
                      console.error("공고 ID를 찾을 수 없습니다:", job);
                      alert("공고 상세 정보를 불러올 수 없습니다.");
                    }
                  }}
                >
                  <p className="font-semibold text-gray-800 line-clamp-1">{job.title || job.jobNm}</p>
                  <p className="text-xs text-gray-600 line-clamp-1">{job.company || job.busplaName}</p>
                  {job.similarity && !isNaN(parseFloat(job.similarity)) && (
                    <p className="text-xs text-yellow-600 mt-1">
                      {Math.round(parseFloat(job.similarity) * 100)}% 유사
                    </p>
                  )}
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

        {/* 장애 유형별 추천 결과 미리보기 */}
        {disabilityRecommendations.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-bold text-gray-800">🏥 {selectedDisabilityForQuestion} 맞춤 공고 TOP 5</h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {disabilityRecommendations.map((job, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:shadow-md transition text-sm"
                  onClick={() => {
                    const jobId = job.id || job.job_posting_id;
                    if (jobId) {
                      navigate(`/jobs/${jobId}`);
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-800 line-clamp-1 flex-1">{job.title}</p>
                    <span className="ml-2 text-xs font-bold text-white bg-green-600 px-2 py-1 rounded">
                      {(job.matchScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-1">{job.company || "미정"}</p>
                  <p className="text-xs text-gray-500 mt-1">{job.work_region || job.region || "지역 미정"}</p>
                  {job.jobCategoryVector && Object.keys(job.jobCategoryVector).length > 0 && (
                    <div className="text-xs text-green-700 mt-2">
                      <span className="font-semibold">직업: </span>
                      {Object.entries(job.jobCategoryVector)
                        .filter(([_, weight]) => weight > 0.2)
                        .map(([category, weight]) => `${category}(${(weight * 100).toFixed(0)}%)`)
                        .join(", ")
                      }
                    </div>
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



