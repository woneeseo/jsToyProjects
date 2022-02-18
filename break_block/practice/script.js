;(() => {
  'use strict'
  // 클래스를 사용해 옵션화 가능
  const get = (target) => document.querySelector(target)
  const keyEvent = (control, func) => {
    document.addEventListener(control, func, false)
  }

  class BrickBreak {
    constructor(parent='body', data={}){
      this.parent = get(parent)
      this.canvas = document.createElement('canvas')
      this.canvas.setAttribute('width', '480')
      this.canvas.setAttribute('height', '340')
      this.ctx = this.canvas.getContext('2d')
      this.fontFamily =
        "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
      this.score = 0
      this.lives = data.lives
      this.speed = data.speed
      this.image = document.createElement('img')
      this.bg = data.bg
      this.radius = 10
      this.ballX = this.canvas.width / 2
      this.ballY = this.canvas.height - 30
      this.directX = data.speed
      this.directY = -data.speed
      this.paddleWidth = data.paddleWidth
      this.paddleHeight = data.paddleHeight
      this.rightPressed = false
      this.leftPressed = false
      this.paddleX = (this.canvas.width - this.paddleWidth) / 2
      this.brickRow = data.brickRow
      this.brickCol = data.brickCol
      this.brickWidth = data.brickWidth
      this.brickHeight = data.brickHeight
      this.brickPad = data.brickPad
      this.brickPosX = data.brickPosX
      this.brickPosY = data.brickPosY
      this.ballColor = data.ballColor
      this.paddleColor = data.paddleColor
      this.fontColor = data.fontColor
      this.brickStartColor = data.brickStartColor
      this.brickEndColor = data.brickEndColor
      this.image.setAttribute('src', this.bg)
      this.parent.appendChild(this.canvas)
      this.bricks = []
    }


    init = () => {
      for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
        this.bricks[colIndex] = []
        for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
          this.bricks[colIndex][rowIndex] = { x: 0, y: 0, status: 1 }
        }
      }
      this.keyEvent()
      this.draw()
    }

    keyUpEvent = (event) => {
      if('Right' === event.key || 'ArrowRight' === event.key) {
        this.rightPressed = false
      } else if('Left' === event.key || 'ArrowLeft' === event.key) {
        this.leftPressed = false
      }
    }

    keyDownEvent = (event) => {
      if('Right' === event.key || 'ArrowRight' === event.key) {
        this.rightPressed = true
      } else if('Left' === event.key || 'ArrowLeft' === event.key){
        this.leftPressed = true
      }
    }

    mouseMoveEvent = (event) => {
      const positionX = event.clientX - this.canvas.offsetLeft
      if(0 < positionX && positionX < this.canvas.width) {
        this.paddleX = positionX - this.paddleWidth / 2
      }
    }

    keyEvent = () => {
      keyEvent('keyup', this.keyUpEvent)
      keyEvent('keydown', this.keyDownEvent)
      keyEvent('mousemove', this.mouseMoveEvent)
    }

    drawBall = () => {
      this.ctx.beginPath()
      this.ctx.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2)
      this.ctx.fillStyle = this.ballColor
      this.ctx.fill()
      this.ctx.closePath()
    }

    drawPaddle = () => {
      this.ctx.beginPath()
      this.ctx.rect(
        this.paddleX, // 받침대 x위치
        this.canvas.height - this.paddleHeight, // 받침대 y위치
        this.paddleWidth, // 받침대 너비
        this.paddleHeight // 받침대 높이 
      )
      this.ctx.fillStyle = this.paddleColor
      this.ctx.fill()
      this.ctx.closePath()
    }
    
    drawBricks = () => {
      let brickX = 0
      let brickY = 0
      let gradient = this.ctx.createLinearGradient(0, 0, 200, 0)
      gradient.addColorStop(0, this.brickStartColor)
      gradient.addColorStop(1, this.brickEndColor)

      for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
        for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
          if (1 !== this.bricks[colIndex][rowIndex].status) {
            continue
          }
          brickX = colIndex * (this.brickWidth + this.brickPad) + this.brickPosX
          brickY =
            rowIndex * (this.brickHeight + this.brickPad) + this.brickPosY

          this.bricks[colIndex][rowIndex].x = brickX
          this.bricks[colIndex][rowIndex].y = brickY

          this.ctx.beginPath()
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight)
          this.ctx.fillStyle = gradient
          this.ctx.fill()
          this.ctx.closePath()
        }
      }
    }

    detectCollision = () => {
      let currentBrick = {}
      for (let colIndex = 0; colIndex < this.brickCol; colIndex++) { 
        for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
          currentBrick = this.bricks[colIndex][rowIndex]
          if(1 !== currentBrick.status ){
            continue
          }

          if(this.ballX > currentBrick.x
              && this.ballX < currentBrick.x + this.brickWidth
              && this.ballY > currentBrick.y
              && this.ballY < currentBrick.y + this.brickHeight
            ) {
              this.directY = -this.directY
              currentBrick.status = 0
              this.score++
              if(this.score !== (this.brickCol * this.brickRow)) {
                continue
              }

              alert(`You're Win!!`)
              this.reset()
            }
        }
      }
    }

    drawScore = () => {
      this.ctx.font = this.fontFamily
      this.ctx.fillStyle = this.fontColor
      this.ctx.fillText(`점수 : ${this.score} 점`, 10, 22)
    }

    drawLives = () => {
      this.ctx.font = this.fontFamily
      this.ctx.fillStyle = this.fontColor
      this.ctx.fillText(`목숨 : ${this.lives} 개`, this.canvas.width - 100, 22)
    }

    draw = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      // 백그라운드 설정
      this.ctx.drawImage(
        this.image,
        this.canvas.width / 2 - this.image.width / 2,
        this.canvas.height / 2 - this.image.height / 2
      )
      this.drawBall()
      this.drawPaddle()
      this.drawScore()
      this.drawLives()
      this.drawBricks()
      this.detectCollision()

      if(this.ballX + this.directX > this.canvas.width - this.radius
          || this.ballX + this.directX < this.radius
        ) {
        this.directX = -this.directX
      } else if(this.ballY + this.directY < this.radius) {
        this.directY = -this.directY
      } else if(this.ballY + this.directY > this.canvas.height - this.radius) {
        if(this.ballX > this.paddleX 
          && this.ballX + this.directX < this.paddleX + this.paddleWidth
          ){
            this.directY = -this.directY
          } else {
            this.lives--
            if(this.lives === 0) {
              alert('Game Over!!')
              this.reset()
            } else {
              this.ballX = this.canvas.width / 2
              this.ballY = this.canvas.height - this.paddleHeight
              this.directX = this.speed
              this.directY = -this.speed
              this.paddleX = (this.canvas.width - this.paddleWidth) / 2
            }
          }
        }

      if(this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
        this.paddleX += 7
      } else if(this.leftPressed && 0 < this.paddleX) {
        this.paddleX -= 7
      }

      this.ballX += this.directX
      this.ballY += this.directY

      requestAnimationFrame(this.draw)
    }

    reset = () => {
      document.location.reload()
    }
  }

  const data = {
    lives: 5,
    speed: 2,
    paddleHeight: 10,
    paddleWidth: 75,
    bg: './assets/bg.jpeg',
    ballColor: '#04BF55',
    paddleColor: '#05AFF2',
    fontColor: '#F2BB16',
    brickStartColor: '#F29F05',
    brickEndColor: '#F21905',
    brickRow: 3,
    brickCol: 5,
    brickWidth: 75,
    brickHeight: 20,
    brickPad: 10,
    brickPosX: 30,
    brickPosY: 30,
  }

  const brickBreak = new BrickBreak('.canvas', data)
  brickBreak.init()
})()


