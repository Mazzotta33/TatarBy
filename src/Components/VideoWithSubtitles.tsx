import { useRef, useState, useEffect } from "react";

const videoWithSubtitles = [
    {
        start: 27.2,
        end: 33.42,
        ru: "Мы рады приветствовать гостей и участников восьмого Международного Золотардынского форума.",
        tt: "Сигезенче Халыкара Алтын Урда форумында катнашучыларны һәм кунакларны каршы алуыбызга шатбыз.",
    },
    {
        start: 33.42,
        end: 43.0,
        ru: "Они вносят существенный вклад в изучение истории как татарского народа, так и народов Республики Татарстан и в целом истории России.",
        tt: "Алар татар халкының, Татарстан Республикасы халыкларының һәм гомумән, Россия тарихының тарихын өйрәнүгә зур өлеш кертә.",
    },
    {
        start: 46.7,
        end: 57.5,
        ru: "Лусджучи или Золотая Орда является неотлеваемой частью российского культурного пространства и является частью общероссийского прошлого.",
        tt: "Лусджучи, ягъни Алтын Урда, Россия мәдәниятенең аерылгысыз өлеше булып тора һәм гомумроссия үткәненең өлеше булып тора.",
    },
    // ... и так далее
];

const VideoWithSubtitles = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [currentSub, setCurrentSub] = useState<{ ru: string; tt: string } | null>(null);

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const time = videoRef.current.currentTime;

        // ищем субтитр, подходящий по времени
        const active = videoWithSubtitles.find((s) => time >= s.start && time <= s.end);
        setCurrentSub(active ? { ru: active.ru, tt: active.tt } : null);
    };

    return (
        <div className="flex flex-col items-center">
            {/* Видеоплеер */}
            <video
                ref={videoRef}
                src={localStorage.getItem("uploadedVideo") || ""}
                className="w-3/4 rounded-lg shadow"
                controls
                onTimeUpdate={handleTimeUpdate}
            />

            {/* Полоска обрезки (тут твоя кастомная) */}я
            <div className="w-3/4 h-12 bg-gray-700 mt-4 rounded-lg relative">
                {/* примерная заглушка */}
                <div className="absolute left-10 right-20 top-0 bottom-0 bg-green-500/40 rounded"></div>
            </div>

            {/* Субтитры под полоской */}
            {currentSub && (
                <div className="mt-3 text-center">
                    <p className="text-white bg-black/70 px-4 py-2 rounded-lg text-sm mb-2">
                        {currentSub.ru}
                    </p>
                    {currentSub.tt && (
                        <p className="text-green-200 bg-black/70 px-4 py-2 rounded-lg text-sm">
                            {currentSub.tt}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoWithSubtitles;
