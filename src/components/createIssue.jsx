// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { createClient } from "@supabase/supabase-js";
// import { Camera, MapPin, User, CheckCircle, Clock, AlertCircle, FileText, X } from "lucide-react";
// import API_ENDPOINTS from "../config/api";

// // Initialize Supabase client
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// );

// // Fix for missing marker icons
// const DefaultIcon = new L.Icon({
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// function LocationSelector({ setCoordinates }) {
//   const [position, setPosition] = useState(null);

//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setPosition([lat, lng]);
//       setCoordinates({ latitude: lat, longitude: lng });
//     },
//   });

//   return position ? <Marker position={position}></Marker> : null;
// }

// export default function CreateIssue() {
//   const [issue, setIssue] = useState({
//     title: "",
//     description: "",
//     category: "",
//     status: "Open",
//   });
//   const [coordinates, setCoordinates] = useState({
//     latitude: null,
//     longitude: null,
//   });
//   const [useMyLocation, setUseMyLocation] = useState(false);
//   const [message, setMessage] = useState("");
//   const [myIssues, setMyIssues] = useState([]);
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [images, setImages] = useState([]);
//   const userId = localStorage.getItem("userId");

//   // Fetch issues reported by this citizen
//   useEffect(() => {
//     if (userId) {
//       fetch(API_ENDPOINTS.ISSUES_ALL)
//         .then((res) => res.json())
//         .then((data) => {
//           const myReportedIssues = data.filter(
//             (i) => i.reportedBy && i.reportedBy.id == userId
//           );
//           setMyIssues(myReportedIssues);
//         })
//         .catch((err) => console.error("Error fetching issues:", err));
//     }
//   }, [userId, message]);

//   const handleChange = (e) => setIssue({ ...issue, [e.target.name]: e.target.value });

//   const handleUseMyLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         setCoordinates({
//           latitude: pos.coords.latitude,
//           longitude: pos.coords.longitude,
//         });
//         setUseMyLocation(true);
//       });
//     } else alert("Geolocation not supported by your browser.");
//   };

//   const handleImageChange = (e) => setImages([...e.target.files]);

//   // Upload image(s) to Supabase
//   const uploadImagesToSupabase = async () => {
//     const urls = [];

//     for (const file of images) {
//       const fileName = `${Date.now()}-${file.name}`;
//       const { error } = await supabase.storage
//         .from("issue-images")
//         .upload(fileName, file);

//       if (error) {
//         console.error("Upload error:", error);
//         continue;
//       }

//       const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/issue-images/${fileName}`;
//       urls.push(publicUrl);
//     }

//     return urls;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       let imageUrls = [];
//       if (images.length > 0) imageUrls = await uploadImagesToSupabase();

//       const issueData = {
//         ...issue,
//         latitude: coordinates.latitude,
//         longitude: coordinates.longitude,
//         reportedBy: { id: userId },
//         images: imageUrls,
//       };

//       const response = await fetch(API_ENDPOINTS.ISSUES_CREATE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(issueData),
//       });

//       if (response.ok) {
//         setMessage("✅ Issue submitted successfully!");
//         setTimeout(() => setMessage(""), 3000);
//         setIssue({ title: "", description: "", category: "", status: "Open" });
//         setCoordinates({ latitude: null, longitude: null });
//         setImages([]);
//         setUseMyLocation(false);
//       } else setMessage("❌ Failed to submit issue.");
//     } catch (err) {
//       console.error(err);
//       setMessage("⚠️ Error connecting to server.");
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Open": return "bg-yellow-100 text-yellow-700 border-yellow-200";
//       case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
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

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-2 gap-4">
//           {/* Left: Report Form */}
//           <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50">
//             <div className="flex items-center gap-2.5 mb-5">
//               <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md">
//                 <FileText className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900">Report New Issue</h3>
//             </div>

//             {message && (
//               <div className={`mb-4 px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
//                 message.includes("✅") 
//                   ? "bg-green-50 border border-green-200 text-green-700"
//                   : "bg-red-50 border border-red-200 text-red-700"
//               }`}>
//                 <CheckCircle className="w-4 h-4" />
//                 <span>{message}</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1.5">Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={issue.title}
//                   onChange={handleChange}
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
//                   placeholder="Brief description of the issue"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
//                 <textarea
//                   name="description"
//                   value={issue.description}
//                   onChange={handleChange}
//                   rows="3"
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none text-sm"
//                   placeholder="Provide detailed information"
//                   required
//                 ></textarea>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
//                 <input
//                   type="text"
//                   name="category"
//                   value={issue.category}
//                   onChange={handleChange}
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
//                   placeholder="e.g., Road, Water, Electricity"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1.5">Upload Images (optional)</label>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="w-full px-3.5 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-medium hover:file:bg-blue-100"
//                 />
//                 {images.length > 0 && (
//                   <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1.5">
//                     <Camera className="w-3.5 h-3.5" />
//                     {images.length} image(s) selected
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1.5">Location</label>
//                 <button
//                   type="button"
//                   onClick={handleUseMyLocation}
//                   className="w-full mb-2.5 px-3.5 py-2.5 rounded-lg border-2 border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
//                 >
//                   <MapPin className="w-4 h-4" />
//                   Use My Current Location
//                 </button>
//                 {useMyLocation && coordinates.latitude && (
//                   <p className="text-xs text-green-600 mb-2.5 flex items-center gap-1.5">
//                     <CheckCircle className="w-3.5 h-3.5" />
//                     Location: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
//                   </p>
//                 )}
//                 <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
//                   <MapContainer
//                     center={[18.5204, 73.8567]}
//                     zoom={13}
//                     style={{ height: "220px", width: "100%" }}
//                   >
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                     <LocationSelector setCoordinates={setCoordinates} />
//                   </MapContainer>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
//               >
//                 Submit Issue
//               </button>
//             </form>
//           </div>

