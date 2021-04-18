var bookSource = JSON.stringify({
  name: "若初文学网",
  url: "ruochu.com",
  version: 100,
  authorization: "https://m.ruochu.com/accounts/login",
  cookies: [".ruochu.com"],
})

const baseUrl = "https://m.ruochu.com"

//搜索
const search = (key) => {
  let response = GET(`https://search.ruochu.com/m/search?queryString=${encodeURI(key)}&highlight=false&page=1&extra=false`)
  let array = []
  let $ = JSON.parse(response)
  $.data.content.forEach((child) => {
    array.push({
      name: child.name,
      author: child.authorname,
      cover: `https://b-new.heiyanimg.com/book/${child.id}.jpg`,
      detail: `${baseUrl}/book/${child.id}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('.book-intro > div > .bd').text(),
    status: $('.finish').text(),
    category: $('.tags').text(),
    words: $('.info').text().match(/(?<= )(\S+?)(?=字)/)[0],
    update: $('.time').text().match(/(?<=更新于)(.+)/)[0],
    lastChapter: $('.update > a > span[style]').text(),
    catalog: $('.chapters > a').attr('href').replace('m.ruochu.com/chapter', 'a.ruochu.com/m/ajax/book').replace('?isAsc=', '/chapter')
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(`${url}?volumeIndex=0`)
  let $ = JSON.parse(response)
  let array = []
  catalogLoadPage(url, array, $)
  for (var i = 1; i < $.volumeNames.pageCount; i++) {
    response = GET(`${url}?volumeIndex=${i}`)
    $ = JSON.parse(response)
    catalogLoadPage(url, array, $)
  }
  return JSON.stringify(array)
}

//目录分页
const catalogLoadPage = (url, array, $) => {
  $.rf.forEach((chapter) => {
    array.push({
      name: chapter.name,
      url: url.replace('a.ruochu.com/m/ajax', 'm.ruochu.com').replace('chapter', chapter.id),
      vip: chapter.free == false
    })
  })
}

//章节
const chapter = (url) => {
  let response = GET(`https://a.ruochu.com/m/ajax/chapter/content${url.substring(url.lastIndexOf('/'))}`)
  let $ = JSON.parse(response)
  //VIP章节未购买返回403和自动订阅地址
  if ($.nopay == true) throw JSON.stringify({
    code: 403,
    message: url
  })
  //已购买
  if ($.chapter.htmlContent) return $.chapter.htmlContent
  //免费章节
  response = GET(url)
  $ = HTML.parse(response)
  return $('#chapterDiv > .page-content')
}

//个人中心
const profile = () => {
  let response = GET(`https://a.ruochu.com/m/ajax/user/info`)
  let $ = JSON.parse(response)
  return JSON.stringify({
    url: `https://accounts.ruochu.com/m/people/${$.userVO.id}`,
    nickname: $.userVO.name,
    recharge: 'https://pay.ruochu.com/m/accounts/pay',
    balance: [
      {
        name: '岩币',
        coin: $.balance
      },
      {
        name: '钻石',
        coin: $.coin
      }
    ]
  })
}