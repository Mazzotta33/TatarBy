import {Link, useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/upload");
    };


    return (
        <div className="flex flex-col items-center justify-center mt-20">
            <form
                onSubmit={handleSubmit}
                className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-md p-8 flex flex-col gap-5 border border-white/40">
                <h2 className="text-3xl font-bold text-gray-600 text-center mb-2">Вход</h2>

                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email" id="email" placeholder="example@email.com"
                        className="rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password" id="password" placeholder="Введите ваш пароль"
                        className="rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-3 rounded-2xl font-medium text-lg shadow-md hover:bg-green-600 transition-all"
                >
                    Войти →
                </button>

                <p className="text-center text-sm text-gray-500">
                    Нет аккаунта?
                    <Link to="/" className="text-green-500 hover:underline ml-2">
                        Регистрация
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login;