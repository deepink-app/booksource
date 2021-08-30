  require("crypto-js")
  const baseUrl = "https://m.jjwxc.net"
  const baseurlapp = "http://app.jjwxc.net/androidapi"
  //搜索
  const search = (key) => {
      let response = GET(`${baseurlapp}/search?keyword=${encodeURI(key)}&type=1&page=1&token=null&searchType=1&sortMode=DESC&versionCode=133`)
      let array = []
      let $ = JSON.parse(response)
      if($.items){
      $.items.forEach((item) => {
          array.push({
              name: item.novelname,
              author: item.authorname,
              cover: item.cover,
              detail: `${baseurlapp}/novelbasicinfo?novelId=${item.novelid}`,
          })
      })
      }
      return JSON.stringify(array)
  }

  //详情
  const detail = (url) => {
      let response = GET(url)
      let $ = JSON.parse(response)
      let book = {
          summary: `${$.novelIntroShort}\n标签: ${$.novelTags}\n${$.protagonist}\n${$.costar}\n${$.other}\n风格: ${$.novelStyle}\n视角: ${$.mainview}\n${$.novelIntro.replace(/(&lt;br\/&gt;)+/g,"\n")}`,
          status: $.novelStep == 1 ? "连载" : "完结",
          category: $.novelClass.replace(/--/, " "),
          words: $.novelSize,
          update: $.renewDate,
          lastChapter: $.renewChapterName,
          catalog: `https://app-cdn.jjwxc.net/androidapi/chapterList?novelId=${$.novelId}&more=0&whole=1`
      }
      return JSON.stringify(book)
  }

  var bookSource = JSON.stringify({
      name: "晋江文学城",
      url: "m.jjwxc.net",
      version: 106
  })
