'use strict'

let gMeme = {}
let gSelectedStickerIdx

const randomLines = [
    'Me, running away from',
    'We all have that..',
    'No one\'s perfect..',
    'you cant do both',
    'Just heard the news'
]

function creatMeme(url) {
    gMeme = {
        selectedImgURL: url,
        selectedLineIdx: 0,
        lines: [{
            txt: '',
            font: {
                family: 'impact',
                size: window.screen.width <= 600 ? 50 : 80,
                color: 'white',
                strokeColor: 'black',
                strokeWidth: 2,
                align: 'center',
            },
            x: (gCanvas.width / 2),
            y: 70,
            width: 0,
            isDrag: false
        }],
        stickers: [

        ]
    }
}

let gStickers = [
    { id: 0, url: 'img/stickers/so-cute.png', x: 150, y: 150 },
    { id: 1, url: 'img/stickers/watermelon.png', x: 150, y: 150 },
    { id: 2, url: 'img/stickers/love.png', x: 150, y: 150 },
    { id: 3, url: 'img/stickers/shocked.png', x: 150, y: 150 },
    { id: 4, url: 'img/stickers/coffee.png', x: 150, y: 150 },
    { id: 5, url: 'img/stickers/banana.png', x: 150, y: 150 }
]

function getImgId() {
    return gMeme.selectedImgId
}

function getNewImgUrl(dataURL) {
    gImgs[gImgs.length - 1].url = dataURL
    gMeme.selectedImgId = gImgs.length - 1
}

function getRandLine() {
    const line = randomLines[getRandomInt(0, randomLines.length)]
    gMeme.lines[0].font.size = 50
    gMeme.lines[0].txt = line
}


// LINE EDITOR

function getLines() {
    return gMeme.lines
}

function getSelectedLineTxt() {
    if (!gMeme.lines[gMeme.selectedLineIdx]) return
    return gMeme.lines[gMeme.selectedLineIdx].txt
}

function addLine(txt, width) {
    if (gMeme.selectedLineIdx < gMeme.lines.length) {
        gMeme.lines[gMeme.selectedLineIdx].txt = txt
        gMeme.lines[gMeme.selectedLineIdx].width = width
    } else {
        const line = {
            txt,
            font: {
                family: 'impact',
                size: window.screen.width <= 600 ? 50 : 80,
                color: 'white',
                strokeColor: 'black',
                strokeWidth: 2,
                align: 'center',
            },
            x: getLineDefaultPose().x,
            y: getLineDefaultPose().y,
            width,
            isDrag: false
        }
        gMeme.lines.push(line)
    }
}

function getLineDefaultPose() {
    const lineIdx = gMeme.selectedLineIdx
    let y
    if (lineIdx === 0) { y = 70 }
    else if (lineIdx === 1) { y = 470 }
    else { y = lineIdx * 80 }

    let x = 250

    if (window.screen.width <= 600) {
        x = 125
        y = lineIdx + 150
    }
    return { x, y }
}

function shiftLine(val) {
    let y = gMeme.lines[gMeme.selectedLineIdx].y
    let newYPosition = y + (10 * val)

    gMeme.lines[gMeme.selectedLineIdx].y = newYPosition
}

function addNewLine() {
    if (gMeme.selectedLineIdx + 1 > gMeme.lines.length) return
    gMeme.selectedLineIdx++
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx > 0) gMeme.selectedLineIdx--
}

function toggleLine() {
    let lineIdx = gMeme.selectedLineIdx
    lineIdx++
    if (lineIdx > gMeme.lines.length - 1) {
        gMeme.selectedLineIdx = 0
    }
    else {
        gMeme.selectedLineIdx = lineIdx
    }
}

function updateSelectedLine(idx) {
    gMeme.selectedLineIdx = idx
}


// FONT EDITOR

function updateFont(str) {
    gMeme.lines[gMeme.selectedLineIdx].font.family = str
}

function updateFontSize(val) {
    let fontSize = gMeme.lines[gMeme.selectedLineIdx].font.size
    let updatedSize = fontSize + val * 10

    if (updatedSize > 120 || updatedSize < 30) return
    gMeme.lines[gMeme.selectedLineIdx].font.size = updatedSize
}

function updateColor(val) {
    gMeme.lines[gMeme.selectedLineIdx].font.color = val
}

function toggleStroke() {
    const selectedLineFont = gMeme.lines[gMeme.selectedLineIdx].font
    if (selectedLineFont.strokeWidth === 0.5) { selectedLineFont.strokeWidth = 2 }
    else if (selectedLineFont.strokeWidth === 2) { selectedLineFont.strokeWidth = 4 }
    else { selectedLineFont.strokeWidth = 0.5 }
}


// LINE BOX AND DRAG (CONNECT WITH CANVAS CONTROLLER)

function updateLinePose(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].x += dx
    gMeme.lines[gMeme.selectedLineIdx].y += dy
}

function updateStickerPose(dx, dy) {
    const sticker = gMeme.stickers[gSelectedStickerIdx]
    sticker.x += dx
    sticker.y += dy
}

function checkLineHit(x, y) {
    let selectedLineIdx
    gMeme.lines.forEach((line, idx) => {
        const { minX, minY, maxX, maxY } = getLineBorders(idx)
        if (x > minX && y > minY && x < maxX && y < maxY) {
            selectedLineIdx = idx
            updateSelectedLine(idx)
            handleCurrLine()
        } else {
            return
        }
    })
    return selectedLineIdx
}

function checkStickerHit(x, y) {
    let selectedStickerId
    gMeme.stickers.forEach(sticker => {
        if (x > sticker.x && y > sticker.y && x < (sticker.x + 30) && y < (sticker.y + 30)) {
            selectedStickerId = sticker.id
            handleHitSticker()
        } else {
            return
        }
    })
    return selectedStickerId
}

function getLineBorders(lineIdx) {
    const line = gMeme.lines[lineIdx]
    const height = gMeme.lines[gMeme.selectedLineIdx].font.size
    const width = line.width
    // drawRectAroundLine((line.x - line.width / 2), (line.y - height + 10), line.width, height)

    return {
        minX: (line.x - width / 2),
        minY: (line.y - height),
        maxX: (line.x + width / 2),
        maxY: (line.y)
    }
}

function drawRectAroundLine(x, y, width, height) {
    gCtx.beginPath()
    gCtx.rect(x, y, width, height)
    gCtx.stroke()
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 1
}

function getBorderBox() {

    const canvas = document.querySelector('canvas')
    const offsetLeft = canvas.offsetLeft
    const offsetTop = canvas.offsetTop

    const line = gMeme.lines[gMeme.selectedLineIdx]
    if (!line || !line.txt.length) return
    const height = gMeme.lines[gMeme.selectedLineIdx].font.size
    const width = line.width + 100

    const marginLeft = line.x - (width / 2)
    const marginTop = line.y - height + 10



    return { marginLeft, marginTop, height, width }
}

function getActualTxt() {
    const actualTxt = gMeme.lines[gMeme.selectedLineIdx].txt
    if (!actualTxt) { return false }
    else {
        return true
    }
}


// STICKERS

function addSticker(id) {
    const currSticker = gStickers.find(sticker => sticker.id === parseInt(id))
    gMeme.stickers.push(currSticker)
    gSelectedStickerIdx = gMeme.stickers.length - 1
}

function getStickerPos(id) {
    const currSticker = gMeme.stickers[gSelectedStickerIdx]
    return { x: currSticker.x, y: currSticker.y }
}
