import { useState } from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { MobileNav } from '../mobile-nav';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { useMobileNav } from './use-mobile-nav';
import Image from 'next/image';
import Background from 'public/assets/bg.webp';

const SIDE_NAV_WIDTH = 200;
const COLLAPSED_NAV_WIDTH = 48;

const VerticalLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',
  position: 'relative',
});

const BackgroundImageWrapper = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  overflow: 'hidden',
});

export const VerticalLayout = (props) => {
  const { children, sections, navColor } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const mobileNav = useMobileNav();
  const [open, setOpen] = useState(true);

  const VerticalLayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
      paddingLeft: open ? SIDE_NAV_WIDTH : COLLAPSED_NAV_WIDTH,
    },
  }));

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* <TopNav onMobileNavOpen={mobileNav.handleOpen} /> */}
      {lgUp && (
        <SideNav
          color={navColor}
          sections={sections}
          handleDrawerClose={handleDrawerClose}
          open={open}
        />
      )}

      {!lgUp && (
        <MobileNav
          color={navColor}
          onClose={mobileNav.handleClose}
          open={mobileNav.open}
          sections={sections}
        />
      )}

      <VerticalLayoutRoot>
        <VerticalLayoutContainer>
          <BackgroundImageWrapper>
            <Image
              src={Background}
              alt="Background"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </BackgroundImageWrapper>

          {children}
        </VerticalLayoutContainer>
      </VerticalLayoutRoot>
    </>
  );
};

VerticalLayout.propTypes = {
  children: PropTypes.node,
  navColor: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
  sections: PropTypes.array,
};
