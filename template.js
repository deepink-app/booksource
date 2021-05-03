/**
 * 一些约定如下：
 *
 * 1.如果需要 AES 能力，请在头部声明 require("crypto-js");
 * 声明后可直接使用 CryptoJS (用法同 crypto-js 库)
 *
 * 2.若需要存储数据，可使用 localStorage 函数，用法同浏览器环境
 *
 * 3.书源内若返回值为对象，均需要使用 JSON.stringify() 进行编码
 */

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {}

/**
 * 个人
 * @returns {{basic:[{name, value, url}], extra:[{name, type, method, times}]}}
 */
const profile = () => {}

var bookSource = JSON.stringify({
  name: '示例',
  url: 'example.com',
  version: 100,
  authorization: '',
  cookies: [],
})
