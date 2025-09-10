import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer.tsx";
import { Listbox } from "@headlessui/react";

export default function EditPage() {
    const navigate = useNavigate();

    // Состояния для обрезки видео
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    // Опции
    const [audioVolume, setAudioVolume] = useState(1);
    const [tatarianVolume, setTatarianVolume] = useState(1);

    const speakers = ["Алмаз", "Алсу"];
    const [speaker, setSpeaker] = useState(speakers[0]);

    const languages = ["Русский", "Татарский", "Английский"];
    const [sourceLang, setSourceLang] = useState(languages[0]);
    const [targetLang, setTargetLang] = useState(languages[1]);

    const handleTrimAndGoExport = () => {
        localStorage.setItem(
            "trimRange",
            JSON.stringify({
                start: trimStart,
                end: trimEnd,
                audioVolume: audioVolume,
                tatarianVolume: tatarianVolume,
                speaker: speaker,
                sourceLanguage: sourceLang,
                targetLanguage: targetLang,
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

                {/* ПРАВАЯ колонка */}
                <div className="flex flex-col gap-4 w-full md:w-72">
                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500
                        to-emerald-600 text-white font-semibold shadow hover:shadow-lg hover:brightness-105"
                        onClick={handleTrimAndGoExport}
                    >
                        Обрезать
                    </button>
                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500
                        to-pink-500 text-white font-semibold shadow hover:shadow-lg hover:brightness-105"
                        onClick={handleTrimAndGoExport}
                    >
                        Перевести видео
                    </button>

                    <div className="border-t border-gray-200 my-2" />

                    {/* Слайдеры */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">
                            Громкость аудио ({audioVolume.toFixed(1)})
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={audioVolume}
                            onChange={(e) => setAudioVolume(Number(e.target.value))}
                            className="w-full accent-green-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">
                            Громкость татарского ({tatarianVolume.toFixed(1)})
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={tatarianVolume}
                            onChange={(e) => setTatarianVolume(Number(e.target.value))}
                            className="w-full accent-green-500"
                        />
                    </div>

                    {/* Селекты на Headless UI */}
                    <Dropdown label="Спикеры" options={speakers} value={speaker} onChange={setSpeaker} />
                    <Dropdown label="С какого языка" options={languages} value={sourceLang} onChange={setSourceLang} />
                    <Dropdown label="На какой язык" options={languages} value={targetLang} onChange={setTargetLang} />
                </div>
            </div>
        </div>
    );
}

// 🔽 Кастомный компонент Dropdown
function Dropdown({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (val: string) => void }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">{label}</label>
            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button className="w-full p-2 border-2 border-green-500 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400">
                        {value}
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 w-full rounded-md bg-white shadow-lg border border-green-400 z-10">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option}
                                value={option}
                                className={({ active, selected }) =>
                                    `cursor-pointer select-none p-2 ${
                                        active
                                            ? "bg-green-100 text-green-700"
                                            : selected
                                                ? "bg-green-50 text-green-600"
                                                : "text-gray-700"
                                    }`
                                }
                            >
                                {option}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    );
}
