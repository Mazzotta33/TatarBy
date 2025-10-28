import {Link, useNavigate} from "react-router-dom";
import {useLoginUserMutation} from "../Redux/api/registerApi.ts";
import {useState} from "react";
import {setToken} from "../Redux/slices/authSlice.ts";
import {useDispatch} from "react-redux";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await loginUser({
                email: formData.email,
                password: formData.password
            }).unwrap();
            dispatch(setToken(result.access_token));

            console.log("Успешный вход:", result);
            navigate("/upload");
        }catch (err: any){
            console.error("Ошибка входа:", err);
        }
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
                        type="email"
                        id="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Введите ваш пароль"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="rounded-xl border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                </div>

                {isError && (
                    <p className="text-red-500 text-sm text-center">
                        {(error as any)?.data?.detail || "Ошибка входа"}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white py-3 rounded-2xl font-medium text-lg shadow-md hover:bg-green-600 transition-all"
                >
                    {isLoading ? "Вход..." : "Войти →"}
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