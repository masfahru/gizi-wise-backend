import { LoggedUser } from '@common/decorators/logged-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AdminAuth } from '../admin-auth/admin-auth.decorator';
import { AdminService } from './admin.service';
import { AdminDto } from './dto/admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ResponseListAdminDto } from './dto/list-admin.dto';
import { QueryListAdminDto } from './dto/query-list-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminRole } from './entities/admin.entity';

@AdminAuth()
@ApiTags('Admins')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  async findAll(
    @Query() queryListAdminDto: QueryListAdminDto,
  ): Promise<ResponseListAdminDto> {
    const { page, limit } = queryListAdminDto;
    queryListAdminDto.offset = (page - 1) * limit;
    const { admins, count } = await this.adminService.findAll(
      queryListAdminDto,
    );
    return new ResponseListAdminDto({
      admins,
      page,
      limit,
      totalData: count,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @ApiBody({
    description: 'Update admin data, only filled field will be updated',
    type: CreateAdminDto,
  })
  @Patch(':id')
  update(
    @LoggedUser() user: AdminDto,
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    if (user.id !== id && user.role !== AdminRole.SUPER_ADMIN) {
      throw new UnauthorizedException(
        'You are not authorized to update this admin',
      );
    }
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
