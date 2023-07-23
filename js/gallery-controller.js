'use strict'

function onInit() {
    const imgs = getImgs('')
    renderImgs(imgs)
    renderTags()
    const elSearchtBox = document.querySelector('.search-box')
    elSearchtBox.addEventListener('input', onSearchBox)
}

function showGallery() {
    closeMenu()
    clearPage()
    const imgs = getImgs('')
    renderImgs(imgs)
    renderTags()
    const elGallery = document.querySelector('.main-gallery')
    elGallery.hidden = false 
}

function renderImgs(imgs) {
    let strHtml = `<div class="img-gallery add-local-container">
    <img class="add-local-img" src="svg/plus-icon.svg" alt="">
    <input class="local-img-input" type="file" name="image" onchange="onAddLocalImg(event)" />
    </div>`
    
    imgs.forEach(img => {
    strHtml += `<img class="img-gallery" onclick="initMeme(this)" src="${img.url}" alt="">`        
    })
    const elGallery = document.querySelector('.gallery-container')
    elGallery.innerHTML = strHtml
}

function renderTags() {
    const tags = getTags()

    let strHtml = ``
    tags.forEach(tag => {
        strHtml += `<button class="btn-tags ${tag.size}" onclick="onTag(this)">${tag.txt}</button>`
    })
    const elTags = document.querySelector('.tags-container')
    elTags.innerHTML = strHtml
}

function onFlexible() {
    const randImg = getRandomImg()
    let img = {src: randImg.url}
    
    initRandMeme(img)
}

function onSearchBox(input) {
    const searchStr = input.target.value
    const imgs = getImgs(searchStr)
    renderImgs(imgs)
}

function onTag(tag) {
    let str = tag.innerText
    const imgs = getImgs(str)
    renderImgs(imgs)
}