//           {/* Right: My Issues */}
//           <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50 flex flex-col">
//             <div className="flex items-center gap-2.5 mb-5">
//               <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-md">
//                 <FileText className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900">My Reported Issues</h3>
//             </div>

//             <div className="flex-1 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 14rem)" }}>
//               {myIssues.length === 0 ? (
//                 <p className="text-center text-gray-500 py-12 text-sm">No issues reported yet</p>
//               ) : (
//                 <div className="grid grid-cols-2 gap-3">
//                   {myIssues.map((i) => (
//                     <div
//                       key={i.id}
//                       onClick={() => setSelectedIssue(i)}
//                       className="bg-white rounded-xl p-3.5 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
//                     >
//                       <h6 className="font-semibold text-gray-900 mb-1.5 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
//                         {i.title}
//                       </h6>
//                       <p className="text-xs text-gray-600 mb-2.5 line-clamp-2">{i.description}</p>
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md font-medium">
//                           {i.category}
//                         </span>
//                         <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md border flex items-center gap-1 ${getStatusColor(i.status)}`}>
//                           {getStatusIcon(i.status)}
//                           {i.status}
//                         </span>
//                       </div>
//                       {i.createdAt && (
//                         <p className="text-[11px] text-gray-500 mb-1.5 flex items-center gap-1">
//                           <Clock className="w-3 h-3" />
//                           {i.createdAt}
//                         </p>
//                       )}
//                       {i.assignedTo && (
//                         <p className="text-[11px] text-blue-600 flex items-center gap-1">
//                           <User className="w-3 h-3" />
//                           <span className="font-medium truncate">
//                             {localStorage.getItem("userRole") === "SUPERADMIN"
//                               ? i.assignedTo
//                               : i.assignedTo.split(" by SUPERADMIN")[0]}
//                           </span>
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
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
//                 <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border ${getStatusColor(selectedIssue.status)}`}>
//                   {getStatusIcon(selectedIssue.status)}
//                   {selectedIssue.status}
//                 </span>
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
//                 <p className="text-sm text-gray-900">{selectedIssue.category}</p>
//               </div>

//               <div>
//                 <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
//                 <p className="text-sm text-gray-900">{selectedIssue.description}</p>
//               </div>

//               {selectedIssue.assignedTo && (
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-1">Assigned To</p>
//                   <p className="text-sm text-blue-600 font-medium">
//                     {localStorage.getItem("userRole") === "SUPERADMIN"
//                       ? selectedIssue.assignedTo
//                       : selectedIssue.assignedTo.split(" by SUPERADMIN")[0]}
//                   </p>
//                 </div>
//               )}

//               {selectedIssue.images && selectedIssue.images.length > 0 && (
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 mb-2">Images</p>
//                   <div className="grid grid-cols-2 gap-2">
//                     {selectedIssue.images.map((img, idx) => (
//                       <img
//                         key={idx}
//                         src={img}
//                         alt={`issue-${idx}`}
//                         className="w-full h-36 object-cover rounded-lg border border-gray-200"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <p className="text-xs font-medium text-gray-500 mb-2">Location</p>
//                 <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
//                   <MapContainer
//                     center={[selectedIssue.latitude, selectedIssue.longitude]}
//                     zoom={14}
//                     style={{ height: "250px", width: "100%" }}
//                   >
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                     <Marker position={[selectedIssue.latitude, selectedIssue.longitude]}>
//                       <Popup>{selectedIssue.title}</Popup>
//                     </Marker>
//                   </MapContainer>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createClient } from "@supabase/supabase-js";
import { Camera, MapPin, User, CheckCircle, Clock, AlertCircle, FileText, X } from "lucide-react";
import API_ENDPOINTS from "../config/api";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Fix for missing marker icons
const DefaultIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationSelector({ setCoordinates }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setCoordinates({ latitude: lat, longitude: lng });
    },
  });

  return position ? <Marker position={position}></Marker> : null;
}

