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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/request/create-customer.dto';
import { UpdateCustomerDto } from './dto/request/update-customer.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { CustomerDocument } from './customer.schema';

@ApiTags('Customer')
@Controller('customer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier)
  @ApiOperation({ summary: 'Retrieve all customers' })
  @ResponseMessage('Retrieved all customers successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Customers fetched successfully' })
  @ApiNotFoundResponse({ description: 'No customers found' })
  async getAllCustomers(): Promise<CustomerDocument[]> {
    return this.customerService.getAllCustomers();
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier)
  @ApiOperation({ summary: 'Retrieve a customer by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the customer to retrieve',
    type: String,
  })
  @ResponseMessage('Retrieved customer successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer fetched successfully' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  async getCustomerById(@Param('id') id: string): Promise<CustomerDocument> {
    return this.customerService.getCustomerById(id);
  }

  @Post()
  @AllowedRoles(Role.SuperAdmin, Role.Admin, Role.Cashier)
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ResponseMessage('Customer created successfully')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Customer added successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async customerRegistration(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDocument> {
    return this.customerService.registerCustomer(createCustomerDto);
  }

  @Put(':id')
  @AllowedRoles(Role.SuperAdmin, Role.Admin, Role.Cashier)
  @ApiOperation({ summary: 'Update an existing customer' })
  @ApiParam({
    name: 'id',
    description: 'ID of the customer to update',
    type: String,
  })
  @ApiBody({ type: UpdateCustomerDto })
  @ResponseMessage('Customer updated successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer updated successfully' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDocument> {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  @AllowedRoles(Role.SuperAdmin, Role.Admin, Role.Cashier)
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the customer to delete',
    type: String,
  })
  @ResponseMessage('Customer deleted successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer deleted successfully' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    await this.customerService.deleteCustomer(id);
  }
}
