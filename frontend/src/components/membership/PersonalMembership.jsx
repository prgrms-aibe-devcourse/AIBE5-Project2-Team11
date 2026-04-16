import { useState } from "react";
import { Link } from "react-router-dom";

const initialForm = {
    loginId: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
};

export default function PersonalMembership() {
    const [form, setForm] = useState(initialForm);
    const [terms, setTerms] = useState({
        all: false,
        service: false,
        privacy: false,
        marketing: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAllTerms = (checked) => {
        setTerms({
            all: checked,
            service: checked,
            privacy: checked,
            marketing: checked,
        });
    };

    const handleSingleTerm = (name, checked) => {
        const nextTerms = {
            ...terms,
            [name]: checked,
        };

        nextTerms.all =
            nextTerms.service && nextTerms.privacy && nextTerms.marketing;

        setTerms(nextTerms);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        if (!terms.service || !terms.privacy) {
            alert("필수 약관에 동의해주세요.");
            return;
        }

        const payload = {
            email: form.email,
            login_id: form.loginId,
            password: form.password,
            name: form.name,
            phone_number: form.phoneNumber,
            address: form.address,
            role: "JOB_SEEKER",
        };

        console.log("개인회원 회원가입 payload:", payload);
        alert("개인회원 회원가입 요청");
    };

    return (
        <div>
            <form className="space-y-7" onSubmit={handleSubmit}>
                <InputField
                    label="아이디"
                    id="loginId"
                    name="loginId"
                    value={form.loginId}
                    onChange={handleChange}
                    placeholder="아이디를 입력해주세요"
                />

                <InputField
                    label="비밀번호"
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력해주세요"
                />

                <InputField
                    label="비밀번호 확인"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="비밀번호를 다시 입력해주세요"
                />

                <InputField
                    label="이름"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="실명을 입력해주세요"
                />

                <InputField
                    label="이메일"
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@daonil.com"
                />

                <div className="space-y-3">
                    <label
                        htmlFor="phoneNumber"
                        className="block text-lg md:text-xl font-bold text-[#422820]"
                    >
                        휴대폰 번호
                    </label>
                    <div className="flex gap-3">
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            placeholder="'-' 없이 입력"
                            className="flex-1 px-5 py-4 bg-[#ffede8] border-2 border-[#cca499] rounded-2xl text-base md:text-lg focus:border-[#f97f06] focus:outline-none transition-all"
                        />
                        <button
                            type="button"
                            className="px-5 md:px-7 bg-[#feb300] text-[#382400] font-bold rounded-2xl whitespace-nowrap hover:brightness-95 transition"
                        >
                            인증번호 전송
                        </button>
                    </div>
                </div>

                <InputField
                    label="주소"
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="주소를 입력해주세요"
                />

                <TermsSection
                    terms={terms}
                    onAllChange={handleAllTerms}
                    onSingleChange={handleSingleTerm}
                />

                <button
                    type="submit"
                    className="w-full py-5 bg-[#feb300] text-[#382400] text-xl md:text-2xl font-black rounded-2xl shadow-lg hover:brightness-95 active:scale-[0.99] transition-all"
                >
                    개인회원 가입 완료
                </button>
            </form>

            <div className="text-center mt-10">
        <span className="text-base md:text-lg text-[#74544a]">
          이미 계정이 있으신가요?
        </span>{" "}
                <Link
                    to="/login"
                    className="text-base md:text-lg font-bold text-[#914700] underline underline-offset-4"
                >
                    로그인하기
                </Link>
            </div>
        </div>
    );
}

function InputField({
                        label,
                        id,
                        name,
                        type = "text",
                        value,
                        onChange,
                        placeholder,
                    }) {
    return (
        <div className="space-y-3">
            <label
                htmlFor={id}
                className="block text-lg md:text-xl font-bold text-[#422820]"
            >
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-5 py-4 bg-[#ffede8] border-2 border-[#cca499] rounded-2xl text-base md:text-lg focus:border-[#f97f06] focus:outline-none transition-all"
            />
        </div>
    );
}

function TermsSection({ terms, onAllChange, onSingleChange }) {
    return (
        <div className="bg-[#ffede8] p-6 md:p-8 rounded-2xl space-y-5 border border-[#cca499]/50 mt-4">
            <div className="flex items-center gap-3">
                <input
                    id="allTerms"
                    type="checkbox"
                    checked={terms.all}
                    onChange={(e) => onAllChange(e.target.checked)}
                    className="w-5 h-5"
                />
                <label
                    htmlFor="allTerms"
                    className="text-lg md:text-xl font-extrabold text-[#422820]"
                >
                    약관 전체 동의
                </label>
            </div>

            <div className="h-px bg-[#cca499]/40 w-full" />

            <div className="space-y-4">
                <TermItem
                    id="service"
                    checked={terms.service}
                    label="[필수] 이용약관 동의"
                    onChange={(checked) => onSingleChange("service", checked)}
                />
                <TermItem
                    id="privacy"
                    checked={terms.privacy}
                    label="[필수] 개인정보 수집 및 이용 동의"
                    onChange={(checked) => onSingleChange("privacy", checked)}
                />
                <TermItem
                    id="marketing"
                    checked={terms.marketing}
                    label="[선택] 마케팅 정보 수신 동의"
                    onChange={(checked) => onSingleChange("marketing", checked)}
                />
            </div>
        </div>
    );
}

function TermItem({ id, checked, label, onChange }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-5 h-5"
                />
                <label htmlFor={id} className="text-sm md:text-base text-[#74544a]">
                    {label}
                </label>
            </div>
            <button
                type="button"
                className="text-sm md:text-base text-[#74544a] underline underline-offset-4"
            >
                보기
            </button>
        </div>
    );
}