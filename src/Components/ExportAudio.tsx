import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import { useSelector } from "react-redux"; // 👈 Импортируем useSelector
import { saveAs } from "file-saver";

// Импортируем файлы переводов
import ru from '../translations/ru.json';
import tat from '../translations/tat.json';
import {Document, Packer, Paragraph, TextRun} from "docx";

const translations = { ru, tat };

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);



const ExportFileTranslate = () => {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");

    const [subtitles, setSubtitles] = useState([]);

    useEffect(() => {
        const subtitlesDataString = localStorage.getItem("subtitlesData");
        if (subtitlesDataString) {
            setSubtitles(JSON.parse(subtitlesDataString));
        }
    }, []);

    // Получаем текущий язык из Redux и создаем функцию-переводчик
    const currentLanguage = useSelector(state => state.language.current);
    const t = (key) => translations[currentLanguage][key];

    const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(() => {
        let url = localStorage.getItem("currentAudio") || localStorage.getItem("originalAudio");

        if (url) {
            try {
                const parsed = JSON.parse(url);
                if (parsed && typeof parsed === "object" && parsed.audioUrl) {
                    url = parsed.audioUrl;
                }
            } catch (e) {
            }
        }
        return url;
    });

    const handleDownloadSubtitles = async () => {
        if (subtitles.length === 0) {
            setAlertMessage(t('subs_not_found_alert'));
            setTimeout(() => setAlertMessage(""), 3000);
            return;
        }

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: subtitles.map((sub, index) => {
                        const timeRange = `[${sub.start.toFixed(2)} - ${sub.end.toFixed(2)}]`;
                        const lines = [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: `${index + 1}. ${timeRange}`, bold: true }),
                                ],
                            }),
                        ];

                        Object.entries(sub.text).forEach(([lang, value]) => {
                            if (value) {
                                lines.push(
                                    new Paragraph({
                                        children: [new TextRun({ text: `${lang}: ${value}` })],
                                    })
                                );
                            }
                        });
                        return lines;
                    }).flat(),
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, "subtitles.docx");
    };

    const handleExportAudio = () => {
        if (!currentAudioUrl) {
            alert(t('video_not_found_alert'));
            return;
        }

        // создаём временную ссылку для скачивания
        const link = document.createElement("a");
        link.href = currentAudioUrl;

        // имя файла (можно задать любое)
        link.download = "audio.mp3";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = () => {
        if (currentAudioUrl) {
            navigator.clipboard.writeText(currentAudioUrl).then(() => {
                setAlertMessage(t('link_copied_alert'));
                setTimeout(() => setAlertMessage(""), 3000); // Уведомление исчезнет через 3 секунды
            }).catch(err => {
                console.error("Не удалось скопировать ссылку:", err);
                setAlertMessage(t('copy_error_alert'));
                setTimeout(() => setAlertMessage(""), 3000); // Уведомление исчезнет через 3 секунды
            });
        }
    };

    return (
        <div className="h-full flex flex-col items-center bg-gray-50 mt-5">
            <div className="w-full max-w-6xl mb-8">
                <div className="w-full max-w-6xl px-6 py-4">
                    <button
                        onClick={() => navigate("/edit")}
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
                </div>

                <div className="flex justify-center items-center gap-4 mb-20">
                    <button
                        onClick={handleExportAudio}
                        className="flex items-center px-10 py-5 rounded-2xl bg-gradient-to-r bg-green-600 text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:brightness-110 transition"
                    >
                        <DownloadIcon/>
                        {t('audioDownload')}
                    </button>
                    <div className="flex justify-center items-center gap-4 mt-30 mb-20">
                        <button
                            onClick={handleDownloadSubtitles}
                            className="flex items-center px-10 py-5 mb-10 rounded-2xl bg-white text-green-500 font-bold text-lg shadow-lg hover:shadow-2xl hover:bg-gray-100 transition"
                        >
                            <DownloadIcon/>
                            {t('download_subs_btn')}
                        </button>
                    </div>
                    <button
                        onClick={handleShare}
                        className="mt-6 "
                        aria-label="Поделиться"
                    >
                        <img src="./../../public/share.png"/>
                    </button>
                </div>
            </div>

            <div
                className="w-full max-w-4xl p-12 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 text-lg">
                {t('ad_placeholder')}
            </div>

            {/* Всплывающее уведомление */}
            {alertMessage && (
                <div
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl z-50">
                    {alertMessage}
                </div>
            )}
        </div>
    );
};

export default ExportFileTranslate;