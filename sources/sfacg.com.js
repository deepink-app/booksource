const baseUrl = "https://api.sfacg.com"

//搜索
const search = (key) => {
  let response = GET(`https://m.sfacg.com/API/HTML5.ashx?op=search&keyword=${encodeURI(key)}`)
  let array = []
  let $ = JSON.parse(response)
  $.Novels.forEach((child) => {
    array.push({
      name: child.NovelName,
      author: child.AuthorName,
      cover: `https://rs.sfacg.com/web/novel/images/NovelCover/Big/${child.NovelCover}`,
      detail: `${baseUrl}/novels/${child.NovelID}?expand=chapterCount,bigBgBanner,bigNovelCover,typeName,intro,fav,ticket,pointCount,tags,sysTags,signlevel,discount,discountExpireDate,totalNeedFireMoney,originTotalNeedFireMoney,latestchapter,essaytag,auditCover,preOrderInfo`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url,{headers:
  ["authorization: Basic YW5kcm9pZHVzZXI6MWEjJDUxLXl0Njk7KkFjdkBxeHE="]
  })
  let $ = JSON.parse(response)
  let book = {
    summary: $.data.expand.intro,
    status: $.data.isFinish == false ? '连载' : '完结',
    category: $.data.expand.sysTags[1].tagName,
    words: $.data.charCount,
    update: $.data.lastUpdateTime.match(/.+(?=T)/)[0],
    lastChapter: $.data.expand.latestChapter.title,
    catalog: `https://book.sfacg.com/Novel/${$.data.novelId}/MainIndex/`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let $ = HTML.parse(GET(url))
    let chapters = []
    $('.s-list > div.story-catalog').forEach(booklet => {
        $ = HTML.parse(booklet)
        chapters.push({ name: $('.catalog-hd > h3').text().replace(/【.+】/," ")})
        $('.catalog-list > ul > li').forEach(chapter => {
            $ = HTML.parse(chapter)
            chapters.push({
                name: $('a').attr('title'),
                url: $('a').attr('href'),
                vip: $('.icn_vip').text() == "VIP"
            })
        })
    })
    return JSON.stringify(chapters)
}

//章节
const chapter = (url) => {
    let $ = HTML.parse(GET(`https://book.sfacg.com${url}`))
    //未购买返回403和自动订阅地址
    if ($('.pay-bar > p.text')) throw JSON.stringify({
        code: 403,
        message: `https://book.sfacg.com${url}`
    })
  return $('#ChapterBody')
}

//个人中心
const profile = () => {
  let response = GET(`https://m.sfacg.com/my/`)
  let $ = HTML.parse(response)
  return JSON.stringify({
    url: 'https://m.sfacg.com/my/',
    nickname: $('.my_content > li > span > strong').text(),
    recharge: 'https://m.sfacg.com/pay/',
    balance: [
      {
        name: '火券',
        coin: $('.my_menu > a > li > i').text().match(/(?<=).?(?=火券.+代券)/)[0]
      },
      {
        name: '代券',
        coin: $('.my_menu > a > li > i').text().match(/(?<=火券 \/ )[\s\S]*?(?=代券)/)[0]
      },
    ],
  })
}

//排行榜
const rank = (title, category, page) => {
  let response = GET(`https://api.sfacg.com/novels/${title}/sysTags/novels?sort=latest&systagids=&isfree=both&isfinish=both&updatedays=-1&charcountbegin=0&charcountend=0&page=${page}&size=20&expand=typeName,tags,discount,discountExpireDate`,{headers:
  ["authorization: Basic YW5kcm9pZHVzZXI6MWEjJDUxLXl0Njk7KkFjdkBxeHE="]
  })
  let $ = JSON.parse(response)
  let books = []
  $.data.forEach((child) => {
    books.push({
      name: child.novelName,
      author: child.authorName,
      cover: child.novelCover,
      detail: `https://api.sfacg.com/novels/${child.novelId}?expand=chapterCount,bigBgBanner,bigNovelCover,typeName,intro,fav,ticket,pointCount,tags,sysTags,signlevel,discount,discountExpireDate,totalNeedFireMoney,originTotalNeedFireMoney,latestchapter,essaytag,auditCover,preOrderInfo`,
    })
  })
  return JSON.stringify({
    books: books
  })
}


const ranks = [
    {
        title: {
            key: '21',
            value: '魔幻'
        }
    },
    {
        title: {
            key: '22',
            value: '玄幻'
        }
    },
    {
        title: {
            key: '23',
            value: '古风'
        }
    },
    {
        title: {
            key: '24',
            value: '科幻'
        }
    },
    {
        title: {
            key: '25',
            value: '校园'
        }
    },
    {
        title: {
            key: '26',
            value: '都市'
        }
    },
    {
        title: {
            key: '27',
            value: '游戏'
        }
    },
    {
        title: {
            key: '28',
            value: '悬疑'
        }
    }
]

var bookSource = JSON.stringify({
  name: "SF轻小说",
  url: "sfacg.com",
  version: 101,
  authorization: "https://m.sfacg.com/login",
  cookies: [".sfacg.com"],
  ranks: ranks
})
