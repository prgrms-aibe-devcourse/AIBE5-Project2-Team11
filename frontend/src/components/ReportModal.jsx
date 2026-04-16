import React, { useState } from "react";

export default function ReportModal({ onClose, onSubmit, targetType, targetId }) {

  const [reason, setReason] = useState(""); // 선택 사유
  const [detail, setDetail] = useState(""); // 추가 입력

  const reasonOptions = [
    "스팸",
    "욕설/비방",
    "부적절한 콘텐츠",
    "허위 정보",
    "기타"
  ];

  const handleSubmit = () => {
    if (!reason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    // DB에 맞는 구조로 데이터 생성
    const reportData = {
      target_type: targetType, // POST // COMMENT // MEMBER // JOB_POSTING
      target_id: targetId,     // 대상 id
      reason: detail ? `${reason} - ${detail}` : reason
    };

    onSubmit(reportData);

    alert("신고가 정상적으로 접수되었습니다.");
    onClose(); // 모달 닫기
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
                  onChange={(e) => setReason(e.target.value)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* 상세 입력 */}
        <textarea
          placeholder="상세 내용을 입력해주세요 (선택)"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="w-full border p-2 mb-3 text-sm"
        />

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500">
            취소
          </button>
          <button onClick={handleSubmit} className="text-red-500 font-bold">
            신고
          </button>
        </div>
      </div>
    </div>
  );
}