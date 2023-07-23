'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gIsDown = false
let gIsSticker = false
let gStartPos


function addMouseListeners() {
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    let { x, y } = pos
    let selectedLineIdx = checkLineHit(x, y)
    gSelectedStickerIdx = checkStickerHit(x, y)
    if (selectedLineIdx === undefined && gSelectedStickerIdx === undefined) return
    gIsDown = true
    if (selectedLineIdx === undefined) gIsSticker = true
    gStartPos = pos

    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    if (!gIsDown) return
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    
    if (!gIsSticker) {
        updateLinePose(dx, dy)
    }else {
        updateStickerPose(dx, dy)
    } 
    renderMeme()
    renderStickers()
    gStartPos = pos
}

function onUp(ev) {
    gIsDown = false
    gIsSticker = false
    gStartPos = undefined
    document.body.style.cursor = 'default'
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {

        ev.preventDefault()
        ev = ev.changedTouches[0]


        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}




function handleHitSticker() {

}
