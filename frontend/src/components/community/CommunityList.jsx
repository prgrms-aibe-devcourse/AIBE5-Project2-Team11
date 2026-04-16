import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { posts } from "../../mockData/posts"; // 테스트 게시글 데이터
import { member } from "../../mockData/member" // 테스트  회원 데이터 
import { post_like } from "../../mockData/post_like"; // 테스트 좋아요 데이터 
import { post_comment } from "../../mockData/post_comment"; // 테스트 댓글 데이터 
 

export default function CommunityList() {
  // 1. 탭 상태 관리 (기존 navigate 제거)
  const [activeTab, setActiveTab] = useState("전체");
  const tabs = ["전체", "자유게시판", "취업정보", "질문게시판"];

  // 2. 필터링 로직 추가
  const filteredPosts = posts.filter((post) => 
    activeTab === "전체" ? true : post.category === activeTab
  );

  // 3. 정렬 로직 (필터링된 데이터 기준)
  const getPostLikes = (postId) => { // 좋아요 개수 계산 
  return post_like.filter(
      (like) => like.post_id === postId && like.comment_id === null // 게시글 좋아요만 카운트
    ).length;
  };
  const [sortType, setSortType] = useState("latest");
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return sortType === "latest"
      ? new Date(b.created_at) - new Date(a.created_at)
      : getPostLikes(b.post_id) - getPostLikes(a.post_id);
  });

  
  // 4. 페이지네이션 관련 (sortedPosts 기준)
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // 한 페이지에 보일 게시글 개수
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage, 
    currentPage * postsPerPage
  );

  // 5. 페이지 이동
  const navigate = useNavigate();

  // 탭 변경 시 페이지 1로 초기화
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // 댓글 개수 
  const getCommentCount = (postId) => { // posts 기준으로 post_id 매칭해서 count
    return post_comment.filter(
      (comment) => comment.post_id === postId && comment.is_deleted === false
    ).length;
  };

  

  return (
    <div className="max-w-7xl mx-auto px-10 py-8 bg-[#FDFBF7]">
      
      {/* ================= 상단: 탭 + 검색 ================= */}
      <div className="flex items-center justify-between mb-8">
        {/* 게시글 카테고리 탭 */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${activeTab === tab
                  ? "bg-[#2A1D16] text-white shadow"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-[#2A1D16] hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* 검색바 */}
        <div className="flex gap-2">
          <div className="relative">
            <input type="text"placeholder="게시글 검색"
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none"
            />
          </div>
          <button className="px-6 py-2 bg-[#2A1D16] text-white text-sm rounded-md font-bold">검색</button>
        </div>
      </div>

      {/* ================= 정렬 / 개수 ================= */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600 font-medium">
          총 <span className="text-[#E66235]">{filteredPosts.length}</span>개의 게시글
        </span>

        <div className="flex border border-gray-200 rounded-md overflow-hidden">
          {["latest", "popular"].map((type) => (
            <button
              key={type}
              onClick={() => { setSortType(type); setCurrentPage(1); }}
              className={`px-4 py-1.5 text-xs font-bold ${
                sortType === type ? "bg-[#2A1D16] text-white" : "bg-white text-gray-500"
              }`}
            >
              {type === "latest" ? "최신순" : "인기순"}
            </button>
          ))}
        </div>
      </div>

      {/* ================= 게시글 테이블 ================= */}
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
            {/* 리스트 각 항목 출력*/}
            {currentPosts.map((post, index) => (
              <tr
                key={post.post_id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/communityDetail/${post.post_id}`)}
              >
                <td className="px-6 py-4 text-center text-yellow-600 font-medium">
                  {(currentPage - 1) * postsPerPage + index + 1}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      post.category === "취업정보" ? "bg-[#FFF3E0] text-[#E66235]": 
                        post.category === "질문게시판" ? "bg-[#F3E5F5] text-[#9C27B0]" : "bg-[#E8F5E9] text-[#4CAF50]"
                    }`}
                  >
                    {post.category}
                  </span>
                </td>

                <td className="px-6 py-4 font-semibold text-[#2A1D16]">
                  {post.title}
                  <span className="ml-2 text-[#E66235] text-xs whitespace-nowrap">
                    [{getCommentCount(post.post_id)}]
                  </span>
                </td>

                

                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {member.find(m => m.member_id === post.member_id)?.name}
                </td>

                <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                  {post.created_at}
                </td>

                <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                  {post.views}
                </td>

                <td className="px-6 py-4 text-center text-[#E66235] whitespace-nowrap">
                  {getPostLikes(post.post_id)}
                </td>
              </tr>
            ))}
        </tbody>
        </table>
      </div>


      {/* ================= 페이지네이션 ================= */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`w-8 h-8 rounded-full text-sm font-bold transition-colors ${
              currentPage === num
                ? "bg-[#2A1D16] text-white"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}