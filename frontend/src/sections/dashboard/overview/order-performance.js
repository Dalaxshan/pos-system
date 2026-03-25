import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Card, Typography } from '@mui/material';

const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    week: 'Mon',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    week: 'Tue',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    week: 'Wed',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    week: 'Thu',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    week: 'Fri',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    week: 'Sat',
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    week: 'Sun',
  },
];

const chartSetting = {
  xAxis: [
    {
      label: 'Total Orders',
    },
  ],
  width: 500,
  height: 300,
};

const valueFormatter = (value) => `${value}`;

export const OrderPerformance = () => {
  return (
    <Card
      sx={{
        p: 2,
      }}
    >
      <Typography variant="subtitle1">Orders Performance</Typography>
      <BarChart
        dataset={dataset}
        yAxis={[{ scaleType: 'band', dataKey: 'week' }]}
        series={[{ dataKey: 'seoul', label: 'Ordered Items', valueFormatter }]}
        layout="horizontal"
        {...chartSetting}
      />
    </Card>
  );
};
