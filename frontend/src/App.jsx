import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Membership from "./pages/Membership";
import Community from "./pages/Community";
import CommunityDetail from "./pages/CommunityDetail";
import CommunityWrite from "./pages/CommunityWrite";
import ResumeList from "./pages/ResumeList";
import ResumeForm from "./pages/ResumeForm";
import ResumeDetail from "./pages/ResumeDetail";
import CompanyMypage from "./pages/CompanyMypage";
import CompanyJobPostManage from "./pages/CompanyJobPostManage";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import MemberMypage from "./pages/MemberMypage";
import CompanyApplicants from "./pages/CompanyApplicants.jsx";
import AiRecommend from "./pages/AiRecommend";
import Notice from "./pages/Notice";
import NoticeDetail from "./pages/NoticeDetail";

export default function App() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/login" element={<Login />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/communityDetail/:post_id" element={<CommunityDetail />} />
        <Route path="/communityWrite" element={<CommunityWrite />} />

        <Route path="/company-mypage" element={<CompanyMypage />} />
        <Route path="/company-jobpost-manage" element={<CompanyJobPostManage />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/companyapplicants/:jobId" element={<CompanyApplicants />} />
        <Route path="/ai-recommend" element={<AiRecommend />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />

        {/* 마이페이지: 사이드바가 유지되는 중첩 라우트 */}
        <Route path="/memberMypage" element={<MemberMypage />}>
          {/* 이력서 관리 중첩 라우트 */}
          <Route path="resumes" element={<ResumeList />} />
          <Route path="resumes/new" element={<ResumeForm />} />
          <Route path="resumes/:id" element={<ResumeDetail />} />
          <Route path="resumes/:id/edit" element={<ResumeForm />} />
        </Route>
      </Routes>
    </div>
  );
}
