import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jobPostingApi } from '../../api/jobPostingApi';

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
                      {resume.isDefault && <span className="px-1.5 py-0.5 bg-orange-100 text-[#E66235] text-[11px] font-bold rounded">기본</span>}
                    </div>
                    <div className="text-[13px] text-gray-500 leading-tight">
                      {resume.userName} · {resume.disabilityType}
                    </div>
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

const CreateResumeView = ({ formData, onChange, onCancel, onSave }) => (
    <div className="flex flex-col h-full">
      <div className="space-y-5 flex-1">
        <div>
          <label className="block text-[13px] font-bold text-[#5D4037] mb-1.5">이름</label>
          <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="홍길동" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#5D4037] mb-1.5">연락처</label>
          <input type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="010-0000-0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#5D4037] mb-1.5">이메일</label>
          <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="example@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#5D4037] mb-1.5">장애 유형</label>
          <select name="disabilityType" value={formData.disabilityType} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm">
            <option value="">선택해주세요</option>
            <option value="지체장애">지체장애</option>
            <option value="시각장애">시각장애</option>
            <option value="청각장애">청각/언어장애</option>
            <option value="발달장애">발달장애 (지적/자폐)</option>
          </select>
        </div>

        {/* 근로 가능 환경 (6개 항목, 2열 그리드로 배치) */}
        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-[14px] font-bold text-gray-900 mb-4">근로 가능 환경</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[#5D4037] mb-1">양손 활용</label>
              <select name="envBothHands" value={formData.envBothHands} onChange={onChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] truncate">
                <option value="">선택</option>
                {ENV_OPTIONS.envBothHands.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#5D4037] mb-1">시각</label>
              <select name="envEyesight" value={formData.envEyesight} onChange={onChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] truncate">
                <option value="">선택</option>
                {ENV_OPTIONS.envEyesight.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#5D4037] mb-1">손작업</label>
              <select name="envHandWork" value={formData.envHandWork} onChange={onChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] truncate">
                <option value="">선택</option>
                {ENV_OPTIONS.envHandWork.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#5D4037] mb-1">물건 다루기</label>
              <select name="envLiftPower" value={formData.envLiftPower} onChange={onChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] truncate">
                <option value="">선택</option>
                {ENV_OPTIONS.envLiftPower.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#5D4037] mb-1">의사소통</label>
              <select name="envLstnTalk" value={formData.envLstnTalk} onChange={onChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] truncate">
                <option value="">선택</option>
                {ENV_OPTIONS.envLstnTalk.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#5D4037] mb-1">서기/걷기</label>
              <select name="envStndWalk" value={formData.envStndWalk} onChange={onChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] truncate">
                <option value="">선택</option>
                {ENV_OPTIONS.envStndWalk.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <label className="block text-[13px] font-bold text-[#5D4037] mb-1.5">자기소개</label>
          <textarea name="introduction" value={formData.introduction} onChange={onChange} rows="4" placeholder="직무와 관련된 경험 및 강점을 작성해주세요." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none" />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3 shrink-0">
        <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-[#5D4037] font-bold text-sm hover:bg-gray-50 transition-colors">이전</button>
        <button onClick={onSave} className="flex-1 py-3.5 rounded-xl bg-[#E66235] text-white font-bold text-sm hover:bg-[#D45326] transition-colors">다음</button>
      </div>
    </div>
);

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
            <p className="text-[13px] text-gray-900 font-medium">{resume.userName} ({resume.disabilityType})</p>
            <p className="text-[13px] text-gray-600 mt-1">{resume.phone} | {resume.email}</p>
          </div>
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[11px] font-bold text-gray-400 mb-1.5">근로 가능 환경</p>
            {/* 6개 항목 렌더링 영역 */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[12px]">
              <span className="text-gray-500">양손 활용: <span className="text-gray-900 font-medium ml-1">{resume.envBothHands || '-'}</span></span>
              <span className="text-gray-500">시각: <span className="text-gray-900 font-medium ml-1">{resume.envEyesight || '-'}</span></span>
              <span className="text-gray-500">손작업: <span className="text-gray-900 font-medium ml-1">{resume.envHandWork || '-'}</span></span>
              <span className="text-gray-500">물건 다루기: <span className="text-gray-900 font-medium ml-1">{resume.envLiftPower || '-'}</span></span>
              <span className="text-gray-500">의사소통: <span className="text-gray-900 font-medium ml-1">{resume.envLstnTalk || '-'}</span></span>
              <span className="text-gray-500">서기/걷기: <span className="text-gray-900 font-medium ml-1">{resume.envStndWalk || '-'}</span></span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[11px] font-bold text-gray-400 mb-1.5">자기소개</p>
            <p className="text-[13px] text-gray-800 leading-relaxed bg-white p-3 border border-gray-100 rounded-lg">
              {resume.introduction || "등록된 자기소개가 없습니다."}
            </p>
          </div>
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // envHandWork 포함하여 상태 초기화
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', disabilityType: '', introduction: '',
    envBothHands: '', envEyesight: '', envHandWork: '', envLiftPower: '', envLstnTalk: '', envStndWalk: ''
  });

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setModalStep('select');
      setSelectedResume(null);
    }, 300);
  };

  useEffect(() => {
    if (isOpen && modalStep === 'select' && resumes.length === 0) {
      setIsLoadingResumes(true);
      setTimeout(() => {
        // 프리뷰 테스트를 위해 envHandWork 포함된 더미 데이터 설정
        setResumes([
          { id: 1, title: '기본 이력서', isDefault: true, userName: '김다온', university: '서울대학교', disabilityType: '지체장애', disabilityLevel: '3급', phone: '010-1234-5678', email: 'daon@example.com', envBothHands: '양손작업 가능', envEyesight: '일상적 활동 가능', envHandWork: '정밀한 작업가능', envLiftPower: '5Kg 이내의 물건을 다룰 수 있음', envLstnTalk: '듣고 말하기에 어려움 없음', envStndWalk: '서거나 걷는 일 어려움', introduction: '주어진 업무를 성실히 수행하며, 문제 해결에 능장적인 지원자입니다.' },
          { id: 2, title: 'IT 개발자 이력서', isDefault: false, userName: '김다온', university: '서울대학교', disabilityType: '지체장애', disabilityLevel: '3급', phone: '010-1234-5678', email: 'dev.daon@example.com', envBothHands: '양손작업 가능', envEyesight: '일상적 활동 가능', envHandWork: '작은 물품 조립가능', envLiftPower: '5Kg 이내의 물건을 다룰 수 있음', envLstnTalk: '간단한 듣고 말하기 가능', envStndWalk: '서거나 걷는 일 어려움', introduction: 'Spring Boot와 JPA를 활용한 백엔드 개발 경험이 있으며, 사용자 친화적인 시스템 구축에 관심이 많습니다.' }
        ]);
        setIsLoadingResumes(false);
      }, 600);
    }
  }, [isOpen, modalStep, resumes.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
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
                    isLoading={isLoadingResumes}
                    onSelect={(r) => { setSelectedResume(r); setModalStep('preview'); }}
                    onGoCreate={() => setModalStep('create')}
                />
            )}

            {modalStep === 'create' && (
                <CreateResumeView
                    formData={formData}
                    onChange={handleInputChange}
                    onCancel={() => setModalStep('select')}
                    onSave={() => { alert('임시저장 되었습니다.'); setModalStep('select'); }}
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
            tags: [apiJob.jobCategory].filter(Boolean),
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
  }, [id]);

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
                <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-[#E66235] hover:bg-[#D45326] shadow-md shadow-orange-200 transition-all text-white font-bold rounded-xl text-center">
                  지금 지원하기
                </button>
                <Link to="/jobs" className="w-full sm:w-auto px-6 py-3.5 bg-white border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 font-bold rounded-xl text-center">목록으로</Link>
              </div>
            </div>
          </div>
        </div>

        {/* 모달 렌더링 영역 */}
        <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} job={job} />
      </>
  );
}