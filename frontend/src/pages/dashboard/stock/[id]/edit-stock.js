import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Seo } from 'src/components/seo';
import { Container } from '@mui/material';
import { itemAPI } from 'src/api/item';
import { stockApi } from 'src/api/stock';
import { EditStockForm } from 'src/sections/dashboard/stock/edit-stock';
import { Error } from 'src/components/error';
import { CreateStockForm } from 'src/sections/dashboard/stock/create-stock-form';
import { Loading } from 'src/components/loading';
import useSWRImmutable from 'swr/immutable';

const Page = () => {
  // Get all Receipe list
  const { data: recipeList = [], isLoading: isLoadingRecipes } = useSWRImmutable(
    ['available-recipies'],
    async () => {
      const response = await itemAPI.getAllApprovedRecipes();
      return response;
    }
  );

  // All items list
  const { data: itemsList = [], isLoading: isLoadingItems } = useSWRImmutable(
    ['all-items'],
    async () => {
      const response = await itemAPI.getAllPurchaseItem();
      return response;
    }
  );

  const router = useRouter();
  const stockId = router.query.id;

  const {
    data: formValues = {},
    isLoading: isLoadingStock,
    mutate,
  } = useSWRImmutable(stockId ? ['get-stock', stockId] : null, async () => {
    if (!stockId) return null;

    const response = await stockApi.getStockById(stockId);
    return response;
  });

  const isLoading = useMemo(
    () => isLoadingItems || isLoadingRecipes || isLoadingStock,
    [isLoadingItems, isLoadingRecipes, isLoadingStock]
  );
  if (isLoading) return <Loading message="Fetching Stock records..." />;

  return (
    <>
      <Seo title="Edit Stock record form" />
      <Container>
        {/* <Edit StockForm */}

        <EditStockForm
          formValues={formValues}
          itemsList={itemsList}
          recipeList={recipeList}
          isEditMode={true}
          mutate={mutate}
        />
      </Container>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
