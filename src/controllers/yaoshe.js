import config from '../config'
import UserModel from '../models/user'
import YaosheModel from '../models/yaoshe'
class Yaoshe {
    constructor() {
        this.collection = 'yaoshe';
        this.domain = config.yaoshe;
        this.pageSize = 5;
        this._getMenu();
    }
    processResource(list) {
        list.forEach(obj => {
            if (obj.url) obj.url = `${this.domain}${obj.url}`;
            if (obj.embed_url) obj.embed_url = `${this.domain}${obj.embed_url}`
            if (obj.target_url) obj.target_url = `${this.domain}${obj.target_url}`
            obj.time = `${parseInt(obj.seconds / 60)}分${obj.seconds % 60}秒`
        })
        return list;
    }
    _getMenu = async () => {
        if (!this.menu) {
            let list = await YaosheModel.instance.distinct('categories');
            list = list.map((item, index) => ({
                name: item,
                id: index + 1
            }))
            this.menu = list;
        }
        return this.menu
    }
    getCategory = async (ctx) => {
        let menu = await this._getMenu()
        return ctx.respondData(200, menu);
    }
    getListByCategory = async (ctx) => {
        const { category } = ctx.params;
        const { page = 1 } = ctx.query;
        const menu = await this._getMenu();
        let cate = menu.find(item => item.id == category);
        if (cate) {
            let { name } = cate;
            let { list, count } = await YaosheModel.list({
                categories: name
            }, this.pageSize, (parseInt(page)-1) * this.pageSize, {
                embed_url: 0,
                target_url: 0,
                url: 0
            });
            list = this.processResource(list)
            // console.log({
            //     list,
            //     count,
            //     category: name,
            //     currentPage: page,
            //     totalPage: Math.ceil(count / this.pageSize)
            // })
            return ctx.respondData(200, {
                list,
                count,
                category: name,
                currentPage: page,
                totalPage: Math.ceil(count / this.pageSize)
            })
        } else {
            return ctx.respondData(403, {
                msg: '输入有误, 分类不存在'
            })
        }
    }
    getRandom = async (ctx) => {
        const {
            user
        } = ctx.request.body;
        const randomTimes = await UserModel.getRandomTimes(user);
        let video = {}
        if (randomTimes > 0) {
            let random = Math.floor(Math.random() * 6000);
            let {list} = await YaosheModel.list({}, 1, random);
            // console.log(list)
            list = this.processResource(list);
            UserModel.update(user, {
                randomTimes: randomTimes - 1
            });
            video = list[0]
        }
        return ctx.respondData(200, {
            video,
            randomTimes: randomTimes - 1
        });
    }
    getOneBySeqId = async (ctx) => {
        const {
            id: seq_id
        } = ctx.params;
        const {
            user
        } = ctx.request.body;
        const realTimes = await UserModel.getRealTimes(user);
        if (realTimes) {
            let res = await YaosheModel.findOne({
                seq_id: Number(seq_id)
            });
            res = this.processResource([res]);
            UserModel.update(user, {
                realTimes: realTimes - 1
            });
            return ctx.respondData(200, {
                video: res[0],
                realTimes: realTimes - 1
            });
        } else {
            return ctx.respondData(200, {
                realTimes
            });
        }
    }
    info = async (ctx) => {
        return ctx.respondData(200)
    }
    recharge = async (ctx) => {
        const {
            user
        } = ctx.request.body;
        let res = await  UserModel.increase(user, {realTimes: 3});
        return ctx.respondData(200,res)
    }
}


export default new Yaoshe();

