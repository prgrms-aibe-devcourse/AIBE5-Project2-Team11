import Header from "../components/Header";
import NoticeDetailBody from "../components/notice/NoticeDetailBody";

export default function NoticeDetail() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8F5EF]">
            <Header />
            <main className="flex-grow">
                <NoticeDetailBody />
            </main>
        </div>
    );
}