// ;(() => {
//   'use strict'
//   // 클래스를 사용해 옵션화 가능

//   const get = (target) => document.querySelector(target)

//   // 14. keyEvent 유틸함수 생성
//   const keyEvent = (control, func) => {
//     document.addEventListener(control, func, false)
//   }
//    // 3. 블록깨기 게임 클래스 생성
//   class BricBreak {
//     constructor(parent = 'body', data = {}) { // 파라미터로 parent / data를 받아옴
//       this.parent = get(parent) // 새로 생성할 canvas를 어디에 append할지 기준
//       this.canvas = document.createElement('canvas') // canvas 생성
//       this.canvas.setAttribute('width', '480') // canvas에 영역 주기 
//       this.canvas.setAttribute('height', '340')
//       this.ctx = this.canvas.getContext('2d') // context 생성
//       this.fontFamily =
//         "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
//       this.score = 0 // 초기 스코어 
//       this.lives = data.lives // 목숨
//       this.speed = data.speed // 공 스피드
//       this.image = document.createElement('img') // 배경이미지가 될 img태그 생성
//       this.bg = data.bg // 배경
//       this.radius = 10 // 반지름
//       this.ballX = this.canvas.width / 2 // 공이 생성되는 초기 x좌표
//       this.ballY = this.canvas.height - 30 // 공이 생성되는 초기 y좌쵸
//       this.directX = data.speed // x방향으로 이동할때의 스피드
//       this.directY = -data.speed // y방향으로 이동할때의 스피드 
//       this.paddleWidth = data.paddleWidth // 받침대 너비
//       this.paddleHeight = data.paddleHeight // 받침대 높이
//       this.rightPressed = false // 키보드의 오른쪽 버튼 눌렀는지 여부
//       this.leftPressed = false // 키보드의 왼족 버튼 눌렀는지 여부 
//       this.paddleX = (this.canvas.width - this.paddleWidth) / 2 // 받침대가 생성될 x좌표
//       this.brickRow = data.brickRow // 블록의 행 수
//       this.brickCol = data.brickCol // 블록의 열 수 
//       this.brickWidth = data.brickWidth // 블록 당 너비
//       this.brickHeight = data.brickHeight // 블록 당 높이
//       this.brickPad = data.brickPad // 블록 사이 간격
//       this.brickPosX = data.brickPosX // 좌우 여백
//       this.brickPosY = data.brickPosY // 상단 여백
//       this.ballColor = data.ballColor // 공 색
//       this.paddleColor = data.paddleColor // 받침대 색
//       this.fontColor = data.fontColor // 글자 색
//       this.brickStartColor = data.brickStartColor // 그라데이션 시작 색
//       this.brickEndColor = data.brickEndColor // 그라데이션 끝 색
//       this.image.setAttribute('src', this.bg) // img태그에 canvas배경화면으로 사용할 이미지를 src속성에 적용
//       this.parent.appendChild(this.canvas) // 부모 태그의 하위태그로 canvas를 append
//       this.bricks = [] // 블록 배열
//     }

