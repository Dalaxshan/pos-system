import PropTypes from 'prop-types';
import Settings03Icon from '@untitled-ui/icons-react/build/esm/Settings03';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import ColorLensIcon from '@mui/icons-material/ColorLens';

export const SettingsButton = (props) => (
  <Tooltip title="Settings">
    <Box
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: 0,
        margin: (theme) => theme.spacing(0),
      }}
      {...props}
    >
      <ButtonBase
        sx={{
          backgroundColor: 'primary.main',
          borderRadius: '50%',
          color: 'primary.contrastText',
          p: '5px',
          cursor: 'pointer',
        }}
      >
        <SvgIcon>
          <ColorLensIcon />
        </SvgIcon>
      </ButtonBase>
    </Box>
  </Tooltip>
);

SettingsButton.propTypes = {
  onClick: PropTypes.func,
};
