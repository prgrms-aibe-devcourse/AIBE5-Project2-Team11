import Header from "../components/Header";
import Footer from "../components/Footer";
import CommunityBanner from "../components/community/CommunityBanner";
import CommunityWriteForm from "../components/community/CommunityWriteForm" //

export default function CommunityWrite() {
  return (
    <>
      <Header/>
      <CommunityBanner
        title="게시글 작성"
        showButton={false}
      />
      <CommunityWriteForm/>
      <Footer/>
    </>
    
  );
}
