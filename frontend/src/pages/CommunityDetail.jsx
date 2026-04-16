import Header from "../components/Header";
import CommunityBanner from "../components/community/CommunityBanner";
import CommunityDetailContent from "../components/community/CommunityDetailContent";

// 작업
  // 게시글 수정 -> 작성 폼 페이지로 데이터 가져가서 옮기기
export default function CommunityDetail() {
  return (
    <>
      <Header/>
      <CommunityBanner
        title="커뮤니티 상세"
        showButton={false}
      />
      <CommunityDetailContent/>
    </>
    
  );
}
