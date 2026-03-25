import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Scrollbar } from 'src/components/scrollbar';
import { usePathname } from 'src/hooks/use-pathname';
import { SideNavSection } from './side-nav-section';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';

import { paths } from 'src/paths';
import Link from 'next/link';
import { GridMenuIcon } from '@mui/x-data-grid';

const SIDE_NAV_WIDTH = 210;
const COLLAPSED_NAV_WIDTH = 51;

const openedMixin = (theme) => ({
  width: SIDE_NAV_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: COLLAPSED_NAV_WIDTH,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const useCssVars = (color) => {
  const theme = useTheme();

  return useMemo(() => {
    switch (color) {
      case 'blend-in':
        return theme.palette.mode === 'dark'
          ? {
              '--nav-bg': theme.palette.background.default,
              '--nav-color': theme.palette.neutral[100],
              '--nav-border-color': theme.palette.neutral[700],
              '--nav-logo-border': theme.palette.neutral[700],
              '--nav-section-title-color': theme.palette.neutral[400],
              '--nav-item-color': theme.palette.neutral[400],
              '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
              '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
              '--nav-item-active-color': theme.palette.text.primary,
              '--nav-item-disabled-color': theme.palette.neutral[600],
              '--nav-item-icon-color': theme.palette.neutral[500],
              '--nav-item-icon-active-color': theme.palette.primary.main,
              '--nav-item-icon-disabled-color': theme.palette.neutral[700],
              '--nav-item-chevron-color': theme.palette.neutral[700],
              '--nav-scrollbar-color': theme.palette.neutral[400],
            }
          : {
              '--nav-bg': theme.palette.background.default,
              '--nav-color': theme.palette.text.primary,
              '--nav-border-color': theme.palette.neutral[100],
              '--nav-logo-border': theme.palette.neutral[100],
              '--nav-section-title-color': theme.palette.neutral[400],
              '--nav-item-color': theme.palette.text.secondary,
              '--nav-item-hover-bg': theme.palette.action.hover,
              '--nav-item-active-bg': theme.palette.action.selected,
              '--nav-item-active-color': theme.palette.text.primary,
              '--nav-item-disabled-color': theme.palette.neutral[400],
              '--nav-item-icon-color': theme.palette.neutral[400],
              '--nav-item-icon-active-color': theme.palette.primary.main,
              '--nav-item-icon-disabled-color': theme.palette.neutral[400],
              '--nav-item-chevron-color': theme.palette.neutral[400],
              '--nav-scrollbar-color': theme.palette.neutral[900],
            };
      case 'discrete':
        return theme.palette.mode === 'dark'
          ? {
              '--nav-bg': theme.palette.neutral[900],
              '--nav-color': theme.palette.neutral[100],
              '--nav-border-color': theme.palette.neutral[700],
              '--nav-logo-border': theme.palette.neutral[700],
              '--nav-section-title-color': theme.palette.neutral[400],
              '--nav-item-color': theme.palette.neutral[400],
              '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
              '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
              '--nav-item-active-color': theme.palette.text.primary,
              '--nav-item-disabled-color': theme.palette.neutral[600],
              '--nav-item-icon-color': theme.palette.neutral[500],
              '--nav-item-icon-active-color': theme.palette.primary.main,
              '--nav-item-icon-disabled-color': theme.palette.neutral[700],
              '--nav-item-chevron-color': theme.palette.neutral[700],
              '--nav-scrollbar-color': theme.palette.neutral[400],
            }
          : {
              '--nav-bg': theme.palette.neutral[50],
              '--nav-color': theme.palette.text.primary,
              '--nav-border-color': theme.palette.divider,
              '--nav-logo-border': theme.palette.neutral[200],
              '--nav-section-title-color': theme.palette.neutral[500],
              '--nav-item-color': theme.palette.neutral[500],
              '--nav-item-hover-bg': theme.palette.action.hover,
              '--nav-item-active-bg': theme.palette.action.selected,
              '--nav-item-active-color': theme.palette.text.primary,
              '--nav-item-disabled-color': theme.palette.neutral[400],
              '--nav-item-icon-color': theme.palette.neutral[400],
              '--nav-item-icon-active-color': theme.palette.primary.main,
              '--nav-item-icon-disabled-color': theme.palette.neutral[400],
              '--nav-item-chevron-color': theme.palette.neutral[400],
              '--nav-scrollbar-color': theme.palette.neutral[900],
            };
      case 'evident':
        return theme.palette.mode === 'dark'
          ? {
              '--nav-bg': theme.palette.neutral[800],
              '--nav-color': theme.palette.common.white,
              '--nav-border-color': 'transparent',
              '--nav-logo-border': theme.palette.neutral[700],
              '--nav-section-title-color': theme.palette.neutral[400],
              '--nav-item-color': theme.palette.neutral[400],
              '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
              '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
              '--nav-item-active-color': theme.palette.common.white,
              '--nav-item-disabled-color': theme.palette.neutral[500],
              '--nav-item-icon-color': theme.palette.neutral[400],
              '--nav-item-icon-active-color': theme.palette.primary.main,
              '--nav-item-icon-disabled-color': theme.palette.neutral[500],
              '--nav-item-chevron-color': theme.palette.neutral[600],
              '--nav-scrollbar-color': theme.palette.neutral[400],
            }
          : {
              '--nav-bg': theme.palette.neutral[800],
              '--nav-color': theme.palette.common.white,
              '--nav-border-color': 'transparent',
              '--nav-logo-border': theme.palette.neutral[700],
              '--nav-section-title-color': theme.palette.neutral[400],
              '--nav-item-color': theme.palette.primary.contrastText,
              '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
              '--nav-item-active-bg': theme.palette.primary.main,
              '--nav-item-active-color': theme.palette.common.white,
              '--nav-item-disabled-color': theme.palette.neutral[500],
              '--nav-item-icon-color': '#f58e62',
              '--nav-item-icon-active-color': '#f58e62',
              '--nav-item-icon-disabled-color': theme.palette.neutral[500],
              '--nav-item-chevron-color': theme.palette.neutral[600],
              '--nav-scrollbar-color': theme.palette.neutral[400],
            };
      default:
        return {};
    }
  }, [theme, color]);
};

export const SideNav = (props) => {
  const { color = 'evident', sections = [], handleDrawerClose, open } = props;
  const pathname = usePathname();
  const cssVars = useCssVars(color);
  const theme = useTheme();

  return (
    <Drawer
      anchor="left"
      open
      PaperProps={{
        sx: {
          ...cssVars,
          backgroundColor: 'var(--nav-bg)',
          borderRightColor: 'var(--nav-border-color)',
          borderRightStyle: 'solid',
          borderRightWidth: 1,
          color: 'white',
          ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
          }),
          ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
          }),
        },
      }}
      variant="permanent"
    >
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%',
          },
          '& .simplebar-scrollbar:before': {
            background: 'var(--nav-scrollbar-color)',
          },
        }}
      >
        <DrawerHeader>
          {open ? (
            <Stack
              direction="row"
              spacing={2}
              component={Link}
              href={paths.index}
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
               pl:5,
                pt:4,
                pb:2,
                pr:2
               
              }}
            >
              <Image  
                src="/assets/maki-pos-white.webp"
                alt="Maki POS"
                height={65}
                width={96}
              />
            </Stack>
          ) : null}
          <IconButton
            onClick={handleDrawerClose}
            sx={{ color: '#fff' }}
          >
            {open ? <GridMenuIcon /> : <GridMenuIcon />}
          </IconButton>
        </DrawerHeader>

        <Stack
          component="nav"
          spacing={1}
          sx={{
            flexGrow: 1,
            px: open ? 3 : 0,
            py: 1,
            '.MuiListItemButton-root': {
              paddingLeft: open ? 2 : '12px',
              paddingRight: open ? 2 : '12px',
              borderRadius: '4px',
              margin: '4px 0',
            },
            '.MuiListItemIcon-root': {
              minWidth: open ? 'auto' : 'unset',
              marginRight: open ? '16px' : 'unset',
              justifyContent: open ? 'flex-start' : 'center',
            },
            '.MuiListItemText-root': {
              display: open ? 'block' : 'none',
            },
          }}
        >
          {sections.map((section, index) => (
            <SideNavSection
              items={section.items}
              key={index}
              pathname={pathname}
              subheader={open ? section.subheader : undefined}
            />
          ))}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

SideNav.propTypes = {
  color: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
  sections: PropTypes.array,
  handleDrawerClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
