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

var bookSource = JSON.stringify({
  name: "若初文学网",
  url: "ruochu.com",
  version: 102
})
