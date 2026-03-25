import Box from '@mui/material/Box';
import { Chart } from 'src/components/chart';
import { Scrollbar } from 'src/components/scrollbar';

export const LineChart = (props) => {
  const { chartSeries, chartOptions, title, counterValue } = props;

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'transparent'),
        p: 3,
      }}
    >
      <Scrollbar>
        <Box
          sx={{
            height: 375,
            minWidth: 500,
            position: 'relative',
          }}
        >
          <Chart
            height={350}
            options={chartOptions}
            series={chartSeries}
            type="area"
          />
        </Box>
      </Scrollbar>
    </Box>
  );
};
