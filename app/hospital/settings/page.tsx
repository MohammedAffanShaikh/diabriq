"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw, Shield, Save } from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";
import { useState } from "react";

export default function HospitalSettingsPage() {
  const { resetAllDemoData, notifications } = useDataContext();
  const [msg, setMsg] = useState<string | null>(null);

  const handleReset = () => {
    resetAllDemoData();
    setMsg("All demo data, local storage logs, and appointments reset to initial state.");
    setTimeout(() => setMsg(null), 3500);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout role="hospital" title="Hospital Settings" unreadNotifications={unreadCount}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Hospital Platform Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Configure operational preferences and reset demo state</p>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg mb-4 font-semibold">
          {msg}
        </div>
      )}

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <RefreshCw size={16} className="text-blue-600" /> Demo Data & Storage Reset
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Resetting local data restores all default demo patient profiles, glucose logs, queue tokens, bed statuses, and staff rosters.
          </p>
          <Button variant="outline" icon={<RefreshCw size={14} />} onClick={handleReset}>
            Reset LocalStorage Demo State
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
