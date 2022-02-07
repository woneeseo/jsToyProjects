;(function () {
  'use strict'
  /** 크로셀 로직 분석
   * 1. 크로셀 클래스를 만들어 객체를 사용한다.
   * 2. 클래스 내부에서 크로셀이 가진 기능을 정의한다 (버튼 클릭 이벤트, 이미지 전환 등)
   * 3. 순서
   *  document.addEventListener('DOMContentLoaded', )
   *  class Carousel 생성
   *  constructor
   *  carousel요소들 가져오기
   *  carousel button 이벤트 걸어주기
   *  carousel button 이벤트로 next / prev => current값 변경시키는 기능 + moveCarouselTo()
   *  moveCarouselTo()로 무빙이벤트 생성 + 각 요소에 class부여
   *  carouselInit()으로 carousel 로드되었을때 초기값으로 0,1,totalItem-1번째 인덱스에 클래스부여
   *  DOMContentLoaded되면 carouselInit + buttonEvent 살려주기
   *  isMoving + setTimeout() 사용해서 carousel이 동작중이면 클릭이벤트 막아주기 
   */
  const get = (target) => {
    return document.querySelector(target)
  }

  class Carousel {
    constructor(carouselElement) {
      this.carouselElement = carouselElement
      this.itemClassName = 'carousel_item'
      this.items = this.carouselElement.querySelectorAll('.carousel_item')

      this.totalItems = this.items.length
      this.current = 0
      this.isMoving = false
    }

    carouselInit() {
      this.isMoving = false
      this.items[0].className = this.itemClassName + ' active'
      this.items[1].className = this.itemClassName + ' next'
      this.items[this.totalItems - 1].className = this.itemClassName + ' prev'
    }

    disabledInteraction(){
      this.isMoving = true
      setTimeout(() => {
        this.isMoving = false
      }, 500)
    }

    setEventListener(){
      this.nextButton = this.carouselElement.querySelector('.carousel_button--next')
      this.prevButton = this.carouselElement.querySelector('.carousel_button--prev')

      this.nextButton.addEventListener('click', () => {
        this.moveNext()
      })

      this.prevButton.addEventListener('click', () => {
        this.movePrev()
      })

    }

    moveCarouselTo() {
      if(this.isMoving) return
      this.disabledInteraction()

      let prev = this.current - 1
      let next = this.current + 1

      if(this.current === 0){
        prev = this.totalItems - 1
      } else if(this.current === this.totalItems - 1) {
        next = 0
      }

      for(let i = 0; i < this.totalItems; i++){
        if(i === this.current) {
         this.items[i].className = this.itemClassName + ' active' 
        } else if(i === prev) {
          this.items[i].className = this.itemClassName + ' prev'
        } else if(i === next) { 
          this.items[i].className = this.itemClassName + ' next'
        } else {
          this.items[i].className = this.itemClassName
        }
      }
    }

    moveNext() {
      if(this.isMoving) return
      if(this.current === this.totalItems - 1){
        this.current = 0
      } else {
        this.current++
      }
      this.moveCarouselTo()
    }

    movePrev() {
      if(this.isMoving) return
      if(this.current === 0){
        this.current = this.totalItems - 1
      } else {
        this.current--
      }
      this.moveCarouselTo()
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = get('.carousel')
    const carousel = new Carousel(carouselElement)

    carousel.carouselInit()
    carousel.setEventListener()
  })
})()


// ;(function () {
//   'use strict'

//   const get = (target) => {
//     return document.querySelector(target)
//   }
//   class Carousel {
//     constructor(carouselElement) {
//       this.carouselElement = carouselElement
//       this.itemClassName = 'carousel_item' // 클래스 명을 클래스 내부에서 활용해야 하기 때문에 따로 명시함
//       this.items = this.carouselElement.querySelectorAll('.carousel_item')

//       this.totalItems = this.items.length
//       this.current = 0 // items의 0번째요소를 맨 처음에 가져오게 하기 위해서
//       this.isMoving = false // true인 경우 버튼이 동작하지 않도록 함 
//     }

//     initCarousel() {
//       this.isMoving = false
//       this.items[0].classList.add('active')
//       this.items[1].classList.add('next')
//       this.items[this.totalItems - 1].classList.add('prev')
//     }

//     disabledInteraction() {
//       // 클릭이벤트가 발생할 때 마다 이미지가 변경되는 것이 아니라
//       // 이미지 변경시 500밀리세컨 유지 후 변경되도록 
//       this.isMoving = true
//       setTimeout(() => {
//         this.isMoving = false
//       }, 500)
//     }

//     setEventListener() {
//       this.prevButton = this.carouselElement.querySelector('.carousel_button--prev')
//       this.nextButton = this.carouselElement.querySelector('.carousel_button--next')

//       this.prevButton.addEventListener('click', () => {
//         this.movePrev()
//       })
//       this.nextButton.addEventListener('click', () => {
//         this.moveNext()
//       })
//     }

//     moveCarouselTo() {
//       if(this.isMoving) return
//       this.disabledInteraction()
//       // current item을 기준으로 prev, next를 구해서 앞, 뒤 item에 class를 부여해줘야함
//       let prev = this.current - 1
//       let next = this.current + 1

//       if(this.current === 0) {
//         // 예외처리 : current가 0인경우
//         prev = this.totalItems - 1
//       } else if (this.current === this.totalItems - 1) {
//         // 예외처리 : current가 마지막 item을 가리키는 경우
//         next = 0
//       }

//       for(let i = 0; i < this.totalItems; i++) {
//         if(i === this.current) {
//           this.items[i].className = this.itemClassName + ' active'
//         } else if(i === prev){
//           this.items[i].className = this.itemClassName + ' prev'
//         } else if(i === next) {
//           this.items[i].className = this.itemClassName + ' next'
//         } else {
//           this.items[i].className = this.itemClassName
//         }
//       }
//     }

//     // next / prev 버튼 클릭시 current값을 변경해 주는 역할
//     moveNext() {
//       if(this.isMoving) return
//       if(this.current === this.totalItems - 1) {
//         // current값이 전체 item수와 같은 경우, (인덱스이기 때문에 -1)
//         this.current = 0
//       } else {
//         this.current++
//       }
//       // carousel을 움직이도록 하는 메서드
//       this.moveCarouselTo()
//     }

//     movePrev() {
//       if(this.isMoving) return
//       if(this.current === 0) {
//         // current값이 0인 경우(더이상 마이너스 할 수 없을 때)
//         this.current === this.totalItems - 1 
//         // current값을 item의 마지막 인덱스로 변경해서 반복될 수 있도록 함
//       } else {
//         this.current--
//       }
//       this.moveCarouselTo()
//     }
//   } 

//   document.addEventListener('DOMContentLoaded', () => {
//     /** carousel을 가져와서 => carousel클래스의 인자로 이용해 carousel instance를 새로 만들어줌  */
//     const carouselElement = get('.carousel')
//     const carousel = new Carousel(carouselElement)

//     carousel.initCarousel() // 크로셀을 화면에 띄움
//     carousel.setEventListener() // prev/next버튼에 클릭이벤트
//   })
// })()
