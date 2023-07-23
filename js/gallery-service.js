'use strict'

let gImgs = [
    { id: 0, url: 'img/1.jpg', keywords: ['trump', 'funny'] },
    { id: 1, url: 'img/2.jpg', keywords: ['dogs', 'cute', 'love', 'like'] },
    { id: 2, url: 'img/3.jpg', keywords: ['tired', 'sleeping', 'cute', 'baby'] },
    { id: 3, url: 'img/4.jpg', keywords: ['cat', 'sleeping', 'tired', 'keyboard'] },
    { id: 4, url: 'img/5.jpg', keywords: ['baby', 'win', 'yes', 'happy'] },
    { id: 5, url: 'img/6.jpg', keywords: ['smart', 'history', 'funny'] },
    { id: 6, url: 'img/7.jpg', keywords: ['baby', 'shock', 'what', 'funny'] },
    { id: 7, url: 'img/8.jpg', keywords: ['smart', 'funny'] },
    { id: 8, url: 'img/9.jpg', keywords: ['baby', 'funny', 'evil', 'laugh'] },
    { id: 9, url: 'img/10.jpg', keywords: ['obama', 'laugh'] },
    { id: 10, url: 'img/11.jpg', keywords: ['sport', 'love', 'funny', 'gays'] },
    { id: 11, url: 'img/12.jpg', keywords: ['smart', 'news', 'hecht'] },
    { id: 12, url: 'img/13.jpg', keywords: ['actor', 'dicaprio', 'celebrate', 'cheers'] },
    { id: 13, url: 'img/14.jpg', keywords: ['matrix', 'decide', 'choose', 'morpheus'] },
    { id: 14, url: 'img/15.jpg', keywords: ['exactly', 'game', 'funny'] },
    { id: 15, url: 'img/16.jpg', keywords: ['starwars', 'actor', 'laugh', 'funny'] },
    { id: 16, url: 'img/17.jpg', keywords: ['putin', 'victory', 'win'] },
    { id: 17, url: 'img/18.jpg', keywords: ['toystory', 'everywhere', 'buzz'] },
]

let gTags = [
    { id: 0, txt: 'funny', size: 'big' },
    { id: 0, txt: 'yes', size: 'small' },
    { id: 0, txt: 'win', size: 'small' },
    { id: 0, txt: 'laugh', size: 'medium' },
    { id: 0, txt: 'baby', size: 'big' },
    { id: 0, txt: 'smart', size: 'medium' },
    { id: 0, txt: 'sleep', size: 'small' }
]

function getImgs(str) {
    if (!str) return gImgs

    str = str.toLowerCase()

    let filterImgs = []
    gImgs.forEach((img, idx) => {
        if (!img.keywords) return
        let includeKeys = img.keywords.filter(keyword => keyword.includes(str))
        if (!includeKeys.length) return
        filterImgs.push(gImgs[idx])
    })

    return filterImgs
}

function getRandomImg() {
    return gImgs[getRandomInt(0, gImgs.length)]
}

function getTags() {
    return gTags
}

function onAddLocalImg(ev) {
    loadImageFromInput(ev, initMeme)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()

    reader.onload = function (event) {
        let img = new Image() 
        img.src = event.target.result 
        
        img.onload = onImageReady.bind(null, img)

    }
    reader.readAsDataURL(ev.target.files[0])
}