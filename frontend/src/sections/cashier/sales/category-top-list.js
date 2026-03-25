import { Box, Button, Grid2, Typography } from '@mui/material';
import Link from 'next/link';
import { paths } from 'src/paths';
import { itemAPI } from 'src/api/item';
import useSWRImmutable from 'swr/immutable';
import { Scrollbar } from 'src/components/scrollbar';

const CategoryTopList = () => {
  const { data: categories = [] } = useSWRImmutable(['categories'], async () => {
    const response = await itemAPI.countCategoryItems();
    return response;
  });

  return (
    <Scrollbar style={{ paddingBottom: '10px' }}>
      <Box
        sx={{
          whiteSpace: 'nowrap',
        }}
      >
        <Grid2
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1} 
          sx={{
            flexWrap: 'nowrap',
            display: 'inline-flex',
            width: '100%',
          }}
        >
          {categories?.map((item, index) => (
            <Grid2
              size={{xs:6, sm:4, md:3, lg:2}}
              key={index}
              sx={{
                flexShrink: 0,
                maxWidth: '100%', 
              }}
            >
              <Link
                style={{ textDecoration: 'none' }}
                href={{
                  pathname: paths.cashier.index,
                  query: { category: item.categoryName },
                }}
                passHref
              >
                <Button
                  sx={{
                    border: '1px solid #DDE1E6',
                    textAlign: 'center',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(251, 251, 251, 0.5)',
                    padding: '10px',
                    minHeight: '70px',
                    width: '100%',
                    flexDirection: 'column',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)', 
                    },
                  }}
                >
                  <Typography variant="button">{item.categoryName}</Typography>
                  <Typography sx={{ color: '#868686' }}>
                    {item.count === 1 ? '1 item' : `${item.count} items`}
                  </Typography>
                </Button>
              </Link>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Scrollbar>
  );
};

export default CategoryTopList;
