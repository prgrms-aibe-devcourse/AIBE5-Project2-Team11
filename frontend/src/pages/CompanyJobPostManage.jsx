import Header from "../components/Header";
import CompanySidebar from "../components/company/CompanySidebar";
import CompanyProfileCard from "../components/company/CompanyProfileCard";
import CompanyJobpostManageContent from "../components/company/CompanyJobPostManageContent";

export default function CompanyJobPostManage() {
  return (
    <>
      <Header/>
        <div className="flex max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 gap-8 items-start">
            <CompanySidebar />

            <div className="w-3/4 space-y-8">
                <CompanyProfileCard />
                <CompanyJobpostManageContent />
            </div>
        </div>
    </>
    
  );
}
