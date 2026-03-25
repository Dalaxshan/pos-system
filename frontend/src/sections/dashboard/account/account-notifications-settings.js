import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatDate } from 'src/utils/form-date';
import useSWR from 'swr';
import { accountAPI } from 'src/api/account';
import { paths } from 'src/paths';
import { useRouter } from 'next/router';

export const AccountNotificationsSettings = () => {
  const router = useRouter();

  // Fetch all notifications
  const { data = [] } = useSWR('admin-notifications', async () => {
    const response = await accountAPI.getAllNotification();
    return response;
  });

  // Handle notification click
  const handleNotificationClick = (item) => {
    if (item.type === 'new-sales-order') {
      router.push(paths.dashboard.sales.index);
    }else if (item.type === 'new-purchase-order'){
      router.push(paths.dashboard.purchase.index);
    } else if (item.type === 'new-sales-Item' || item.type === 'new-purchase-item') {
      router.push(paths.dashboard.item.index);
    } else if(item.type === 'new-recipe'){
      router.push(paths.dashboard.recipe.index);

    }
  };

  return (
    <>
      <Typography variant="h4">Notifications</Typography>
      <Divider />
      <Card>
        <CardContent>
          <Grid2
            container
            spacing={1}
          >
            <Grid2 size={12}>
              <Stack
                divider={<Divider />}
                spacing={2}
              >
                {data?.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={3}
                    onClick={() => handleNotificationClick(item)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1">
                        {item.createdBy?.name} created{' '}
                        <b>
                          {item.itemId
                            ? `item: ${item.itemId?.name}`
                            : item.salesId
                              ? `order: ${item.salesId?.orderId}`
                              : item.recipeId
                                ? `recipe: ${item.recipeId?.saleItemId?.name}`
                                : item.purchaseId
                                  ? `purchase order: ${item.purchaseId.orderId}`
                                    :''
                          }
                        </b>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.type}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDate(item.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </>
  );
};
