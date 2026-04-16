import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const emptyResume = {
  title: "",
  profile: {
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    summary: "",
  },
  experiences: [],
  educations: [],
  skills: [],
  certificates: [],
};

export default function ResumeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [resume, setResume] = useState(emptyResume);
  const [skillInput, setSkillInput] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: "basic", label: "기본정보", icon: "ri-user-line" },
    { id: "experience", label: "경력", icon: "ri-briefcase-line" },
    { id: "education", label: "학력", icon: "ri-graduation-cap-line" },
    { id: "skills", label: "스킬/자격증", icon: "ri-award-line" },
  ];

  const handleProfile = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({ ...prev, profile: { ...prev.profile, [name]: value } }));
  };

  const addExperience = () =>
    setResume((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { company: "", position: "", period: "", description: "" },
      ],
    }));

  const updateExperience = (idx, field, value) =>
    setResume((prev) => {
      const arr = [...prev.experiences];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, experiences: arr };
    });

  const removeExperience = (idx) =>
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== idx),
    }));

  const addEducation = () =>
    setResume((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        { school: "", major: "", period: "", degree: "" },
      ],
    }));

  const updateEducation = (idx, field, value) =>
    setResume((prev) => {
      const arr = [...prev.educations];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, educations: arr };
    });

  const removeEducation = (idx) =>
    setResume((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== idx),
    }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || resume.skills.includes(s)) return;
    setResume((prev) => ({ ...prev, skills: [...prev.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setResume((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));

  const addCertificate = () =>
    setResume((prev) => ({
      ...prev,
      certificates: [...prev.certificates, { name: "", issuer: "", date: "" }],
    }));

  const updateCertificate = (idx, field, value) =>
    setResume((prev) => {
      const arr = [...prev.certificates];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, certificates: arr };
    });

  const removeCertificate = (idx) =>
    setResume((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== idx),
    }));

  const handleSave = () => {
    if (!resume.title.trim()) {
      alert("이력서 제목을 입력해주세요.");
      return;
    }
    if (!resume.profile.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    setSaved(true);
    setTimeout(() => {
      navigate("/memberMypage/resumes");
    }, 800);
  };

  const inputClass = "w-full border border-[#D7B89C] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white";

  return (
    <div className="space-y-4">
      {/* 서브 헤더 */}
      <div className="bg-white border border-[#F3E8D0] rounded-xl p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/memberMypage/resumes")}
              className="text-[#8D6E63] hover:text-[#5D4037] text-sm flex items-center gap-1"
            >
              <i className="ri-arrow-left-line"></i> 목록
            </button>
            <h1 className="text-lg font-extrabold text-[#5D4037]">
              {isEdit ? "이력서 수정" : "새 이력서 작성"}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saved}
            className="bg-yellow-500 hover:opacity-90 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-opacity flex items-center gap-1.5"
          >
            <i className={saved ? "ri-check-line" : "ri-save-line"}></i>
            {saved ? "저장됨" : "저장하기"}
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-0 border-t border-[#F3E8D0] mt-4 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "border-yellow-500 text-[#5D4037]"
                  : "border-transparent text-gray-500 hover:text-[#5D4037]"
              }`}
            >
              <i className={`${tab.icon} text-sm`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {/* ── 기본정보 탭 ── */}
        {activeTab === "basic" && (
          <>
            <div className="bg-white border border-[#F3E8D0] rounded-xl p-5">
              <label className="block text-sm font-semibold text-[#5D4037] mb-1.5">
                이력서 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={resume.title}
                onChange={(e) => setResume((p) => ({ ...p, title: e.target.value }))}
                placeholder="예: 프론트엔드 개발자 이력서"
                className={inputClass}
              />
            </div>

            <div className="bg-white border border-[#F3E8D0] rounded-xl p-5">
              <h2 className="font-semibold text-[#5D4037] mb-4 flex items-center gap-2">
                <i className="ri-user-3-line text-yellow-500"></i> 기본 정보
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "이름", name: "name", required: true, placeholder: "홍길동" },
                  { label: "이메일", name: "email", type: "email", placeholder: "example@email.com" },
                  { label: "전화번호", name: "phone", placeholder: "010-0000-0000" },
                  { label: "주소", name: "address", placeholder: "서울특별시 강남구" },
                  { label: "생년월일", name: "birthDate", type: "date" },
                ].map(({ label, name, type = "text", required, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs text-gray-500 mb-1">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={resume.profile[name]}
                      onChange={handleProfile}
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-xs text-gray-500 mb-1">자기소개 / 요약</label>
                <textarea
                  name="summary"
                  value={resume.profile.summary}
                  onChange={handleProfile}
                  rows={4}
                  placeholder="본인의 강점과 경력을 간략히 소개해주세요."
                  className="w-full border border-[#D7B89C] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                />
              </div>
            </div>
          </>
        )}

        {/* ── 경력 탭 ── */}
        {activeTab === "experience" && (
          <div className="bg-white border border-[#F3E8D0] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#5D4037] flex items-center gap-2">
                <i className="ri-briefcase-line text-yellow-500"></i> 경력 사항
              </h2>
              <button
                onClick={addExperience}
                className="text-sm text-[#8D6E63] border border-[#D7B89C] px-3 py-1.5 rounded-lg hover:bg-[#FFF3E0] transition-colors"
              >
                + 경력 추가
              </button>
            </div>
            {resume.experiences.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <i className="ri-briefcase-line text-4xl block mb-2 text-gray-300"></i>
                <p className="text-sm">아직 등록된 경력이 없습니다.</p>
                <p className="text-xs mt-1">위 버튼을 눌러 경력을 추가해보세요.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {resume.experiences.map((exp, idx) => (
                  <div key={idx} className="border border-[#F3E8D0] rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#8D6E63]">경력 #{idx + 1}</span>
                      <button
                        onClick={() => removeExperience(idx)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "회사명", field: "company", placeholder: "(주)회사명" },
                        { label: "직책/직위", field: "position", placeholder: "프론트엔드 개발자" },
                        { label: "재직기간", field: "period", placeholder: "2020.03 ~ 2023.12" },
                      ].map(({ label, field, placeholder }) => (
                        <div key={field}>
                          <label className="block text-xs text-gray-500 mb-1">{label}</label>
                          <input
                            type="text"
                            value={exp[field]}
                            onChange={(e) => updateExperience(idx, field, e.target.value)}
                            placeholder={placeholder}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">주요 업무 / 성과</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => updateExperience(idx, "description", e.target.value)}
                        placeholder="담당 업무 및 주요 성과를 입력해주세요."
                        className="w-full border border-[#D7B89C] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 학력 탭 ── */}
        {activeTab === "education" && (
          <div className="bg-white border border-[#F3E8D0] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#5D4037] flex items-center gap-2">
                <i className="ri-graduation-cap-line text-yellow-500"></i> 학력 사항
              </h2>
              <button
                onClick={addEducation}
                className="text-sm text-[#8D6E63] border border-[#D7B89C] px-3 py-1.5 rounded-lg hover:bg-[#FFF3E0] transition-colors"
              >
                + 학력 추가
              </button>
            </div>
            {resume.educations.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <i className="ri-graduation-cap-line text-4xl block mb-2 text-gray-300"></i>
                <p className="text-sm">아직 등록된 학력이 없습니다.</p>
                <p className="text-xs mt-1">위 버튼을 눌러 학력을 추가해보세요.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {resume.educations.map((edu, idx) => (
                  <div key={idx} className="border border-[#F3E8D0] rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#8D6E63]">학력 #{idx + 1}</span>
                      <button
                        onClick={() => removeEducation(idx)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "학교명", field: "school", placeholder: "○○대학교" },
                        { label: "전공", field: "major", placeholder: "컴퓨터공학과" },
                        { label: "재학기간", field: "period", placeholder: "2013.03 ~ 2017.02" },
                        { label: "학위", field: "degree", placeholder: "학사" },
                      ].map(({ label, field, placeholder }) => (
                        <div key={field}>
                          <label className="block text-xs text-gray-500 mb-1">{label}</label>
                          <input
                            type="text"
                            value={edu[field]}
                            onChange={(e) => updateEducation(idx, field, e.target.value)}
                            placeholder={placeholder}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 스킬/자격증 탭 ── */}
        {activeTab === "skills" && (
          <>
            <div className="bg-white border border-[#F3E8D0] rounded-xl p-5">
              <h2 className="font-semibold text-[#5D4037] mb-4 flex items-center gap-2">
                <i className="ri-code-line text-yellow-500"></i> 보유 스킬
              </h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="예: React, TypeScript (Enter로 추가)"
                  className={inputClass}
                />
                <button
                  onClick={addSkill}
                  className="text-sm bg-yellow-500 hover:opacity-90 text-white px-4 py-2 rounded-lg transition-opacity whitespace-nowrap"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-sm bg-[#FFF8F0] text-[#8D6E63] border border-[#F3E8D0] px-3 py-1 rounded-full"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-[#8D6E63] hover:text-[#5D4037] ml-1 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {resume.skills.length === 0 && (
                  <p className="text-sm text-gray-400">추가된 스킬이 없습니다.</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-[#F3E8D0] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#5D4037] flex items-center gap-2">
                  <i className="ri-award-line text-yellow-500"></i> 자격증
                </h2>
                <button
                  onClick={addCertificate}
                  className="text-sm text-[#8D6E63] border border-[#D7B89C] px-3 py-1.5 rounded-lg hover:bg-[#FFF3E0] transition-colors"
                >
                  + 자격증 추가
                </button>
              </div>
              {resume.certificates.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <i className="ri-award-line text-4xl block mb-2 text-gray-300"></i>
                  <p className="text-sm">아직 등록된 자격증이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resume.certificates.map((cert, idx) => (
                    <div key={idx} className="border border-[#F3E8D0] rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-[#8D6E63]">자격증 #{idx + 1}</span>
                        <button
                          onClick={() => removeCertificate(idx)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          삭제
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { label: "자격증명", field: "name", placeholder: "정보처리기사" },
                          { label: "발급기관", field: "issuer", placeholder: "한국산업인력공단" },
                          { label: "취득일", field: "date", placeholder: "2023.05" },
                        ].map(({ label, field, placeholder }) => (
                          <div key={field}>
                            <label className="block text-xs text-gray-500 mb-1">{label}</label>
                            <input
                              type="text"
                              value={cert[field]}
                              onChange={(e) => updateCertificate(idx, field, e.target.value)}
                              placeholder={placeholder}
                              className={inputClass}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
