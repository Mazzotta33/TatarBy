import React from "react";

const ExportFile = () => {
    const handleExportVideo = () => {
        console.log("Экспорт видео...");
        // здесь можно вызвать API или скачать файл
    };

    const handleExportSubtitles = () => {
        console.log("Экспорт субтитров...");
        // тут аналогично
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col gap-8">
                <button
                    onClick={handleExportVideo}
                    className="px-10 py-6 text-2xl rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-2xl hover:brightness-110 transition"
                >
                    Экспорт видео
                </button>

                <button
                    onClick={handleExportSubtitles}
                    className="px-10 py-6 text-2xl rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:shadow-2xl hover:brightness-110 transition"
                >
                    Экспорт субтитров
                </button>
            </div>
        </div>
    );
};

export default ExportFile;
