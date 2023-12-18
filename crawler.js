const {JSDOM} = require('jsdom')


function normalizeURL(url) {
    try {
        let urlObject = new URL(url)
        return String(urlObject.host + (urlObject.pathname.endsWith('/') ? urlObject.pathname.slice(0, -1) : urlObject.pathname))
    }catch(e){
        console.log(`${e.message} at URL: "${url}"`)
        return undefined
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    let urls = []
    try {
        let dom = new JSDOM(htmlBody)
        let links = dom.window.document.querySelectorAll('a')
        for (let link of links) {
            let url = new URL(link.href, baseURL)
            urls.push(url.href)
        }
        return [...new Set(urls)]
    } catch (e) {
        console.log(e.message)
        return []
    }
}


async function crawlPage(baseURL, currentURL, pages) {
    try {
        if (new URL(currentURL).host !== new URL(baseURL).host) {
            return pages
        }
    } catch (e) {
        console.log(e.message)
        return pages
    }
    let normcurrentURL = normalizeURL(currentURL)

    // pages = pages.hasOwnProperty(normcurrentURL) ?
    //     {...pages, normcurrentURL: pages[normcurrentURL] + 1} :
    //     {...pages, normcurrentURL: 1};
    if (pages.hasOwnProperty(normcurrentURL)) {
        pages[normcurrentURL]++
        return pages
    }else{
        pages[normcurrentURL] = 1
    }

    console.log(`Crawling ${normcurrentURL}`)
    try {
        let response = await fetch(currentURL)
        if (response.status >= 400) {
            console.log(`Error ${response.status} while crawling ${currentURL}`)
            return pages
        }
        if (!response.headers.get('Content-Type').includes('text/html')) {
            console.log(`Error: ${currentURL} did not return HTML`)
            return pages
        }
        let htmlBody = await response.text()
        let urls = getURLsFromHTML(htmlBody, currentURL)
        for (let url of urls) {
            pages = await crawlPage(baseURL, url, pages)
        }
        return pages

    } catch (e) {
        console.log(e.message)
        return pages
    }
}

function printPages(pages) {
    let sortable = [];
    for (let page in pages) {
        sortable.push([page, pages[page]]);
    }
    sortable.sort((a, b) => {
        return b[1] - a[1];
    });

    // Print the table header
    console.log('---------------------------------'.padEnd(111, '-'));
    console.log('| URL                           '.padEnd(100, ' ') + '  | Count |');
    console.log('---------------------------------'.padEnd(111, '-'));

    // Print each row
    for (let page of sortable) {
        console.log(`| ${page[0].padEnd(100, ' ')}| ${page[1].toString().padEnd(5, ' ')}|`);
    }

    // Print the table footer
    console.log('---------------------------------'.padEnd(111, '-'));
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
    printPages
}