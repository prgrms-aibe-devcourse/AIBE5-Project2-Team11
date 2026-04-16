import { useState } from "react";
import { Link } from "react-router-dom";

const initialForm = {
    loginId: "",
    password: "",
    confirmPassword: "",
    managerName: "",
    email: "",
    phoneNumber: "",
    memberAddress: "",
    companyName: "",
    businessNumber: "",
    companyEmail: "",
    companyAddress: "",
    companyDescription: "",
};

export default function CompanyMembership() {
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

        const memberPayload = {
            email: form.email,
            login_id: form.loginId,
            password: form.password,
            name: form.managerName,
            phone_number: form.phoneNumber,
            address: form.memberAddress,
            role: "COMPANY",
        };

        const companyPayload = {
            business_number: form.businessNumber,
            address: form.companyAddress,
            company_name: form.companyName,
            company_email: form.companyEmail,
            company_description: form.companyDescription,
            industry_type_id: null,
            detail_industry_type_id: null,
        };

        console.log("기업회원 member payload:", memberPayload);
        console.log("기업회원 company payload:", companyPayload);
        alert("기업회원 회원가입 요청");
    };

    return (
        <div>
            <form className="space-y-7" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="아이디"
                        id="loginId"
                        name="loginId"
                        value={form.loginId}
                        onChange={handleChange}
                        placeholder="기업 계정 아이디"
                    />

                    <InputField
                        label="담당자명"
                        id="managerName"
                        name="managerName"
                        value={form.managerName}
                        onChange={handleChange}
                        placeholder="담당자 이름"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="비밀번호"
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="비밀번호 입력"
                    />

                    <InputField
                        label="비밀번호 확인"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="비밀번호 다시 입력"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="담당자 이메일"
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="member 이메일"
                    />

                    <InputField
                        label="담당자 휴대폰 번호"
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="'-' 없이 입력"
                    />
                </div>

                <InputField
                    label="담당자 주소"
                    id="memberAddress"
                    name="memberAddress"
                    value={form.memberAddress}
                    onChange={handleChange}
                    placeholder="member 주소"
                />

                <div className="h-px bg-[#cca499]/40 my-2" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="기업명"
                        id="companyName"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="기업명을 입력해주세요"
                    />

                    <InputField
                        label="사업자등록번호"
                        id="businessNumber"
                        name="businessNumber"
                        value={form.businessNumber}
                        onChange={handleChange}
                        placeholder="'-' 없이 입력"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="기업 이메일"
                        id="companyEmail"
                        name="companyEmail"
                        type="email"
                        value={form.companyEmail}
                        onChange={handleChange}
                        placeholder="company 이메일"
                    />

                    <InputField
                        label="기업 주소"
                        id="companyAddress"
                        name="companyAddress"
                        value={form.companyAddress}
                        onChange={handleChange}
                        placeholder="company 주소"
                    />
                </div>

                <div className="space-y-3">
                    <label
                        htmlFor="companyDescription"
                        className="block text-lg md:text-xl font-bold text-[#422820]"
                    >
                        기업 소개
                    </label>
                    <textarea
                        id="companyDescription"
                        name="companyDescription"
                        rows={5}
                        value={form.companyDescription}
                        onChange={handleChange}
                        placeholder="기업 소개를 입력해주세요"
                        className="w-full px-5 py-4 bg-[#ffede8] border-2 border-[#cca499] rounded-2xl text-base md:text-lg focus:border-[#f97f06] focus:outline-none transition-all resize-none"
                    />
                </div>

                <TermsSection
                    terms={terms}
                    onAllChange={handleAllTerms}
                    onSingleChange={handleSingleTerm}
                />

                <button
                    type="submit"
                    className="w-full py-5 bg-[#feb300] text-[#382400] text-xl md:text-2xl font-black rounded-2xl shadow-lg hover:brightness-95 active:scale-[0.99] transition-all"
                >
                    기업회원 가입 완료
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