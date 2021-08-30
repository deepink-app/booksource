const baseUrl = "https://www.linovel.net"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/search/index?kw=${encodeURI(key)}`)
  let array = []
  let $ = HTML.parse(response)
  $('.rank-book-list > a').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('.book-name').text(),
      author: $('.book-extra').text().match('(.+)(?= 丨)')[0].trim(),
      cover: $('.book-cover > img').attr('src'),
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
    summary: $('.about-text').text(),
    status: $('.book-data > span:nth-child(7)').text(),
    category: $('.book-cats').text().replace('/', ' '),
    words: $('.book-data > span:nth-child(1)').text(),
    update: $('.book-last-update').text().match('(?<=更新于)(.+)')[0],
    lastChapter: $('.chapter-item.new > a').text(),
    catalog: `${url}#catalog`
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "轻之文库",
  url: "linovel.net",
  version: 105
})
