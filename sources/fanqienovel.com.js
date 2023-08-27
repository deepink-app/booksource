const baseUrl = "https://fanqienovel.com"
//搜索
const search = (key) => {
      let response = GET("https://novel.snssdk.com/api/novel/channel/homepage/search/search/v1/?device_platform=android&parent_enterfrom=novel_channel_search.tab.&offset=0&aid=1967&q={key}")
    let $ = JSON.parse(response)
    let books = $.data.ret_data.map(book => ({
        name: book.title,
        author: book.author,
        cover: book.thumb_url,
        summary:book.abstract,
        detail: book.book_id
    }))
    return JSON.stringify(books)
}
//详情
const detail = (url) => {
    let url1 =`https://novel.snssdk.com/api/novel/book/directory/list/v1?device_platform=android&parent_enterfrom=novel_channel_search.tab.&aid=1967&book_id=/${url}`
    let res = GET(url)
    let $ = JSON.parse(response).data
    let book = {
        summary: $.long_summary,
        status: $.finish_type,
        category: $.category,
        tags:$.geners,
        words: $.word_count,
        catalog: url,
    }
    return JSON.stringify(book)
}
 
var bookSource = JSON.stringify({
  name: "番茄小说",
  url: "fanqienovel.com",
  version: 106
})
