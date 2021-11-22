import router from '../router';
import {Request, Response} from "express";
import { FirmwareController } from '../../controller/firmware.controller';


var firmwareController: FirmwareController = new FirmwareController()

router.route('/firmwares')
    .get((req: Request, res: Response) => {
        firmwareController.getFirmwares().then(data => res.json(data));
    })
    .post((req: Request, res: Response) => {
        firmwareController.createFirmware(req.body).then(data => res.json(data));
    })
    .put((req: Request, res: Response) => {
        firmwareController.updateFirmware(req.body).then(data => res.json(data));
    });


export default router;
