import React from 'react';
import { styled } from '@mui/material/styles';
import Tab, { tabClasses } from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

const TabItem = styled(Tab)(({ theme }) => ({
  position: 'relative',
  borderRadius: '30px',
  textAlign: 'center',
  transition: 'all .5s',
  padding: '10px 15px',
  color: '#555555',
  height: 'auto',
  margin: '10px 0',
  float: 'none',
  fontSize: '12px',
  fontWeight: '500',
  [theme.breakpoints.up('md')]: {
    minWidth: 120,
  },
  [`&.${tabClasses.selected}, &:hover`]: {
    color: '#FFFFFF',
    backgroundColor: theme.palette.orange[100], // Change background color here
    boxShadow: '0 7px 10px -5px rgba(76, 175, 80, 0.4)',
  },
}));

const TabsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const ContentContainer = styled('div')({
  marginTop: '20px', // Adjust margin as needed
});

export function TabsPill({ children }) {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <TabsContainer>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            [`& .${tabsClasses.indicator}`]: {
              display: 'none',
            },
          }}
        >
          {children.map((child, index) => (
            <TabItem
              key={index}
              disableRipple
              label={child.props.label}
            />
          ))}
        </Tabs>
      </TabsContainer>
      <ContentContainer>{children[tabIndex]}</ContentContainer>
    </>
  );
}
