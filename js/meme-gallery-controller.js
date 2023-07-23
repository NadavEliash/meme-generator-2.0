'use strict'

let gClickedImg

function showSavedMemes() {
    const memes = getMemes()
    if (memes.length === 0) {
        alert('there is no any saved memes')
        return
    }


    closeMenu()
    clearPage()

    const elMemeGallery = document.querySelector('.main-meme-gallery')
    elMemeGallery.hidden = false
    renderMemeGallery(memes)
}

function renderMemeGallery(memes) {
    let strHtml = ``
    memes.forEach(meme => {
        strHtml += `<div class="meme-img-container"><img class="img-gallery" src="${meme}" alt="">
        <a href="#" class="btn btn-saved-download" onclick="downloadModalImg(this, '${meme}')"
        download="My-Hilarious-Meme.jpg"><img src="svg/download.svg" alt=""></a></div>`
    })

    const elMemeGallery = document.querySelector('.meme-gallery-container')
    elMemeGallery.innerHTML = strHtml

}


function downloadModalImg(elLink, img) {
    elLink.href = img
    // closeModal()
}

// function openImgModal(img) {
//     const elModal = document.querySelector('.img-modal')
//     elModal.classList.remove('hide')
//     gClickedImg = img.src
// }

// function editModalImg() {
//     const img = getNewImgUrl(gClickedImg)
//     initMeme(img)
//     closeModal()
// }

// function deleteModalImg() {
//     closeModal()
// }