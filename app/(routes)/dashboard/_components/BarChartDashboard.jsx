import React from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function BarChartDashboard({ budgetList }) {
  // Preprocess the data to adjust the amount values
  const adjustedBudgetList = budgetList.map(item => ({
    ...item,
    adjustedAmount: item.amount - item.totalSpend,
  }));

  return (
    <div className='border rounded-lg p-5'>
      <h2 className='font-bold text-lg'>Activity</h2>
      <ResponsiveContainer width={'80%'} height={300}>
        <BarChart
          data={adjustedBudgetList}
          margin={{
            top: 7,
          }}
        >
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='totalSpend' stackId="a" fill='#4845d2' />
          <Bar dataKey='adjustedAmount' stackId="a" fill='#C3C2FF' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartDashboard;
