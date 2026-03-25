import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid2,
  Box,
  Button,
  Pagination,
} from '@mui/material';
import QuantityCount from 'src/components/ui/quantity-count';
import { formatPrice } from 'src/utils/price-format';
import { Stack } from '@mui/system';
import { addToCart } from 'src/store/slices/cart';
import toast from 'react-hot-toast';
import CategoryTopList from './category-top-list';
import { useRouter } from 'next/router';
import ItemCustomization from './item-customization';
import Image from 'next/image';

const SaleItems = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [quantities, setQuantities] = useState({});
  const [filteredSales, setFilteredSales] = useState([]);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [addedItem, setAddedItem] = useState();
  const itemsPerPage = 9;
  const { sales } = props;
  const [quantity, setQuantity] = useState(1);
  const placeHolderImage = 'https://via.placeholder.com/150';
  const category = router.query.category;

  useEffect(() => {
    // Filter sales items based on the category
    if (category) {
      setFilteredSales(sales.filter((item) => item.categoryId?.name === category));
    } else {
      setFilteredSales(sales);
    }
  }, [category, sales]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));

    setQuantity(newQuantity);
  };

  const paginatedItems = filteredSales.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  //handle order customization
  const handleItemCustomization = (item) => {
    setCustomizationOpen(true);
    setAddedItem(item);
  };

  //handle customization close
  const handleClose = () => {
    setCustomizationOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          m: 2,
          height: '100vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5">INVENTORY VIEW</Typography>
        </Box>
        <Grid2
          container
          spacing={2}
        >
          <Grid2 size={{xs:12}}>
            <CategoryTopList />
          </Grid2>

          {paginatedItems?.map((item) => (
            <Grid2
              size={{
                xs: 12,
                md: 4,
                sm: 6,
              }}
              key={item._id}
            >
              <Card sx={{ height: '315px' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={item.itemImage || placeHolderImage}
                    alt={item.name}
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
                <CardContent sx={{ padding: '8px', flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Typography variant="subTitleItem1">{item.name}</Typography>
                    <Typography
                      variant="subTitleItem2"
                      sx={{ mt: 1 }}
                    >
                      {formatPrice(item.unitPrice)}
                    </Typography>
                  </Stack>
                  <Typography variant="subTitleItem3">{item.itemId}</Typography>
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                    sx={{ mt: 2 }}
                  >
                    <QuantityCount
                      initialValue={1}
                      maxQuantity={50}
                      onChange={(newQuantity) => handleQuantityChange(item._id, newQuantity)}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#0370E34D',
                        color: '#000000',
                        width: '100%',
                        '&:hover': {
                          color: '#ffffff',
                        },
                      }}
                      onClick={() => handleItemCustomization(item)}
                      disabled={quantities[item._id] === 0}
                    >
                      Add to Cart
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
        <Box
          display="flex"
          justifyContent="center"
          mt={4}
        >
          <Pagination
            count={Math.ceil(filteredSales.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>

      <ItemCustomization
        open={customizationOpen}
        handleClose={handleClose}
        item={addedItem}
        quantity={quantity}
        quantities={quantities}
      />
    </>
  );
};

export default SaleItems;
