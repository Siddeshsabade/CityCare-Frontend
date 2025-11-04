// import React, { useState } from "react";
// import { FileText } from "lucide-react";
// import API_ENDPOINTS from "../config/api";

// export default function Login({ onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [success, setSuccess] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const res = await fetch(API_ENDPOINTS.USERS_ALL);
//       const users = await res.json();

//       const user = users.find(
//         (u) =>
//           u.email.toLowerCase() === email.toLowerCase() &&
//           u.password === password
//       );

//       if (user) {
//         localStorage.setItem("userId", user.id);
//         localStorage.setItem("userEmail", user.email);
//         localStorage.setItem("userRole", user.role);
//         onLogin(user);
//       } else {
//         setError("Invalid email or password!");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to connect to server!");
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const newUser = { email, password, role: "CITIZEN" };
//       const res = await fetch(API_ENDPOINTS.USERS_CREATE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newUser),
//       });

//       if (res.ok) {
//         setSuccess("✅ Registration successful! You can now log in.");
//         setIsRegistering(false);
//         setEmail("");
//         setPassword("");
//       } else {
//         setError("Failed to register. Email might already be in use.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server error while registering!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/50">
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mb-3 shadow-lg">
//               <FileText className="w-6 h-6 text-white" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-1">CityCare</h2>
//             <p className="text-sm text-gray-600">
//               {isRegistering ? "Join us and make your city better!" : "Because Every Citizen Counts"}
//             </p>
//           </div>

//           <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
//               <input
//                 type="email"
//                 className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
//               <input
//                 type="password"
//                 className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
//                 {error}
//               </div>
//             )}

//             {success && (
//               <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs">
//                 {success}
//               </div>
//             )}

//             <button
//               type="submit"
//               className={`w-full py-2.5 rounded-lg text-white text-sm font-semibold shadow-md transition-all hover:shadow-lg ${
//                 isRegistering
//                   ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//                   : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
//               }`}
//             >
//               {isRegistering ? "Create Account" : "Sign In"}
//             </button>
//           </form>

//           <p className="mt-5 text-center text-xs text-gray-600">
//             {isRegistering ? "Already have an account? " : "Don't have an account? "}
//             <button
//               onClick={() => {
//                 setIsRegistering(!isRegistering);
//                 setError("");
//                 setSuccess("");
//               }}
//               className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
//             >
//               {isRegistering ? "Sign In" : "Sign Up"}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { FileText } from "lucide-react";
import API_ENDPOINTS from "../config/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.USERS_ALL);
      const users = await res.json();

      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (user) {
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userRole", user.role);
        onLogin(user);
      } else {
        setError("Invalid email or password!");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Check if email already exists
      const checkRes = await fetch(API_ENDPOINTS.USERS_ALL);
      const existingUsers = await checkRes.json();
      
      const emailExists = existingUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (emailExists) {
        setError("Email already exists. Please use a different email.");
        setIsLoading(false);
        return;
      }

      const newUser = { email, password, role: "CITIZEN" };
      const res = await fetch(API_ENDPOINTS.USERS_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        setSuccess("✅ Registration successful! You can now log in.");
        setIsRegistering(false);
        setEmail("");
        setPassword("");
      } else {
        setError("Failed to register. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while registering!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/50">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mb-3 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">CityCare</h2>
            <p className="text-sm text-gray-600">
              {isRegistering ? "Join us and make your city better!" : "Because Every Citizen Counts"}
            </p>
          </div>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg text-white text-sm font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                isRegistering
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isRegistering ? "Creating Account..." : "Signing In..."}
                </span>
              ) : (
                isRegistering ? "Create Account" : "Sign In"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-600">
            {isRegistering ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
                setSuccess("");
              }}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isRegistering ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}