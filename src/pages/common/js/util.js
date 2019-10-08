const fs=require('fs');
const path=require('path');

const util=(function(){
    const filePath='D:\\records.txt';
    function saveRecord(data,cb){
        let records=readRecord();
        data.id=uuid();
        records.push(data);
        fs.open(filePath, 'w', function (err, data) {
            if (err) throw err;
            fs.writeFile(filePath,JSON.stringify(records),err=>{
                if(err){
                    throw  err;
                }
                cb&&cb();
            })
        });
    }
    function deleteRecord(id,cb){
        let records=readRecord();
        for(let i=0;i<records.length;i++){
            if(records[i].id==id){
                records.splice(i,1);
                fs.writeFile(filePath,JSON.stringify(records),err=>{
                    if(err){
                        throw  err;
                    }
                    cb&&cb();
                })
                return;
            }
        }
    }
    function editRecord(data,cb){
        let records=readRecord();
        for(let i=0;i<records.length;i++){
            if(records[i].id==data.id){
                records[i]=data;
                fs.writeFile(filePath,JSON.stringify(records),err=>{
                    if(err){
                        throw  err;
                    }
                    cb&&cb();
                })
                return;
            }
        }
    }
    function readRecord(cb){
        let data=[];
        try{
            let stats=fs.statSync(filePath);
            if(stats && stats.isFile()){
                data=fs.readFileSync(filePath,'utf-8');
                if(data){
                    try{
                        data=JSON.parse(data);
                    }catch (e) {
                        throw new Error('读取文件错误');
                    }
                }
            }
        }catch(e){

        }
        return data;
    }

    function getStat(path){
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if(err){
                    resolve(false);
                }else{
                    resolve(stats);
                }
            })
        })
    }
    function mkdir(dir){
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, err => {
                if(err){
                    resolve(false);
                }else{
                    resolve(true);
                }
            })
        })
    }
    function uuid() {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        let uuid = s.join("");
        return uuid;
    }
    return {
        saveRecord,
        deleteRecord,
        editRecord,
        readRecord
    }
}())
if(module){
    module.exports={
        ...util
    }
}