import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialResumes = [
	{
		id: 1,
		title: "프론트엔드 개발자 이력서",
		updatedAt: "2025-03-10",
		isDefault: false,
		profile: {
			name: "김다온",
			email: "daon.kim@email.com",
			phone: "010-1234-5678",
			address: "서울특별시 마포구",
			birthDate: "1995-05-15",
			summary:
				"5년 경력의 프론트엔드 개발자입니다. React와 TypeScript를 주로 사용하며 사용자 중심의 UI를 개발합니다.",
		},
		experiences: [
			{
				company: "A기업",
				position: "프론트엔드 개발자",
				period: "2020.03 ~ 2025.02",
				description: "React 기반 웹 서비스 개발, 접근성 개선(WCAG 2.1)",
			},
			{
				company: "B기업",
				position: "주니어 개발자",
				period: "2018.06 ~ 2020.02",
				description: "HTML/CSS/JavaScript 기반 UI 개발",
			},
		],
		educations: [
			{
				school: "○○대학교",
				major: "컴퓨터공학과",
				period: "2013.03 ~ 2018.02",
				degree: "학사",
			},
		],
		skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git", "Figma"],
		certificates: [
			{ name: "정보처리기사", issuer: "한국산업인력공단", date: "2019.08" },
		],
	},
	{
		id: 2,
		title: "경력기술서 (간소화)",
		updatedAt: "2025-02-20",
		isDefault: true,
		profile: {
			name: "김다온",
			email: "daon.kim@email.com",
			phone: "010-1234-5678",
			address: "서울특별시 마포구",
			birthDate: "1995-05-15",
			summary: "React 전문 프론트엔드 개발자입니다.",
		},
		experiences: [
			{
				company: "A기업",
				position: "프론트엔드 개발자",
				period: "2020.03 ~ 2025.02",
				description: "React 기반 서비스 개발",
			},
		],
		educations: [
			{
				school: "○○대학교",
				major: "컴퓨터공학과",
				period: "2013.03 ~ 2018.02",
				degree: "학사",
			},
		],
		skills: ["React", "JavaScript", "HTML/CSS"],
		certificates: [],
	},
];

export default function ResumeList() {
	const [resumes, setResumes] = useState(initialResumes);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const navigate = useNavigate();

	const handleSetDefault = (id) => {
		setResumes((prev) =>
			prev.map((r) => ({ ...r, isDefault: r.id === id }))
		);
	};

	const handleDelete = (id) => {
		setResumes((prev) => prev.filter((r) => r.id !== id));
		setDeleteTarget(null);
	};

	return (
		<div className="space-y-4">
			{/* 페이지 타이틀 영역 */}
			<div>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-extrabold text-[#5D4037]">
							내 이력서
						</h1>
						<p className="text-sm text-gray-500 mt-1">
							작성한 이력서를 관리하고 채용공고에 지원해보세요.
						</p>
					</div>
					<button
						onClick={() => navigate("/memberMypage/resumes/new")}
						className="bg-yellow-500 hover:opacity-90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-opacity flex items-center gap-1.5"
					>
						<i className="ri-add-line"></i> 새 이력서 작성
					</button>
				</div>
			</div>

			{/* 이력서 목록 */}
			{resumes.length === 0 ? (
				<div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-[#F3E8D0]">
					<div className="text-5xl mb-4">📄</div>
					<p className="text-lg font-medium text-gray-600">
						아직 작성된 이력서가 없습니다.
					</p>
					<p className="text-sm mt-1">새 이력서를 작성해보세요!</p>
					<button
						onClick={() => navigate("/memberMypage/resumes/new")}
						className="inline-block mt-6 bg-yellow-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
					>
						이력서 작성하기
					</button>
				</div>
			) : (
				<div className="space-y-4">
					{resumes.map((resume) => (
						<div
							key={resume.id}
							className="bg-white border border-[#F3E8D0] rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<h2 className="font-bold text-[#5D4037] text-base truncate">
											{resume.title}
										</h2>
										{resume.isDefault && (
											<span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
												기본 이력서
											</span>
										)}
									</div>
									<p className="text-xs text-gray-400">
										최종 수정일: {resume.updatedAt}
									</p>
									<div className="flex flex-wrap gap-1.5 mt-3">
										{resume.skills.slice(0, 5).map((s) => (
											<span
												key={s}
												className="text-xs bg-[#FFF8F0] text-[#8D6E63] border border-[#F3E8D0] px-2 py-0.5 rounded-full"
											>
												{s}
											</span>
										))}
										{resume.skills.length > 5 && (
											<span className="text-xs text-gray-400">
												+{resume.skills.length - 5}
											</span>
										)}
									</div>
								</div>
							</div>

							<div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#F3E8D0]">
								<button
									onClick={() => navigate(`/memberMypage/resumes/${resume.id}`)}
									className="flex-1 text-sm text-[#8D6E63] border border-[#D7B89C] rounded-lg py-2 hover:bg-[#FFF3E0] transition-colors font-medium"
								>
									미리보기
								</button>
								<button
									onClick={() => navigate(`/memberMypage/resumes/${resume.id}/edit`)}
									className="flex-1 text-sm text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors font-medium"
								>
									수정
								</button>
								{!resume.isDefault && (
									<button
										onClick={() => handleSetDefault(resume.id)}
										className="flex-1 text-sm text-yellow-700 border border-yellow-200 rounded-lg py-2 hover:bg-yellow-50 transition-colors font-medium"
									>
										기본 설정
									</button>
								)}
								<button
									onClick={() => setDeleteTarget(resume.id)}
									className="text-sm text-red-400 border border-red-200 rounded-lg py-2 px-3 hover:bg-red-50 transition-colors"
								>
									삭제
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* 삭제 확인 모달 */}
			{deleteTarget && (
				<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
					<div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
						<h3 className="font-bold text-[#5D4037] text-lg mb-2">
							이력서를 삭제할까요?
						</h3>
						<p className="text-sm text-gray-500 mb-6">
							삭제된 이력서는 복구할 수 없습니다.
						</p>
						<div className="flex gap-3">
							<button
								onClick={() => setDeleteTarget(null)}
								className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
							>
								취소
							</button>
							<button
								onClick={() => handleDelete(deleteTarget)}
								className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
							>
								삭제
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
