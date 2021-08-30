//return [{name, author, cover, detail}]
let token = localStorage.getItem('token') ? localStorage.getItem('token') : " "
let uid = localStorage.getItem('uid') ? localStorage.getItem('uid') : "0"
const search = (key) => {
    console.log(token)
    let response = GET(`https://api.hanwujinian.net/api.php/api/search_app/searchResult?limit=20&offset=0&search=${encodeURI(key)}&type=0&uid=0`)
    let $ = JSON.parse(response)
    let books = $.data.book.map(book => ({
        name: book.bookname,
        author: book.author,
        cover: book.pic,
        detail: book.bookid
    }))
    return JSON.stringify(books)
}
//详情
const detail = (url) => {
    let response = GET(`https://www.hanwujinian.com/riku/minibook/articleinfo.php?network=wifi&bookid=${url}&uid=0`)
    let $ = JSON.parse(response)
    let tags=""
    if(Array.isArray($.label)){
    tags =  $.label.join(" ")    
    }else if(   Object.prototype.toString.call($.label) === '[object Object]' ){    
   let str=[],  i=0
    Object.keys($.label).forEach(key => { str[i++]=key
  })
  tags=  str.map(tag =>($.label[tag])).join(' ')
    }
    let book = {
        summary: $.intro,
        status: $.isend ? "完结" : "连载",
        category: tags,
        words: $.presize,
        update: $.pubtime,
        lastChapter: $.lastchapter,
        catalog: `https://wap.hanwujinian.com/api.php/api/book_app/chapterListWithUserStatus?lastupdate=0&bookId=${$.articleid}&uid=${uid}`
    }
    return JSON.stringify(book)
}

var bookSource = JSON.stringify({
    name: "寒武纪年",
    url: "hanwujinian.com",
    version: 103
})
