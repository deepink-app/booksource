const baseUrl = "https://wap.faloo.com"

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`${baseUrl}/category/0/1.html?k=${ENCODE(key,"gb2312")}`)
  let array = []
  let $ = HTML.parse(response)
    $('.book_vessel').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('.show_title2 > a').text(),
        author: $('.show_author > a').text(),
        cover: $('.book_vessel_left > a > img').attr('src'),
        detail: `http:${$('.show_title2 > a').attr('href')}`,
      })
    })
  
  return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('#info2').text().match(/(?<=).+(?=飞卢小说网提醒：本小说及人物纯属虚构，如有雷同，纯属巧合，切勿模仿。)/)[0].replace("【收起】",""),
    status: $('dd:nth-child(3) > h2').text().replace("状态：",""),
    category: $('.dd_box:nth-child(3) > span > a').text(),
    words: $('.dd_box:nth-child(4) > h2').text().replace("字数：",""),
    update: $('.time').text(),
    lastChapter: $('.chap').text(),
    catalog: `http:${$('li:nth-child(4) > div:nth-child(2) > a').attr('href')}`
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
    $('[onclick=BookEx.listLink(this);]').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text().replace("V",""),
        url: `http:${$('a').attr('href')}`,
        vip: $('.v_0').text() == "V"
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let res = GET(url)
    let response = res.replace("活动:注册飞卢会员赠200点卷,马上注册!","").replace("充值：微信 支付宝 短信 更多","").replace("本书由飞卢小说网提供。","").replace("[免费听本书]","").replace("本书来自：wap.faloo.com。","")
    let $ = HTML.parse(response)
    //未购买返回403和自动订阅地址
    if ($('#content > a:nth-child(4)').text() == "订阅本章节>>"||$('#content > a:nth-child(5)').text() == "立即登录>>") throw JSON.stringify({
        code: 403,
        message: url
    })
  return $('#content')
}

//个人中心
const profile = () => {
  let response = GET(`https://u.faloo.com`)
  let $ = HTML.parse(response)
  return JSON.stringify({
    basic: [
      {
        name: '账号',
        value: $('.logo > span > img').attr('alt'),
        url: 'https://u.faloo.com'
      },
      {
        name: 'VIP点',
        value: $('ul > li:nth-child(7) > div.sInfo > div > i').text(),
        url: 'https://pay.faloo.com/'
      },
      {
        name: '点券',
        value: $('ul > li:nth-child(8) > div.sInfo > div > i').text(),
        url: 'https://pay.faloo.com/'
      },	  
      {
        name: '月票',
        value: $('ul > li:nth-child(5) > div.sInfo > div > i').text(),
        url: 'https://pay.faloo.com/'
      }
    ],
    extra: [
      {
        name: '书架',
        type: 'books',
        method: 'bookshelf'
      }
    ]
  })
}

/**
 * 我的书架
 * @param {页码} page 
 */
const bookshelf = (page) => {
  let response = GET(`https://u.faloo.com/UserFavoriate.aspx`)
  let array = []
  let $ = HTML.parse(response)
    $('.recentCollectContent > ul > li').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('.bookName').text(),
        author: $('.collectBookInfo > dl > dt:nth-child(2) > span:nth-child(1) > a').text(),
        cover: $('.collectBookPic > a > img').attr('src'),
        detail: $('.bookName').attr('href'),
      })
    })
  return JSON.stringify({
    books: array
  })
}

var bookSource = JSON.stringify({
  name: "飞卢",
  url: "faloo.com",
  version: 100,  
  authorization: `https://u.faloo.com/regist/Login.aspx`,
  cookies: ["faloo.com"]
})
