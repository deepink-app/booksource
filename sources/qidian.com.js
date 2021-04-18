var bookSource = JSON.stringify({
  name: "起点中文网",
  url: "qidian.com",
  version: 100,
  authorization: "https://passport.yuewen.com/yuewen.html?areaid=1&appid=13&source=m",
  cookies: [".qidian.com", ".yuewen.com"],
})

const baseUrl = "https://m.qidian.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/search?kw=${encodeURI(key)}`)
  let array = []
  let $ = HTML.parse(response)
  $('li.book-li').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('.book-title').text(),
      author: $('span.book-author').text().match('(?<=作者)(.+)')[0].trim(),
      cover: `https:${$('img').attr('data-src')}`,
      detail: `${baseUrl}${$('a').attr('href')}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('content').text(),
    status: $('.book-meta:nth-child(5)').text().match(/(?<=\|)(.+)/)[0],
    category: $('.book-meta:nth-child(4)').text().replace('/', ' '),
    words: $('.book-meta:nth-child(5)').text().match(/(.+)(?=字)/)[0],
    update: $('#ariaMuLu').text().match(/(.+)(?=·)/)[0],
    lastChapter: $('#ariaMuLu').text().match(/(?<=·连载至)(.+)/)[0],
    catalog: `${baseUrl}/majax/book/category?bookId=${$('#bookDetailWrapper').attr('data-book-id')}`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(`${url}&_csrfToken=${COOKIE('_csrfToken')}`)
  let $ = JSON.parse(response)
  let array = []
  $.data.vs.forEach((booklet) => {
    array.push({ name: booklet.vN })
    booklet.cs.forEach((chapter) => {
      array.push({
        name: chapter.cN,
        url: `${baseUrl}/majax/chapter/getChapterInfo?bookId=${url.query('bookId')}&chapterId=${chapter.id}`
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(`${url}&_csrfToken=${COOKIE('_csrfToken')}`)
  let $ = JSON.parse(response).data.chapterInfo
  //VIP章节
  if ($.vipStatus == 1) {
    //未购买返回403和自动订阅地址
    if ($.isBuy == 0) throw JSON.stringify({
      code: 403,
      message: `${baseUrl}/book/${url.query('bookId')}/${url.query('chapterId')}`
    })
  }
  return $.content
}

//个人中心
const profile = () => {
  let response = GET(`${baseUrl}/user`)
  let $ = HTML.parse(response)
  return JSON.stringify({
    url: 'https://m.qidian.com/user',
    nickname: $('div.center-header > p').text(),
    recharge: 'https://pay.yuewen.com/h5/index?appId=13&areaId=31&returnUrl=http%3A%2F%2Fm.qidian.com%2Fuser%3Ffrom%3Dpay',
    balance: [
      {
        name: '起点币',
        coin: $('ul.btn-group > li:last-child > a > output').text()
      }
    ]
  })
}