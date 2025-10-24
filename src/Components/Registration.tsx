import { Link, useNavigate } from "react-router-dom";
import {useRegisterUserMutation} from "../Redux/api/registerApi.ts";
import {useState} from "react";

const Registration = () => {
    const navigate = useNavigate();

    const [register, {isLoading, isError, error}] = useRegisterUserMutation();

    const [formData, setFormData] = useState(
        {
            username: "",
            email: "",
            company: "",
            password: "",
            confirmPassword: ""
        }
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleRegister = async(e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password
        };

        try {
            await register(payload).unwrap();
            navigate("/login");
        }catch (err: any){
            console.error("Ошибка регистрации:", err);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center mt-20">
            <form
                onSubmit={handleRegister}
                className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-md p-8 flex flex-col gap-5 border border-white/40"
            >
                <h2 className="text-3xl font-bold text-gray-600 text-center mb-2">
                    Регистрация
                </h2>

                <div className="flex flex-col">
                    <label htmlFor="username" className="text-gray-600 mb-1 text-sm">
                        Имя
                    </label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Разиль"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="Email" className="text-gray-600 mb-1 text-sm">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="example@mail.ru"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="company" className="text-gray-600 mb-1 text-sm">
                        Компания
                    </label>
                    <input
                        type="text"
                        id="company"
                        placeholder="Название"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="text-gray-600 mb-1 text-sm">
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Создайте пароль"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={8}
                        required
                        className="rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="text-gray-600 mb-1 text-sm">
                        Подтвердите пароль
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Повторите пароль"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                </div>

                {isError && (
                    <p className="text-red-500 text-sm text-center">
                        {(error as any)?.data?.message || "Ошибка при регистрации"}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white py-3 rounded-2xl font-medium text-lg shadow-md hover:bg-green-600 transition-all"
                >
                    {isLoading ? "Регистрация..." : "Создать аккаунт →"}
                </button>

                <p className="text-center text-sm text-gray-500">
                    Уже есть аккаунт?{" "}
                    <Link to="/login" className="text-green-500 hover:underline">
                        Войдите
                    </Link>
                </p>

                <img
                    src="/tatar.png"
                    alt="Mascot"
                    className="absolute bottom-0 left-140 w-48 select-none"
                />

                <div
                    className="absolute bottom-54 left-130 bg-emerald-100 text-emerald-700 font-medium px-4 py-2 rounded-xl shadow-sm">
                    Рәхим итегез!
                </div>
            </form>
        </div>
    );
};

export default Registration;
