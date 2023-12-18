const {argv} = require('node:process')
const {normalizeURL, getURLsFromHTML, crawlPage, printPages} = require('./crawler.js')

async function main() {
    if (argv.length !== 3) {
        console.log('Error!\nOnly one argument is expected.')
        process.exit(1)
    }
    let url = argv[2]
    const count = await crawlPage(url , url, {})
    printPages(count)

}

main()