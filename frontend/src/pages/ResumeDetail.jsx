import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import defaultUserPhoto from "../assets/images/resume/defalut_userPhoto.jpeg";

export default function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const extractErrorMessage = async (response) => {
      try {
        const errorBody = await response.json();
        return (
          errorBody?.message ||
          errorBody?.detail ||
          errorBody?.error ||
          "이력서 상세 조회에 실패했습니다."
        );
      } catch {
        return "이력서 상세 조회에 실패했습니다.";
      }
    };

    const fetchResumeDetail = async () => {
      try {
        const token = localStorage.getItem("authToken") || localStorage.getItem("accessToken");
        if (!token) {
          setError("로그인이 필요합니다.");
          return;
        }

        const response = await fetch(`/resumes/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const serverMessage = await extractErrorMessage(response);
          throw new Error(serverMessage);
        }

        const data = await response.json();
        setResume(data);
      } catch (err) {
        console.error('이력서 상세 조회에 실패했습니다:', err);
        setError(err.message || '이력서 상세 조회에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResumeDetail();
    }
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-gray-500">이력서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-red-500">{error || '이력서를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate("/memberMypage")}
            className="mt-4 text-sm bg-yellow-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 서브 컨트롤 바 */}
      <div className="bg-white border border-[#F3E8D0] rounded-xl p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/memberMypage")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-sm font-medium text-[#8B6B4A] hover:text-[#5D4037] border border-[#E8D5C4] rounded-lg hover:bg-[#FFF9F3] transition-all duration-200 hover:shadow-sm group"
          >
            <i className="ri-sparkling-2-line group-hover:scale-110 transition-transform duration-200"></i>
            목록
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-[#5D4037]">{resume.title}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/memberMypage/resumes/${id}/edit`)}
            className="text-sm border border-[#D7B89C] text-[#8D6E63] px-3 py-1.5 rounded-lg hover:bg-[#FFF3E0] transition-colors"
          >
            수정
          </button>
          <button
            onClick={handlePrint}
            className="text-sm bg-yellow-500 hover:opacity-90 text-white px-3 py-1.5 rounded-lg transition-opacity flex items-center gap-1.5"
          >
            <i className="ri-printer-line"></i> 인쇄 / PDF
          </button>
        </div>
      </div>

      {/* 이력서 본문 */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden print:shadow-none print:rounded-none">
        {/* 상단 프로필 헤더 */}
        <div className="bg-gradient-to-r from-[#5D4037] to-[#8D6E63] px-8 py-8 text-white">
          <div className="flex items-center gap-6">
            <img
              src={resume.userPhoto ? `http://localhost:8080${resume.userPhoto}` : defaultUserPhoto}
              alt="프로필 사진"
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                console.error('프로필 이미지 로드 실패:', e.target.src);
                e.target.src = defaultUserPhoto; // 로드 실패 시 기본 이미지로 변경
              }}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{resume.name}</h1>
              <p className="text-orange-200 text-sm mb-4">{resume.title}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-orange-100">
                {resume.email && (
                  <span className="flex items-center gap-1">
                    <i className="ri-mail-line"></i> {resume.email}
                  </span>
                )}
                {resume.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <i className="ri-phone-line"></i> {resume.phoneNumber}
                  </span>
                )}
                {resume.address && (
                  <span className="flex items-center gap-1">
                    <i className="ri-map-pin-line"></i> {resume.address}
                  </span>
                )}
                {resume.birthDate && (
                  <span className="flex items-center gap-1">
                    <i className="ri-cake-line"></i> {resume.birthDate}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* 자기소개 */}
          {resume.selfIntroduction && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-3">
                자기소개
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {resume.selfIntroduction}
              </p>
            </section>
          )}

          {/* 경력 */}
          {resume.careers && resume.careers.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-4">
                경력 사항
              </h2>
              <div className="space-y-5">
                {resume.careers.map((exp, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1 flex-shrink-0" />
                      {idx < resume.careers.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                        <span className="font-semibold text-[#5D4037]">{exp.companyName}</span>
                        <span className="text-sm text-yellow-700">{exp.position}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{exp.startDate} ~ {exp.endDate}</p>
                      <p className="text-sm text-gray-600">{exp.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 학력 */}
          {resume.educations && resume.educations.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-4">
                학력 사항
              </h2>
              <div className="space-y-3">
                {resume.educations.map((edu, idx) => (
                  <div key={idx} className="flex items-start justify-between">
                    <div>
                      <span className="font-medium text-[#5D4037]">{edu.schoolName}</span>
                      <span className="text-sm text-gray-500 ml-2">{edu.major}</span>
                      <span className="text-xs text-yellow-700 ml-2 border border-yellow-200 bg-yellow-50 px-1.5 py-0.5 rounded">
                        {edu.degree}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{edu.startDate} ~ {edu.endDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 스킬 */}
          {resume.skills && resume.skills.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-3">
                보유 스킬
              </h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill.skillKeyword}
                    className="text-sm bg-[#FFF8F0] text-[#8D6E63] border border-[#F3E8D0] px-3 py-1 rounded-full"
                  >
                    {skill.skillKeyword}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 자격증 */}
          {resume.certificates && resume.certificates.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-3">
                자격증
              </h2>
              <div className="space-y-2">
                {resume.certificates.map((cert, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      <span className="font-medium text-[#5D4037]">{cert.certificateName}</span>
                    </div>
                    <span className="text-xs text-gray-400">{cert.acquiredDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 언어 자격증 */}
          {resume.langQualifications && resume.langQualifications.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-3">
                언어 자격증
              </h2>
              <div className="space-y-2">
                {resume.langQualifications.map((lang, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      <span className="font-medium text-[#5D4037]">{lang.languageName} - {lang.testName}</span>
                      <span className="text-gray-400">점수: {lang.score}</span>
                    </div>
                    <span className="text-xs text-gray-400">취득일: {lang.acquiredDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 장애 정보 */}
          {resume.resumeDisabilities && resume.resumeDisabilities.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-3">
                장애 정보
              </h2>
              <div className="space-y-2">
                {resume.resumeDisabilities.map((dis, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    <span className="font-medium text-[#5D4037]">{dis.disabilityName}</span>
                    <span className="text-gray-400">{dis.description}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 포트폴리오 URL */}
          {resume.portfolioUrl && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-3">
                포트폴리오
              </h2>
              <a
                href={resume.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {resume.portfolioUrl}
              </a>
            </section>
          )}
        </div>

        <div className="px-8 py-4 bg-[#FFF8F0] border-t border-[#F3E8D0] text-right">
          <p className="text-xs text-gray-400">최종 수정일: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}