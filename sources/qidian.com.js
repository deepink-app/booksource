const baseUrl = "https://m.qidian.com"

//搜索
const search = (key) => {
  let response = GET(`https://qqapp.qidian.com/ajax/search/list?kw=${encodeURI(key)}`)
  let array = []
  let $ = JSON.parse(response)
  $.data.bookInfo.records.forEach((child) => {
    array.push({
      name: child.bName,
      author: child.bAuth,
      cover: `https://bookcover.yuewen.com/qdbimg/349573/${child.bid}/180`,
      detail: `https://qqapp.qidian.com/ajax/book/info?bookId=${child.bid}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).data.bookInfo
  let book = {
    summary: $.desc.replaceAll('<br>','\n'),
    status: $.bookStatus,
    category: $.bookLabels.map((item)=>{ return item.tag}).join(" ")||$.chanName,
    words: $.wordsCnt,
    update: $.updTime,
    lastChapter: $.updChapterName,
    catalog: `https://qqapp.qidian.com/ajax/book/category?bookId=${$.bookId}`
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "起点中文网",
  url: "qidian.com",
  version: 112
})
