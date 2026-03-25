import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import { Button, Grid2 } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import ViewIngredients from './view-ingredients';
import { formatDateTime } from 'src/utils/format-date-time';
import { itemAPI } from 'src/api/item';
import useSWR from 'swr';
import { Error } from 'src/components/error';
import { Loading } from 'src/components/loading';

export const ListAllRecipe = (props) => {
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState();
  const { recipes } = props;

  const handleIngredients = (id) => () => {
    setOpen(true);
    setItemId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    data = {},
    isLoading,
    error,
    mutate,
  } = useSWR(itemId ? ['item-by-id', itemId] : null, async () => {
    if (!itemId) return null;

    const response = await itemAPI.getItemById(itemId);
    return response;
  });
  if (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || 'Something went wrong';
    return (
      <Error
        statusCode={statusCode}
        title={errorMessage}
      />
    );
  }

  return (
    <>
      <Box>
        <Box>
          <Typography
            variant="h6"
            sx={{ pb: 2, pl: 1 }}
          >
            Items with Recipes
          </Typography>
        </Box>
        <Grid2
          container
          spacing={3}
        >
          {recipes?.map((item) => (
            <Grid2
              key={item._id}
              size={{ xs: 12, md: 3 }}
            >
              <Card
                sx={{
                  height: '100%',
                  p: 1,
                  cursor: 'pointer',
                }}
                onClick={handleIngredients(item._id)}
              >
                <Box
                  sx={{
                    pt: 'calc(100% * 3 / 4)',
                    position: 'relative',
                  }}
                >
                  <CardMedia
                    image={item?.itemImage || '/placeholder-image.jpg'}
                    sx={{
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      borderRadius: '20px',
                    }}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <div>
                    <Chip
                      label={`${item.name} |  ${item.itemId}`}
                      variant="outlined"
                    />
                  </div>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      my: 1,
                    }}
                  >
                    {/* <Avatar src={item?.chefId?.profilePhoto} /> */}
                    <Box sx={{ ml: 1 }}>
                      {/* <Typography variant="subtitle2">{item?.chefId?.name}</Typography> */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        created At | {formatDateTime(item?.updatedAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                      <Button variant="contained" color="primary" fullWidth> View Recipe</Button>
                    </Box>
                </Box>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
      {isLoading ? (
        <Loading message="Loading details" />
      ) : (
        <ViewIngredients
          open={open}
          handleClose={handleClose}
          itemId={itemId}
          data={data}
          mutate={mutate}
        />
      )}
    </>
  );
};
