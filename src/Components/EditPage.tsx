import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { useTranslateVideoMutation, useVideoCutMutation } from "../Redux/api/videoApi.ts";
import { useSelector } from "react-redux"; // 👈 Импортируем useSelector

// Импортируем файлы переводов
import ru from '../translations/ru.json';
import tat from '../translations/tat.json';
import Dropdown from "./Dropdown.tsx";

const translations = { ru, tat };

// Удален начальный массив subtitles, так как он будет приходить с бэкенда
const subtitles = [];

export default function EditPage() {
    const navigate = useNavigate();

    const [translateVideo, { isLoading: isTranslating, isSuccess: isTranslateSuccess, isError: isTranslateError, error: translateError }] = useTranslateVideoMutation();
    const [videoCut, { isLoading, isSuccess, isError, error }] = useVideoCutMutation();

    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(
        localStorage.getItem("currentVideo") || localStorage.getItem("originalVideo")
    );

    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    const [audioVolume, setAudioVolume] = useState(1);
    const [tatarianVolume, setTatarianVolume] = useState(1);

    const speakers = ["almaz", "alsu"];
    const [speaker, setSpeaker] = useState(speakers[0]);

    const languages = [translations.ru.languages.russian, translations.ru.languages.tatar, translations.ru.languages.english];
    const [sourceLang, setSourceLang] = useState(languages[0]);
    const [targetLang, setTargetLang] = useState(languages[1]);

    const [subs, setSubs] = useState(subtitles);
    const [currentSub, setCurrentSub] = useState<null | { start: number; end: number; text: Record<string,string>; lang?: string }>(null);

    // Получаем текущий язык из Redux
    const currentLanguage = useSelector(state => state.language.current);
    const t = (key) => translations[currentLanguage][key];

    // Обновляем список языков и их отображение в зависимости от выбранного языка
    const translatedLanguages = [t('languages.russian'), t('languages.tatar'), t('languages.english')];

    const handleTranslateAndGoExport = async () => {
        const videoUrl = localStorage.getItem("originalVideo");
        if (!videoUrl) {
            console.error("URL видео не найден в localStorage.");
            return;
        }

        const subsListForBackend = subs.length > 0 ? subs.map(sub => ({
            start: sub.start,
            end: sub.end,
            text: sub.text.rus_Lath,
            text_tat: sub.text.tat_Cyrl,
            language: sub.lang,
        })) : null;

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

            setCurrentVideoUrl(response.videoUrl);
            localStorage.setItem("currentVideo", response.videoUrl);

            console.log("Видео успешно обрезано:", response.videoUrl);
            console.log("Видео успешно обрезано:", response);
            console.log("Данные субтитров, полученные от бэкенда:", response.subtitlesList);

            const formattedSubs = response.subtitlesList.map(sub => {
                const textObject = {
                    "rus_Lath": sub.text,
                    "tat_Cyrl": sub.text_tat
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
        } catch (err) {
            console.error("Ошибка при переводе видео:", err);
        }
    };

    const handleGoToExportPage = () => {
        if (currentVideoUrl) {
            localStorage.setItem("subtitlesData", JSON.stringify(subs));
            localStorage.setItem("currentVideo", currentVideoUrl);
            navigate("/exportTranslate");
        } else {
            console.error("Переведенное видео еще не готово.");
        }
    };

    const handleTrimVideo = async () => {
        const videoUrl = localStorage.getItem("currentVideo");
        if (!videoUrl) {
            console.error("URL видео не найден в localStorage.");
            return;
        }

        try {
            const response  = await videoCut({ // Здесь 'response' переименован в 'videoUrl'
                videoUrl,
                startSeconds: trimStart,
                endSeconds: trimEnd,
            }).unwrap();

            setCurrentVideoUrl(response.videoUrl); // Теперь используем саму строку, без .videoUrl
            localStorage.setItem("currentVideo", response.videoUrl);
            localStorage.setItem("originalVideo", response.videoUrl);

            console.log("Видео успешно обрезано:", response);
            console.log("Видео успешно обрезано:", response.videoUrl);
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
        <div className="min-h-screen flex flex-col items-center bg-gray-50 mt-5">
            <div className="w-full max-w-6xl px-6 py-4 flex justify-between items-center">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    <span>{t('back')}</span>
                </button>
                <button
                    onClick={handleGoToExportPage}
                    disabled={!currentVideoUrl}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span>{t('export')}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl px-6">
                <div className="flex-1 flex flex-col items-center">
                    <VideoPlayer
                        videoUrl={currentVideoUrl}
                        trimStart={trimStart}
                        trimEnd={trimEnd}
                        onTrimChange={(s, e) => {
                            setTrimStart(s);
                            setTrimEnd(e);
                        }}
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
                            <div className="bg-white text-black px-4 py-3 rounded-lg text-sm shadow min-h-[56px]">
                                <div className="text-xl text-black mb-1">{t('lang_from')}</div>
                                <div className="border-t border-gray-400 my-2"></div>
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

                            <div className="bg-white text-black px-4 py-3 rounded-lg text-sm shadow min-h-[56px]">
                                <div className="text-xl text-black mb-1">{t('lang_to')}</div>
                                <div className="border-t border-gray-400 my-2"></div>
                                {currentSub ? (
                                    <textarea
                                        className="w-full h-40 bg-transparent resize-none focus:outline-none text-black"
                                        rows={2}
                                        value={currentSub.text[targetCode] || ""}
                                        onChange={(e) => {
                                            const newText = e.target.value;
                                            setSubs(prev =>
                                                prev.map(s =>
                                                    s.start === currentSub.start && s.end === currentSub.end
                                                        ? {...s, text: {...s.text, [targetCode]: newText}}
                                                        : s
                                                )
                                            );
                                            setCurrentSub(cs =>
                                                cs ? {...cs, text: {...cs.text, [targetCode]: newText}} : cs
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

                <div className="flex flex-col gap-4 w-full md:w-72 relative">
                    <button
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:shadow-lg hover:brightness-105"
                        onClick={handleTranslateAndGoExport}
                        disabled={isTranslating}
                    >
                        {isTranslating ? t('translating_video_btn') : t('translate_video_btn')}
                    </button>
                    <button
                        className="px-6 py-3 rounded-lg bg-green-500 text-white font-semibold shadow hover:shadow-lg hover:brightness-105"
                        onClick={handleTrimVideo}
                        disabled={isLoading}
                    >
                        {isLoading ? t('trimming_video_btn') : t('trim_video_btn')}
                    </button>


                    {isSuccess && <div className="text-green-600 mt-2">{t('video_trimmed_success')}</div>}
                    {isError && <div className="text-red-600 mt-2">{t('trim_error')} {JSON.stringify(error)}</div>}

                    {isTranslateSuccess && <div className="text-green-600 mt-2">{t('video_translated_success')}</div>}
                    {isTranslateError &&
                        <div className="text-red-600 mt-2">{t('translate_error')} {JSON.stringify(translateError)}</div>}

                    <div className="border-t border-gray-200 my-2"/>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-700">{t('video_volume')}</label>
                            <span className="text-sm text-gray-700">{Math.round(audioVolume * 100)}%</span>
                        </div>
                        <input type="range" min={0} max={100} step={1} value={audioVolume * 100}
                               onChange={(e) => setAudioVolume(Number(e.target.value) / 100)}
                               className="w-full accent-green-500 rounded-lg h-2 shadow-md focus:outline-green-500"/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-700">{t('dubbing_volume')}</label>
                            <span className="text-sm text-gray-700">{Math.round(tatarianVolume * 100)}%</span>
                        </div>
                        <input type="range" min={0} max={100} step={1} value={tatarianVolume * 100}
                               onChange={(e) => setTatarianVolume(Number(e.target.value) / 100)}
                               className="w-full accent-green-500 rounded-lg h-2 shadow-md focus:outline-green-500"/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">{t('speakers')}</label>
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

                    <Dropdown label={t('from_language')} options={translatedLanguages} value={sourceLang} onChange={setSourceLang}/>
                    <Dropdown label={t('to_language')} options={translatedLanguages} value={targetLang} onChange={setTargetLang}/>
                </div>
            </div>
        </div>
    );
}
