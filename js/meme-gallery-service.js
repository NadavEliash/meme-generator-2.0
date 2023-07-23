'use strict'

const STORAGE_KEY = 'memesGalleryDB'
let gMemeGallery

function getMemes() {
    gMemeGallery = loadFromStorage()
    if (!gMemeGallery) gMemeGallery = []
    return gMemeGallery
}

function loadFromStorage() {
    const str = localStorage.getItem(STORAGE_KEY)
    return JSON.parse(str)

}

function saveMeme(newMeme) {
    getMemes()
    gMemeGallery.push(newMeme)
    saveToStorage()
}

function saveToStorage() {
    const str = JSON.stringify(gMemeGallery)
    localStorage.setItem(STORAGE_KEY, str)
}

