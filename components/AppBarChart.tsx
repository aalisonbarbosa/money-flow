"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

export const AppBarChart = ({ data }: { data: any[] }) => {
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
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Entradas vs Saídas
        </CardTitle>
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
