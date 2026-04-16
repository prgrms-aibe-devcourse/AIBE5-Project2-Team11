import Header from "../components/Header";
import CommunityBanner from "../components/community/CommunityBanner";
import CommunityList from "../components/community/CommunityList";

export default function Community() {
  return (
    <>
      <Header/>
      <CommunityBanner
        title="커뮤니티"
        description="함께 나누는 취업 이야기, 정보와 경험을 공유해요"
        showButton={true}
      />
      <CommunityList/>
    </>
    
  );
}
