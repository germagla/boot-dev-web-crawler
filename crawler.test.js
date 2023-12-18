const {test, expect} = require('@jest/globals')
const {normalizeURL, getURLsFromHTML} = require('./crawler.js')

test('normalizeURL protocol', () => {
    expect(normalizeURL(
        'https://google.com'
    )).toEqual('google.com')
})

test('normalizeURL trailing slash', () => {
    expect(normalizeURL(
        'https://blog.boot.dev/path/'
    )).toEqual('blog.boot.dev/path')
})

test('normalizeURL capitals', () => {
    expect(normalizeURL(
        'https://BLOG.boot.dev/path'
    )).toEqual('blog.boot.dev/path')
})

test('normalizeURL base domain trailing slash', () => {
    expect(normalizeURL(
        'https://blog.boot.dev/'
    )).toEqual('blog.boot.dev')
})

test('normalizeURL invalid url', () => {
    expect(normalizeURL(
        'not a url'
    )).toEqual(undefined)
})


test('getURLsFromHTML relative urls', () => {
    expect(getURLsFromHTML(
        '<a href="/path">link</a>',
        'https://blog.boot.dev/'
    )).toEqual(['https://blog.boot.dev/path'])
})

test('getURLsFromHTML absolute urls', () => {
    expect(getURLsFromHTML(
        '<a href="https://blog.boot.dev/path">link</a>',
        'https://blog.boot.dev/'
    )).toEqual(['https://blog.boot.dev/path'])
})

test('getURLsFromHTML relative and absolute urls', () => {
    expect(getURLsFromHTML(
        '<a href="/relativepath">link</a><a href="https://blog.boot.dev/absolutepath">link</a>',
        'https://blog.boot.dev/'
    )).toEqual(['https://blog.boot.dev/relativepath', 'https://blog.boot.dev/absolutepath'])
})

test('getURLsFromHTML no duplicates', () => {
    expect(getURLsFromHTML(
        '<a href="/path">link</a><a href="/path">link</a>',
        'https://blog.boot.dev/'
    )).toEqual(['https://blog.boot.dev/path'])
})

test('getURLsFromHTML no links', () => {
    expect(getURLsFromHTML(
        'no links here',
        'https://blog.boot.dev/'
    )).toEqual([])
})