import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import {
  DETAIL_INDUSTRY_OBJECTS_BY_TYPE_ID,
  DETAIL_INDUSTRY_NAME_BY_ID,
  INDUSTRY_TYPES,
  INDUSTRY_NAME_BY_ID,
} from "../../constants/industryOptions";

const REGION_DATA = {
  서울: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  경기: ["가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
  인천: ["강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "옹진군", "중구"],
  강원: ["강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"],
  충북: ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시", "충주시"],
  충남: ["계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"],
  대전: ["대덕구", "동구", "서구", "유성구", "중구"],
  세종: ["세종시"],
  전북: ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"],
  전남: ["강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
  광주: ["광산구", "남구", "동구", "북구", "서구"],
  경북: ["경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"],
  경남: ["거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"],
  부산: ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
  대구: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
  울산: ["남구", "동구", "북구", "울주군", "중구"],
  제주: ["서귀포시", "제주시"],
  전국: ["전국"],
};

function parseAddress(address = "") {
  const parts = address.trim().split(/\s+/).filter(Boolean);
  return {
    addressCity: parts[0] ?? "",
    addressDistrict: parts[1] ?? "",
    addressDetail: parts.slice(2).join(" "),
  };
}

function composeAddress({ addressCity, addressDistrict, addressDetail }) {
  return [addressCity, addressDistrict, addressDetail].filter(Boolean).join(" ");
}

export default function CompanyMypageContent({ onCompanyInfoSaved }) {
  const [activeTab, setActiveTab] = useState("company");
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingManager, setIsEditingManager] = useState(false);
  const [industryMenuOpen, setIndustryMenuOpen] = useState(false);
  const [detailIndustryMenuOpen, setDetailIndustryMenuOpen] = useState(false);
  const [addressCityMenuOpen, setAddressCityMenuOpen] = useState(false);
  const [addressDistrictMenuOpen, setAddressDistrictMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    businessNumber: "",
    industryTypeId: null,
    detailIndustryTypeId: null,
    companyEmail: "",
    address: "",
    companyDescription: "",
    managerName: "",
    managerPhone: "",
    managerOfficeAddress: "",
  });
  const [companyDraft, setCompanyDraft] = useState({
    companyName: "",
    businessNumber: "",
    industryTypeId: "",
    detailIndustryTypeId: "",
    companyEmail: "",
    addressCity: "",
    addressDistrict: "",
    addressDetail: "",
    companyDescription: "",
  });
  const [managerDraft, setManagerDraft] = useState({
    managerName: "",
    managerPhone: "",
    managerOfficeAddress: "",
  });
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const { data } = await api.get("/members/me/company");
        const nextData = { ...data };
        const parsedAddress = parseAddress(nextData.address ?? "");
        setFormData(nextData);
        setCompanyDraft({
          companyName: nextData.companyName ?? "",
          businessNumber: nextData.businessNumber ?? "",
          industryTypeId: nextData.industryTypeId ?? "",
          detailIndustryTypeId: nextData.detailIndustryTypeId ?? "",
          companyEmail: nextData.companyEmail ?? "",
          ...parsedAddress,
          companyDescription: nextData.companyDescription ?? "",
        });
        setManagerDraft({
          managerName: nextData.managerName ?? "",
          managerPhone: nextData.managerPhone ?? "",
          managerOfficeAddress: nextData.managerOfficeAddress ?? "",
        });
      } catch (error) {
        console.error("기업 정보 조회 실패:", error);
        setErrorMessage("기업 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditingCompany(false);
    setIsEditingManager(false);
    setIndustryMenuOpen(false);
    setDetailIndustryMenuOpen(false);
    setAddressCityMenuOpen(false);
    setAddressDistrictMenuOpen(false);
  };

  const handleCompanyDraftChange = (e) => {
    const { name, value } = e.target;
    if (name === "industryTypeId") {
      setCompanyDraft((prev) => ({
        ...prev,
        industryTypeId: value === "" ? "" : Number(value),
        detailIndustryTypeId: "",
      }));
      return;
    }
    if (name === "detailIndustryTypeId") {
      setCompanyDraft((prev) => ({
        ...prev,
        detailIndustryTypeId: value === "" ? "" : Number(value),
      }));
      return;
    }
    if (name === "addressCity") {
      setCompanyDraft((prev) => ({
        ...prev,
        addressCity: value,
        addressDistrict: "",
      }));
      setAddressDistrictMenuOpen(false);
      return;
    }
    setCompanyDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleManagerDraftChange = (e) => {
    const { name, value } = e.target;
    setManagerDraft((prev) => ({ ...prev, [name]: value }));
  };

  const startCompanyEdit = () => {
    const parsedAddress = parseAddress(formData.address ?? "");
    setCompanyDraft({
      companyName: formData.companyName ?? "",
      businessNumber: formData.businessNumber ?? "",
      industryTypeId: formData.industryTypeId ?? "",
      detailIndustryTypeId: formData.detailIndustryTypeId ?? "",
      companyEmail: formData.companyEmail ?? "",
      ...parsedAddress,
      companyDescription: formData.companyDescription ?? "",
    });
    setIsEditingCompany(true);
    setIndustryMenuOpen(false);
    setDetailIndustryMenuOpen(false);
    setAddressCityMenuOpen(false);
    setAddressDistrictMenuOpen(false);
  };

  const cancelCompanyEdit = () => {
    setIsEditingCompany(false);
    setIndustryMenuOpen(false);
    setDetailIndustryMenuOpen(false);
    setAddressCityMenuOpen(false);
    setAddressDistrictMenuOpen(false);
  };

  const saveCompanyEdit = async () => {
    const nextAddress = composeAddress(companyDraft);
    const payload = {
      companyName: companyDraft.companyName?.trim() || "",
      companyEmail: companyDraft.companyEmail?.trim() || "",
      address: nextAddress,
      companyDescription: companyDraft.companyDescription ?? "",
      industryTypeId: companyDraft.industryTypeId || null,
      detailIndustryTypeId: companyDraft.detailIndustryTypeId || null,
    };

    try {
      setIsSavingCompany(true);
      await api.patch("/members/me/company", payload);
      setFormData((prev) => ({ ...prev, ...companyDraft, address: nextAddress }));
      setIsEditingCompany(false);
      setIndustryMenuOpen(false);
      setDetailIndustryMenuOpen(false);
      setAddressCityMenuOpen(false);
      setAddressDistrictMenuOpen(false);
      if (onCompanyInfoSaved) {
        onCompanyInfoSaved();
      }
      alert("기업 정보가 저장되었습니다.");
    } catch (error) {
      console.error("기업 정보 수정 실패:", error);
      alert("기업 정보 저장에 실패했습니다.");
    } finally {
      setIsSavingCompany(false);
    }
  };

  const startManagerEdit = () => {
    setManagerDraft({
      managerName: formData.managerName ?? "",
      managerPhone: formData.managerPhone ?? "",
      managerOfficeAddress: formData.managerOfficeAddress ?? "",
    });
    setIsEditingManager(true);
  };

  const cancelManagerEdit = () => {
    setIsEditingManager(false);
  };

  const saveManagerEdit = () => {
    setFormData((prev) => ({ ...prev, ...managerDraft }));
    setIsEditingManager(false);
    alert("관리자 정보가 저장되었습니다.");
  };

  const industryName = useMemo(() => {
    if (!formData.industryTypeId) return "-";
    return INDUSTRY_NAME_BY_ID[formData.industryTypeId] ?? "-";
  }, [formData.industryTypeId]);

  const detailIndustryName = useMemo(() => {
    if (!formData.detailIndustryTypeId) return "-";
    return DETAIL_INDUSTRY_NAME_BY_ID[formData.detailIndustryTypeId] ?? "-";
  }, [formData.detailIndustryTypeId]);
  const detailIndustryOptions = useMemo(() => {
    if (!companyDraft.industryTypeId) return [];
    return DETAIL_INDUSTRY_OBJECTS_BY_TYPE_ID[companyDraft.industryTypeId] ?? [];
  }, [companyDraft.industryTypeId]);
  const selectedIndustryName =
    INDUSTRY_NAME_BY_ID[companyDraft.industryTypeId] ?? "선택";
  const selectedDetailIndustryName =
    DETAIL_INDUSTRY_NAME_BY_ID[companyDraft.detailIndustryTypeId] ?? "선택";
  const cityOptions = Object.keys(REGION_DATA);
  const districtOptions = companyDraft.addressCity
    ? REGION_DATA[companyDraft.addressCity] ?? []
    : [];
  const selectedAddressCityName = companyDraft.addressCity || "시 선택";
  const selectedAddressDistrictName = companyDraft.addressDistrict || "도 선택";

  if (isLoading) {
    return (
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">기업 정보를 불러오는 중입니다...</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-sm text-red-500">{errorMessage}</p>
      </section>
    );
  }

  return (
    <section className="relative space-y-5">
      <div className="flex gap-2 bg-gray-100 p-2 rounded-lg">
        <button
          onClick={() => handleTabChange("company")}
          className={`flex-1 py-2 rounded font-medium transition ${
            activeTab === "company" ? "bg-white shadow text-[#3C2A21]" : "text-gray-600"
          }`}
        >
          기업 정보
        </button>
        <button
          onClick={() => handleTabChange("manager")}
          className={`flex-1 py-2 rounded font-medium transition ${
            activeTab === "manager" ? "bg-white shadow text-[#3C2A21]" : "text-gray-600"
          }`}
        >
          관리자 정보
        </button>
        <button
          onClick={() => handleTabChange("account")}
          className={`flex-1 py-2 rounded font-medium transition ${
            activeTab === "account" ? "bg-white shadow text-[#3C2A21]" : "text-gray-600"
          }`}
        >
          계정 설정
        </button>
      </div>

      {activeTab === "company" && (
        <div className="space-y-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-sm">
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              <div>
                <p className="text-gray-400 mb-1 text-xs">기업명</p>
                {isEditingCompany ? (
                  <input
                    name="companyName"
                    value={companyDraft.companyName}
                    onChange={handleCompanyDraftChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{formData.companyName || "-"}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 mb-1 text-xs">사업자등록번호</p>
                {isEditingCompany ? (
                  <input
                    name="businessNumber"
                    value={companyDraft.businessNumber}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{formData.businessNumber || "-"}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 mb-1 text-xs">업종</p>
                {isEditingCompany ? (
                  <div
                    className="relative"
                    tabIndex={0}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIndustryMenuOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIndustryMenuOpen((prev) => !prev);
                        setDetailIndustryMenuOpen(false);
                      }}
                      className="w-full border rounded-lg px-3 py-2 text-sm text-left bg-white flex justify-between items-center"
                    >
                      <span>{selectedIndustryName}</span>
                      <i className="ri-arrow-down-s-line text-gray-500" />
                    </button>
                    {industryMenuOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto">
                        {INDUSTRY_TYPES.map((industry) => (
                          <button
                            key={industry.id}
                            type="button"
                            onClick={() => {
                              setCompanyDraft((prev) => ({
                                ...prev,
                                industryTypeId: industry.id,
                                detailIndustryTypeId: "",
                              }));
                              setIndustryMenuOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            {industry.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="font-medium text-gray-800">{industryName}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 mb-1 text-xs">상세 업종</p>
                {isEditingCompany ? (
                  <div
                    className="relative"
                    tabIndex={0}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setDetailIndustryMenuOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (!companyDraft.industryTypeId) return;
                        setDetailIndustryMenuOpen((prev) => !prev);
                        setIndustryMenuOpen(false);
                      }}
                      disabled={!companyDraft.industryTypeId}
                      className="w-full border rounded-lg px-3 py-2 text-sm text-left bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex justify-between items-center"
                    >
                      <span>{selectedDetailIndustryName}</span>
                      <i className="ri-arrow-down-s-line text-gray-500" />
                    </button>
                    {detailIndustryMenuOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto">
                        {detailIndustryOptions.map((detail) => (
                          <button
                            key={detail.id}
                            type="button"
                            onClick={() => {
                              setCompanyDraft((prev) => ({
                                ...prev,
                                detailIndustryTypeId: detail.id,
                              }));
                              setDetailIndustryMenuOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            {detail.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="font-medium text-gray-800">{detailIndustryName}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 mb-1 text-xs">이메일</p>
                {isEditingCompany ? (
                  <input
                    name="companyEmail"
                    value={companyDraft.companyEmail}
                    onChange={handleCompanyDraftChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{formData.companyEmail || "-"}</p>
                )}
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-1 text-xs">주소</p>
                {isEditingCompany ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      className="relative"
                      tabIndex={0}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setAddressCityMenuOpen(false);
                        }
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setAddressCityMenuOpen((prev) => !prev);
                          setAddressDistrictMenuOpen(false);
                        }}
                        className="w-full border rounded-lg px-3 py-2 text-sm text-left bg-white flex justify-between items-center"
                      >
                        <span>{selectedAddressCityName}</span>
                        <i className="ri-arrow-down-s-line text-gray-500" />
                      </button>
                      {addressCityMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto">
                          {cityOptions.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                setCompanyDraft((prev) => ({
                                  ...prev,
                                  addressCity: city,
                                  addressDistrict: "",
                                }));
                                setAddressCityMenuOpen(false);
                                setAddressDistrictMenuOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      className="relative"
                      tabIndex={0}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setAddressDistrictMenuOpen(false);
                        }
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (!companyDraft.addressCity) return;
                          setAddressDistrictMenuOpen((prev) => !prev);
                          setAddressCityMenuOpen(false);
                        }}
                        disabled={!companyDraft.addressCity}
                        className="w-full border rounded-lg px-3 py-2 text-sm text-left bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex justify-between items-center"
                      >
                        <span>{selectedAddressDistrictName}</span>
                        <i className="ri-arrow-down-s-line text-gray-500" />
                      </button>
                      {addressDistrictMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto">
                          {districtOptions.map((district) => (
                            <button
                              key={district}
                              type="button"
                              onClick={() => {
                                setCompanyDraft((prev) => ({
                                  ...prev,
                                  addressDistrict: district,
                                }));
                                setAddressDistrictMenuOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                            >
                              {district}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      name="addressDetail"
                      value={companyDraft.addressDetail}
                      onChange={handleCompanyDraftChange}
                      placeholder="상세 주소(직접 입력)"
                      className="border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                ) : (
                  <p className="font-medium text-gray-800 leading-relaxed">{formData.address || "-"}</p>
                )}
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-1 text-xs">기업 소개</p>
                {isEditingCompany ? (
                  <textarea
                    name="companyDescription"
                    value={companyDraft.companyDescription}
                    onChange={handleCompanyDraftChange}
                    rows={4}
                    className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                  />
                ) : (
                  <p className="font-medium text-gray-800 leading-relaxed">
                    {formData.companyDescription || "-"}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              {isEditingCompany ? (
                <div className="flex gap-2">
                  <button
                    onClick={cancelCompanyEdit}
                    className="text-xs border border-gray-300 px-4 py-1.5 rounded-md text-gray-700 font-bold transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={saveCompanyEdit}
                    disabled={isSavingCompany}
                    className="text-xs bg-[#4A2E2A] hover:bg-[#3E2723] disabled:bg-[#8a7673] disabled:cursor-not-allowed px-4 py-1.5 rounded-md text-white font-bold transition-colors shadow-sm"
                  >
                    {isSavingCompany ? "저장 중..." : "저장"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={startCompanyEdit}
                  className="text-xs bg-[#4A2E2A] hover:bg-[#3E2723] px-4 py-1.5 rounded-md text-white font-bold transition-colors shadow-sm"
                >
                  ✎ 기업 정보 수정
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "manager" && (
        <div className="space-y-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-sm">
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              <div>
                <p className="text-gray-400 mb-1 text-xs">담당자명</p>
                {isEditingManager ? (
                  <input
                    name="managerName"
                    value={managerDraft.managerName}
                    onChange={handleManagerDraftChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{formData.managerName || "-"}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 mb-1 text-xs">담당자 전화번호</p>
                {isEditingManager ? (
                  <input
                    name="managerPhone"
                    value={managerDraft.managerPhone}
                    onChange={handleManagerDraftChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{formData.managerPhone || "-"}</p>
                )}
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-1 text-xs">담당자 사무실 주소</p>
                {isEditingManager ? (
                  <input
                    name="managerOfficeAddress"
                    value={managerDraft.managerOfficeAddress}
                    onChange={handleManagerDraftChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800 leading-relaxed">
                    {formData.managerOfficeAddress || "-"}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              {isEditingManager ? (
                <div className="flex gap-2">
                  <button
                    onClick={cancelManagerEdit}
                    className="text-xs border border-gray-300 px-4 py-1.5 rounded-md text-gray-700 font-bold transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={saveManagerEdit}
                    className="text-xs bg-[#4A2E2A] hover:bg-[#3E2723] px-4 py-1.5 rounded-md text-white font-bold transition-colors shadow-sm"
                  >
                    저장
                  </button>
                </div>
              ) : (
                <button
                  onClick={startManagerEdit}
                  className="text-xs bg-[#4A2E2A] hover:bg-[#3E2723] px-4 py-1.5 rounded-md text-white font-bold transition-colors shadow-sm"
                >
                  ✎ 관리자 정보 수정
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "account" && (
        <div className="space-y-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-sm space-y-6">
            <div>
              <p className="text-gray-400 mb-1 text-xs">계정 이메일</p>
              <p className="font-medium text-gray-800">{formData.companyEmail || "-"}</p>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-800">
              비밀번호 변경/회원 탈퇴 기능은 계정 관리 탭에 추가될 예정입니다.
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs bg-[#4A2E2A] hover:bg-[#3E2723] px-4 py-1.5 rounded-md text-white font-bold transition-colors shadow-sm"
              >
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}