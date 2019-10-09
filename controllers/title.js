const { mysql, cheerio, app, superagent, async, pool} = require('../utils/require');
const { reconvert } = require('../utils/unicode');
let urlList = require('../urlList');
urlList = urlList.slice(0);

let id = 0;//计数器

mian(urlList);

function main(urls){
    async.mapLimit(urls,30,function(url,callback){
        id++
        fetList(url,callback,id)
    },function(err,results){
        saveToMysql(results)
    })
}

function fetList(url,callback,id){
    superagent.get(url).end(function(err,res){
        if(err){
            return err;
        }
        let $ = cheerio.load(res.text);
    })
}

function saveToMysql(rets){
    rets.forEach(function(ret){
        pool.query('insert into booktitles set ?',ret,function(err,result){
            console.log(`insert ${result.id} success`)
        })
    });
}

app.get('/', function (req, response) {
    
})
  
app.listen(3379, function () {
    console.log('server listening on 3379')
})

