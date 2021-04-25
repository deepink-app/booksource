const baseUrl = 'https://m.8kana.com'

//return [{name, author, cover, detail}]
const search = (key) => {
    let response = POST(`http://inf.8kana.com/book/search`, {
        data: `UserId=&Keyword=${encodeURI(key)}&SearchType=3&Page=1&system=android`
    })
    let $ = JSON.parse(response)
    let books = $.data.Books.map(book => ({
        name: book.BookName,
        author: book.AuthorName,
        cover: book.BookCover,
        detail: JSON.stringify({
            url: 'http://inf.8kana.com/Works/book',
            bookId: book.BookId
        })
    }))
    return JSON.stringify(books)
}

//return {summary, status, category, words, update, lastChapter, catalog}
const detail = (url) => {
    let args = JSON.parse(url)
    let response = POST(args.url, {
        data: `UserId=&BookId=${args.bookId}&Type=1&system=android`
    })
    let $ = JSON.parse(response).data
    let book = {
        summary: $.Info.Note,
        status: $.Info.SeriesStatus == 1 ? '连载' : '完结',
        category: $.Info.ClassName,
        words: $.Info.TotalWords,
        update: $.Info.LastModifyTime,
        lastChapter: $.Read.NewChapterName,
        catalog: JSON.stringify({
            url: 'http://inf.8kana.com/book/newcatalog',
            bookId: args.bookId
        })
    }
    return JSON.stringify(book)
}

//return [{name, url, vip}]
const catalog = (url) => {
    let args = JSON.parse(url)
    let response = POST(args.url, {
        data: `BookId=${args.bookId}&UpdateTime=0&ChapterNo=0&UserId=&system=android`
    })
    let chapters = JSON.parse(response).data.ChapterList.map(chapter => ({
        name: chapter.Title,
        url: `${baseUrl}/chapter/content/${chapter.ChapterId}`,
        vip: chapter.IsVip !== "0"
    }))
    return JSON.stringify(chapters)
}

//return string
const chapter = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)
    //未购买返回403和自动订阅地址
    if ($('.readFeesBtn_VIP')) throw JSON.stringify({
        code: 403,
        message: url
    })
    return $('.readMain_Content')
}

//return {url, nickname, recharge, balance[{name, coin}], sign}
const profile = () => {
    let response = GET(`${baseUrl}/book/shelf`)
    let $ = HTML.parse(response)
    return JSON.stringify({
        url: `${baseUrl}/member`,
        nickname: $('.collectMember_Name').text(),
        recharge: `${baseUrl}/recharge`,
        balance: [
            {
                name: '余额',
                coin: $('.collectMember_numText').text()
            }
        ]
    })
}

//ranks
const rank = (title, category, page) => {
    let response = POST('http://inf.8kana.com/book/channel', {
        data: `Sex=1&Class0Id=${title}&VipType=&SeriesStatus=0&SearchType=1&Page=1&system=android`
    })
    let books = JSON.parse(response).data.books.map(book => ({
        name: book.BookName,
        author: book.AuthorName,
        cover: book.BookCover,
        detail: JSON.stringify({
            url: 'http://inf.8kana.com/Works/book',
            bookId: book.BookId
        })
    }))
    return JSON.stringify({
        books: books
    })
}

const ranks = [
    {
        title: {
            key: '3',
            value: '烧脑'
        }
    },
    {
        title: {
            key: '6',
            value: '神州'
        }
    },
    {
        title: {
            key: '1',
            value: '轻幻想'
        }
    },
    {
        title: {
            key: '2',
            value: '重幻想'
        }
    },
    {
        title: {
            key: '4',
            value: '轻小说'
        }
    }
]

var bookSource = JSON.stringify({
    name: '不可能的世界',
    url: '8kana.com',
    version: 101,
    authorization: 'https://m.8kana.com/www/passport/login',
    cookies: ["8kana.com"],
    ranks: ranks
})