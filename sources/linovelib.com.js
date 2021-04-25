const baseUrl = "https://www.linovelib.com"

//搜索
const search = (key) => {
  let response = POST(`${baseUrl}/s/`, {
    data: `searchkey=${encodeURI(key)}&searchtype=all`
  })
  let array = []
  let $ = HTML.parse(response)
  $('.search-result-list').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('h2').text(),
      author: $('.bookinfo > a:nth-child(1)').text(),
      cover: $('a > img').attr('src'),
      detail: `${baseUrl}${$('h2 > a').attr('href')}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    name: $('.book-name').text(),
    author: $('.au-name').text(),
    cover: $('.book-img > img').text(),
    summary: $('.book-dec > p').text(),
    status: $('.state').text(),
    category: $('.book-label > span').text(),
    words: $('.nums > span:nth-child(1) > i').text(),
    update: $('.book-new-chapter > div:nth-child(2) > div').text(),
    lastChapter: $('.book-new-chapter > div:nth-child(2) > a').text(),
    catalog: url.replace('.html', '/catalog')
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
  $('.chapter-list > li').forEach((chapter) => {
    let $ = HTML.parse(chapter)
    array.push({
      name: $('a').text(),
      url: `${baseUrl}${$('a').attr('href')}`,
      vip: false
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  return $('#TextContent')
}

//个人中心
const profile = () => {
  let response = GET(`https://m.linovelib.com/user.php`)
  let $ = HTML.parse(response)
  return JSON.stringify({
    url: `https://m.linovelib.com/user.php`,
    nickname: $('span.user-name').text(),
    balance: [
      {
        name: '轻小说币',
        coin: $('span.ding').text()
      }
    ],
  })
}

//排行榜
const rank = (title, category, page) => {
  let response = GET(`https://www.linovelib.com/modules/article/toplist.php?order=${title}&sortid=${category}&page=${page + 1}`)
  let $ = HTML.parse(response)
  let array = []
  $('div.rank_d_list').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('.rank_d_b_name').attr('title'),
      author: $('.rank_d_b_cate').attr('title'),
      cover: $('.rank_d_book_img > a > img').attr('data-original'),
      detail: `${baseUrl}${$('.rank_d_b_name > a').attr('href')}`,
    })
  })
  return JSON.stringify(array)
}

const catagoryAll = [
  { key: "0", value: "全部" },
  { key: "1", value: "点击文库" },
  { key: '2', value: '富士见文库' },
  { key: '3', value: '角川文库' },
  { key: '4', value: 'MF文库J' },
  { key: '5', value: 'Fami通文库' },
  { key: '6', value: 'GA文库' },
  { key: '7', value: 'HJ文库' },
  { key: '8', value: '一迅社' },
  { key: '9', value: '集英社' },
  { key: '10', value: '小学馆' },
  { key: '11', value: '讲谈社' },
  { key: '12', value: '少女文库' },
  { key: '13', value: '其他文库' },
  { key: '14', value: '华文轻小说' },
  { key: '15', value: '轻改漫画' },
]

const ranks = [
  {
    title: {
      key: 'allvisit',
      value: '总点击榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'monthvisit',
      value: '月点击榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'allvote',
      value: '总推荐榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'monthvote',
      value: '月推荐榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'allflower',
      value: '总鲜花榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'monthflower',
      value: '月鲜花榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'lastupdate',
      value: '最近更新'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'postdate',
      value: '最新入库'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'signtime',
      value: '最新上架'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'goodnum',
      value: '收藏榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'words',
      value: '字数榜'
    },
    categories: catagoryAll
  },
  {
    title: {
      key: 'newhot',
      value: '新书榜'
    },
    categories: catagoryAll
  }
]

var bookSource = JSON.stringify({
  name: "哔哩轻小说",
  url: "linovelib.com",
  version: 100,
  authorization: "https://m.linovelib.com/login.php",
  cookies: ["linovelib.com"],
  ranks: ranks
})