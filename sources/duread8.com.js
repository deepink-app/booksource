require('crypto-js')

const baseUrl = 'https://app.duread8.com'

const login_token = localStorage.getItem('login_token')

const account = localStorage.getItem('account')

const encrypt = function (data) {
    let key = CryptoJS.enc.Hex.parse('10FF7D32393905CE632272E729F52045A3A8D286665003454439B27F4E6E4F1F')
    let iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000')
    encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
}

const decrypt = function (data) {
    let key = CryptoJS.enc.Hex.parse('10FF7D32393905CE632272E729F52045A3A8D286665003454439B27F4E6E4F1F')
    let iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000')
    decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let data = `secret_content=${encodeURIComponent(encrypt(JSON.stringify({
        key: key,
        login_token: login_token,
        account: account
    })))}`
    let res = JSON.parse(decrypt(POST(`${baseUrl}/bookcity/get_filter_search_book_list`,{data})))
    let array = []
    res.data.book_list.forEach(($) => {
        array.push({
            name: $.book_name,
            author: $.author_name,
            cover: $.cover,
            detail: JSON.stringify({
              url: `${baseUrl}/book/get_info_by_id`,
              data: `secret_content=${encodeURIComponent(encrypt(JSON.stringify({
                book_id:$.book_id,
                login_token: login_token,
                account: account
                })))}`
            })
        })
    })
    return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
    let args = JSON.parse(url)
    console.log(args)
    let $ = JSON.parse(decrypt(POST(args.url, {data: args.data}))).data.book_info
    let book = {
        summary: $.description,
        status: $.up_status == 1 ? '完结':'连载',
        category: $.tag.replace(/,/g, ' '),
        words: $.total_word_count,
        update: $.uptime,
        lastChapter: $.last_chapter_info.chapter_title,
        catalog: JSON.stringify({
            url: `${baseUrl}/chapter/get_chapter_list_group_by_division`,
            data: `secret_content=${encodeURIComponent(encrypt(JSON.stringify({
                book_id:$.book_id,
                login_token: login_token,
                account: account
            })))}`
        })
    }
    return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "独阅读",
  url: "duread8.com",
  version: 100
})
