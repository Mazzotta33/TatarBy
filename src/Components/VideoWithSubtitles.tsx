import {useNavigate} from "react-router-dom";
import {useState} from "react";
import VideoPlayer from "./VideoPlayer.tsx";
import {useMakeSubsMutation, useVideoCutMutation} from "../Redux/api/videoApi.ts";

const subtitles = [];

const VideoWithSubtitles = () => {
    const navigate = useNavigate();
    const [makeSubs, { isLoading: isMakingSubs, isSuccess: isMakeSubsSuccess, isError: isMakeSubsError, error: makeSubsError }] = useMakeSubsMutation();

    const [videoCut, { isLoading, isSuccess, isError, error }] = useVideoCutMutation();

    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(
        localStorage.getItem("currentVideo") || localStorage.getItem("originalVideo")
    );

    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    const [audioVolume, setAudioVolume] = useState(1);
    const [tatarianVolume, setTatarianVolume] = useState(1);

    const speakers = ["Алмаз", "Алсу"];
    const [speaker, setSpeaker] = useState(speakers[0]);

    const languages = ["Русский", "Татарский", "Английский"];
    const [sourceLang, setSourceLang] = useState(languages[0]);
    const [targetLang, setTargetLang] = useState(languages[1]);

    const [subs, setSubs] = useState(subtitles);
    const [currentSub, setCurrentSub] = useState<null | { start: number; end: number; text: Record<string,string>; lang?: string }>(null);

    const handleTrimVideo = async () => {
        const videoUrl = localStorage.getItem("originalVideo");
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

    const handleMakeSubs = async () => {
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
            const response = await makeSubs({
                videoUrl,
                subtitlesList: subsListForBackend,
            }).unwrap();

            setCurrentVideoUrl(response.videoUrl);
            localStorage.setItem("currentVideo", response);

            // Преобразуем полученные субтитры обратно в формат для фронтенда
            const formattedSubs = response.subtitlesList.map(sub => {
                const textObject = {
                    "rus_Lath": sub.text, // Использование text_rus из ответа
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
            console.log("Субтитры успешно созданы:", response);

        } catch (err) {
            console.error("Ошибка при создании субтитров:", err);
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
                        onClick={handleMakeSubs}
                        disabled={isMakingSubs}
                    >
                        {isMakingSubs ? "Создаём субтитры..." : "Создать субтитры"}
                    </button>

                    {isMakeSubsSuccess && <div className="text-green-600 mt-2">✅ Субтитры успешно созданы!</div>}
                    {isMakeSubsError && <div className="text-red-600 mt-2">❌ Ошибка: {JSON.stringify(makeSubsError)}</div>}

                    <div className="border-t border-gray-200 my-2"/>
                </div>
            </div>
        </div>
    );
}


export default VideoWithSubtitles;