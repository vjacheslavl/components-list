import {Document} from "mongoose";

// don't forget to update src/server/models/firmware.ts
export interface Firmware extends Document{
    name: string;
    version: string,
    revision: string;
    description: string,
    isQaDone: boolean;
    isBeta: boolean;
    isReleased: boolean;
    isProduction: boolean;
    dateTimeAdded: Date;
    jenkinsLink: string;
}
