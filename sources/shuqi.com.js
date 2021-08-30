//搜索
const search = (key) => {
    let response = GET(`https://www.shuqi.com/search?keyword=${encodeURI(key)}&page=1`)

    let $ = HTML.parse(response)
    let array = []
    array.push({
        name: $('.bname').text(),
        author: $('.bauthor').text().match(/(.+)(?=著)/)[0],
        cover: $('.view>a>img').attr('src'),
        detail: "https://www.shuqi.com" + $('.view>a').attr('href')
    })


    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)
    let book = {
        summary: $('.bookDesc').text(),
        status: $('.lastchapter.clear>li:nth-child(3)').text(),
        category: $('.tags').text(),
        words: $('.lastchapter.clear>li:nth-child(2)').text().replace(/字/, ""),
        update: $('.lastchapter.clear>li:nth-child(4)').text().match(/(.+)(?=更新)/)[0],
        lastChapter: $('.lastchapter:not(.clear)>a').text(),
        catalog: url.replace("cover", "reader")
    }
    return JSON.stringify(book)
}

var bookSource = JSON.stringify({
    name: "书旗小说",
    url: "shuqi.com",
    version: 102
})
