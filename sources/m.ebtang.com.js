const baseUrl = 'http://m.ebtang.com/m'
/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let response = GET(`${baseUrl}/book/search?searchName=${encodeURI(key)}&visit=1`)
    let $ = HTML.parse(response)
    let books = $('#bookList > li').map(book => ({
        name: book.attr('d-name').replace(/<[^>]+>/g, ""),
        author: book.attr('d-nick'),
        cover: book.attr('d-cover'),
        detail: `${baseUrl}/book/${book.attr('d-id')}?visit=1`
    }))
    return JSON.stringify(books)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
    let $ = HTML.parse(GET(url))('#bookDetail')
    let book = {
        summary: $.attr('d-info'),
        status: $.attr('d-finish') === '0' ? '连载' : '完结',
        category: $.attr('d-sort'),
        words: $.attr('d-words'),
        update: $.attr('d-lasttime'),
        lastChapter: $.attr('d-lasttitle'),
        catalog: `${baseUrl}/book/${$.attr('d-id')}/directory`
    }
    return JSON.stringify(book)
}

var bookSource = JSON.stringify({
    name: "雁北堂",
    url: "m.ebtang.com",
    version: 101
})
