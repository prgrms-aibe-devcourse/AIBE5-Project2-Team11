import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import {
  DETAIL_INDUSTRY_NAME_BY_ID,
  INDUSTRY_NAME_BY_ID,
} from "../../constants/industryOptions";

export default function CompanyProfileCard({ reloadKey = 0 }) {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    industryTypeId: null,
    detailIndustryTypeId: null,
  });

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const { data } = await api.get("/members/me/company");
        setCompanyInfo({
          companyName: data.companyName ?? "",
          industryTypeId: data.industryTypeId ?? null,
          detailIndustryTypeId: data.detailIndustryTypeId ?? null,
        });
      } catch (error) {
        console.error("기업 프로필 조회 실패:", error);
      }
    };

    fetchCompanyInfo();
  }, [reloadKey]);

  const industryName = useMemo(() => {
    if (!companyInfo.industryTypeId) return "-";
    return INDUSTRY_NAME_BY_ID[companyInfo.industryTypeId] ?? "-";
  }, [companyInfo.industryTypeId]);

  const detailIndustryName = useMemo(() => {
    if (!companyInfo.detailIndustryTypeId) return "-";
    return DETAIL_INDUSTRY_NAME_BY_ID[companyInfo.detailIndustryTypeId] ?? "-";
  }, [companyInfo.detailIndustryTypeId]);

  const profileSummary = useMemo(() => {
    if (industryName === "-") return "";
    if (detailIndustryName === "-") return industryName;
    return `${industryName} · ${detailIndustryName}`;
  }, [detailIndustryName, industryName]);

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
      {/* 로고 영역 */}
      <div className="w-24 h-24 bg-[#EFECE5] rounded-xl flex items-center justify-center relative shrink-0">
        <svg className="w-12 h-12 text-[#B5A991]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>

      {/* 텍스트 영역 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {(companyInfo.companyName || "기업") + "님, 안녕하세요!"}
        </h1>
        {profileSummary && <p className="text-gray-600 mt-1">{profileSummary}</p>}
      </div>
    </section>
  );
}