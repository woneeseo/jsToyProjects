;(function () {
  'use strict'
  /** 로직 분석
   * 1. chart클래스를 이용해 차트 그리기
   * 2. 클래스 인자로는 parent, data, 차트의 너비, 높이, 반지름, 색을 받는다
   *  parent를 받는 이유 : parent의 아래 인자로 그려진 차트를 appendChild하기 위해
   * 3. 차트의 옵션 / 폰트 옵션을 작성
   * 4. 
   */
  const get = (target) => document.querySelector(target)

  class Chart {
    constructor(parent='body', data={}, { width, heigth, radius, colors }) {
      this.parent = get(parent)
      this.canvas = document.createElement('canvas')
      this.canvas.width = width
      this.canvas.height = heigth
      this.ctx = this.canvas.getContext('2d')
      this.legends = document.createElement('div')
      this.legends.classList.add('legends')
      this.parent.appendChild(this.canvas)
      this.parent.appendChild(this.legends)
      this.label = ''
      this.total = 0
      this.datas = Object.entries(data)
      this.radius = radius
      this.colors = colors
    }
    // 데이타의 전체 합을 구하는 메서드 
    getTotal = () => {
      for(const [data, value] of this.datas) {
        this.total += value
      }
    }

    // 차트의 주석을 그리는 메서드
    drawlegends = () => {
      let index = 0
      for(const [instruements, value] of this.datas) {
        this.label += `
          <span style="background-color:${this.colors[index]}">
          ${instruements}
          </span>
          `
          index++
      }
      this.legends.innerHTML = this.label
    }

    // 비어있는 하얀 원을 그려내는 메서드 
    drawCanvas = (centerX, centerY, radius, startAngle, endAngle, color) => {
      this.ctx.beginPath()
      this.ctx.fillStyle = color
      this.ctx.moveTo(centerX, centerY)
      this.ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      this.ctx.closePath()
      this.ctx.fill()
    }

    // 비어있는 하얀 원에 차트를 채워넣는 메서드 
    drawChart = (donutChart, centerX, centerY, fontOption) => {
      let inital = 0
      let index = 0
      let fontSize = fontOption.font.split('px')[0] || 14

      for(const [data, value] of this.datas) {
        const angleValue = (2 * Math.PI * value) / this.total
        this.drawCanvas(
          centerX,
          centerY,
          this.radius,
          inital,
          inital + angleValue,
          this.colors[index]
        )
        this.ctx.moveTo(centerX, centerY)
        const triangleCenterX = Math.cos(inital + angleValue / 2)
        const triangleCenterY = Math.sin(inital + angleValue / 2)
        const labelX = centerX - fontSize + ((2 * this.radius) / 3) * triangleCenterX
        const labelY = centerY + (this.radius / 2) * triangleCenterY
        const text = Math.round((100 * value) / this.total) + '%'

        this.ctx.fillStyle = !!fontOption ? fontOption.color : 'black'
        this.ctx.font = !!fontOption ? fontOption.font : `${fontSize}px arial`
        this.ctx.fillText(text, labelX, labelY)

        inital += angleValue
        index++
          // 도넛차트인 경우, 차트 안쪽에 배경색과 같은 원을 그려 도넛모양처럼 뚫어줌
        if(donutChart) {
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
  }
  // 차트에 들어갈 데이터 
  const data = {
    guitar: 30,
    base: 20,
    drum: 25,
    piano: 18
  }
  // 차트옵션
  const option = {
    radius: 150,
    width: 700,
    heigth: 500,
    colors: ['#c15454' , '#6fd971', '#687bd2', '#b971e0']
  }
  // 차트에 들어갈 데이터의 수치를 나타낼 때 쓰일 라벨
  const labelOption = {
    color: "#fff",
    font: "20px, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
  }

  const chart = new Chart('.canvas', data, option)
  const { width, heigth, radius } = option
  chart.getTotal()
  chart.drawlegends()
  chart.drawChart(false, width / 2 - 10 - radius, heigth / 2, labelOption)
  // 도넛차트인지 여부 / 넓이의 반 값으로 x위치를 지정 후 약간 원의 반만큼 빼서 도넛차트와 파일차트를 나란히 구현하도록 공간지정 
  // 캔버스 높이의 중앙에서 그릴것이므로 높이/2, 차트의 라벨들 labelOption으로 지정해줌
  chart.drawChart(true, width / 2 + 10 + radius, heigth / 2, labelOption)
})()
