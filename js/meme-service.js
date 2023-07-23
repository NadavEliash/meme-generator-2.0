'use strict'

let gMeme = {}

function creatMeme(id) {
    gMeme = {
        selectedImgId: id,
        selectedLineIdx: 0,
        font: {
            family: 'impact',
            size: 80,
            color: 'white',
            strokeColor: 'black',
            strokeWidth: 2,
            align: 'center',
        },
        lines: [{
            txt: '',
            x: 250,
            y: 70
        }]
    }
}

function getImgId() {
    return gMeme.selectedImgId
}

// LINE EDITOR

function getCurrLine() {
    return (gMeme.selectedLineIdx + 1)
}

function getLinesData() {
    let linesData = []
    gMeme.lines.forEach(line => {
        let lineData = {
            txt: line.txt,
            x: line.x,
            y: line.y,
        }
        linesData.push(lineData)
    })
    return linesData
}

function addLine(txt) {
    const line = {
        txt,
        x: getLineDefaultPose().x,
        y: getLineDefaultPose().y
    }

    if (gMeme.selectedLineIdx < gMeme.lines.length) {
        gMeme.lines[gMeme.selectedLineIdx] = line
    } else {
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
        return gMeme.selectedLineIdx = 0
    }
    else {
        gMeme.selectedLineIdx = lineIdx
        return gMeme.selectedLineIdx
    }
}

// FONT EDITOR

function updateFont(val) {
    gMeme.font.family = val
}

function updateFontSize(val) {
    let fontSize = gMeme.font.size
    let updatedSize = fontSize + val * 10

    if (updatedSize > 120 || updatedSize < 30) return
    gMeme.font.size = updatedSize
}

function updateColor(val) {
    gMeme.font.color = val
}

function toggleStroke() {
    if (gMeme.font.strokeWidth === 0.5) { gMeme.font.strokeWidth = 2 }
    else if (gMeme.font.strokeWidth === 2) { gMeme.font.strokeWidth = 4 }
    else { gMeme.font.strokeWidth = 0.5 }
}

function getFont() {
    return gMeme.font
}

