import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/request/create-item.dto';
import { UpdateItemDto } from './dto/request/update-item.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { ItemDocument } from './item.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { UpdateRecipeStatusDto } from './dto/request/update-recipe-status.dto';
import { UpdateRecipeDto } from './dto/request/update-recipe.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { ItemCountByCategory } from './interfaces/item-by-categoy';

@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get('/sales-items')
  @ApiOperation({ summary: 'Get all sales items' })
  @ResponseMessage('Successfully retrieved all sales items')
  @ApiResponse({ status: HttpStatus.OK, description: 'Sales items retrieved successfully' })
  @ApiNotFoundResponse({ description: 'No sales items found' })
  async getAllSalesItems(): Promise<ItemDocument[]> {
    return this.itemService.getAllSalesItems();
  }

  @Get('/purchase-items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef, Role.Cashier)
  @ApiOperation({ summary: 'Get all purchase items' })
  @ResponseMessage('Successfully retrieved all purchase items')
  @ApiResponse({ status: HttpStatus.OK, description: 'Purchase items retrieved successfully' })
  @ApiNotFoundResponse({ description: 'No purchase items found' })
  async getAllPurchaseItems(): Promise<ItemDocument[]> {
    return this.itemService.getAllPurchaseItems();
  }

  @Get('/approved-recipes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Get all approved recipes' })
  @ResponseMessage('Successfully retrieved all approved recipes')
  @ApiResponse({ status: HttpStatus.OK, description: 'Approved recipes retrieved successfully' })
  @ApiNotFoundResponse({ description: 'No approved recipes found' })
  async getAllApprovedRecipes(): Promise<ItemDocument[]> {
    return this.itemService.getAllApprovedRecipes();
  }

  @Get('/count-by-category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier)
  @ApiOperation({ summary: 'Count items by category' })
  @ResponseMessage('Item counts by category retrieved successfully')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item counts by category retrieved successfully',
  })
  async countItemsByCategory(): Promise<ItemCountByCategory[]> {
    return this.itemService.countItemsByCategory();
  }

  @Get('/recipes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Get all recipe items' })
  @ResponseMessage('Successfully retrieved all recipe items')
  @ApiResponse({ status: HttpStatus.OK, description: 'Recipe items retrieved successfully' })
  @ApiNotFoundResponse({ description: 'No recipe items found' })
  async getAllRecipesItems(): Promise<ItemDocument[]> {
    return this.itemService.getAllRecipesItems();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Retrieve an item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the item to retrieve', type: String })
  @ResponseMessage('Item retrieved successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Item retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async getItemById(@Param('id') id: string): Promise<ItemDocument> {
    return this.itemService.getItemById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Create a new item' })
  @ApiBody({ type: CreateItemDto })
  @ResponseMessage('Item created successfully')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Item created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @UseInterceptors(
    FileInterceptor('itemImage', {
      limits: { fileSize: 1024 * 1024 * 3 },
    }),
  )
  async createItem(
    @UploadedFile() file: Express.Multer.File,
    @Body() createItemDto: CreateItemDto,
  ): Promise<ItemDocument> {
    let itemImage: string = '';
    if (file) {
      const uploadedImages = await this.fileUploadService.uploadFilesToS3([file]);
      itemImage = uploadedImages[0];
    }

    return this.itemService.createItem(createItemDto, itemImage);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Update an item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the item to update', type: String })
  @ApiBody({ type: UpdateItemDto })
  @ResponseMessage('Item updated successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Item updated successfully' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @UseInterceptors(
    FileInterceptor('itemImage', {
      limits: { fileSize: 1024 * 1024 * 3 },
    }),
  )
  async updateItem(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ItemDocument> {
    let itemImage: string | null = null;
    if (file) {
      const uploadedImages = await this.fileUploadService.uploadFilesToS3([file]);
      itemImage = uploadedImages[0];
    }
    return this.itemService.updateItem(id, updateItemDto, itemImage);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Delete an item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the item to delete', type: String })
  @ResponseMessage('Item deleted successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Item deleted successfully' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async deleteItem(@Param('id') id: string): Promise<void> {
    await this.itemService.deleteItem(id);
  }

  @Put('recipe-status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Update recipe status by item ID' })
  @ApiParam({ name: 'id', description: 'ID of the item to update recipe status', type: String })
  @ApiBody({ type: UpdateRecipeStatusDto })
  @ResponseMessage('Recipe status updated successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Recipe status updated successfully' })
  @ApiNotFoundResponse({ description: 'Item or recipe status not found' })
  async updateRecipeStatus(
    @Param('id') id: string,
    @Body() updateRecipeStatusDto: UpdateRecipeStatusDto,
  ): Promise<ItemDocument> {
    return this.itemService.updateRecipeStatus(id, updateRecipeStatusDto);
  }

  @Delete('/category/:categoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Delete items by category ID' })
  @ApiParam({ name: 'categoryId', description: 'Category ID of the items to delete', type: String })
  @ResponseMessage('Items deleted by category successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Items deleted by category successfully' })
  async deleteItemsByCategory(@Param('categoryId') categoryId: string): Promise<void> {
    await this.itemService.deleteItemsByCategoryId(categoryId);
  }

  @Put('recipe/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Update recipe by item ID' })
  @ApiParam({ name: 'id', description: 'ID of the item to update recipe', type: String })
  @ApiBody({ type: UpdateRecipeDto })
  @ResponseMessage('Recipe updated successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Recipe updated successfully' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<ItemDocument> {
    return this.itemService.updateRecipe(id, updateRecipeDto);
  }

  @Get('supplier/:supplierId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Get items by supplier ID' })
  @ApiParam({ name: 'supplierId', description: 'ID of the supplier', type: String })
  @ResponseMessage('Items by supplier retrieved successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Items by supplier retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Supplier or items not found' })
  async getItemsBySupplierId(
    @Param('supplierId') supplierId: string,
    @Query('page') page: number,
  ): Promise<PaginatedDto<ItemDocument>> {
    return this.itemService.getItemsBySupplierId(supplierId, page);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Retrieve all items' })
  @ResponseMessage('All items fetched successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Items retrieved successfully' })
  @ApiNotFoundResponse({ description: 'No items found' })
  async getAllItems(): Promise<PaginatedDto<ItemDocument>> {
    return this.itemService.getAllItems();
  }
}
