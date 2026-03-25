export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' }).format(price);
};
