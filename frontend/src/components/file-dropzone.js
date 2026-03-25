import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useField } from 'formik';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import {
  Grid2,
  Paper,
  Avatar,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { fileToBase64 } from 'src/utils/file-to-base64';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { ImageCropperDialog } from './image-cropper/image-cropper';
import { bytesToSize } from 'src/utils/bytes-to-size';
import Image from 'next/image';
import toast from 'react-hot-toast';

export const FileDropzone = (props) => {
  const { name, caption, maxFiles, maxSize = 5242880, initialAspect, isCover = false } = props;
  const [field, meta, helpers] = useField(name);
  const [currentImage, setCurrentImage] = useState('');
  const [openCropper, setOpenCropper] = useState(false);

  const handleCloseCropper = () => {
    setOpenCropper(false);
  };

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      rejectedFiles.forEach((file) => {
        if (file.file.size > maxSize) {
          toast.error('File is too large');
        } else {
          toast.error('File type not supported');
        }
      });

      acceptedFiles.forEach(async (file) => {
        const data = await fileToBase64(file);
        setCurrentImage(data);
        setOpenCropper(true);
      });
    },
    [maxSize]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
      ...(!isCover ? { 'image/webp': [] } : {}),
    },
    maxFiles: maxFiles,
    minSize: 0,
    maxSize: maxSize,
  });

  const removeFile = (file) => {
    const newFiles = field.value.filter((f) => f !== file);
    helpers.setValue(newFiles);
  };

  return (
    <>
      <ImageCropperDialog
        open={openCropper}
        onClose={handleCloseCropper}
        files={field.value}
        setFiles={helpers.setValue}
        imageSrc={currentImage}
        initialAspect={initialAspect}
      />
      {maxFiles && field?.value?.length < maxFiles && (
        <Box
          sx={{
            alignItems: 'center',
            border: 1,
            borderRadius: 1,
            borderStyle: 'dashed',
            borderColor: 'divider',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            outline: 'none',
            p: 6,
            ...(isDragActive && {
              backgroundColor: 'action.active',
              opacity: 0.5,
            }),
            '&:hover': {
              backgroundColor: 'action.hover',
              cursor: 'pointer',
              opacity: 0.5,
            },
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                height: 64,
                width: 64,
              }}
            >
              <SvgIcon>
                <Upload01Icon />
              </SvgIcon>
            </Avatar>
            <Stack spacing={1}>
              <Typography
                sx={{
                  '& span': {
                    textDecoration: 'underline',
                  },
                }}
                variant="h6"
              >
                <span>Click to upload</span> or drag and drop
              </Typography>
              {caption && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {caption}
                </Typography>
              )}
              {isDragReject && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'error',
                  }}
                >
                  File type not supported
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>
      )}
      {meta?.touched && meta.error ? (
        <Typography
          variant="caption"
          sx={{
            color: 'error',
          }}
        >
          {meta.error}
        </Typography>
      ) : null}
      <Box sx={{ mt: 2 }}>
        <Grid2
          container
          spacing={1}
        >
          {field?.value?.map((file, index) => {
            if (file instanceof Blob) {
              return (
                <Grid2
                  key={index}
                  size={3}
                >
                  <Paper
                    sx={{
                      position: 'relative',
                      borderRadius: 1,
                      border: 1,
                      borderStyle: 'dashed',
                      borderColor: 'divider',
                      height: 175,
                      width: 175,
                    }}
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      fill
                      style={{
                        objectFit: 'cover',
                      }}
                      sizes="30vw"
                      alt={`Uploaded Image ${index}`}
                    />
                    <IconButton
                      style={{ position: 'absolute', top: 0, right: 0, color: 'red' }}
                      onClick={() => removeFile(file)}
                    >
                      <DoNotDisturbOnIcon />
                    </IconButton>
                  </Paper>
                  <Typography variant={'caption'}>File Size : {bytesToSize(file.size)}</Typography>
                </Grid2>
              );
            } else {
              return (
                <Grid2
                  key={index}
                  size={{ xs: 12, md: 3 }}
                >
                  <Paper
                    sx={{
                      borderRadius: 1,
                      border: 1,
                      borderStyle: 'dashed',
                      borderColor: 'divider',
                      height: 175,
                      width: 175,
                      position: 'relative',
                    }}
                  >
                    <Image
                      src={file}
                      priority
                      fill
                      style={{
                        objectFit: 'cover',
                      }}
                      sizes="30vw"
                      alt={`Uploaded Image ${index}`}
                    />
                    <IconButton
                      style={{ position: 'absolute', top: 0, right: 0, color: 'red' }}
                      onClick={() => removeFile(file)}
                    >
                      <DoNotDisturbOnIcon />
                    </IconButton>
                  </Paper>
                </Grid2>
              );
            }
          })}
        </Grid2>
        {/* <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            mt: 2,
          }}
        >
          <Button
            color="inherit"
            size="small"
            type="button"
            onClick={() => helpers.setValue([])}
          >
            {field?.value?.length} / {maxFiles} | Remove All
          </Button>
        </Stack> */}
      </Box>
    </>
  );
};
