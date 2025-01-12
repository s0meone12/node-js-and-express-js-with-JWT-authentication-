const { format } = require("date-fns");
const { v4: uuid} = require("uuid");

const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");


const logEvents = async (msg, logName)=> {
    const dateTime =  `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${msg}\n`;
    console.log(logItem);
    try{
        if(!fs.existsSync(path.join(__dirname, ".." ,"logs"))){
            await fsPromise.mkdir(path.join(__dirname,".." , "logs"))
        }
        await fsPromise.appendFile(path.join(__dirname, ".." , "logs", logName), logItem)
    }catch(err){
        console.log(err);
    }
}

const logger = (req, res, next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = {logEvents, logger};
