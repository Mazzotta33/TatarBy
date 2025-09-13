import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { Listbox } from "@headlessui/react";
import { useTranslateVideoMutation, useVideoCutMutation } from "../Redux/api/videoApi.ts";

// Удален начальный массив subtitles, так как он будет приходить с бэкенда
const subtitles = [];

export default function EditPage() {
    const navigate = useNavigate();

    const [translateVideo, { isLoading: isTranslating, isSuccess: isTranslateSuccess, isError: isTranslateError, error: translateError }] = useTranslateVideoMutation();
    const [videoCut, { isLoading, isSuccess, isError, error }] = useVideoCutMutation();

    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(localStorage.getItem("originalVideo"));

    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    const [audioVolume, setAudioVolume] = useState(1);
    const [tatarianVolume, setTatarianVolume] = useState(1);

    const speakers = ["almaz", "alsu"];
    const [speaker, setSpeaker] = useState(speakers[0]);

    const languages = ["Русский", "Татарский", "Английский"];
    const [sourceLang, setSourceLang] = useState(languages[0]);
    const [targetLang, setTargetLang] = useState(languages[1]);

    // Изначально пустой массив субтитров
    const [subs, setSubs] = useState(subtitles);
    const [currentSub, setCurrentSub] = useState<null | { start: number; end: number; text: Record<string,string>; lang?: string }>(null);

    // Новая функция для перевода
    const handleTranslateAndGoExport = async () => {
        const videoUrl = localStorage.getItem("originalVideo");
        if (!videoUrl) {
            console.error("URL видео не найден в localStorage.");
            return;
        }

        // Преобразуем субтитры из вашего текущего формата в формат бэкенда
        const subsListForBackend = subs.length > 0 ? subs.map(sub => ({
            startSeconds: sub.start,
            endSeconds: sub.end,
            russianText: sub.text.ru,
            tatarText: sub.text_tat,
            language: sub.lang,
        })) : null; // Отправляем null, если субтитры пустые

        console.log("Субтитры перед POST-запросом:", subsListForBackend);

        try {
            const response = await translateVideo({
                videoUrl,
                params: {
                    audioVolume,
                    tatarAudioVolume: tatarianVolume,
                    speaker,
                    translateFrom: langLabelToCode(sourceLang),
                    translateTo: langLabelToCode(targetLang),
                },
                subtitlesList: subsListForBackend,
            }).unwrap();

            // Сохраняем URL переведенного видео
            setCurrentVideoUrl(response.videoUrl);
            localStorage.setItem("currentVideo", response.videoUrl);

            console.log("Данные субтитров, полученные от бэкенда:", response.subtitlesList);

            const formattedSubs = response.subtitlesList.map(sub => {
                const textObject = {
                    [langLabelToCode("Русский")]: sub.language === 'ru' ? sub.text : '',
                    [langLabelToCode("Татарский")]: sub.text_tat,
                    [langLabelToCode("Английский")]: sub.language === 'ar' ? sub.text : ''
                };

                return {
                    start: sub.start,
                    end: sub.end,
                    text: textObject,
                    lang: sub.language
                };
            });

            setSubs(formattedSubs);
            console.log("Состояние 'subs' после обновления:", formattedSubs);

            // setSubs(response.subtitlesList);
            // console.log("Состояние 'subs' после обновления:", response.subtitlesList);

        } catch (err) {
            console.error("Ошибка при переводе видео:", err);
        }
    };

    // Новая функция для перехода на страницу экспорта
    const handleGoToExportPage = () => {
        if (currentVideoUrl) {
            localStorage.setItem("currentVideo", currentVideoUrl);
            navigate("/exportTranslate");
        } else {
            console.error("Переведенное видео еще не готово.");
        }
    };

    const handleTrimVideo = async () => {
        const videoUrl = localStorage.getItem("originalVideo");
        if (!videoUrl) {
            console.error("URL видео не найден в localStorage.");
            return;
        }

        try {
            const response = await videoCut({
                videoUrl,
                start: trimStart,
                end: trimEnd,
            }).unwrap();

            // Если нужно, сохраните обрезанный URL в localStorage
            setCurrentVideoUrl(response);
            localStorage.setItem("currentVideo", response);

            console.log("Видео успешно обрезано:", response);
        } catch (err) {
            console.error("Ошибка при обрезке видео:", err);
        }
    };

    const langLabelToCode = (label: string) => {
        if (!label) return "ru";
        if (label.toLowerCase().startsWith("рус")) return "rus_Lath";
        if (label.toLowerCase().startsWith("тат")) return "tat_Cyrl";
        if (label.toLowerCase().startsWith("анг")) return "en";
        return "ru";
    };

    const targetCode = langLabelToCode(targetLang);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50">
            <div className="w-full max-w-6xl px-6 py-4">
                <button onClick={() => navigate("/")} className="text-blue-600">← Назад</button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl px-6">
                <div className="flex-1 flex flex-col items-center">
                    <VideoPlayer
                        videoUrl={currentVideoUrl}
                        trimStart={trimStart}
                        trimEnd={trimEnd}
                        onTrimChange={(s, e) => { setTrimStart(s); setTrimEnd(e); }}
                        onTimeUpdate={(time) => {
                            const found = subs.find(s => time >= s.start && time <= s.end);
                            if (found) {
                                setCurrentSub(found);
                            } else {
                                setCurrentSub(null);
                            }
                        }}
                    />

                    <div className="w-4/4 mt-4 h-50">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/70 text-white px-4 py-3 rounded-lg text-sm shadow min-h-[56px]">
                                <div className="text-xs text-gray-300 mb-1">{sourceLang}</div>
                                <div>
                                    {currentSub
                                        ? (currentSub.text[langLabelToCode(sourceLang)] ||
                                            currentSub.text.ru ||
                                            currentSub.text.tt ||
                                            currentSub.text.ar ||
                                            "—")
                                        : "—"}
                                </div>
                            </div>

                            <div className="bg-black/70 text-green-200 px-4 py-3 rounded-lg text-sm shadow min-h-[56px]">
                                <div className="text-xs text-gray-300 mb-1">{targetLang}</div>
                                {currentSub ? (
                                    <textarea
                                        className="w-full h-40 bg-transparent resize-none focus:outline-none text-green-200"
                                        rows={2}
                                        value={currentSub.text[targetCode] || ""}
                                        onChange={(e) => {
                                            const newText = e.target.value;
                                            setSubs(prev =>
                                                prev.map(s =>
                                                    s.start === currentSub.start && s.end === currentSub.end
                                                        ? { ...s, text: { ...s.text, [targetCode]: newText } }
                                                        : s
                                                )
                                            );
                                            setCurrentSub(cs =>
                                                cs ? { ...cs, text: { ...cs.text, [targetCode]: newText } } : cs
                                            );
                                        }}
                                    />
                                ) : (
                                    <div>—</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full md:w-72">
                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow hover:shadow-lg hover:brightness-105"
                        onClick={handleTrimVideo}
                        disabled={isLoading}
                    >
                        {isLoading ? "Обрезаем..." : "Обрезать"}
                    </button>
                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:shadow-lg hover:brightness-105"
                        onClick={handleTranslateAndGoExport}
                        disabled={isTranslating}
                    >
                        {isTranslating ? "Переводим..." : "Перевести видео"}
                    </button>

                    {/* Кнопка "Экспорт" будет доступна только после успешного перевода */}
                    <button
                        className="px-6 py-3 rounded-lg bg-gray-400 text-white font-semibold shadow"
                        onClick={handleGoToExportPage}
                        disabled={!currentVideoUrl} // Отключаем, если URL не готов
                    >
                        Перейти к экспорту
                    </button>

                    {isSuccess && <div className="text-green-600 mt-2">✅ Видео успешно обрезано!</div>}
                    {isError && <div className="text-red-600 mt-2">❌ Ошибка: {JSON.stringify(error)}</div>}

                    {isTranslateSuccess && <div className="text-green-600 mt-2">✅ Видео успешно переведено!</div>}
                    {isTranslateError && <div className="text-red-600 mt-2">❌ Ошибка перевода: {JSON.stringify(translateError)}</div>}

                    <div className="border-t border-gray-200 my-2"/>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Громкость аудио ({audioVolume.toFixed(1)})</label>
                        <input type="range" min={0} max={1} step={0.1} value={audioVolume}
                               onChange={(e) => setAudioVolume(Number(e.target.value))}
                               className="w-full accent-green-500"/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Громкость дубляжа
                            ({tatarianVolume.toFixed(1)})</label>
                        <input type="range" min={0} max={1} step={0.1} value={tatarianVolume}
                               onChange={(e) => setTatarianVolume(Number(e.target.value))}
                               className="w-full accent-green-500"/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Спикеры</label>
                        <div className="flex gap-2">
                            {["Алмаз", "Алсу"].map((spLabel, index) => (
                                <button
                                    key={speakers[index]}
                                    onClick={() => setSpeaker(speakers[index])}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium border transition ${
                                        speaker === speakers[index]
                                            ? "bg-green-500 text-white border-green-600"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                    {spLabel}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Dropdown label="С какого языка" options={languages} value={sourceLang} onChange={setSourceLang}/>
                    <Dropdown label="На какой язык" options={languages} value={targetLang} onChange={setTargetLang}/>
                </div>
            </div>
        </div>
    );
}


function Dropdown({label, options, value, onChange}: {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">{label}</label>
            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button
                        className="w-full p-2 border-2 border-green-500 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400">
                        {value}
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 w-full rounded-md bg-white shadow-lg border border-green-400 z-10">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option}
                                value={option}
                                className={({ active, selected }) =>
                                    `cursor-pointer select-none p-2 ${active ? "bg-green-100 text-green-700" : selected ? "bg-green-50 text-green-600" : "text-gray-700"}`
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