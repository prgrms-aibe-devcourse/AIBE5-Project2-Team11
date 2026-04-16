import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DeleteModal from "../DeleteModal";
import ReportModal from "../ReportModal";
import { posts } from "../../mockData/posts"; // 테스트 게시글 데이터
import { post_comment } from "../../mockData/post_comment"; // 테스트 게시글별 댓글 데이터 
import { member } from "../../mockData/member"; // 테스트 회원 데이터 
import { post_like } from "../../mockData/post_like";


export default function CommunityDetailContent() {
    // Url 파라미터 가져오기 
    const { post_id } = useParams(); // route에 설정한 파라미터명으로 가져와야 함
    const post = posts.find((p) => p.post_id === Number(post_id)); // post_id에 해당하는 게시글 하나만 가져옴
    if (!post) { return <div className="p-10 text-center">게시글 없음</div>; } // 해당 id로 조회된 게시글이 없는 경우
    
    // 목록 버튼 이동용
    const navigate = useNavigate();
    
    // 게시글 데이터 관련
    const [comments, setComments] = useState(
        post_comment.filter(c => c.post_id === Number(post_id)) // 현재 게시글 소속의 댓글 정보 리스트
            .map(c => ({ ...c,
                likes: post_like.filter(l => l.comment_id === c.comment_id).length,
                liked: false, })
            )
        );
    const [likes, setLikes] = useState( post_like.filter(l => l.post_id === Number(post_id) && l.comment_id === null).length ); // 게시글 좋아요 카운트 
    const [liked, setLiked] = useState(false); // 게시글  좋아요 눌렀는지 상태
    

    // 게시글 메뉴 버튼용 
    const [postMenuOpen, setPostMenuOpen] = useState(false); // 게시글 메뉴(⋮) 열림 여부
    const postMenuRef = useRef(null); 
    useEffect(() => {
        const handleClickOutside = (e) => {  // 메뉴 옵션 활성화 시, 외부 영역 클릭 시 옵션 닫힘 
            if (postMenuRef.current && !postMenuRef.current.contains(e.target)) {
                setPostMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, []);


    // 댓글 관련 데이터 
    const getCommentLikeCount = (commentId) => post_like.filter( (l) => l.comment_id === commentId).length;
    
    // 댓글 메뉴 버튼용 
    const [commentMenuOpen, setCommentMenuOpen] = useState(null);  // 댓글 메뉴 열림(:) 해당 댓글 id 저장
    const commentMenuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".comment-menu")) { setCommentMenuOpen(null); }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    // 어떤 모달 열렸는지
    const [modalType, setModalType] = useState(null); // "deletePost" | "deleteComment" | "reportPost" | "reportComment"

    // 대상 id (댓글 or 게시글)
    const [targetId, setTargetId] = useState(null);

    // 댓글 수정용
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");

    return (
        <>
            <div className="max-w-4xl mx-auto px-6 py-10 bg-[#FDFBF7]">
        
                {/* 상단 브레드크럼 */}
                <div className="flex items-center gap-2 text-sm mb-6 text-gray-400">
                    <span>커뮤니티</span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className="text-orange-600 font-bold">{post.category}</span>
                </div>

                {/* ================= 게시글 본문 섹션 ================= */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                    <h1 className="text-2xl font-bold text-[#2A1D16] mb-4">{post.title}</h1>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-50">
                        <span className="flex items-center gap-1"><i className="ri-user-line"></i> {member.find(m => m.member_id === post.member_id)?.name}</span>
                        <span className="flex items-center gap-1"><i className="ri-calendar-line"></i> {post.created_at}</span>
                        <span className="flex items-center gap-1"><i className="ri-eye-line"></i> {post.views}</span>
                        <span className="flex items-center gap-1 text-[#E66235]"><i className="ri-heart-fill"></i> {likes}</span>
                        <span className="flex items-center gap-1"><i className="ri-chat-3-line"></i> {comments.length} </span>
                    </div>

                    <div className="text-[#4A3F35] leading-relaxed whitespace-pre-wrap mb-10 min-h-[300px]">
                        {post.content}
                    </div>

                    {/* 첨부파일 영역 */}
                    <div className="bg-[#FFFDF9] border border-orange-100 rounded-lg p-4 flex items-center gap-3 text-sm text-gray-500 mb-10">
                        <i className="ri-attachment-line text-orange-400 text-lg"></i>
                        <span>첨부파일: 수집 불가 (파일 업로드는 서버 연동 후 지원)</span>
                    </div>

                    {/* 하단 버튼 영역 */}
                    <div className="flex justify-between items-center gap-2">
                        {/* 좌측: 목록 버튼 */}
                        <button
                            onClick={() => navigate("/community")}
                            className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                        >
                            <i className="ri-list-check"></i>
                            목록
                        </button>

                        {/* 우측: 좋아요 + 게시글 메뉴 */}
                        <div className="flex items-center gap-2">
                            {/* 좋아요 버튼 */}
                            <button
                                onClick={() => {
                                    if (!liked) {
                                        setLikes(likes + 1);
                                        setLiked(true);
                                    } else {
                                        setLikes(likes - 1);
                                        setLiked(false);
                                    }
                                }}
                                className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                            >
                                {liked ? (
                                    <i className="ri-heart-fill text-[#E66235]"></i>
                                ) : (
                                    <i className="ri-heart-line text-[#E66235]"></i>
                                )}
                                좋아요 {likes}
                            </button>

                            {/* 게시글 메뉴 버튼 */}
                            <div className="relative" ref={postMenuRef}>
                                <button
                                    onClick={() => setPostMenuOpen(!postMenuOpen)}
                                    className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    ⋮
                                </button>

                                {postMenuOpen && (
                                    <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-sm w-28 z-10">
                                        <button onClick={() => navigate("/communityWrite", { state: {post} }) } className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm">
                                            수정
                                        </button>
                                        <button onClick={() => { setModalType("deletePost"); setTargetId(post.post_id); }} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm">
                                            삭제
                                        </button>
                                        <button onClick={() => { setModalType("reportPost"); setTargetId(post.post_id); }} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm">
                                            신고
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>



                {/* ================= 댓글 섹션 ================= */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 font-bold text-[#2A1D16]">
                        <i className="ri-chat-3-line text-[#E66235]"></i>
                        댓글 <span className="text-[#E66235]">{comments.length}</span>
                    </div>


                    {/* 댓글 리스트 */}
                    <div className="space-y-6 mb-8">
                        {comments.map((comment, index) => (
                        <div key={comment.comment_id} className="pb-6 border-b border-gray-50 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                            {/* 왼쪽: 프로필 + 이름 + 날짜 */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-xs font-bold">
                                    {member.find(m => m.member_id === comment.member_id)?.name?.[0]}
                                </div>
                                    <div>
                                    <span className="text-sm font-bold text-[#2A1D16] mr-2">{member.find(m => m.member_id === comment.member_id)?.name}</span>
                                    <span className="text-xs text-gray-300">{comment.created_at}</span>
                                </div>
                            </div>

                            {/* 오른쪽: 좋아요 + 메뉴 버튼 */}
                            <div className="flex items-center gap-2">
                                {/* 댓글 좋아요 */}
                                <button
                                    onClick={() => {
                                        // 화면 재렌더링 (상태 변경 반영)
                                        setComments(prev =>
                                            prev.map(c => {
                                            if (c.comment_id !== comment.comment_id) return c;

                                            return {
                                                ...c,
                                                liked: !c.liked,
                                                likes: c.liked ? c.likes - 1 : c.likes + 1,
                                            };
                                            })
                                        );
                                    }}
                                    className="text-sm flex items-center gap-1 text-gray-400 hover:text-[#E66235] transition"
                                >
                                    <i className={comment.liked ? "ri-heart-fill text-[#E66235]" : "ri-heart-line"} />{comment.likes}
                                </button>

                                

                                {/* 댓글 메뉴 버튼 ⋮ */}
                                <div className="relative comment-menu" ref={commentMenuRef} >
                                    <button
                                        onClick={() => { setCommentMenuOpen(comment.comment_id === commentMenuOpen ? null : comment.comment_id); }}
                                        className="flex items-center justify-center px-2 py-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition text-sm"
                                    >
                                        ⋮
                                    </button>

                                    {commentMenuOpen === comment.comment_id && (
                                        <div className="absolute right-0 top-full mt-1 bg-white rounded shadow-sm w-28 z-10 border border-gray-200">
                                            <button onClick={() => { setEditingCommentId(comment.comment_id); setEditText(comment.content); }} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm">
                                                수정
                                            </button>
                                            <button onClick={() => { setModalType("deleteComment"); setTargetId(comment.comment_id); }} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm">
                                                삭제
                                            </button>
                                            <button onClick={() => { setModalType("reportComment"); setTargetId(comment.comment_id); }} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm">
                                                신고
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            </div>
                            
                            {/* 댓글 출력 (+수정모드) */}
                            {editingCommentId === comment.comment_id ? (
                                <div className="ml-10">
                                    <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full border rounded p-2 text-sm"
                                    />
                                    <button
                                    onClick={() => {
                                        const newComments = comments.map(c =>
                                        c.comment_id === comment.comment_id ? { ...c, content: editText } : c
                                        );
                                        setComments(newComments);
                                        setEditingCommentId(null);
                                    }}
                                    className="mt-2 px-3 py-1 bg-black text-white rounded text-xs"
                                    >
                                    수정 완료
                                    </button>
                                </div>
                                ) : (
                                <p className="text-sm text-[#4A3F35] ml-10 leading-relaxed">
                                    {comment.content}
                                </p>
                            )}
                        </div>
                        ))}
                    </div>


                    {/* 댓글 작성창 */}
                    <div className="bg-[#FFFDF9] border border-gray-100 rounded-xl p-4">
                        <textarea placeholder="댓글을 입력해주세요." className="w-full bg-transparent border-none focus:ring-0 text-sm h-24 resize-none mb-2"
                        ></textarea>
                        <div className="flex justify-between items-center text-xs text-gray-300">
                            <span>0/500</span>
                            <button className="px-5 py-2 bg-[#2A1D16] text-white rounded-lg font-bold hover:bg-black transition">
                                댓글 등록
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            

            {/* ================= 모달 렌더링 ================= */}
            {modalType === "deletePost" && ( // 게시글 삭제 모달 
                <DeleteModal
                    onClose={() => setModalType(null)}
                    onConfirm={() => {
                        console.log("게시글 삭제", targetId);
                        setModalType(null);
                    }}
                />
            )}

            {modalType === "deleteComment" && ( // 댓글 삭제 모달
                <DeleteModal
                    onClose={() => setModalType(null)}
                    onConfirm={() => {
                        setComments(comments.filter(c => c.comment_id !== targetId));
                        setModalType(null);
                    }}
                />
            )}
            
            {modalType === "reportPost" && ( // 게시글 신고 모달
            <ReportModal
                targetType="POST" // DB ENUM 맞춤
                targetId={post.post_id} // 대상 게시글 id
                onClose={() => setModalType(null)}
                onSubmit={(data) => {
                console.log("게시글 신고", data);
                setModalType(null);
                }}
            />
            )}

            
            {modalType === "reportComment" && ( // 댓글 신고 모달
            <ReportModal
                targetType="COMMENT" // DB ENUM 맞춤
                targetId={targetId} // 선택된 댓글 id
                onClose={() => setModalType(null)}
                onSubmit={(data) => {
                console.log("댓글 신고", data);
                setModalType(null);
                }}
            />
            )}

        </>
        

        
    );

}
