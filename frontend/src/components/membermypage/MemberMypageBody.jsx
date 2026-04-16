import { useState } from "react";

export default function MemberMypageBody() {
    const [activeTab, setActiveTab] = useState("basic");
    const [isEditing, setIsEditing] = useState(false);

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

    const handleChange = (field, value) => {
        setProfile({
            ...profile,
            [field]: value,
        });
    };

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
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
                    onClick={() => setActiveTab("disability")}
                    className={`flex-1 py-2 rounded ${
                        activeTab === "disability" ? "bg-white shadow font-semibold" : ""
                    }`}
                >
                    장애정보
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

            {/* 장애정보 */}
            {activeTab === "disability" && (
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
                    <select
                        className="w-full border p-2 rounded"
                        value={profile.disabilityType}
                        onChange={(e) => handleChange("disabilityType", e.target.value)}
                    >
                        <option>지체장애</option>
                        <option>시각장애</option>
                        <option>청각장애</option>
                        <option>언어장애</option>
                    </select>

                    <select
                        className="w-full border p-2 rounded"
                        value={profile.disabilityGrade}
                        onChange={(e) => handleChange("disabilityGrade", e.target.value)}
                    >
                        <option>1급</option>
                        <option>2급</option>
                        <option>3급</option>
                        <option>4급</option>
                        <option>5급</option>
                        <option>6급</option>
                    </select>

                    <textarea
                        className="w-full border p-2 rounded"
                        rows="4"
                        value={profile.accommodationNeeds}
                        onChange={(e) =>
                            handleChange("accommodationNeeds", e.target.value)
                        }
                    />
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