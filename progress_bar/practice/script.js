;(function () {
  'use strict'
  // 스크롤을 내릴 때 마다 프로그레스바의 width값을 계산해 줌
  // 스크롤을 할 때마다 이벤트가 계속 발생됨 
  // => 쓰로틀을 이용해서 시간을 조정해주면 이벤트가 특정 시간에만 발생하도록 조정할 수 있음
  let timerId
  const get = (target) => {
    return document.querySelector(target)
  }

  // 쓰로틀은 파라미터로 콜백함수와 실행할 시간 주기를 받는다
  const throttle = (callback, time) => {
    // setTimetout -> 실행할 때 마다 초기화를 시켜줘야 함
    if(timerId) return
    timerId = setTimeout(() => {
      callback()
      timerId = undefined // timerId 초기화 
    }, time)
  }

  const $progerssBar = get('.progress-bar')
  // 자바스크립트의 레이아웃을 이용해서 스크롤 높이를 구함
  const onscroll = () => {
    // 스크롤영역에서 보여지는 영역 외 영역을 구함 (전체 영역 - 보여지는 영역)
    const height = 
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    // 스크롤 위치에 따라 프로그레스바의 퍼센트가 달라지기 때문에 스크롤 위치도 구함
    const scrollTop = document.documentElement.scrollTop
    // 스크롤탑을 전체 길이로 나눈 값에 100을 곱함
    const width = (scrollTop / height) * 100
    // 프로그레스바의 스타일로 width값을 줌 => 퍼센트로 줌
    $progerssBar.style.width = width + '%'
  }

  window.addEventListener('scroll', () => throttle(onscroll, 10))
})()
