import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Seo } from 'src/components/seo';
import { Container } from '@mui/material';
import { supplierAPI } from 'src/api/supplier';
import { itemAPI } from 'src/api/item';
import { PurchaseOrderForm } from 'src/sections/dashboard/purchase/purchase-order-form';
import { purchaseOrderApi } from 'src/api/purchase';
import useSWRImmutable from 'swr/immutable';
import { Loading } from 'src/components/loading';
import { Error } from 'src/components/error';

const Page = () => {
  // Get all supplier order list
  const {
    data: supplierList = [],
    isLoading: isLoadingSuppliers,
    error: supplierError,
  } = useSWRImmutable(['all-suppliers'], async () => {
    const response = await supplierAPI.getAllSuppliers();
    return response;
  });

  //All items list
  const {
    data: itemsList = [],
    isLoading: isLoadingItems,
    error: itemError,
  } = useSWRImmutable(['all-items'], async () => {
    const response = await itemAPI.getAllPurchaseItem();
    return response;
  });

  const router = useRouter();
  const orderId = router.query.id;

  const {
    data: formValues = {},
    isLoading: isLoadingOrder,
    error: orderError,
    mutate,
  } = useSWRImmutable(orderId ? ['get-order', orderId] : null, async () => {
    if (!orderId) return null;

    const response = await purchaseOrderApi.getPurchaseById(orderId);
    return response;
  });

  const isLoading = useMemo(
    () => isLoadingItems || isLoadingSuppliers || isLoadingOrder,
    [isLoadingItems, isLoadingSuppliers, isLoadingOrder]
  );

  const error = useMemo(
    () => orderError || itemError || supplierError,
    [orderError, itemError, supplierError]
  );

  if (isLoading) return <Loading message="Fetching purchase order details..." />;

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
      <Seo title="Edit Purchase Item form" />
      <Container>
        <PurchaseOrderForm
          formValues={formValues}
          itemsList={itemsList}
          supplierList={supplierList}
          isEditMode={true}
          mutate={mutate}
        />
      </Container>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
