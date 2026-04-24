import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jobPostingApi } from '../../api/jobPostingApi';
import defaultUserPhoto from '../../assets/images/resume/defalut_userPhoto.jpeg';
import { CERTIFICATE_OPTIONS } from '../../constants/certificateOptions';

const RESUME_API_BASE = 'http://localhost:8080';

const getAccessToken = () =>
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

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

const CREATE_TABS = [
  { id: 'basic', label: '기본 정보' },
  { id: 'disability', label: '장애 정보' },
  { id: 'experience', label: '경력' },
  { id: 'education', label: '학력' },
  { id: 'skills', label: '스킬' },
  { id: 'certificates', label: '자격증' },
  { id: 'language', label: '어학' }
];

const createEmptyResumeForm = () => ({
  title: '',
  profile: {
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    summary: '',
    portfolioUrl: '',
    profileImage: null,
    profileImagePreview: '',
    disabilities: []
  },
  experiences: [],
  educations: [],
  skills: [],
  certificates: [],
  languages: []
});

const mapResumeDetailToPreview = (resume) => {
  const disabilities = Array.isArray(resume?.resumeDisabilities) ? resume.resumeDisabilities : [];
  const careers = Array.isArray(resume?.careers) ? resume.careers : [];
  const educations = Array.isArray(resume?.educations) ? resume.educations : [];
  const skills = Array.isArray(resume?.skills) ? resume.skills : [];
  const certificates = Array.isArray(resume?.certificates) ? resume.certificates : [];
  const langQualifications = Array.isArray(resume?.langQualifications) ? resume.langQualifications : [];
  return {
    id: resume?.resumeId ?? resume?.id,
    title: resume?.title || '제목 없음',
    isDefault: Boolean(resume?.isPublic ?? resume?.isDefault),
    userName: resume?.name || resume?.userName || '',
    phone: resume?.phoneNumber || resume?.phone || '',
    email: resume?.email || '',
    address: resume?.address || '',
    birthDate: resume?.birthDate || '',
    profileImageUrl: resume?.userPhoto ? `${RESUME_API_BASE}${resume.userPhoto}` : '',
    disabilities,
    careers,
    educations,
    skills,
    certificates,
    langQualifications,
    portfolioUrl: resume?.portfolioUrl || '',
    introduction: resume?.selfIntroduction || resume?.introduction || ''
  };
};
import api from '../../api/axios';

// ==========================================
// 1. 순수 헬퍼 함수 및 공통 UI 컴포넌트, 옵션 데이터
// ==========================================
const formatTermDate = (term) => {
  if (!term) return '';
  if (term === '상시') return '상시';
  const parts = term.split('~').map(s => s.trim());
  const fmt = (d) => {
    if (!d) return '';
    const clean = d.replace(/[^0-9]/g, '');
    if (clean.length === 8) return clean.slice(4, 6) + '-' + clean.slice(6, 8);
    const mmdd = d.match(/(\d{2})[-/](\d{2})/);
    return mmdd ? `${mmdd[1]}-${mmdd[2]}` : d;
  };
  if (parts.length === 2) return `${fmt(parts[0])}~${fmt(parts[1])}`;
  return fmt(parts[0]);
};

const formatEnv = (env) => {
  if (!env) return env;
  const kgMatch = env.match(/[\d,~]+Kg/);
  if (kgMatch) return kgMatch[0];
  if (env.includes('듣') || env.includes('말')) return '청취/발화';
  if (env.includes('서서')) return '서서작업';
  if (env.includes('양손')) return '양손작업';
  if (env.includes('정밀')) return '정밀작업';
  return env.length > 15 ? env.slice(0, 15) + '...' : env;
};

export const InfoItem = ({ label, value }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value || '-'}</span>
    </div>
);

// 근로 가능 환경 선택 옵션 (6개 항목으로 업데이트됨)
const ENV_OPTIONS = {
  envBothHands: [
    "양손작업 가능",
    "한손작업 가능",
    "한손보조작업 가능"
  ],
  envEyesight: [
    "아주 작은 글씨를 읽을 수 있음",
    "일상적 활동 가능",
    "비교적 큰 인쇄물을 읽을 수 있음"
  ],
  envHandWork: [
    "정밀한 작업가능",
    "작은 물품 조립가능",
    "큰 물품 조립가능"
  ],
  envLiftPower: [
    "20Kg 이상의 물건을 다룰 수 있음",
    "5Kg 이내의 물건을 다룰 수 있음",
    "5~20Kg의 물건을 다룰 수 있음"
  ],
  envLstnTalk: [
    "듣고 말하기에 어려움 없음",
    "간단한 듣고 말하기 가능",
    "듣고 말하는 작업 어려움"
  ],
  envStndWalk: [
    "오랫동안 가능",
    "일부 서서하는 작업 가능",
    "서거나 걷는 일 어려움"
  ]
};

