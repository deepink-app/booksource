const baseUrl = "https://w1.heiyan.com"

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
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

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('meta[property=og:description]').attr('content'),
    status: $('meta[property=og:novel:status]').attr('content'),
    category: $('meta[property=og:novel:category]').attr('content'),
    words: $('div.info > div:nth-child(3)').match('(?<=)(.+?)(?=字)')[0],
    update: $('meta[property=og:novel:update_time]').attr('content'),
    lastChapter: $('meta[property=og:novel:latest_chapter_name]').attr('content'),
    catalog: $('div.more-index > a').attr('href').replace('w1.', 'www.')
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "黑岩网",
  url: "heiyan.com",
  version: 105
})
