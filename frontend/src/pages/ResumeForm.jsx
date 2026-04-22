import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CERTIFICATE_OPTIONS } from "../constants/certificateOptions";
import api from "../api/axios";

const emptyResume = {
  title: "",
  profile: {
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    profileImage: null,
    profileImagePreview: "",
    disabilities: [],
    portfolioUrl: "",
    summary: "",
  },
  experiences: [],
  educations: [],
  skills: [],
  certificates: [],
  languages: [],
};

const API_BASE = "http://localhost:8080";

function formatDateForInput(value) {
  if (value == null || value === "") return "";
  const s = typeof value === "string" ? value : String(value);
  return s.includes("T") ? s.split("T")[0] : s;
}

async function extractErrorMessage(response, fallbackMessage) {
  try {
    const errorBody = await response.json();
    return (
      errorBody?.message ||
      errorBody?.detail ||
      errorBody?.error ||
      fallbackMessage
    );
  } catch {
    return fallbackMessage;
  }
}

/** GET /resumes/:id 상세 응답 → 폼 상태 */
function mapResumeDetailApiToForm(data) {
  return {
    title: data.title ?? "",
    profile: {
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phoneNumber ?? "",
      address: data.address ?? "",
      birthDate: formatDateForInput(data.birthDate),
      profileImage: null,
      profileImagePreview: data.userPhoto ? `${API_BASE}${data.userPhoto}` : "",
      disabilities: (data.resumeDisabilities ?? []).map((d) => ({
        disabilityType: d.disabilityName ?? "",
        disabilityDescription: d.description ?? "",
      })),
      portfolioUrl: data.portfolioUrl ?? "",
      summary: data.selfIntroduction ?? "",
    },
    experiences: (data.careers ?? []).map((c) => ({
      company: c.companyName ?? "",
      position: c.position ?? "",
      startDate: formatDateForInput(c.startDate),
      endDate: formatDateForInput(c.endDate),
      description: c.content ?? "",
    })),
    educations: (data.educations ?? []).map((e) => ({
      school: e.schoolName ?? "",
      major: e.major ?? "",
      startDate: formatDateForInput(e.startDate),
      endDate: formatDateForInput(e.endDate),
      degree: e.degree ?? "",
    })),
    skills: (data.skills ?? []).map((s) => s.skillKeyword).filter(Boolean),
    certificates: (data.certificates ?? []).map((c) => {
      const name = c.certificateName ?? "";
      return {
        name,
        nameQuery: name,
        selectedName: "",
        isSearchMode: false,
        date: formatDateForInput(c.acquiredDate),
      };
    }),
    languages: (data.langQualifications ?? []).map((l) => ({
      languageName: l.languageName ?? "",
      testName: l.testName ?? "",
      score: l.score != null ? String(l.score) : "",
      acquiredDate: formatDateForInput(l.acquiredDate),
      expirationDate: formatDateForInput(l.expirationDate),
    })),
  };
}

