import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobPostingApi } from '../../api/jobPostingApi';
import api from '../../api/axios';

// ==========================================
// 1. 필터 데이터 정의 (지역 + 6개 근로환경)
// ==========================================
const REGIONS = [
  "전국", "서울", "경기", "인천", "강원", "충남", "충북", "세종",
  "대전", "경북", "경남", "대구", "울산", "부산", "전북", "전남", "광주", "제주"
];

const ENV_OPTIONS = {
  envBothHands: ["양손작업 가능", "한손작업 가능", "한손보조작업 가능"],
  envEyesight: ["아주 작은 글씨를 읽을 수 있음", "일상적 활동 가능", "비교적 큰 인쇄물을 읽을 수 있음"],
  envHandWork: ["정밀한 작업가능", "작은 물품 조립가능", "큰 물품 조립가능"],
  envLiftPower: ["20Kg 이상의 물건을 다룰 수 있음", "5Kg 이내의 물건을 다룰 수 있음", "5~20Kg의 물건을 다룰 수 있음"],
  envLstnTalk: ["듣고 말하기에 어려움 없음", "간단한 듣고 말하기 가능", "듣고 말하는 작업 어려움"],
  envStndWalk: ["오랫동안 가능", "일부 서서하는 작업 가능", "서거나 걷는 일 어려움"]
};

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

