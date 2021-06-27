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
    summary: $('#novel_intro').text().replace(/飞卢小说网.+签约小说：.+；本小说及人物纯属虚构，如有雷同，纯属巧合，切勿模仿。/,""),
    status: $('i.textHide').text(),
    category: $('li > a.textHide:nth-child(4)').text(),
    words: $('li.textHide:nth-child(3)').text().replace(/字.+万粉/,""),
    update: $('li.textHide:nth-child(5)').text().replace("更新时间：",""),
    lastChapter: $('a.newNode').text(),
    catalog: `http:${$('div.btnLayout > a.textHide:nth-child(2)').attr('href')}`
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
    let response = GET(url)
    let $ = HTML.parse(response)
    //未购买返回403和自动订阅地址
    if ($('div.nodeContent').text() == "您还没有登录 请登录后在继续阅读本部小说！ 立即登录 注册账号"||$('div.nodeContent').text() == "您的账户余额不足 请充值！ 立即充值") throw JSON.stringify({
        code: 403,
        message: url
    })
  return $('div.nodeContent')
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
        author: $('.spanAuthor').text(),
        cover: $('.collectBookPic > a > img').attr('src'),
        detail: $('.bookName').attr('href').replace("b.faloo.com/f/","wap.faloo.com/"),
      })
    })
  return JSON.stringify({
    books: array
  })
}

var bookSource = JSON.stringify({
  name: "飞卢",
  url: "faloo.com",
  version: 101,  
  authorization: `https://u.faloo.com/regist/Login.aspx`,
  cookies: ["faloo.com"]
})
