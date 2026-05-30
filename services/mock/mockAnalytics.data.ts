import { AnalyticsData } from "@/types/entities/analytics.types";

// Mock data
export const mockAnalyticsData: AnalyticsData = {
  revenue: {
    total: 125000,
    change: { value: 12.5, trend: "up" },
    series: [
      { label: "Week 1", value: 25000 },
      { label: "Week 2", value: 30000 },
      { label: "Week 3", value: 35000 },
      { label: "Week 4", value: 35000 },
    ],
  },
  appointments: {
    total: 420,
    change: { value: 8.2, trend: "up" },
    completed: 350,
    cancelled: 45,
    noShowCount: 25,
  },
  noShowRate: {
    value: 6.1,
    change: { value: -1.2, trend: "down" },
  },
  serviceBreakdown: [
    {
      id: "1",
      name: "Consultation",
      count: 200,
      percentage: 47,
      revenue: 60000,
    },
    {
      id: "2",
      name: "Lab Tests",
      count: 120,
      percentage: 28,
      revenue: 35000,
    },
    {
      id: "3",
      name: "Imaging",
      count: 100,
      percentage: 25,
      revenue: 30000,
    },
  ],
  monthlyData: {
    data: [
      { label: "Jan", appointments: 100, revenue: 20000 },
      { label: "Feb", appointments: 120, revenue: 25000 },
      { label: "Mar", appointments: 200, revenue: 40000 },
    ],
  },
  peakHours: [
    { hour: 9, count: 40 },
    { hour: 11, count: 60 },
    { hour: 15, count: 80 },
    { hour: 17, count: 50 },
  ],
}