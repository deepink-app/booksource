const baseUrl = "https://w1.heiyan.com"

//搜索
const search = (key) => {
  let response = GET(`http://search.heiyan.com/web/search?queryString=${encodeURI(key)}&highlight=false`)
  let array = []
  let $ = JSON.parse(response)
  $.data.content.forEach((child) => {
    array.push({
      name: child.name,
      author: child.authorname,
      cover: `https://b.heiyanimg.com/book/${child.id}.jpg`,
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
    summary: $('meta[property=og:description]').match('(?<=content=")(.+?)(?=">)')[0],
    status: $('meta[property=og:novel:status]').match('(?<=content=")(.+?)(?=">)')[0],
    category: $('meta[property=og:novel:category]').match('(?<=content=")(.+?)(?=">)')[0],
    words: $('div.info > div:nth-child(3)').match('(?<=)(.+?)(?=字)')[0],
    update: $('meta[property=og:novel:update_time]').match('(?<=content=")(.+?)(?=">)')[0],
    lastChapter: $('meta[property=og:novel:latest_chapter_name]').match('(?<=content=")(.+?)(?=">)')[0],
    catalog: $('div.more-index > a').attr('href').replace('w1.', 'www.')
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
  $('ul.float-list > li').forEach((chapter) => {
    let $ = HTML.parse(chapter)
    let isvip = $('a.isvip').length != 0
    array.push({
      name: $('a').text(),
      url: (`${$('a').attr('href')}`).replace('wwww.', 'w1.') + `?isvip=${isvip}`,
      vip: isvip
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  //VIP章节
  if (url.query('isvip')) {
    //未购买返回403和自动订阅地址
    if ($('.page-content').text().length < 200) throw JSON.stringify({
      code: 403,
      message: `可手动开启自动订阅`
    })
  }
  return $('.page-content').text()
}

//个人中心
const profile = () => {
  let response = GET(`${baseUrl}/my/profile`)
  let $ = HTML.parse(response)
  return JSON.stringify({
    url: 'https://accounts.heiyan.com/m/people/',
    nickname: $('div.userInfo > div.right > p.name > a').text(),
    recharge: 'https://pay.heiyan.com/m/accounts/pay',
    balance: [
      {
        name: '岩币',
        coin: $('p.title > span.money').text()
      },
      {
        name: '赠币',
        coin: $('p.title > span.shell').text()
      }
    ],
  })
}

//排行榜
const rank = (title, category, page) => {
  let response = GET(`https://search.heiyan.com/m/all?order=${title}&sort=${category}&page=${page + 1}&words=-1&free=&finish=&solicitingid=0`)
  let array = []
  let $ = JSON.parse(response)
  $.data.content.forEach((child) => {
    array.push({
      name: child.name,
      author: child.authorname,
      cover: `https://b.heiyanimg.com/book/${child.id}.jpg`,
      detail: `${baseUrl}/book/${child.id}`,
    })
  })
  return JSON.stringify(array)
}

const catagoryAll = [
  { key: "-1", value: "全部" }, { key: "3", value: "历史" }, { key: "5", value: "军事" },
  { key: "6", value: "玄幻" }, { key: "14", value: "奇幻" }, { key: "7", value: "仙侠" },
  { key: "8", value: "武侠" }, { key: "10", value: "科幻" }, { key: "9", value: "游戏" },
  { key: "25", value: "现代" }, { key: "36", value: "古言" }, { key: "54", value: "现实" }
]

const ranks = [
  {
    title: {
      key: '1',
      value: '周人气'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: '2',
      value: '月人气'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: '3',
      value: '总人气'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: '4',
      value: '推荐榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: '6',
      value: '字数榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: '0',
      value: '总书库'
    },
    categories: catagoryAll
  }
]

var bookSource = JSON.stringify({
  name: "黑岩网",
  url: "heiyan.com",
  version: 100,
  authorization: "https://w1.heiyan.com/accounts/login?backUrl=https://w1.heiyan.com/newHome",
  cookies: ["heiyan.com"],
  ranks: ranks
})