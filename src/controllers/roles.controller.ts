import {Request, Response} from 'express';
import {Controller} from '../system/decorators/controller';
import {Route} from '../system/decorators/route';
const cache = require('memory-cache');
import * as permissions from '../permissions.json';
import {PermissionsUtil} from '../system/permissions/permissionsUtil';

@Controller('/roles')
export class RolesController {

    @Route({route: '/'})
    public async getAllRoles(req: Request, res: Response) {
        res.status(200).json(permissions);
    }

    @Route({route: '/permissions/:roleName'})
    public async getByName(req: Request, res: Response) {
        res.status(200).json({permissions: PermissionsUtil.getAllPermissions(req.params.roleName)});
    }

}