//     // 4. init을 이용해 벽돌 배열을 만들고 각종 요소를 생성
//     init = () => {
//       // 벽돌 배열 만들기 (이중배열 사용)
//       for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
//         this.bricks[colIndex] = [] // 열 수 만큼 배열 안에 빈 배열을 넣어줌
//         for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
//           this.bricks[colIndex][rowIndex] = { x: 0, y: 0, status: 1 }
//         }
//       }
//       this.keyEvent() // 키보드 눌렀을 때 감지하는 메서드
//       this.draw() // 실제로 블록깨기 게임을 구현하는 메서드 
//     }
//     // 16. 키에서 손을 뗐을 때
//     keyUpEvent = (event) => {
//       if( 'Right' === event.key || 'ArrowRight' === event.key) {
//         this.rightPressed = false
//       } else if('Left' === event.key || 'ArrowLeft' === event.key) {
//         this.leftPressed = false
//       }
//     }
//     // 17. 키를 눌렀을 때 
//     keyDownEvent = (event) => {
//       if( 'Right' === event.key || 'ArrowRight' === event.key) {
//         this.rightPressed = true
//       } else if('Left' === event.key || 'ArrowLeft' === event.key) {
//         this.leftPressed = true
//       }
//     }
//     // 18. 마우스로 조작할 때 
//     mousemoveEvent = (event) => {
//       // event.clientX => 현재 커서의 x좌표
//       const positionX = event.clientX - this.canvas.offsetLeft // canvas.offsetLeft : 캔버스가 시작되는 좌측의 여백값

