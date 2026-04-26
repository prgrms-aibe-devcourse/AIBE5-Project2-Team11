import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function formatCreatedAt(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

function isJobInfoCategory(category) {
  return category === "취업정보게시판";
}

function normalizeTabCategory(category) {
  if (!category) return "전체";
  return category;
}

export default function CommunityList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("전체");
  const tabs = ["전체", "자유게시판", "취업정보게시판", "질문게시판"];

  const [sortType, setSortType] = useState("latest");
  const [searchInput, setSearchInput] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestedCategory = normalizeTabCategory(location.state?.category);
    if (requestedCategory !== "전체" && tabs.includes(requestedCategory)) {
      setActiveTab(requestedCategory);
      setCurrentPage(1);
    }
  }, [location.state?.category]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage - 1,
        sort: sortType,
      };
      const kw = appliedKeyword.trim();
      if (kw) params.keyword = kw;
      if (activeTab !== "전체") params.category = activeTab;

      try {
        const { data } = await api.get("/posts", {
          params,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        setPosts(Array.isArray(data.content) ? data.content : []);
        setTotalPages(typeof data.totalPages === "number" ? data.totalPages : 0);
        setTotalElements(
          typeof data.totalElements === "number" ? data.totalElements : 0
        );
        setPageSize(typeof data.size === "number" ? data.size : 10);
      } catch (e) {
        if (
          controller.signal.aborted ||
          e.code === "ERR_CANCELED" ||
          e.name === "CanceledError"
        )
          return;
        setError(
          e.response?.data?.message ||
            e.message ||
            "게시글 목록을 불러오지 못했습니다."
        );
        setPosts([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [activeTab, appliedKeyword, currentPage, sortType]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const runSearch = () => {
    setAppliedKeyword(searchInput);
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") runSearch();
  };

   const pageButtons =
     totalPages > 0
       ? Array.from({ length: totalPages }, (_, i) => i + 1)
       : [];

   const renderPagination = () => {
     if (totalPages <= 1) return null;
     let startPage = Math.max(1, currentPage - 2);
     let endPage = Math.min(totalPages, currentPage + 2);

     if (endPage - startPage < 4) {
       if (startPage === 1) {
         endPage = Math.min(totalPages, 5);
       } else if (endPage === totalPages) {
         startPage = Math.max(1, totalPages - 4);
       }
     }

     return (
       <div className="mt-12 flex items-center justify-center gap-2">
         <button
           onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
           disabled={currentPage === 1}
           className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
         >
           <i className="ri-arrow-left-s-line"></i>
         </button>
         {startPage > 1 && (
           <>
             <button onClick={() => setCurrentPage(1)} className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all">1</button>
             {startPage > 2 && <span className="text-gray-400">...</span>}
           </>
         )}

         {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
           const p = startPage + i;
           return (
             <button
               key={p}
               onClick={() => setCurrentPage(p)}
               className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                 currentPage === p 
                   ? 'bg-[#E66235] text-white shadow-md' 
                   : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
               }`}
             >
               {p}
             </button>
           );
         })}

         {endPage < totalPages && (
           <>
             {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
             <button onClick={() => setCurrentPage(totalPages)} className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all">{totalPages}</button>
           </>
         )}
         <button
           onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
           disabled={currentPage === totalPages}
           className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
         >
           <i className="ri-arrow-right-s-line"></i>
         </button>
       </div>
     );
   };

   return (
     <div className="max-w-7xl mx-auto px-10 py-8 bg-[#FDFBF7]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${
                  activeTab === tab
                    ? "bg-[#2A1D16] text-white shadow"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-[#2A1D16] hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="게시글 검색"
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={runSearch}
            className="px-6 py-2 bg-[#2A1D16] text-white text-sm rounded-md font-bold"
          >
            검색
          </button>
        </div>
      </div>

       <div className="flex justify-between items-center mb-4">
         <span className="text-sm text-gray-600 font-medium">
           총 <span className="text-[#E66235]">{totalElements}</span>개의 게시글 (전체 페이지: {totalPages})
         </span>

        <div className="flex border border-gray-200 rounded-md overflow-hidden">
          {["latest", "popular"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setSortType(type);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-xs font-bold ${
                sortType === type
                  ? "bg-[#2A1D16] text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              {type === "latest" ? "최신순" : "인기순"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <div className="w-full bg-white rounded-xl shadow-sm border border-[#F3E8D0] overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#FFFDF9] text-gray-500 border-b border-[#F3E8D0]">
              <th className="px-6 py-4 text-center w-16 whitespace-nowrap">번호</th>
              <th className="px-6 py-4 w-24 whitespace-nowrap">카테고리</th>
              <th className="px-6 py-4 whitespace-nowrap">제목</th>
              <th className="px-6 py-4 w-24 whitespace-nowrap">작성자</th>
              <th className="px-6 py-4 w-24 whitespace-nowrap">작성일</th>
              <th className="px-6 py-4 w-20 whitespace-nowrap">조회수</th>
              <th className="px-6 py-4 w-20 text-center whitespace-nowrap">좋아요</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3E8D0]">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  불러오는 중…
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr
                  key={post.postId}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/communityDetail/${post.postId}`)}
                >
                  <td className="px-6 py-4 text-center text-yellow-600 font-medium">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        isJobInfoCategory(post.category)
                          ? "bg-[#FFF3E0] text-[#E66235]"
                          : post.category === "질문게시판"
                            ? "bg-[#F3E5F5] text-[#9C27B0]"
                            : "bg-[#E8F5E9] text-[#4CAF50]"
                      }`}
                    >
                      {post.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold text-[#2A1D16]">
                    {post.title}
                    <span className="ml-2 text-[#E66235] text-xs whitespace-nowrap">
                      [{post.commentCount ?? 0}]
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {post.writer ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    {formatCreatedAt(post.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    {post.viewCount ?? 0}
                  </td>

                  <td className="px-6 py-4 text-center text-[#E66235] whitespace-nowrap">
                    {post.likeCount ?? 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

       {!loading && totalPages > 0 && renderPagination()}
    </div>
  );
}
