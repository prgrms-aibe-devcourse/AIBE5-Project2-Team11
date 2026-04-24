import { useState } from "react";
import Header from "../components/Header";
import CompanySidebar from "../components/company/CompanySidebar";
import CompanyProfileCard from "../components/company/CompanyProfileCard";
import CompanyMypageContent from "../components/Company/CompanyMypageContent";

export default function CompanyMypage() {
  const [profileReloadKey, setProfileReloadKey] = useState(0);

  return (
    <>
      <Header/>
        <div className="flex max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 gap-8 items-start">
          <CompanySidebar />

          <div className="w-3/4 space-y-8">
            <CompanyProfileCard reloadKey={profileReloadKey} />
            <CompanyMypageContent
              onCompanyInfoSaved={() => setProfileReloadKey((prev) => prev + 1)}
            />
          </div>
      </div>
    </>
    
  );
}