export default function CreateIssue() {
  const [issue, setIssue] = useState({
    title: "",
    description: "",
    category: "",
    status: "Open",
  });
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [useMyLocation, setUseMyLocation] = useState(false);
  const [message, setMessage] = useState("");
  const [myIssues, setMyIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("userId");

  // Fetch issues reported by this citizen
  useEffect(() => {
    if (userId) {
      fetch(API_ENDPOINTS.ISSUES_ALL)
        .then((res) => res.json())
        .then((data) => {
          const myReportedIssues = data.filter(
            (i) => i.reportedBy && i.reportedBy.id == userId
          );
          setMyIssues(myReportedIssues);
        })
        .catch((err) => console.error("Error fetching issues:", err));
    }
  }, [userId, message]);

  const handleChange = (e) => setIssue({ ...issue, [e.target.name]: e.target.value });

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoordinates({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setUseMyLocation(true);
      });
    } else alert("Geolocation not supported by your browser.");
  };

  const handleImageChange = (e) => setImages([...e.target.files]);

  // Upload image(s) to Supabase
  const uploadImagesToSupabase = async () => {
    const urls = [];

    for (const file of images) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("issue-images")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/issue-images/${fileName}`;
      urls.push(publicUrl);
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrls = [];
      if (images.length > 0) imageUrls = await uploadImagesToSupabase();

      const issueData = {
        ...issue,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        reportedBy: { id: userId },
        images: imageUrls,
      };

      const response = await fetch(API_ENDPOINTS.ISSUES_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueData),
      });

      if (response.ok) {
        setMessage("✅ Issue submitted successfully!");
        setTimeout(() => setMessage(""), 3000);
        setIssue({ title: "", description: "", category: "", status: "Open" });
        setCoordinates({ latitude: null, longitude: null });
        setImages([]);
        setUseMyLocation(false);
      } else setMessage("❌ Failed to submit issue.");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left: Report Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6 border border-white/50">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Report New Issue</h3>
            </div>

            {message && (
              <div className={`mb-4 px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                message.includes("✅") 
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}>
                <CheckCircle className="w-4 h-4" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  name="title"
                  value={issue.title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={issue.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none text-sm"
                  placeholder="Provide detailed information"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                <input
                  type="text"
                  name="category"
                  value={issue.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                  placeholder="e.g., Road, Water, Electricity"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Upload Images (optional)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-medium hover:file:bg-blue-100"
                />
                {images.length > 0 && (
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    {images.length} image(s) selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Location</label>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="w-full mb-2.5 px-3.5 py-2.5 rounded-lg border-2 border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Use My Current Location
                </button>
                {useMyLocation && coordinates.latitude && (
                  <p className="text-xs text-green-600 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Location: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                  </p>
                )}
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <MapContainer
                    center={[18.5204, 73.8567]}
                    zoom={13}
                    style={{ height: "220px", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationSelector setCoordinates={setCoordinates} />
                  </MapContainer>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Issue"
                )}
              </button>
            </form>
          </div>

          {/* Right: My Issues */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6 border border-white/50 flex flex-col">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">My Reported Issues</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 14rem)" }}>
              {myIssues.length === 0 ? (
                <p className="text-center text-gray-500 py-12 text-sm">No issues reported yet</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {myIssues.map((i) => (
                    <div
                      key={i.id}
                      onClick={() => setSelectedIssue(i)}
                      className="bg-white rounded-xl p-3.5 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <h6 className="font-semibold text-gray-900 mb-1.5 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                        {i.title}
                      </h6>
                      <p className="text-xs text-gray-600 mb-2.5 line-clamp-2">{i.description}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md font-medium">
                          {i.category}
                        </span>
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md border flex items-center gap-1 ${getStatusColor(i.status)}`}>
                          {getStatusIcon(i.status)}
                          {i.status}
                        </span>
                      </div>
                      {i.createdAt && (
                        <p className="text-[11px] text-gray-500 mb-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {i.createdAt}
                        </p>
                      )}
                      {i.assignedTo && (
                        <p className="text-[11px] text-blue-600 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="font-medium truncate">
                            {localStorage.getItem("userRole") === "SUPERADMIN"
                              ? i.assignedTo
                              : i.assignedTo.split(" by SUPERADMIN")[0]}
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border ${getStatusColor(selectedIssue.status)}`}>
                  {getStatusIcon(selectedIssue.status)}
                  {selectedIssue.status}
                </span>
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
                <p className="text-sm text-gray-900">{selectedIssue.category}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-900">{selectedIssue.description}</p>
              </div>

              {selectedIssue.assignedTo && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Assigned To</p>
                  <p className="text-sm text-blue-600 font-medium">
                    {localStorage.getItem("userRole") === "SUPERADMIN"
                      ? selectedIssue.assignedTo
                      : selectedIssue.assignedTo.split(" by SUPERADMIN")[0]}
                  </p>
                </div>
              )}

              {selectedIssue.images && selectedIssue.images.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Images</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIssue.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`issue-${idx}`}
                        className="w-full h-36 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}