import { Box } from '@mui/material';
import { itemAPI } from 'src/api/item';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { ListAllRecipe } from 'src/sections/dashboard/recipe/list-all-recipe';
import { Loading } from 'src/components/loading';
import useSWR from 'swr';

const Page = () => {
  const { data = [], isLoading } = useSWR(['recipes-items'], async () => {
    const response = await itemAPI.getAllRecipes();
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
