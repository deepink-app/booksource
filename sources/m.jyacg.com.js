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

//目录
const catalog = (url) => {
    let response = GET(baseurl+url)
    let $ = JSON.parse(response)
    let array = []
    let bid = $.data.book_id
    $.data.forEach((booklet) => {
        array.push({
            name: booklet.chapter_num
        })
        booklet.directory.forEach((chapter) => {
            array.push({
                name: chapter.title,
                url: `/web/books/read?books_id=${booklet.books_id}&page=${chapter.page}`,
                vip: chapter.is_pay == 1
            })
        })
    })
    return JSON.stringify(array)
}

//章节
const chapter = (url) => {
headers = []
    if(localStorage.getItem("authorization")){
   headers = [`authorization:${localStorage.getItem("authorization")}`] 
    }
    let response = GET(baseurl+url,{headers})
    let $ = JSON.parse(response)
    //VIP章节
     if ($.data.is_pay == 1 &&$.data.is_order==0) throw JSON.stringify({
            code: 403,
            message: `https://m.jyacg.com/read?id=${url.query("books_id")}&page=${url.query("page")}`
        })        
    return $.data.content
}

//个人中心
const profile = () => {
    let response = GET(`${baseurl}/admin/user/moneyinfo`,{headers : [`authorization:${localStorage.getItem("authorization")}`]})
    let $ = JSON.parse(response).data
    return JSON.stringify({
        basic: [{
                name: "账号",
                value: $.nickname,
                url: 'https://m.jyacg.com/mineself'
            },
            {
                name: '鲸币',
                value: $.book_coin,
                url: 'https://m.jyacg.com/topup'
            },
            {
                name: '月票',
                value: $.month_ticket_num
            }
        ],
        extra: [
            {
                name: '书架',
                type: 'books',
                method: 'bookshelf'
            }
        ]
    })
}
const bookshelf = (page) => {
    let response = GET(`${baseurl}/admin/user/mybooks?page=${page+1}`,  {headers : [`authorization:${localStorage.getItem("authorization")}`]})
    let books = JSON.parse(response).data.data.map(book => ({
        name: book.name,
        author: book.author,
        cover: book.cover_image,
        detail: `/web/books/detail?id=${book.id}`
    }))
    return JSON.stringify({
        books,
        end: page+1 === JSON.parse(response).data.last_page
    })
}


const ranks = [{title:{key:1,value:'综合热门榜'}},{title:{key:2,value:'热销榜'}},{title:{key:3,value:'新书潜力榜'}},{title:{key:'zjgx',value:'最近更新榜'}},{title:{key:'rqwb',value:'人气完本榜'}},{title:{key:'zjgx',value:'最近更新榜'}},{title:{key:'viprm',value:'VIP热门榜'}},{title:{key:'mfrm',value:'免费热门榜'}},{title:{key:'zjgx',value:'最近更新榜'}}]
const rank = (title, category, page) => {
    let response = GET(`${baseurl}/web/rank_list?id=${title}&page=${page+1}&limit=10`)
    let $ = JSON.parse(response)
    let books = []
    $.data.forEach((item) => {
        books.push({
            name: item.name,
            author: item.author,
            cover: item.cover_image,
            detail: `/web/books/detail?id=${item.id}`
        })
    })
    return JSON.stringify({
        end: $.data.length === 0,
        books
    })
}
const login = (args) => {
    if(!args) return "账号或者密码不能为空!"
    let data =`phone=${args[0]}&password=${args[1]}`
    let response = POST(`${baseurl}/web/login`,{data})
    let $ = JSON.parse(response)
    if($.code != 0) return "账号或密码错误"
    localStorage.setItem("authorization", $.data)
}

var bookSource = JSON.stringify({
    name: "鲸云轻小说",
    url: "m.jyacg.com",
    version: 100,
    authorization: JSON.stringify(['account','password']),
    cookies: [".jyacg.com"],
    ranks: ranks
})
