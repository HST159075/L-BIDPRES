"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from "recharts";

interface AnalyticsChartsProps {
  data: any[];
  type?: "bar" | "line" | "area" | "pie";
  title?: string;
}

export function AnalyticsCharts({ data, type = "bar", title }: AnalyticsChartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center border border-dashed rounded-2xl text-muted-foreground">
        No data available for chart
      </div>
    );
  }

  const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
      {title && <h3 className="text-lg font-bold mb-6">{title}</h3>}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--color-card)", 
                  borderRadius: "12px", 
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }} 
              />
              <Bar dataKey="value" fill="var(--color-bid-500)" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="var(--color-bid-500)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          ) : type === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-bid-500)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-bid-500)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="var(--color-bid-500)" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
            </AreaChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
