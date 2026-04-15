"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/app/components/ui/chart"

interface ExpenseData {
  category: string
  amount: number
}

export function ExpenseByCategoryChart({ data = [] }: { data: ExpenseData[] }) {
  // 1. Procesamos los datos y la configuración
  const { chartConfig, processedData } = React.useMemo(() => {
    const config: ChartConfig = {
      amount: { label: "Gasto" }
    }
    
    const processed = data.map((item, index) => {
      // Creamos una clave única para la configuración basada en el nombre de la categoría
      const configKey = item.category.toLowerCase().replace(/\s+/g, "_")
      
      // Asignamos colores rotativos de shadcn (chart-1 al chart-5)
      const colorIndex = (index % 5) + 1
      
      config[configKey] = {
        label: item.category, // Este es el nombre que saldrá en la leyenda
        color: `var(--chart-${colorIndex})`,
      }

      return {
        categoryName: item.category, // Guardamos el nombre original
        amount: item.amount,
        fill: `var(--chart-${colorIndex})`, // Usamos directamente la variable de color
        configKey: configKey // Referencia para la leyenda
      }
    })

    return { chartConfig: config, processedData: processed }
  }, [data])

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[400px] w-full pb-0"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie 
          data={processedData} 
          dataKey="amount" 
          nameKey="configKey"
          stroke="hsl(var(--background))"
          strokeWidth={2}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="configKey" />}
          className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
        />
      </PieChart>
    </ChartContainer>
  )
}

export default ExpenseByCategoryChart;