import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, Typography, useTheme, useMediaQuery } from '@mui/material';

export const MostOrderedItem = ({ mostOrder }) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

  const chartWidth = isMd ? 420 : isXs ? 200 : 420;
  const chartHeight = isMd ? 150 : isXs ? 450 : 150;
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="subtitle1">Daily Most Ordered Item</Typography>
      <PieChart
        colors={['purple', 'maroon', 'blue', 'green', 'yellow', 'brown', 'dpurple']}
        series={[
          {
            data: mostOrder.map((item) => ({
              id: item.itemId,
              value: item.quantity,
              label: item.itemName,
            })),
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            innerRadius: 40,
            outerRadius: 70,
            paddingAngle: 3,
            cornerRadius: 5,
            startAngle: 0,
            endAngle: 360,
          },
        ]}
        width={chartWidth}
        height={chartHeight}
      />
    </Card>
  );
};
