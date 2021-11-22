import { FilterQuery } from 'mongoose';
import { Firmware } from '../domain/Firmware';
import FirmwaresModel from '../models/firmware';

export class FirmwareRepository {


    async getFirmwares() {
        const firmwares = await FirmwaresModel.find({});
        return firmwares;
    }

    async createFirmware(firmware: any) {
        let data = {};
        try {
            data = await FirmwaresModel.create(firmware);
        } catch(err) {
            console.error('Error::' + err);
        }
        return data;
    }

    async updateFirmware(firmware: any) {
        let data = {};
        try {
            FirmwaresModel.updateOne({_id: firmware.id}, {$set:firmware.payload}, {}, (err, test) => {
                if (err){
                    console.error(err);
                }
            })
        } catch(err) {
            console.error('Error::' + err);
        }
        return data;
    }

    async deleteFirmware(firmwareId: any) {
        let data: any = {};
        try {
            data = await FirmwaresModel.deleteOne({_id : firmwareId});
        } catch(err) {
            console.error('Error::' + err);
        }
        return {status: `${data.deletedCount > 0 ? true : false}`};
    }
}