import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    async findAll(@Request() req: any) {
        const roles = req.user.roles || [];
        const isGlobal = roles.includes('Admin') || roles.includes('AuditManager');
        return this.usersService.findAll(req.user.tenantId, isGlobal);
    }

    @Get('roles')
    async findAllRoles(@Request() req: any) {
        return this.usersService.getRoles(req.user.tenantId);
    }

    @Post()
    async create(@Request() req: any, @Body() createUserDto: any) {
        return this.usersService.create(req.user.tenantId, createUserDto);
    }
}
