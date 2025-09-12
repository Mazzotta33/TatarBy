import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

// Icons for the cards
const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mb-4">
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
);

const SubtitlesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mb-4">
        <path d="M12 19c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" />
        <path d="M12 19c-1.88 0-3.61-.95-4.66-2.52" />
        <path d="M12 5c1.88 0 3.61.95 4.66 2.52" />
        <path d="M12 13v-2" />
    </svg>
);


const UploadFile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const fileInputRefSubtitles = useRef<HTMLInputElement | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, targetPath: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setProgress(0);

        localStorage.setItem("uploadedVideo", URL.createObjectURL(file));

        let fakeProgress = 0;
        const interval = setInterval(() => {
            fakeProgress += 10;
            setProgress(fakeProgress);

            if (fakeProgress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setLoading(false);
                    navigate(targetPath);
                }, 300);
            }
        }, 200);
    };

    const handleVideoTranslate = () => {
        fileInputRef.current?.click();
    };

    const handleSubtitlesCreate = () => {
        fileInputRefSubtitles.current?.click();
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
                {!loading ? (
                    <>
                        <div className="flex-1 bg-white p-8 rounded-xl shadow-lg mt-30 flex flex-col items-center border border-gray-200">
                            <VideoIcon />
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Перевести видео на татарский язык</h2>
                            <ul className="text-left text-sm text-gray-600 space-y-2 mb-8 w-full">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">•</span>
                                    Распознавание речи
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">•</span>
                                    Автоматический перевод на татарский
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">•</span>
                                    Создание субтитров
                                </li>
                            </ul>
                            <input
                                type="file"
                                accept="video/*"
                                ref={fileInputRef}
                                onChange={(e) => handleFileChange(e, './edit')}
                                className="hidden"
                            />
                            <button
                                onClick={handleVideoTranslate}
                                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r  from-green-500 to-emerald-600 text-white font-semibold shadow hover:shadow-lg hover:brightness-105 transition mt-auto"
                            >
                                Перевести видео
                            </button>
                        </div>

                        {/* Карточка 2: Создание субтитров */}
                        <div className="flex-1 bg-white p-8 rounded-xl shadow-lg flex flex-col mt-30 items-center border border-gray-200">
                            <SubtitlesIcon />
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Создать субтитры на татарском языке</h2>
                            <ul className="text-left text-sm text-gray-600 space-y-2 mb-8 w-full">
                                <li className="flex items-center">
                                    <span className="text-blue-500 mr-2">•</span>
                                    Субтитры на татарском языке
                                </li>
                                <li className="flex items-center">
                                    <span className="text-blue-500 mr-2">•</span>
                                    Генерация сводки по видео
                                </li>
                                <li className="flex items-center">
                                    <span className="text-blue-500 mr-2">•</span>
                                    Полная транскрипция видео
                                </li>
                            </ul>
                            <input
                                type="file"
                                accept="video/*"
                                ref={fileInputRefSubtitles}
                                onChange={(e) => handleFileChange(e, './editSub')}
                                className="hidden"
                            />
                            <button
                                onClick={handleSubtitlesCreate}
                                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-sky-600 text-white font-semibold shadow hover:shadow-lg hover:brightness-105 transition mt-auto"
                            >
                                Создать субтитры
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-16 rounded-xl shadow-md text-center w-full max-w-lg border border-gray-200">
                        <div className="p-4">
                            <h2 className="text-xl font-medium text-gray-600 mb-3">Загрузка файла...</h2>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-green-500 h-3 transition-all duration-200"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">{progress}%</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadFile;
