// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { User, X, AlertCircle, Clock, CheckCircle, FileText, Calendar } from "lucide-react";
// import API_ENDPOINTS from "../config/api";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// export default function AuthorityDashboard() {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [newStatus, setNewStatus] = useState("");
//   const [users, setUsers] = useState([]);
//   const [superAdminAssign, setSuperAdminAssign] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const currentUserEmail = localStorage.getItem("userEmail");
//   const currentUserRole = localStorage.getItem("userRole");

//   useEffect(() => {
//     fetch(API_ENDPOINTS.ISSUES_ALL)
//       .then((res) => res.json())
//       .then((data) => {
//         setIssues(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });

//     fetch(API_ENDPOINTS.USERS_ALL)
//       .then((res) => res.json())
//       .then((data) =>
//         setUsers(data.filter((u) => u.role.toLowerCase() === "authority"))
//       )
//       .catch((err) => console.error(err));
//   }, []);

//   const handleAssignToMe = async (issueId) => {
//     try {
//       const res = await fetch(API_ENDPOINTS.ISSUES_BY_ID(issueId));
//       const issue = await res.json();

//       const updatedIssue = {
//         ...issue,
//         assignedTo: currentUserEmail,
//         status: issue.status === "Open" ? "In Progress" : issue.status,
//       };

//       const updateRes = await fetch(API_ENDPOINTS.ISSUES_UPDATE(issueId), {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedIssue),
//       });

//       const savedIssue = await updateRes.json();
//       setIssues((prev) => prev.map((i) => (i.id === issueId ? savedIssue : i)));
//       setSelectedIssue(savedIssue);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to assign issue");
//     }
//   };

//   const handleSuperAdminAssign = async (issueId) => {
//     if (!superAdminAssign) return;
//     try {
//       const res = await fetch(API_ENDPOINTS.ISSUES_BY_ID(issueId));
//       const issue = await res.json();

//       const updatedIssue = {
//         ...issue,
//         assignedTo: `${superAdminAssign} by SUPERADMIN`,
//         status: issue.status === "Open" ? "In Progress" : issue.status,
//       };

//       const updateRes = await fetch(API_ENDPOINTS.ISSUES_UPDATE(issueId), {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedIssue),
//       });

//       const savedIssue = await updateRes.json();
//       setIssues((prev) => prev.map((i) => (i.id === issueId ? savedIssue : i)));
//       setSelectedIssue(savedIssue);
//       setSuperAdminAssign("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to assign issue");
//     }
//   };

//   const handleStatusChange = async (issueId) => {
//     if (!newStatus) {
//       alert("Please select a status before updating.");
//       return;
//     }

//     try {
//       const res = await fetch(API_ENDPOINTS.ISSUES_BY_ID(issueId));
//       const issue = await res.json();

//       const updatedIssue = { ...issue, status: newStatus };

//       const updateRes = await fetch(API_ENDPOINTS.ISSUES_UPDATE(issueId), {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedIssue),
//       });

//       const savedIssue = await updateRes.json();
//       setIssues((prev) => prev.map((i) => (i.id === issueId ? savedIssue : i)));
//       setSelectedIssue(savedIssue);
//       setNewStatus("");
//       alert(`Status updated to ${savedIssue.status}`);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update status");
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Open": return "bg-yellow-100 text-yellow-700 border-yellow-200";
//       case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
//       case "Waiting for Internal Reply": return "bg-orange-100 text-orange-700 border-orange-200";
//       case "Resolved": return "bg-green-100 text-green-700 border-green-200";
//       default: return "bg-gray-100 text-gray-700 border-gray-200";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Open": return <AlertCircle className="w-3 h-3" />;
//       case "In Progress": return <Clock className="w-3 h-3" />;
//       case "Resolved": return <CheckCircle className="w-3 h-3" />;
//       default: return <FileText className="w-3 h-3" />;
//     }
//   };

//   // Filter logic
//   const filteredIssues = issues.filter((issue) => {
//     if (activeFilter === "all") return true;
//     if (activeFilter === "unassigned") return !issue.assignedTo;
//     if (activeFilter === "assigned-to-me") {
//       // Check if assigned to current user (handle both regular and SUPERADMIN assignment formats)
//       return issue.assignedTo && (
//         issue.assignedTo === currentUserEmail || 
//         issue.assignedTo.startsWith(currentUserEmail)
//       );
//     }
//     return true;
//   });

