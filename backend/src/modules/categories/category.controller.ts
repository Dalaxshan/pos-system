import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDocument } from './category.schema';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    description: 'Category added successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ResponseMessage('Category created successfully')
  @Post()
  async createCategory(@Body('name') name: string): Promise<CategoryDocument> {
    return this.categoryService.createCategory(name);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({
    description: 'List of all categories',
  })
  @ApiNotFoundResponse({ description: 'No categories found' })
  @ResponseMessage('All Categories fetched successfully')
  @Get()
  async getAllCategory(): Promise<CategoryDocument[]> {
    return this.categoryService.getAllCategory();
  }
}
