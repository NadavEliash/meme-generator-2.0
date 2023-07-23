'use strict'

let gCurrImgURL

let gCanvas
let gCtx

function initMeme(img) {
    closeMenu()
    clearPage()

    gCurrImgURL = img.src
    const elEditor = document.querySelector('.main-meme-editor')
    elEditor.hidden = false

    gCanvas = document.querySelector('#canvas')
    gCtx = gCanvas.getContext('2d')
    getCanvasResponsive()
    addMouseListeners()
    addTouchListeners()
    renderStickerLine()

    creatMeme(gCurrImgURL)
    renderMeme()
    clearInput()

    const elTxtBox = document.querySelector('.txt-box')
    elTxtBox.addEventListener('input', onAddTxt)

    const elColorPicker = document.querySelector('.color-picker')
    elColorPicker.addEventListener('input', onColorPick)
}


function initRandMeme(url) {
    initMeme(url)
    getRandLine()
    onAddNewLine()
    renderMeme()
}

function getCanvasResponsive() {
    gCanvas.height = gCanvas.width
    const elCanvasCopy = document.querySelector('.canvas-copy')

    if (window.screen.width <= 600) {
        document.querySelector('#canvas').width = 250
        document.querySelector('#canvas').height = 250
    }

    elCanvasCopy.style.marginLeft = `${gCanvas.offsetLeft}px`
    elCanvasCopy.style.marginTop = `${gCanvas.offsetTop}px`
    elCanvasCopy.style.width = `${gCanvas.width}px`
    elCanvasCopy.style.height = `${gCanvas.width}px`
}

function renderMeme() {
    const img = new Image()

    img.src = gCurrImgURL
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        handleCurrLine()
        drawText()
    }
    renderStickers()
}

function handleCurrLine() {
    const elTxtBox = document.querySelector('.txt-box')
    let txt = getSelectedLineTxt()
    if (!txt) txt = ''
    elTxtBox.value = txt

    renderDragBox()
}

function renderDragBox() {
    if (!getBorderBox() || !getActualTxt()) {
        removeDragBox()
        return
    }

    let { marginLeft, marginTop, width, height } = getBorderBox()

    const elBorderLineBox = document.querySelector('.border-line-box')
    elBorderLineBox.hidden = false

    elBorderLineBox.style.marginLeft = `${marginLeft}px`
    elBorderLineBox.style.marginTop = `${marginTop}px`
    elBorderLineBox.style.width = `${width}px`
    elBorderLineBox.style.height = `${height}px`
}

function removeDragBox() {
    const elBorderLineBox = document.querySelector('.border-line-box')
    elBorderLineBox.hidden = true

}

function renderStickerLine() {
    const elStickerLine = document.querySelector('.sticker-container')
    let str = ``
    str += `<button class="drag-sticker" onclick="onDragSticker(-1)">👈</button>`
    for (let i = 0; i < 4; i++) {
        const sticker = gStickers[i]
        str += `<img data-id="${sticker.id}" class="btn-sticker" src="${sticker.url}" alt="" onclick="onAddSticker(this)"></img>`
    }
    str += `<button class="drag-sticker" onclick="onDragSticker(+1)">👉</button>`

    elStickerLine.innerHTML = str
}

function onDragSticker(val) {
    if (val === -1) {
        const last = gStickers[gStickers.length - 1]
        gStickers.unshift(last)
        gStickers.splice(gStickers.length - 1, 1)
    } else {
        const first = gStickers[0]
        gStickers.push(first)
        gStickers.splice(0, 1)
    }
    renderStickerLine()
}

// LINE EDITOR

function onAddTxt(ev) {


    const txt = ev.target.value
    addLine(txt, gCtx.measureText(txt).width)
    renderMeme()
}

function drawText() {

    const lines = getLines()
    lines.forEach(line => {
        let { family,
            size,
            color,
            strokeColor,
            strokeWidth,
            align } = line.font

        gCtx.lineWidth = strokeWidth
        gCtx.strokeStyle = strokeColor
        gCtx.font = `${size}px ${family}`
        gCtx.fillStyle = color
        gCtx.textAlign = align

        let { txt, x, y } = line

        gCtx.fillText(txt, x, y)
        gCtx.strokeText(txt, x, y)
    })
}

function handleInputKeyEvent(ev) {
    if (ev.key === 'Enter') {
        onAddNewLine()
        handleCurrLine()
    }
}

function clearInput() {
    const elTxtBox = document.querySelector('.txt-box')
    elTxtBox.value = ''
}

function onAddNewLine() {
    addNewLine()
    clearInput()
    handleCurrLine()
}

function onDeleteLine() {
    deleteLine()
    clearInput()
    renderMeme()
}

function onToggleLine() {
    toggleLine()
    clearInput()
    handleCurrLine()
}

function onLinePose(val) {
    shiftLine(val)
    renderMeme()
}

// FONT EDITOR

function onSelectFont(str) {
    updateFont(str)
    renderMeme()
    renderDragBox()
}

function onColorPick(ev) {
    updateColor(ev.target.value)
    renderMeme()
}

function onToggleStroke() {
    toggleStroke()
    renderMeme()
}

function onFontSize(val) {
    updateFontSize(val)
    renderMeme()
    renderDragBox()
}

// STICKERS

function onAddSticker(sticker) {
    addSticker(sticker.dataset.id)

    const img = new Image()

    img.src = sticker.src
    img.onload = () => {
        gCtx.drawImage(img, 150, 150, 180, 180)
    }
}

function renderStickers() {
    const img = new Image()

    gMeme.stickers.forEach(sticker => {
        img.src = sticker.url
        img.onload = () => {
            gCtx.drawImage(img, sticker.x, sticker.y, sticker.x + 30, sticker.Y + 30)
        }
    })
}

// SHARE SAVE AND DOWNLOAD

function saveImg() {
    const newMeme = gCanvas.toDataURL()
    saveMeme(newMeme)
    getMemes()
    showSavedMemes()
}

function downloadImg(elLink) {
    const imgContent = gCanvas.toDataURL()
    elLink.href = imgContent
}

function onUploadImg() {
    const imgDataUrl = gCanvas.toDataURL('image/jpeg') // Gets the canvas content as an image format

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        // Encode the instance of certain characters in the url
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log(encodedUploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
    }
    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    // Send a post req with the image to the server
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        // If the request is not done, we have no business here yet, so return
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        // if the response is not ok, show an error
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        // Same as
        // const url = XHR.responseText

        // If the response is ok, call the onSuccess callback function, 
        // that will create the link to facebook using the url we got
        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}