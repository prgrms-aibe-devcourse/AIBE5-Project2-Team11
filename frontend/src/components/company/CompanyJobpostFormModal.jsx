import { useState, useEffect } from 'react';
import { jobPostingApi } from '../../api/jobPostingApi';

// 옵션 데이터
const categories = ["사무행정", "IT개발", "고객상담", "생산제조", "디자인", "마케팅홍보", "영업", "교육", "의료보건", "서비스", "건설건축", "물류배송", "기타"];
const jobTypes = ["정규직", "계약직", "파트타임", "일용직", "인턴", "프리랜서"];
const salaryTypes = ["연봉", "월급", "일급", "시급"];

const workEnvOptions = {
  hands: ["양손작업 가능", "한손작업 가능", "한손보조작업 가능"],
  vision: ["아주 작은 글씨를 읽을 수 있음", "일상적 활동 가능", "비교적 큰 인쇄물을 읽을 수 있음"],
  hand_work: ["정밀한 작업 가능", "작은 물품 조립 가능", "큰 물품 조립 가능"],
  lifting: ["20Kg 이상의 물건을 다룰 수 있음", "5Kg 이내의 물건을 다룰 수 있음", "5~20Kg의 물건을 다룰 수 있음"],
  hearing: ["듣고 말하기에 어려움 없음", "간단한 듣고 말하기 가능", "듣고 말하는 작업 어려움"],
  standing: ["오랫동안 가능", "일부 서서하는 작업 가능", "서거나 걷는 일 어려움"],
};

const workEnvLabels = {
  hands: "손 사용", vision: "시력", hand_work: "손 작업",
  lifting: "들기 능력", hearing: "청각·언어", standing: "서기·걷기"
};

