import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CommunityWriteForm() {

  // 페이지 이동 & 이전 페이지 데이터 받기 
  const navigate = useNavigate(); // 다른 페이지로 이동할 때 사용
  const location = useLocation(); // 이전 페이지에서 넘어온 데이터 받기 
  const editPost = location.state?.post; // 수정일 경우 수정할 기존 데이터 
  const isEdit = !!editPost; // 수정 모드 여부 

  // 게시글 유형 데이터
  const categories = ["자유게시판", "취업정보", "질문게시판"];

  // 입력값(폼) 상태 관리  
  const [category, setCategory] = useState(editPost?.category || "자유게시판");
  const [title, setTitle] = useState(editPost?.title || "");
  const [content, setContent] = useState(editPost?.content || "");

  // 선택된 파일 저장
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  
  // 등록 버튼 처리
  const isValid = title.trim() && content.trim(); // 제목 + 내용 둘 다 입력됐는지 확인
  const handleSubmit = () => {
    if (!isValid) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    console.log({ category, title, content });

    const message = isEdit ? "게시글이 수정되었습니다." : "게시글이 등록되었습니다.";
    alert(message);

    navigate("/community");  // 등록 후 목록으로 이동
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-[#FDFBF7] min-h-screen">
      {/* 브레드크럼 */}
      <div className="text-sm text-gray-400 mb-6">
        커뮤니티 &gt; <span className="text-gray-600 font-medium">글쓰기</span>
      </div>

      {/* 메인 카드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#F3E8D0] overflow-hidden">
        {/* 헤더 */}
        <div className="p-8 border-b border-[#F3E8D0]">
          <h1 className="text-2xl font-bold text-[#2A1D16] mb-1">{isEdit ? "게시글 수정" : "새 게시글 작성"}</h1>
          <p className="text-sm text-gray-400">커뮤니티 이용 규칙을 준수하여 작성해주세요.</p>
        </div>

        {/* 폼 섹션 */}
        <div className="p-8 space-y-8">
          
          {/* 카테고리 선택 */}
          <div>
            <label className="block text-sm font-bold text-[#2A1D16] mb-3">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-6 py-2 rounded-full text-sm font-medium border transition-all
                    ${category === item 
                      ? "bg-[#2A1D16] text-white border-[#2A1D16]" 
                      : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 입력 */}
          <div>
            <label className="block text-sm font-bold text-[#2A1D16] mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2A1D16] text-sm"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{title.length}/100</div>
          </div>

          {/* 내용 입력 */}
          <div>
            <label className="block text-sm font-bold text-[#2A1D16] mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 500))}
              placeholder="내용을 입력하세요 (최대 500자)"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2A1D16] text-sm resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{content.length}/500</div>
          </div>

          {/* 첨부파일 섹션 */}
          <div className="space-y-4">

            {/* ===== 이미지 첨부 ===== */}
            <div>
              <p className="text-sm font-bold text-[#2A1D16] mb-2">이미지 첨부</p>

              {/* 숨겨진 input */}
              <input
                type="file"
                accept="image/*"
                multiple
                id="imageInput"
                style={{ display: "none" }}
                onChange={(e) => setImages([...e.target.files])}
              />

              {/* 버튼 */}
              <button
                onClick={() => document.getElementById("imageInput").click()}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs text-orange-500 bg-orange-50/30 hover:bg-orange-50 transition-colors"
              >
                <span>🖼️</span> 이미지 추가
              </button>

              {/* 이미지 미리보기 */}
              {images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {images.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ===== 파일 첨부 ===== */}
            <div>
              <p className="text-sm font-bold text-[#2A1D16] mb-2">파일 첨부</p>

              {/* 숨겨진 input */}
              <input
                type="file"
                multiple
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => setFiles([...e.target.files])}
              />

              {/* 버튼 */}
              <button
                onClick={() => document.getElementById("fileInput").click()}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <span>📎</span> 파일 추가
              </button>

              {/* 파일 목록 */}
              {files.length > 0 && (
                <ul className="mt-3 text-xs text-gray-600 space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      📎 {file.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

        </div>

        {/* 하단 버튼 */}
        <div className="p-8 bg-[#FDFBF7] border-t border-[#F3E8D0] flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit} disabled={!isValid} // 조건 안되면 클릭 막기
            className={`px-8 py-2.5 rounded-lg text-white text-sm font-medium transition-colors
              ${isValid ? "bg-[#2A1D16] hover:bg-[#5A3E2B]" : "bg-gray-300 cursor-not-allowed"} `}
          >
            {isEdit ? "수정하기" : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
}