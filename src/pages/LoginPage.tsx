import {LibraryBig, Eye, EyeOff} from "lucide-react";
import {useNavigate} from "react-router";
import React, {useState} from "react";
import {login, storeToken} from "@/services/login.ts";
import {useInputChange} from "@/services/hooks/useInputChange.ts";

interface LoginFormData {
    username: string;
    password: string;
}

interface FormErrors {
    username?: string;
    password?: string;
    submit?: string;
}

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginFormData>({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = useInputChange(setFormData, errors, setErrors);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrors(prev => ({
            ...prev,
            submit: undefined
        }));

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const loginData = {
                username: formData.username,
                password: formData.password
            };

            const response = await login(loginData);

            // Store auth token if your backend returns one
            storeToken(response.token);

            navigate("/books");
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                submit: error instanceof Error ? error.message : "Login failed. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    }
    const onSwitchToSignup = () => {
        navigate("/signup");
    }

    return (
        <>
            <div
                className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-blue-100
                    flex items-center justify-center p-4 sm:p-4 md:p-6  lg:p-8">

                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <LibraryBig className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-slate-600" />
                        </div>
                        <span className="text-slate-600 font-semibold text-lg sm:text-xl lg:text-2xl">Library</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8
                        lg:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                        <p className="text-sm sm:text-base text-gray-600">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className={`w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-5 lg:py-4 border rounded-lg 
                                        focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all 
                                        duration-200 placeholder-gray-400 text-sm sm:text-base ${
                                    errors?.username ? "border-red-300" : "border-gray-300"
                                }`}
                            />
                            {errors?.username && <p className="text-red-800 text-xs sm:text-sm mt-1">{errors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-5 lg:py-4 pr-10 sm:pr-12 border rounded-lg 
                                            focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200
                                             placeholder-gray-400 text-sm sm:text-base ${
                                        errors?.password ? "border-red-300" : "border-gray-300"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </button>
                            </div>
                            {errors?.password && <p className="text-red-800 text-xs sm:text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex justify-end">
                            <button type="button"
                                    className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 transition-colors">
                                Forgot password?
                            </button>
                        </div>

                        {errors?.submit && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {errors.submit}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-slate-500 to-blue-500
                                 hover:cursor-pointer text-white py-2 sm:py-3 lg:py-4 px-4 rounded-lg font-semibold
                                 hover:from-slate-700 hover:to-blue-700 transform hover:scale-[1.02]
                                 transition-all duration-200 shadow-lg text-sm sm:text-base lg:text-lg"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-gray-600">
                            {"Don't have an account? "}
                            <button
                                onClick={onSwitchToSignup}
                                className="text-blue-500  hover:text-blue-700
                                     hover:cursor-pointer font-semibold transition-colors"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;