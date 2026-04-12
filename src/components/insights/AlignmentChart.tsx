"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface Props {
  data: {
    category: string;
    score: number;
    fullMark: number;
  }[];
}

export default function AlignmentChart({ data }: Props) {
  // Map category names to shorter versions for mobile if needed
  const chartData = data.map(d => ({
    subject: d.category.split("&")[0].trim(), // e.g. "Spiritual & Values" -> "Spiritual"
    A: d.score,
    fullMark: 100
  }));

  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="var(--on-surface-variant)" strokeOpacity={0.1} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "var(--on-surface-variant)", fontSize: 12, fontWeight: "bold" }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Alignment"
            dataKey="A"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.4}
            animationDuration={1500}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
