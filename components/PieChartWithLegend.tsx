"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { Pie, PieChart } from "recharts";

interface propsData {
  chartData: {
    name: string;
    value: number;
  }[];
  categories: ({
    name: string;
    id: string;
    type: string;
  } | null)[];
}

export const PieChartWithLegend = ({
  incomeResult,
  expenseResult,
}: {
  incomeResult: propsData;
  expenseResult: propsData;
}) => {
  const [transactionType, setTransactionType] = useState("income");
  const [categories, setCategories] = useState(incomeResult.categories);
  const [data, setData] = useState(incomeResult.chartData);

  function handler(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setTransactionType(value);

    if (value === "income") {
      const incomeCategories = incomeResult.categories;
      const incomeChartData = incomeResult.chartData;

      setData(incomeChartData);
      setCategories(incomeCategories);
    } else {
      const expenseCategories = expenseResult.categories;
      const expenseChartData = expenseResult.chartData;

      setData(expenseChartData);
      setCategories(expenseCategories);
    }
  }

  console.log(data, categories);

  const colors = generateColors(data.length);

  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: colors[index],
  }));

  const config: ChartConfig = categories.reduce((acc, item) => {
    if (item) {
      acc[item.name] = { label: item.name };
    }
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col w-96">
      <CardHeader className="flex justify-between items-center pb-0">
        <CardTitle>Visão Geral</CardTitle>
        <div>
          <select
            name="transactionType"
            id="transactionType"
            onChange={handler}
            value={transactionType}
            className="rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-900"
          >
            <option value="income">Entrada</option>
            <option value="expense">Saída</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={dataWithColors}
              dataKey="value"
              nameKey="name"
              minAngle={5}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

function generateColors(count: number): string[] {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#888888",
    "#ffbb28",
    "#ff8042",
    "#b8860b",
    "#00bcd4",
    "#e91e63",
    "#4caf50",
    "#f44336",
    "#9c27b0",
    "#03a9f4",
    "#ff5722",
    "#cddc39",
    "#607d8b",
    "#795548",
    "#673ab7",
    "#009688",
    "#3f51b5",
    "#cd5c5c",
    "#7b68ee",
    "#ff1493",
    "#adff2f",
    "#ff6347",
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
}
