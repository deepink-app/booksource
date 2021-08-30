/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let response = GET(`http://search.zongheng.com/s?keyword=${encodeURI(key)}`)
    let $ = HTML.parse(response)
    let books = []
    $('.search-result-list').forEach(book => {
        $ = HTML.parse(book)
        books.push({
            name: $('h2 > a').text(),
            author: $('.bookinfo > a:first-child').text(),
            cover: $('img').attr('src'),
            detail: $('h2 > a').attr('href')
        })
    })
    return JSON.stringify(books)
}


/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
    let $ = HTML.parse(GET(url))
    let book = {
        summary: $('.book-dec > p').text(),
        status: $('a.state').text() === '连载中' ? '连载' : '完结',
        category: $('.book-label > span').text(),
        words: $('.nums > span:eq(0) > i').text(),
        update: $('.time').text().match(/(?<=· ).+(?= · )/)[0].trim(),
        lastChapter: $('.book-new-chapter > .tit > a').text(),
        catalog: $('.all-catalog').attr('href')
    }
    return JSON.stringify(book)
}

var bookSource = JSON.stringify({
    name: "纵横中文网",
    url: "zongheng.com",
    version: 103
})
