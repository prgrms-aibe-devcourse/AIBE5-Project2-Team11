import { useState, useEffect } from 'react';
import { jobPostingApi } from '../../api/jobPostingApi';

// 옵션 데이터
const JOB_CATEGORIES = {
  "관리자": ["관리직(임원·부서장)"],
  "사무 종사자": ["경영·행정·사무직"],
  "서비스 종사자": [
    "돌봄 서비스직(간병·육아)", "미용·예식 서비스직", "스포츠·레크리에이션직", 
    "여행·숙박·오락 서비스직", "음식 서비스직", "경호·경비직", "청소 및 기타 개인서비스직"
  ],
  "판매 종사자": ["영업·판매직"],
  "전문가 및 관련 종사자": [
    "정보통신 연구개발직 및 공학기술직", "제조 연구개발직 및 공학기술직", 
    "건설·채굴 연구개발직 및 공학기술직", "자연·생명과학 연구직", "인문·사회과학 연구직", 
    "법률직", "사회복지·종교직", "교육직", "금융·보험직", "보건·의료직", "예술·디자인·방송직"
  ],
  "기능원 및 관련 기능 종사자": [
    "건설·채굴직", "기계 설치·정비·생산직", "금속·재료 설치·정비·생산직(판금·단조·주조·용접·도장 등)", 
    "전기·전자 설치·정비·생산직", "정보통신 설치·정비직", "화학·환경 설치·정비·생산직", 
    "인쇄·목재·공예 및 기타 설치·정비·생산직"
  ],
  "장치·기계조작 및 조립 종사자": ["식품 가공·생산직", "섬유·의복 생산직", "운전·운송직"],
  "농림어업 숙련 종사자": ["농림어업직"],
  "단순노무 종사자": ["제조 단순직"]
};

const REGION_DATA = {
  "서울": ["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"],
  "경기": ["가평군","고양시","과천시","광명시","광주시","구리시","군포시","김포시","남양주시","동두천시","부천시","성남시","수원시","시흥시","안산시","안성시","안양시","양주시","양평군","여주시","연천군","오산시","용인시","의왕시","의정부시","이천시","파주시","평택시","포천시","하남시","화성시"],
  "인천": ["강화군","계양구","남동구","동구","미추홀구","부평구","서구","연수구","옹진군","중구"],
  "강원": ["강릉시","고성군","동해시","삼척시","속초시","양구군","양양군","영월군","원주시","인제군","정선군","철원군","춘천시","태백시","평창군","홍천군","화천군","횡성군"],
  "충북": ["괴산군","단양군","보은군","영동군","옥천군","음성군","제천시","증평군","진천군","청주시","충주시"],
  "충남": ["계룡시","공주시","금산군","논산시","당진시","보령시","부여군","서산시","서천군","아산시","예산군","천안시","청양군","태안군","홍성군"],
  "대전": ["대덕구","동구","서구","유성구","중구"],
  "세종": ["세종시"],
  "전북": ["고창군","군산시","김제시","남원시","무주군","부안군","순창군","완주군","익산시","임실군","장수군","전주시","정읍시","진안군"],
  "전남": ["강진군","고흥군","곡성군","광양시","구례군","나주시","담양군","목포시","무안군","보성군","순천시","신안군","여수시","영광군","영암군","완도군","장성군","장흥군","진도군","함평군","해남군","화순군"],
  "광주": ["광산구","남구","동구","북구","서구"],
  "경북": ["경산시","경주시","고령군","구미시","군위군","김천시","문경시","봉화군","상주시","성주군","안동시","영덕군","영양군","영주시","영천시","예천군","울릉군","울진군","의성군","청도군","청송군","칠곡군","포항시"],
  "경남": ["거제시","거창군","고성군","김해시","남해군","밀양시","사천시","산청군","양산시","의령군","진주시","창녕군","창원시","통영시","하동군","함안군","함양군","합천군"],
  "부산": ["강서구","금정구","기장군","남구","동구","동래구","부산진구","북구","사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구"],
  "대구": ["남구","달서구","달성군","동구","북구","서구","수성구","중구"],
  "울산": ["남구","동구","북구","울주군","중구"],
  "제주": ["서귀포시","제주시"],
  "전국": ["전국"]
};

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
    main_category: '',
    sub_category: '',
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
        main_category: initialData.mainCategory || initialData.main_category || '',
        sub_category: initialData.subCategory || initialData.sub_category || '',
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
        title: '', main_category: '', sub_category: '', job_type: '', recruit_count: '',
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
        mainCategory: formData.main_category || '기타',
        subCategory: formData.sub_category || '',
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
                    <label className="text-sm font-bold text-gray-700 block mb-2">대분류 <span className="text-orange-500">*</span></label>
                    <select value={formData.main_category} onChange={(e) => setFormData({...formData, main_category: e.target.value, sub_category: ''})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none">
                      <option value="">대분류 선택</option>
                      {Object.keys(JOB_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">소분류 (상세직무) <span className="text-orange-500">*</span></label>
                    <select value={formData.sub_category} onChange={(e) => setFormData({...formData, sub_category: e.target.value})} disabled={!formData.main_category} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#B5A991] disabled:bg-gray-100 disabled:text-gray-400">
                      <option value="">소분류 선택</option>
                      {formData.main_category && JOB_CATEGORIES[formData.main_category]?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
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
                    <select value={formData.location_province} onChange={(e) => setFormData({...formData, location_province: e.target.value, location_city: ''})} className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none">
                      <option value="">도/시 선택</option>
                      {Object.keys(REGION_DATA).map(reg => <option key={reg} value={reg}>{reg}</option>)}
                    </select>
                    <select value={formData.location_city} onChange={(e) => setFormData({...formData, location_city: e.target.value})} disabled={!formData.location_province} className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none disabled:bg-gray-100 disabled:text-gray-400">
                      <option value="">시/군/구 선택</option>
                      {formData.location_province && REGION_DATA[formData.location_province]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <input type="text" value={formData.location_district} onChange={(e) => setFormData({...formData, location_district: e.target.value})} placeholder="구/동 직접입력" className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none" />
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
                    <input 
                      type="number" 
                      min="0"
                      max="2000000000"
                      value={formData.salary_amount} 
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val === '') {
                          setFormData({...formData, salary_amount: ''});
                          return;
                        }
                        const num = parseInt(val, 10);
                        if (!isNaN(num) && num >= 0 && num <= 2000000000) {
                          setFormData({...formData, salary_amount: num.toString()});
                        } else if (num > 2000000000) {
                          setFormData({...formData, salary_amount: '2000000000'});
                        }
                      }} 
                      placeholder="금액 입력 (최대 20억)" 
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none" 
                    />
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