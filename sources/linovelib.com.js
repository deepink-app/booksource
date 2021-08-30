const baseUrl = "https://w.linovelib.com"

const header_mobile = [ "User-Agent: Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Mobile Safari/537.36"]

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`${baseUrl}/sa/?searchkey=${encodeURI(key)}&searchtype=all`, {headers: header_mobile})
  let array = []
  let $ = HTML.parse(response)

  if ($('#header > h1.header-back-title').text() == "搜索结果") {
    $('li.book-li').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('h4.book-title').text(),
        author: $('span.book-author').text().replace('作者','').trim(),
        cover: $('a > img').attr('data-original'),
        detail: `${baseUrl}${$('a.book-layout').attr('href')}`,
      })
    })
  } else {
    // 搜索挑战主页问题
    array.push({
      name: $('meta[property=og:title]').attr('content'),
      author: $('meta[property=og:novel:author]').attr('content'),
      cover: $('meta[property=og:image]').attr('content'),
      detail: $('head > link[rel=canonical]').attr('href'),
    })
  }

  return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let response = GET(url, {headers: header_mobile})
  let $ = HTML.parse(response)
  let book = {
    summary: $('meta[property=og:description]').attr('content'),
    status: $('meta[property=og:novel:status]').attr('content'),
    category: $('meta[property=og:novel:category]').attr('content'),
    words: $('#bookDetailWrapper > div > div.book-layout > div > p:nth-child(4)')[0].match('(?<=\>)(.+?)(?=字)')[0],
    update: $('meta[property=og:novel:update_time]').attr('content'),
    lastChapter: $('meta[property=og:novel:latest_chapter_name]').attr('content'),
    catalog: url.replace('.html', '/catalog')
  }
  return JSON.stringify(book)
}


var bookSource = JSON.stringify({
  name: "哔哩轻小说",
  url: "linovelib.com",
  version: 107
})
