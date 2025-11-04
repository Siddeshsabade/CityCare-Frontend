// import React, { useState, useEffect } from "react";
// import Login from "./components/Login";
// import CreateIssue from "./components/createIssue";
// import AuthorityDashboard from "./components/AuthorityDashboard";
// import { FileText, Plus, LogOut, X } from "lucide-react";
// import API_ENDPOINTS from "./config/api";

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [showAddAuthority, setShowAddAuthority] = useState(false);
//   const [newAuthEmail, setNewAuthEmail] = useState("");
//   const [newAuthPassword, setNewAuthPassword] = useState("");

//   useEffect(() => {
//     const storedUser = localStorage.getItem("userEmail");
//     if (storedUser) {
//       setUser({
//         id: localStorage.getItem("userId"),
//         email: storedUser,
//         role: localStorage.getItem("userRole"),
//       });
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     setUser(null);
//   };

//   const handleAddAuthority = async (e) => {
//     e.preventDefault();
//     if (!newAuthEmail || !newAuthPassword) {
//       alert("Please fill out all fields");
//       return;
//     }

//     const newAuthority = {
//       email: newAuthEmail,
//       password: newAuthPassword,
//       role: "authority",
//     };

//     try {
//       const res = await fetch(API_ENDPOINTS.USERS_CREATE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newAuthority),
//       });

//       if (res.ok) {
//         alert("✅ New authority registered successfully!");
//         setShowAddAuthority(false);
//         setNewAuthEmail("");
//         setNewAuthPassword("");
//       } else {
//         alert("❌ Failed to register new authority.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("⚠️ Error registering authority");
//     }
//   };

//   if (!user) return <Login onLogin={setUser} />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       {/* Compact Navbar */}
//       <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-2.5">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2.5">
//               <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md">
//                 <FileText className="w-5 h-5 text-white" />
//               </div>
//               <div className="leading-tight">
//                 <h5 className="text-base font-bold text-gray-900">City Issue Portal</h5>
//                 <p className="text-[10px] text-gray-500">Making cities better together</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2.5">
//               <div className="text-right mr-2 leading-tight">
//                 <p className="text-xs font-medium text-gray-900">{user.email}</p>
//                 <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
//               </div>

//               {user.role === "SUPERADMIN" && (
//                 <button
//                   onClick={() => setShowAddAuthority(true)}
//                   className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-medium hover:shadow-md transition-all flex items-center gap-1.5"
//                 >
//                   <Plus className="w-3.5 h-3.5" />
//                   Add Authority
//                 </button>
//               )}

//               <button
//                 onClick={handleLogout}
//                 className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-medium hover:shadow-md transition-all flex items-center gap-1.5"
//               >
//                 <LogOut className="w-3.5 h-3.5" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div>
//         {user.role === "authority" || user.role === "SUPERADMIN" ? (
//           <AuthorityDashboard />
//         ) : (
//           <CreateIssue />
//         )}
//       </div>

//       {/* Add Authority Modal */}
//       {showAddAuthority && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//           onClick={() => setShowAddAuthority(false)}
//         >
//           <div
//             className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between mb-5">
//               <h4 className="text-xl font-bold text-gray-900">Add New Authority</h4>
//               <button
//                 onClick={() => setShowAddAuthority(false)}
//                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             <form onSubmit={handleAddAuthority} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
//                 <input
//                   type="email"
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
//                   placeholder="authority@example.com"
//                   value={newAuthEmail}
//                   onChange={(e) => setNewAuthEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
//                 <input
//                   type="password"
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
//                   placeholder="••••••••"
//                   value={newAuthPassword}
//                   onChange={(e) => setNewAuthPassword(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="flex gap-2.5 pt-3">
//                 <button
//                   type="submit"
//                   className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-md transition-all"
//                 >
//                   Register Authority
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowAddAuthority(false)}
//                   className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import CreateIssue from "./components/createIssue";
import AuthorityDashboard from "./components/AuthorityDashboard";
import { FileText, Plus, LogOut, X } from "lucide-react";
import API_ENDPOINTS from "./config/api";

