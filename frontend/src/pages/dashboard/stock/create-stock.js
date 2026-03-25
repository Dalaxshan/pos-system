import React, { useMemo } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Seo } from 'src/components/seo';
import { Container } from '@mui/material';
import { itemAPI } from 'src/api/item';
import { CreateStockForm } from 'src/sections/dashboard/stock/create-stock-form';
import useSWRImmutable from 'swr/immutable';
import { Loading } from 'src/components/loading';
import { Error } from 'src/components/error';

const Page = () => {
  // Get all Receipe list
  const {
    data: recipeList = [],
    isLoading: loadingRecipes,
    error: recipeError,
  } = useSWRImmutable(['available-recipies'], async () => {
    const response = await itemAPI.getAllApprovedRecipes();
    return response;
  });

  //All purchase items list
  const {
    data: itemsList = [],
    isLoading: loadingItems,
    error: itemError,
  } = useSWRImmutable(['all-items'], async () => {
    const response = await itemAPI.getAllPurchaseItem();
    return response;
  });

  const isLoading = useMemo(() => loadingRecipes || loadingItems, [loadingRecipes, loadingItems]);

  const error = useMemo(() => recipeError || itemError, [recipeError, itemError]);

  if (isLoading) return <Loading message="Fetching tables..." />;

  if (error) {
    return (
      <Error
        statusCode={error.response?.status || 500}
        title={error.message || 'Failed to load tables'}
      />
    );
  }

  return (
    <>
      <Seo title="Create Stock form" />

      <Container>
        <CreateStockForm
          formValues={null}
          itemsList={itemsList}
          recipeList={recipeList}
        />
      </Container>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
