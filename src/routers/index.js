import Router from 'koa-router';

import Yaoshe from './yaoshe';

const router = new Router()

router.use('/yaoshe',Yaoshe.routes())

export default router;