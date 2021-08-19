const baseUrl = "https://api.m.hotread.com"

//搜索
const search = (key) => {
  let array = []
  totalPages = 1
  for (i=1;i<=totalPages;i++){
    let response = GET(`${baseUrl}/m1/search/searchByWord?keyword=${encodeURI(key)}&pageNo=${i}&pageSize=10`)
    let $ = JSON.parse(response).data
    totalPages = $.totalPages
    $.list.forEach((child) => {
      array.push({
        name: child.name,
        author: child.authorName,
        cover: child.cover,
        detail: `${baseUrl}/m1/story/get?storyId=${child.id}`
       })
    })
  }
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).data
  let book = {
    summary: $.introduce,
    status: $.state == 1 ? '连载' : '完结',
    category: $.tagList.join(" "),
    words: $.wordNumber,
    update: timestampToTime($.latestChapterTime),
    lastChapter: $.latestChapter,
    catalog: `${baseUrl}/m1/storyChapter/getChapters?storyId=${$.id}`
  }
  return JSON.stringify(book)
}

//转换更新时间 时间戳
function timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
        var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
        return Y+M+D+h+m+s;
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).data
  let array = []
  $.volumeList.forEach((volume,index) => {
    array.push({name:volume.name})
  $.chapterList.filter(chapter => chapter.volumeId === volume.id).forEach(chapter => {
      array.push({
        name: chapter.name,
        url: `https://www.hotread.com/story/${chapter.storyId}/${chapter.id}`,
        vip: chapter.isPay == 1
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let res = GET(url)
    let $ = HTML.parse(res)
    //未购买返回403和自动订阅地址
    if ($('.paidRecharge_content > h3').text() == "本章为付费章节") throw JSON.stringify({
        code: 403,
        message: `${url}?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36`
    })
  return $('.main_content').remove("span")
}

/**
 * 个人
 * @returns {[{url, nickname, recharge, balance[{name, coin}], sign}]}
 */
const profile = () => {
    let response = GET(`https://www.hotread.com/api/online`)
    let $ = JSON.parse(response).onlineUser
    return JSON.stringify({
        basic: [
            {
                name: '账号',
                value: $.nickName,
                url: 'https://www.hotread.com/userCenter?section=user&us=personal&ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
            },
            {
                name: '火星币',
                value: $.goldAmount,
                url: 'https://www.hotread.com/pay?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
            },
            {
                name: '火星券',
                value: $.giveAmount,
                url: 'https://www.hotread.com/pay?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
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
  let response = GET(`https://www.hotread.com/api/user/shelf`)
  let $ = JSON.parse(response)
  let books = []
  $.shelf.forEach((book) => {
    books.push({
     name: book.storyVo.name,
     author: book.storyVo.authorName,
     cover: book.storyVo.cover,
     detail: `${baseUrl}/m1/story/get?storyId=${book.storyVo.id}`
    })
  })
  return JSON.stringify({books})
}

//排行榜
const rank = (title, category, page) => {
  let response = POST(`https://api.m.hotread.com/m1/recommendtag/search`,{data:`pageNo=${page + 1}&pageSize=10&channel=1&tag=全部&sort=fireValue&source=1&type=${title}&option=全部`})
  let $ = JSON.parse(response).data
  let books = []
  $.list.forEach((child) => {
    books.push({
      name: child.name,
      author: child.author,
      cover: child.cover,
      detail: `${baseUrl}/m1/story/get?storyId=${child.id}`,
    })
  })
  return JSON.stringify({
    end:  $.list.length === 0,
    books: books
  })
}


const ranks = [
    {
        title: {
            key: '现代都市',
            value: '现代都市'
        }
    },
    {
        title: {
            key: '悬疑灵异',
            value: '悬疑灵异'
        }
    },
    {
        title: {
            key: '玄幻仙侠',
            value: '玄幻仙侠'
        }
    },
    {
        title: {
            key: '历史军事',
            value: '历史军事'
        }
    }
]

var bookSource = JSON.stringify({
  name: "火星小说",
  url: "hotread.com",
  version: 100,
  authorization: 'https://www.hotread.com/login?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
  cookies: ["hotread.com"],
  ranks: ranks
})
