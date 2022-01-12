const baseUrl = "https://api.m.hotread.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/m1/search/searchByWord?keyword=${encodeURI(key)}&pageNo=1&pageSize=10`)
  let $ = JSON.parse(response).data
  let array = []
  $.list.forEach((child) => {
    array.push({
      name: child.name,
      author: child.authorName,
      cover: child.cover,
      detail: `${baseUrl}/m1/story/get?storyId=${child.id}`
    })
  })
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

var bookSource = JSON.stringify({
  name: "火星小说",
  url: "hotread.com",
  version: 101
})
