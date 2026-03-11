import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
    constructor(private readonly syncService: SyncService) { }

    @Post('count-events')
    async syncEvents(@Request() req, @Body() events: any[]) {
        // Inject tenantId for safety
        const eventsWithTenant = events.map(e => ({
            ...e,
            tenantId: req.user.tenantId,
            userId: req.user.id
        }));
        return this.syncService.processCountEvents(req.user.tenantId, eventsWithTenant);
    }
}
