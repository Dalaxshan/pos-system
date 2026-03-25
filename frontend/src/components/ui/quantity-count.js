import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Typography from '@mui/material/Typography';

export default function QuantityCount({ initialValue = 0, maxQuantity, onChange }) {
  const [count, setCount] = React.useState(initialValue);

  const handleDecrease = () => {
    const newCount = Math.max(count - 1, 0);
    setCount(newCount);
    onChange(newCount);
  };

  const handleIncrease = () => {
    const newCount = Math.min(count + 1, maxQuantity);
    setCount(newCount);
    onChange(newCount);
  };

  // Update count if initialValue changes
  React.useEffect(() => {
    setCount(initialValue);
  }, [initialValue]);

  return (
    <Box
      sx={{
        borderRadius: '10px',
        backgroundColor: '#F1F1F1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 8px',
      }}
    >
      <Button
        aria-label="reduce"
        onClick={handleDecrease}
        disabled={count === 1}
        sx={{
          minWidth: '30px',
          padding: '10px 8px',
          borderRadius: '50%',
        }}
      >
        <RemoveIcon fontSize="small" />
      </Button>
      <Typography
        variant="body1"
        sx={{ margin: '0 12px' }}
      >
        {count}
      </Typography>
      <Button
        aria-label="increase"
        onClick={handleIncrease}
        disabled={count === maxQuantity}
        sx={{
          minWidth: '30px',
          padding: '6px 8px',
          borderRadius: '50%',
        }}
      >
        <AddIcon fontSize="small" />
      </Button>
    </Box>
  );
}
