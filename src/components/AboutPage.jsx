import React from "react";
import { FileText, Users, Info } from "lucide-react";

export default function AboutPage() {
  const team = [
    { name: "Siddesh", role: "Developer" },
    { name: "Harsh", role: "Developer" },
    { name: "Saurav", role: "Developer" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-8 sm:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            About CityCare
          </h1>
        </div>

        {/* Project Info */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            CityCare is a citizen-driven platform designed to streamline how urban issues
            like potholes, sanitation, and infrastructure problems are reported and resolved.
            It bridges the gap between citizens and authorities — encouraging collaboration
            and accountability to make cities smarter and cleaner.
          </p>
        </div>

        {/* Team Members */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">Project Team</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <h3 className="text-sm font-semibold text-gray-900">{member.name}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-5 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} CityCare Project — Built with ❤️ by our team.
          </p>
        </div>
      </div>
    </div>
  );
}