//       if(0 < positionX && positionX < this.canvas.width) {
//         // positionX가 0보다 크고, 캔버스의 너비보다 작으면 paddle의 반은 무조건 캔버스 내부에 남아서 패들이 없어지지 않게 함 
//         this.paddleX = positionX - this.paddleWidth / 2
//       }
//     }
//     // 15. keyEvent가 발생했을 때 함수 처리
//     keyEvent = () => {
//       keyEvent('keyup' , this.keyUpEvent)
//       keyEvent('keydown' , this.keyDownEvent)
//       keyEvent('mousemove', this.mousemoveEvent)
//     }
//      // 6. 블록깨기 공 생성하기
//     darwBall = () => {
//       this.ctx.beginPath()
//       this.ctx.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2)
//       this.ctx.fillStyle = this.ballColor
//       this.ctx.fill()
//       this.ctx.closePath()
//     }
//     // 7. 받침대 생성 
//     drawPaddle = () => {
//       this.ctx.beginPath()
//       this.ctx.rect(
//         this.paddleX, // 받침대 x위치
//         this.canvas.height - this.paddleHeight, // 받침대 y위치
//         this.paddleWidth, // 받침대 너비
//         this.paddleHeight // 받침대 높이 
//       )
//       this.ctx.fillStyle = this.paddleColor
//       this.ctx.fill()
//       this.ctx.closePath()
//     }
//     // 8. 스코어 생성 
//     drawScore = () => {
//       this.ctx.font = this.fontFamily
//       this.ctx.fillStyle = '#ffffff'
//       this.ctx.fillText(`점수 : ${this.score}`, 10, 22)
//     }
//     // 9. 목숨 생성 
//     drawLives = () => {
//       this.ctx.font = this.fontFamily
//       this.ctx.fillStyle = '#ffffff'
//       this.ctx.fillText(`목숨 : ${this.lives}`, this.canvas.width - 70, 22)
//     }

//     // 11. 벽돌 생성하기 
//     drawBricks = () => {
//       let brickX = 0 // 벽돌이 시작될 x축 좌표 
//       let brickY = 0 // 벽돌이 시작될 y축 좌표
//       let gradient = this.ctx.createLinearGradient(0, 0, 200, 0)
//       gradient.addColorStop(0, this.brickStartColor)
//       gradient.addColorStop(1, this.brickEndColor) // 블록에 그라데이션 주는 함수 

//       for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
//         for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
//           if (1 !== this.bricks[colIndex][rowIndex].status) {
//             // status!==1 -> 블록이 깨져 없어졌다는 말임
//             continue
//           }
//           brickX = colIndex * (this.brickWidth + this.brickPad) + this.brickPosX // 블록의 x좌표
//           brickY =
//             rowIndex * (this.brickHeight + this.brickPad) + this.brickPosY // 블록의 y좌표 

//           this.bricks[colIndex][rowIndex].x = brickX
//           this.bricks[colIndex][rowIndex].y = brickY

//           this.ctx.beginPath()
//           this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight)
//           this.ctx.fillStyle = gradient
//           this.ctx.fill()
//           this.ctx.closePath()
//         }
//       }
//     }
//     // 13. 충돌감지 
//     detectCollision = () => {
//       let currentBrick = {} // 현재 블럭 객체 
//       for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
//         for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
//           currentBrick = this.bricks[colIndex][rowIndex] // 현재 블럭을 이중배열을 이용해 가져온 뒤
//           if(1 !== currentBrick.status) {
//             continue // 이미 없어져있으면 넘기기 
//           }
//           if(this.ballX > currentBrick.x 
//             && this.ballX < currentBrick.x + this.brickWidth
//             && this.ballY > currentBrick.y
//             && this.ballY < currentBrick.y + this.brickHeight
//             ) {
//               this.directY = -this.directY // 블록에 맞았다 -> 방향 바꾸고
//               currentBrick.status = 0 // 블록의 status=0으로 만들어서 requestAnimationFrame()이 블록을 그리지 못하게 처리
//               this.score++ // 스코어 ++

//               if(this.score !== this.brickCol * this.brickRow) {
//                 continue // 스코어가 블록의 총 갯수와 같지 않는 동안 계속 반복
//               }

