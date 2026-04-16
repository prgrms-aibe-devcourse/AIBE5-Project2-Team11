export default function CompanyJobpostCloseModal({ isOpen, onClose, onConfirm, jobTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fadeIn">
        <div className="p-8 text-center">
          {/* 경고 아이콘 */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">공고를 마감하시겠습니까?</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            <span className="font-semibold text-gray-700">[{jobTitle}]</span><br />
            <span className="text-red-500 font-medium text-[11px] mt-1 block">
              마감 후에는 지원자를 더 이상 받을 수 없으며,<br />
              상태를 다시 '게시 중'으로 변경할 수 없습니다.
            </span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-[#3D2B24] text-white rounded-xl text-sm font-bold hover:bg-[#2D1F1A] transition-colors shadow-md"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}