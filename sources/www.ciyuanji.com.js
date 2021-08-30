const baseUrl = "https://www.ciyuanji.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/searchList?keyword=${encodeURI(key)}`)
  let array = []
  let $ = HTML.parse(response)
  $('div.left > section.block').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('h4').text(),
      author: $('p.author').text(),
      cover: $('img').attr('data-src'),
      detail: `${baseUrl}${$('.bookCard > a').attr('href')}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('.content').text(),
    status: $('.icons-item:nth-child(3) > span').text(),
    category: $('div.des > div.tags').text(),
    words: $('.tags-item:nth-child(2)').attr('title').replace("字",""),
    update: $('.footer > div.tag').text().replace('·',''),
    lastChapter: $('.footer > a').text(),
    catalog: `${baseUrl}${$('.tabs > a:nth-child(2)').attr('href')}`
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "次元姬小说",
  url: "www.ciyuanji.com",
  version: 103
})
