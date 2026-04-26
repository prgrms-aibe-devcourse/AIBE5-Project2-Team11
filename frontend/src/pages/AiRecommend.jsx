import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AiChat from "../components/ai/AiChat.jsx";
import AiBanner from "../components/ai/AiBanner.jsx";
import RestrictedFeatureModal from "../components/RestrictedFeatureModal";
import { isMemberTypeCompany } from "../utils/memberUtils";

export default function AiRecommend() {
  const navigate = useNavigate();
  const isCompany = isMemberTypeCompany();
  const [showRestrictedModal, setShowRestrictedModal] = useState(isCompany);

  const handleModalClose = () => {
    setShowRestrictedModal(false);
    navigate("/");
  };

  return (
    <>
      <Header />
      <AiBanner/>
      {!isCompany && (
        <div className="max-w-7xl mx-auto px-10 mt-6">
          <AiChat/>
        </div>
      )}
      
      <RestrictedFeatureModal
        isOpen={showRestrictedModal}
        onClose={handleModalClose}
        message="기업회원은 이용 불가능한 기능입니다"
      />
    </>
  );
}
