const baseUrl = "https://dj.palmestore.com"

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`https://m.idejian.com/search/do?keyword=${encodeURI(key)}`,{headers:["user-agent:Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.101 Mobile Safari/537.36"]})
  let array = []
  let $ = HTML.parse(response)
    $('ul.v_list > li').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('.book_name').text(),
        author: $('span.book_author:nth-child(1)').text(),
        cover: $('img').attr('src'),
        detail: `${baseUrl}/zybk/api/detail/index?bid=${$('a.list_item').attr('href').replace("/book/","")}&p3=17180056`,
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

var bookSource = JSON.stringify({
  name: "得间小说",
  url: "idejian.com",
  version: 102
})
