import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDisabilityBasedRecommendations } from "../../api/aiApi";

export default function DisabilityJobRecommendation() {
  const navigate = useNavigate();
  const [selectedDisability, setSelectedDisability] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [showResults, setShowResults] = useState(false);

  const disabilityTypes = ["지체장애", "시각장애", "청각장애", "언어장애", "지적장애", "정신장애"];

  const handleRecommendation = async (disabilityType) => {
    try {
      setLoading(true);
      setSelectedDisability(disabilityType);
      setRecommendations([]);

      const response = await getDisabilityBasedRecommendations(disabilityType, 5);

      if (response && response.success) {
        setRecommendations(response.recommendations || []);
        setExplanation(response.explanation || "");
        setShowResults(true);
      }
    } catch (error) {
      console.error("추천 오류:", error);
      alert("추천을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">🏥 장애 유형별 공고 추천</h2>
      <p className="text-gray-600">당신의 장애 유형에 맞는 공고를 추천해드립니다</p>

      {!showResults ? (
        <div className="grid grid-cols-2 gap-2">
          {disabilityTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleRecommendation(type)}
              disabled={loading}
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 font-semibold text-sm"
            >
              {type}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setShowResults(false)}
            className="text-sm text-blue-600 hover:text-blue-800 mb-2"
          >
            ← 다시 선택
          </button>

          <h3 className="text-lg font-bold text-gray-800">{selectedDisability} 맞춤 공고 TOP 5</h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {recommendations.map((job, idx) => (
              <div
                key={idx}
                className="p-4 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:shadow-md transition"
                onClick={() => {
                  const jobId = job.id || job.job_posting_id;
                  if (jobId) {
                    navigate(`/jobs/${jobId}`);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 line-clamp-2">{job.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{job.company || "미정"}</p>
                  </div>
                  <span className="ml-2 text-lg font-bold text-green-700 bg-green-200 px-3 py-1 rounded">
                    {(job.matchScore * 100).toFixed(1)}%
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-2">{job.work_region || job.region || "지역 미정"}</p>

                {job.jobCategoryVector && Object.keys(job.jobCategoryVector).length > 0 && (
                  <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
                    <span className="font-semibold">주요 직업: </span>
                    {Object.entries(job.jobCategoryVector)
                      .filter(([_, weight]) => weight > 0.2)
                      .map(([category, weight]) => `${category}(${(weight * 100).toFixed(0)}%)`)
                      .join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>

          {explanation && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">📊 추천 분석</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{explanation}</p>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}
    </div>
  );
}

