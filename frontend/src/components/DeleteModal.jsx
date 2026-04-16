export default function DeleteModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-80">
        <p className="mb-4 text-sm">정말 삭제하시겠습니까?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>취소</button>
          <button onClick={onConfirm} className="text-red-500">삭제</button>
        </div>
      </div>
    </div>
  );
}