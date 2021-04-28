const baseUrl = "https://minipapi.sfacg.com"

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
      detail: `${baseUrl}/pas/mpapi/novels/${child.NovelID}?expand=latestchapter,chapterCount,typeName,intro,fav,ticket,pointCount,tags,sysTags,signlevel,discount,discountExpireDate,totalNeedFireMoney,originTotalNeedFireMoney`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url,{headers:
  ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
  })
  let $ = JSON.parse(response)
  let book = {
    summary: $.data.expand.intro,
    status: $.data.isFinish == false ? '连载' : '完结',
    category: $.data.expand.sysTags[0].tagName,
    words: $.data.charCount,
    update: $.data.lastUpdateTime.match(/.+(?=T)/)[0],
    lastChapter: $.data.expand.latestChapter.title,
    catalog: `${baseUrl}/pas/mpapi/novels/${$.data.novelId}/dirs`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url,{headers:
  ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
  })
  let $ = JSON.parse(response)
  let array = []
  $.data.volumeList.forEach((booklet) => {
    array.push({ name: booklet.title })
    booklet.chapterList.forEach((chapter) => {
      array.push({
        name: chapter.title,
        url: `${baseUrl}/pas/mpapi/Chaps/${chapter.chapId}?expand=content,needFireMoney,originNeedFireMoney,tsukkomi&autoOrder=false`,
        vip: chapter.isVip == true
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url,{headers:
  ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
  }))
    //未购买返回403和自动订阅地址
    if ($.status.msg == "请支持作者的辛勤写作,VIP章节必须登录后才可阅读") throw JSON.stringify({
        code: 403,
        message: `https://m.sfacg.com/c/${$.data.chapId}/`
    })
  return $.data.expand.content.replace(/\[img.*?\]/, '<img src="').replace(/\[.*img\]/, '"/>')
}

//个人中心
const profile = () => {
  let headers = ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
  let response = GET(`${baseUrl}/pas/mpapi/user`,{headers})
  let $ = JSON.parse(response)
  return JSON.stringify({
    url: 'https://m.sfacg.com/my/',
    nickname: $.data.nickName,
    recharge: 'https://m.sfacg.com/pay/',
    balance: [
      {
        name: '火券',
        coin: $.data.fireCoin,
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
      detail: `${baseUrl}/pas/mpapi/novels/${child.novelId}?expand=latestchapter,chapterCount,typeName,intro,fav,ticket,pointCount,tags,sysTags,signlevel,discount,discountExpireDate,totalNeedFireMoney,originTotalNeedFireMoney`,
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

const login = (args) => {
if(!args) return "账号或者密码不能为空"
    let data =`{"username":"${args[0]}","password":"${args[1]}"}`
    let headers = ["content-type:application/json","sf-minip-info:minip_novel/1.0.70(android;10)/wxmp"]
    let response = POST("https://minipapi.sfacg.com/pas/mpapi/sessions",{data,headers})
    let $ = JSON.parse(response)
    if($.status.httpCode == 401) return $.status.msg
    return "登录成功"
}

var bookSource = JSON.stringify({
  name: "SF轻小说",
  url: "sfacg.com",
  version: 101,
  authorization: JSON.stringify(['account','password']),
  cookies: ["sfacg.com"],
  ranks: ranks
})
