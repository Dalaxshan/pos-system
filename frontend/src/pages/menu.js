import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Pagination, Grid2 } from '@mui/material';
import { Stack } from '@mui/system';
import useSWR from 'swr';
import Image from 'next/image';
import { formatPrice } from 'src/utils/price-format';
import { itemAPI } from 'src/api/item';
import { Loading } from 'src/components/loading';
import { Error } from 'src/components/error';

const Page = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const placeHolderImage = 'https://via.placeholder.com/150';

  const {
    data = [],
    isLoading,
    error,
  } = useSWR(['all-sales-items'], async () => {
    const response = await itemAPI.getAllSalesItem();
    return response;
  });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedItems = data?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (error) {
    return (
      <Error
        statusCode={error?.statusCode}
        title="Failed to fetch menu items"
      />
    );
  }

  if (isLoading) return <Loading message="Fetching menu  items..." />;

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          px: { xs: 1, md: 2, lg: 4 },
          m: { xs: 0, md: 2 },
          height: '120vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Box sx={{ mb: 4,mt:2 }}>
          <Typography variant="h5">Our Menu</Typography>
        </Box>
        <Grid2
          container
          spacing={2}
        >
          {paginatedItems?.map((item) => (
            <Grid2
              size={{
                xs: 6,
                md: 4,
                lg: 3,
                xl: 2,
              }}
              key={item._id}
            >
              <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative', height: '120px' }}>
                  <Image
                    src={item.itemImage || placeHolderImage}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 480px) 90vw, 60vw"
                  />
                  {item.discount !== 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: '#F5BD2FF0',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="textPrimary"
                      >
                        {item.discount} % Offer
                      </Typography>
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1, padding: '8px' }}>
                  <Stack
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                  >
                    <Typography variant="subTitleItem1">{item.name}</Typography>
                    <Typography variant="subTitleItem2">{formatPrice(item.unitPrice)}</Typography>
                   
                  </Stack>
                 
                </CardContent>

                
              </Card>
            </Grid2>
          ))}
        </Grid2>

        <Box
          display="flex"
          justifyContent="center"
        >
          <Pagination
            count={Math.ceil(data?.length / itemsPerPage || 0)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    </>
  );
};

export default Page;