// ==========================================
// 2. 모달 내부 Step별 하위 컴포넌트
// ==========================================
const SelectResumeView = ({ resumes, isLoading, onSelect, onGoCreate }) => (
    <>
      <h3 className="text-[15px] font-bold text-gray-900 mb-3">저장된 이력서 선택</h3>
      <div className="space-y-3">
        {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full"></div>
              불러오는 중...
            </div>
        ) : (
            resumes.map((resume) => (
                <button
                    key={resume.id}
                    onClick={() => onSelect(resume)}
                    className="w-full flex justify-between p-4 bg-[#FFF9F3] border border-orange-100 rounded-xl hover:border-orange-300 text-left group transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-gray-900">{resume.title}</span>
                      {resume.isDefault && <span className="px-1.5 py-0.5 bg-orange-100 text-[#E66235] text-[11px] font-bold rounded">대표 이력서</span>}
                    </div>
                    {resume.updatedAt && (
                        <p className="text-[12px] text-gray-400 mb-1.5">
                          최종 수정일: {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                    )}
                    {resume.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {resume.skills.slice(0, 5).map((skill, idx) => (
                              <span key={`${skill}-${idx}`} className="text-[11px] bg-white border border-orange-200 text-[#8D6E63] px-2 py-0.5 rounded-full">
                                {skill}
                              </span>
                          ))}
                        </div>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            ))
        )}
        <button onClick={onGoCreate} className="w-full p-4 border border-dashed border-gray-300 rounded-xl text-[14px] font-medium text-gray-500 hover:bg-gray-50 transition-colors flex justify-center gap-1.5">
          <span className="text-lg leading-none">+</span> 새 이력서 작성하기
        </button>
      </div>
    </>
);

// 새 이력서 작성 모달 (ResumeForm 필드 구성)
const CreateResumeView = ({
  formData,
  setFormData,
  activeTab,
  setActiveTab,
  skillInput,
  setSkillInput,
  onCancel,
  onSave
}) => {
  const [activeCertificateDropdown, setActiveCertificateDropdown] = useState(null);

  const updateProfileField = (field, value) => {
    setFormData((prev) => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        profileImage: file,
        profileImagePreview: previewUrl
      }
    }));
  };

  const addItem = (key, item) => {
    setFormData((prev) => ({ ...prev, [key]: [...prev[key], item] }));
  };

  const removeItem = (key, idx) => {
    setFormData((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
  };

  const updateItem = (key, idx, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || formData.skills.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput('');
  };

  const getCertificateSuggestions = (query) => {
    const normalized = (query || '').trim().toLowerCase();
    if (!normalized) return CERTIFICATE_OPTIONS.slice(0, 20);
    return CERTIFICATE_OPTIONS.filter((option) => option.toLowerCase().includes(normalized)).slice(0, 20);
  };

  const updateCertificateQuery = (idx, value) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) => (
          i === idx ? { ...cert, nameQuery: value, selectedName: '' } : cert
      ))
    }));
    setActiveCertificateDropdown(idx);
  };

  const selectCertificateCandidate = (idx, selectedName) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) => (
          i === idx ? { ...cert, selectedName, nameQuery: selectedName } : cert
      ))
    }));
    setActiveCertificateDropdown(null);
  };

  const toggleCertificateSearchMode = (idx) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) => {
        if (i !== idx) return cert;
        const nextMode = !cert.isSearchMode;
        return {
          ...cert,
          isSearchMode: nextMode,
          nameQuery: cert.name || cert.nameQuery || '',
          selectedName: ''
        };
      })
    }));
    setActiveCertificateDropdown((prev) => (prev === idx ? null : idx));
  };

  const applyCertificateSelection = (idx) => {
    const cert = formData.certificates[idx];
    const selectedValue = cert?.selectedName || cert?.nameQuery || '';
    if (!CERTIFICATE_OPTIONS.includes(selectedValue)) {
      alert('드롭다운에서 자격증명을 선택해주세요.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((item, i) => (
          i === idx
              ? { ...item, name: selectedValue, nameQuery: selectedValue, selectedName: '', isSearchMode: false }
              : item
      ))
    }));
    setActiveCertificateDropdown(null);
  };

  return (
      <div className="flex flex-col h-full">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {CREATE_TABS.map((tab) => (
              <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                      activeTab === tab.id ? 'bg-[#E66235] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
              </button>
          ))}
        </div>

        <div className="space-y-4 flex-1">
          {activeTab === 'basic' && (
              <>
                <div>
                  <label className="block text-[12px] font-bold text-[#5D4037] mb-1">증명 사진</label>
                  <div className="flex items-center gap-3">
                    <img
                        src={formData.profile.profileImagePreview || defaultUserPhoto}
                        alt="프로필 미리보기"
                        className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    />
                    <label className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer">
                      이미지 업로드
                      <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                    이력서 제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                      placeholder="이력서 제목"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['name', '이름', '자동 조회'],
                    ['birthDate', '생년월일', '자동 조회'],
                    ['phone', '연락처', '자동 조회'],
                    ['email', '이메일', '자동 조회'],
                    ['address', '거주지', '자동 조회']
                  ].map(([field, label, placeholder]) => (
                      <div key={field}>
                        <label className="block text-[12px] font-bold text-[#5D4037] mb-1">{label}</label>
                        <input
                            value={formData.profile[field]}
                            readOnly
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                            placeholder={placeholder}
                        />
                      </div>
                  ))}
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#5D4037] mb-1">포트폴리오 URL</label>
                  <input
                      value={formData.profile.portfolioUrl}
                      onChange={(e) => updateProfileField('portfolioUrl', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                      placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                    자기소개 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                      rows="4"
                      value={formData.profile.summary}
                      onChange={(e) => updateProfileField('summary', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-none"
                      placeholder="본인의 강점과 경력을 작성해주세요."
                  />
                </div>
              </>
          )}

          {activeTab === 'disability' && (
              <div className="space-y-2">
                <button
                    type="button"
                    onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          profile: {
                            ...prev.profile,
                            disabilities: [...(prev.profile.disabilities || []), { disabilityType: '', disabilityDescription: '' }]
                          }
                        }))
                    }
                    className="px-3 py-2 rounded-lg border border-dashed border-gray-300 text-xs font-bold text-gray-600"
                >
                  + 장애 정보 추가
                </button>
                {(formData.profile.disabilities || []).map((item, idx) => (
                    <div key={`disability-${idx}`} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="text-[12px] font-bold text-[#8D6E63]">장애 정보 #{idx + 1}</span>
                        <button
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  profile: {
                                    ...prev.profile,
                                    disabilities: prev.profile.disabilities.filter((_, i) => i !== idx)
                                  }
                                }))
                            }
                            className="text-xs font-bold text-red-500 hover:text-red-600 shrink-0"
                        >
                          삭제
                        </button>
                      </div>
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                        장애 유형 <span className="text-red-500">*</span>
                      </label>
                      <select
                          value={item.disabilityType}
                          onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                profile: {
                                  ...prev.profile,
                                  disabilities: prev.profile.disabilities.map((d, i) =>
                                      i === idx ? { ...d, disabilityType: e.target.value } : d
                                  )
                                }
                              }))
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      >
                        <option value="">장애 유형 선택</option>
                        <option value="지체장애">지체장애</option>
                        <option value="시각장애">시각장애</option>
                        <option value="청각장애">청각장애</option>
                        <option value="언어장애">언어장애</option>
                        <option value="지적장애">지적장애</option>
                      </select>
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">장애 관련 설명</label>
                      <input
                          value={item.disabilityDescription}
                          onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                profile: {
                                  ...prev.profile,
                                  disabilities: prev.profile.disabilities.map((d, i) =>
                                      i === idx ? { ...d, disabilityDescription: e.target.value } : d
                                  )
                                }
                              }))
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                          placeholder="장애 관련 설명"
                      />
                    </div>
                ))}
              </div>
          )}

          {activeTab === 'experience' && (
              <>
                <button type="button" onClick={() => addItem('experiences', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="px-3 py-2 rounded-lg border border-dashed border-gray-300 text-xs font-bold text-gray-600">+ 경력 추가</button>
                {formData.experiences.map((exp, idx) => (
                    <div key={`exp-${idx}`} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="text-[12px] font-bold text-[#8D6E63]">경력 #{idx + 1}</span>
                        <button type="button" onClick={() => removeItem('experiences', idx)} className="text-xs font-bold text-red-500 hover:text-red-600 shrink-0">삭제</button>
                      </div>
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                        회사명 <span className="text-red-500">*</span>
                      </label>
                      <input value={exp.company} onChange={(e) => updateItem('experiences', idx, 'company', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="회사명" />
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                        직책 <span className="text-red-500">*</span>
                      </label>
                      <input value={exp.position} onChange={(e) => updateItem('experiences', idx, 'position', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="직책" />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                            재직 시작일 <span className="text-red-500">*</span>
                          </label>
                          <input type="date" value={exp.startDate} onChange={(e) => updateItem('experiences', idx, 'startDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                            재직 종료일 <span className="text-red-500">*</span>
                          </label>
                          <input type="date" value={exp.endDate} onChange={(e) => updateItem('experiences', idx, 'endDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                        </div>
                      </div>
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">주요 업무/성과</label>
                      <textarea rows="2" value={exp.description} onChange={(e) => updateItem('experiences', idx, 'description', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" placeholder="주요 업무/성과" />
                    </div>
                ))}
              </>
          )}

          {activeTab === 'education' && (
              <>
                <button type="button" onClick={() => addItem('educations', { school: '', major: '', startDate: '', endDate: '', degree: '' })} className="px-3 py-2 rounded-lg border border-dashed border-gray-300 text-xs font-bold text-gray-600">+ 학력 추가</button>
                {formData.educations.map((edu, idx) => (
                    <div key={`edu-${idx}`} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="text-[12px] font-bold text-[#8D6E63]">학력 #{idx + 1}</span>
                        <button type="button" onClick={() => removeItem('educations', idx)} className="text-xs font-bold text-red-500 hover:text-red-600 shrink-0">삭제</button>
                      </div>
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                        학교명 <span className="text-red-500">*</span>
                      </label>
                      <input value={edu.school} onChange={(e) => updateItem('educations', idx, 'school', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="학교명" />
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                        전공 <span className="text-red-500">*</span>
                      </label>
                      <input value={edu.major} onChange={(e) => updateItem('educations', idx, 'major', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="전공" />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                            재학 시작일 <span className="text-red-500">*</span>
                          </label>
                          <input type="date" value={edu.startDate} onChange={(e) => updateItem('educations', idx, 'startDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                            재학 종료일 <span className="text-red-500">*</span>
                          </label>
                          <input type="date" value={edu.endDate} onChange={(e) => updateItem('educations', idx, 'endDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                        </div>
                      </div>
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                        학위 <span className="text-red-500">*</span>
                      </label>
                      <select
                          value={edu.degree}
                          onChange={(e) => updateItem('educations', idx, 'degree', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                      >
                        <option value="">학위를 선택해주세요</option>
                        <option value="고등학교">고등학교</option>
                        <option value="전문학사">전문학사</option>
                        <option value="학사">학사</option>
                        <option value="석사">석사</option>
                        <option value="박사">박사</option>
                        <option value="기타">기타</option>
                      </select>
                    </div>
                ))}
              </>
          )}

          {activeTab === 'skills' && (
              <>
                <label className="block text-[12px] font-bold text-[#5D4037] mb-1">스킬 추가</label>
                <div className="flex gap-2">
                  <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="스킬 입력" />
                  <button type="button" onClick={addSkill} className="px-3 py-2 rounded-lg bg-gray-100 text-xs font-bold text-gray-700">추가</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.map((skill) => (
                      <button key={skill} type="button" onClick={() => setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))} className="px-2 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700">
                        {skill} x
                      </button>
                  ))}
                </div>
              </>
          )}

          {activeTab === 'certificates' && (
              <div className="space-y-2">
                <button
                    type="button"
                    onClick={() => addItem('certificates', { name: '', date: '', nameQuery: '', selectedName: '', isSearchMode: false })}
                    className="px-3 py-2 rounded-lg border border-dashed border-gray-300 text-xs font-bold text-gray-600"
                >
                  + 자격증 추가
                </button>
                {formData.certificates.map((cert, idx) => (
                    <div key={`cert-${idx}`} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="text-[12px] font-bold text-[#8D6E63]">자격증 #{idx + 1}</span>
                        <button type="button" onClick={() => removeItem('certificates', idx)} className="text-xs font-bold text-red-500 hover:text-red-600 shrink-0">삭제</button>
                      </div>
                      <div className="relative">
                        <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                          자격증명 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                              type="text"
                              value={cert.isSearchMode ? cert.nameQuery : cert.name}
                              onChange={(e) => updateCertificateQuery(idx, e.target.value)}
                              onFocus={() => cert.isSearchMode && setActiveCertificateDropdown(idx)}
                              onBlur={() => setTimeout(() => setActiveCertificateDropdown(null), 120)}
                              readOnly={!cert.isSearchMode}
                              placeholder={cert.isSearchMode ? '자격증명을 검색하세요.' : '돋보기를 눌러 검색하세요.'}
                              className={`flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm ${!cert.isSearchMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                          />
                          <button
                              type="button"
                              onClick={() => (cert.isSearchMode ? applyCertificateSelection(idx) : toggleCertificateSearchMode(idx))}
                              className="px-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                              title={cert.isSearchMode ? '선택 적용' : '검색 모드'}
                          >
                            <i className={cert.isSearchMode ? 'ri-check-line' : 'ri-search-line'}></i>
                          </button>
                        </div>
                        {cert.isSearchMode && activeCertificateDropdown === idx && getCertificateSuggestions(cert.nameQuery).length > 0 && (
                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-56 overflow-y-auto">
                              {getCertificateSuggestions(cert.nameQuery).map((option) => (
                                  <button
                                      key={option}
                                      type="button"
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() => selectCertificateCandidate(idx, option)}
                                      className={`w-full text-left px-3 py-2 text-sm ${cert.selectedName === option ? 'bg-orange-50' : 'hover:bg-orange-50'}`}
                                  >
                                    {option}
                                  </button>
                              ))}
                            </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                          취득일 <span className="text-red-500">*</span>
                        </label>
                        <input type="date" value={cert.date} onChange={(e) => updateItem('certificates', idx, 'date', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                      </div>
                    </div>
                ))}
              </div>
          )}

          {activeTab === 'language' && (
              <>
                <button type="button" onClick={() => addItem('languages', { languageName: '', testName: '', score: '', acquiredDate: '', expirationDate: '' })} className="px-3 py-2 rounded-lg border border-dashed border-gray-300 text-xs font-bold text-gray-600">+ 어학 추가</button>
                {formData.languages.map((lang, idx) => (
                    <div key={`lang-${idx}`} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="text-[12px] font-bold text-[#8D6E63]">어학 #{idx + 1}</span>
                        <button type="button" onClick={() => removeItem('languages', idx)} className="text-xs font-bold text-red-500 hover:text-red-600 shrink-0">삭제</button>
                      </div>
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                        언어명 <span className="text-red-500">*</span>
                      </label>
                      <input value={lang.languageName} onChange={(e) => updateItem('languages', idx, 'languageName', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="언어명" />
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                        시험명 <span className="text-red-500">*</span>
                      </label>
                      <input value={lang.testName} onChange={(e) => updateItem('languages', idx, 'testName', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="시험명" />
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                        점수 <span className="text-red-500">*</span>
                      </label>
                      <input value={lang.score} onChange={(e) => updateItem('languages', idx, 'score', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="점수" />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                            취득일 <span className="text-red-500">*</span>
                          </label>
                          <input type="date" value={lang.acquiredDate} onChange={(e) => updateItem('languages', idx, 'acquiredDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-[#5D4037] mb-1">
                            만료일 <span className="text-red-500">*</span>
                          </label>
                          <input type="date" value={lang.expirationDate} onChange={(e) => updateItem('languages', idx, 'expirationDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                        </div>
                      </div>
                    </div>
                ))}
              </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3 shrink-0">
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-[#5D4037] font-bold text-sm hover:bg-gray-50 transition-colors">이전</button>
          <button onClick={onSave} className="flex-1 py-3.5 rounded-xl bg-[#E66235] text-white font-bold text-sm hover:bg-[#D45326] transition-colors">저장</button>
        </div>
      </div>
  );
};

// 이력서 확인 및 지원 모달
const PreviewResumeView = ({ resume, isSubmitting, onCancel, onApply }) => (
    <div className="flex flex-col h-full">
      <div className="space-y-4 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[15px] font-bold text-gray-900">{resume.title}</span>
          {resume.isDefault && <span className="px-1.5 py-0.5 bg-orange-100 text-[#E66235] text-[11px] font-bold rounded">기본</span>}
        </div>
        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-0.5">기본 정보</p>
            <div className="mt-2 flex gap-5">
              <div className="shrink-0">
                <img
                    src={resume.profileImageUrl || defaultUserPhoto}
                    alt="이력서 프로필"
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = defaultUserPhoto;
                    }}
                />
              </div>
              <div className="min-w-0 flex-1">
                {resume.userName && <p className="text-[13px] text-gray-900 font-medium">{resume.userName}</p>}
                <div className="mt-1 space-y-1 text-[12px] text-gray-600">
                  {resume.phone && (
                      <p>
                        <span className="text-gray-500">연락처</span>
                        <span className="mx-1 text-gray-300">|</span>
                        {resume.phone}
                      </p>
                  )}
                  {resume.email && (
                      <p className="break-all">
                        <span className="text-gray-500">이메일</span>
                        <span className="mx-1 text-gray-300">|</span>
                        {resume.email}
                      </p>
                  )}
                  {resume.address && (
                      <p>
                        <span className="text-gray-500">거주지</span>
                        <span className="mx-1 text-gray-300">|</span>
                        {resume.address}
                      </p>
                  )}
                  {resume.birthDate && (
                      <p>
                        <span className="text-gray-500">생년월일</span>
                        <span className="mx-1 text-gray-300">|</span>
                        {resume.birthDate}
                      </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {resume.disabilities?.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[11px] font-bold text-gray-400 mb-1.5">장애 정보</p>
                <div className="space-y-1.5 text-[12px]">
                  {resume.disabilities.map((disability, idx) => (
                      <p key={`${disability.disabilityName}-${idx}`} className="text-gray-600">
                        <span className="text-gray-900 font-medium">{disability.disabilityName || '-'}</span>
                        {disability.description ? <span className="ml-1">({disability.description})</span> : null}
                      </p>
                  ))}
                </div>
              </div>
          )}
          {resume.introduction && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[11px] font-bold text-gray-400 mb-1.5">자기소개</p>
                <p className="text-[13px] text-gray-800 leading-relaxed bg-white p-3 border border-gray-100 rounded-lg whitespace-pre-line">
                  {resume.introduction}
                </p>
              </div>
          )}
          {resume.careers?.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[11px] font-bold text-gray-400 mb-2">경력 사항</p>
                <div className="space-y-2.5 text-[12px]">
                  {resume.careers.map((career, idx) => (
                      <div key={`${career.companyName || 'career'}-${idx}`} className="bg-white p-2.5 rounded-lg border border-gray-100">
                        <p className="text-gray-900 font-medium">{career.companyName || '-'}</p>
                        <p className="text-gray-600">{career.position || '-'}</p>
                        <p className="text-gray-400">{career.startDate || '-'} ~ {career.endDate || '-'}</p>
                      </div>
                  ))}
                </div>
              </div>
          )}
          {resume.educations?.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[11px] font-bold text-gray-400 mb-2">학력 사항</p>
                <div className="space-y-2 text-[12px]">
                  {resume.educations.map((education, idx) => (
                      <p key={`${education.schoolName || 'education'}-${idx}`} className="text-gray-600">
                        <span className="text-gray-900 font-medium">{education.schoolName || '-'}</span>
                        <span className="ml-1">{education.major || '-'}</span>
                        <span className="ml-1">({education.degree || '-'})</span>
                      </p>
                  ))}
                </div>
              </div>
          )}
          {resume.skills?.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[11px] font-bold text-gray-400 mb-1.5">보유 스킬</p>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((skill, idx) => (
                      <span key={`${skill.skillKeyword || skill}-${idx}`} className="text-[11px] bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {skill.skillKeyword || skill}
                      </span>
                  ))}
                </div>
              </div>
          )}
          {resume.certificates?.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[11px] font-bold text-gray-400 mb-1.5">자격증</p>
                <div className="space-y-1 text-[12px]">
                  {resume.certificates.map((certificate, idx) => (
                      <p key={`${certificate.certificateName || 'certificate'}-${idx}`} className="text-gray-600">
                        <span className="text-gray-900 font-medium">{certificate.certificateName || '-'}</span>
                        <span className="ml-1">{certificate.acquiredDate || ''}</span>
                      </p>
                  ))}
                </div>
              </div>
          )}
          {resume.langQualifications?.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[11px] font-bold text-gray-400 mb-1.5">언어 자격증</p>
                <div className="space-y-1 text-[12px]">
                  {resume.langQualifications.map((language, idx) => (
                      <p key={`${language.languageName || 'lang'}-${idx}`} className="text-gray-600">
                        <span className="text-gray-900 font-medium">{language.languageName || '-'}</span>
                        <span className="ml-1">{language.testName || '-'}</span>
                        <span className="ml-1">점수: {language.score ?? '-'}</span>
                      </p>
                  ))}
                </div>
              </div>
          )}
          {resume.portfolioUrl && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[11px] font-bold text-gray-400 mb-1.5">포트폴리오</p>
                <a
                    href={resume.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-blue-600 hover:underline break-all"
                >
                  {resume.portfolioUrl}
                </a>
              </div>
          )}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3 shrink-0 bg-white">
        <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-[#5D4037] font-bold text-sm hover:bg-gray-50">다른 이력서 선택</button>
        <button onClick={onApply} disabled={isSubmitting} className="flex-1 py-3.5 rounded-xl bg-[#E66235] text-white font-bold text-sm hover:bg-[#D45326] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
          {isSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 처리중...</> : '이 이력서로 지원하기'}
        </button>
      </div>
    </div>
);


// ==========================================
// 3. 통합 모달 관리 컴포넌트
// ==========================================
const ApplicationModal = ({ isOpen, onClose, job }) => {
  const [modalStep, setModalStep] = useState('select'); // 'select' | 'create' | 'preview'
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [isLoadingSelectedResume, setIsLoadingSelectedResume] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createFormData, setCreateFormData] = useState(() => createEmptyResumeForm());
  const [createActiveTab, setCreateActiveTab] = useState('basic');
  const [createSkillInput, setCreateSkillInput] = useState('');

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setModalStep('select');
      setSelectedResume(null);
      setCreateActiveTab('basic');
      setCreateSkillInput('');
      setCreateFormData(createEmptyResumeForm());
    }, 300);
  };

  useEffect(() => {
    const fetchResumes = async () => {
      if (!(isOpen && modalStep === 'select' && resumes.length === 0)) return;
      setIsLoadingResumes(true);
      try {
        const token = getAccessToken();
        const response = await fetch(`${RESUME_API_BASE}/resumes`, {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('이력서 목록을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        const resumeList = Array.isArray(data) ? data : (data?.content || []);
        setResumes(
            resumeList.map((resume) => ({
              id: resume.resumeId ?? resume.id,
              title: resume.title || '제목 없음',
              isDefault: Boolean(resume.isPublic ?? resume.isDefault),
              userName: resume.name || resume.userName || '',
              phone: resume.phoneNumber || resume.phone || '',
              email: resume.email || '',
              updatedAt: resume.updatedAt || '',
              skills: (resume.skills || []).map((skill) => skill.skillKeyword || skill).filter(Boolean)
            }))
        );
      } catch (error) {
        console.error('이력서 목록 조회 실패:', error);
        setResumes([]);
      } finally {
        setIsLoadingResumes(false);
      }
    };

    fetchResumes();
  }, [isOpen, modalStep, resumes.length]);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      if (!(isOpen && modalStep === 'create')) return;
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch('/members/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) return;

        const data = await response.json();
        if (!data?.success) return;

        const member = data.data ?? data;
        let profileBirthDate = '';

        try {
          const profileResponse = await fetch('/members/profile', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (profileResponse.ok) {
            const profileJson = await profileResponse.json();
            const profile = profileJson.data ?? profileJson;
            const rawBirthDate = profile.birthDate || profile.birth_date || '';
            profileBirthDate =
                typeof rawBirthDate === 'string' && rawBirthDate.includes('T')
                    ? rawBirthDate.split('T')[0]
                    : rawBirthDate;
          }
        } catch (profileErr) {
          console.error('프로필 생년월일 조회 오류:', profileErr);
        }

        setCreateFormData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: prev.profile.name || member.name || '',
            email: prev.profile.email || member.email || '',
            phone: prev.profile.phone || member.phoneNumber || member.phone_number || '',
            address: prev.profile.address || member.address || '',
            birthDate: prev.profile.birthDate || profileBirthDate || ''
          }
        }));
      } catch (err) {
        console.error('회원 기본정보 조회 오류:', err);
      }
    };

    fetchMemberInfo();
  }, [isOpen, modalStep]);

  const handleSelectResume = async (resume) => {
    setIsLoadingSelectedResume(true);
    try {
      const token = getAccessToken();
      const response = await fetch(`${RESUME_API_BASE}/resumes/${resume.id}`, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('이력서 상세 정보를 불러오는데 실패했습니다.');
      }

      const resumeDetail = await response.json();
      setSelectedResume(mapResumeDetailToPreview(resumeDetail));
      setModalStep('preview');
    } catch (error) {
      console.error('이력서 상세 조회 실패:', error);
      alert('이력서 상세 정보를 불러오지 못했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoadingSelectedResume(false);
    }
  };

  const handleApply = async () => {
    setIsSubmitting(true);
    // [백엔드 연동 POST 요청 부분]
    setTimeout(() => {
      setIsSubmitting(false);
      alert('지원이 완료되었습니다!');
      handleClose();
    }, 800);
  };

  const handleCreateSave = async () => {
    if (!createFormData.title.trim()) {
      alert('이력서 제목을 입력해주세요.');
      return;
    }
    if (!createFormData.profile.summary.trim()) {
      alert('자기소개를 입력해주세요.');
      return;
    }

    const hasInvalidDisability = (createFormData.profile.disabilities || []).some(
        (item) => !item.disabilityType?.trim()
    );
    if (hasInvalidDisability) {
      alert('장애 정보를 추가하신 경우, 장애 유형은 필수로 선택해주세요.');
      return;
    }

    const hasInvalidExperience = createFormData.experiences.some(
        (exp) => !exp.company?.trim() || !exp.position?.trim() || !exp.startDate?.trim() || !exp.endDate?.trim()
    );
    if (hasInvalidExperience) {
      alert('경력을 추가하신 경우, 회사명/직책/재직기간(시작·종료일)은 필수로 입력해주세요. (주요 업무/성과는 선택)');
      return;
    }

    const hasInvalidEducation = createFormData.educations.some(
        (edu) => !edu.school?.trim() || !edu.major?.trim() || !edu.startDate?.trim() || !edu.endDate?.trim() || !edu.degree?.trim()
    );
    if (hasInvalidEducation) {
      alert('학력을 추가하신 경우, 학교명/전공/재학기간(시작·종료일)/학위는 모두 필수로 입력해주세요.');
      return;
    }

    const hasInvalidSkill = createFormData.skills.some((skill) => !skill?.trim());
    if (hasInvalidSkill) {
      alert('추가된 스킬 항목을 확인해주세요.');
      return;
    }

    const hasUnselectedCertificate = createFormData.certificates.some((cert) => cert.isSearchMode || !cert.name);
    if (hasUnselectedCertificate) {
      alert('자격증을 추가하신 경우, 돋보기로 검색 후 체크(선택) 버튼으로 자격증명을 확정해주세요.');
      return;
    }
    const hasInvalidCertificate = createFormData.certificates.some((cert) => !cert.name?.trim() || !cert.date?.trim());
    if (hasInvalidCertificate) {
      alert('자격증을 추가하신 경우, 자격증명과 취득일은 필수로 입력해주세요.');
      return;
    }

    const hasInvalidLanguage = createFormData.languages.some(
        (lang) =>
            !lang.languageName?.trim() ||
            !lang.testName?.trim() ||
            !lang.score?.trim() ||
            !lang.acquiredDate?.trim() ||
            !lang.expirationDate?.trim()
    );
    if (hasInvalidLanguage) {
      alert('어학을 추가하신 경우, 언어명/시험명/점수/취득일/만료일은 모두 필수로 입력해주세요.');
      return;
    }

    try {
      const payload = {
        title: createFormData.title.trim(),
        selfIntroduction: createFormData.profile.summary.trim(),
        portfolioUrl: createFormData.profile.portfolioUrl?.trim() || '',
        careers: createFormData.experiences.map((exp) => ({
          companyName: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          content: exp.description
        })),
        educations: createFormData.educations.map((edu) => ({
          schoolName: edu.school,
          major: edu.major,
          startDate: edu.startDate,
          endDate: edu.endDate,
          degree: edu.degree
        })),
        skills: createFormData.skills.map((skill) => ({ skillKeyword: skill })),
        resumeDisabilities: (createFormData.profile.disabilities || []).map((item) => ({
          disabilityName: item.disabilityType,
          description: item.disabilityDescription || ''
        })),
        langQualifications: createFormData.languages.map((lang) => ({
          languageName: lang.languageName,
          testName: lang.testName,
          score: lang.score,
          acquiredDate: lang.acquiredDate,
          expirationDate: lang.expirationDate
        })),
        certificates: createFormData.certificates.map((cert) => ({
          certificateName: cert.name,
          acquiredDate: cert.date
        }))
      };

      const formData = new FormData();
      if (createFormData.profile.profileImage) {
        formData.append('image', createFormData.profile.profileImage);
      }
      formData.append(
          'data',
          new Blob([JSON.stringify(payload)], { type: 'application/json' })
      );

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${RESUME_API_BASE}/resumes`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData
      });

      if (!response.ok) {
        const serverMessage = await extractErrorMessage(
            response,
            '이력서 저장에 실패했습니다.'
        );
        throw new Error(serverMessage);
      }

      alert('이력서가 저장되었습니다.');
      setModalStep('select');
      setResumes([]);
    } catch (error) {
      console.error('이력서 저장 실패:', error);
      alert(error.message || '이력서 저장에 실패했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
            {modalStep === 'select' ? (
                <h2 className="text-lg font-bold text-gray-900">지원하기</h2>
            ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => { setModalStep('select'); setSelectedResume(null); }} className="text-gray-500 hover:text-gray-900 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </button>
                  <h2 className="text-lg font-bold text-[#5D4037]">
                    {modalStep === 'create' ? '새 이력서 작성' : '이력서 확인 및 지원'}
                  </h2>
                </div>
            )}
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* 모달 바디 */}
          <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
            {modalStep !== 'create' && job && (
                <div className="bg-[#FFF9F3] p-4 rounded-xl mb-6 shrink-0">
                  <p className="text-[13px] text-gray-500 mb-1">{job.company}</p>
                  <p className="text-[15px] font-bold text-gray-900">{job.title}</p>
                </div>
            )}

            {modalStep === 'select' && (
                <SelectResumeView
                    resumes={resumes}
                    isLoading={isLoadingResumes || isLoadingSelectedResume}
                    onSelect={handleSelectResume}
                    onGoCreate={() => setModalStep('create')}
                />
            )}

            {modalStep === 'create' && (
                <CreateResumeView
                    formData={createFormData}
                    setFormData={setCreateFormData}
                    activeTab={createActiveTab}
                    setActiveTab={setCreateActiveTab}
                    skillInput={createSkillInput}
                    setSkillInput={setCreateSkillInput}
                    onCancel={() => setModalStep('select')}
                    onSave={handleCreateSave}
                />
            )}

            {modalStep === 'preview' && selectedResume && (
                <PreviewResumeView
                    resume={selectedResume}
                    isSubmitting={isSubmitting}
                    onCancel={() => { setModalStep('select'); setSelectedResume(null); }}
                    onApply={handleApply}
                />
            )}
          </div>
        </div>
      </div>
  );
};


// ==========================================
// 4. 메인 화면 컴포넌트 (비즈니스 로직 집중)
// ==========================================
export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [jobError, setJobError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isUnauthenticatedMember = localStorage.getItem('memberType') === 'UNAUTHENTICATED';
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      setIsLoadingJob(true);
      setJobError(null);
      try {
        const apiJob = await jobPostingApi.getJobPostingDetail(id);
        if (apiJob) {
          const transformedJob = {
            id: apiJob.jobPostingId,
            company: apiJob.companyName || '미상',
            title: apiJob.title || '제목 없음',
            location: apiJob.workRegion || '전국',
            date: apiJob.applicationEndDate ? apiJob.applicationEndDate.toString() : '상시',
            workEnv: [apiJob.envBothHands, apiJob.envEyesight, apiJob.envHandWork, apiJob.envLiftPower, apiJob.envLstnTalk, apiJob.envStndWalk].filter(Boolean),
            badges: [apiJob.employmentType].filter(Boolean),
            tags: [apiJob.mainCategory, apiJob.subCategory].filter(Boolean),
            tech: [],
            original: {
              ...apiJob,
              compAddr: apiJob.workRegion,
              empType: apiJob.employmentType,
              reqCareer: apiJob.qualification,
              salary: apiJob.salary,
              salaryType: apiJob.salaryType,
              termDate: apiJob.applicationEndDate ? apiJob.applicationEndDate.toString() : '상시',
            }
          };
          setJob(transformedJob);
        } else {
          setJobError('존재하지 않거나 삭제된 공고입니다.');
        }
      } catch (err) {
        setJobError('공고를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoadingJob(false);
      }
    };
    fetchJobData();

    const fetchBookmarkStatus = async () => {
      try {
        const response = await api.get(`/api/bookmarks/${id}/status`);
        if (response.data && response.data.isBookmarked !== undefined) {
          setIsBookmarked(response.data.isBookmarked);
        }
      } catch (error) {
        console.error("북마크 상태 조회 실패:", error);
      }
    };
    if (id) {
        fetchBookmarkStatus();
    }
  }, [id]);

  const toggleBookmark = async () => {
    if (isUnauthenticatedMember) {
      alert('로그인 후 이용할 수 있습니다.');
      return;
    }
    try {
      await api.post(`/api/bookmarks/${job.id}`);
      setIsBookmarked(!isBookmarked);
      if (!isBookmarked) {
        alert("스크랩 목록에 추가되었습니다.");
      } else {
        alert("스크랩이 취소되었습니다.");
      }
    } catch (error) {
      console.error("북마크 토글 실패:", error);
      alert("요청 처리 중 오류가 발생했습니다.");
    }
  };

  if (isLoadingJob) {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">공고 정보를 불러오는 중입니다...</p>
        </div>
    );
  }

  if (jobError || !job) return <div className="py-20 text-center text-gray-500">공고를 찾을 수 없습니다.</div>;

  const orig = job.original || {};

  return (
      <>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* 상단 공고 헤더 정보 */}
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg sm:text-xl font-extrabold text-[#5D4037] shadow-sm">
                    {job.company.slice(0, 2)}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-semibold text-gray-500 mb-1">{job.company}</span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight truncate" title={job.title}>{job.title}</h1>
                    <div className="text-sm text-gray-500 font-medium mt-1 mb-4 flex items-center gap-1">
                      <i className="ri-map-pin-line text-gray-400"></i>{orig.compAddr || job.location || '위치 미상'}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {job.tags?.map((t, i) => <span key={`tag-${i}`} className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100 whitespace-nowrap">{t}</span>)}
                      {job.workEnv?.map((env, i) => <span key={`env-${i}`} className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 whitespace-nowrap">{formatEnv(env)}</span>)}
                      {job.tech?.map((tech, i) => <span key={`tech-${i}`} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200 whitespace-nowrap">#{tech}</span>)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2 shrink-0 bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-lg mt-4 sm:mt-0">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-orange-500">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>마감: {formatTermDate(orig.termDate || job.date)}
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 상세 스펙 정보 */}
            <div className="p-6 sm:p-8">
              <div className="bg-gray-50 rounded-xl p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 border border-gray-100">
                <InfoItem label="고용 형태" value={orig.empType || orig.enterType} />
                <InfoItem label="경력" value={orig.reqCareer} />
                <InfoItem label="학력" value={orig.reqEduc} />
                <InfoItem label="연봉" value={orig.salary ? `${orig.salary}${orig.salaryType ? ' ' + orig.salaryType : ''}` : null} />
                <InfoItem label="근무/입사 형태" value={orig.enterType} />
                <InfoItem label="근무 기간" value={formatTermDate(orig.termDate || job.date)} />
                <InfoItem label="담당자" value={orig.regagnName} />
                <InfoItem label="연락처" value={orig.cntctNo} />
              </div>

              {/* 버튼 영역 */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-gray-100">
                <button
                    onClick={toggleBookmark}
                    className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border transition-all ${
                        isBookmarked 
                        ? 'border-yellow-400 bg-yellow-50 text-yellow-500 hover:bg-yellow-100' 
                        : 'border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                    title={isBookmarked ? "스크랩 취소" : "스크랩하기"}
                >
                    <i className={isBookmarked ? "ri-star-fill text-2xl" : "ri-star-line text-2xl"}></i>
                </button>
                <button
                    onClick={() => {
                      if (isUnauthenticatedMember) {
                        alert('로그인 회원만 사용 가능한 기능입니다.');
                        return;
                      }
                      setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-[#E66235] hover:bg-[#D45326] shadow-md shadow-orange-200 transition-all text-white font-bold rounded-xl text-center"
                >
                  지금 지원하기
                </button>
                <Link to="/jobs" className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#E8D5C4] text-[#8B6B4A] font-bold rounded-xl text-center hover:bg-[#FFF9F3] hover:text-[#5D4037] transition-all duration-200 hover:shadow-sm flex items-center justify-center gap-2 group">
                  <i className="ri-sparkling-2-line group-hover:scale-110 transition-transform duration-200"></i>
                  목록으로
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 모달 렌더링 영역 */}
        <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} job={job} />
      </>
  );
}