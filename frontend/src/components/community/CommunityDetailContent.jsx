import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DeleteModal from "../DeleteModal";
import ReportModal from "../ReportModal";
import api from "../../api/axios";

const COMMENT_MAX_LEN = 500;

const API_ORIGIN =
  typeof api.defaults.baseURL === "string" && api.defaults.baseURL
    ? api.defaults.baseURL.replace(/\/$/, "")
    : "http://localhost:8080";

function toAbsoluteUploadUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatCreatedAt(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommunityDetailContent() {
  const { post_id } = useParams();
  const navigate = useNavigate();
  const hasCommunityActionToken =
    !!localStorage.getItem("accessToken") || !!localStorage.getItem("authToken");

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const postMenuRef = useRef(null);

  const [commentMenuOpen, setCommentMenuOpen] = useState(null);
  const commentMenuRef = useRef(null);

  const [modalType, setModalType] = useState(null);
  const [targetId, setTargetId] = useState(null);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentEditSubmitting, setCommentEditSubmitting] = useState(false);

  const deletePostLock = useRef(false);
  const postLikeLock = useRef(false);
  const commentLikeLock = useRef(false);
  const commentSubmitLock = useRef(false);
  const commentEditLock = useRef(false);
  const deleteCommentLock = useRef(false);

  const handleDeletePostConfirm = useCallback(async () => {
    if (deletePostLock.current) return;
    const id = targetId ?? detail?.postId ?? post_id;
    if (id == null || id === "") {
      alert("삭제할 게시글을 찾을 수 없습니다.");
      return;
    }
    deletePostLock.current = true;
    try {
      await api.delete(`/posts/${id}`);
      setModalType(null);
      navigate("/community");
    } catch (e) {
      alert(
        e.response?.data?.message ||
          e.message ||
          "게시글 삭제에 실패했습니다."
      );
      setModalType(null);
    } finally {
      deletePostLock.current = false;
    }
  }, [targetId, detail?.postId, post_id, navigate]);

  const handleCommentLikeClick = useCallback(
    async (comment) => {
      if (commentLikeLock.current) return;
      const cid = comment?.commentId;
      if (cid == null || cid === "") return;
      const pid = detail?.postId ?? post_id;
      if (pid == null || pid === "") return;
      commentLikeLock.current = true;
      const wasActive = !!comment.likeActive;
      try {
        const { data } = await api.post(
          `/posts/${pid}/comments/${cid}/likes`
        );
        const isActive = !!data?.isActive;
        setDetail((d) => {
          if (!d?.comments) return d;
          return {
            ...d,
            comments: d.comments.map((c) => {
              if (Number(c.commentId) !== Number(cid)) return c;
              const delta =
                isActive && !wasActive
                  ? 1
                  : !isActive && wasActive
                    ? -1
                    : 0;
              return {
                ...c,
                likeActive: isActive,
                likeCount: Math.max(0, (c.likeCount ?? 0) + delta),
              };
            }),
          };
        });
      } catch (e) {
        alert(
          e.response?.data?.message ||
            e.message ||
            "댓글 좋아요 처리에 실패했습니다."
        );
      } finally {
        commentLikeLock.current = false;
      }
    },
    [detail?.postId, post_id]
  );

  const handleSubmitComment = useCallback(async () => {
    const content = newCommentText.trim();
    if (!content) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    if (content.length > COMMENT_MAX_LEN) {
      alert(`댓글은 ${COMMENT_MAX_LEN}자 이내로 입력해주세요.`);
      return;
    }
    const pid = detail?.postId ?? post_id;
    if (pid == null || pid === "" || commentSubmitLock.current) return;
    commentSubmitLock.current = true;
    setCommentSubmitting(true);
    try {
      await api.post(`/posts/${pid}/comments`, { content });
      const { data } = await api.get(`/posts/${post_id}`);
      setDetail(data);
      setNewCommentText("");
    } catch (e) {
      alert(
        e.response?.data?.message ||
          e.message ||
          "댓글 등록에 실패했습니다."
      );
    } finally {
      commentSubmitLock.current = false;
      setCommentSubmitting(false);
    }
  }, [newCommentText, detail?.postId, post_id]);

  const handleSaveCommentEdit = useCallback(async () => {
    const content = editText.trim();
    if (!content) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    if (content.length > COMMENT_MAX_LEN) {
      alert(`댓글은 ${COMMENT_MAX_LEN}자 이내로 입력해주세요.`);
      return;
    }
    const cid = editingCommentId;
    if (cid == null || commentEditLock.current) return;
    const pid = detail?.postId ?? post_id;
    if (pid == null || pid === "") return;
    commentEditLock.current = true;
    setCommentEditSubmitting(true);
    try {
      await api.patch(`/posts/${pid}/comments/${cid}`, { content });
      const { data } = await api.get(`/posts/${post_id}`);
      setDetail(data);
      setEditingCommentId(null);
      setEditText("");
    } catch (e) {
      alert(
        e.response?.data?.message ||
          e.message ||
          "댓글 수정에 실패했습니다."
      );
    } finally {
      commentEditLock.current = false;
      setCommentEditSubmitting(false);
    }
  }, [editText, editingCommentId, detail?.postId, post_id]);

  const handleDeleteCommentConfirm = useCallback(async () => {
    if (deleteCommentLock.current) return;
    const cid = targetId;
    if (cid == null || cid === "") {
      alert("삭제할 댓글을 찾을 수 없습니다.");
      return;
    }
    const pid = detail?.postId ?? post_id;
    if (pid == null || pid === "") {
      alert("게시글 정보를 찾을 수 없습니다.");
      return;
    }
    deleteCommentLock.current = true;
    try {
      await api.delete(`/posts/${pid}/comments/${cid}`);
      const { data } = await api.get(`/posts/${post_id}`);
      setDetail(data);
      setEditingCommentId((eid) =>
        eid != null && Number(eid) === Number(cid) ? null : eid
      );
      setCommentMenuOpen(null);
      setModalType(null);
    } catch (e) {
      alert(
        e.response?.data?.message ||
          e.message ||
          "댓글 삭제에 실패했습니다."
      );
      setModalType(null);
    } finally {
      deleteCommentLock.current = false;
    }
  }, [targetId, detail?.postId, post_id]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      setDetail(null);
      try {
        const { data } = await api.get(`/posts/${post_id}`, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) setDetail(data);
      } catch (e) {
        if (controller.signal.aborted || e.code === "ERR_CANCELED") return;
        setError(
          e.response?.data?.message ||
            e.message ||
            "게시글을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    if (post_id != null && post_id !== "") load();
    else {
      setLoading(false);
      setError("잘못된 게시글입니다.");
    }

    return () => controller.abort();
  }, [post_id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (postMenuRef.current && !postMenuRef.current.contains(e.target)) {
        setPostMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".comment-menu")) setCommentMenuOpen(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 bg-[#FDFBF7] text-center text-gray-500">
        불러오는 중…
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 bg-[#FDFBF7] text-center text-gray-600">
        {error || "게시글 없음"}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate("/community")}
            className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  const comments = Array.isArray(detail.comments) ? detail.comments : [];
  const imageSrc = toAbsoluteUploadUrl(detail.imageUrl);
  const fileHref = toAbsoluteUploadUrl(detail.fileUrl);
  const fileName =
    detail.fileUrl && typeof detail.fileUrl === "string"
      ? detail.fileUrl.split("/").pop() || "첨부파일"
      : "첨부파일";

  const editPostPayload = {
    postId: detail.postId,
    category: detail.category,
    title: detail.title,
    content: detail.content,
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-10 bg-[#FDFBF7]">
        <div className="flex items-center gap-2 text-sm mb-6 text-gray-400">
          <button
            type="button"
            onClick={() => navigate("/community")}
            className="hover:text-gray-600 transition-colors"
          >
            커뮤니티
          </button>
          <i className="ri-arrow-right-s-line"></i>
          <button
            type="button"
            onClick={() =>
              navigate("/community", {
                state: { category: detail.category },
              })
            }
            className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
          >
            {detail.category}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h1 className="text-2xl font-bold text-[#2A1D16] mb-4">
            {detail.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-50">
            <span className="flex items-center gap-1">
              <i className="ri-user-line"></i> {detail.writer}
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-calendar-line"></i>{" "}
              {formatCreatedAt(detail.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-eye-line"></i> {detail.viewCount ?? 0}
            </span>
            <span className="flex items-center gap-1 text-[#E66235]">
              <i className="ri-heart-fill"></i> {detail.likeCount ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-chat-3-line"></i> {detail.commentCount ?? comments.length}
            </span>
          </div>

          <div className="text-[#4A3F35] leading-relaxed whitespace-pre-wrap mb-8 min-h-[120px]">
            {detail.content}
          </div>

          {imageSrc && (
            <div className="mb-8 rounded-lg overflow-hidden border border-gray-100">
              <img
                src={imageSrc}
                alt=""
                className="max-w-full h-auto max-h-[480px] object-contain bg-[#FFFDF9]"
              />
            </div>
          )}

          {fileHref && (
            <div className="bg-[#FFFDF9] border border-orange-100 rounded-lg p-4 flex items-center gap-3 text-sm text-gray-600 mb-10">
              <i className="ri-attachment-line text-orange-400 text-lg"></i>
              <a
                href={fileHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E66235] font-medium hover:underline"
              >
                {fileName}
              </a>
            </div>
          )}

          <div className="flex justify-between items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/community")}
              className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              <i className="ri-list-check"></i>
              목록
            </button>

            {hasCommunityActionToken && (
              <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  if (!detail?.postId || postLikeLock.current) return;
                  postLikeLock.current = true;
                  const wasActive = !!detail.likeActive;
                  try {
                    const { data } = await api.post(
                      `/posts/${detail.postId}/likes`
                    );
                    const isActive = !!data?.isActive;
                    setDetail((d) => {
                      if (!d) return d;
                      const delta =
                        isActive && !wasActive
                          ? 1
                          : !isActive && wasActive
                            ? -1
                            : 0;
                      return {
                        ...d,
                        likeActive: isActive,
                        likeCount: Math.max(
                          0,
                          (d.likeCount ?? 0) + delta
                        ),
                      };
                    });
                  } catch (e) {
                    alert(
                      e.response?.data?.message ||
                        e.message ||
                        "좋아요 처리에 실패했습니다."
                    );
                  } finally {
                    postLikeLock.current = false;
                  }
                }}
                className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                {detail.likeActive ? (
                  <i className="ri-heart-fill text-[#E66235]"></i>
                ) : (
                  <i className="ri-heart-line text-[#E66235]"></i>
                )}
                좋아요 {detail.likeCount ?? 0}
              </button>

              <div className="relative" ref={postMenuRef}>
                <button
                  type="button"
                  onClick={() => setPostMenuOpen(!postMenuOpen)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  ⋮
                </button>

                {postMenuOpen && (
                  <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-sm w-28 z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setPostMenuOpen(false);
                        const loginId = localStorage.getItem("loginId");
                        if (!loginId || loginId !== detail.writer) {
                          alert("수정 권한이 없습니다.");
                          return;
                        }
                        navigate("/communityWrite", {
                          state: { post: editPostPayload },
                        });
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPostMenuOpen(false);
                        setModalType("deletePost");
                        setTargetId(detail.postId);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      삭제
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPostMenuOpen(false);
                        setModalType("reportPost");
                        setTargetId(detail.postId);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      신고
                    </button>
                  </div>
                )}
              </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 font-bold text-[#2A1D16]">
            <i className="ri-chat-3-line text-[#E66235]"></i>
            댓글{" "}
            <span className="text-[#E66235]">
              {detail.commentCount ?? comments.length}
            </span>
          </div>

          <div className="space-y-6 mb-8">
            {comments.map((comment) => (
              <div
                key={comment.commentId}
                className="pb-6 border-b border-gray-50 last:border-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-xs font-bold">
                      {comment.writer?.[0] ?? "?"}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#2A1D16] mr-2">
                        {comment.writer}
                      </span>
                      <span className="text-xs text-gray-300">
                        {formatCreatedAt(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  {hasCommunityActionToken && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCommentLikeClick(comment)}
                        className="text-sm flex items-center gap-1 text-gray-400 hover:text-[#E66235] transition"
                      >
                        <i
                          className={
                            comment.likeActive
                              ? "ri-heart-fill text-[#E66235]"
                              : "ri-heart-line"
                          }
                        />
                        {comment.likeCount ?? 0}
                      </button>

                      <div className="relative comment-menu" ref={commentMenuRef}>
                        <button
                          type="button"
                          onClick={() =>
                            setCommentMenuOpen(
                              comment.commentId === commentMenuOpen
                                ? null
                                : comment.commentId
                            )
                          }
                          className="flex items-center justify-center px-2 py-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition text-sm"
                        >
                          ⋮
                        </button>

                        {commentMenuOpen === comment.commentId && (
                          <div className="absolute right-0 top-full mt-1 bg-white rounded shadow-sm w-28 z-10 border border-gray-200">
                            <button
                              type="button"
                              onClick={() => {
                                setCommentMenuOpen(null);
                                setEditingCommentId(comment.commentId);
                                setEditText(comment.content);
                              }}
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCommentMenuOpen(null);
                                setModalType("deleteComment");
                                setTargetId(comment.commentId);
                              }}
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            >
                              삭제
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCommentMenuOpen(null);
                                setModalType("reportComment");
                                setTargetId(comment.commentId);
                              }}
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            >
                              신고
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {editingCommentId === comment.commentId ? (
                  <div className="ml-10">
                    <textarea
                      value={editText}
                      onChange={(e) =>
                        setEditText(
                          e.target.value.slice(0, COMMENT_MAX_LEN)
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          handleSaveCommentEdit();
                        }
                      }}
                      maxLength={COMMENT_MAX_LEN}
                      disabled={commentEditSubmitting}
                      className="w-full border rounded p-2 text-sm disabled:opacity-60"
                    />
                    <div className="mt-1 text-xs text-gray-400">
                      {editText.length}/{COMMENT_MAX_LEN}
                    </div>
                    <button
                      type="button"
                      disabled={
                        commentEditSubmitting || !editText.trim()
                      }
                      onClick={handleSaveCommentEdit}
                      className="mt-2 px-3 py-1 bg-black text-white rounded text-xs disabled:opacity-50"
                    >
                      {commentEditSubmitting ? "저장 중…" : "수정 완료"}
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

          {hasCommunityActionToken && (
            <div className="bg-[#FFFDF9] border border-gray-100 rounded-xl p-4">
              <textarea
                value={newCommentText}
                onChange={(e) =>
                  setNewCommentText(
                    e.target.value.slice(0, COMMENT_MAX_LEN)
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
                maxLength={COMMENT_MAX_LEN}
                disabled={commentSubmitting}
                placeholder="댓글을 입력해주세요."
                className="w-full bg-transparent border-none focus:ring-0 text-sm h-24 resize-none mb-2 disabled:opacity-60"
              ></textarea>
              <div className="flex justify-between items-center text-xs text-gray-300">
                <span>
                  {newCommentText.length}/{COMMENT_MAX_LEN}
                </span>
                <button
                  type="button"
                  disabled={commentSubmitting || !newCommentText.trim()}
                  onClick={handleSubmitComment}
                  className="px-5 py-2 bg-[#2A1D16] text-white rounded-lg font-bold hover:bg-black transition disabled:opacity-50 disabled:pointer-events-none"
                >
                  {commentSubmitting ? "등록 중…" : "댓글 등록"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalType === "deletePost" && (
        <DeleteModal
          onClose={() => setModalType(null)}
          onConfirm={handleDeletePostConfirm}
        />
      )}

      {modalType === "deleteComment" && (
        <DeleteModal
          onClose={() => setModalType(null)}
          onConfirm={handleDeleteCommentConfirm}
        />
      )}

      {modalType === "reportPost" && (
        <ReportModal
          targetType="POST"
          targetId={detail.postId}
          onClose={() => setModalType(null)}
          onSubmit={(data) => {
            console.log("게시글 신고", data);
            setModalType(null);
          }}
        />
      )}

      {modalType === "reportComment" && (
        <ReportModal
          targetType="COMMENT"
          targetId={targetId}
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
