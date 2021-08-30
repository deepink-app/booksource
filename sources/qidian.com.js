const baseUrl = "https://m.qidian.com"

//搜索
const search = (key) => {
  let response = GET(`https://druid.if.qidian.com/Atom.axd/Api/Search/GetBookStoreWithCategory?type=-1&needDirect=1&key=${encodeURI(key)}`)
  let array = []
  let $ = JSON.parse(response)
  $.Data.forEach((child) => {
    array.push({
      name: child.BookName,
      author: child.Author,
      cover: `http://qidian.qpic.cn/qdbimg/349573/${child.BookId}/180`,
      detail: `https://qqapp.qidian.com/ajax/book/info?bookId=${child.BookId}`,
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
  version: 111
})
