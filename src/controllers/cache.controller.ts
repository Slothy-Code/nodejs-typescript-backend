import {Request, Response} from 'express';
import {Controller} from '../system/decorators/controller';
import {Route} from '../system/decorators/route';
const cache = require('memory-cache');

@Controller('/cache')
export class CacheController {

    @Route({route: '/export'})
    public async export(req: Request, res: Response) {
        let exported = JSON.stringify(cache.exportJson());
        exported = exported.replace(/\\/g, '');
        exported = exported.replace(/"{/g, '{');
        exported = exported.replace(/}"/g, '}');

        res.status(200).json(JSON.parse(exported))
    }

    @Route({route: '/import', type: 'post'})
    public async import(req: Request, res: Response) {
        try {
            cache.importJson(req.body.importedData, { skipDuplicates: true });

            res.status(200).json(req.body.importedData)
        } catch (err) {
            res.status(400).json(err)
        }

    }

}
