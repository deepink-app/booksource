/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
 const search = (key) => {
}


/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
}


/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
}


/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
}


/**
 * 个人
 * @returns {[{url, nickname, recharge, balance[{name, coin}], sign}]}
 */
const profile = () => {
}

var bookSource = JSON.stringify({
    name: "示例",
    url: "example.com",
    version: 100,
    authorization: "",
    cookies: []
})