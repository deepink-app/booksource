const baseUrl = "https://client4xcx.faloo.com"

//搜索
const search = (key) => {
  let response = POST(`${baseUrl}/V4.1/xml4android_listPage.aspx`,{data:`k=${encodeURI(key)}`})
  let array = []
  let $ = JSON.parse(response)
  $.data.forEach((child) => {
    array.push({
      name: child.name,
      author: child.author,
      cover: child.cover,
      detail: child.id,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = POST(`https://client4xcx.faloo.com/V4.1/Xml4Android_relevantPage.aspx`,{data:`id=${url}`})
  let $ = JSON.parse(response)
  let book = {
    summary: $.data.intro,
    status: $.data.finish == 0 ? '连载' : '完结',
    category: $.data.sc_name,
    words: $.data.count,
    update: $.data.update,
    lastChapter: $.data.nn_name,
    catalog: $.data.id
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = POST(`https://client4xcx.faloo.com/V4.1/Xml4android_novel_listPage.aspx`,{data:`id=${url}`})
  let $ = JSON.parse(response)
  let array = []
  $.data.vols.forEach((booklet) => {
    array.push({ name: booklet.name })
    booklet.chapters.forEach((chapter) => {
      array.push({
        name: chapter.name,
        url: `id=${url}&n=${chapter.id}`,
        vip: chapter.vip == 1
      })
    })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(POST(`https://client4xcx.faloo.com/V4.1/Xml4Android_ContentPage.aspx`,{data:`${url}`}))
  if($.code == 200) return $.data.content.trim()
  if($.code == 317) return $.msg  
}

var bookSource = JSON.stringify({
  name: "飞卢",
  url: "faloo.com",
  version: 103
})
