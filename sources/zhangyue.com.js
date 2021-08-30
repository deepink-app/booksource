//搜索
const search = (key) => {
    let response = GET(`http://m.zhangyue.com/search?keyWord=${encodeURI(key)}`)
    let $ = HTML.parse(response)
    let array = []
    let list = $('.section_b>a')
    if (Array.isArray(list)) {
        list.forEach((child) => {
            let $ = HTML.parse(child)
            console.log(child)
            getdetail($, array)
        })
    } else {
        getdetail($, array)
    }
    return JSON.stringify(array)
}

function getdetail($, array) {
    if (!$('a .name').text().match("\\[漫画\\]")) {
        array.push({
            name: $('.name').text().replace("[精品]", ""),
            author: $('.author').text(),
            cover: $('img').attr('data-src'),
            detail: $("a").attr("href")
        })
    }
    return array

}
//详情
const detail = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)
    let status = (/完结/).test($('.lastline').text()) ? "完结" : ((/连载/).test($(".lastline").text()) ? "连载" : "完结")
    let book = {
        summary: $('.brief_intro>p').text().replace("内容简介：", ""),
        status: status,
        category: $('.tagbtn').text()+" "+$("dd.ellipsis:not(.author)").text().match(/(.+?) |/)[1],
        words: (/字/).test($('.lastline').text()) ? $('.lastline').text().match(/(.+)字/)[1] : "0",
        update: status == "连载" ? ($('.time') ? $('.time').text().match(/(.+?)更新/)[1] : "") : "",
        lastChapter: status == "连载" ? ($('.time') ? $('.catalog_new >a:nth-child(1)').text().match(/(?<=更新).+/)[0] : "") : "已完结",
        catalog: url.match(/\d+/)[0]
    }
    return JSON.stringify(book)
}

var bookSource = JSON.stringify({
    name: "掌阅小说",
    url: "zhangyue.com",
    version: 104
})
