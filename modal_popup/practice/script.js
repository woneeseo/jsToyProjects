;(function () {
  'use strict'

  /** 로직 분석
   * 1. 모달 버튼을 누르면 모달 창이 뜨면서 백그라운드 스크롤이 막힘
   *    (body태그에 클래스를 추가해서 스크롤링이 안되도록 함)
   * 2. 모달의 버튼을 클릭하거나 백그라운드를 클릭하면 모달이 사라짐
   * 3. Toggle을 이용해서 클래스를 추가/ 삭제하여 구현 
   */

  const get = (target) => {
    return document.querySelector(target)
  }

  const $modalButton = get('.modal_open_button')
  const $modal = get('.modal')
  const $body = get('body')
  const $modalCancelButton = get('.modal_button.cancel')
  const $modalConfirmButton = get('.modal_button.confirm')

  // 모달 버튼을 클릭했을 때, 모달에 클래스를 추가하거나 삭제해서
  // 화면에 모달이 뜨거나 사라지게끔 하는 함수 
  const toggleModal = () => {
    // classList.toggle을 사용해 클래스를 추가/삭제할 수 있음
    $modal.classList.toggle('show')
    $body.classList.toggle('scroll_lock')
  }

  $modalButton.addEventListener('click', () => {
    toggleModal()
  })

  $modalConfirmButton.addEventListener('click', () => {
    toggleModal()
  })

  $modalCancelButton.addEventListener('click', () => {
    toggleModal()
  })
  // 배경 클릭했을 때 모달창 사라지게 하는 함수 
  window.addEventListener('click', (e) => {
    if(e.target === $modal) {
      toggleModal()
    }
  })
})()
