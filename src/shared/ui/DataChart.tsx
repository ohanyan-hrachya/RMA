import Box from "@mui/material/Box";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// Use shades of Emerald and Slate for consistency
const PIE_COLORS = ["#10B981", "#34D399", "#059669", "#064E3B", "#1E293B", "#334155"];

interface DataChartProps {
    type: "area" | "pie";
    data: any[];
    height?: number | string;
    hideAxes?: boolean;
}

export function DataChart({ type, data, height = 260, hideAxes }: DataChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <Box sx={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                {type === 'pie' ? (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                            paddingAngle={5} dataKey="value"
                        >
                            {data.map((_: any, i: number) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                            ))}
                        </Pie>
                        <ChartTooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend iconType="circle" />
                    </PieChart>
                ) : (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                        <XAxis
                            dataKey="month"
                            hide={hideAxes}
                            tick={{ fontSize: 12, fill: '#94A3B8' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            hide={hideAxes}
                            tick={{ fontSize: 12, fill: '#94A3B8' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <ChartTooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        {/* Users - Emerald */}
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#10B981"
                            strokeWidth={3}
                            fill="#10B981"
                            fillOpacity={0.15}
                        />
                        {/* Applications - Soft Mint */}
                        <Area
                            type="monotone"
                            dataKey="applications"
                            stroke="#34D399"
                            strokeWidth={3}
                            fill="#34D399"
                            fillOpacity={0.1}
                        />
                    </AreaChart>
                )}
            </ResponsiveContainer>
        </Box>
    );
}
