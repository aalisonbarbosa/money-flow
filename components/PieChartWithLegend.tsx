"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

interface propsData {
  name: string;
  value: number;
}

export const PieChartWithLegend = ({
  data,
  config,
}: {
  data: propsData[];
  config: ChartConfig;
}) => {
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

  const colors = generateColors(data.length);

  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: colors[index],
  }));
  return (
    <Card className="flex flex-col w-96">
      <CardHeader className="items-center pb-0">
        <CardTitle>Visão Geral</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={dataWithColors} dataKey="value" nameKey="name" minAngle={5}/>
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
