import React, { useState } from "react";
import api from "../api/axios";

export default function ReportModal({ onClose, onSubmit, targetType, targetId }) {

  const [reason, setReason] = useState(""); // 선택 사유
  const [detail, setDetail] = useState(""); // 추가 입력
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonOptions = [
    "욕설/비방",
    "부적절한 콘텐츠",
    "허위 정보",
    "기타"
  ];

  const handleSubmit = async () => {
    if (!reason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    const finalReason = detail ? `${reason} - ${detail}` : reason;
    let endpoint = "";
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    if (!token) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    if (targetType === "POST") {
      endpoint = `/posts/${targetId}/report`;
    } else if (targetType === "COMMENT") {
      endpoint = `/posts/comments/${targetId}/report`;
    } else {
      alert("지원하지 않는 신고 대상입니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(endpoint, { reason: finalReason }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const reportId = response?.data?.reportId;
      const successMessage = response?.data?.message;

      if (onSubmit) {
        onSubmit({
          target_type: targetType,
          target_id: targetId,
          reason: finalReason,
          reportId
        });
      }

      alert(
        successMessage ||
          (reportId
            ? `신고가 정상적으로 접수되었습니다. (신고 번호: ${reportId})`
            : "신고가 정상적으로 접수되었습니다.")
      );
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("신고 요청 실패:", error);
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data ||
        "신고 접수에 실패했습니다. 잠시 후 다시 시도해주세요.";
      alert(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">

        <h2 className="text-lg font-bold mb-4">신고하기</h2>

        {/* 사유 선택 */}
        <div className="mb-4">
          <p className="text-sm mb-2">신고 사유 선택</p>
          <div className="space-y-2">
            {reasonOptions.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="reason"
                  value={item}
                  checked={reason === item}
                  onChange={(e) => {
                    const selectedReason = e.target.value;
                    setReason(selectedReason);
                    if (selectedReason !== "기타") {
                      setDetail("");
                    }
                  }}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* 상세 입력 */}
        <textarea
          placeholder={reason === "기타" ? "상세 내용을 입력해주세요 (선택)" : "기타 선택 시 입력할 수 있습니다."}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          disabled={reason !== "기타"}
          className={`w-full border p-2 mb-3 text-sm ${
            reason !== "기타" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
          }`}
        />

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500" disabled={isSubmitting}>
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="text-red-500 font-bold disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "신고 중..." : "신고"}
          </button>
        </div>
      </div>
    </div>
  );
}