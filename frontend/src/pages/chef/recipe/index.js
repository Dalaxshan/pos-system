import { Box } from '@mui/material';
import { itemAPI } from 'src/api/item';

import { Loading } from 'src/components/loading';
import { Seo } from 'src/components/seo';

import { Layout as DashboardLayout } from 'src/layouts/chef';
import { ListAllRecipe } from 'src/sections/chef/recipe/list-all-recipe';

import useSWR from 'swr';

const Page = () => {
  const { data = [], isLoading } = useSWR(['approved-recipes'], async () => {
    const response = await itemAPI.getAllApprovedRecipes();
    return response;
  });
  if (isLoading) return <Loading message="Fetching item  details..." />;
  return (
    <>
      <Seo title="Recipes list" />
      <Box sx={{ margin: 1, padding: 2 }}>
        <ListAllRecipe recipes={data} />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
