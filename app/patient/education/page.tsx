"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Droplet,
  Calendar,
  Apple,
  Activity,
  Pill,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { useDataContext } from "@/lib/context/DataContext";

const educationalCategories = [
  {
    id: "cat-1",
    title: "Understanding Diabetes",
    icon: <BookOpen className="text-blue-600" size={20} />,
    color: "bg-blue-50 border-blue-200 text-blue-900",
    articles: [
      {
        heading: "What is Type 2 Diabetes?",
        content:
          "Type 2 diabetes is a chronic metabolic condition where your body either doesn't produce enough insulin or becomes resistant to insulin. Managing blood sugar levels helps prevent long-term microvascular and macrovascular complications.",
      },
      {
        heading: "Understanding HbA1c Levels",
        content:
          "HbA1c reflects your average blood glucose over the past 2 to 3 months. For most adults with diabetes, a general HbA1c target is under 7.0%, though individual targets should be discussed with your physician.",
      },
    ],
  },
  {
    id: "cat-2",
    title: "Glucose Monitoring Guidelines",
    icon: <Droplet className="text-red-500" size={20} />,
    color: "bg-red-50 border-red-200 text-red-900",
    articles: [
      {
        heading: "When to Check Blood Glucose",
        content:
          "Standard monitoring times include fasting (upon waking), before main meals, 2 hours post-meal, and before bedtime. Consistent tracking provides your doctor with valuable trend insights.",
      },
      {
        heading: "Time-in-Range (TIR) Basics",
        content:
          "Time-in-Range measures the percentage of time blood glucose stays within target bounds (typically 70 to 180 mg/dL). Clinical guidelines recommend aiming for greater than 70% Time-in-Range.",
      },
    ],
  },
  {
    id: "cat-3",
    title: "Appointment Preparation",
    icon: <Calendar className="text-indigo-600" size={20} />,
    color: "bg-indigo-50 border-indigo-200 text-indigo-900",
    articles: [
      {
        heading: "Preparing for Your OPD Consultation",
        content:
          "Bring your recent glucose log, medication list, and any questions. Note down any unexpected high or low readings to review with your endocrinologist during your OPD appointment.",
      },
    ],
  },
  {
    id: "cat-4",
    title: "Nutrition Education",
    icon: <Apple className="text-emerald-600" size={20} />,
    color: "bg-emerald-50 border-emerald-200 text-emerald-900",
    articles: [
      {
        heading: "Carbohydrate Management & Meal Balance",
        content:
          "Focus on complex carbohydrates with high fiber (whole grains, pulses, fresh vegetables). Balance meals with lean protein and healthy fats to stabilize post-meal glucose spikes.",
      },
    ],
  },
  {
    id: "cat-5",
    title: "Physical Activity & Fitness",
    icon: <Activity className="text-teal-600" size={20} />,
    color: "bg-teal-50 border-teal-200 text-teal-900",
    articles: [
      {
        heading: "Exercise Best Practices for Diabetes",
        content:
          "Aim for 150 minutes of moderate aerobic activity per week (such as brisk walking). Physical activity improves insulin sensitivity. Check glucose levels before and after exercise.",
      },
    ],
  },
  {
    id: "cat-6",
    title: "Medication Safety",
    icon: <Pill className="text-amber-600" size={20} />,
    color: "bg-amber-50 border-amber-200 text-amber-900",
    articles: [
      {
        heading: "Adherence & Timing",
        content:
          "Take oral hypoglycemic agents or insulin exactly as prescribed by your physician. Never alter doses without direct medical advice from your endocrinologist.",
      },
    ],
  },
  {
    id: "cat-7",
    title: "When to Contact a Healthcare Professional",
    icon: <PhoneCall className="text-rose-600" size={20} />,
    color: "bg-rose-50 border-rose-200 text-rose-900",
    articles: [
      {
        heading: "Recognizing Red Flags & Hypoglycemia",
        content:
          "Seek prompt medical attention if you experience severe low blood glucose (< 70 mg/dL accompanied by shakiness/confusion), persistent high glucose (> 250 mg/dL with nausea/vomiting), or foot wounds.",
      },
    ],
  },
];

export default function PatientEducationPage() {
  const { notifications } = useDataContext();
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="patient"
      title="Diabetes Education Portal"
      subtitle="Patient Self-Care & Educational Resources"
      unreadNotifications={unreadNotifications}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Diabetes Self-Care & Education</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Non-diagnostic educational materials to help you understand glucose tracking, nutrition, and appointment preparation
        </p>
      </div>

      <div className="space-y-6">
        {educationalCategories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader className="flex-row items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100">{cat.icon}</div>
              <CardTitle className="text-base">{cat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {cat.articles.map((art, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{art.heading}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{art.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
