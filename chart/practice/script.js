;(function () {
  'use strict'
  /** 로직 분석
   * 1. chart클래스를 이용해 차트 그리기
   * 2. 클래스 인자로는 parent, data, 차트의 너비, 높이, 반지름, 색을 받는다
   *  parent를 받는 이유 : parent의 아래 인자로 그려진 차트를 appendChild하기 위해
   * 3. 차트의 옵션 / 폰트 옵션을 작성
   * 4. getTotal()로 데이터의 전체 합을 구함
   * 5. drawLegends()로 라벨을 그림
   * 6. drawChart()로 전체 파이를 그리는데
   *    forof문 안에서 drawCanvas()를 통해 각 파이 조각에 대한 영역을 그린 뒤 각각을 영역에 더해나감
   * 7. 만약 도넛차트인경우 (donutChart=true) 파이차트 중앙에 배경색과 같은 원을
   *    drawCanvas()로 그려 추가해준다
   */
  const get = (target) => document.querySelector(target)

  class Chart {
    constructor(parent = 'body', data={}, { width, height, radius, colors }) {
      // parent => appendchild 할 기준 (없으면 디폴트는 body태그)
      this.parent = get(parent)
      this.canvas = document.createElement('canvas') // canvas태그 생성
      this.canvas.width = width // canvas의 너비영역
      this.canvas.height = height // canvas의 높이영역
      this.ctx = this.canvas.getContext('2d') // canvas context생성
      this.legends = document.createElement('div') // legends영역 생성
      this.legends.classList.add('legends') // legends영역에 스타일을 주기 위해 클래스 부여
      this.parent.appendChild(this.canvas) // parent영역에 canvas추가
      this.parent.appendChild(this.legends) // parent영역에 legends추가
      this.label = '' // legends영역에 들어갈 라벨(data의 key값)
      this.total = 0 // 데이터의 토탈 합
      this.datas = Object.entries(data) 
      // map, array등을 인자로 받아 [key, value] 쌍의 배열을 반환
      this.radius = radius // 차트의 반지름
      this.colors = colors // 차트에 들어갈 각 인자의 컬러
    }

    // 데이터의 전체 합을 구하는 메서드 
    getTotal = () => {
      for (const [data, value] of this.datas) {
        this.total += value
      }
    }
    // 데이터의 라벨을 가져와 span태그를 생성, 배경색 입힌 뒤, legends에 추가 시키는 메서드
    drawLegends = () => {
      let index = 0
      for (const [insturment, value] of this.datas) {
        this.label += `
          <span style="background-color:${this.colors[index]}">${insturment}</span>
        `
        index++
      }
      this.legends.innerHTML = this.label
    }

    // 파이차트의 조각조각을 그리는 메서드  
    drawCanvas = (x, y, radius, startAngle, endAngle, color) => {
      this.ctx.beginPath()
      this.ctx.fillStyle = color
      this.ctx.moveTo(x, y)
      this.ctx.arc(x, y, radius, startAngle, endAngle)
      this.ctx.closePath()
      this.ctx.fill()
    }

    // drawCanvas를 이용해 전체 파이차트를 그려내는 메서드
    drawChart = (dountChart, centerX, centerY, fontOption) => {
      let inital = 0 // 초기값
      let index = 0
      let fontSize = fontOption.font.split('px')[0] || 14

      for (const [data, value] of this.datas) {
        const angleValue = (2 * Math.PI * value) / this.total // 파이의 조각당 각도를 구하는 변수

        this.drawCanvas(centerX, centerY, this.radius, inital, inital + angleValue, this.colors[index])
        // 구해진 각도를 이용해서 각각의 파이 조각을 만들어내는 메서드 
        this.ctx.moveTo(centerX, centerY) // 중앙 영역으로 이동
        // 차트가 위치할 영역을 계산 
        const triangleCenterX = Math.cos(inital + angleValue / 2)
        const triangleCenterY = Math.sin(inital + angleValue / 2)

        // 라벨이 위치할 좌표를 계산
        const labelX = centerX - fontSize + ((2 * this.radius) / 3) * triangleCenterX
        const labelY = centerY + (this.radius / 2) * triangleCenterY

        const text = Math.round((100 * value) / this.total) + '%' // 차트 안의 퍼센테이지를 글자로 나타냄
        this.ctx.fillStyle = !!fontOption ? fontOption.color : 'black' // 차트 안의 글자 색
        this.ctx.font = !!fontOption ? fontOption.font : `${fontSize}px arial` // 차트 안의 글자 옵션
        this.ctx.fillText(text, labelX, labelY) // text : 30%, 25% ...
        inital += angleValue 
        index++
      }
      // 도넛차트일 때 , 가운데 하얀 원을 그려서 도넛처럼 뚫린 모양을 만들어줌
      if(dountChart){
        this.drawCanvas(
          centerX,
          centerY,
          this.radius / 3.5,
          0,
          Math.PI * 2,
          'white'
        )
      }
    }

  }

  // 차트에 들어갈 데이터 명시
  const data = {
    guitar: 30,
    base: 20,
    drum: 35,
    piano: 15,
  }

  // 차트의 너비, 높이, 반지름, 항목들이 갖는 영역의 색 명시
  const option = {
    radius: 150,
    width: 700,
    height: 500,
    colors: ['#c15454', '#6fd971', '#687bd2', '#b971e0']
  }

  // 차트의 글꼴이 갖는 속성 명시
  const labelOption = {
    color: '#fff',
    font: "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
  }

  const chart = new Chart('.canvas', data, option)
  const { width, height, radius } = option
  chart.getTotal()
  chart.drawLegends()
  chart.drawChart(false, width / 2 + 20 - radius, height / 2 ,labelOption)
              // 도넛차트인지 여부 / 넓이의 반 값으로 x위치를 지정 후 약간 원의 반만큼 빼서 도넛차트와 파일차트를 나란히 구현하도록 공간지정 
                              // 캔버스 높이의 중앙에서 그릴것이므로 높이/2, 차트의 라벨들 labelOption으로 지정해줌
  chart.drawChart(true, width / 2 + 50 + radius, height / 2 ,labelOption)

})()
