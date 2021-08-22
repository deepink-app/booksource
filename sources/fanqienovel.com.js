const baseUrl = "https://fanqienovel.com"

//搜索
const search = (key) => {
  let response = GET(`https://api5-normal-lq.fqnovel.com/reading/bookapi/search/page/v/?offset=0&query=${encodeURI(key)}&iid=466614321180296&aid=1967`)
  let res = JSON.parse(response).data
  var $ = res.filter(function(item) {
 	return item.book_data[0].book_type == 0
});
  let array = []
  $.forEach((child) => {
    array.push({
      name: child.book_data[0].book_name,
      author: child.book_data[0].author,
      cover: child.book_data[0].thumb_url.replace(".heic",".png"),
      detail: `https://api5-normal-lq.fqnovel.com/reading/bookapi/detail/v/?book_id=${child.book_data[0].book_id}&iid=466614321180296&aid=1967&version_code=290`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).data
  let book = {
    summary: $.abstract,
    status: $.update_status == 1 ? '连载' : '完结',
    category: $.tags.replace(","," "),
    words: $.word_number,
    update: timestampToTime($.last_chapter_update_time),
    lastChapter: $.last_chapter_title,
    catalog: `${baseUrl}/api/reader/directory/detail?bookId=${$.book_id}`
  }
  return JSON.stringify(book)
}

//转换更新时间 时间戳
function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
        var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
        return Y+M+D+h+m+s;
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
      detail: `https://api5-normal-lq.fqnovel.com/reading/bookapi/detail/v/?book_id=${child.book_id}&iid=466614321180296&aid=1967&version_code=290`,
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
  version: 104,
  ranks: ranks
})
