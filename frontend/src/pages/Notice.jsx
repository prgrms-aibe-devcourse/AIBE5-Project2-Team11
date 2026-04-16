import Header from "../components/Header";
import NoticeBody from "../components/notice/NoticeBody";

export default function Notice() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8F5EF]">
            <Header />
            <main className="flex-grow">
                <NoticeBody />
            </main>
        </div>
    );
}