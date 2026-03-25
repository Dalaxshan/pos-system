import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Seo } from 'src/components/seo';
import { SaleItemForm } from 'src/sections/dashboard/item/sale-item-form';
import { PurchaseItemForm } from 'src/sections/dashboard/item/purchase-item-form';
import { Container } from '@mui/material';
import useSWRImmutable from 'swr/immutable';
import { categoryApi } from 'src/api/category';
import { supplierAPI } from 'src/api/supplier';
import { itemAPI } from 'src/api/item';
import { Loading } from 'src/components/loading';
import { Error } from 'src/components/error';

const Page = () => {
  const router = useRouter();
  const itemId = router.query.id;

  const {
    data = {},
    isLoading: isLoadingItem,
    error,
    mutate,
  } = useSWRImmutable(itemId ? ['item-by-id', itemId] : null, async () => {
    if (!itemId) return null;

    const response = await itemAPI.getItemById(itemId);
    return response;
  });

  const { data: supplierList = [], isLoading: isLoadingSuppliers } = useSWRImmutable(
    ['all-suppliers'],
    async () => {
      const response = await supplierAPI.getAllSuppliers();
      return response;
    }
  );

  const { data: categoryList = [], isLoading: isLoadingCategories } = useSWRImmutable(
    ['category-list'],
    async () => {
      const response = await categoryApi.getAllCategory();
      return response;
    }
  );

  const isLoading = useMemo(
    () => isLoadingCategories || isLoadingSuppliers || isLoadingItem,
    [isLoadingCategories, isLoadingSuppliers, isLoadingItem]
  );

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

  if (isLoading) return <Loading message="Fetching item details..." />;

  const isForSale = data?.isForSale === true;

  return (
    <>
      <Seo title="Create Item Form" />

      <Container
        maxWidth="md"
        sx={{ paddingTop: 2 }}
      >
        {data ? (
          isForSale ? (
            <SaleItemForm
              formValues={data}
              categoryList={categoryList}
              isLoadingCategories={isLoadingCategories}
              editMode={true}
              itemId={itemId}
              mutate={mutate}
            />
          ) : (
            <PurchaseItemForm
              formValues={data}
              supplierList={supplierList}
              isLoadingSuppliers={isLoadingSuppliers}
              editMode={true}
              itemId={itemId}
              mutate={mutate}
            />
          )
        ) : (
          <Error
            statusCode={404}
            title="Item not found"
          />
        )}
      </Container>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