//               alert('승리했습니다.') // 블록갯수 === 스코어 => 게임 끝
//               this.reset()
//             }
//         }
//       }
//     }
//     // 5. 블록꺠기 게임 생성 
//     draw = () => {
//       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // 캔버스 내부 초기화
//       this.ctx.drawImage(
//         this.image,
//         this.canvas.width / 2 - this.image.width / 2,
//         this.canvas.height / 2 - this.image.height / 2
//       ) // 배경이미지 생성
//       this.darwBall() // 공 생성
//       this.drawPaddle() // 여백 생성
//       this.drawBricks() // 벽돌 생성
//       this.drawScore() // 스코어 생성
//       this.drawLives() // 목숨 생성
//       this.detectCollision() // 충돌 감지


//         // 12. 방향전환시키기
//       if(this.ballX + this.directX > this.canvas.width - this.radius // 공의좌표+진행속도 > 캔버스너비-반지름 => 오른쪽 벽
//           || this.ballX + this.directX < this.radius ) { // 공의x좌표+진행속도 < 반지름 => 왼쪽 벽
//             // 양쪽 벽에 부딪혔을 떄 방향 전환 
//             this.directX = -this.directX
//       } else if(this.ballY + this.directY < this.radius) { //공의y좌표+진행할방향 < 공의반지름 => 천장
//           // 천장에 부딪혔을 때 방향 전환 
//           this.directY = -this.directY
//       } else if(this.ballY + this.directY > this.canvas.height - this.radius) { // 공의y좌표+진행될방향 > 캔버스높이-반지름 => 바닥
//         // 아래쪽으로 향할 때 
//         if(this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) { // 공의x좌표 > 받침대x좌표 && 공의x좌표<받침대x좌표+받침대너비
//           // 패들 위에 닿으면 방향 전환
//           this.directY = -this.directY
//         } else {
//           this.lives --
//           if(this.lives === 0) { 
//             alert('실패하였습니다.')
//             this.reset()
//           } else { // 목숨이 아직 존재할 때 -> 공의 위치 초기화 
//             this.ballX = this.canvas.width / 2
//             this.ballY = this.canvas.height - this.paddleHeight
//             this.directX = this.speed
//             this.derectY = this.speed
//             this.paddleX = (this.canvas.width - this.paddleWidth) / 2
//           }
//         }
//       }

//       // 19. 키보드 조작으로 패들을 움직일 때 
//       if(this.rightPressed && // 오른쪽 키보드를 눌렀고 
//          this.paddleX < this.canvas.width - this.paddleWidth) { // 받침대의 x좌표 < 캔버스 너비 - 받침대 너비
//         this.paddleX += 7
//       } else if(this.leftPressed && 0 < this.paddleX) { // 왼쪽으로 갈 땐 x좌표가 0일때만 방향이 바뀌도록 해주면 됨
//         this.paddleX -= 7
//       }

//       // 10. 공이 움직일 수 있도록 속도를 지정해줌
//       this.ballX += this.directX
//       this.ballY += this.directY

//       requestAnimationFrame(this.draw) // 반복해서 실행시킴
//     }

//     // 게임이 종료되었을 때 리셋시키는 메서드 
//     reset = () => {
//       document.location.reload()
//     }
//   }
//    // 1. 게임의 각종 옵션 설정
//   const data = {
//     lives: 5, // 목숨 수 
//     speed: 2, // 공의 스피드
//     paddleHeight: 10, // 받침대 높이
//     paddleWidth: 75, // 받침대 너비
//     bg: './assets/bg.jpeg', // 배경 이미지
//     ballColor: '#04BF55', // 공 색
//     paddleColor: '#05AFF2', // 받침대 색
//     fontColor: '#F2BB16', // 글자 색 
//     brickStartColor: '#F29F05', // 블록의 그라데이션 시작 색 
//     brickEndColor: '#F21905', // 블록의 그라데이션 끝 색
//     brickRow: 3, // 블록 행 수
//     brickCol: 5, // 블록 열 수 => 3*5 총 15개의 블록을 생성 
//     brickWidth: 75, //블록 하나당 너비
//     brickHeight: 20, // 블록 하나당 높이
//     brickPad: 10, // 블록 사이의 간격
//     brickPosX: 30, // 좌우여백
//     brickPosY: 30, // 상단여백 
//   }
//   // 2. 클래스를 이용해 블록게임을 생성
//   const bricBreak = new BricBreak('.canvas', data)
//   bricBreak.init()
// })()

