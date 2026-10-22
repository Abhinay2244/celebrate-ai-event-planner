import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatINR } from '../../utils/budget';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface BudgetPieChartProps {
  data: ChartDataItem[];
  totalBudget: number;
}

const BudgetPieChart: React.FC<BudgetPieChartProps> = ({ data, totalBudget }) => {
  return (
    <div className="h-64 sm:h-72 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
            stroke="transparent"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#fff"
                strokeWidth={2}
                className="cursor-pointer transition-all duration-300"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: unknown) => [formatINR(Number(val) || 0), 'Allocated']}
            contentStyle={{
              backgroundColor: 'rgba(22, 26, 56, 0.95)',
              borderColor: 'rgba(221, 160, 146, 0.3)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
            itemStyle={{ color: '#dda092' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Total Metric */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
          Total Target
        </span>
        <span className="font-serif text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-0.5">
          {formatINR(totalBudget)}
        </span>
      </div>
    </div>
  );
};

export default BudgetPieChart;
