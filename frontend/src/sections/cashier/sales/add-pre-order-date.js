import { Dialog, DialogContent, TextField } from '@mui/material';

import { useState } from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

const AddPreOrderDates = ({ open, handleClose, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date();
  
  const handleConfirm = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogContent>
        {/* <MobileDatePicker
          sx={{ width: '100%', height: '100%', disable: 'before' }}
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          minDate={today}
        /> */}
        <StaticDatePicker
          sx={{ width: '100%', height: '100%', disable: 'before' }}
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          minDate={today}
          renderInput={(params) => <TextField {...params} />}
          onAccept={() => handleConfirm()}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddPreOrderDates;
