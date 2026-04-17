import { useState } from "react";

export default function MemberMypageBody() {
    const [activeTab, setActiveTab] = useState("basic");
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    const [profile, setProfile] = useState({
        name: "김다온",
        email: "daon.kim@email.com",
        phone: "010-1234-5678",
        address: "서울특별시 강남구",
        desiredJob: "프론트엔드 개발자",
        desiredSalary: "4000",
        disabilityType: "지체장애",
        disabilityGrade: "3급",
        accommodationNeeds: "휠체어 접근 가능 환경, 재택근무 우선 배정",
    });

    const [profileInfo, setProfileInfo] = useState({
        career: "5년",
        preferredJob: "프론트엔드 개발자",
        preferredRegion: "서울",
        introduction: "열정적인 개발자입니다.",
        envBothHands: 1,
        envEyesight: 1,
        envHandWork: 1,
        envLiftPower: 0,
        envLstnTalk: 1,
        envStndWalk: 0,
        languages: [
            {
                id: 1,
                languageName: "영어",
                testName: "TOEIC",
                score: "900",
                acquiredDate: "2023-01-15",
                expirationDate: "2026-01-15",
            },
        ],
        certificates: [
            {
                id: 1,
                certificateName: "정보처리기사",
                acquiredDate: "2022-06-10",
                scoreOrGrade: "합격",
                status: "취득",
            },
        ],
        disabilities: [
            {
                id: 1,
                disabilityName: "지체장애",
                severity: "3급",
                note: "오른쪽 팔 불편",
            },
        ],
    });

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
        setIsEditingProfile((prev) => !prev);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
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

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="font-medium text-gray-700">희망 직무</label>
                        <input
                            className={`col-span-3 border p-2 rounded ${
                                !isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                            }`}
                            value={profile.desiredJob}
                            onChange={(e) => handleChange("desiredJob", e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="font-medium text-gray-700">희망 연봉</label>
                        <input
                            className={`col-span-3 border p-2 rounded ${
                                !isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                            }`}
                            value={profile.desiredSalary}
                            onChange={(e) => handleChange("desiredSalary", e.target.value)}
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
        </div>
    );
}