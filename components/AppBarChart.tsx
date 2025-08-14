"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { useState } from "react";

interface AppBarChartProps {
  chartData: { month: string; income: number; expense: number }[];
}

export const AppBarChart = ({ chartData }: AppBarChartProps) => {
  const years = [
    ...new Set(
      chartData.map((data) => {
        return data.month.split("/")[1];
      })
    ),
  ];

  const [selectedYear, setSelectedYear] = useState(years[0]);
  let dataByYear = chartData.filter(
    (item) => item.month.split("/")[1] === selectedYear
  );
  const [data, setData] = useState(dataByYear);

  function handler(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setSelectedYear(value);

    dataByYear = chartData.filter((item) => item.month.split("/")[1] === value);
    setData(dataByYear);
  }

  const chartConfig = {
    income: {
      label: "Entrada",
      color: "#8884d8",
    },
    expense: {
      label: "Saída",
      color: "#82ca9d",
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-full shadow-sm border border-gray-200 rounded-xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Entradas vs Saídas
        </CardTitle>
        {years.length > 0 && (
          <select
            name="years"
            id="years"
            onChange={handler}
            value={selectedYear}
            className="rounded-md px-3 py-2 text-sm border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {years.map((year) => (
              <option value={year} key={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </CardHeader>
      <CardContent className="h-[400px] flex items-center justify-center">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-gray-600"
              tickFormatter={(value) => value.slice(0, 7)}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="income" fill="#10b981" radius={4} />
            <Bar dataKey="expense" fill="#ef4444" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
