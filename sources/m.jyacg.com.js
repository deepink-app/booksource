const baseurl = "https://jyapi.jyacg.com"
//搜索
const search = (key) => {
    let response = GET(`${baseurl}/web/search?name=${encodeURI(key)}&type=1&page=1&limit=10`)
    let array = []
    let $ = JSON.parse(response)
    $.data.forEach((item) => {
            array.push({
                name: item.name,
                author: item.author,
                cover: item.cover_image,
                detail: `/web/books/detail?id=${item.id}`,
            })        
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(baseurl+url)
    let $ = JSON.parse(response).data
    let book = {
        summary: $.intro,
        status: $.serial_status,
        category: $.label.map((item)=>{ return item.name.replace(/\//g," ")}).join(" "),
        words: $.total_words*10000,
        update: formatDate($.last_update_time*1000),
        lastChapter: $.new_section,
        catalog: `/web/books/directory?books_id=${$.id}`
    }
    return JSON.stringify(book)
}
//转换更新时间 时间戳
function formatDate(timeStamp) {
    let diff = (Date.now()- timeStamp ) /1000
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
    name: "鲸云轻小说",
    url: "m.jyacg.com",
    version: 100
})
