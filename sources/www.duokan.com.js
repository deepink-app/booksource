require("crypto-js")

//转换更新时间 时间戳
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
  var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
  var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
  var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
  var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
  return Y+M+D+h+m+s;
}

//搜索
const search = (key) => {
  let response = GET(`https://www.duokan.com/hs/v4/search?s=${key}&start=0&count=10&source=1,2,3,4,5,7,6&query_type=0&_t=&_c=&withid=1`)
  let array = []
  let $ = JSON.parse(response)
  $.items.forEach((child) => {
    array.push({
      name: child.title,
      author: child.authors,
      cover: child.cover,
      detail: `https://www.duokan.com/hs/v0/android/fiction/book/${child.fiction_id}?toc_start=0&preview_first=1&toc_count=10&discount=1&_t=&_c=&withid=1`
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).item
  let book = {
    summary: $.summary,
    status: $.finish == false ? '连载' : '完结',
    category: $.tags.join(" "),
    words: $.word_count,
    update: timestampToTime($.updated),
    lastChapter: $.latest,
    catalog: `https://www.duokan.com/store/v0/fiction/detail/${$.fiction_id}?discount=1&start=0&count=${$.chapter_count}&_t=&_c=&withid=1&fid=${$.fiction_id}`
    }
    return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response)
  let array = []
  $.item.toc.forEach((chapter) => {
    array.push({
      name: chapter.title,
      url: `https://www.duokan.com/drm/v0/fiction/link?chapter_id=${chapter.seq_id}&format=jsonp&withid=1&fiction_id=${url.query("fid")}&_t=&_c=`,
      vip: chapter.free ? false : true
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response)
  SET_COOKIE('user_id')
  content = ""
  if ($.url) enC = GET($.url).match(/'(.+?)'/)[1]
  else throw JSON.stringify({
    code: 403,
    message: "请前往多看阅读APP购买此章节"
  })
  decodeC = CryptoJS.enc.Base64.parse(enC).toString(CryptoJS.enc.Utf8)
  list = JSON.parse(decodeC)
  return list.p.join("\n")
}

function getc() {
  did = COOKIE("device_id")
  t = parseInt(new Date().getTime() / 1000);
  list = (did + "&" + t).split("");
  for (c = 0, i = 0; i < list.length; i++) {
    c = (c * 131 + list[i].charCodeAt()) % 65536;
  }
  a = `_t=${t}&_c=${c}`;
  return a;
}

//个人
const profile = () => {
    bean = 0
    let res = JSON.parse(POST('https://www.duokan.com/store/v0/award/coin/list', {
        data: `sandbox=0&${getc()}&withid=1`
    }))
    if (res.result == 0) {
        for (reward of res.data.award) bean += reward.coin
    } else throw JSON.stringify({
        code: 401
    })
    return JSON.stringify({
        basic: [{
                name: '账号',
                value: COOKIE("nick_name"),
                url: 'https://www.duokan.com/m/'
            },
            {
                name: '书豆',
                value: bean,
                url: 'https://www.duokan.com/m/'
            }
        ]
    })
}

var bookSource = JSON.stringify({
  name: "多看阅读",
  url: "www.duokan.com",
  authorization: "https://www.duokan.com",
  cookie: [".duokan.com"],
  version: 100
})
