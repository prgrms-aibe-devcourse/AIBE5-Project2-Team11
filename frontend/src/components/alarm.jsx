import React from "react";

export default function Alarm({
                                         alarms = [],
                                         onClose,
                                         onAlarmClick,
                                     }) {
    return (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-[#EADBC8] bg-white shadow-xl">
            {/* 말풍선 꼭짓점 */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-[#EADBC8] rotate-45"></div>

            <div className="relative z-10 rounded-2xl bg-white">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3E8D0]">
                    <h3 className="text-sm font-bold text-[#5D4037]">알림</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <i className="ri-close-line text-lg"></i>
                    </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {alarms.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                            받은 알림이 없습니다.
                        </div>
                    ) : (
                        alarms.map((alarm) => (
                            <button
                                key={alarm.alarm_id}
                                type="button"
                                onClick={() => onAlarmClick(alarm)}
                                className={`w-full text-left px-4 py-3 border-b border-[#F8EFE5] hover:bg-[#FFF8F0] transition ${
                                    !alarm.is_read ? "bg-[#FFFDF8]" : "bg-white"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="pt-1">
                                        {!alarm.is_read ? (
                                            <span className="block w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                        ) : (
                                            <span className="block w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm text-[#4E342E] leading-relaxed">
                                            {alarm.message}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            {alarm.created_at}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <div className="px-4 py-3 text-center">
                    <button
                        type="button"
                        className="text-sm font-medium text-yellow-600 hover:text-yellow-700"
                    >
                        전체 알림 보기
                    </button>
                </div>
            </div>
        </div>
    );
}