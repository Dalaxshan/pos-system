import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Seo } from 'src/components/seo';
import { Container } from '@mui/material';
import { supplierAPI } from 'src/api/supplier';
import { itemAPI } from 'src/api/item';
import { PurchaseOrderForm } from 'src/sections/dashboard/purchase/purchase-order-form';
import useSWRImmutable from 'swr/immutable';

const Page = () => {
  // Get all supplier order list
  const { data: supplierList = [] } = useSWRImmutable(['all-suppliers'], async () => {
    const response = await supplierAPI.getAllSuppliers();
    return response;
  });

  //All items list
  const { data: itemsList = [] } = useSWRImmutable(['all-items'], async () => {
    const response = await itemAPI.getAllPurchaseItem();
    return response;
  });

  return (
    <>
      <Seo title="Create Purchase Item form" />

      <Container>
        <PurchaseOrderForm
          formValues={null}
          itemsList={itemsList}
          supplierList={supplierList}
        />
      </Container>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
