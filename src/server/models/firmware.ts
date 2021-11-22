import Database from '../dbConfigs';
import {Schema} from "mongoose";
import { Firmware } from "../domain/Firmware";

const {mongo: {model}} = Database; 

// don't forget to update src/server/domain/Firmware.ts
const FirmwareSchema: Schema<Firmware> = new Schema<Firmware>({
    name: {type: String, required: true},
    version: {type: String, required: true},
    description: {type: String, required: false},
    revision: {type: String, required: false},
    jenkinsLink: {type: String, required: true},
    isQaDone: {type: Boolean, required: true},
    isBeta: {type: Boolean, required: true},
    isReleased: {type: Boolean, required: true},
    isProduction: {type: Boolean, required: false, default: false},
    dateTimeAdded: { type: Date, default: Date.now }
});

export default model<Firmware>('Firmwares',FirmwareSchema);

