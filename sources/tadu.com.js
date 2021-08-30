const baseUrl = "https://m.tadu.com"

const apiUrl = "http://211.151.212.66"

const headerPrefix = ["X-Client: version=6.6.68.1673", "COOKIE:sessionid=cc3bedf27c3148e28274e4887e1e3a3a"]

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`${apiUrl}/ci/search/result?searchcontent=${encodeURI(key)}&page=1&type=3&readLike=0&searchType=3`, {headers: headerPrefix})
  let array = []
  let $ = JSON.parse(response)
  $.data.bookList.forEach((child) => {
    array.push({
      name: child.name,
      author: child.author,
      cover: child.picUrl,
      detail: `${apiUrl}/ci/book/info?bookId=${child.bookId}`,
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
  let response = GET(url, {headers: headerPrefix})
  let $ = JSON.parse(response)
  let book = {
    summary: $.data.bookInfo.intro,
    status: $.data.bookInfo.isSerial ? "连载中" : "已完结",
    category: $.data.bookInfo.categoryName,
    words: $.data.bookInfo.numOfChars.replace('字', ''),
    update: $.data.bookInfo.newPartUpdateDate,
    lastChapter: $.data.bookInfo.newPartTitle,
    catalog: `${apiUrl}/ci/qingmeng/book/directory/list?book_id=${$.data.bookInfo.id}&sort=asc`
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "塔读文学",
  url: "tadu.com",
  version: 105
})
