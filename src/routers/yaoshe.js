import Router from 'koa-router';
import Controller from '../controllers/yaoshe';

const router = new Router();


router.get('/category', Controller.getCategory)
router.get('/list/:category', Controller.getListByCategory)
router.post('/random', Controller.getRandom)
router.post('/recharge', Controller.recharge)
router.post('/:id', Controller.getOneBySeqId)


export default router