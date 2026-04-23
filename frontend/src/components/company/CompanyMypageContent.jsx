import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import {
  DETAIL_INDUSTRY_OBJECTS_BY_TYPE_ID,
  DETAIL_INDUSTRY_NAME_BY_ID,
  INDUSTRY_TYPES,
  INDUSTRY_NAME_BY_ID,
} from "../../constants/industryOptions";
import { REGION_DATA } from "../../constants/regionData";

// 주소 문자열 파싱/조합 유틸
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
  // 탭/편집 UI 상태
  const [activeTab, setActiveTab] = useState("company");
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingManager, setIsEditingManager] = useState(false);
  const [industryMenuOpen, setIndustryMenuOpen] = useState(false);
  const [detailIndustryMenuOpen, setDetailIndustryMenuOpen] = useState(false);
  const [addressCityMenuOpen, setAddressCityMenuOpen] = useState(false);
  const [addressDistrictMenuOpen, setAddressDistrictMenuOpen] = useState(false);

  // 기업/담당자 데이터 상태
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

  // 로딩/에러 및 저장 상태
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [accountDeleting, setAccountDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteError, setDeleteError] = useState(false);

  // 초기 기업 정보 조회
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

  // 공통 입력/탭 전환 핸들러
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

  // 기업 정보 수정 핸들러
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

  // 관리자 정보 수정 핸들러
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

  const saveManagerEdit = async () => {
    const payload = {
      name: managerDraft.managerName?.trim() || "",
      phoneNumber: managerDraft.managerPhone?.trim() || "",
      address: managerDraft.managerOfficeAddress?.trim() || "",
    };

    try {
      await api.put("/members/update-info", payload);
      setFormData((prev) => ({ ...prev, ...managerDraft }));
      setIsEditingManager(false);
      alert("관리자 정보가 저장되었습니다.");
    } catch (error) {
      console.error("관리자 정보 수정 실패:", error);
      alert("관리자 정보 저장에 실패했습니다.");
    }
  };

  // 계정 설정(비밀번호/탈퇴) 핸들러
  const handleChangePassword = async () => {
    setPasswordMessage("");
    setPasswordError(false);

    if (!passwordData.currentPassword) {
      setPasswordMessage("현재 비밀번호를 입력해주세요.");
      setPasswordError(true);
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordMessage("새 비밀번호를 입력해주세요.");
      setPasswordError(true);
      return;
    }

    if (!passwordData.confirmPassword) {
      setPasswordMessage("새 비밀번호 확인을 입력해주세요.");
      setPasswordError(true);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setPasswordError(true);
      return;
    }

    try {
      setPasswordChanging(true);
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("accessToken");

      if (!token) {
        setPasswordMessage("로그인이 필요합니다.");
        setPasswordError(true);
        return;
      }

      const response = await fetch("/members/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordMessage("비밀번호가 성공적으로 변경되었습니다.");
        setPasswordError(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setPasswordMessage(""), 3000);
      } else {
        setPasswordMessage(data.message || "비밀번호 변경에 실패했습니다.");
        setPasswordError(true);
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      setPasswordMessage("네트워크 오류가 발생했습니다.");
      setPasswordError(true);
    } finally {
      setPasswordChanging(false);
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "정말로 회원탈퇴를 하시겠습니까?\n계정이 삭제되며 복구를 원할 시 운영진에게 연락해주세요."
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setAccountDeleting(true);
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("accessToken");

      if (!token) {
        setDeleteMessage("로그인이 필요합니다.");
        setDeleteError(true);
        return;
      }

      const response = await fetch("/members/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setDeleteMessage("회원탈퇴가 완료되었습니다. 로그인 페이지로 이동합니다.");
        setDeleteError(false);
        setTimeout(() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }, 2000);
      } else {
        setDeleteMessage(data.message || "회원탈퇴에 실패했습니다.");
        setDeleteError(true);
      }
    } catch (error) {
      console.error("회원 탈퇴 오류:", error);
      setDeleteMessage("네트워크 오류가 발생했습니다.");
      setDeleteError(true);
    } finally {
      setAccountDeleting(false);
    }
  };

  // 화면 표시용 계산 값
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

  // 로딩/에러 예외 화면
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

  // 메인 렌더링
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

      {/* 기업 정보 탭 */}
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

      {/* 관리자 정보 탭 */}
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

      {/* 계정 설정 탭 */}
      {activeTab === "account" && (
        <div className="space-y-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-sm space-y-8">
            <div className="border-b pb-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">비밀번호 변경</h3>
              <div className="space-y-3">
                <input
                  type="password"
                  className="w-full border p-3 rounded"
                  placeholder="현재 비밀번호"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <input
                  type="password"
                  className="w-full border p-3 rounded"
                  placeholder="새 비밀번호"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
                <input
                  type="password"
                  className="w-full border p-3 rounded"
                  placeholder="새 비밀번호 확인"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  onClick={handleChangePassword}
                  disabled={passwordChanging}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {passwordChanging ? "처리 중..." : "비밀번호 변경"}
                </button>
                {passwordMessage && (
                  <div
                    className={`p-3 rounded text-sm ${
                      passwordError
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {passwordMessage}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">회원 탈퇴</h3>
              <p className="text-sm text-gray-600">
                회원 탈퇴를 하시면 계정이 삭제되며 복구할 수 없습니다.
              </p>
              <button
                onClick={handleDeleteAccount}
                disabled={accountDeleting}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {accountDeleting ? "처리 중..." : "회원 탈퇴"}
              </button>

              {deleteMessage && (
                <div
                  className={`p-3 rounded text-sm ${
                    deleteError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {deleteMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}