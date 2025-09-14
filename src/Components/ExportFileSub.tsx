import { useNavigate } from "react-router-dom";
import {useState, useEffect} from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux"; // 👈 Импортируем useSelector

// Импортируем файлы переводов
import ru from '../translations/ru.json';
import tat from '../translations/tat.json';

const translations = { ru, tat };


const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
);

const ExportFileSub = () => {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");
    const [subtitles, setSubtitles] = useState([]);

    const videoUrl = localStorage.getItem("currentVideo");

    // Получаем текущий язык из Redux
    const currentLanguage = useSelector(state => state.language.current);
    const t = (key) => translations[currentLanguage][key];

    useEffect(() => {
        const subtitlesDataString = localStorage.getItem("subtitlesData");
        if (subtitlesDataString) {
            setSubtitles(JSON.parse(subtitlesDataString));
        }
    }, []);

    const handleExportVideo = () => {
        if (!videoUrl) {
            setAlertMessage(t('video_not_found_alert'));
            setTimeout(() => setAlertMessage(""), 3000);
            return;
        }
        const link = document.createElement("a");
        link.href = videoUrl;
        link.download = "video.mp4";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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

    const handleShare = () => {
        if (videoUrl) {
            navigator.clipboard.writeText(videoUrl).then(() => {
                setAlertMessage(t('link_copied_alert'));
                setTimeout(() => setAlertMessage(""), 3000);
            }).catch(err => {
                console.error("Не удалось скопировать ссылку:", err);
                setAlertMessage(t('copy_error_alert'));
                setTimeout(() => setAlertMessage(""), 3000);
            });
        }
    };

    return (
        <div className="h-full flex flex-col items-center bg-gray-50 mt-5">
            <div className="w-full max-w-6xl mb-8">
                <button
                    onClick={() => navigate("/editSub")}
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

                <div className="flex flex-row justify-center gap-10">
                    <div className="flex justify-center items-center gap-4 mt-30 mb-20">
                        <button
                            onClick={handleExportVideo}
                            className="flex items-center px-10 py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:brightness-110 transition"
                        >
                            <DownloadIcon/>
                            {t('download_video_btn')}
                        </button>
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-30 mb-20">
                        <button
                            onClick={handleDownloadSubtitles}
                            className="flex items-center px-10 py-5 rounded-2xl bg-white text-green-500 font-bold text-lg shadow-lg hover:shadow-2xl hover:bg-gray-100 transition"
                        >
                            <DownloadIcon/>
                            {t('download_subs_btn')}
                        </button>
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <button
                        onClick={handleShare}
                        className="p-4 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
                        aria-label={t('share_btn')}
                    >
                        <ShareIcon/>
                    </button>
                </div>
            </div>

            <div
                className="w-full max-w-4xl p-12 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 text-lg">
                {t('ad_placeholder')}
            </div>

            {alertMessage && (
                <div
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl z-50">
                    {alertMessage}
                </div>
            )}
        </div>
    );
};

export default ExportFileSub;