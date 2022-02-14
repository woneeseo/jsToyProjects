;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const sellCount = 6 // item의 갯수
  let selectedIndex = 0 // carousel이 실행되었을 때, 맨 첫번째 이미지를 보여주기 위해
  const carousel = get('.carousel')
  const prevButton = get('.prev_button')
  const nextButton = get('.next_button')

  const rotateCarousel = () => {
    const angle = (selectedIndex / sellCount) * -360
    carousel.style.transform = `translateZ(-360px) rotateY(${angle}deg)`
  }

  prevButton.addEventListener('click', () => {
    selectedIndex--
    rotateCarousel()
  })

  nextButton.addEventListener('click', () => {
    selectedIndex++
    rotateCarousel()
  })
})()
