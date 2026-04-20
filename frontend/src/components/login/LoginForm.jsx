import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ setMemberType}) {
    const navigate = useNavigate();
    const [memberType] = useState("personal");

    const [form, setForm] = useState({
        username: "",
        password: "",
        autoLogin: false,
    });

    const [isLogin] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/members/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    loginId: form.username,
                    password: form.password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // 로그인 성공
                localStorage.setItem("isLogin", "true");
                localStorage.setItem("memberType", data.role === "JOB_SEEKER" ? "JOB_SEEKER" : "COMPANY");
                localStorage.setItem("memberId", data.memberId);
                localStorage.setItem("memberName", data.name);
                localStorage.setItem("accessToken", data.token);
                localStorage.setItem("loginId", data.loginId);
                navigate("/");
            } else {
                // 로그인 실패
                alert(data.message || "로그인에 실패했습니다.");
            }
        } catch (error) {
            console.error("로그인 오류:", error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#fff9f0] text-[#451a03]">
            <div className="absolute top-20 -left-20 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 -right-20 w-80 h-80 bg-yellow-300/30 rounded-full blur-3xl"></div>

            <div className="w-full max-w-lg z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                        반가워요!
                    </h1>
                    <p className="text-lg text-[#78350f]">
                        당신의 새로운 시작, 다온일이 함께합니다.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-[0_24px_48px_-12px_rgba(180,83,9,0.1)] p-8 md:p-10 border border-amber-100">
                    <div className="flex gap-2 mb-10 bg-amber-100 p-1.5 rounded-full">
                        <button
                            type="button"
                            onClick={() => setMemberType("personal")}
                            className={`flex-1 py-4 px-6 rounded-full text-center font-bold transition ${
                                memberType === "personal"
                                    ? "bg-white text-amber-700 shadow-sm"
                                    : "text-[#78350f] hover:bg-amber-200/50"
                            }`}
                        >
                            개인회원
                        </button>

                        <button
                            type="button"
                            onClick={() => setMemberType("company")}
                            className={`flex-1 py-4 px-6 rounded-full text-center font-medium transition ${
                                memberType === "company"
                                    ? "bg-white text-amber-700 shadow-sm"
                                    : "text-[#78350f] hover:bg-amber-200/50"
                            }`}
                        >
                            기업회원
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="username"
                                className="block font-bold mb-2 ml-1 text-[#451a03]"
                            >
                                아이디
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="아이디를 입력해주세요"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full h-14 px-6 rounded-xl bg-amber-50 text-[#451a03] border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder:text-[#78350f]/50 transition-all"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block font-bold mb-2 ml-1 text-[#451a03]"
                            >
                                비밀번호
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="비밀번호를 입력해주세요"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full h-14 px-6 rounded-xl bg-amber-50 text-[#451a03] border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder:text-[#78350f]/50 transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    name="autoLogin"
                                    type="checkbox"
                                    checked={form.autoLogin}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded text-amber-700 focus:ring-amber-500"
                                />
                                <span className="text-sm text-[#78350f] group-hover:text-[#451a03]">
                                    자동 로그인
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-16 bg-amber-700 text-white rounded-full text-lg font-bold shadow-lg shadow-amber-700/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            로그인
                        </button>
                    </form>

                    {isLogin && (
                        <p className="text-center text-green-600 font-bold mt-4">
                            로그인 완료 ✅
                        </p>
                    )}

                    <div className="relative my-10 flex items-center">
                        <div className="flex-grow border-t border-amber-200"></div>
                        <span className="flex-shrink mx-4 text-sm text-[#78350f]">
                            소셜 계정으로 로그인
                        </span>
                        <div className="flex-grow border-t border-amber-200"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            type="button"
                            className="w-full h-14 bg-[#FEE500] text-[#3C1E1E] rounded-xl flex items-center justify-center gap-3 font-bold hover:opacity-90 transition-opacity"
                        >
                            <span className="text-lg">💬</span>
                            카카오로 3초만에 시작하기
                        </button>

                        <button
                            type="button"
                            className="w-full h-14 bg-white border border-amber-200 text-[#451a03] rounded-xl flex items-center justify-center gap-3 font-bold hover:bg-amber-50 transition-colors"
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google Logo"
                                className="w-5 h-5"
                            />
                            Google 계정으로 로그인
                        </button>
                    </div>

                    <div className="flex justify-center items-center gap-6 mt-10 text-sm text-[#78350f] flex-wrap">
                        <a href="#" className="hover:text-amber-700 transition-colors">
                            아이디 찾기
                        </a>
                        <span className="w-px h-3 bg-amber-300"></span>
                        <a href="#" className="hover:text-amber-700 transition-colors">
                            비밀번호 찾기
                        </a>
                        <button
                            type="button"
                            onClick={() => navigate("/membership")}
                            className="font-bold text-amber-700 hover:underline transition-colors"
                        >
                            회원가입
                        </button>
                    </div>
                </div>

                <div className="mt-12 bg-amber-200/30 rounded-3xl p-6 flex gap-4 items-start border border-amber-300/40">
                    <span className="text-amber-700 text-lg">ℹ️</span>
                    <p className="text-[#78350f] text-sm leading-relaxed">
                        글자가 너무 작으신가요? 브라우저의{" "}
                        <span className="font-bold">Ctrl +</span> 단축키를 이용해 화면을 확대하시거나 고객센터로 문의주시면 친절히 안내해 드리겠습니다.
                    </p>
                </div>
            </div>
        </main>
    );
}