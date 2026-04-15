"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/app/components/ui/chart"

// Supongamos que recibes los colores como props o desde un store
interface ChartProps {
  data: any[];
  primaryColor?: string;
  secondaryColor?: string;
}

export function MonthlyBalanceChart({ data, primaryColor, secondaryColor }: ChartProps) {
  
  // Configuramos el gráfico para usar las variables de shadcn
  const chartConfig = {
    income: {
      label: "Ingresos",
      color: primaryColor || "var(--chart-1)", // Usa el color elegido o el default
    },
    expenses: {
      label: "Gastos",
      color: secondaryColor || "var(--chart-2)",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="w-full h-full min-h-[300px]">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export default MonthlyBalanceChart;