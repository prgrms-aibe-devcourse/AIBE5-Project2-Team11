import React from 'react';
import { useParams } from "react-router-dom";

// 컴포넌트 임포트
import Header from "../components/Header";
import Footer from "../components/Footer";
import JobDetailComponent from "../components/jobs/JobDetail";

// 데이터 임포트
import { sampleJobs } from "../data/sampleJobs";

export default function JobDetail() {
    const { id } = useParams();
    const job = sampleJobs.find((j) => String(j.id) === String(id));

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* body가 남은 높이를 차지 */}
            <main className="flex-grow">
                <JobDetailComponent job={job} />
            </main>

            <Footer />
        </div>
    );
}