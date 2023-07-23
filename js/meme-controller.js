'use strict'

let gCurrImgId

let gCanvas
let gCtx

function initMeme(id) {
    clearPage()
    const elEditor = document.querySelector('.main-meme-editor')
    elEditor.hidden = false

    gCanvas = document.querySelector('#canvas')
    gCtx = gCanvas.getContext('2d')

    gCurrImgId = id
    creatMeme(id)
    renderMeme()
    clearInput()

    const elTxtBox = document.querySelector('.txt-box')
    elTxtBox.addEventListener('input', onAddTxt)

    const elColorPicker = document.querySelector('.color-picker')
    elColorPicker.addEventListener('input', onColorPick)
}

function clearPage() {
    const elMain = document.querySelectorAll('.main')
    elMain.forEach(main => main.hidden = true)
}

function renderMeme() {
    const img = new Image()
    const id = getImgId()

    img.src = gImgs[id].url
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawText()
    }

}

function renderLine() {
    const currLine = getCurrLine()
    const elLineSelector = document.querySelector('.line-selector')
    elLineSelector.innerHTML = `⇵ line: ${currLine}`
}

// LINE EDITOR

function onAddTxt(ev) {
    const txt = ev.target.value
    addLine(txt)
    renderMeme()
}

function drawText() {

    let { family,
        size,
        color,
        strokeColor,
        strokeWidth,
        align } = getFont()

    gCtx.lineWidth = strokeWidth
    gCtx.strokeStyle = strokeColor
    gCtx.font = `${size}px ${family}`
    gCtx.fillStyle = color
    gCtx.textAlign = align

    const linesData = getLinesData()
    linesData.forEach(lineData => {
        let { txt, x, y } = lineData
        gCtx.fillText(txt, x, y)
        gCtx.strokeText(txt, x, y)
    })
}

function handleInputKeyEvent(ev) {
    if (ev.key === 'Enter') {
        onAddNewLine()
        renderLine()
    }
}

function clearInput() {
    const elTxtBox = document.querySelector('.txt-box')
    elTxtBox.value = ''
}

function onAddNewLine() {
    addNewLine()
    clearInput()
    renderLine()
}

function onDeleteLine() {
    deleteLine()
    clearInput()
    renderMeme()
    renderLine()
}

function onToggleLine() {
    const val = toggleLine()
    clearInput()
    renderLine()
}

function onLinePose(val) {
    shiftLine(val)
    renderMeme()
}

// FONT EDITOR

function onSelectFont(val) {
    updateFont(val)
    renderMeme()
}

function onColorPick(val) {
    updateColor(val.target.value)
    renderMeme()
}

function onToggleStroke() {
    toggleStroke()
    renderMeme()
}

function onFontSize(val) {
    updateFontSize(val)
    renderMeme()
}

// SHARE BAR

function saveImg() {
    const newMeme = gCanvas.toDataURL()
    saveMeme(newMeme)
    initMeme(gCurrImgId)
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