export default function ResumeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [resume, setResume] = useState(emptyResume);
  const [skillInput, setSkillInput] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [saved, setSaved] = useState(false);
  const [activeCertificateDropdown, setActiveCertificateDropdown] = useState(null);
  const [loadingResume, setLoadingResume] = useState(() => Boolean(id));

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await fetch("/members/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        if (!data?.success) return;
        const member = data.data ?? data;
        let profileBirthDate = "";

        try {
          const profileResponse = await fetch("/members/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (profileResponse.ok) {
            const profileJson = await profileResponse.json();
            const profile = profileJson.data ?? profileJson;
            const rawBirthDate = profile.birthDate || profile.birth_date || "";
            profileBirthDate =
              typeof rawBirthDate === "string" && rawBirthDate.includes("T")
                ? rawBirthDate.split("T")[0]
                : rawBirthDate;

            console.log("프로필 정보 조회:", profile);
          }
        } catch (profileErr) {
          console.error("프로필 생년월일 조회 오류:", profileErr);
        }

        setResume((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: prev.profile.name || member.name || "",
            email: prev.profile.email || member.email || "",
            phone: prev.profile.phone || member.phoneNumber || member.phone_number || "",
            address: prev.profile.address || member.address || "",
            birthDate:
              prev.profile.birthDate ||
              profileBirthDate ||
              "",
          },
        }));
      } catch (err) {
        console.error("회원 기본정보 조회 오류:", err);
      }
    };

    fetchMemberInfo();
  }, []);

  useEffect(() => {
    if (!id) {
      setLoadingResume(false);
      setResume(emptyResume);
      setSaved(false);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      setLoadingResume(true);
      try {
        const { data } = await api.get(`/resumes/${id}`);
        if (!cancelled) {
          setResume(mapResumeDetailApiToForm(data));
        }
      } catch (err) {
        console.error("이력서 조회 실패:", err);
        if (!cancelled) {
          alert("이력서를 불러오지 못했습니다.");
          navigate("/memberMypage");
        }
      } finally {
        if (!cancelled) setLoadingResume(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const tabs = [
    { id: "basic", label: "기본정보", icon: "ri-user-line" },
    { id: "experience", label: "경력", icon: "ri-briefcase-line" },
    { id: "education", label: "학력", icon: "ri-graduation-cap-line" },
    { id: "skills", label: "스킬/자격증", icon: "ri-award-line" },
    { id: "language", label: "어학", icon: "ri-translate-2" },
  ];

  const handleProfile = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({ ...prev, profile: { ...prev.profile, [name]: value } }));
  };

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setResume((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        profileImage: file,
        profileImagePreview: objectUrl,
      },
    }));
  };

  const addDisability = () =>
    setResume((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        disabilities: [
          ...(prev.profile.disabilities || []),
          { disabilityType: "", disabilityDescription: "" },
        ],
      },
    }));

  const updateDisability = (idx, field, value) =>
    setResume((prev) => {
      const disabilities = [...(prev.profile.disabilities || [])];
      disabilities[idx] = { ...disabilities[idx], [field]: value };
      return {
        ...prev,
        profile: {
          ...prev.profile,
          disabilities,
        },
      };
    });

  const removeDisability = (idx) =>
    setResume((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        disabilities: (prev.profile.disabilities || []).filter((_, i) => i !== idx),
      },
    }));

  const addExperience = () =>
    setResume((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { company: "", position: "", startDate: "", endDate: "", description: "" },
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
        { school: "", major: "", startDate: "", endDate: "", degree: "" },
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
      certificates: [
        ...prev.certificates,
        { name: "", nameQuery: "", selectedName: "", isSearchMode: false, date: "" },
      ],
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

  const getCertificateSuggestions = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CERTIFICATE_OPTIONS
      .filter((option) => option.toLowerCase().includes(q))
      .slice(0, 10);
  };

  const updateCertificateQuery = (idx, value) => {
    setResume((prev) => {
      const arr = [...prev.certificates];
      arr[idx] = { ...arr[idx], nameQuery: value, selectedName: "" };
      return { ...prev, certificates: arr };
    });
    setActiveCertificateDropdown(idx);
  };

  const selectCertificateCandidate = (idx, selectedName) => {
    setResume((prev) => {
      const arr = [...prev.certificates];
      arr[idx] = { ...arr[idx], selectedName, nameQuery: selectedName };
      return { ...prev, certificates: arr };
    });
    setActiveCertificateDropdown(null);
  };

  const toggleCertificateSearchMode = (idx) => {
    setResume((prev) => {
      const arr = [...prev.certificates];
      const nextMode = !arr[idx].isSearchMode;
      arr[idx] = {
        ...arr[idx],
        isSearchMode: nextMode,
        nameQuery: nextMode ? arr[idx].name : arr[idx].name,
        selectedName: "",
      };
      return { ...prev, certificates: arr };
    });
    setActiveCertificateDropdown((prev) => (prev === idx ? null : idx));
  };

  const applyCertificateSelection = (idx) => {
    const cert = resume.certificates[idx];
    const selectedValue = cert?.selectedName || cert?.nameQuery || "";
    if (!CERTIFICATE_OPTIONS.includes(selectedValue)) {
      alert("드롭다운에서 자격증명을 선택해주세요.");
      return;
    }

    setResume((prev) => {
      const arr = [...prev.certificates];
      arr[idx] = {
        ...arr[idx],
        name: selectedValue,
        nameQuery: selectedValue,
        selectedName: "",
        isSearchMode: false,
      };
      return { ...prev, certificates: arr };
    });
    setActiveCertificateDropdown(null);
  };

  const addLanguage = () =>
    setResume((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          languageName: "",
          testName: "",
          score: "",
          acquiredDate: "",
          expirationDate: "",
        },
      ],
    }));

  const updateLanguage = (idx, field, value) =>
    setResume((prev) => {
      const arr = [...prev.languages];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, languages: arr };
    });

  const removeLanguage = (idx) =>
    setResume((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== idx),
    }));

  const handleSave = async () => {
    if (!resume.title.trim()) {
      alert("이력서 제목을 입력해주세요.");
      return;
    }
    if (!resume.profile.summary.trim()) {
      alert("자기소개를 입력해주세요.");
      return;
    }

    const hasInvalidDisability = (resume.profile.disabilities || []).some(
      (item) => !item.disabilityType?.trim()
    );
    if (hasInvalidDisability) {
      alert("장애 정보를 추가하신 경우, 장애 유형은 필수로 선택해주세요.");
      return;
    }

    const hasInvalidExperience = resume.experiences.some(
      (exp) =>
        !exp.company?.trim() ||
        !exp.position?.trim() ||
        !exp.startDate?.trim() ||
        !exp.endDate?.trim()
    );
    if (hasInvalidExperience) {
      alert("경력을 추가하신 경우, 회사명/직책/재직기간(시작·종료일)은 필수로 입력해주세요. (주요 업무/성과는 선택)");
      return;
    }

    const hasInvalidEducation = resume.educations.some(
      (edu) => !edu.school?.trim() || !edu.major?.trim() || !edu.startDate?.trim() || !edu.endDate?.trim() || !edu.degree?.trim()
    );
    if (hasInvalidEducation) {
      alert("학력을 추가하신 경우, 학교명/전공/재학기간(시작·종료일)/학위는 모두 필수로 입력해주세요.");
      return;
    }

    const hasInvalidSkill = resume.skills.some((skill) => !skill?.trim());
    if (hasInvalidSkill) {
      alert("추가된 스킬 항목을 확인해주세요.");
      return;
    }

    const hasUnselectedCertificate = resume.certificates.some((cert) => cert.isSearchMode || !cert.name);
    if (hasUnselectedCertificate) {
      alert("자격증을 추가하신 경우, 돋보기로 검색 후 체크(선택) 버튼으로 자격증명을 확정해주세요.");
      return;
    }
    const hasInvalidCertificate = resume.certificates.some((cert) => !cert.name?.trim() || !cert.date?.trim());
    if (hasInvalidCertificate) {
      alert("자격증을 추가하신 경우, 자격증명과 취득일은 필수로 입력해주세요.");
      return;
    }

    const hasInvalidLanguage = resume.languages.some(
      (lang) =>
        !lang.languageName?.trim() ||
        !lang.testName?.trim() ||
        !lang.score?.trim() ||
        !lang.acquiredDate?.trim() ||
        !lang.expirationDate?.trim()
    );
    if (hasInvalidLanguage) {
      alert("어학을 추가하신 경우, 언어명/시험명/점수/취득일/만료일은 모두 필수로 입력해주세요.");
      return;
    }

    try {
      setSaved(true);

      const payload = {
        title: resume.title.trim(),
        selfIntroduction: resume.profile.summary.trim(),
        portfolioUrl: resume.profile.portfolioUrl?.trim() || "",
        careers: resume.experiences.map((exp) => ({
          companyName: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          content: exp.description,
        })),
        educations: resume.educations.map((edu) => ({
          schoolName: edu.school,
          major: edu.major,
          startDate: edu.startDate,
          endDate: edu.endDate,
          degree: edu.degree,
        })),
        skills: resume.skills.map((skill) => ({ skillKeyword: skill })),
        resumeDisabilities: (resume.profile.disabilities || []).map((item) => ({
          disabilityName: item.disabilityType,
          description: item.disabilityDescription || "",
        })),
        langQualifications: resume.languages.map((lang) => ({
          languageName: lang.languageName,
          testName: lang.testName,
          score: lang.score,
          acquiredDate: lang.acquiredDate,
          expirationDate: lang.expirationDate,
        })),
        certificates: resume.certificates.map((cert) => ({
          certificateName: cert.name,
          acquiredDate: cert.date,
        })),
      };

      const formData = new FormData();
      if (resume.profile.profileImage) {
        formData.append("image", resume.profile.profileImage);
      }
      formData.append(
        "data",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      const token = localStorage.getItem("accessToken");
      const url = isEdit ? `${API_BASE}/resumes/${id}` : `${API_BASE}/resumes`;
      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!response.ok) {
        const serverMessage = await extractErrorMessage(
          response,
          "이력서 저장에 실패했습니다."
        );
        throw new Error(serverMessage);
      }

      navigate("/memberMypage");
    } catch (err) {
      console.error("이력서 저장 실패:", err);
      alert(err.message || "이력서 저장에 실패했습니다.");
      setSaved(false);
    }
  };

  const inputClass = "w-full border border-[#D7B89C] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white";
  const readOnlyInputClass = "w-full border border-[#E5D5BF] rounded-lg px-3 py-2.5 text-sm bg-[#F8F4EE] text-gray-600";

  if (isEdit && loadingResume) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-gray-500">이력서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 서브 헤더 */}
      <div className="bg-white border border-[#F3E8D0] rounded-xl p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/memberMypage")}
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
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">증명사진 업로드</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg border border-[#D7B89C] bg-[#FFF8F0] overflow-hidden flex items-center justify-center">
                    {resume.profile.profileImagePreview ? (
                      <img
                        src={resume.profile.profileImagePreview}
                        alt="증명사진 미리보기"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="ri-image-line text-2xl text-gray-400"></i>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImage}
                    className="text-sm text-gray-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-white hover:file:opacity-90"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "이름", name: "name", required: true, placeholder: "홍길동" },
                  { label: "이메일", name: "email", type: "email", placeholder: "example@email.com" },
                  { label: "전화번호", name: "phone", placeholder: "010-0000-0000" },
                  { label: "주소", name: "address", placeholder: "서울특별시 강남구" },
                  { label: "생년월일", name: "birthDate" },
                ].map(({ label, name, required, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs text-gray-500 mb-1">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      name={name}
                      value={resume.profile[name]}
                      readOnly
                      placeholder={placeholder}
                      className={readOnlyInputClass}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-xs text-gray-500 mb-1">자기소개</label>
                <textarea
                  name="summary"
                  value={resume.profile.summary}
                  onChange={handleProfile}
                  rows={4}
                  placeholder="본인의 강점과 경력을 간략히 소개해주세요."
                  className="w-full border border-[#D7B89C] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                />
              </div>
              <div className="mt-4">
                <label className="block text-xs text-gray-500 mb-1">포트폴리오 URL</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={resume.profile.portfolioUrl}
                  onChange={handleProfile}
                  placeholder="https://portfolio.example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="bg-white border border-[#F3E8D0] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#5D4037] flex items-center gap-2">
                  <i className="ri-wheelchair-line text-yellow-500"></i> 장애 정보
                </h2>
                <button
                  onClick={addDisability}
                  className="text-sm text-[#8D6E63] border border-[#D7B89C] px-3 py-1.5 rounded-lg hover:bg-[#FFF3E0] transition-colors"
                >
                  + 장애 정보 추가
                </button>
              </div>

              {(resume.profile.disabilities || []).length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">등록된 장애 정보가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(resume.profile.disabilities || []).map((item, idx) => (
                    <div key={idx} className="border border-[#F3E8D0] rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-[#8D6E63]">장애 정보 #{idx + 1}</span>
                        <button
                          onClick={() => removeDisability(idx)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          삭제
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            장애 유형 <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={item.disabilityType}
                            onChange={(e) => updateDisability(idx, "disabilityType", e.target.value)}
                            className={inputClass}
                          >
                            <option value="">선택해주세요</option>
                            <option value="지체장애">지체장애</option>
                            <option value="시각장애">시각장애</option>
                            <option value="청각장애">청각장애</option>
                            <option value="언어장애">언어장애</option>
                            <option value="지적장애">지적장애</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">장애 관련 간단 설명</label>
                          <input
                            type="text"
                            value={item.disabilityDescription}
                            onChange={(e) =>
                              updateDisability(idx, "disabilityDescription", e.target.value)
                            }
                            placeholder="업무 수행 시 참고할 사항"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                        { label: "회사명", field: "company", placeholder: "(주)회사명", required: true },
                        { label: "직책/직위", field: "position", placeholder: "프론트엔드 개발자", required: true },
                        { label: "재직 시작일", field: "startDate", type: "date", required: true },
                        { label: "재직 종료일", field: "endDate", type: "date", required: true },
                      ].map(({ label, field, placeholder, required }) => (
                        <div key={field}>
                          <label className="block text-xs text-gray-500 mb-1">
                            {label} {required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type={field.includes("Date") ? "date" : "text"}
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
                        { label: "학교명", field: "school", placeholder: "○○대학교", required: true },
                        { label: "전공", field: "major", placeholder: "컴퓨터공학과", required: true },
                        { label: "재학 시작일", field: "startDate", type: "date", required: true },
                        { label: "재학 종료일", field: "endDate", type: "date", required: true },
                        { label: "학위", field: "degree", placeholder: "학사", required: true },
                      ].map(({ label, field, placeholder, required }) => (
                        <div key={field}>
                          <label className="block text-xs text-gray-500 mb-1">
                            {label} {required && <span className="text-red-500">*</span>}
                          </label>
                          {field === "degree" ? (
                            <select
                              value={edu[field]}
                              onChange={(e) => updateEducation(idx, field, e.target.value)}
                              className={inputClass}
                            >
                              <option value="">선택해주세요</option>
                              <option value="고등학교">고등학교</option>
                              <option value="전문학사">전문학사</option>
                              <option value="학사">학사</option>
                              <option value="석사">석사</option>
                              <option value="박사">박사</option>
                              <option value="기타">기타</option>
                            </select>
                          ) : (
                            <input
                              type={field.includes("Date") ? "date" : "text"}
                              value={edu[field]}
                              onChange={(e) => updateEducation(idx, field, e.target.value)}
                              placeholder={placeholder}
                              className={inputClass}
                            />
                          )}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative">
                          <label className="block text-xs text-gray-500 mb-1">
                            자격증명 <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={cert.isSearchMode ? cert.nameQuery : cert.name}
                              onChange={(e) => updateCertificateQuery(idx, e.target.value)}
                              onFocus={() => cert.isSearchMode && setActiveCertificateDropdown(idx)}
                              onBlur={() => {
                                setTimeout(() => setActiveCertificateDropdown(null), 120);
                              }}
                              readOnly={!cert.isSearchMode}
                              placeholder={cert.isSearchMode ? "자격증명을 검색하세요." : "돋보기를 눌러 검색하세요."}
                              className={`${inputClass} ${!cert.isSearchMode ? "bg-gray-50 cursor-not-allowed" : ""}`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                cert.isSearchMode ? applyCertificateSelection(idx) : toggleCertificateSearchMode(idx)
                              }
                              className="px-3 border border-[#D7B89C] rounded-lg text-[#8D6E63] hover:bg-[#FFF3E0] transition-colors"
                              title={cert.isSearchMode ? "선택 적용" : "검색 모드"}
                            >
                              <i className={cert.isSearchMode ? "ri-check-line" : "ri-search-line"}></i>
                            </button>
                          </div>
                          {cert.isSearchMode &&
                            activeCertificateDropdown === idx &&
                            getCertificateSuggestions(cert.nameQuery).length > 0 && (
                              <div className="absolute z-20 mt-1 w-full bg-white border border-[#D7B89C] rounded-lg shadow-md max-h-56 overflow-y-auto">
                                {getCertificateSuggestions(cert.nameQuery).map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => selectCertificateCandidate(idx, option)}
                                    className={`w-full text-left px-3 py-2 text-sm text-[#5D4037] ${
                                      cert.selectedName === option ? "bg-[#FFF3E0]" : "hover:bg-[#FFF3E0]"
                                    }`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>
                        {[{ label: "취득일", field: "date", type: "date" }].map(({ label, field, placeholder }) => (
                          <div key={field}>
                            <label className="block text-xs text-gray-500 mb-1">
                              {label} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type={field === "date" ? "date" : "text"}
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

        {/* ── 어학 탭 ── */}
        {activeTab === "language" && (
          <div className="bg-white border border-[#F3E8D0] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#5D4037] flex items-center gap-2">
                <i className="ri-translate-2 text-yellow-500"></i> 어학
              </h2>
              <button
                onClick={addLanguage}
                className="text-sm text-[#8D6E63] border border-[#D7B89C] px-3 py-1.5 rounded-lg hover:bg-[#FFF3E0] transition-colors"
              >
                + 어학 추가
              </button>
            </div>
            {resume.languages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <i className="ri-translate-2 text-4xl block mb-2 text-gray-300"></i>
                <p className="text-sm">아직 등록된 어학 정보가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resume.languages.map((language, idx) => (
                  <div key={idx} className="border border-[#F3E8D0] rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-[#8D6E63]">어학 #{idx + 1}</span>
                      <button
                        onClick={() => removeLanguage(idx)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { label: "언어명", field: "languageName", placeholder: "영어", required: true },
                        { label: "시험명", field: "testName", placeholder: "TOEFL", required: true },
                        { label: "점수", field: "score", placeholder: "95", required: true },
                        { label: "취득일", field: "acquiredDate", type: "date", required: true },
                        { label: "만료일", field: "expirationDate", type: "date", required: true },
                      ].map(({ label, field, placeholder, required }) => (
                        <div key={field}>
                          <label className="block text-xs text-gray-500 mb-1">
                            {label} {required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type={field.includes("Date") ? "date" : "text"}
                            value={language[field]}
                            onChange={(e) => updateLanguage(idx, field, e.target.value)}
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
      </div>
    </div>
  );
}
