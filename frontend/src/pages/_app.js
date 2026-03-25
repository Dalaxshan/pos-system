import 'src/global.css';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Provider as ReduxProvider } from 'react-redux';
import { SettingsDrawer } from 'src/components/settings/settings-drawer';
import { Toaster } from 'src/components/toaster';
import { SettingsConsumer, SettingsProvider } from 'src/contexts/settings';
import { useNprogress } from 'src/hooks/use-nprogress';
import { createTheme } from 'src/theme';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import { persistor, store } from 'src/store';
import { PersistGate } from 'redux-persist/integration/react';
// Image Cropper CSS
import 'react-image-crop/dist/ReactCrop.css';

const clientSideEmotionCache = createEmotionCache();

const CustomApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  useNprogress();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Maki POS System</title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <ReduxProvider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SettingsProvider>
              <SettingsConsumer>
                {(settings) => {
                  // Prevent theme flicker when restoring custom settings from browser storage
                  if (!settings.isInitialized) {
                    // return null;
                  }
                  const theme = createTheme({
                    colorPreset: settings.colorPreset,
                    contrast: settings.contrast,
                    direction: settings.direction,
                    paletteMode: settings.paletteMode,
                    responsiveFontSizes: settings.responsiveFontSizes,
                  });

                  return (
                    <ThemeProvider theme={theme}>
                      <Head>
                        <meta
                          name="color-scheme"
                          content={settings.paletteMode}
                        />
                        <meta
                          name="theme-color"
                          content={theme.palette.neutral[900]}
                        />
                      </Head>
                      <CssBaseline />
                      <>
                        {getLayout(<Component {...pageProps} />)}
                        {/* <SettingsButton onClick={settings.handleDrawerOpen} /> */}
                        <SettingsDrawer
                          canReset={settings.isCustom}
                          onClose={settings.handleDrawerClose}
                          onReset={settings.handleReset}
                          onUpdate={settings.handleUpdate}
                          open={settings.openDrawer}
                          values={{
                            colorPreset: settings.colorPreset,
                            contrast: settings.contrast,
                            direction: settings.direction,
                            paletteMode: settings.paletteMode,
                            responsiveFontSizes: settings.responsiveFontSizes,
                            stretch: settings.stretch,
                            layout: settings.layout,
                            navColor: settings.navColor,
                          }}
                        />
                      </>
                      <Toaster />
                    </ThemeProvider>
                  );
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </LocalizationProvider>
        </PersistGate>
      </ReduxProvider>
    </CacheProvider>
  );
};

export default CustomApp;
