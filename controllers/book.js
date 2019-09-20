let urlList = require('../urlList');
const { mysql, cheerio, app, superagent, async, pool} = require('../utils/require');
const { reconvert } = require('../utils/unicode');

let num = 1;//从第几本书开始，失败更改此处
let bookID = num;
let url = urlList[bookID-1];
let table = num  //表名
let total = 0;//章节数
let id = 0;//计数器
const chapters = 100 //爬取多少章

main(url);

//获取书籍相关信息
function main(url){
  console.log(url)
  superagent
    .get(url)
    .end((err,res)=>{
      // if(err){
      //     return err;
      // }
      let $ = cheerio.load(res.text);
      let urls = [];
      total = $('.chapter li').length;
      $('.chapter li').each((i,ele)=>{
        if(i<total){
          urls.push(url + $(ele).find('a').attr('href'))
        }
      })
      async.mapLimit(urls,30,function(url,callback){
        id++
        feturl(url,callback,id)
      },function(err,results){
        saveToMysql(results)
      })
  })
}

function feturl(url,callback,id){
  superagent
  .get(url)
  // .retry(2) 
  // .timeout({
  //   response: 5000,  //5s
  //   deadline: 15000, // 15s
  // })
  .end(function(err,res){
      if(err){
          return err;
      }
      console.log(res)
      if(res!= undefined){
      let $ = cheerio.load(res.text);
      const arr = [];
      const content = reconvert($("#txt").html());
      //分析结构后分割html
      const contentArr = content.split('<p></p>')
      contentArr.forEach(ele=>{
        const data = ele.toString().replace(/(^\s*)|(\s*$)/g, '').replace(/&nbsp;/g, '');
        arr.push(data);
      });
      let bookname = $('.position a').eq(1).text();
      const obj = {
        id: id,
        err: 0,
        bookname: bookname.substring(0,bookname.length-7),
        title:$('#nr_title').text(),
        content:arr.join('-').slice(0,20000)
      }
      callback(null, obj)  //将obj传递给第四个参数中的results
    }
  })
}

function saveToMysql(rets) {
  id = 0
  console.log(rets)
  rets.some(function(ret){
    console.log(ret)
    pool.query('insert into book' + table + ' set ?',ret,function(err,result){
      if(ret.id == rets.length){
        bookID++
        url = urlList[bookID-1];
        table++;
        id = 0;
        console.log('写入成功')
        main(url);
        // return ture;
      }
    })
  })
}

// //unicode转汉字
// function reconvert(str){
//   str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
//     return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
//   });
//   return str
// }

app.get('/', function (req, response, next) {
  
})

app.listen(3000, function () {
  console.log('server listening on 3000')
})