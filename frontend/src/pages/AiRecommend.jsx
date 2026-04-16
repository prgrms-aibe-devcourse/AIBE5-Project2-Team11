import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/ai/AiChat.jsx";
import AiBanner from "../components/ai/AiBanner.jsx";

export default function AiRecommend() {
  return (
    <>
      <Header />
        <AiBanner/>
        <div className="max-w-7xl mx-auto px-10 mt-6">
          <AiChat/>
        </div>
      <Footer />
    </>
  );
}
