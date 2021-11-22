import { Firmware } from '../domain/Firmware';
import { FirmwareRepository } from '../repository/firmware.repository';
import telegram_messages from './telegram_messages';

export class FirmwareService {

    private firmwareRepository: FirmwareRepository;

    constructor() {
        this.firmwareRepository = new FirmwareRepository();
    }

    async getFirmwares() {
        return await this.firmwareRepository.getFirmwares();
    }

    async createFirmware(firmware: Firmware) {
        telegram_messages(firmware);
        return await this.firmwareRepository.createFirmware(firmware);
    }

    async updateFirmware(firmware: any) {
        var result = {
            id: firmware.id,
            payload: {}
        }

        switch (firmware.field) {
            case "isQaDone":
                result.payload = { isQaDone: firmware.value }
                break;
            case "isBeta":
                result.payload = { isBeta: firmware.value }
                break;
            case "isReleased":
                result.payload = { isReleased: firmware.value }
                break;
            case "isProduction":
                result.payload = { isProduction: firmware.value }
                break;
            case "description":
                    result.payload = { description: firmware.value }
                    break;    
            default:
                console.log("No such value exists - " + firmware.field);
                break;
        }

        return await this.firmwareRepository.updateFirmware(result);
    }

    async deleteFirmware(firmwareId: any) {
        return await this.firmwareRepository.deleteFirmware(firmwareId);
    }

}