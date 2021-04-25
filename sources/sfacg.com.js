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
                url: $('a').attr('href')
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
        message: url
    })
  return $('#ChapterBody')
}

var bookSource = JSON.stringify({
  name: "SF轻小说",
  url: "sfacg.com",
  version: 100,
  authorization: "https://m.sfacg.com/login",
  cookies: [".sfacg.com"]
})
