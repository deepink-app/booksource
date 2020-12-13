{
    "name": "香网",
    "url": "xiang5.com",
    "version": 100,
    "search": {
        "url": "http://m.xiang5.com/dosearch?word=${key}&sort=totalviews",
        "list": "$..list[*]",
        "name": "$.name",
        "author": "$.author",
        "cover": "$.img",
        "status":"$.status",
        "detail": "$.book_url"
    },
    "detail": {
        "summary": ".bkdetails_intro>p:nth-child(2)",
        "category":"p.lastchapter>a@replace-> |->",
        "status": ".bkdetails_intro>p:nth-child(2)@replace->->连载",
        "update": ".bkdetails_mulu>a>i@replace->目录->",
        "lastChapter": ".bkdetails_mulu>a>p@replace->目录->",
        "words":".bookcont>.type@match->(?<=字数：).+?(?=字)",
        "catalog": "a.mulu"
    },
    "catalog": {
        "list": ".blist>a",
        "page":".page_next>a",
        "name": "a",
        "chapter": "a"
    },
    "chapter": {
        "content": "#chapcont",
        "filter": ["@kbd","@ins","@u","@tt","@dfn","@i","@abbr","@font"]
    },   
     "rank": [
        {
            "title":"香网排行",
            "url": "http://m.xiang5.com/paihang${key}.html",
            "categories": [{"key": "", "value": "热销榜"}, {"key": "/newbook", "value": "新书榜"}, {"key": "/dianji", "value": "点击榜"}, {"key": "/favor", "value": "收藏榜"}, {"key": "/update", "value": "更新榜"}, {"key": "/finishtop", "value": "完结榜"}, {"key": "/wordcount", "value": "免费榜"}],
            "list":"li.recom_top",
            "name":"h5",
            "author":"a.author",
            "cover":"img@attr->data-img",
            "detail":".book_cont>a"

        }
    ],
    "auth": {
        "login": "http://m.xiang5.com/user/newlogin.html",
        "cookie": "m.xiang5.com",
        "verify": "http://m.xiang5.com/user/index.html",
        "logged": ".others_nav>li:nth-child(1)@equal->充值记录",
        "vip": "h5@equal->支持作家原创，支持正版图书",
        "buy":"h5@equalNot->支持作家原创，支持正版图书"
    }
}
