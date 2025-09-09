import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer.tsx";

export default function EditPage() {
    const navigate = useNavigate();
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    const handleTrimAndGoExport = () => {
        // Сохраняем выбранный диапазон — ExportPage возьмёт его и отправит на бэк
        localStorage.setItem(
            "trimRange",
            JSON.stringify({ start: trimStart, end: trimEnd })
        );
        navigate("/export");
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50">
            <div className="w-full max-w-6xl px-6 py-4">
                <button onClick={() => navigate("/")} className="text-blue-600">
                    ← Назад
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl px-6">
                {/* ЛЕВАЯ колонка — КАСТОМНЫЙ ПЛЕЕР */}
                <div className="flex-1 flex justify-center">
                    <VideoPlayer
                        trimStart={trimStart}
                        trimEnd={trimEnd}
                        onTrimChange={(start: number, end: number) => {
                            setTrimStart(start);
                            setTrimEnd(end);
                        }}
                    />
                </div>


                {/* ПРАВАЯ колонка — кнопки */}
                <div className="flex flex-col gap-4 w-full md:w-72">
                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow"
                        onClick={() => navigate("/export")}
                    >
                        Перевести видео
                    </button>


                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow"
                        onClick={handleTrimAndGoExport}
                    >
                        Обрезать
                    </button>
                </div>
            </div>
        </div>
    );
}
