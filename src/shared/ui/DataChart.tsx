import Box from "@mui/material/Box";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

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
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <ChartTooltip />
                        <Legend />
                    </PieChart>
                ) : (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="month" hide={hideAxes} />
                        <YAxis hide={hideAxes} />
                        <ChartTooltip />
                        <Area type="monotone" dataKey="users" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                        <Area type="monotone" dataKey="applications" stroke="#34D399" fill="#34D399" fillOpacity={0.1} />
                    </AreaChart>
                )}
            </ResponsiveContainer>
        </Box>
    );
}
