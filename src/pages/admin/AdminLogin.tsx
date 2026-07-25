import { useState } from "react";
import { useNavigate } from "react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useLoginMutation } from "../../store/api/authApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setToken } from "../../store/slices/authSlice";

const AdminLogin = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "faculty">("admin");
  const [loginMutation, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await loginMutation({ email, password }).unwrap();
      const userRole = response.data.user.role;
      const expectedRole = role.toUpperCase();
      if (
        userRole !== expectedRole &&
        !(role === "admin" && userRole === "SUPER_ADMIN")
      ) {
        throw new Error("You are not authorized to login as " + role);
      }
      dispatch(setToken(response.data.token));
      toast.success("Login successful");
      navigator("/admin/dashboard");
    } catch (error) {
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage = err?.data?.message || err?.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-primary-700 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Admin Portal
          </h1>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Secure access for faculty management and administrative functions
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-100 text-primary-800 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.352-.035-.696-.1-1.028A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Log in to your account
            </h2>

            {/* Role selector pills */}
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 rounded-full p-1 relative">
                {["admin", "faculty"].map((r) => (
                  <button
                    key={r}
                    className={`relative px-6 py-2 rounded-full cursor-pointer transition-colors duration-200 z-10 text-sm font-medium ${
                      role === r
                        ? "text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setRole(r as "admin" | "faculty")}
                  >
                    {role === r && (
                      <motion.div
                        layoutId="active-role"
                        className="absolute inset-0 bg-primary-600 rounded-full shadow-sm"
                        transition={{
                          type: "spring",
                          duration: 0.5,
                          bounce: 0.2,
                        }}
                      />
                    )}
                    <span className="relative z-10 capitalize">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="admin@college.edu"
                />
              </div>

              <div className="mb-4 relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-indigo-700 hover:from-primary-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Need technical support?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="/admin/support"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Contact IT Department
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Security notice */}
        <div className="max-w-md mx-auto mt-8 text-center text-sm text-gray-500">
          <p>
            This is a secure portal for authorized administrators only. All
            login attempts are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
