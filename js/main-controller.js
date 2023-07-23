'use strict'

function toggleBurger() {
    const elBurger = document.querySelector('.hamburger')
    elBurger.classList.toggle('clicked')

    const elMenu = document.querySelector('.nav-bar ul')
    elMenu.classList.toggle('show')
}

function closeMenu() {
    const elBurger = document.querySelector('.hamburger')
    elBurger.classList.remove('clicked')
    
    const elMenu = document.querySelector('.nav-bar ul')
    elMenu.classList.remove('show')    
}

function clearPage() {
    const elMain = document.querySelectorAll('.main')
    elMain.forEach(main => main.hidden = true)

    removeDragBox()
}