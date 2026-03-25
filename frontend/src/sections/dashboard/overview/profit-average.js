import React, { useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material';
import { purchaseOrderApi } from '../../../api/purchase/index'; 
import useSWR from 'swr';

// Define fetcher function for SWR
const fetcher = async () => {
  console.log('Fetching profit data...');
  const profitData = await purchaseOrderApi.getAggregatedAverageProfit();
  console.log('Profit Data:', profitData);
  return processWeeklyData(profitData);
};

// Process data function (same as before)
const processWeeklyData = (profitData) => {
  const salesArray = Array(31).fill(0);
  const purchasesArray = Array(31).fill(0);
  const profitArray = Array(31).fill(0);

  const { totalSales, totalPurchases } = profitData;
  const daysInMonth = new Date().getDate();

  totalSales.forEach(({ date, totalGrandPrice }) => {
    const day = new Date(date).getDate() - 1; 
    if (day >= 0 && day < 31) {
      salesArray[day] = totalGrandPrice;
    }
  });

  totalPurchases.forEach(({ date, totalNetPrice }) => {
    const day = new Date(date).getDate() - 1; 
    if (day >= 0 && day < 31) {
      purchasesArray[day] = totalNetPrice;
    }
  });

  for (let day = 0; day < daysInMonth; day++) {
    profitArray[day] = salesArray[day] - purchasesArray[day];
  }

  return {
    sales: salesArray,
    purchases: purchasesArray,
    profit: profitArray,
  };
};

export const ProfitAverage = () => {
  const theme = useTheme();
  
  // Use SWR to fetch data
  const { data: chartData, error } = useSWR('profitData', fetcher);

  if (error) return <div>Error loading data</div>;
  if (!chartData) return <div>Loading...</div>;

  const getDaysArray = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  };

  const currentDate = new Date();
  const daysArray = getDaysArray(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ pb: 1 }}>
        <Typography variant="subtitle1">Daily Sales and Purchases</Typography>
      </Box>

      <LineChart
        xAxis={[{ 
          data: daysArray,
          scaleType: 'band'
        }]}
        series={[
          {
            data: chartData.sales,
            label: 'Sales',
            color: theme.palette.primary.main,
          },
          {
            data: chartData.purchases,
            label: 'Purchases',
            color: theme.palette.secondary.main,
          },
        ]}
        width={550}
        height={230}
        sx={{
          '.MuiLineElement-root': {
            strokeWidth: 2,
          },
          '.MuiMarkElement-root': {
            stroke: 'white',
            scale: '0.6',
            fill: 'white',
          },
        }}
      />
    </Card>
  );
};
