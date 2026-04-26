import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RestrictedFeatureModal from '../RestrictedFeatureModal';
import { isMemberTypeCompany } from '../../utils/memberUtils';

export default function CommunityBanner({
  title,
  description,
  showButton
}) {
  const navigate = useNavigate();
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const hasCommunityWriteToken =
    !!localStorage.getItem("accessToken") || !!localStorage.getItem("authToken");

  const handleWriteClick = (e) => {
    if (isMemberTypeCompany()) {
      e.preventDefault();
      setShowRestrictedModal(true);
    } else {
      navigate("/communityWrite");
    }
  };

  return (
    <>
      <div className="w-full bg-[#2A1D16] py-10 h-[180px]">
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between h-full">

          {/* 왼쪽 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-sm">
              <i className="ri-discuss-line"></i>
              <span>Community</span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h1>

            {description ?
              ( <p className="text-gray-400 text-sm font-medium"> {description} </p> )
              : ( <div className="h-[20px]" />)
            }
          </div>

          {/* 오른쪽 버튼 */}
          {showButton && hasCommunityWriteToken && (
            <button
              onClick={handleWriteClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E66235] hover:bg-[#D45326] text-white text-sm font-bold rounded-md transition-all shadow-sm cursor-pointer"
            >
              <i className="ri-pencil-fill"></i>
              글쓰기
            </button>
          )}
        </div>
      </div>

      <RestrictedFeatureModal
        isOpen={showRestrictedModal}
        onClose={() => setShowRestrictedModal(false)}
        message="기업회원은 이용 불가능한 기능입니다"
      />
    </>
  );
}