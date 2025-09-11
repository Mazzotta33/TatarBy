import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

const UploadFile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                    navigate("/edit");
                }, 300);
            }
        }, 200);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-green-600 mb-6">TatTranslate</h1>

            <div className="bg-white p-16 rounded-xl shadow-md text-center w-100">
                {!loading ? (
                    <>
                        <p className="mb-4">Загрузите видеофайл</p>

                        <input
                            type="file"
                            accept="video/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <button
                            onClick={handleButtonClick}
                            className="px-12 py-5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600
                                       text-white font-semibold shadow hover:shadow-lg hover:brightness-105
                                       transition"
                        >
                            Загрузить видео
                        </button>
                    </>
                ) : (
                    <div>
                        <p className="mb-3 text-gray-600">Загрузка файла...</p>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-green-500 h-3 transition-all duration-200"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{progress}%</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadFile;
