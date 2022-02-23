;(function () {
  'use strict'
  // contenteditable 속성이 true로 설정되어 있을 때, 문서의 편집 가능한 영역을 정할 수 있음
  // Document.execCommand(명령어, 기본 사용자 UI의 사용여부, value) 를 매개변수로 받아 문서의 내용을 편집
  // execCommand() 문서에 명시되어있는 명령어를 사용해 편집내용을 지정함

  const get = (target) => {
    return document.querySelector(target)
  }
  // 객체의 갯수만큼 에디터에 버튼을 만들어줌 + 명령어를 배열로 선언해 execCommand()에 매개변수로 넘기는 역할
  const commands = [
    {
      cmd:'backColor', // 명령어 
      value:'blue', // 초기값
      label:'배경 컬러' // 버튼이름
    },
    {
      cmd:'bold', // 명령어 
      label:'굵기' // 버튼이름
    },
    {
      cmd:'justifyCenter', // 명령어 
      label:'중앙 정렬' // 버튼이름
    },
    {
      cmd:'justifyLeft', // 명령어 
      label:'좌측 정렬' // 버튼이름
    },
    {
      cmd:'justifyRight', // 명령어 
      label:'우측 정렬' // 버튼이름
    },
    {
      cmd:'justifyFull', // 명령어 
      label:'양쪽 정렬' // 버튼이름
    },
    {
      cmd:'underline', // 명령어 
      label:'밑줄' // 버튼이름
    },
    {
      cmd:'italic', // 명령어 
      label:'기울이기' // 버튼이름
    },
    {
      cmd:'fontSize', // 명령어 
      value: '4',
      label:'글자 크기' // 버튼이름
    },
    {
      cmd:'foreColor', // 명령어 
      value: '#000',
      label:'글자색 변경' // 버튼이름
    },
  ]

  const commandObject = {} // commands의 요소를 객체로 담아오도록 함
  const $editorButtons = get('.editor_buttons')
  const $showEditorButton = get('.show_editor_button')
  const $showHTMLButton = get('.show_html_button')
  const $editorEdit = get('.editor.edit')
  const $editorHTML = get('.editor.html')

  const doCommand = (cmdKey) => { // 명령 실행 영역
    const cmd = commandObject[cmdKey]
    const val = cmd.value ? prompt('값을 입력해주세요.' , cmd.value) : '';
    document.execCommand(cmd.cmd, false, val)
  }

  const onClickShowEditor = () => { // 에디터모드로 변환
    $editorEdit.innerHTML = $editorHTML.innerText
    $editorEdit.classList.toggle('show')
    $editorHTML.classList.toggle('show')
  }

  const onClickShowHTML = () => { // HTML모드로 변환
    $editorHTML.innerText = $editorEdit.innerHTML
    $editorEdit.classList.toggle('show')
    $editorHTML.classList.toggle('show')
  }

  const init = () => {
    commands.map((command) => { //.map() 을 사용해 객체 하나하나를 꺼내줌
      commandObject[command.cmd] = command // 꺼낸 객체를 commandObject[명령어]를 키값으로 갖는 배열에 할당
      const element = document.createElement('button') // 버튼 객체를 생성
      element.innerText = command.label // 버튼 이름은 객체가 가지고 있는 label을 이용
      element.addEventListener('click', (e) => { // 버튼을 클릭하면 
        e.preventDefault()
        doCommand(command.cmd) // 명령어를 실행
      })
      $editorButtons.appendChild(element) // 버튼의 설정이 끝났으면 버튼영역에 append 해준다.
    })
  }

  $showEditorButton.addEventListener('click', onClickShowEditor)
  $showHTMLButton.addEventListener('click', onClickShowHTML)

  init()
})()
