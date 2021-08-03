const baseUrl = "https://www.ciyuanji.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/searchList?keyword=${encodeURI(key)}`)
  let array = []
  let $ = HTML.parse(response)
  $('div.left > section.block').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('h4').text(),
      author: $('p.author').text(),
      cover: $('img').attr('data-src'),
      detail: `${baseUrl}${$('.bookCard > a').attr('href')}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('.content').text(),
    status: $('.icons-item:nth-child(3) > span').text(),
    category: $('div.des > div.tags').text(),
    words: $('.tags-item:nth-child(2)').attr('title').replace("字",""),
    update: $('.footer > div.tag').text().replace('·',''),
    lastChapter: $('.footer > a').text(),
    catalog: `${baseUrl}${$('.tabs > a:nth-child(2)').attr('href')}`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
  $('.catalog > div').forEach((booklet) => {
    let $ = HTML.parse(booklet)
    array.push({ name: $('h2.title').text() })
    $('.tag').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: `${baseUrl}${$('a').attr('href')}`,
        vip: $('.lock').attr('src') == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAA1VBMVEUAAAD////////////o6Ojr6+vb29vu7u7b29vc3Nzf39/i4uLd3d3e3t7Z2dnb29va2trb29vc3Nzb29vb29vZ2dna2trb29vY2NjW1tbY2NjZ2dna2tra2tra2trZ2dna2trZ2dna2trY2NjZ2dnZ2dnZ2dnZ2dnY2NjZ2dnZ2dnY2NjZ2dnY2NjZ2dnZ2dnY2NjY2NjZ2dnZ2dnZ2dnZ2dnZ2dnY2NjZ2dnZ2dnY2NjZ2dnY2NjZ2dnY2NjY2NjY2NjZ2dnY2NjZ2dnY2NjZ2dnY2NgUkf8EAAAARnRSTlMAAQIDCw0ODxUWGBoeHygrMDE6RkdKS01PUFReYGh0eXyAgoOSlZqcnaKnsba4uru/xtHU1dfY2tze4OTn6uzt7u/1+Pr8dOO+4AAAAKBJREFUKM/tzDUSQkEQRdHG3d3d3d3h7n9JBMBnKKTISLjRvDpdI3JLHy0P1vt5K+2Qp6ITrh1KpkfSFVGauh+wCNBIeJ2h3A5YuBQLA8vg5W2tAx0FB3D034ahCwQ08wH5+6n9ADVtJQGP8lEb+trIAGYFK7DSRhYwKliGzTeY6q2A8ejeDk7DqkVEdLwp8gnjf/wNxkRECrPtizZNm5wBz7KIrw74g08AAAAASUVORK5CYII="
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = HTML.parse(GET(url))
    //未购买返回403和自动订阅地址
    if ($('.title').text() == "VIP章节 需订阅后才能阅读") throw JSON.stringify({
        code: 403,
        message: `${url}?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36`
    })
  return $('.content-chapter')
}

/**
 * 个人
 * @returns {[{url, nickname, recharge, balance[{name, coin}], sign}]}
 */
const profile = () => {
    let response = GET(`https://api.hwnovel.com/api/pc/cms/user/getUserInfo`,{headers:[`token:${COOKIE('PC-Token')}`]})
    let response2 = GET(`https://api.hwnovel.com/api/pc/cms/account/getAccountByUser`,{headers:[`token:${COOKIE('PC-Token')}`]})
    let $ = JSON.parse(response).data
    let  wenmoux = JSON.parse(response2).data.accountInfo
    if ($.msg === "用户未登录") throw JSON.stringify({
        code: 401
    })
    return JSON.stringify({
        basic: [
            {
                name: '账号',
                value: $.cmUser.nickName,
                url: 'https://www.ciyuanji.com/personalCenter/info?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            },
            {
                name: '书币',
                value: wenmoux.currencyBalance,
                url: 'https://www.ciyuanji.com/recharge?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            },
            {
                name: '代币',
                value: wenmoux.couponBalance,
                url: 'https://www.ciyuanji.com/recharge?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
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

/**
 * 我的书架
 * @param {页码} page 
 */
const bookshelf = (page) => {
  let response = GET(`https://api.hwnovel.com/api/pc/cms/bookrack/getUserBookRackList`,{headers:[`token:${COOKIE('PC-Token')}`]})
  let $ = JSON.parse(response).data
  let books = $.list.map(book => ({
    name: book.bookName,
    author: book.authorName,
    cover: book.imgUrl,
    detail: `${baseUrl}/bookDetails/info?bookId=${book.bookId}`
  }))
  return JSON.stringify({books})
}

//排行榜
const rank = (title, category, page) => {
  let response = GET(`https://www.ciyuanji.com/Classification?firstClassify=${title}&rankType=1&acvtiveWord=1&pageNo=${page + 1}&pageSize=10`)
  let $ = HTML.parse(response)
  let books = []
  $('ul > a').forEach((child) => {
    let $ = HTML.parse(child)
    books.push({
      name: $('h4').text(),
      author: $('.author').text(),
      cover: $('img').attr('data-src'),
      detail: `${baseUrl}${$('a').attr('href')}`
    })
  })
  return JSON.stringify({
    end:  $('ul > a').length === 0,
    books: books
  })
}

const ranks = [
    {
        title: {
            key: '5',
            value: '玄幻奇幻'
        }
    },
    {
        title: {
            key: '6',
            value: '青春日常'
        }
    },
    {
        title: {
            key: '4',
            value: '科幻未来'
        }
    },
    {
        title: {
            key: '12',
            value: '仙侠武侠'
        }
    },
    {
        title: {
            key: '1',
            value: '游戏竞技'
        }
    },
    {
        title: {
            key: '2',
            value: '诡秘悬疑'
        }
    },
    {
        title: {
            key: '3',
            value: '历史军事'
        }
    },
    {
        title: {
            key: '10',
            value: '动漫同人'
        }
    },
    {
        title: {
            key: '13',
            value: '搞笑吐槽'
        }
    },
    {
        title: {
            key: '14',
            value: '变身入替'
        }
    }
]

var bookSource = JSON.stringify({
  name: "次元姬小说",
  url: "www.ciyuanji.com",
  version: 101,
  authorization: `https://www.ciyuanji.com/login?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36`,
  cookies: [".ciyuanji.com"],
  ranks: ranks
})
