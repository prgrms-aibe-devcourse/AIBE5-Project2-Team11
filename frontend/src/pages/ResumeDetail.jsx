import { useParams, useNavigate } from "react-router-dom";

const sampleResumes = [
  {
    id: "1",
    title: "프론트엔드 개발자 이력서",
    updatedAt: "2025-03-10",
    isDefault: false,
    profile: {
      name: "김다온",
      email: "daon.kim@email.com",
      phone: "010-1234-5678",
      address: "서울특별시 마포구",
      birthDate: "1995-05-15",
      summary:
        "5년 경력의 프론트엔드 개발자입니다. React와 TypeScript를 주로 사용하며 사용자 중심의 UI를 개발합니다. 접근성 개선과 성능 최적화 경험이 있습니다.",
    },
    experiences: [
      {
        company: "A기업",
        position: "프론트엔드 개발자",
        period: "2020.03 ~ 2025.02",
        description: "React 기반 웹 서비스 개발, WCAG 2.1 접근성 개선 작업 주도",
      },
      {
        company: "B기업",
        position: "주니어 개발자",
        period: "2018.06 ~ 2020.02",
        description: "HTML/CSS/JavaScript 기반 퍼블리싱 및 UI 개발",
      },
    ],
    educations: [
      {
        school: "○○대학교",
        major: "컴퓨터공학과",
        period: "2013.03 ~ 2018.02",
        degree: "학사",
      },
    ],
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git", "Figma"],
    certificates: [{ name: "정보처리기사", issuer: "한국산업인력공단", date: "2019.08" }],
  },
];

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

  return (
    <div className="space-y-4">
      {/* 서브 컨트롤 바 */}
      <div className="bg-white border border-[#F3E8D0] rounded-xl p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/memberMypage/resumes")}
            className="text-[#8D6E63] hover:text-[#5D4037] text-sm flex items-center gap-1"
          >
            <i className="ri-arrow-left-line"></i> 목록
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
          <h1 className="text-3xl font-bold mb-1">{resume.profile.name}</h1>
          <p className="text-orange-200 text-sm mb-4">{resume.title}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-orange-100">
            {resume.profile.email && (
              <span className="flex items-center gap-1">
                <i className="ri-mail-line"></i> {resume.profile.email}
              </span>
            )}
            {resume.profile.phone && (
              <span className="flex items-center gap-1">
                <i className="ri-phone-line"></i> {resume.profile.phone}
              </span>
            )}
            {resume.profile.address && (
              <span className="flex items-center gap-1">
                <i className="ri-map-pin-line"></i> {resume.profile.address}
              </span>
            )}
            {resume.profile.birthDate && (
              <span className="flex items-center gap-1">
                <i className="ri-cake-line"></i> {resume.profile.birthDate}
              </span>
            )}
          </div>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* 자기소개 */}
          {resume.profile.summary && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-3">
                자기소개
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {resume.profile.summary}
              </p>
            </section>
          )}

          {/* 경력 */}
          {resume.experiences.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-4">
                경력 사항
              </h2>
              <div className="space-y-5">
                {resume.experiences.map((exp, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1 flex-shrink-0" />
                      {idx < resume.experiences.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                        <span className="font-semibold text-[#5D4037]">{exp.company}</span>
                        <span className="text-sm text-yellow-700">{exp.position}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{exp.period}</p>
                      <p className="text-sm text-gray-600">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 학력 */}
          {resume.educations.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-4">
                학력 사항
              </h2>
              <div className="space-y-3">
                {resume.educations.map((edu, idx) => (
                  <div key={idx} className="flex items-start justify-between">
                    <div>
                      <span className="font-medium text-[#5D4037]">{edu.school}</span>
                      <span className="text-sm text-gray-500 ml-2">{edu.major}</span>
                      <span className="text-xs text-yellow-700 ml-2 border border-yellow-200 bg-yellow-50 px-1.5 py-0.5 rounded">
                        {edu.degree}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{edu.period}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 스킬 */}
          {resume.skills.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-3">
                보유 스킬
              </h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm bg-[#FFF8F0] text-[#8D6E63] border border-[#F3E8D0] px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 자격증 */}
          {resume.certificates.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[#5D4037] border-b-2 border-yellow-400 pb-1 mb-3">
                자격증
              </h2>
              <div className="space-y-2">
                {resume.certificates.map((cert, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      <span className="font-medium text-[#5D4037]">{cert.name}</span>
                      <span className="text-gray-400">{cert.issuer}</span>
                    </div>
                    <span className="text-xs text-gray-400">{cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="px-8 py-4 bg-[#FFF8F0] border-t border-[#F3E8D0] text-right">
          <p className="text-xs text-gray-400">최종 수정일: {resume.updatedAt}</p>
        </div>
      </div>
    </div>
  );
}