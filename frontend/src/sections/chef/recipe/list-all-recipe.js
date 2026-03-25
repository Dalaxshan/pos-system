import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import { Grid2 } from '@mui/material';
import Typography from '@mui/material/Typography';
import { formatDateTime } from 'src/utils/format-date-time';

export const ListAllRecipe = (props) => {
  const { recipes } = props;

  return (
    <Box>
      <Box>
        <Typography
          variant="h6"
          sx={{ pb: 2, pl: 1 }}
        >
          Approved Recipes
        </Typography>
      </Box>
      <Grid2
        container
        spacing={3}
      >
        {recipes?.map((recipe) => (
          <Grid2
            key={recipe._id}
            size={{ xs: 12, md: 3 }}
          >
            <Card
              sx={{
                height: '100%',
                p: 1,
              }}
            >
              <Box
                sx={{
                  pt: 'calc(100% * 3 / 4)',
                  position: 'relative',
                
                }}
              >
                <CardMedia
                  image={recipe?.itemImage || '/placeholder-image.jpg'}
                  sx={{
                    height: '100%',
                    position: 'absolute',
                    borderRadius: 2,
                    top: 0,
                    width: '100%',
                  }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <div>
                  <Chip
                    label={`${recipe.name} |  ${recipe.itemId}`}
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
                      Updated At | {formatDateTime(recipe?.updatedAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};
