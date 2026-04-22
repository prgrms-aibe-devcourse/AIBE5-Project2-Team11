import React from 'react';

export default function CompanyJobpostDetailModal({ isOpen, onClose, job }) {
  if (!isOpen || !job) return null;

  const workEnvLabels = {
    hands: "손 사용", vision: "시력", hand_work: "손 작업",
    lifting: "들기 능력", hearing: "청각·언어", standing: "서기·걷기"
  };

  const workEnvOptions = {
    envBothHands: ["", "양손작업 가능", "한손작업 가능", "한손보조작업 가능"],
    envEyesight: ["", "아주 작은 글씨를 읽을 수 있음", "일상적 활동 가능", "비교적 큰 인쇄물을 읽을 수 있음"],
    envHandWork: ["", "정밀한 작업가능", "작은 물품 조립가능", "큰 물품 조립가능"],
    envLiftPower: ["", "20Kg 이상의 물건을 다룰 수 있음", "5Kg 이내의 물건을 다룰 수 있음", "5~20Kg의 물건을 다룰 수 있음"],
    envLstnTalk: ["", "듣고 말하기에 어려움 없음", "간단한 듣고 말하기 가능", "듣고 말하는 작업 어려움"],
    envStndWalk: ["", "오랫동안 가능", "일부 서서하는 작업 가능", "서거나 걷는 일 어려움"],
  };

  const SectionTitle = ({ title }) => (
    <h3 className="text-base font-bold text-gray-800 border-b border-[#F1EEE5] pb-2 mb-4">{title}</h3>
  );

  const InfoRow = ({ label, value }) => (
    <div className="grid grid-cols-4 gap-4 py-2">
      <span className="text-sm font-bold text-[#8C7E69]">{label}</span>
      <span className="col-span-3 text-sm text-gray-700">{value || '-'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div className="flex gap-3">
            <div className="bg-[#FAF9F6] p-2.5 rounded-xl border border-[#F1EEE5]">
              <svg className="w-6 h-6 text-[#B5A991]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#FDF8E8] text-[#D9A34A] text-[10px] px-2 py-0.5 rounded-md font-bold border border-[#FBEFCD] mr-1">
                  {job.main_category || job.mainCategory}
                </span>
                <span className="bg-[#FDF8E8] text-[#D9A34A] text-[10px] px-2 py-0.5 rounded-md font-bold border border-[#FBEFCD]">
                  {job.sub_category || job.subCategory}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${job.is_closed ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-green-50 text-green-600 border-green-100'}`}>
                  {job.is_closed ? '마감됨' : '게시 중'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar space-y-8">
          {/* 기본 정보 */}
          <section>
            <SectionTitle title="기본 정보" />
            <div className="space-y-1">
              <InfoRow label="고용 형태" value={job.employmentType} />
              <InfoRow label="모집 인원" value={job.recruitCount ? `${job.recruitCount}명` : '0명'} />
              <InfoRow label="접수 기간" value={`${job.applicationStartDate?.split('T')[0] || job.created_at?.split('T')[0] || '-'} ~ ${job.application_end_date?.split('T')[0] || '-'}`} />
              <InfoRow label="자격 요건" value={job.qualification} />
            </div>
          </section>

          {/* 근무 조건 */}
          <section>
            <SectionTitle title="근무 조건" />
            <div className="space-y-1">
              <InfoRow label="근무 지역" value={job.workRegion} />
              <InfoRow label="급여 정보" value={job.salary ? `${job.salaryType || ''} ${job.salary}` : '회사 내규에 따름'} />
              <InfoRow label="근무 시간" value={job.workHours} />
            </div>
          </section>

          {/* 작업 환경 */}
          <section>
            <SectionTitle title="작업 환경" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 bg-[#FAF9F6] p-5 rounded-2xl border border-[#F1EEE5]">
              {Object.entries({
                envBothHands: "손 사용", envEyesight: "시력", envHandWork: "손 작업",
                envLiftPower: "들기 능력", envLstnTalk: "청각·언어", envStndWalk: "서기·걷기"
              }).map(([key, label]) => {
                const valueText = job[key] || '정보 없음'; // job.envBothHands 등 직접 매핑
                return (
                  <div key={key}>
                    <p className="text-[11px] font-bold text-[#B5A991] mb-1">{label}</p>
                    <p className="text-sm text-[#5B4636] font-medium">{valueText}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* 푸터 */}
        <div className="p-8 pt-4 flex justify-end border-t border-gray-50 bg-white">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-[#7C6E63] text-white font-bold text-sm hover:bg-[#6A5D54] transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
