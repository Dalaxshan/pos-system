export const formatDate = (input) => {
  const date = new Date(input);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return date.toLocaleString('en-US', options);
};