export default function JobsPage() {
  const navigate = useNavigate();
  const memberType = localStorage.getItem("memberType") || "UNAUTHENTICATED";
  const isCompany = memberType.toUpperCase() === "COMPANY";

  // 2. 상태 관리 (검색어, 상세 필터 객체, 필터창 열림 여부)
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    mainCategory: '',
    subCategory: '',
    region: '',
    envBothHands: '',
    envEyesight: '',
    envHandWork: '',
    envLstnTalk: '',
    envStndWalk: ''
  });
  const [sortBy, setSortBy] = useState('latest');

  // 활성화된 필터 개수 계산
  const activeFilterCount = Object.values(filters).filter(val => val !== '').length;

  // 필터 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mainCategory') {
      setFilters(prev => ({ ...prev, mainCategory: value, subCategory: '' }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState(new Set());

  useEffect(() => {
    if (memberType !== 'UNAUTHENTICATED') {
      const fetchAllBookmarks = async () => {
        try {
          const res = await api.get('/api/bookmarks?page=0&size=1000');
          if (res.data && res.data.content) {
            setBookmarkedJobIds(new Set(res.data.content.map(b => b.jobPostingId)));
          }
        } catch (e) {
          console.error("북마크 조회 실패:", e);
        }
      };
      fetchAllBookmarks();
    }
  }, [memberType]);

  const toggleBookmark = async (e, jobId) => {
    e.stopPropagation();
    if (memberType === 'UNAUTHENTICATED') {
      alert("로그인 후 이용할 수 있습니다.");
      return;
    }
    try {
      const res = await api.post(`/api/bookmarks/${jobId}`);
      const isBookmarked = res.data.isBookmarked;
      
      setBookmarkedJobIds(prev => {
        const next = new Set(prev);
        if (isBookmarked) {
          next.add(jobId);
        } else {
          next.delete(jobId);
        }
        return next;
      });
      // 성공 메세지가 있다면 alert 띄우기 (옵션)
      // if (res.data.message) alert(res.data.message);
    } catch (e) {
      console.error(e);
      alert("북마크 처리 중 오류가 발생했습니다.");
    }
  };

  const fetchJobs = async (currentPage) => {
    try {
      const data = await jobPostingApi.getJobPostings({
        keyword: searchTerm || undefined,
        mainCategory: filters.mainCategory || undefined,
        subCategory: filters.subCategory || undefined,
        workRegion: filters.region && filters.region !== '전국' ? filters.region : undefined,
        envBothHands: filters.envBothHands || undefined,
        envEyesight: filters.envEyesight || undefined,
        envHandWork: filters.envHandWork || undefined,
        envLiftPower: filters.envLiftPower || undefined,
        envLstnTalk: filters.envLstnTalk || undefined,
        envStndWalk: filters.envStndWalk || undefined,
        sortBy: sortBy,
        page: currentPage,
        size: 12
      });
      if (data && data.content) {
        const transformedJobs = data.content.map(apiJob => ({
          id: apiJob.jobPostingId,
          company: apiJob.companyName || '미상',
          title: apiJob.title || '제목 없음',
          location: apiJob.workRegion || '전국',
          date: apiJob.applicationEndDate ? apiJob.applicationEndDate.toString() : '상시',
          workEnv: [apiJob.envBothHands, apiJob.envEyesight, apiJob.envHandWork, apiJob.envLiftPower, apiJob.envLstnTalk, apiJob.envStndWalk].filter(Boolean),
          badges: [apiJob.employmentType].filter(Boolean),
          tags: [apiJob.mainCategory, apiJob.subCategory].filter(Boolean),
          tech: [],
          original: apiJob,
          ...apiJob
        }));
        setJobs(transformedJobs);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  useEffect(() => {
    setPage(0);
    const timeoutId = setTimeout(() => {
      fetchJobs(0);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters, sortBy]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 0 && pageNum < totalPages) {
      setPage(pageNum);
      fetchJobs(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    let startPage = Math.max(0, page - 2);
    let endPage = Math.min(totalPages - 1, page + 2);
    
    if (endPage - startPage < 4) {
      if (startPage === 0) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(0, totalPages - 5);
      }
    }

    return (
      <div className="mt-12 flex items-center justify-center gap-2">
        <button 
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <i className="ri-arrow-left-s-line"></i>
        </button>
        {startPage > 0 && (
          <>
            <button onClick={() => handlePageChange(0)} className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all">1</button>
            {startPage > 1 && <span className="text-gray-400">...</span>}
          </>
        )}
        
        {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
          const p = startPage + i;
          return (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                page === p 
                  ? 'bg-[#E66235] text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p + 1}
            </button>
          );
        })}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <span className="text-gray-400">...</span>}
            <button onClick={() => handlePageChange(totalPages - 1)} className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all">{totalPages}</button>
          </>
        )}
        <button 
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
          className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>
    );
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setFilters({
      mainCategory: '', subCategory: '', region: '', envBothHands: '', envEyesight: '', envHandWork: '',
      envLiftPower: '', envLstnTalk: '', envStndWalk: ''
    });
  };

  // 3. 헬퍼 함수
  const formatTermDate = (term) => {
    if (!term) return '';
    if (term === '상시') return '상시';
    const parts = term.split('~').map(s => s.trim());
    const fmt = (d) => {
      if (!d) return '';
      const clean = d.replace(/[^0-9]/g, '');
      if (clean.length === 8) return clean.slice(4,6) + '-' + clean.slice(6,8);
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
    if (env.includes('듣') || env.includes('말')) return '청취/발화 가능';
    if (env.includes('서서')) return '서서작업 가능';
    if (env.includes('양손')) return '양손작업';
    if (env.includes('정밀')) return '정밀작업 가능';
    return env.length > 18 ? env.slice(0, 18) + '...' : env;
  };

  const formatLocation = (loc) => {
    if (!loc) return '';
    const cleaned = loc.replace(/\(.*?\)/g, '').replace(/[,·]/g, ' ').trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length >= 2) return `${parts[0]} ${parts[1]}`;
    return parts[0];
  };

  const renderLogo = (company) => {
    const cleaned = company.replace(/[()\s\u00A0]/g, '');
    const initials = cleaned.slice(0, 2);
    return (
        <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 shrink-0">
          {initials}
        </div>
    );
  };

  // 4. 필터링 로직 (프론트엔드 추가 필터링 제거하고 서버 결과를 그대로 사용)
  const filteredJobs = jobs;

  return (
      <div className="min-h-screen bg-[#FDFBF7] pb-20">
        {/* --- 배너 및 검색 영역 --- */}
        <div className="w-full bg-[#2A1D16] py-10">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col gap-8">

            {/* 타이틀 및 등록 버튼 (커뮤니티 테마 적용) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-sm">
                  <i className="ri-briefcase-line"></i>
                  <span>Jobs</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  채용 공고
                </h1>
                <p className="text-gray-400 text-sm font-medium">
                  장애 유형에 맞는 채용 공고를 찾아보세요
                </p>
              </div>

              {isCompany && (
                <Link
                    to="/company-jobpost-manage"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E66235] hover:bg-[#D45326] text-white text-sm font-bold rounded-md transition-all shadow-sm shrink-0"
                >
                  <i className="ri-pencil-fill"></i>
                  공고 관리
                </Link>
              )}
            </div>

            {/* 검색창 및 필터 토글 영역 */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-2/3 md:w-4/5">
              <div className="relative flex-1 flex items-center bg-white rounded-lg shadow-sm">
                <i className="ri-search-line absolute left-4 text-gray-400 text-lg"></i>
                <input
                    type="text"
                    placeholder="직무, 회사명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-transparent border-none text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 text-base rounded-lg"
                />
              </div>

              <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-lg transition-all text-base h-full shadow-sm w-full sm:w-auto shrink-0 border ${
                      isFilterOpen || activeFilterCount > 0
                          ? 'bg-[#E66235] text-white border-[#E66235] hover:bg-[#D45326]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <i className="ri-filter-3-line"></i>
                상세 필터 {activeFilterCount > 0 && `(${activeFilterCount})`}
                <i className={`ri-arrow-${isFilterOpen ? 'up' : 'down'}-s-line ml-1`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* --- 공고 목록 영역 --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

          {/* 확장형 상세 필터 패널 */}
          {isFilterOpen && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 animate-fade-in-down">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[15px] font-bold text-gray-900">맞춤 조건 설정</h3>
                  <button onClick={handleResetFilters} className="text-sm text-gray-500 hover:text-orange-500 flex items-center gap-1 transition-colors">
                    <i className="ri-refresh-line"></i> 초기화
                  </button>
                </div>

                <div className="space-y-6">
                  {/* --- 1번째 줄: 희망 지역 --- */}
                  <div className="max-w-xs">
                    <label className="block text-[12px] font-bold text-[#5D4037] mb-1.5">희망 지역</label>
                    <select name="region" value={filters.region} onChange={handleFilterChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-orange-400 focus:ring-1 outline-none truncate">
                      <option value="">전체 지역</option>
                      {REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                    </select>
                  </div>

                  {/* --- 2번째 줄: 직무 분류 --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1.5">직무 대분류</label>
                      <select name="mainCategory" value={filters.mainCategory} onChange={handleFilterChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-orange-400 focus:ring-1 outline-none truncate">
                        <option value="">전체</option>
                        {Object.keys(JOB_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#5D4037] mb-1.5">직무 소분류</label>
                      <select name="subCategory" value={filters.subCategory} onChange={handleFilterChange} disabled={!filters.mainCategory} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-orange-400 focus:ring-1 outline-none truncate disabled:bg-gray-100 disabled:text-gray-400">
                        <option value="">전체</option>
                        {filters.mainCategory && JOB_CATEGORIES[filters.mainCategory]?.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* --- 나머지 줄: 근무환경 --- */}
                  <div>
                    <h4 className="block text-[12px] font-bold text-[#5D4037] mb-3">
                       근무 환경
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {/* 1. 양손 활용 */}
                      <div>
                        <select name="envBothHands" value={filters.envBothHands} onChange={handleFilterChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-orange-400 focus:ring-1 outline-none truncate">
                          <option value="">양손 활용 (전체)</option>
                          {ENV_OPTIONS.envBothHands.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      {/* 2. 시각 */}
                      <div>
                        <select name="envEyesight" value={filters.envEyesight} onChange={handleFilterChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-orange-400 focus:ring-1 outline-none truncate">
                          <option value="">시각 (전체)</option>
                          {ENV_OPTIONS.envEyesight.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      {/* 3. 손작업 */}
                      <div>
                        <select name="envHandWork" value={filters.envHandWork} onChange={handleFilterChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-orange-400 focus:ring-1 outline-none truncate">
                          <option value="">손작업 (전체)</option>
                          {ENV_OPTIONS.envHandWork.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      {/* 4. 물건 다루기 */}
                      <div>
                        <select name="envLiftPower" value={filters.envLiftPower} onChange={handleFilterChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-orange-400 focus:ring-1 outline-none truncate">
                          <option value="">물건 다루기 (전체)</option>
                          {ENV_OPTIONS.envLiftPower.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      {/* 5. 의사소통 */}
                      <div>
                        <select name="envLstnTalk" value={filters.envLstnTalk} onChange={handleFilterChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-orange-400 focus:ring-1 outline-none truncate">
                          <option value="">의사소통 (전체)</option>
                          {ENV_OPTIONS.envLstnTalk.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      {/* 6. 서기/걷기 */}
                      <div>
                        <select name="envStndWalk" value={filters.envStndWalk} onChange={handleFilterChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-orange-400 focus:ring-1 outline-none truncate">
                          <option value="">서기/걷기 (전체)</option>
                          {ENV_OPTIONS.envStndWalk.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* 검색 결과 카운트 */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-gray-600 font-medium">
              총 <span className="text-[#E66235] font-bold">{totalElements}</span>건의 공고가 있습니다.
            </div>
            
            <div className="flex items-center gap-2">
              <i className="ri-sort-desc text-gray-400"></i>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-gray-700 focus:ring-0 cursor-pointer"
              >
                <option value="latest">최신순</option>
                <option value="views">조회순</option>
                <option value="deadline">마감임박순</option>
                <option value="applicants">지원자순</option>
              </select>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredJobs.map((job) => (
                    <div
                        key={job.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { navigate(`/jobs/${job.id}`); e.preventDefault(); } }}
                        className="relative p-5 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group cursor-pointer"
                    >
                      <button 
                        className="absolute top-5 right-5 transition-colors" 
                        onClick={(e) => toggleBookmark(e, job.id)}
                      >
                        <i className={`text-2xl ${bookmarkedJobIds.has(job.id) ? 'ri-star-fill text-[#E66235]' : 'ri-star-line text-gray-300 hover:text-[#E66235]'}`}></i>
                      </button>

                      <div className="flex items-start gap-4 mb-4 pr-6">
                        {renderLogo(job.company)}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-base font-bold text-gray-900 leading-tight truncate group-hover:text-[#5D4037] transition-colors">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 truncate">
                            {job.company}
                          </div>
                        </div>
                      </div>

                      <div className="flex-grow flex flex-wrap content-start gap-1.5 mb-5">
                        {job.badges?.map((b, i) => (
                            <span key={`badge-${i}`} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">{b}</span>
                        ))}
                        {job.tags?.map((t, i) => (
                            <span key={`tag-${i}`} className="px-2 py-1 text-xs font-medium rounded-md bg-orange-50 text-orange-600">
                              {t}
                            </span>
                        ))}
                        {job.workEnv?.map((env, i) => (
                            <span key={`env-${i}`} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md">{formatEnv(env)}</span>
                        ))}
                        {job.tech?.map((tech, i) => (
                            <span key={`tech-${i}`} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">{tech}</span>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between w-full mt-auto">
                        <div className="text-sm text-gray-500 truncate pr-2">{formatLocation(job.location)}</div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className={`text-sm font-semibold ${formatTermDate(job.date) === '상시' ? 'text-blue-500' : 'text-orange-500'}`}>{formatTermDate(job.date)}</div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              // 검색 결과가 없을 때 보여줄 화면
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-2xl">
                <i className="ri-file-search-line text-5xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-lg">조건에 맞는 채용 공고가 없습니다.</p>
                <button
                    onClick={() => { setSearchTerm(''); handleResetFilters(); }}
                    className="mt-4 px-4 py-2 text-sm text-[#E66235] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors font-bold"
                >
                  필터 및 검색어 초기화
                </button>
              </div>
          )}

          {/* 페이지네이션 */}
          {renderPagination()}
        </div>
      </div>
  );
}