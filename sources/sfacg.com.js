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
    category: $.data.expand.sysTags.map((item)=>{ return item.tagName}).join(" "),
    words: $.data.charCount,
    update: $.data.lastUpdateTime.match(/.+(?=T)/)[0],
    lastChapter: $.data.expand.latestChapter.title,
    catalog: `${baseUrl}/pas/mpapi/novels/${$.data.novelId}/dirs`
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "SF轻小说",
  url: "sfacg.com",
  version: 109
})
