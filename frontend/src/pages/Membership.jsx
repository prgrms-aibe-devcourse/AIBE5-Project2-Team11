import { useState } from "react";
import PersonalMembership from "../components/membership/PersonalMembership";
import CompanyMembership from "../components/membership/CompanyMembership";

export default function Membership() {
    const [memberType, setMemberType] = useState("personal");

    return (
        <div className="min-h-screen bg-[#fff4f1] bg-[radial-gradient(circle_at_top_right,_#feb300_0%,_#fff4f1_60%)] text-[#422820] flex flex-col">
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
                    <div className="p-8 md:p-12">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                                회원가입
                            </h1>
                            <p className="text-lg md:text-xl text-[#74544a] font-medium">
                                다온일과 함께 새로운 시작을 함께해요.
                            </p>
                        </div>

                        {/* 회원 유형 선택 */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <button
                                type="button"
                                onClick={() => setMemberType("personal")}
                                className={`rounded-2xl border-2 px-6 py-5 text-lg md:text-xl font-bold transition-all ${
                                    memberType === "personal"
                                        ? "border-[#f97f06] bg-[#fff1df] text-[#914700] shadow-md"
                                        : "border-[#cca499] bg-[#ffede8] text-[#74544a] hover:border-[#f97f06]"
                                }`}
                            >
                                개인회원
                            </button>

                            <button
                                type="button"
                                onClick={() => setMemberType("company")}
                                className={`rounded-2xl border-2 px-6 py-5 text-lg md:text-xl font-bold transition-all ${
                                    memberType === "company"
                                        ? "border-[#f97f06] bg-[#fff1df] text-[#914700] shadow-md"
                                        : "border-[#cca499] bg-[#ffede8] text-[#74544a] hover:border-[#f97f06]"
                                }`}
                            >
                                기업회원
                            </button>
                        </div>

                        {memberType === "personal" ? (
                            <PersonalMembership />
                        ) : (
                            <CompanyMembership />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}