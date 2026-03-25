import { Popover } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { QrGenarator } from 'src/sections/dashboard/qr-code/generate-qr';

const QrPopOver = (props) => {
  const { qrAnchorEl, qrHandleClose} = props;

  const open = Boolean(qrAnchorEl);
  const id = open ? 'simple-popover' : undefined;
  

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={qrAnchorEl}
      onClose={qrHandleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <QrGenarator link={"https://maki-pos.thewebsushi.com/menu"} />
    </Popover>
  );
};

QrPopOver.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default QrPopOver;