//   const filters = [
//     { id: "all", label: "All Issues", count: issues.length },
//     { id: "unassigned", label: "Unassigned", count: issues.filter(i => !i.assignedTo).length },
//     { id: "assigned-to-me", label: "Assigned to Me", count: issues.filter(i => i.assignedTo && (i.assignedTo === currentUserEmail || i.assignedTo.startsWith(currentUserEmail))).length },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-gray-900 mb-1">Authority Dashboard</h2>
//           <p className="text-sm text-gray-600">Monitor and manage reported city issues</p>
//         </div>

//         {/* Filter Pills - Centered */}
//         <div className="flex items-center justify-center gap-2 mb-6">
//           {filters.map((filter) => (
//             <button
//               key={filter.id}
//               onClick={() => setActiveFilter(filter.id)}
//               className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
//                 activeFilter === filter.id
//                   ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
//                   : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-sm"
//               }`}
//             >
//               {filter.label}
//               <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
//                 activeFilter === filter.id
//                   ? "bg-white/20"
//                   : "bg-gray-100"
//               }`}>
//                 {filter.count}
//               </span>
//             </button>
//           ))}
//         </div>

//         {loading ? (
//           <div className="text-center text-gray-600 py-12">
//             <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
//             <p className="mt-3 text-sm">Loading issues...</p>
//           </div>
//         ) : filteredIssues.length === 0 ? (
//           <div className="text-center text-gray-500 py-12">
//             <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//             <p className="text-sm">No issues found for this filter</p>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredIssues.map((issue) => (
//               <div
//                 key={issue.id}
//                 onClick={() => setSelectedIssue(issue)}
//                 className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
//               >
//                 <h5 className="font-bold text-gray-900 mb-1.5 text-sm group-hover:text-blue-600 transition-colors">
//                   {issue.title}
//                 </h5>
//                 <p className="text-xs text-gray-600 mb-3 line-clamp-2">{issue.description}</p>
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md font-medium">
//                     {issue.category}
//                   </span>
//                   <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md border flex items-center gap-1 ${getStatusColor(issue.status)}`}>
//                     {getStatusIcon(issue.status)}
//                     {issue.status}
//                   </span>
//                 </div>
//                 {issue.assignedTo && (
//                   <p className="text-[11px] text-blue-600 flex items-center gap-1">
//                     <User className="w-3 h-3" />
//                     {issue.assignedTo}
//                   </p>
//                 )}
//                 {issue.createdAt && (
//                   <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
//                     <Calendar className="w-3 h-3" />
//                     {issue.createdAt}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Issue Detail Modal */}
//       {selectedIssue && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//           onClick={() => setSelectedIssue(null)}
//         >
//           <div
//             className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-start justify-between mb-5">
//               <div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedIssue.title}</h4>
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border ${getStatusColor(selectedIssue.status)}`}>
//                     {getStatusIcon(selectedIssue.status)}
//                     {selectedIssue.status}
//                   </span>
//                   {selectedIssue.createdAt && (
//                     <span className="text-xs text-gray-500 flex items-center gap-1">
//                       <Calendar className="w-3.5 h-3.5" />
//                       {selectedIssue.createdAt}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <button
//                 onClick={() => setSelectedIssue(null)}
//                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <p className="text-xs font-medium text-gray-500 mb-1">Category</p>
//                 <p className="text-sm text-gray-900 font-medium">{selectedIssue.category}</p>
//               </div>

//               <div>
//                 <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
//                 <p className="text-sm text-gray-900">{selectedIssue.description}</p>
//               </div>

//               {selectedIssue.images?.length > 0 && (
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-2">Attached Images</p>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                     {selectedIssue.images.map((img, idx) => (
//                       <img
//                         key={idx}
//                         src={img}
//                         alt="issue"
//                         className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {selectedIssue.latitude && selectedIssue.longitude && (
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-2">Location</p>
//                   <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
//                     <MapContainer
//                       center={[selectedIssue.latitude, selectedIssue.longitude]}
//                       zoom={14}
//                       style={{ height: "250px", width: "100%" }}
//                     >
//                       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                       <Marker position={[selectedIssue.latitude, selectedIssue.longitude]}>
//                         <Popup>{selectedIssue.title}</Popup>
//                       </Marker>
//                     </MapContainer>
//                   </div>
//                 </div>
//               )}

//               {selectedIssue.assignedTo && (
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-1">Assigned To</p>
//                   <p className="text-sm text-blue-600 font-medium flex items-center gap-1.5">
//                     <User className="w-3.5 h-3.5" />
//                     {selectedIssue.assignedTo}
//                   </p>
//                 </div>
//               )}

//               {/* Controls */}
//               <div className="pt-4 border-t border-gray-200 space-y-3">
//                 <div className="flex gap-2">
//                   <select
//                     value={newStatus}
//                     onChange={(e) => setNewStatus(e.target.value)}
//                     className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
//                   >
//                     <option value="">Select Status</option>
//                     <option value="Open">Open</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Waiting for Internal Reply">Waiting for Internal Reply</option>
//                     <option value="Resolved">Resolved</option>
//                   </select>
//                   <button
//                     onClick={() => handleStatusChange(selectedIssue.id)}
//                     className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-md transition-all"
//                   >
//                     Update
//                   </button>
//                 </div>

//                 {currentUserRole === "SUPERADMIN" ? (
//                   <div className="flex gap-2">
//                     <select
//                       value={superAdminAssign}
//                       onChange={(e) => setSuperAdminAssign(e.target.value)}
//                       className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
//                     >
//                       <option value="">Assign to authority...</option>
//                       {users.map((u) => (
//                         <option key={u.id} value={u.email}>
//                           {u.email}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       onClick={() => handleSuperAdminAssign(selectedIssue.id)}
//                       disabled={!superAdminAssign}
//                       className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Assign
//                     </button>
//                   </div>
//                 ) : (
//                   !selectedIssue.assignedTo && (
//                     <button
//                       onClick={() => handleAssignToMe(selectedIssue.id)}
//                       className="w-full px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-md transition-all"
//                     >
//                       Assign to Me
//                     </button>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { User, X, AlertCircle, Clock, CheckCircle, FileText, Calendar } from "lucide-react";
import API_ENDPOINTS from "../config/api";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AuthorityDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [superAdminAssign, setSuperAdminAssign] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUserEmail = localStorage.getItem("userEmail");
  const currentUserRole = localStorage.getItem("userRole");

  useEffect(() => {
    fetch(API_ENDPOINTS.ISSUES_ALL)
      .then((res) => res.json())
      .then((data) => {
        setIssues(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    fetch(API_ENDPOINTS.USERS_ALL)
      .then((res) => res.json())
      .then((data) =>
        setUsers(data.filter((u) => u.role.toLowerCase() === "authority"))
      )
      .catch((err) => console.error(err));
  }, []);

  const handleAssignToMe = async (issueId) => {
    setIsUpdating(true);
    try {
      const res = await fetch(API_ENDPOINTS.ISSUES_BY_ID(issueId));
      const issue = await res.json();

      const updatedIssue = {
        ...issue,
        assignedTo: currentUserEmail,
        status: issue.status === "Open" ? "In Progress" : issue.status,
      };

      const updateRes = await fetch(API_ENDPOINTS.ISSUES_UPDATE(issueId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedIssue),
      });

      const savedIssue = await updateRes.json();
      setIssues((prev) => prev.map((i) => (i.id === issueId ? savedIssue : i)));
      setSelectedIssue(savedIssue);
    } catch (err) {
      console.error(err);
      alert("Failed to assign issue");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSuperAdminAssign = async (issueId) => {
    if (!superAdminAssign) return;
    setIsUpdating(true);
    try {
      const res = await fetch(API_ENDPOINTS.ISSUES_BY_ID(issueId));
      const issue = await res.json();

      const updatedIssue = {
        ...issue,
        assignedTo: `${superAdminAssign} by SUPERADMIN`,
        status: issue.status === "Open" ? "In Progress" : issue.status,
      };

      const updateRes = await fetch(API_ENDPOINTS.ISSUES_UPDATE(issueId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedIssue),
      });

      const savedIssue = await updateRes.json();
      setIssues((prev) => prev.map((i) => (i.id === issueId ? savedIssue : i)));
      setSelectedIssue(savedIssue);
      setSuperAdminAssign("");
    } catch (err) {
      console.error(err);
      alert("Failed to assign issue");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (issueId) => {
    if (!newStatus) {
      alert("Please select a status before updating.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(API_ENDPOINTS.ISSUES_BY_ID(issueId));
      const issue = await res.json();

      const updatedIssue = { ...issue, status: newStatus };

      const updateRes = await fetch(API_ENDPOINTS.ISSUES_UPDATE(issueId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedIssue),
      });

      const savedIssue = await updateRes.json();
      setIssues((prev) => prev.map((i) => (i.id === issueId ? savedIssue : i)));
      setSelectedIssue(savedIssue);
      setNewStatus("");
      alert(`Status updated to ${savedIssue.status}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Waiting for Internal Reply": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Resolved": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open": return <AlertCircle className="w-3 h-3" />;
      case "In Progress": return <Clock className="w-3 h-3" />;
      case "Resolved": return <CheckCircle className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  // Filter logic
  const filteredIssues = issues.filter((issue) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unassigned") return !issue.assignedTo;
    if (activeFilter === "assigned-to-me") {
      // Check if assigned to current user (handle both regular and SUPERADMIN assignment formats)
      return issue.assignedTo && (
        issue.assignedTo === currentUserEmail || 
        issue.assignedTo.startsWith(currentUserEmail)
      );
    }
    return true;
  });

  const filters = [
    { id: "all", label: "All Issues", count: issues.length },
    { id: "unassigned", label: "Unassigned", count: issues.filter(i => !i.assignedTo).length },
    { id: "assigned-to-me", label: "Assigned to Me", count: issues.filter(i => i.assignedTo && (i.assignedTo === currentUserEmail || i.assignedTo.startsWith(currentUserEmail))).length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Authority Dashboard</h2>
          <p className="text-sm text-gray-600">Monitor and manage reported city issues</p>
        </div>

        {/* Filter Pills - Centered and Mobile Responsive */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap px-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-sm"
              }`}
            >
              <span className="hidden sm:inline">{filter.label}</span>
              <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                activeFilter === filter.id
                  ? "bg-white/20"
                  : "bg-gray-100"
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-3 text-sm">Loading issues...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No issues found for this filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                <h5 className="font-bold text-gray-900 mb-1.5 text-sm group-hover:text-blue-600 transition-colors">
                  {issue.title}
                </h5>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{issue.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md font-medium">
                    {issue.category}
                  </span>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md border flex items-center gap-1 ${getStatusColor(issue.status)}`}>
                    {getStatusIcon(issue.status)}
                    {issue.status}
                  </span>
                </div>
                {issue.assignedTo && (
                  <p className="text-[11px] text-blue-600 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {issue.assignedTo}
                  </p>
                )}
                {issue.createdAt && (
                  <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {issue.createdAt}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedIssue(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedIssue.title}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border ${getStatusColor(selectedIssue.status)}`}>
                    {getStatusIcon(selectedIssue.status)}
                    {selectedIssue.status}
                  </span>
                  {selectedIssue.createdAt && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedIssue.createdAt}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Category</p>
                <p className="text-sm text-gray-900 font-medium">{selectedIssue.category}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-900">{selectedIssue.description}</p>
              </div>

              {selectedIssue.images?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Attached Images</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedIssue.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="issue"
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedIssue.latitude && selectedIssue.longitude && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Location</p>
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <MapContainer
                      center={[selectedIssue.latitude, selectedIssue.longitude]}
                      zoom={14}
                      style={{ height: "250px", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[selectedIssue.latitude, selectedIssue.longitude]}>
                        <Popup>{selectedIssue.title}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              )}

              {selectedIssue.assignedTo && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Assigned To</p>
                  <p className="text-sm text-blue-600 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {selectedIssue.assignedTo}
                  </p>
                </div>
              )}

              {/* Controls */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    disabled={isUpdating}
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting for Internal Reply">Waiting for Internal Reply</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button
                    onClick={() => handleStatusChange(selectedIssue.id)}
                    disabled={isUpdating}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>

                {currentUserRole === "SUPERADMIN" ? (
                  <div className="flex gap-2">
                    <select
                      value={superAdminAssign}
                      onChange={(e) => setSuperAdminAssign(e.target.value)}
                      disabled={isUpdating}
                      className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Assign to authority...</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.email}>
                          {u.email}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSuperAdminAssign(selectedIssue.id)}
                      disabled={!superAdminAssign || isUpdating}
                      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        "Assign"
                      )}
                    </button>
                  </div>
                ) : (
                  !selectedIssue.assignedTo && (
                    <button
                      onClick={() => handleAssignToMe(selectedIssue.id)}
                      disabled={isUpdating}
                      className="w-full px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Assigning...
                        </span>
                      ) : (
                        "Assign to Me"
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}