import { Link } from "react-router-dom";


export default function App() {
  const [user, setUser] = useState(null);
  const [showAddAuthority, setShowAddAuthority] = useState(false);
  const [newAuthEmail, setNewAuthEmail] = useState("");
  const [newAuthPassword, setNewAuthPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userEmail");
    if (storedUser) {
      setUser({
        id: localStorage.getItem("userId"),
        email: storedUser,
        role: localStorage.getItem("userRole"),
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const handleAddAuthority = async (e) => {
    e.preventDefault();
    if (!newAuthEmail || !newAuthPassword) {
      alert("Please fill out all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists
      const checkRes = await fetch(API_ENDPOINTS.USERS_ALL);
      const existingUsers = await checkRes.json();
      
      const emailExists = existingUsers.some(
        (u) => u.email.toLowerCase() === newAuthEmail.toLowerCase()
      );

      if (emailExists) {
        alert("❌ Email already exists. Please use a different email.");
        setIsLoading(false);
        return;
      }

      const newAuthority = {
        email: newAuthEmail,
        password: newAuthPassword,
        role: "authority",
      };

      const res = await fetch(API_ENDPOINTS.USERS_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAuthority),
      });

      if (res.ok) {
        alert("✅ New authority registered successfully!");
        setShowAddAuthority(false);
        setNewAuthEmail("");
        setNewAuthPassword("");
      } else {
        alert("❌ Failed to register new authority.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error registering authority");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile-Friendly Navbar */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <h5 className="text-sm sm:text-base font-bold text-gray-900">City Issue Portal</h5>
                <p className="text-[9px] sm:text-[10px] text-gray-500 hidden sm:block">Making cities better together</p>
              </div>
            </div> */}

            {/* Left side: Logo + Title + About link */}
{/* Left side — logo + title + about link */}
<div className="flex items-center gap-3">
  <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md">
    <FileText className="w-5 h-5 text-white" />
  </div>

  <div className="flex items-center gap-4">
    <div className="leading-tight">
      <h5 className="text-sm sm:text-base font-bold text-gray-900">
        City Issue Portal
      </h5>
      <p className="text-[9px] sm:text-[10px] text-gray-500 hidden sm:block">
        Making cities better together
      </p>
    </div>

    {/* About link – same baseline, subtle style */}
    <Link
      to="/about"
      className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
    >
      About
    </Link>
  </div>
</div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2.5">
              <div className="text-right mr-2 leading-tight">
                <p className="text-xs font-medium text-gray-900">{user.email}</p>
                <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
              </div>

              {user.role === "SUPERADMIN" && (
                <button
                  onClick={() => setShowAddAuthority(true)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-medium hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Authority
                </button>
              )}

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-medium hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="md:hidden mt-3 pb-3 border-t border-gray-200 pt-3 space-y-3">
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-900">{user.email}</p>
                <p className="text-[10px] text-gray-500 capitalize mt-0.5">{user.role}</p>
              </div>

              {user.role === "SUPERADMIN" && (
                <button
                  onClick={() => {
                    setShowAddAuthority(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-medium hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Authority
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-medium hover:shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div>
        {user.role === "authority" || user.role === "SUPERADMIN" ? (
          <AuthorityDashboard />
        ) : (
          <CreateIssue />
        )}
      </div>

      {/* Add Authority Modal */}
      {showAddAuthority && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddAuthority(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-xl font-bold text-gray-900">Add New Authority</h4>
              <button
                onClick={() => setShowAddAuthority(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddAuthority} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                  placeholder="authority@example.com"
                  value={newAuthEmail}
                  onChange={(e) => setNewAuthEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                  placeholder="••••••••"
                  value={newAuthPassword}
                  onChange={(e) => setNewAuthPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    "Register Authority"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAuthority(false)}
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}