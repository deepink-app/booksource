const baseUrl = "https://fanqienovel.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/api/author/search/search_book/v1?filter=127,127,127&page_count=10&query_word=${encodeURI(key)}`)
  let array = []
  let $ = JSON.parse(response)
  $.data.search_book_data_list.forEach((child) => {
    array.push({
      name: child.book_name,
      author: child.author,
      cover: `https://p3-tt.byteimg.com/img/${child.thumb_uri}~240x312.jpg`,
      detail: `${baseUrl}/page/${child.book_id}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('.page-abstract-content').text(),
    status: $('.info-label-yellow').text(),
    category: $('.info-label-grey:nth-child(3)').text(),
    words: $('.info-count-word').text().replace("字",""),
    update: $('.info-last-time').text(),
    lastChapter: $('.info-last-title').text().replace("最近更新：",""),
    catalog: `${baseUrl}/api/reader/directory/detail?bookId=${url.replace("https://fanqienovel.com/page/","")}`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response)
  let array = []
  $.data.chapterListWithVolume[0].forEach(chapter => {
      array.push({
        name: chapter.title,
        url: `https://novel.snssdk.com/api/novel/book/reader/full/v1/?group_id=${chapter.itemId}&item_id=${chapter.itemId}`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url))
  return $.data.content.replace(/<div.+<\/div>/,"")
}

//排行榜
const rank = (title, category, page) => {
  let response = GET(`https://fanqienovel.com/api/author/library/book_list/v0/?page_count=18&page_index=${page}&gender=${title}&category_id=-1&creation_status=-1&word_count=-1&sort=0`)
  let $ = JSON.parse(response)
  let books = []
  $.data.book_list.forEach((child) => {
    books.push({
      name: child.book_name,
      author: child.author,
      cover: `https://p3-tt.byteimg.com/img/${child.thumb_uri}~240x312.jpg`,
      detail: `${baseUrl}/page/${child.book_id}`,
    })
  })
  return JSON.stringify({
    end:  $.data === null,
    books: books
  })
}

const ranks = [
    {
        title: {
            key: '1',
            value: '男生'
        }
    },
    {
        title: {
            key: '0',
            value: '女生'
        }
    }
]

var bookSource = JSON.stringify({
  name: "番茄小说",
  url: "fanqienovel.com",
  version: 103,
  ranks: ranks
})
