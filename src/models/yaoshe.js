const mongo = require('../lib/db')

class Model{
    constructor(){
        this.collection = 'yaoshe';
        this.init();
    }
    async init(){
        const db = await mongo();
        this.instance = db.collection(this.collection);
    }
    async findOne(query = {}){
        return  await this.instance.findOne(query)
    }
    async list(query={}, limit=10, skip=0, project={}){
        const list = await this.instance.find(query).project(project).limit(limit).skip(skip).toArray();
        const count = await this.instance.count(query)
        return {list,count};
    }
}

module.exports = new Model()