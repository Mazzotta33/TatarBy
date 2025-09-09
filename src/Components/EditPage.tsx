import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer.tsx";
import * as React from "react";

export default function EditPage() {
    const navigate = useNavigate();

    // Состояния для обрезки видео
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    // НОВЫЕ СОСТОЯНИЯ для опций
    const [audioVolume, setAudioVolume] = useState(1);
    const [tatarianVolume, setTatarianVolume] = useState(1);
    const [speaker, setSpeaker] = useState("Almaz");
    const [sourceLang, setSourceLang] = useState("Russian");
    const [targetLang, setTargetLang] = useState("Tatar");

    const handleTrimAndGoExport = () => {
        // Сохраняем все выбранные опции в localStorage
        localStorage.setItem(
            "trimRange",
            JSON.stringify({
                start: trimStart,
                end: trimEnd,
                audioVolume: audioVolume,
                tatarianVolume: tatarianVolume,
                speaker: speaker,
                sourceLanguage: sourceLang,
                targetLanguage: targetLang
            })
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

                {/* ПРАВАЯ колонка — кнопки и НОВЫЕ КОНТРОЛЫ */}
                <div className="flex flex-col gap-4 w-full md:w-72">
                    {/* Кнопки теперь вверху */}
                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow"
                        onClick={handleTrimAndGoExport}
                    >
                        Обрезать
                    </button>
                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow"
                        onClick={handleTrimAndGoExport}
                    >
                        Перевести видео
                    </button>

                    {/* Разделитель между кнопками и контролами */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Слайдер для громкости аудио */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Громкость аудио ({audioVolume.toFixed(1)})</label>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={audioVolume}
                            onChange={(e) => setAudioVolume(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    {/* Слайдер для громкости татарского */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Громкость татарского ({tatarianVolume.toFixed(1)})</label>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={tatarianVolume}
                            onChange={(e) => setTatarianVolume(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    {/* Выпадающий список для спикеров */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Спикеры</label>
                        <select
                            value={speaker}
                            onChange={(e) => setSpeaker(e.target.value)}
                            className="p-2 border rounded-md bg-white text-gray-700"
                        >
                            <option value="Almaz">Алмаз</option>
                            <option value="Alsu">Алсу</option>
                        </select>
                    </div>

                    {/* Выпадающий список для языка "с какого" */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">С какого языка</label>
                        <select
                            value={sourceLang}
                            onChange={(e) => setSourceLang(e.target.value)}
                            className="p-2 border rounded-md bg-white text-gray-700"
                        >
                            <option value="Russian">Русский</option>
                            <option value="Tatar">Татарский</option>
                            <option value="English">Английский</option>
                        </select>
                    </div>

                    {/* Выпадающий список для языка "на какой" */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">На какой язык</label>
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="p-2 border rounded-md bg-white text-gray-700"
                        >
                            <option value="Russian">Русский</option>
                            <option value="Tatar">Татарский</option>
                            <option value="English">Английский</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}