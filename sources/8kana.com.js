const baseUrl = 'https://inf.8kana.com'

//return [{name, author, cover, detail}]
const search = (key) => {
    let response = POST(`${baseUrl}/book/search`, {
        data: `Keyword=${encodeURI(key)}`
    })
    let $ = JSON.parse(response)
    let books = $.data.Books.map(book => ({
        name: book.BookName,
        author: book.AuthorName,
        cover: book.BookCover,
        detail: JSON.stringify({
            url: `${baseUrl}/Works/book`,
            bookId: book.BookId
        })
    }))
    return JSON.stringify(books)
}

//return {summary, status, category, words, update, lastChapter, catalog}
const detail = (url) => {
    let args = JSON.parse(url)
    let response = POST(args.url, {
        data: `BookId=${args.bookId}&Type=1`
    })
    let $ = JSON.parse(response).data
    let book = {
        summary: $.Info.Note,
        status: $.Info.SeriesStatus == 1 ? '连载' : '完结',
        category: $.Info.ClassName,
        words: $.Info.TotalWords,
        update: $.Info.LastModifyTime,
        lastChapter: $.Read.NewChapterName,
        catalog: JSON.stringify({
            url: `${baseUrl}/book/newcatalog`,
            bookId: args.bookId
        })
    }
    return JSON.stringify(book)
}

var bookSource = JSON.stringify({
    name: '不可能的世界',
    url: '8kana.com',
    version: 105
})
