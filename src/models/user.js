const mongo = require('../lib/db')

class Model{
    constructor(){
        this.collection = 'users';
        this.init();
    }
    async init(){
        const db = await mongo();
        this.instance = db.collection(this.collection);
    }
    async insert(info){
        const obj = {
            info,
            randomTimes: 3,
            realTimes: 0,
            createdAt: new Date()
        }
        return await this.instance.insertOne(obj)
    }
    async getRandomTimes(obj){
        const {name} = obj;
        let user = await this.instance.findOne({'info.name': name});
        if(!user){
            await this.insert(obj)
            return 3;
        }else{
            return user.randomTimes
        }
    }
    async getRealTimes(obj){
        const {name} = obj;
        let user = await this.instance.findOne({'info.name': name});
        if(!user){
            await this.insert(obj);
            return 0;
        }else{
            return user.realTimes
        }
    }
    async increase(obj,fileds){
        let res = await this.instance.findOneAndUpdate({'info.name': obj.name},{$inc:fileds},{returnNewDocument: true})
        return res.value;
    }
    async update(obj,fileds){
       let res = await this.instance.findOneAndUpdate({'info.name': obj.name},{$set:fileds},{returnNewDocument: true})
       return res.value;
    }
    async list(query={}){
        return this.instance.find(query).toArray();
    }
}

module.exports = new Model()