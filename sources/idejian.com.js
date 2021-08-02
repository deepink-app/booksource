const baseUrl = "https://dj.palmestore.com"

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`${baseUrl}/zybk/api/search/freeapp/book?word=${encodeURI(key)}&type=book,listen&pageSize=10&currentPage=1&pluginName=pluginweb_djsearch&p3=17180056`)
  let array = []
  let $ = JSON.parse(response)
    $.body.book.datas.forEach((child) => {
      array.push({
        name: child.data_info.bookName.replace("《","").replace("》",""),
        author: child.data_info.bookAuthor,
        cover: child.data_info.picUrl,
        detail: `${baseUrl}/zybk/api/detail/index?bid=${child.data_info.bookId}&p3=17180056`,
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
  let $ = JSON.parse(response).body
  let book = {
    summary: $.bookInfo.desc,
    status: $.bookInfo.completeState == "N" ? '连载':'完结',
    category: $.bookInfo.categorys.map((item)=>{ return item.name}).join(" "),
    words: $.bookInfo.wordCount.replace("字",""),
    update: $.bookInfo.lastChapterTime,
    lastChapter: $.chaperInfo.chapterName,
    catalog: $.bookInfo.bookId
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let array = []
  endpage = 999
  for (i=1;i<=endpage;i++){
    let response = GET(`${baseUrl}/zybk/api/detail/chapter?bid=${url}&page=${i}&p3=17180056`)
    let $ = JSON.parse(response)
    endpage = $.body.page.totalPage
    $.body.list.forEach((chapter) => {
      array.push({
      name: chapter.chapterName,
      url: `https://m.idejian.com/book/${url}/${chapter.id}.html`
      })
   })
}
  return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
  let response = GET(url,{headers:["user-agent:Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.101 Mobile Safari/537.36"]})
  let $ = HTML.parse(response)
  return $('.read_c')
}

/**
 * 排行榜
 */
const rank = (title, category, page) => {
  let response = GET(`https://www.idejian.com/books/${title}?categoryId=${category}&page=${page + 1}`)
  let $ = HTML.parse(response)
  let books = []
  $('.v_bklist_two > ul > li').forEach((child) => {
    let $ = HTML.parse(child)
    books.push({
      name: $('.bkitem_name').text(),
      author: $('.bkitem_author').text(),
      cover: $('.v_item > a > img').attr('src'),
      detail: `${baseUrl}/zybk/api/detail/index?bid=${$('.bkitem_name > a').attr('href').replace("/book/","").replace("/","")}&p3=17180056`,
    })
  })
  return JSON.stringify({
    end: $('.search_nonefont').text() == "没有结果",
    books: books
  })
}

const ranks = [
  {
    title: {
      key: 'nansheng',
      value: '男频'
    },
    categories: [
      { key: "1114", value: "奇幻" },
      { key: "1115", value: "玄幻" },
      { key: "1116", value: "武侠" },
      { key: "1117", value: "仙侠" },
      { key: "1118", value: "都市" },
      { key: "1119", value: "校园" },
      { key: "1120", value: "历史" },
      { key: "1121", value: "军事" },
      { key: "1122", value: "游戏" },
      { key: "1123", value: "竞技" },
      { key: "1124", value: "科幻" },
      { key: "1125", value: "灵异" }
    ]
  },
  {
    title: {
      key: 'nvsheng',
      value: '女频'
    },
    categories: [
      { key: "1126", value: "现代言情" },
      { key: "1127", value: "古代言情" },
      { key: "1128", value: "幻想言情" },
      { key: "1129", value: "青春校园" },
      { key: "1130", value: "同人作品" },
      { key: "1132", value: "惊悚恐怖" },
      { key: "1133", value: "次元专区" }
    ]
  },
  {
    title: {
      key: 'chuban',
      value: '出版'
    },
    categories: [
      { key: "1136", value: "生活" },
      { key: "1137", value: "教育" },
      { key: "1134", value: "人文社科" },
      { key: "1135", value: "经管励志" },
      { key: "1138", value: "文学艺术" }
    ]
  }
]

var bookSource = JSON.stringify({
  name: "得间小说",
  url: "idejian.com",
  version: 101,
  ranks: ranks
})
