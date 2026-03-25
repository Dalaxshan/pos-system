import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class RecipeAPI {
  // Create a recipe
  async createRecipe(recipe) {
    try {
      const response = await apiManager.post(API_CONSTANTS.createRecipe, recipe);
      return response.data;
    } catch (error) {
      console.error('[RecipeAPI - createRecipe]: ', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Get recipe by recipeId
  async getRecipeById(recipeId) {
    try {
      const response = await apiManager.get(API_CONSTANTS.getRecipeById(recipeId));
      return response.data.data;
    } catch (error) {
      console.error('[RecipeAPI - getRecipeById]: ', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Edit recipe by recipeId
  async editRecipeById(recipeId, data) {
    try {
      const response = await apiManager.put(API_CONSTANTS.editRecipeById(recipeId), data);
      return response.data;
    } catch (error) {
      console.error('[RecipeAPI - editRecipeById]: ', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  //Update recipe comment by id
  async editComment(recipeId, data) {
    try {
      const response = await apiManager.put(API_CONSTANTS.editRecipeComment(recipeId), data);
      return response.data;
    } catch (error) {
      console.error('[RecipeAPI - editComment]: ', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

   //Update comment reply by id
   async editReply(recipeId, data) {
    try {
      const response = await apiManager.put(API_CONSTANTS.editReply(recipeId), data);
      return response.data;
    } catch (error) {
      console.error('[RecipeAPI - editReply]: ', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }
}

export const recipeAPI = new RecipeAPI();
