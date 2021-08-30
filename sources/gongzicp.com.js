const baseUrl = "https://m.gongzicp.com"

//搜索
const search = (key) => {
    let response = GET(`${baseUrl}/novel/searchNovelOnlyByName?keyword=${encodeURI(key)}&searchType=1&finishType=0&novelType=0&sortType=1&page=1`, {
        headers: ["X-Requested-With: XMLHttpRequest"]
    })
    let array = []
    let $ = JSON.parse(response)
    $.data.list.forEach((list) => {
        array.push({
            name: list.novel_name.replace(/<span class=\"searchCode\">/g, "").replace(/<\/span>/g, ""),
            author: list.novel_author,
            cover: list.novel_cover,
            detail: `${baseUrl}/novel-${list.novel_id}.html?id=${list.novel_id}`,
        })
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url, {
        headers: ["User-Agent:Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36"]
    })
    let $ = HTML.parse(response)
    let book = {
        summary: $('.intraductionParagraph').text(),
        status: $('.novelTypeLabel').text(),
        category: $('.labelsBox').text().replace("--", " "),
        words: $('.numberBox>span:nth-child(3)').text().replace("字", ""),
        update: $('.seeListBox > a').text(),
        lastChapter: $('.chapterName').text(),
        catalog: `${baseUrl}/novel/chapterList/id/${url.query("id")}`
    }
    return JSON.stringify(book)
}

var bookSource = JSON.stringify({
    name: "长佩文学",
    url: "gongzicp.com",
    version: 102
})
