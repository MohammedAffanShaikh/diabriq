"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, ApproveRejectButtons } from "@/components/ui/button";
import { AIBadge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import {
  Activity,
  AlertTriangle,
  Bed,
  CheckCircle2,
  Hospital,
  Info,
  Network,
  TrendingUp,
  Users,
  Zap,
  Calendar,
  Clock,
  Stethoscope,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { hospitals, capacityTrend, aiRecommendations, networkHospitalTable, flowData } from "@/lib/mockData";
import { getCapacityColor } from "@/lib/utils";

const mainHospital = hospitals[0];

export default function HospitalDashboard() {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [recs, setRecs] = useState(aiRecommendations);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const clickedHospital = hospitals.find((h) => h.id === selectedHospital);

  return (
    <DashboardLayout
      role="hospital"
      title="Hospital Operations"
      subtitle="City Diabetes Centre · Bandra West, Mumbai"
      unreadNotifications={2}
    >
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-slate-900">City Diabetes Centre</h2>
            <Badge variant="green" dot>Operational</Badge>
          </div>
          <p className="text-sm text-slate-500">Bandra West, Mumbai · Thursday, 24 Sep 2026</p>
        </div>
        <div className="hidden md:block text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2">
          Last updated: <span className="font-medium text-slate-700">10:58 AM</span>
        </div>
      </div>

      {/* Capacity cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          {
            label: "OPD Capacity",
            value: "82%",
            sub: "184 appointments",
            accent: "amber",
            icon: <Activity size={18} className="text-amber-600" />,
            bg: "bg-amber-50 border-amber-200",
          },
          {
            label: "Beds Available",
            value: "18",
            sub: "of 35 total",
            accent: "blue",
            icon: <Bed size={18} className="text-blue-600" />,
            bg: "bg-blue-50 border-blue-200",
          },
          {
            label: "Doctors On-duty",
            value: "12",
            sub: "3 on break",
            accent: "teal",
            icon: <Stethoscope size={18} className="text-teal-600" />,
            bg: "bg-teal-50 border-teal-200",
          },
          {
            label: "Walk-ins",
            value: "27",
            sub: "Today",
            accent: "violet",
            icon: <Users size={18} className="text-violet-600" />,
            bg: "bg-violet-50 border-violet-200",
          },
          {
            label: "Cancelled Slots",
            value: "9",
            sub: "4 unfilled",
            accent: "red",
            icon: <Calendar size={18} className="text-red-600" />,
            bg: "bg-red-50 border-red-200",
          },
          {
            label: "Avg Wait",
            value: "18 min",
            sub: "OPD average",
            accent: "green",
            icon: <Clock size={18} className="text-emerald-600" />,
            bg: "bg-emerald-50 border-emerald-200",
          },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl border p-4 shadow-sm ${s.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Network map + bottleneck */}
        <div className="lg:col-span-2 space-y-6">
          {/* City Network Map */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Mumbai Diabetes Network</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Click any hospital to view details</p>
              </div>
              <Badge variant="blue" dot={false}>5 Connected Facilities</Badge>
            </CardHeader>
            <CardContent>
              <NetworkMap
                hospitals={hospitals}
                selected={selectedHospital}
                onSelect={setSelectedHospital}
              />

              {/* Selected hospital popup */}
              {clickedHospital && (
                <div className="mt-4 bg-slate-50 rounded-xl border border-slate-200 p-4 animate-fade-in">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-900">{clickedHospital.name}</p>
                      <p className="text-xs text-slate-500">{clickedHospital.area} · {clickedHospital.city}</p>
                    </div>
                    <Badge
                      variant={
                        clickedHospital.status === "operational"
                          ? "green"
                          : clickedHospital.status === "high-load"
                          ? "amber"
                          : "red"
                      }
                      dot
                    >
                      {clickedHospital.status === "operational"
                        ? "Operational"
                        : clickedHospital.status === "high-load"
                        ? "High Load"
                        : "Critical"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                      { label: "OPD Load", value: `${clickedHospital.opdCapacityPercent}%` },
                      { label: "Slots", value: clickedHospital.availableSlots },
                      { label: "Beds", value: clickedHospital.bedsAvailable.general + clickedHospital.bedsAvailable.icu + clickedHospital.bedsAvailable.observation },
                      { label: "Wait", value: `${clickedHospital.avgWaitMinutes} min` },
                    ].map((m, i) => (
                      <div key={i} className="bg-white rounded-lg p-2.5 border border-slate-200">
                        <p className="text-sm font-bold text-slate-900">{m.value}</p>
                        <p className="text-[10px] text-slate-500">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Capacity Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>OPD Capacity Trend — Today</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={capacityTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="capacityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="waitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Area type="monotone" dataKey="capacity" stroke="#3b82f6" strokeWidth={2} fill="url(#capacityGrad)" name="Capacity %" />
                  <Area type="monotone" dataKey="wait" stroke="#f59e0b" strokeWidth={2} fill="url(#waitGrad)" name="Wait (min)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* OPD Bottleneck */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                Operational Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recs.slice(0, 2).map((rec) => (
                <div
                  key={rec.id}
                  className={`rounded-xl border p-4 ${
                    rec.status === "approved"
                      ? "border-emerald-200 bg-emerald-50"
                      : rec.status === "rejected"
                      ? "border-slate-200 bg-slate-50 opacity-60"
                      : "border-amber-200 bg-amber-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{rec.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{rec.description}</p>
                    </div>
                    {rec.status === "pending" && <AIBadge />}
                    {rec.status === "approved" && <Badge variant="green" dot>Approved</Badge>}
                    {rec.status === "rejected" && <Badge variant="slate" dot>Rejected</Badge>}
                  </div>
                  <ul className="space-y-1 mb-3">
                    {rec.reason.map((r, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="shrink-0 text-amber-500 mt-0.5">›</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                  {rec.status === "pending" && (
                    <ApproveRejectButtons
                      onApprove={() => {
                        setRecs((prev) =>
                          prev.map((r) => (r.id === rec.id ? { ...r, status: "approved" } : r))
                        );
                        showToast("Action approved and logged in audit trail.");
                      }}
                      onReject={() =>
                        setRecs((prev) =>
                          prev.map((r) => (r.id === rec.id ? { ...r, status: "rejected" } : r))
                        )
                      }
                    />
                  )}
                  {rec.status === "approved" && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 size={13} />
                      Approved and logged.
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right — Beds + Cross-hospital slots */}
        <div className="space-y-6">
          {/* Bed Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed size={16} className="text-slate-500" />
                Bed Availability
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Operational information — does not determine clinical suitability
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 -mx-5">
                {/* Header */}
                <div className="grid grid-cols-5 px-5 py-2 text-[10px] font-semibold text-slate-400 uppercase bg-slate-50 border-y border-slate-100">
                  <div className="col-span-2">Hospital</div>
                  <div className="text-center">Gen.</div>
                  <div className="text-center">ICU</div>
                  <div className="text-center">Obs.</div>
                </div>
                {hospitals.map((h) => (
                  <div
                    key={h.id}
                    className="grid grid-cols-5 px-5 py-3 border-b border-slate-100 items-center text-sm"
                  >
                    <div className="col-span-2">
                      <p className="text-xs font-medium text-slate-900 truncate">{h.name}</p>
                      <Badge
                        variant={
                          h.status === "operational"
                            ? "green"
                            : h.status === "high-load"
                            ? "amber"
                            : "red"
                        }
                        dot
                        className="text-[9px] mt-0.5"
                      >
                        {h.status === "operational" ? "OK" : h.status === "high-load" ? "High" : "Critical"}
                      </Badge>
                    </div>
                    <div className="text-center font-semibold text-slate-900">{h.bedsAvailable.general}</div>
                    <div className="text-center font-semibold text-slate-900">{h.bedsAvailable.icu}</div>
                    <div className="text-center font-semibold text-slate-900">{h.bedsAvailable.observation}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cross-hospital slot sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network size={16} className="text-blue-500" />
                Cross-Hospital Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-blue-800 mb-1">Nearby Connected Capacity Available</p>
                <p className="text-xs text-blue-700">
                  4 suitable appointment windows available across connected facilities.
                </p>
              </div>
              <div className="space-y-2">
                {[
                  { hospital: "Metro Hospital", slots: 2, wait: "14 min" },
                  { hospital: "Community Health", slots: 2, wait: "11 min" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2.5">
                    <div>
                      <p className="text-xs font-medium text-slate-900">{item.hospital}</p>
                      <p className="text-[10px] text-slate-500">{item.wait} avg wait</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="green" dot>{item.slots} slots</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-3">
                This is appointment coordination, not clinical referral advice. Patient consent required.
              </p>
            </CardContent>
          </Card>

          {/* OPD Doctors */}
          <Card>
            <CardHeader>
              <CardTitle>Doctors On-Duty</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { name: "Dr. Ayesha Khan", specialty: "Endocrinology", room: "OPD 02", status: "available", patients: 11 },
                { name: "Dr. Rajesh Sharma", specialty: "Diabetology", room: "OPD 03", status: "available", patients: 8 },
                { name: "Dr. Meera Iyer", specialty: "Internal Medicine", room: "OPD 04", status: "available", patients: 5 },
                { name: "Dr. Anil Bose", specialty: "Endocrinology", room: "OPD 01", status: "break", patients: 0 },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{doc.name}</p>
                    <p className="text-[10px] text-slate-500">{doc.specialty} · {doc.room}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={doc.status === "available" ? "green" : "amber"} dot className="text-[9px]">
                      {doc.status === "available" ? `${doc.patients} waiting` : "On Break"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function NetworkMap({
  hospitals,
  selected,
  onSelect,
}: {
  hospitals: typeof import("@/lib/mockData").hospitals;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  // Positions for 5 hospital nodes in a network layout
  const positions = [
    { id: "h1", x: 200, y: 160, label: "City Diabetes\nCentre" },
    { id: "h2", x: 340, y: 80, label: "Metro\nHospital" },
    { id: "h3", x: 340, y: 240, label: "Central\nHospital" },
    { id: "h4", x: 80, y: 80, label: "Community\nHealth Centre" },
    { id: "h5", x: 80, y: 240, label: "Sunrise\nHospital" },
  ];

  const edges = [
    ["h1", "h2"],
    ["h1", "h3"],
    ["h1", "h4"],
    ["h1", "h5"],
    ["h2", "h3"],
    ["h4", "h5"],
  ];

  const statusColors = {
    operational: { fill: "#d1fae5", stroke: "#10b981", text: "#065f46" },
    "high-load": { fill: "#fef3c7", stroke: "#f59e0b", text: "#92400e" },
    critical: { fill: "#fee2e2", stroke: "#ef4444", text: "#7f1d1d" },
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
      <svg viewBox="0 0 440 320" className="w-full" style={{ maxHeight: 280 }}>
        {/* Background */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="#e2e8f0" />
          </pattern>
        </defs>
        <rect width="440" height="320" fill="url(#grid)" />

        {/* Title */}
        <text x="220" y="22" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">
          Mumbai Diabetes Network
        </text>

        {/* Edges */}
        {edges.map(([a, b], i) => {
          const posA = positions.find((p) => p.id === a)!;
          const posB = positions.find((p) => p.id === b)!;
          return (
            <line
              key={i}
              x1={posA.x}
              y1={posA.y}
              x2={posB.x}
              y2={posB.y}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          );
        })}

        {/* Nodes */}
        {positions.map((pos) => {
          const hospital = hospitals.find((h) => h.id === pos.id);
          if (!hospital) return null;
          const colors = statusColors[hospital.status];
          const isSelected = selected === pos.id;

          return (
            <g
              key={pos.id}
              onClick={() => onSelect(pos.id)}
              className="cursor-pointer"
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 32 : 28}
                fill={colors.fill}
                stroke={isSelected ? colors.stroke : colors.stroke}
                strokeWidth={isSelected ? 3 : 1.5}
                opacity={0.9}
              />
              {isSelected && (
                <circle cx={pos.x} cy={pos.y} r={38} fill="none" stroke={colors.stroke} strokeWidth={1} opacity={0.3} />
              )}
              <text
                x={pos.x}
                y={pos.y - 4}
                textAnchor="middle"
                fontSize="8"
                fill={colors.text}
                fontWeight="600"
              >
                {hospital.name.split(" ")[0]}
              </text>
              <text
                x={pos.x}
                y={pos.y + 6}
                textAnchor="middle"
                fontSize="7"
                fill={colors.text}
              >
                {hospital.availableSlots > 0 ? `${hospital.availableSlots} slots` : "Full"}
              </text>
              <text
                x={pos.x}
                y={pos.y + 16}
                textAnchor="middle"
                fontSize="7"
                fill={colors.text}
                opacity={0.7}
              >
                {hospital.opdCapacityPercent}% load
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
