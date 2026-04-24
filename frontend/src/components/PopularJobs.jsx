import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobPostingApi } from '../api/jobPostingApi';
import api from '../api/axios';

export default function PopularJobs() {
  const navigate = useNavigate();
  const memberType = localStorage.getItem("memberType") || "UNAUTHENTICATED";
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState(new Set());

  const itemsToShow = 3;

  // 북마크 상태 로드
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

  // 인기 공고 데이터 로드
  useEffect(() => {
    const fetchPopularJobs = async () => {
      setIsLoading(true);
      try {
        // 공고 목록을 가져온다 (최대 100개)
        const data = await jobPostingApi.getJobPostings({
          size: 100,
          page: 0
        });

        if (data && data.content && data.content.length > 0) {
          // viewCount 기준으로 정렬하고 상위 10개 선택
          const popularJobsList = data.content
            .map(apiJob => ({
              id: apiJob.jobPostingId,
              company: apiJob.companyName || '미상',
              title: apiJob.title || '제목 없음',
              location: apiJob.workRegion || '전국',
              date: apiJob.applicationEndDate ? apiJob.applicationEndDate.toString() : '상시',
              workEnv: [apiJob.envBothHands, apiJob.envEyesight, apiJob.envHandWork, apiJob.envLiftPower, apiJob.envLstnTalk, apiJob.envStndWalk].filter(Boolean),
              badges: [apiJob.employmentType].filter(Boolean),
              tags: [apiJob.mainCategory, apiJob.subCategory].filter(Boolean),
              viewCount: apiJob.viewCount || 0,
              original: apiJob
            }))
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 10);

          setJobs(popularJobsList);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error('인기 공고 데이터 조회 실패:', err);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularJobs();
  }, []);

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
    } catch (e) {
      console.error(e);
      alert("북마크 처리 중 오류가 발생했습니다.");
    }
  };

  const handleNextClick = () => {
    const maxIndex = Math.max(0, jobs.length - itemsToShow);
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

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

  if (isLoading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-3 border-[#E66235] border-t-transparent rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!jobs || jobs.length === 0) {
    return null;
  }

  const displayedJobs = jobs.slice(currentIndex, currentIndex + itemsToShow);
  const maxIndex = Math.max(0, jobs.length - itemsToShow);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 헤더 */}
        <div className="mb-10 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-1.5 text-[#E66235] font-bold text-sm">
              <i className="ri-fire-line"></i>
              <span>Popular Jobs</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              인기 공고
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              많은 지원자들이 관심을 가진 채용 공고를 보세요
            </p>
          </div>
        </div>

        {/* 공고 카드 - 캐러셀 컨테이너 */}
        <div className="relative flex items-center gap-4 px-16">
          {/* 좌측 화살표 */}
          <button
            onClick={handlePrevClick}
            disabled={!canPrev}
            className="absolute -left-12 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center border-2 border-gray-300 text-gray-600 hover:border-[#E66235] hover:text-[#E66235] hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="이전"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>

          {/* 공고 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 flex-1">
          {displayedJobs.map((job) => (
            <div
              key={job.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/jobs/${job.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/jobs/${job.id}`);
                  e.preventDefault();
                }
              }}
              className="relative p-5 border-2 border-gray-900 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group cursor-pointer"
            >
              {/* 별 아이콘 */}
              <button
                className="absolute top-5 right-5 transition-colors"
                onClick={(e) => toggleBookmark(e, job.id)}
              >
                <i
                  className={`text-2xl ${
                    bookmarkedJobIds.has(job.id)
                      ? 'ri-star-fill text-[#E66235]'
                      : 'ri-star-line text-gray-300 hover:text-[#E66235]'
                  }`}
                ></i>
              </button>

              {/* 회사 로고 및 제목 */}
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

              {/* 태그 */}
              <div className="flex-grow flex flex-wrap content-start gap-1.5 mb-5">
                {job.badges?.map((b, i) => (
                  <span
                    key={`badge-${i}`}
                    className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md"
                  >
                    {b}
                  </span>
                ))}
                {job.tags?.map((t, i) => (
                  <span
                    key={`tag-${i}`}
                    className="px-2 py-1 text-xs font-medium rounded-md bg-orange-50 text-orange-600"
                  >
                    {t}
                  </span>
                ))}
                {job.workEnv?.map((env, i) => (
                  <span
                    key={`env-${i}`}
                    className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md"
                  >
                    {formatEnv(env)}
                  </span>
                ))}
              </div>

              {/* 하단 정보 */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between w-full mt-auto">
                <div className="text-sm text-gray-500 truncate pr-2">
                  {formatLocation(job.location)}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`text-sm font-semibold ${
                    formatTermDate(job.date) === '상시'
                      ? 'text-blue-500'
                      : 'text-orange-500'
                  }`}>
                    {formatTermDate(job.date)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* 우측 화살표 */}
          <button
            onClick={handleNextClick}
            disabled={!canNext}
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center border-2 border-gray-300 text-gray-600 hover:border-[#E66235] hover:text-[#E66235] hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="다음"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>

        {/* 인디케이터 */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: Math.ceil(jobs.length / itemsToShow) }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === Math.floor(currentIndex / itemsToShow) || (currentIndex + itemsToShow >= jobs.length && i === Math.ceil(jobs.length / itemsToShow) - 1)
                  ? 'w-6 bg-[#E66235]'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


