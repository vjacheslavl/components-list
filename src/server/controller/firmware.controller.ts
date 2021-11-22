import { FirmwareService } from '../service/firmware.service';

export class FirmwareController {

    private firmwareService: FirmwareService;

    constructor() {
        this.firmwareService = new FirmwareService();
    }

    async getFirmwares() {
        console.log('Controller: getFirmware')
        return await this.firmwareService.getFirmwares();
    }

    async createFirmware(firmware: any) {
        console.log('Controller: createFirmware', firmware);
        return await this.firmwareService.createFirmware(firmware);
    }

    async updateFirmware(firmware: any) {
        console.log('Controller: updateFirmware', firmware);
        return await this.firmwareService.updateFirmware(firmware);
    }

    async deleteFirmware(firmwareId: any) {
        console.log('Controller: deleteFirmware', firmwareId);
        return await this.firmwareService.deleteFirmware(firmwareId);
    }
}