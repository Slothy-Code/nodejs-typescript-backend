import {Request, Response} from 'express';
import {Controller} from '../system/decorators/controller';
import {Route} from '../system/decorators/route';
import * as permissions from '../permissions.json';
import {PermissionsUtil} from '../system/permissions/permissionsUtil';

const cache = require('memory-cache');

@Controller('/roles')
export class RolesController {

    @Route({route: '/', permission: 'roles.getAll'})
    public async getAllRoles(req: Request, res: Response) {
        res.status(200).json(permissions);
    }

    @Route({route: '/permissions/:roleName', permission: 'roles.getByName'})
    public async getByName(req: Request, res: Response) {
        res.status(200).json({permissions: PermissionsUtil.getAllPermissions(req.params.roleName)});
    }
}