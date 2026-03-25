import React, { useRef, useState } from 'react';
import { AppBar, Dialog, Grid2, IconButton, Toolbar, Typography } from '@mui/material';
import Close from '@mui/icons-material/Close';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { useDebounceEffect } from './useDebounceEffect';
import { canvasPreview } from './canvas-preview';
import Compressor from 'compressorjs';
import { LoadingButton } from '@mui/lab';

export const ImageCropperDialog = (props) => {
  const { open, onClose, imageSrc, setFiles, files, initialAspect = 1 } = props;

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(initialAspect);
  const [loadingCompress, setLoadingCompress] = useState(false);

  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  async function getCroppedImage() {
    setLoadingCompress(true);
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    const blob = await offscreen.convertToBlob({
      type: 'image/png',
      quality: 1,
    });

    const compressedBlob = await compressImage(blob);

    if (!compressedBlob) {
      return;
    }

    setFiles([...files, compressedBlob]);
    setLoadingCompress(false);
    onClose();
  }

  const compressImage = async (imageUrl) => {
    try {
      const compressedBlob = await new Promise((resolve, reject) => {
        new Compressor(imageUrl, {
          quality: 0.6, // Adjust the desired image quality (0.0 - 1.0)
          maxWidth: 800, // Adjust the maximum width of the compressed image
          maxHeight: 800, // Adjust the maximum height of the compressed image
          mimeType: 'image/jpeg', // Specify the output image format
          success(result) {
            resolve(result);
          },
          error(error) {
            reject(error);
          },
        });
      });

      return compressedBlob;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => {
        setLoadingCompress(false);
        onClose();
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              setLoadingCompress(false);
              onClose();
            }}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography
            sx={{ ml: 2, flex: 1 }}
            variant="h6"
            component="div"
          >
            Crop Image
          </Typography>
          <LoadingButton
            loading={loadingCompress}
            disabled={loadingCompress}
            variant={'outlined'}
            sx={{
              color: 'white',
              borderColor: 'white',
              ':hover': {
                color: (theme) => theme.palette.primary.main,
                backgroundColor: 'white',
              },
            }}
            onClick={() => getCroppedImage()}
          >
            Save
          </LoadingButton>
        </Toolbar>
      </AppBar>
      <Grid2
        container
        sx={{
          direction: { xs: 'column', md: 'row' },
          maxWidth: '100%',
          height: 'calc(100vh - 64px)',
        }}
      >
        <Grid2
          size={{ xs: 12, sm: 6 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxHeight: '100%',
            overflow: 'hidden',
          }}
        >
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minHeight={100}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                style={{
                  maxHeight: 'calc(100vh - 96px)',
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pt: { xs: '5px', md: 'none' },
          }}
        >
          {completedCrop && (
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                maxWidth: completedCrop.width,
                maxHeight: completedCrop.height,
              }}
            />
          )}
        </Grid2>
      </Grid2>
    </Dialog>
  );
};
