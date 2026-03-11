import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemsService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string, skip = 0, take = 50) {
        return this.prisma.item.findMany({
            where: { tenantId },
            skip,
            take,
            include: { identifiers: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(data: any) {
        const { identifiers, expiry, productionDate, boxLength, boxWidth, boxHeight, boxWeight, ...rest } = data;
        return this.prisma.item.create({
            data: {
                ...rest,
                expiry: expiry ? new Date(expiry) : undefined,
                productionDate: productionDate ? new Date(productionDate) : undefined,
                boxLength: boxLength ? parseFloat(boxLength) : undefined,
                boxWidth: boxWidth ? parseFloat(boxWidth) : undefined,
                boxHeight: boxHeight ? parseFloat(boxHeight) : undefined,
                boxWeight: boxWeight ? parseFloat(boxWeight) : undefined,
                identifiers: { create: identifiers || [] },
            },
            include: { identifiers: true },
        });
    }

    async bulkSync(tenantId: string, items: any[]) {
        for (const item of items) {
            if (!item.sku || !item.name) continue;
            await this.prisma.item.upsert({
                where: { tenantId_sku: { tenantId, sku: item.sku } },
                update: {
                    name: item.name,
                    brandName: item.brandName || item.brand_name,
                    gtin: item.gtin,
                    batch: item.batch,
                    barcode: item.barcode,
                    qrCode: item.qrCode || item.qr_code,
                    serialNumber: item.serialNumber || item.serial_number,
                    upc: item.upc,
                    expiry: item.expiry ? new Date(item.expiry) : undefined,
                    productionDate: item.productionDate || item.production_date ? new Date(item.productionDate || item.production_date) : undefined,
                },
                create: {
                    sku: item.sku,
                    name: item.name,
                    brandName: item.brandName || item.brand_name,
                    gtin: item.gtin,
                    batch: item.batch,
                    barcode: item.barcode,
                    qrCode: item.qrCode || item.qr_code,
                    serialNumber: item.serialNumber || item.serial_number,
                    upc: item.upc,
                    expiry: item.expiry ? new Date(item.expiry) : undefined,
                    productionDate: item.productionDate || item.production_date ? new Date(item.productionDate || item.production_date) : undefined,
                    tenantId,
                    identifiers: {
                        create: [
                            ...(item.barcode ? [{ type: 'BARCODE', value: item.barcode }] : []),
                            ...(item.gtin ? [{ type: 'GTIN', value: item.gtin }] : []),
                            ...(item.upc ? [{ type: 'UPC', value: item.upc }] : []),
                        ],
                    },
                },
            });
        }
    }
}
