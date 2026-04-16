import { useState } from 'react';
import { company as initialCompany } from "../../mockData/company";
import CompanyInfoEditModal from './CompanyInfoEditModal';

export default function CompanyMypageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialCompany);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 저장 로직 (API 연동 시 이곳에 작성)
    console.log("저장된 데이터:", formData);
    
    // 저장 성공 알림
    alert("기업 정보가 성공적으로 저장되었습니다!");
    
    setIsModalOpen(false);
  };

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-900">기업 기본 정보</h2>
        
        {/* 수정 버튼*/}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-xs bg-[#F59E0B] hover:bg-[#D97706] px-4 py-1.5 rounded-md text-white font-bold transition-colors shadow-sm"
        >
          ✎ 정보 수정
        </button>
      </div>
      
      {/*  기업 기본 정보 */}
      <div className="grid grid-cols-2 gap-y-8 text-sm">
        <div>
          <p className="text-gray-400 mb-1 text-xs">기업명</p>
          <p className="font-medium text-gray-800">{formData.company_name}</p>
        </div>
        <div>
          <p className="text-gray-400 mb-1 text-xs">사업자등록번호</p>
          <p className="font-medium text-gray-800">{formData.business_number}</p>
        </div>
        <div>
          <p className="text-gray-400 mb-1 text-xs">업종</p>
          <p className="font-medium text-gray-800">IT·소프트웨어</p>
        </div>
        <div>
          <p className="text-gray-400 mb-1 text-xs">이메일</p>
          <p className="font-medium text-gray-800">{formData.company_email}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-400 mb-1 text-xs">주소</p>
          <p className="font-medium text-gray-800 leading-relaxed">{formData.address}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-400 mb-1 text-xs">기업 소개</p>
          <p className="font-medium text-gray-800 leading-relaxed">{formData.company_description}</p>
        </div>
      </div>

      <CompanyInfoEditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </section>
  );
}