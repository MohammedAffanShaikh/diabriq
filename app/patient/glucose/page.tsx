"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Droplet,
  Plus,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Activity,
  Clock,
  Radio,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import { useDataContext } from "@/lib/context/DataContext";
import { GlucoseReadingType } from "@/lib/types";

export default function GlucoseMonitoringPage() {
  const {
    glucoseReadings,
    addGlucoseReading,
    deleteGlucoseReading,
    glucoseStats,
    notifications,
  } = useDataContext();

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "08:00 AM",
    value: 120,
    readingType: "Fasting" as GlucoseReadingType,
    notes: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value || formData.value <= 0 || formData.value > 600) {
      setFormError("Please enter a valid glucose value between 1 and 600 mg/dL.");
      return;
    }
    setFormError(null);

    addGlucoseReading({
      date: formData.date,
      time: formData.time,
      value: Number(formData.value),
      readingType: formData.readingType,
      notes: formData.notes,
    });

    setShowAddModal(false);
    setToastMessage(`Logged ${formData.readingType} reading of ${formData.value} mg/dL.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered readings table
  const filteredReadings =
    filterType === "All"
      ? glucoseReadings
      : glucoseReadings.filter((r) => r.readingType === filterType);

  // Prepare chart data chronologically (reversed)
  const chartData = [...glucoseReadings]
    .reverse()
    .map((r) => ({
      date: `${r.date.slice(5)} ${r.time}`,
      value: r.value,
      type: r.readingType,
      targetHigh: 180,
      targetLow: 70,
    }));

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="patient"
      title="Glucose Monitoring & CGM Metrics"
      subtitle="Diabetes Monitoring Dashboard"
      unreadNotifications={unreadNotifications}
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Blood Glucose Tracker</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Log readings, analyze Time-in-Range (TIR) metrics, and monitor trends
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>
          Record Glucose Reading
        </Button>
      </div>

      {/* SECTION 1: SUMMARY STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Latest</p>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {glucoseReadings[0] ? `${glucoseReadings[0].value}` : "—"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {glucoseReadings[0] ? `${glucoseReadings[0].readingType}` : "No entries"}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Average</p>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {glucoseStats.averageGlucose > 0 ? `${glucoseStats.averageGlucose}` : "—"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">mg/dL overall</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Fasting Avg</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {glucoseStats.fastingAvg > 0 ? `${glucoseStats.fastingAvg}` : "—"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Target &lt; 130</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Post-Meal Avg</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">
            {glucoseStats.postMealAvg > 0 ? `${glucoseStats.postMealAvg}` : "—"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Target &lt; 180</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Minimum</p>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {glucoseStats.minGlucose > 0 ? `${glucoseStats.minGlucose}` : "—"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">mg/dL lowest</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Maximum</p>
          <p className="text-xl font-bold text-amber-600 mt-1">
            {glucoseStats.maxGlucose > 0 ? `${glucoseStats.maxGlucose}` : "—"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">mg/dL peak</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Readings</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{glucoseStats.readingCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Logged entries</p>
        </div>
      </div>

      {/* SECTION 2: TIME-IN-RANGE (TIR) RESEARCH FEATURE */}
      <Card className="mb-6 border-blue-200 bg-gradient-to-r from-slate-900 to-blue-950 text-white">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-white text-base">Time-In-Range (TIR) Analytics</CardTitle>
              <span className="bg-blue-500/30 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-400/30">
                Prototype / Simulated CGM Metric
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Standardized glucose metrics derived from current patient logs (Target Range: 70 – 180 mg/dL)
            </p>
          </div>
          <Activity size={22} className="text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 my-2">
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Time in Range (70-180 mg/dL)</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{glucoseStats.inRangePercent}%</p>
              <p className="text-[11px] text-emerald-200 mt-0.5">Target: &gt; 70% of readings</p>
            </div>

            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Time Above Range (&gt;180 mg/dL)</p>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">{glucoseStats.aboveRangePercent}%</p>
              <p className="text-[11px] text-amber-200 mt-0.5">Target: &lt; 25% of readings</p>
            </div>

            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-red-300 uppercase tracking-wider">Time Below Range (&lt;70 mg/dL)</p>
              <p className="text-3xl font-extrabold text-red-400 mt-1">{glucoseStats.belowRangePercent}%</p>
              <p className="text-[11px] text-red-200 mt-0.5">Target: &lt; 4% of readings</p>
            </div>
          </div>
          <p className="text-[11px] text-blue-300 italic mt-2 text-center">
            * This simulation demonstrates standardized CGM metrics to support future device connectivity integrations.
          </p>
        </CardContent>
      </Card>

      {/* SECTION 3: TREND CHART & CGM MOCK */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Glucose Trend Over Time</CardTitle>
              <p className="text-xs text-slate-500">Chronological plot with target range limits (70-180 mg/dL)</p>
            </CardHeader>
            <CardContent>
              {chartData.length < 2 ? (
                <div className="py-16 text-center text-slate-400 italic">
                  No sufficient data available for trend analysis.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={[40, 250]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <ReferenceLine y={180} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Upper Target (180)", fontSize: 10, fill: "#f59e0b" }} />
                    <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Lower Target (70)", fontSize: 10, fill: "#ef4444" }} />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb" }} name="Glucose (mg/dL)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FUTURE CGM INTEGRATION MOCK */}
        <div>
          <Card className="h-full border-slate-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Radio size={16} className="text-blue-600 animate-pulse" />
                  Connected Glucose Monitoring
                </CardTitle>
                <Badge variant="slate" dot={false} className="text-[9px]">Mock Architecture</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Device Status:</span>
                  <span className="font-semibold text-slate-900">Demo Sensor v2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Connection:</span>
                  <span className="font-semibold text-emerald-600">Simulation Mode</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Last Sync:</span>
                  <span className="text-slate-700">10:32 AM</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500 font-medium">Latest Reading:</span>
                  <span className="font-extrabold text-blue-700 text-sm">
                    {glucoseReadings[0] ? `${glucoseReadings[0].value} mg/dL` : "128 mg/dL"}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                <p className="font-bold mb-0.5">Architecture Path Note</p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Simulation only — no real medical device connected. Demonstrates architectural readiness for future continuous glucose monitor integrations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 4: READINGS HISTORY TABLE WITH FILTER */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Glucose Log History</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">View and manage all recorded entries</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Fasting">Fasting</option>
              <option value="Before Meal">Before Meal</option>
              <option value="After Meal">After Meal</option>
              <option value="Random">Random</option>
            </select>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Glucose Value</th>
                <th>Reading Type</th>
                <th>Evaluation</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReadings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                    No glucose readings match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredReadings.map((reading) => {
                  const isHigh = reading.value > 180;
                  const isLow = reading.value < 70;
                  return (
                    <tr key={reading.id} className="hover:bg-slate-50 transition-colors">
                      <td className="font-medium text-slate-900 text-xs">
                        {reading.date} · {reading.time}
                      </td>
                      <td>
                        <span className="text-sm font-bold text-slate-900">{reading.value} mg/dL</span>
                      </td>
                      <td>
                        <Badge variant="blue" dot={false} className="text-[10px]">
                          {reading.readingType}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          variant={isHigh ? "amber" : isLow ? "red" : "green"}
                          dot
                        >
                          {isHigh ? "Above Range" : isLow ? "Below Range" : "In Range"}
                        </Badge>
                      </td>
                      <td className="text-slate-600 text-xs">{reading.notes || "—"}</td>
                      <td>
                        <button
                          onClick={() => deleteGlucoseReading(reading.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ADD READING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="text-red-500" size={20} />
                <h3 className="text-lg font-bold text-slate-900">Record Glucose Reading</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Reading Type</label>
                <select
                  value={formData.readingType}
                  onChange={(e) => setFormData({ ...formData, readingType: e.target.value as GlucoseReadingType })}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Fasting">Fasting (Morning before food)</option>
                  <option value="Before Meal">Before Meal</option>
                  <option value="After Meal">After Meal (2 hrs post meal)</option>
                  <option value="Random">Random</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Blood Glucose Value (mg/dL)</label>
                <input
                  type="number"
                  min={20}
                  max={600}
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="w-full text-lg font-bold border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 08:30 AM"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes / Observations (Optional)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Post lunch walking, feeling normal"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" icon={<Plus size={15} />}>
                  Save Reading & Update State
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
