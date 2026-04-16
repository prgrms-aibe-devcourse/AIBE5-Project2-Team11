import { useState } from "react";
import LoginForm from "../components/login/LoginForm";
import CompanyLoginForm from "../components/login/CompanyLoginForm";

export default function Login() {
    const [memberType, setMemberType] = useState("personal");

    return (
        <>
            {memberType === "personal" ? (
                <LoginForm setMemberType={setMemberType} />
            ) : (
                <CompanyLoginForm setMemberType={setMemberType} />
            )}
        </>
    );
}