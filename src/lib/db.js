
import config from '../config';
import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;
const {mongo:defaultConfig} = config;
// export default async (opt={}) => {
//     let options = {...config.mongo,opt};
//     let key = `${options.host}_${options.port}_${options.db}`;
//     if (mongodbPool[key]) {
//         let db = mongodbPool[key].db;
//         mongodbPool[key].number++;
//         return db;
//     }
//     let url = `mongodb://${options.host}:${options.port}/${options.db}`;
//     let db = await MongoClient.connect(url, {
//         "poolSize": 200,
//         "reconnectTries": 86400,
//         "reconnectInterval": 1000,
//     });
//     mongodbPool[key] = {
//         db: db,
//         number: 1
//     };
//     return db;
// };



// const {mongo:defaultConfig} = require('../../config')
// const {MongoClient} = require('mongodb');

const clientPool = {};
const refresh = ()=>{
    let arr = Object.keys(clientPool)
    if(arr.length > 10){
        for(let client of arr){
            clientPool[client].close();
            delete clientPool[client]
        }
    }
}

module.exports = async ({host,port,dbName}=defaultConfig)=>{
    const dbcash_key = `${host}${port}`;
    return new Promise((resolve,reject)=>{
        if(clientPool[dbcash_key]){
            resolve(clientPool[dbcash_key].db(dbName))
        }
        // Connection URL
        const url = `mongodb://${host}:${port}`;
        MongoClient.connect(url,{poolSize: 5},function(err, client) {
            if(!err){
                console.log("Connected successfully to server");
                refresh();
                const db = client.db(dbName);
                clientPool[dbcash_key] = client;
                resolve(db);
            }else{
                console.error(err)
                reject(err)
            }
        });
    })
}