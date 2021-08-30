const baseUrl = "https://www.yizhiqc.com"
const headers = ["visittype:mob"]
//搜索
const search = (key) => {
    let data = `keyWord=${encodeURI(key)}&startPage=1&isHotWorld=1`
    let response = POST(`${baseUrl}/api/stacks-search`, {
        data,
        headers
    })
    let array = []
    let $ = JSON.parse(response)
    console.log($.data.list)
    $.data.list.forEach((child) => {
        array.push({
            name: child.bookName,
            author: child.writerName,
            cover: child.bookImage,
            detail: child.bookId
        })
    })
    return JSON.stringify(array)
}
//转换更新时间 时间戳
function formatDate(timeStamp) {
    let diff = (Date.now() - timeStamp) / 1000
    if (diff < 60) {
        return '刚刚'
    } else if (diff < 3600) {
        return `${parseInt(diff / 60)}分钟前`
    } else if (diff < 86400) {
        return `${parseInt(diff / 3600)}小时前`
    } else {
        let date = new Date(timeStamp)
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
}
//详情
const detail = (url) => {
    let data = `bookid=${url}`
    let response = POST(`${baseUrl}/api/book-bookInfo`, {
        data,
        headers
    })
    let bookInfo = JSON.parse(response).data.bookListInfo
    let book = {
            summary: bookInfo.bookIntroduction,
            status: bookInfo.bookCheckStatus == 1 ? '连载' : '完结',
            category: bookInfo.classificationName,
            words: bookInfo.bookWorldCount,
            update: formatDate(bookInfo.lastUpdateTime),
            lastChapter: bookInfo.lastUpdateChapterName,
            catalog: `${baseUrl}/api/books-volumeChapterList/${bookInfo.bookId}`
        }
    return JSON.stringify(book)
}

var bookSource = JSON.stringify({
    name: "一纸倾城",
    url: "yizhiqc.com",
    version: 102
})
