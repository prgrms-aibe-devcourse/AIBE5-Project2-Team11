import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import AlarmPopover from "./alarm";
import daonilLogo from "../assets/images/logo/daonil-logo.jpg";
import { fetchAlarms, markAlarmAsRead } from "../api/alarmApi";

// 알림 재조회 최소 간격 (밀리초) - 중복 API 호출 방지
const ALARM_COOLDOWN_MS = 60_000;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  let memberType = localStorage.getItem("memberType");

  if (!memberType) {
    memberType = "UNAUTHENTICATED";
    localStorage.setItem("memberType", memberType);
  }

  memberType = memberType.toUpperCase().replace(/-/g, "");

  const [isLogin, setIsLogin] = useState(() => {
    return localStorage.getItem("isLogin") === "true";
  });

  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [isLoadingAlarms, setIsLoadingAlarms] = useState(false);

  // 마지막 알림 조회 시간 (쿨다운 캐싱)
  const lastFetchedRef = useRef(0);

  // ✅ 알림 조회 함수 (쿨다운 적용)
  const loadAlarms = useCallback(async (force = false) => {
    const now = Date.now();

    // 쿨다운 내 중복 호출 방지 (force=true면 무시)
    if (!force && now - lastFetchedRef.current < ALARM_COOLDOWN_MS) {
      return;
    }

    try {
      setIsLoadingAlarms(true);
      lastFetchedRef.current = now;
      const alarmsData = await fetchAlarms();
      setAlarms(alarmsData);
    } catch (error) {
      console.error("알림 조회 실패:", error);
      // 에러 발생 시 알림을 빈 배열로 설정
      setAlarms([]);
    } finally {
      setIsLoadingAlarms(false);
    }
  }, []);

  // ✅ localStorage 변경 감지 (OAuth2 로그인 후 업데이트)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogin(localStorage.getItem("isLogin") === "true");
    };

    window.addEventListener("storage", handleStorageChange);

    // OAuth2 로그인 직후 업데이트 (같은 탭에서는 storage 이벤트 발생 안 함)
    const checkLoginStatus = () => {
      setIsLogin(localStorage.getItem("isLogin") === "true");
    };

    // 페이지 포커스 시 확인
    window.addEventListener("focus", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", checkLoginStatus);
    };
  }, []);

  // ✅ 로그인 상태일 때 알림 조회 (최초 1회만, 폴링 없음)
  useEffect(() => {
    if (isLogin) {
      loadAlarms(true);
    } else {
      setAlarms([]);
      lastFetchedRef.current = 0;
    }
  }, [isLogin, loadAlarms]);

  // ✅ 페이지 이동 시 알림 갱신 (쿨다운 적용 — 빈번한 이동 시 중복 호출 방지)
  useEffect(() => {
    if (isLogin) {
      loadAlarms();
    }
  }, [location.pathname, isLogin, loadAlarms]);

  const alarmRef = useRef(null);

  const navItems = [
    { label: "채용공고", path: "/jobs", icon: "ri-file-list-3-line" },
    { label: "커뮤니티", path: "/community", icon: "ri-discuss-line" },
    { label: "AI추천", path: "/ai-recommend", icon: "ri-sparkling-2-line" },
    { label: "공지사항", path: "/notice", icon: "ri-notification-3-line" },
  ];

  const isActive = (path) =>
      location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    // ✅ 모든 로그인 정보 제거 (OAuth2 + 일반 로그인)
    localStorage.removeItem("isLogin");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("memberId");
    localStorage.removeItem("memberName");
    localStorage.removeItem("loginId");
    localStorage.removeItem("memberType");
    sessionStorage.removeItem("accessToken");

    setIsLogin(false);
    navigate("/");
  };

  const unreadCount = alarms.filter((alarm) => !alarm.isRead).length;

  const handleAlarmClick = (alarm) => {
    // 이미 읽은 알림이면 API 호출 생략
    if (alarm.isRead) return;

    // 클릭한 알림 읽음 처리 (Backend 호출)
    // 낙관적 UI 업데이트: API 호출 전에 먼저 UI 반영
    setAlarms((prev) =>
        prev.map((item) =>
            item.alarmId === alarm.alarmId
                ? { ...item, isRead: true }
                : item
        )
    );

    markAlarmAsRead(alarm.alarmId).catch((error) => {
      console.error("알림 읽음 처리 실패:", error);
      // 실패 시 롤백
      setAlarms((prev) =>
          prev.map((item) =>
              item.alarmId === alarm.alarmId
                  ? { ...item, isRead: false }
                  : item
          )
      );
    });
  };

  // 알림 팝오버 토글 (열 때만 쿨다운 기반으로 새로고침)
  const handleAlarmToggle = () => {
    setIsAlarmOpen((prev) => {
      const willOpen = !prev;
      if (willOpen) {
        loadAlarms(); // 쿨다운 내라면 자동 스킵됨
      }
      return willOpen;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alarmRef.current && !alarmRef.current.contains(event.target)) {
        setIsAlarmOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <header className="sticky top-0 z-20 w-full bg-white border-b border-[#F3E8D0]">
        <div className="max-w-7xl mx-auto px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img
                  src={daonilLogo}
                  alt="다온일"
                  className="h-14 w-auto object-contain mt-2"
              />
            </Link>

            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                  <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition ${
                          isActive(item.path)
                              ? "bg-yellow-500 text-white font-bold"
                              : "text-gray-500 hover:text-[#5D4037]"
                      }`}
                  >
                    <i className={`${item.icon} text-sm`}></i>
                    {item.label}
                  </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isLogin ? (
                <>
                  {/* 알림 */}
                  <div className="relative" ref={alarmRef}>
                    <button
                        type="button"
                        onClick={handleAlarmToggle}
                        className="relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition"
                    >
                      <i className="ri-notification-3-line text-xl text-gray-600"></i>

                      {unreadCount > 0 && (
                          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center leading-none">
                      {unreadCount}
                    </span>
                      )}
                    </button>

                    {isAlarmOpen && (
                        <AlarmPopover
                            alarms={alarms}
                            onClose={() => setIsAlarmOpen(false)}
                            onAlarmClick={handleAlarmClick}
                        />
                    )}
                  </div>

                  <Link
                      to={memberType === "COMPANY" ? "/company-mypage" : "/memberMypage"}
                      className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition"
                  >
                    <i className="ri-user-3-line text-xl text-gray-600"></i>
                  </Link>

                  <button
                      type="button"
                      onClick={handleLogout}
                      className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition"
                  >
                    <i className="ri-logout-box-r-line text-xl text-gray-600"></i>
                  </button>
                </>
            ) : (
                <>
                  <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium rounded-md border border-[#D7B89C] text-[#8D6E63] hover:bg-[#FFF3E0] transition"
                  >
                    로그인
                  </Link>

                  <Link
                      to="/Membership"
                      className="px-4 py-2 text-sm font-semibold text-white rounded-md bg-yellow-500 hover:opacity-90 transition"
                  >
                    회원가입
                  </Link>
                </>
            )}
          </div>
        </div>
      </header>
  );
}