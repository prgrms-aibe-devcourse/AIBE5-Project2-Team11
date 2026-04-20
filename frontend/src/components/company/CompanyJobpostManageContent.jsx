import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import CompanyJobpostCloseModal from './CompanyJobpostCloseModal';
import CompanyJobpostFormModal from './CompanyJobpostFormModal';
import CompanyJobpostDetailModal from './CompanyJobpostDetailModal';
import { jobPostingApi } from '../../api/jobPostingApi';

export default function CompanyJobpostManageContent() {
  const navigate = useNavigate();
  const [postings, setPostings] = useState([]);
  
  // 모달 상태 관리
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false); // 마감 모달
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);   // 등록/수정 폼 모달
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 상세 조회 모달

  const [selectedJob, setSelectedJob] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [activeTab, setActiveTab] = useState('전체');

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const data = await jobPostingApi.getJobPostingsByCompanyId(1, { size: 100 });
        if (data && data.content) {
          // 회사별 조회가 아직 백엔드에 없으므로 일단 전체 공고를 가져와서 UI에 맞춰 매핑합니다 
          // -> 백엔드 회사별 조회 API 구현 완료, companyId=1 로 호출
          const myJobs = data.content.map(apiJob => ({
            job_posting_id: apiJob.jobPostingId,
            title: apiJob.title || '제목 없음',
            job_category: apiJob.jobCategory || '카테고리',
            created_at: apiJob.createdAt ? apiJob.createdAt.toString() : '2023-01-01',
            updated_at: apiJob.updatedAt ? apiJob.updatedAt.toString() : '2023-01-01',
            application_end_date: apiJob.applicationEndDate ? apiJob.applicationEndDate.toString() : '2099-12-31',
            is_closed: apiJob.isClosed || false,
            view_count: apiJob.viewCount || 0,
            ...apiJob
          }));
          setPostings(myJobs);
        }
      } catch (err) {
        console.error('Failed to fetch job postings', err);
      }
    };
    fetchPostings();
  }, []);

  // 데이터 요약 계산
  const totalCount = postings.length;
  const activeCount = postings.filter(job => !job.is_closed).length;
  const closedCount = postings.filter(job => job.is_closed).length;
  const totalApplicants = postings.reduce((acc, job) => acc + Math.floor(job.view_count / 5), 0);

  // 필터링된 리스트
  const filteredPostings = postings.filter((job) => {
    if (activeTab === '게시 중') return !job.is_closed;
    if (activeTab === '마감') return job.is_closed;
    return true;
  });

  const formatDate = (dateString) => dateString?.split('T')[0].replace(/-/g, '.');

  // 상세 페이지 이동 (지원자 관리 페이지로 이동)
  const handleRowClick = (jobId) => {
    navigate(`/companyapplicants/${jobId}`);
  };

  // 폼 모달 열기 (등록/수정 공통)
  const handleOpenForm = (e, job = null) => {
    if (e) e.stopPropagation();
    setSelectedJob(job);
    setIsFormModalOpen(true);
    setOpenMenuId(null);
  };

  // 상세 조회 모달 열기
  const handleOpenDetail = (e, job) => {
    if (e) e.stopPropagation();
    setSelectedJob(job);
    setIsDetailModalOpen(true);
    setOpenMenuId(null);
  };

  // 메뉴 토글
  const toggleMenu = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY - 10,
        left: rect.left + window.scrollX - 100
      });
      setOpenMenuId(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => { if (openMenuId) setOpenMenuId(null); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [openMenuId]);

  // 마감 모달 열기
  const handleCloseClick = (e, job) => {
    e.stopPropagation();
    if (!job || job.is_closed) return;
    setSelectedJob(job);
    setIsCloseModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmClose = async () => {
    try {
      // API call to close job posting (임시로 companyId = 1 전달)
      await jobPostingApi.closeJobPosting(1, selectedJob.job_posting_id);
      setPostings(prev => prev.map(job => 
        job.job_posting_id === selectedJob.job_posting_id ? { ...job, is_closed: true } : job
      ));
    } catch (err) {
      console.error('Failed to close job posting', err);
      alert('마감 처리에 실패했습니다.');
    }
    setIsCloseModalOpen(false);
  };

  return (
    <div className="space-y-10" onClick={() => setOpenMenuId(null)}>
      {/* 1. 공고 현황 요약 */}
      <section className="bg-[#FAF9F6] p-8 rounded-3xl border border-[#F1EEE5]">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
          <svg className="w-5 h-5 text-[#B5A991]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          공고 현황
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: '게시 중인 공고', count: activeCount, unit: '건' },
            { label: '마감된 공고', count: closedCount, unit: '건' },
            { label: '총 지원자 수', count: totalApplicants, unit: '명' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-7 rounded-2xl shadow-sm">
              <span className="text-xs text-gray-400 block mb-4">{item.label}</span>
              <p className="text-3xl font-extrabold text-gray-900">{item.count} <span className="text-base font-medium text-gray-500">{item.unit}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 게시한 공고 리스트 */}
      <section className="bg-white p-8 rounded-3xl border border-[#F1EEE5]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">게시한 공고 리스트</h2>
          <button
            onClick={(e) => handleOpenForm(e)}
            className="bg-[#F59E0B] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-[#D98E06] transition-all"
          >
            + 새 공고 등록
          </button>
        </div>

        <div className="flex w-fit gap-1 mb-8 bg-[#F3EFE5] p-1.5 rounded-full border border-[#E9E4D6]">
          {['전체', '게시 중', '마감'].map(tab => {
             const count = tab === '전체' ? totalCount : tab === '게시 중' ? activeCount : closedCount;
             return (
               <button 
                 key={tab} 
                 onClick={() => setActiveTab(tab)} 
                 className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-[#3D2B24] shadow-sm' : 'text-[#8C7E69]'}`}
               >
                 {tab} {count}
               </button>
             );
          })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F3EFE5] text-[#8C7E69]">
                <th className="px-6 py-4 rounded-l-xl font-bold text-left">공고 제목</th>
                <th className="px-4 py-4 font-bold text-center">작성일 / 수정일</th>
                <th className="px-4 py-4 font-bold text-center">마감일</th>
                <th className="px-4 py-4 font-bold text-center">지원자</th>
                <th className="px-4 py-4 font-bold text-center">지원 상태</th>
                <th className="px-6 py-4 rounded-r-xl w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPostings.map((job) => (
                <tr 
                  key={job.job_posting_id} 
                  onClick={() => handleRowClick(job.job_posting_id)}
                  className="group hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <td className="px-6 py-6">
                    <span className="inline-block bg-[#FDF8E8] text-[#D9A34A] text-[10px] px-2 py-0.5 rounded-md font-bold mb-1.5 border border-[#FBEFCD]">{job.job_category}</span>
                    <p className="font-bold text-gray-900 leading-tight break-keep">{job.title}</p>
                  </td>
                  <td className="px-4 py-6 text-center text-[12px] text-[#A3A3A3] whitespace-nowrap">
                    <p>작성 {formatDate(job.created_at)}</p>
                    <p>수정 {formatDate(job.updated_at)}</p>
                  </td>
                  <td className="px-4 py-6 text-center text-[12px] text-[#A3A3A3] whitespace-nowrap">{job.application_end_date?.replace(/-/g, '.')}</td>
                  <td className="px-4 py-6 text-center whitespace-nowrap font-bold text-gray-900">{Math.floor(job.view_count / 5)}명</td>
                  <td className="px-4 py-6 text-center whitespace-nowrap">
                    <button 
                      onClick={(e) => handleCloseClick(e, job)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border ${!job.is_closed ? 'bg-white text-gray-700 hover:bg-gray-50' : 'bg-[#F1F1F1] text-gray-400'}`}
                    >
                      {job.is_closed ? '마감됨' : '마감하기'}
                    </button>
                  </td>
                  <td className="px-6 py-6 text-center text-gray-400">
                    <button onClick={(e) => toggleMenu(e, job.job_posting_id)} className="hover:text-gray-600 p-1">
                      <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 메뉴 레이어 (Portal) */}
      {openMenuId && ReactDOM.createPortal(
        <div 
          className="absolute w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-[10000] overflow-hidden" 
          style={{ top: menuPos.top, left: menuPos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 공고 보기 버튼 클릭 시 상세 모달 열기 */}
          <button
            onClick={(e) => handleOpenDetail(e, postings.find(j => j.job_posting_id === openMenuId))}
            className="w-full px-4 py-3 text-left text-xs text-gray-700 hover:bg-gray-50 border-b border-gray-50"
          >
            공고 보기
          </button>
          <button 
            onClick={(e) => handleOpenForm(e, postings.find(j => j.job_posting_id === openMenuId))}
            className="w-full px-4 py-3 text-left text-xs text-gray-700 hover:bg-gray-50 border-b border-gray-50"
          >
            공고 수정
          </button>
        </div>,
        document.body
      )}

      {/* 등록/수정 폼 모달 */}
      <CompanyJobpostFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedJob(null);
        }} 
        initialData={selectedJob}
      />

      {/* 공고 상세 조회 모달 */}
      <CompanyJobpostDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
      />

      {/* 마감 확인 모달 */}
      <CompanyJobpostCloseModal 
        isOpen={isCloseModalOpen} 
        onClose={() => {
          setIsCloseModalOpen(false);
          setSelectedJob(null);
        }} 
        onConfirm={handleConfirmClose} 
        jobTitle={selectedJob?.title} 
      />
    </div>
  );
}
