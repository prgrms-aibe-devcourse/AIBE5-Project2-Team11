import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CommunityBanner from "../components/community/CommunityBanner";
import CommunityWriteForm from "../components/community/CommunityWriteForm" //
import RestrictedFeatureModal from "../components/RestrictedFeatureModal";
import { isMemberTypeCompany } from "../utils/memberUtils";

export default function CommunityWrite() {
  const navigate = useNavigate();
  const isCompany = isMemberTypeCompany();
  const [showRestrictedModal, setShowRestrictedModal] = useState(isCompany);

  const handleModalClose = () => {
    setShowRestrictedModal(false);
    navigate("/");
  };

  return (
    <>
      <Header/>
      <CommunityBanner
        title="게시글 작성"
        showButton={false}
      />
      {!isCompany && <CommunityWriteForm/>}

      <RestrictedFeatureModal
        isOpen={showRestrictedModal}
        onClose={handleModalClose}
        message="기업회원은 이용 불가능한 기능입니다"
      />
    </>
  );
}
