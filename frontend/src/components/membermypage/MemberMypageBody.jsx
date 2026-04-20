import { useState, useEffect } from "react";

export default function MemberMypageBody() {
    const [activeTab, setActiveTab] = useState("basic");
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        disabilityType: "",
        disabilityGrade: "",
        accommodationNeeds: "",
        loginId: "",
    });

    const [profileInfo, setProfileInfo] = useState({
        career: "",
        preferredJob: "",
        preferredRegion: "",
        desiredSalary: "",
        introduction: "",
        envBothHands: 0,
        envEyesight: 0,
        envHandWork: 0,
        envLiftPower: 0,
        envLstnTalk: 0,
        envStndWalk: 0,
        languages: [],
        certificates: [],
        disabilities: [],
    });

    // API에서 사용자 정보 및 프로필 정보 조회
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");

                if (!token) {
                    setError("로그인이 필요합니다.");
                    setLoading(false);
                    return;
                }

                const response = await fetch("http://localhost:8080/members/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem("accessToken");
                        setError("세션이 만료되었습니다. 다시 로그인해주세요.");
                    } else {
                        setError("사용자 정보를 불러올 수 없습니다.");
                    }
                    setLoading(false);
                    return;
                }

                const data = await response.json();

                if (data.success) {
                    // API 응답 데이터로 프로필 업데이트
                    setProfile({
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phoneNumber || "",
                        address: data.address || "",
                        desiredJob: "",
                        desiredSalary: "",
                        disabilityType: "",
                        disabilityGrade: "",
                        accommodationNeeds: "",
                        loginId: data.loginId || "",
                    });

                    // 프로필 정보 조회
                    await fetchProfileInfo(token);
                } else {
                    setError(data.message || "사용자 정보를 불러올 수 없습니다.");
                }
            } catch (err) {
                console.error("사용자 정보 조회 오류:", err);
                setError("네트워크 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    // 프로필 정보 조회 함수
    const fetchProfileInfo = async (token) => {
        try {
            const response = await fetch("http://localhost:8080/members/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    const profileData = data.data;
                    setProfileInfo({
                        career: profileData.career || "",
                        preferredJob: profileData.preferredJob || "",
                        preferredRegion: profileData.preferredRegion || "",
                        desiredSalary: profileData.desiredSalary || "",
                        introduction: profileData.introduction || "",
                        envBothHands: profileData.envBothHands === "1" ? 1 : 0,
                        envEyesight: profileData.envEyesight === "1" ? 1 : 0,
                        envHandWork: profileData.envHandWork === "1" ? 1 : 0,
                        envLiftPower: profileData.envLiftPower === "1" ? 1 : 0,
                        envLstnTalk: profileData.envLstnTalk === "1" ? 1 : 0,
                        envStndWalk: profileData.envStndWalk === "1" ? 1 : 0,
                        languages: profileData.languages || [],
                        certificates: profileData.certificates || [],
                        disabilities: profileData.disabilities || [],
                    });
                }
            }
        } catch (err) {
            console.error("프로필 정보 조회 오류:", err);
        }
    };

    const handleChange = (field, value) => {
        setProfile({
            ...profile,
            [field]: value,
        });
    };

    const handleProfileChange = (field, value) => {
        setProfileInfo({
            ...profileInfo,
            [field]: value,
        });
    };

    const handleLanguageChange = (index, field, value) => {
        const newLanguages = [...profileInfo.languages];
        newLanguages[index] = {
            ...newLanguages[index],
            [field]: value,
        };
        setProfileInfo({
            ...profileInfo,
            languages: newLanguages,
        });
    };

    const handleAddLanguage = () => {
        setProfileInfo({
            ...profileInfo,
            languages: [
                ...profileInfo.languages,
                {
                    id: Date.now(),
                    languageName: "",
                    testName: "",
                    score: "",
                    acquiredDate: "",
                    expirationDate: "",
                },
            ],
        });
    };

    const handleRemoveLanguage = (index) => {
        const newLanguages = profileInfo.languages.filter((_, i) => i !== index);
        setProfileInfo({
            ...profileInfo,
            languages: newLanguages,
        });
    };

    const handleCertificateChange = (index, field, value) => {
        const newCertificates = [...profileInfo.certificates];
        newCertificates[index] = {
            ...newCertificates[index],
            [field]: value,
        };
        setProfileInfo({
            ...profileInfo,
            certificates: newCertificates,
        });
    };

    const handleAddCertificate = () => {
        setProfileInfo({
            ...profileInfo,
            certificates: [
                ...profileInfo.certificates,
                {
                    id: Date.now(),
                    certificateName: "",
                    acquiredDate: "",
                    scoreOrGrade: "",
                    status: "취득",
                },
            ],
        });
    };

    const handleRemoveCertificate = (index) => {
        const newCertificates = profileInfo.certificates.filter((_, i) => i !== index);
        setProfileInfo({
            ...profileInfo,
            certificates: newCertificates,
        });
    };

    const handleDisabilityChange = (index, field, value) => {
        const newDisabilities = [...profileInfo.disabilities];
        newDisabilities[index] = {
            ...newDisabilities[index],
            [field]: value,
        };
        setProfileInfo({
            ...profileInfo,
            disabilities: newDisabilities,
        });
    };

    const handleAddDisability = () => {
        setProfileInfo({
            ...profileInfo,
            disabilities: [
                ...profileInfo.disabilities,
                {
                    id: Date.now(),
                    disabilityName: "",
                    severity: "",
                    note: "",
                },
            ],
        });
    };

    const handleRemoveDisability = (index) => {
        const newDisabilities = profileInfo.disabilities.filter((_, i) => i !== index);
        setProfileInfo({
            ...profileInfo,
            disabilities: newDisabilities,
        });
    };

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const handleProfileEditToggle = () => {
        if (isEditingProfile) {
            // 저장 로직
            saveProfileInfo();
        }
        setIsEditingProfile((prev) => !prev);
    };

    const saveProfileInfo = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            const payload = {
                career: profileInfo.career,
                preferredJob: profileInfo.preferredJob,
                preferredRegion: profileInfo.preferredRegion,
                desiredSalary: profileInfo.desiredSalary,
                introduction: profileInfo.introduction,
                envBothHands: profileInfo.envBothHands ? "1" : "0",
                envEyesight: profileInfo.envEyesight ? "1" : "0",
                envHandWork: profileInfo.envHandWork ? "1" : "0",
                envLiftPower: profileInfo.envLiftPower ? "1" : "0",
                envLstnTalk: profileInfo.envLstnTalk ? "1" : "0",
                envStndWalk: profileInfo.envStndWalk ? "1" : "0",
                languages: profileInfo.languages.map(lang => ({
                    languageName: lang.languageName,
                    testName: lang.testName,
                    score: lang.score,
                    acquiredDate: lang.acquiredDate,
                    expirationDate: lang.expirationDate,
                })),
                certificates: profileInfo.certificates.map(cert => ({
                    certificateName: cert.certificateName,
                    acquiredDate: cert.acquiredDate,
                    scoreOrGrade: cert.scoreOrGrade,
                    status: cert.status,
                })),
                disabilities: profileInfo.disabilities.map(dis => ({
                    disabilityName: dis.disabilityName,
                    severity: dis.severity,
                    note: dis.note,
                })),
            };

            const response = await fetch("http://localhost:8080/members/profile", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert("프로필이 저장되었습니다.");
                } else {
                    alert("프로필 저장에 실패했습니다: " + data.message);
                }
            } else {
                alert("프로필 저장 중 오류가 발생했습니다.");
            }
        } catch (err) {
            console.error("프로필 저장 오류:", err);
            alert("네트워크 오류가 발생했습니다.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
            {/* 로딩 상태 */}
            {loading && (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                    <p className="text-gray-500">사용자 정보를 불러오는 중입니다...</p>
                </div>
            )}

            {/* 에러 상태 */}
            {error && !loading && (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="text-red-600 text-center">
                        <p className="font-semibold">{error}</p>
                    </div>
                </div>
            )}

            {/* 정상 상태 */}
            {!loading && !error && (
                <>
            {/* 상단 프로필 */}
            <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                    👤
                </div>

                <div>
                    <h2 className="font-bold text-lg">{profile.name}</h2>
                    <p className="text-gray-500 text-sm">{profile.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                        {profile.disabilityType} {profile.disabilityGrade}
                    </span>
                </div>
            </div>

            {/* 탭 */}
            <div className="flex gap-2 bg-gray-100 p-2 rounded-lg">
                <button
                    onClick={() => setActiveTab("basic")}
                    className={`flex-1 py-2 rounded ${
                        activeTab === "basic" ? "bg-white shadow font-semibold" : ""
                    }`}
                >
                    기본정보
                </button>

                <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex-1 py-2 rounded ${
                        activeTab === "profile" ? "bg-white shadow font-semibold" : ""
                    }`}
                >
                    프로필 정보
                </button>

                <button
                    onClick={() => setActiveTab("account")}
                    className={`flex-1 py-2 rounded ${
                        activeTab === "account" ? "bg-white shadow font-semibold" : ""
                    }`}
                >
                    계정설정
                </button>
            </div>

            {/* 기본정보 */}
            {activeTab === "basic" && (
                <div className="bg-white shadow rounded-lg p-6 space-y-5">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="font-medium text-gray-700">이름</label>
                        <input
                            className={`col-span-3 border p-2 rounded ${
                                !isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                            }`}
                            value={profile.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="font-medium text-gray-700">이메일</label>
                        <input
                            className={`col-span-3 border p-2 rounded ${
                                !isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                            }`}
                            value={profile.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="font-medium text-gray-700">전화번호</label>
                        <input
                            className={`col-span-3 border p-2 rounded ${
                                !isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                            }`}
                            value={profile.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="font-medium text-gray-700">주소</label>
                        <input
                            className={`col-span-3 border p-2 rounded ${
                                !isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                            }`}
                            value={profile.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>


                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            onClick={handleEditToggle}
                            className="px-6 py-2 bg-[#4A2E2A] text-white rounded-lg hover:bg-[#3a231f]"
                        >
                            {isEditing ? "수정 완료" : "내용 수정"}
                        </button>

                    </div>
                </div>
            )}

            {/* 프로필 정보 */}
            {activeTab === "profile" && (
                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                    {/* 기본 프로필 정보 */}
                    <div className="space-y-4 pb-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">기본 정보</h3>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="font-medium text-gray-700">경력</label>
                            <input
                                className={`col-span-3 border p-2 rounded ${
                                    !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                }`}
                                value={profileInfo.career}
                                onChange={(e) => handleProfileChange("career", e.target.value)}
                                disabled={!isEditingProfile}
                                placeholder="예: 5년"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="font-medium text-gray-700">희망 직무</label>
                            <input
                                className={`col-span-3 border p-2 rounded ${
                                    !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                }`}
                                value={profileInfo.preferredJob}
                                onChange={(e) => handleProfileChange("preferredJob", e.target.value)}
                                disabled={!isEditingProfile}
                                placeholder="예: 프론트엔드 개발자"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="font-medium text-gray-700">희망 지역</label>
                            <input
                                className={`col-span-3 border p-2 rounded ${
                                    !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                }`}
                                value={profileInfo.preferredRegion}
                                onChange={(e) => handleProfileChange("preferredRegion", e.target.value)}
                                disabled={!isEditingProfile}
                                placeholder="예: 서울"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="font-medium text-gray-700">희망 연봉</label>
                            <input
                                className={`col-span-3 border p-2 rounded ${
                                    !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                }`}
                                value={profileInfo.desiredSalary}
                                onChange={(e) => handleProfileChange("desiredSalary", e.target.value)}
                                disabled={!isEditingProfile}
                                placeholder="예: 4000만원"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <label className="font-medium text-gray-700">자기소개</label>
                            <textarea
                                className={`col-span-3 border p-2 rounded min-h-[100px] ${
                                    !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                }`}
                                value={profileInfo.introduction}
                                onChange={(e) => handleProfileChange("introduction", e.target.value)}
                                disabled={!isEditingProfile}
                                placeholder="자신을 소개해주세요."
                            />
                        </div>
                    </div>

                    {/* 근무 환경 (직무 환경) */}
                    <div className="space-y-4 pb-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">근무 환경 조건</h3>
                        <p className="text-sm text-gray-500">해당하는 근무 환경 조건을 선택해주세요. (1: 가능, 0: 불가)</p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={profileInfo.envBothHands === 1}
                                    onChange={(e) => handleProfileChange("envBothHands", e.target.checked ? 1 : 0)}
                                    disabled={!isEditingProfile}
                                />
                                <label className="text-gray-700">양손 사용 가능</label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={profileInfo.envEyesight === 1}
                                    onChange={(e) => handleProfileChange("envEyesight", e.target.checked ? 1 : 0)}
                                    disabled={!isEditingProfile}
                                />
                                <label className="text-gray-700">시력 기준 충족</label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={profileInfo.envHandWork === 1}
                                    onChange={(e) => handleProfileChange("envHandWork", e.target.checked ? 1 : 0)}
                                    disabled={!isEditingProfile}
                                />
                                <label className="text-gray-700">손 작업 가능</label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={profileInfo.envLiftPower === 1}
                                    onChange={(e) => handleProfileChange("envLiftPower", e.target.checked ? 1 : 0)}
                                    disabled={!isEditingProfile}
                                />
                                <label className="text-gray-700">물건 운반 가능</label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={profileInfo.envLstnTalk === 1}
                                    onChange={(e) => handleProfileChange("envLstnTalk", e.target.checked ? 1 : 0)}
                                    disabled={!isEditingProfile}
                                />
                                <label className="text-gray-700">청취·대화 가능</label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={profileInfo.envStndWalk === 1}
                                    onChange={(e) => handleProfileChange("envStndWalk", e.target.checked ? 1 : 0)}
                                    disabled={!isEditingProfile}
                                />
                                <label className="text-gray-700">서서/걷기 가능</label>
                            </div>
                        </div>
                    </div>

                    {/* 언어 능력 */}
                    <div className="space-y-4 pb-6 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">언어 능력</h3>
                            {isEditingProfile && (
                                <button
                                    onClick={handleAddLanguage}
                                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    + 추가
                                </button>
                            )}
                        </div>

                        {profileInfo.languages.map((lang, index) => (
                            <div key={lang.id} className="border rounded p-4 space-y-3">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="font-medium text-gray-700">언어</label>
                                    <input
                                        className={`col-span-3 border p-2 rounded ${
                                            !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                        }`}
                                        value={lang.languageName}
                                        onChange={(e) => handleLanguageChange(index, "languageName", e.target.value)}
                                        disabled={!isEditingProfile}
                                        placeholder="예: 영어"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="font-medium text-gray-700">시험 이름</label>
                                    <input
                                        className={`col-span-3 border p-2 rounded ${
                                            !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                        }`}
                                        value={lang.testName}
                                        onChange={(e) => handleLanguageChange(index, "testName", e.target.value)}
                                        disabled={!isEditingProfile}
                                        placeholder="예: TOEIC"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="font-medium text-gray-700">점수</label>
                                    <input
                                        className={`col-span-3 border p-2 rounded ${
                                            !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                        }`}
                                        value={lang.score}
                                        onChange={(e) => handleLanguageChange(index, "score", e.target.value)}
                                        disabled={!isEditingProfile}
                                        placeholder="예: 900"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <label className="font-medium text-gray-700">취득일</label>
                                        <input
                                            type="date"
                                            className={`border p-2 rounded ${
                                                !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                            }`}
                                            value={lang.acquiredDate}
                                            onChange={(e) => handleLanguageChange(index, "acquiredDate", e.target.value)}
                                            disabled={!isEditingProfile}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <label className="font-medium text-gray-700">만료일</label>
                                        <input
                                            type="date"
                                            className={`border p-2 rounded ${
                                                !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                            }`}
                                            value={lang.expirationDate}
                                            onChange={(e) => handleLanguageChange(index, "expirationDate", e.target.value)}
                                            disabled={!isEditingProfile}
                                        />
                                    </div>
                                </div>

                                {isEditingProfile && (
                                    <button
                                        onClick={() => handleRemoveLanguage(index)}
                                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 자격증 */}
                    <div className="space-y-4 pb-6 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">자격증</h3>
                            {isEditingProfile && (
                                <button
                                    onClick={handleAddCertificate}
                                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    + 추가
                                </button>
                            )}
                        </div>

                        {profileInfo.certificates.map((cert, index) => (
                            <div key={cert.id} className="border rounded p-4 space-y-3">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="font-medium text-gray-700">자격증명</label>
                                    <input
                                        className={`col-span-3 border p-2 rounded ${
                                            !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                        }`}
                                        value={cert.certificateName}
                                        onChange={(e) => handleCertificateChange(index, "certificateName", e.target.value)}
                                        disabled={!isEditingProfile}
                                        placeholder="예: 정보처리기사"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="font-medium text-gray-700">취득일</label>
                                    <input
                                        type="date"
                                        className={`col-span-3 border p-2 rounded ${
                                            !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                        }`}
                                        value={cert.acquiredDate}
                                        onChange={(e) => handleCertificateChange(index, "acquiredDate", e.target.value)}
                                        disabled={!isEditingProfile}
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="font-medium text-gray-700">성적/등급</label>
                                    <input
                                        className={`col-span-3 border p-2 rounded ${
                                            !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                        }`}
                                        value={cert.scoreOrGrade}
                                        onChange={(e) => handleCertificateChange(index, "scoreOrGrade", e.target.value)}
                                        disabled={!isEditingProfile}
                                        placeholder="예: 합격, A+"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="font-medium text-gray-700">상태</label>
                                    <select
                                        className={`col-span-3 border p-2 rounded ${
                                            !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                        }`}
                                        value={cert.status}
                                        onChange={(e) => handleCertificateChange(index, "status", e.target.value)}
                                        disabled={!isEditingProfile}
                                    >
                                        <option>취득</option>
                                        <option>응시 예정</option>
                                    </select>
                                </div>

                                {isEditingProfile && (
                                    <button
                                        onClick={() => handleRemoveCertificate(index)}
                                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 장애 정보 */}
                    <div className="space-y-4 pb-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">장애 정보</h3>
                            {isEditingProfile && (
                                <button
                                    onClick={handleAddDisability}
                                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    + 추가
                                </button>
                            )}
                        </div>

                        {profileInfo.disabilities.map((disability, index) => (
                            <div key={disability.id} className="border rounded p-4 space-y-3">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="font-medium text-gray-700">장애 유형</label>
                                    <input
                                        className={`col-span-3 border p-2 rounded ${
                                            !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                        }`}
                                        value={disability.disabilityName}
                                        onChange={(e) => handleDisabilityChange(index, "disabilityName", e.target.value)}
                                        disabled={!isEditingProfile}
                                        placeholder="예: 지체장애"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="font-medium text-gray-700">장애 등급</label>
                                    <input
                                        className={`col-span-3 border p-2 rounded ${
                                            !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                        }`}
                                        value={disability.severity}
                                        onChange={(e) => handleDisabilityChange(index, "severity", e.target.value)}
                                        disabled={!isEditingProfile}
                                        placeholder="예: 3급"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-start gap-4">
                                    <label className="font-medium text-gray-700">비고</label>
                                    <textarea
                                        className={`col-span-3 border p-2 rounded min-h-[80px] ${
                                            !isEditingProfile ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                                        }`}
                                        value={disability.note}
                                        onChange={(e) => handleDisabilityChange(index, "note", e.target.value)}
                                        disabled={!isEditingProfile}
                                        placeholder="예: 오른쪽 팔 불편"
                                    />
                                </div>

                                {isEditingProfile && (
                                    <button
                                        onClick={() => handleRemoveDisability(index)}
                                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 수정 버튼 */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            onClick={handleProfileEditToggle}
                            className="px-6 py-2 bg-[#4A2E2A] text-white rounded-lg hover:bg-[#3a231f]"
                        >
                            {isEditingProfile ? "수정 완료" : "내용 수정"}
                        </button>
                    </div>
                </div>
            )}

            {/* 계정설정 */}
            {activeTab === "account" && (
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
                    <input
                        type="password"
                        className="w-full border p-2 rounded"
                        placeholder="현재 비밀번호"
                    />

                    <input
                        type="password"
                        className="w-full border p-2 rounded"
                        placeholder="새 비밀번호"
                    />

                    <input
                        type="password"
                        className="w-full border p-2 rounded"
                        placeholder="새 비밀번호 확인"
                    />

                    <button className="w-full bg-blue-500 text-white py-2 rounded">
                        비밀번호 변경
                    </button>

                    <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mt-2">
                        회원 탈퇴
                    </button>
                </div>
            )}
                </>
            )}
        </div>
    );
}