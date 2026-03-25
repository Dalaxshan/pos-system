import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Seo } from 'src/components/seo';
import { SaleItemForm } from 'src/sections/dashboard/item/sale-item-form';
import { PurchaseItemForm } from 'src/sections/dashboard/item/purchase-item-form';
import { Container } from '@mui/material';
import useSWRImmutable from 'swr/immutable';
import { categoryApi } from 'src/api/category';
import { supplierAPI } from 'src/api/supplier';
import { Loading } from 'src/components/loading';
import useSWR from 'swr';

const Page = () => {
  const router = useRouter();
  const { forSale } = router.query;

  // Get all suppliers list
  const { data: supplierList = [], isLoading: isLoadingSuppliers } = useSWRImmutable(
    ['all-suppliers'],
    async () => {
      const response = await supplierAPI.getAllSuppliers();
      return response;
    }
  );

  // Get all category list
  const { data: categoryList = [], isLoading: isLoadingCategories } = useSWRImmutable(
    ['category-list'],
    async () => {
      const response = await categoryApi.getAllCategory();
      return response;
    }
  );

  const isLoading = useMemo(
    () => isLoadingCategories || isLoadingSuppliers,
    [isLoadingCategories, isLoadingSuppliers]
  );

  if (isLoading) return <Loading message="Fetching item  details..." />;

  return (
    <>
      <Seo title="Create Item Form" />

      <Container
        maxWidth="md"
        sx={{ paddingTop: 2 }}
      >
        {forSale === 'true' && categoryList ? (
          <SaleItemForm
            formValues={null}
            categoryList={categoryList}
            isLoadingCategories={isLoadingCategories}
          />
        ) : (
          <PurchaseItemForm
            formValues={null}
            supplierList={supplierList}
            isLoadingSuppliers={isLoadingSuppliers}
          />
        )}
      </Container>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