export default function CompanyJobpostFormModal({ isOpen, onClose, initialData = null }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    job_type: '',
    recruit_count: '',
    start_date: '',
    end_date: '',
    qualification: '',
    content: '',
    location_province: '',
    location_city: '',
    location_district: '',
    location_detail: '',
    salary_type: '',
    salary_amount: '',
    working_hours: '',
    work_environment: {
      hands: '1', vision: '1', hand_work: '1', lifting: '1', hearing: '1', standing: '1',
    }
  });

  useEffect(() => { 
    if (initialData) { 
      setFormData({
        title: initialData.title || '',
        category: initialData.jobCategory || initialData.job_category || '',
        job_type: initialData.employmentType || '',
        recruit_count: initialData.recruitCount || '',
        start_date: initialData.applicationStartDate?.split('T')[0] || '',
        end_date: initialData.applicationEndDate?.split('T')[0] || initialData.application_end_date?.split('T')[0] || '',
        qualification: initialData.qualification || '',
        content: initialData.content || '',
        location_province: initialData.workRegion?.split(' ')[0] || '',
        location_city: initialData.workRegion?.split(' ')[1] || '',
        location_district: initialData.workRegion?.split(' ')[2] || '',
        location_detail: '',
        salary_type: initialData.salaryType || '',
        salary_amount: initialData.salary?.toString() || '',
        working_hours: initialData.workHours || '',
        work_environment: {
          hands: String(Math.max(1, workEnvOptions.hands.indexOf(initialData.envBothHands || '') + 1)),
          vision: String(Math.max(1, workEnvOptions.vision.indexOf(initialData.envEyesight || '') + 1)),
          hand_work: String(Math.max(1, workEnvOptions.hand_work.indexOf(initialData.envHandWork || '') + 1)),
          lifting: String(Math.max(1, workEnvOptions.lifting.indexOf(initialData.envLiftPower || '') + 1)),
          hearing: String(Math.max(1, workEnvOptions.hearing.indexOf(initialData.envLstnTalk || '') + 1)),
          standing: String(Math.max(1, workEnvOptions.standing.indexOf(initialData.envStndWalk || '') + 1)),
        }
      });
      setStep(1);
    } else { 
      setFormData({
        title: '', category: '', job_type: '', recruit_count: '',
        start_date: '', end_date: '', qualification: '', content: '',
        location_province: '', location_city: '', location_district: '', location_detail: '',
        salary_type: '', salary_amount: '', working_hours: '',
        work_environment: { hands: '1', vision: '1', hand_work: '1', lifting: '1', hearing: '1', standing: '1' }
      });
      setStep(1); 
    } 
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!formData.title || !formData.title.trim()) {
      alert("공고 제목을 입력해주세요.");
      setStep(1);
      return;
    }

    try {
      const isEdit = initialData && initialData.job_posting_id;
      
      const payload = {
        title: formData.title.trim(),
        jobCategory: formData.category || '기타',
        employmentType: formData.job_type || '정규직',
        workRegion: [formData.location_province, formData.location_city, formData.location_district].filter(Boolean).join(' ').trim() || '전국',
        applicationStartDate: formData.start_date || null,
        applicationEndDate: formData.end_date || null,
        content: formData.content || "상세 내용 없음",
        salary: formData.salary_amount ? parseInt(formData.salary_amount.toString().replace(/[^0-9]/g, ''), 10) : null,
        salaryType: formData.salary_type || null,
        recruitCount: formData.recruit_count ? parseInt(formData.recruit_count, 10) : null,
        qualification: formData.qualification || null,
        workHours: formData.working_hours || null,
        envBothHands: workEnvOptions.hands[parseInt(formData.work_environment.hands) - 1],
        envEyesight: workEnvOptions.vision[parseInt(formData.work_environment.vision) - 1],
        envHandWork: workEnvOptions.hand_work[parseInt(formData.work_environment.hand_work) - 1],
        envLiftPower: workEnvOptions.lifting[parseInt(formData.work_environment.lifting) - 1],
        envLstnTalk: workEnvOptions.hearing[parseInt(formData.work_environment.hearing) - 1],
        envStndWalk: workEnvOptions.standing[parseInt(formData.work_environment.standing) - 1],
      };

      if (isEdit) {
        await jobPostingApi.updateJobPosting(initialData.job_posting_id, payload);
        alert('성공적으로 공고가 수정되었습니다.');
      } else {
        await jobPostingApi.createJobPosting(payload);
        alert('성공적으로 공고가 등록되었습니다.');
      }
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Failed to save job post', err);
      alert(err.response?.data?.message || '저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* 헤더 */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div className="flex gap-3">
            <div className="bg-[#F1EEE5] p-2.5 rounded-xl">
              <svg className="w-6 h-6 text-[#B5A991]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{initialData ? '공고 수정' : '새 공고 등록'}</h2>
              <p className="text-sm text-gray-400">{initialData ? '기존 공고 내용을 수정합니다' : '채용 공고를 작성하고 게시하세요'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* 스테퍼 */}
        <div className="px-8 mb-6">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div className={`w-fit px-4 py-1 rounded-full text-xs font-bold ${step === num ? 'bg-[#7C6E63] text-white' : 'bg-[#F1EEE5] text-[#B5A991]'}`}>
                  {num} {['기본 정보', '근무 조건', '작업 환경 설정'][num-1]}
                </div>
                {num < 3 && <div className="w-8 h-[1px] bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* 폼 본문 */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-[#F1EEE5] pb-2 mb-4">
                <h3 className="text-base font-bold text-gray-800">기본 정보</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">공고 제목 <span className="text-orange-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="예: 데이터 입력 및 사무 보조" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#B5A991]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">직무 분야 <span className="text-orange-500">*</span></label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none">
                      <option value="">직무 선택</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">고용 형태 <span className="text-orange-500">*</span></label>
                    <select value={formData.job_type} onChange={(e) => setFormData({...formData, job_type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none">
                      <option value="">형태 선택</option>
                      {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">모집 인원</label>
                    <input type="number" value={formData.recruit_count} onChange={(e) => setFormData({...formData, recruit_count: e.target.value})} placeholder="명" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">접수 기간 <span className="text-orange-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <input type="date" value={formData.start_date || formData.applicationStartDate?.split('T')[0] || ''} onChange={(e) => setFormData({...formData, start_date: e.target.value})} className="w-full px-2 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none" />
                      <span className="text-gray-400">~</span>
                      <input type="date" value={formData.end_date || formData.applicationEndDate?.split('T')[0] || ''} onChange={(e) => setFormData({...formData, end_date: e.target.value})} className="w-full px-2 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">자격 요건</label>
                  <textarea rows="2" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none resize-none" placeholder="지원 자격을 입력하세요"></textarea>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">상세 직무 내용 <span className="text-orange-500">*</span></label>
                  <textarea rows="3" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none resize-none" placeholder="상세 직무 내용을 자유롭게 입력하세요"></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-[#F1EEE5] pb-2 mb-4">
                <h3 className="text-base font-bold text-gray-800">근무 조건</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">근무 지역 <span className="text-orange-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input type="text" value={formData.location_province} onChange={(e) => setFormData({...formData, location_province: e.target.value})} placeholder="도/시" className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none" />
                    <input type="text" value={formData.location_city} onChange={(e) => setFormData({...formData, location_city: e.target.value})} placeholder="시/군" className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none" />
                    <input type="text" value={formData.location_district} onChange={(e) => setFormData({...formData, location_district: e.target.value})} placeholder="구/동" className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none" />
                  </div>
                  <input type="text" value={formData.location_detail} onChange={(e) => setFormData({...formData, location_detail: e.target.value})} placeholder="상세주소를 입력하세요" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">급여</label>
                  <div className="flex gap-2">
                    <select value={formData.salary_type} onChange={(e) => setFormData({...formData, salary_type: e.target.value})} className="w-32 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none">
                      <option value="">유형</option>
                      {salaryTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <input type="number" value={formData.salary_amount} onChange={(e) => setFormData({...formData, salary_amount: e.target.value})} placeholder="금액 입력" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">근무 시간</label>
                  <input type="text" value={formData.working_hours} onChange={(e) => setFormData({...formData, working_hours: e.target.value})} placeholder="예: 09:00 ~ 18:00 (주 5일)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-[#F1EEE5] pb-2 mb-4">
                <h3 className="text-base font-bold text-gray-800">작업 환경 설정</h3>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {Object.entries(workEnvOptions).map(([key, options]) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">{workEnvLabels[key]}</label>
                    <select 
                      value={formData.work_environment[key]} 
                      onChange={(e) => setFormData({
                        ...formData, 
                        work_environment: {...formData.work_environment, [key]: e.target.value}
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#B5A991] text-sm text-gray-600"
                    >
                      {options.map((opt, idx) => (
                        <option key={idx} value={String(idx + 1)}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-8 pt-4 flex justify-between items-center border-t border-gray-50 bg-white">
          <button onClick={step === 1 ? onClose : handlePrev} className="px-8 py-3 rounded-2xl bg-[#F1EEE5] text-[#7C6E63] font-bold text-sm hover:bg-[#EAE5D8] transition-colors">
            {step === 1 ? '취소' : '이전'}
          </button>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-300 font-bold">{step} / 3 단계</span>
            <button 
              onClick={step < 3 ? handleNext : handleSubmit} 
              className="px-8 py-3 rounded-2xl bg-[#7C6E63] text-white font-bold text-sm hover:bg-[#6A5D54] transition-colors"
            >
              {step < 3 ? '다음' : initialData ? '수정 완료' : '공고 게시하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}