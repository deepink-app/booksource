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
    category: $.data.tags.map((item)=>{ return item.name}).join(" "),
    words: $.data.count,
    update: $.data.update,
    lastChapter: $.data.nn_name,
    catalog: $.data.id
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "飞卢",
  url: "faloo.com",
  version: 105
})
