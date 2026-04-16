import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { sampleJobs } from "../../data/sampleJobs";

export default function AiChat() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "안녕하세요! 저는 다온 챗봇입니다. 회사명/지역/직무 키워드로 문의하시면 관련 공고를 추천하고 공고 정보를 요약해 드립니다. 예) '안성 창고 공고 알려줘', '지원 기간 언제까지야?'" }
  ]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const fmtTerm = useCallback((term) => {
    if (!term) return "";
    if (term === '상시') return '상시';
    const parts = term.split("~").map(s => s.trim());
    const fmt = (d) => {
      const clean = d.replace(/[^0-9]/g, '');
      if (clean.length >= 8) return clean.slice(4,6) + '-' + clean.slice(6,8);
      const mmdd = d.match(/(\d{2})[-/](\d{2})/);
      return mmdd ? `${mmdd[1]}-${mmdd[2]}` : d;
    };
    if (parts.length === 2) return `${fmt(parts[0])}~${fmt(parts[1])}`;
    return fmt(parts[0]);
  }, []);

  const summarizeJob = useCallback((j) => {
    const loc = (j.location || '').replace(/\(.*?\)/g,'').replace(/[,·]/g,' ').trim().split(/\s+/).slice(0,2).join(' ');
    const envs = (j.workEnv || []).slice(0,3).map(e => {
      if (!e) return e;
      if (e.includes('Kg')) {
        const m = e.match(/[\d,~]+Kg/);
        return m ? m[0] : e;
      }
      if (e.includes('듣') || e.includes('말')) return '청취/발화';
      if (e.includes('서서')) return '서서작업';
      if (e.includes('양손')) return '양손작업';
      return e.length > 18 ? e.slice(0,18)+'...' : e;
    }).join(', ');

    return `${j.title} @ ${j.company} · ${loc} · 기간 ${fmtTerm(j.date)} ${envs ? '· 주요환경: ' + envs : ''}`;
  }, [fmtTerm]);

  const knowledge = useMemo(() => {
    return sampleJobs.map(j => ({ id: `job-${j.id}`, type: 'job', title: j.title, company: j.company, text: summarizeJob(j), job: j }));
  }, [summarizeJob]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const generateAnswer = (q) => {
    const text = q.toLowerCase();
    if (/어떻게|사용법|방법|사용해/.test(text)) {
      return "사용법: 회사명/직무/지역 키워드로 문의하면 관련 공고를 찾아 요약합니다. 예) '안성 창고 공고', '시각장애인에 적합한 직무'";
    }

    const tokens = text.split(/\s+|[,，.?!]/).filter(Boolean);
    const scores = knowledge.map(k => {
      let score = 0;
      tokens.forEach(t => {
        if (k.text.toLowerCase().includes(t)) score += 2;
        if ((k.title || '').toLowerCase().includes(t)) score += 3;
        if ((k.company || '').toLowerCase().includes(t)) score += 3;
      });
      return { k, score };
    });

    const matched = scores.filter(s => s.score > 0).sort((a,b) => b.score - a.score).slice(0,5);
    if (matched.length > 0) {
      const whenKeywords = /언제|기간|마감|마감일|시작|끝|언제까지/;
      if (whenKeywords.test(text)) {
        const res = matched[0].k;
        if (res.type === 'job') {
          const j = res.job;
          return `"${j.title}"의 지원 기간은 ${fmtTerm(j.date)} 입니다. 상세페이지: /jobs/${j.id}`;
        }
      }

      const envKeywords = /장애|요구|환경|작업|능력/;
      if (envKeywords.test(text)) {
        const list = matched.filter(m => m.k.type === 'job').map(m => m.k.job);
        if (list.length === 0) return '조건에 맞는 공고의 작업환경 정보가 없습니다.';
        return list.slice(0,3).map(j => `- ${j.company} / ${j.title} : ${(j.workEnv||[]).slice(0,3).join(', ') || '정보 없음'}`).join('\n');
      }

      const jobs = matched.filter(m => m.k.type === 'job').map(m => m.k.job).slice(0,3);
      if (jobs.length > 0) {
        return jobs.map(j => `${summarizeJob(j)} \n상세보기: /jobs/${j.id}`).join('\n\n');
      }
    }

    return '죄송하지만 요청하신 내용을 정확히 찾지 못했습니다. 회사명/지역/직무 키워드로 다시 시도해 주세요.';
  };

  const handleSend = () => {
    const q = (input || '').trim();
    if (!q) return;
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setTimeout(() => {
      const answer = generateAnswer(q);
      setMessages(prev => [...prev, { role: 'bot', text: answer }]);
    }, 250);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNavigateJob = (path) => {
    if (!path) return;
    navigate(path);
  };

  return (
    <div className="bg-white rounded-2xl p-10 shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col min-h-[520px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-5 bg-gray-100 rounded-lg border max-h-[85vh]">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'bot' ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-2xl">🤖</div>
                  <div className="bg-white text-gray-800 max-w-[92%] p-5 rounded-lg border">{String(m.text).split(/(\/jobs\/\d+)/).map((chunk, idx) => {
                    if (/^\/jobs\/\d+$/.test(chunk)) {
                      return (
                        <button key={idx} onClick={() => handleNavigateJob(chunk)} className="text-yellow-600 underline ml-1">상세보기</button>
                      );
                    }
                    return <span key={idx}>{chunk}</span>;
                  })}</div>
                </div>
              ) : (
                <div className="flex items-center justify-end w-full">
                  <div className="bg-yellow-50 text-gray-800 max-w-[92%] p-5 rounded-lg border text-right">{m.text}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="질문을 입력하세요. 예) 안성 창고 공고 알려줘" className="flex-1 px-4 py-3 rounded-lg border resize-none h-16" />
          <button onClick={handleSend} className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold">전송</button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-sm font-bold text-gray-700">예시 질문</div>
        <div className="flex flex-col gap-2">
          <button onClick={() => { setInput('안성 창고 공고 알려줘'); }} className="text-sm px-3 py-2 bg-gray-100 rounded-md text-left">안성 창고 공고 알려줘</button>
          <button onClick={() => { setInput('시각장애인에게 적합한 작업 환경은?'); }} className="text-sm px-3 py-2 bg-gray-100 rounded-md text-left">시각장애인에게 적합한 작업 환경은?</button>
          <button onClick={() => { setInput('지원 기간 언제까지야'); }} className="text-sm px-3 py-2 bg-gray-100 rounded-md text-left">지원 기간 언제까지야</button>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          <div className="font-semibold">간단한 팁</div>
          <ul className="list-disc list-inside text-xs">
            <li>회사명, 지역, 직무 키워드로 질문하면 공고를 찾아줘요.</li>
            <li>지원기간/작업환경 등은 공고의 원문 데이터를 기반으로 요약합니다.</li>
            <li>학습 데이터 추가 기능은 제거되어 있으며, 샘플 공고만으로 답변합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
