//搜索
const search = (key) => {
    let response = GET(`http://api.ali.17k.com/v2/book/search?sort_type=0&app_key=4037465544&_access_version=2&cps=0&channel=2&_versions=1070&merchant=17KH5&page=1&client_type=1&_filter_data=1&class=0&key=${encodeURI(key)}`)
    let array = []
    let $ = JSON.parse(response)
    $.data.forEach((item) => {
        if (item.book_name) {
            array.push({
                name: item.book_name,
                author: item.author_name,
                cover: item.cover,
                detail: `http://api.17k.com/book/${item.book_id}/split1/merge?iltc=1&cpsOpid=0&_filterData=1&device_id=&channel=0&_versions=1160&merchant=17Kyyb&platform=2&manufacturer=Xiaomi&clientType=1&appKey=4037465544&model=&cpsSource=0&brand=Redmi&youthModel=0`,
            })
        }
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url)
    let $ = JSON.parse(response).data[0].bookTop
    let book = {
        summary: $.introduction,
        status: $.bookStatus.name,
        category: $.bookCategory.name,
        words: $.countInfo.updateWordCount,
        update: formatDate($.lastUpdateChapter.updateTime),
        lastChapter: $.lastUpdateChapter.name,
        catalog: `http://api.17k.com/v2/book/${$.countInfo.bookId}/volumes?app_key=4037465544&price_extend=1&_versions=1070&client_type=2&_filter_data=1&channel=2&merchant=17Khwyysd&_access_version=2&cps=0&book_id=${$.countInfo.bookId}`
    }
    return JSON.stringify(book)
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

var bookSource = JSON.stringify({
    name: "17k小说",
    url: "17k.com",
    version: 102
})
