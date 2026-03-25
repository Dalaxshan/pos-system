import { Body, Controller, Get, Post, Param, UseGuards, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { RecipeDocument } from './recipe.schema';
import { UpdateRecipeCommentDto } from './dto/update-comment.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';

@ApiTags('Recipe')
@Controller('recipe')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiBody({ type: CreateRecipeDto })
  @ResponseMessage('Recipe created successfully')
  @ApiCreatedResponse({
    description: 'Recipe created successfully',
    type: CreateRecipeDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async createRecipe(@Body() createRecipeDto: CreateRecipeDto): Promise<RecipeDocument> {
    return this.recipeService.createRecipe(createRecipeDto);
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Get recipe by ID' })
  @ApiParam({ name: 'id', description: 'ID of the recipe', type: String })
  @ResponseMessage('Recipe retrieved successfully by ID')
  @ApiOkResponse({
    description: 'Recipe retrieved successfully',
    type: CreateRecipeDto,
  })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiBadRequestResponse({ description: 'Invalid ID format' })
  async getRecipeById(@Param('id') id: string): Promise<RecipeDocument> {
    return this.recipeService.getRecipeById(id);
  }

  @Put(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Update recipe by ID' })
  @ApiParam({ name: 'id', description: 'ID of the recipe', type: String })
  @ApiBody({ type: UpdateRecipeDto })
  @ResponseMessage('Recipe updated successfully')
  @ApiOkResponse({
    description: 'Recipe updated successfully',
    type: UpdateRecipeDto,
  })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<RecipeDocument> {
    return this.recipeService.updateRecipe(id, updateRecipeDto);
  }

  //update recipe comment
  @Put('comment/:id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Update recipe by ID' })
  @ApiParam({ name: 'id', description: 'ID of the recipe', type: String })
  @ApiBody({ type: UpdateRecipeCommentDto })
  @ResponseMessage('Comment updated successfully')
  @ApiOkResponse({
    description: 'Recipe comment updated successfully',
    type: UpdateRecipeDto,
  })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async updateRecipeComment(
    @Param('id') id: string,
    @Body() updateRecipeCommentDto: UpdateRecipeCommentDto,
  ): Promise<RecipeDocument> {
    return this.recipeService.updateRecipeComment(id, updateRecipeCommentDto);
  }

  //get recipe comment by ID
  // @Get('comment/:id')
  // @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  // @ApiOperation({ summary: 'Get recipe comment by ID' })
  // @ApiParam({ name: 'id', description: 'ID of the recipe', type: String })
  // @ResponseMessage('Recipe comment retrieved successfully by ID')
  // @ApiOkResponse({
  //   description: 'Recipe comment retrieved successfully',
  //   type: CreateRecipeDto,
  // })
  // @ApiNotFoundResponse({ description: 'Recipe not found' })
  // @ApiBadRequestResponse({ description: 'Invalid ID format' })
  // async viewComments(@Param('id') id: string): Promise<RecipeDocument> {
  //   return this.recipeService.viewComments(id);
  // }

  //update recipe reply
  @Put('reply/:id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Update reply by ID' })
  @ApiParam({ name: 'id', description: 'ID of the recipe', type: String })
  @ApiBody({ type: UpdateRecipeCommentDto })
  @ResponseMessage('Comment updated reply successfully')
  @ApiOkResponse({
    description: 'Comment reply updated successfully',
    type: UpdateRecipeDto,
  })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async updateCommentReply(
    @Param('id') id: string,
    @Body() updateReplyDto: UpdateReplyDto,
  ): Promise<RecipeDocument> {
    return this.recipeService.updateReplyComment(id, updateReplyDto);
  }
}
