//import {Link} from "react-router";
import {z} from "zod";
import React, {useState} from "react";
import {useNavigate} from "react-router";
import {LibraryBig, Eye, EyeOff} from "lucide-react";
import {register} from "@/services/register.ts";
import {useInputChange} from "@/services/hooks/useInputChange.ts";

const formSchema = z.object({
    username: z.string().trim().nonempty("Username is required."),
    email: z
        .string()
        .trim()
        .nonempty("Email is required.")
        .email("Email is invalid."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(32, "Password must be no more than 32 characters")
        .regex(/[a-z]/, "Password must include at least one lowercase letter")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[0-9]/, "Password must include at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must include at least one special character"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

type FormErrors = {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    submit?: string;
};

const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const RegisterPage = () => {
    const navigate = useNavigate();

    const onSwitchToLogin = () => {
        navigate("/login");
    }

    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = useInputChange(setValues, errors, setErrors);

    const validateForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as keyof FormValues;
                newErrors[fieldName] = issue.message;
            });
            setErrors(newErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrors(prev => ({
            ...prev,
            submit: undefined
        }));

        const isValid = validateForm();
        if (!isValid) return;

        setIsLoading(true);

        try {
            const userData = {
                email: values.email,
                username: values.username,
                password: values.password,
            };
            await register(userData);
            alert("Registration successful!");
            navigate("/login");
        } catch (error) {
            setErrors({
                submit: error instanceof Error ? error.message : "Registration failed. Please try again."
            });
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <>
            <div
                className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-blue-100
                        flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <LibraryBig className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-slate-600"/>
                        </div>
                        <span className="text-slate-600 font-semibold text-sm sm:text-lg md:text-2xl">Library</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6
                        md:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                    <div className="ext-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Create Account</h1>
                        <p className="text-sm sm:text-base text-gray-600">Join us today</p>
                    </div>

                    {errors?.submit && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-2 text-sm sm:text-base">
                            {errors.submit}
                        </div>
                    )}

                    <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={values.username}
                                onChange={handleInputChange}
                                placeholder="Choose a username"
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg
                                        focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all 
                                        duration-200 placeholder-gray-400 ${
                                    errors?.username ? "border-red-300" : "border-gray-300"
                                }`}
                            />
                            {errors?.username && (<p className="text-red-800">{errors.username}</p>)}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border 
                                        rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent 
                                        transition-all duration-200 placeholder-gray-400 ${
                                    errors?.email ? "border-red-300" : "border-gray-300"
                                }`}
                            />
                            {errors?.email && <p className="text-red-800 text-xs sm:text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={values.password}
                                    onChange={handleInputChange}
                                    placeholder="Create a password"
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg 
                                         focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all 
                                            duration-200 placeholder-gray-400 ${
                                        errors?.password ? "border-red-300" : "border-gray-300"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} className="sm:w-5 sm:h-5" />
                                    ) : (
                                        <Eye size={16} className="sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            </div>
                            {errors?.password && <p className="text-red-800 text-xs sm:text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={values.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg
                                            focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
                                            duration-200 placeholder-gray-400 ${
                                        errors?.confirmPassword ? "border-red-300" : "border-gray-300"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={16} className="sm:w-5 sm:h-5" />
                                    ) : (
                                        <Eye size={16} className="sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            </div>
                            {errors?.confirmPassword && (
                                <p className="text-red-800 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-slate-500 to-blue-500 hover:cursor-pointer
                                    text-white py-2 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base
                                    hover:from-slate-700 hover:to-blue-700 transform hover:scale-[1.02]
                                     transition-all duration-200 shadow-lg"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-gray-600 text-sm sm:text-base">
                            Already have an account?{" "}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-blue-500 hover:text-blue-700
                                        hover:cursor-pointer font-semibold transition-colors"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );

}

export default RegisterPage;