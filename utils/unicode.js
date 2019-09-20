/**
 * @file unicode
 * @author tangtian
 */

//unicode转汉字
function reconvert(str){
    str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    return str
}

module.exports = {
    reconvert
}