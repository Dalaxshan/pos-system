import {
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  Grid2,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  FormControlLabel,
  FormGroup,
  Checkbox,
  TextField,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { formatPrice } from 'src/utils/price-format';
import { addToCart } from 'src/store/slices/cart';
import { useDispatch } from 'react-redux';

const ItemCustomization = (props) => {
  const { open, handleClose, item, quantity, quantities } = props;
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(item?.netPrice || 0);
  const [note, setNote] = useState('');
  const customizations = item?.customizations || [];
  const requiredOptions = customizations.filter((option) => option.isRequired === true);
  const nonRequiredOptions = customizations.filter((option) => option.isRequired === false);
 

  useEffect(() => {
    const selectedPrices = selectedOptions.reduce(
      (sum, option) => sum + Number(option.price),
      item?.netPrice || 0
    );
    setTotalAmount(selectedPrices);
  }, [selectedOptions, item?.netPrice]);

  const handleOptionChange = (option, checked) => {
    if (checked) {
      setSelectedOptions((prev) => [...prev, option]);
    } else {
      setSelectedOptions((prev) => prev.filter((o) => o.variation !== option.variation));
    }
  };

  //handle reset
  const handleReset = () => {
    setSelectedOptions([]); 
    setNote(''); 
    setTotalAmount(item?.netPrice || 0); 
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      const itemQuantity = quantities[item._id] || 1;
      await dispatch(
        addToCart({
          items: [
            {
              id: item._id,
              itemId: item.itemId,
              name: item.name,
              unitPrice: item.unitPrice,
              discount: item.discount,
              netPrice: item.netPrice,
              itemImage: item.itemImage,
              quantity: itemQuantity,
              customizations: selectedOptions.map((option) => ({
                variation: option.variation,
                price: option.price,
              })),
              totalAmount: totalAmount,
              note: note,
            },
          ],
        })
      );

      toast.success('Item added to cart!', {
        position: 'bottom-left',
      });
      setSelectedOptions([]);
      setTotalAmount(item?.netPrice || 0);
      setNote('');
      handleClose(true);
    } catch (error) {
      toast.error('Error adding product: ' + error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography
          variant="h6"
          align="center"
          sx={{ pt: 2 }}
        >
          Customize your order
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid2
          container
          spacing={2}
          sx={{ p: 1 }}
        >
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography
                  color="text.secondary"
                  variant="overline"
                >
                  Required options
                </Typography>
                <List
                  disablePadding
                  sx={{ pt: 2 }}
                >
                  {requiredOptions.map((option) => (
                    <ListItem
                      disableGutters
                      key={option.variant}
                      sx={{ pb: 0.1, pt: 0 }}
                    >
                      <ListItemText
                        disableTypography
                        primary={
                          <FormGroup sx={{ width: '100%' }}>
                            <Stack
                              alignItems="center"
                              direction="row"
                              justifyContent="space-between"
                              spacing={2}
                              sx={{ width: '100%' }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={(e) => handleOptionChange(option, e.target.checked)}
                                  />
                                }
                                label={option?.variation}
                                sx={{ marginRight: 'auto' }}
                              />
                              <Typography
                                color="text.secondary"
                                variant="subtitle2"
                              >
                                +{formatPrice(option?.price)}
                              </Typography>
                            </Stack>
                          </FormGroup>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ mb: 4 }} />
                <Typography
                  color="text.secondary"
                  variant="overline"
                >
                  Non Required Options
                </Typography>
                <List
                  disablePadding
                  sx={{ pt: 2 }}
                >
                  {nonRequiredOptions?.map((option) => (
                    <ListItem
                      disableGutters
                      key={option.variation}
                      sx={{ pb: 0.5, pt: 0 }}
                    >
                      <FormGroup sx={{ width: '100%' }}>
                        <Stack
                          alignItems="center"
                          direction="row"
                          justifyContent="space-between"
                          spacing={2}
                          sx={{ width: '100%' }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={(e) => handleOptionChange(option, e.target.checked)}
                              />
                            }
                            label={option?.variation}
                            sx={{ marginRight: 'auto' }}
                          />
                          <Typography
                            color="text.secondary"
                            variant="subtitle2"
                          >
                            + {formatPrice(option?.price)}
                          </Typography>
                        </Stack>
                      </FormGroup>
                    </ListItem>
                  )) || []}
                </List>

                <List>
                  <TextField
                    id="outlined-multiline-static"
                    label="Add note"
                    multiline
                    rows={3}
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </List>
                <Divider />
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                subheader={
                  <Typography variant="h4">{formatPrice(totalAmount * quantity)}</Typography>
                }
                sx={{ pb: 0 }}
                title={
                  <Typography
                    color="text.secondary"
                    variant="overline"
                  >
                    {item?.name} | {quantity} items
                  </Typography>
                }
              />
              <CardContent>
                <Divider sx={{ mb: 2 }} />
                <Typography
                  color="text.secondary"
                  variant="overline"
                >
                  Customizations
                </Typography>
                <List
                  disablePadding
                  sx={{ pt: 2 }}
                >
                  {selectedOptions?.map((option) => (
                    <ListItem
                      disableGutters
                      key={option.variant}
                      sx={{ pb: 2, pt: 0 }}
                    >
                      <ListItemText
                        disableTypography
                        primary={
                          <Stack
                            alignItems="center"
                            direction="row"
                            justifyContent="space-between"
                            spacing={2}
                          >
                            <Typography variant="subtitle2">{option?.variation}</Typography>

                            <Typography
                              color="text.secondary"
                              variant="subtitle2"
                            >
                              {formatPrice(option?.price * quantity)}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  )) || []}
                </List>
                <Divider />
              </CardContent>
            </Card>
          </Grid2>

          <Grid2
            size={{ xs: 12 }}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap={1}
            
          >
             <Button
              variant="outlined"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={handleAddToCart}
            >
              Add options
            </Button>

  
          </Grid2>
        </Grid2>
      </DialogContent>
    </Dialog>
  );
};

export default ItemCustomization;
