export default function CompanyInfoEditModal({ isOpen, onClose, formData, onChange, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">기업 정보 수정</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">기업명</label>
              <input type="text" name="company_name" value={formData.company_name} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B5A991]" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">사업자번호</label>
              <input type="text" name="business_number" value={formData.business_number} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B5A991]" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">이메일</label>
              <input type="email" name="company_email" value={formData.company_email} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B5A991]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">주소</label>
              <input type="text" name="address" value={formData.address} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B5A991]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">기업 소개</label>
              <textarea name="company_description" value={formData.company_description} onChange={onChange} rows="3" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B5A991] resize-none" />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">취소</button>
            <button type="submit" className="flex-1 py-2 bg-[#3D2B24] text-white rounded-lg text-sm font-medium hover:bg-[#2D1F1A] transition-colors">저장하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}