import React from "react";
import { useNavigate } from "react-router-dom";

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const ExportFileTranslate = () => {
    const navigate = useNavigate();

    const handleDownloadVideo = () => {
        console.log("Скачивание переведенного видео...");
        // Здесь будет логика для скачивания файла
        alert("Скачивание началось!");
    };

    return (
        <div className="h-full flex flex-col items-center bg-gray-50">
            <div className="w-full max-w-6xl mb-8">
                <div className="w-full max-w-6xl px-6 py-4">
                    <button onClick={() => navigate("/edit")} className="text-blue-600">← Назад</button>
                </div>

                <div className="flex justify-center items-center gap-4 mt-50 mb-20">
                    <button
                        onClick={handleDownloadVideo}
                        className="flex items-center px-10 py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:brightness-110 transition"
                    >
                        <DownloadIcon />
                        Скачать переведенное видео
                    </button>
                </div>
            </div>

            <div className="w-full max-w-4xl p-12 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 text-lg">
                Место для вашей рекламы
            </div>
        </div>
    );
};

export default ExportFileTranslate;