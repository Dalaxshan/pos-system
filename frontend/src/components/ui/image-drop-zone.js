import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState, useCallback } from 'react';
import { Grid2 } from '@mui/material';
import Image from 'next/image';
import { bytesToSize } from 'src/utils/bytes-to-size';

const ImageDropZone = ({ className }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
      ]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const removeFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <form>
      <div>
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
          {...getRootProps({
            className: className,
          })}
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
            </Stack>
          </Stack>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 4, ml: 2 }}>
          {/* Display the uploaded files */}
          <Grid2
            container
            spacing={2}
          >
            {files.map((file, index) => (
              <Grid2
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                key={index}
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  m: 1,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    m: 2,
                  }}
                >
                  <Tooltip title="Remove">
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(file.name)}
                    >
                      <SvgIcon>
                        <XIcon />
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Image
                    src={file.preview}
                    alt={file.name}
                    width={100}
                    height={100}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                  />

                  <Typography variant="subtitle1">{file.name}</Typography>
                  <Typography variant="subtitle2">{bytesToSize(file.size)}</Typography>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </div>
    </form>
  );
};

ImageDropZone.propTypes = {
  className: PropTypes.string,
};

export default ImageDropZone;
