{
    "name": "QQ阅读",
    "url": "reader.qq.com",
    "version": 100,
    "search": {
        "url": "https://h5.reader.qq.com/9/search?key=${key}&pageNo=1",
        "charset": "UTF-8",
        "list": "$.booklist[*]",
        "name": "$.title",
        "author": "$.author",
        "cover": "$.cover",
        "detail": "https://h5.reader.qq.com/9/intro?bid=${$.id}"
    },
    "detail": {
        "status": "$.book.finished@equal->1", 
        "words":"$..totalWords",
        "category":"$.caname",
        "update": "$.uptime",
        "lastChapter": "$..lastChapterName",
        "summary": "$..intro",
        "catalog": ""
    }
}
