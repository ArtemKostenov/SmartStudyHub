import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3x1 font-extrabold text-gray-900">
                        {isLogin ? 'Вход в аккаунт' : 'Создание аккаунта'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Smart Study Hub
                    </p>
                </div>

                {isLogin ? <LoginForm /> : <RegisterForm />}

                <div className="text-center mt-4">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
                    >
                        {isLogin
                            ? 'Нет аккаунта? Зарегистрируйтесь'
                            : 'Уже есть аккаунт? Войдите'}
                    </button>
                </div>
            </div>
        </div>
    );
};