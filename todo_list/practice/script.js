;(function () {
  'use strict' // 엄격모드 사용
  // querySelector를 간편하게 여러곳에서 이용할 수 있도록 함수를 생성함
  const get = (target) => {
    return document.querySelector(target)
  }
  const API_URL = 'http://localhost:3000/todos'
  const $todos = get('.todos')
  const $form = get('.todo_form')
  const $todoInput = get('.todo_input')
  const $pagination = get('.pagination')
  
  // 페이지네이션용 변수 (페이지네이션 구현을 위한 초기 설정값)
  const limit = 5 // 한 페이지에 보여줄 게시글 수 
  let currentPage = 1 // 현재 페이지 (로딩하면 항상 첫번째 페이지부터 시작하므로 보통은 1)
  const totalCount = 53 // 총 게시글 수 (db에서 긁어오거나 임의로 설정)
  const pageCount = 5 // 한 페이지에 몇개의 페이지 갯수를 나타낼것인지 
 
  // 초기설정값을 이용해 함수 구현 
  const pagination = () => {
    let totalPage = Math.ceil(totalCount / limit) // 총 페이지 갯수 
    // 현재 페이지가 속해있는 그룹 
    let pageGroup = Math.ceil(currentPage / pageCount)
    // 현재 페이지가 속한 그룹의 첫번째 숫자
    let lastNumber = pageGroup * pageCount
    if(lastNumber > totalPage) {
      lastNumber = totalPage
    }
    // 현재 페이지가 속한 그룹의 마지막 숫자 
    let firstNumber = lastNumber - (pageCount -1)

    const next = lastNumber + 1 // 다음 버튼을 눌렀을 때 이동할 곳
    const prev = firstNumber - 1 // 이전 버튼을 눌렀을 때 이동할 곳

    let html = '' // pagination 안쪽의 내용이 될 변수
    if(prev > 0) {
      // 만약 prev이 0보다 크면 이전 버튼을 보여주도록 함 
      html += `<button class="prev" data-fn="prev">이전</button>`
    }
    // 페이지 숫자 보여줌
    for (let i = firstNumber; i<= lastNumber; i++) {
      html += `<button class="pageNumber" id="page_${i}">${i}</button>`
    }
    // 만약 next가 총 페이지수 보다 작으면 다음 버튼을 보여주도록 함
    if(lastNumber < totalPage) {
      html += `<button class="next" data-fn="next">다음</button>`
    }
    // pagination을 넘겨줌 
    $pagination.innerHTML = html

    // 현재 선택된 페이지를 가져와서 색상을 변경해줌 
    const $currentPageNumber = get(`.pageNumber#page_${currentPage}`)
    $currentPageNumber.style.color = '#9dc0e9'

    // 페이지 넘버를 클릭하면 페이지 내용이 변경되도록 하는 함수
    const $currentPageNumbers = document.querySelectorAll('.pagination button')
    $currentPageNumbers.forEach(button => {
      button.addEventListener('click', () => {
        // 클릭한 버튼이 이전 버튼이면 현재페이지는 이전 버튼이 가지고 있는 값으로 
        if(button.dataset.fn === 'prev') {
          currentPage = prev
        } else if(button.dataset.fn === 'next') {
          // 클릭한 버튼이 다음 버튼이면 현재페이지는 다음 버튼이 가지고 있는 값으로 
          currentPage = next
        } else {
          // 둘 다 아니면 현재 클릭한 버튼이 가지고 있는 innerText 값을 넘겨준다
          currentPage = button.innerText
        }
        pagination() // 페이지네이션을 한번 더 호출
        getTodos() // 페이지네이션 호출로 인해 변경된 컨텐츠 내용을 새로고침해 가져옴 
      })
    })
  }

  const createTodoElement = (item) => {
    const { id, content, completed } = item
    const $todoItem = document.createElement('div') // todos클래스 안에 div 태그를 하나 생성
    // isChecked 로 completed 가 true인 경우, 로딩될 때 체크박스가 체크로 로드되도록 함
    const isChecked = completed ? 'checked' : ''
    $todoItem.classList.add('item') // 생성한 div태그에 item 클래스를 부여해줌 
    $todoItem.dataset.id = id // data-id 속성을 추가 
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox'
                ${isChecked} 
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `
    return $todoItem
  }

  const renderAllTodos = (todos) => {
    $todos.innerHTML = '';
    todos.forEach(item => {
      const todoElement = createTodoElement(item)
      $todos.appendChild(todoElement);
    });
  }

  const getTodos = () => {
    fetch(`${API_URL}?_page=${currentPage}&_limit=${limit}`)
      .then((response) => response.json())
      .then((todos) => {
        renderAllTodos(todos)
      })
      .catch(error => console.error(error))
  }

  const addTodo = (e) => {
    e.preventDefault()
    const todo = {
      content: $todoInput.value,
      completed: false,
    }
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo),
    }).then(getTodos)
    .then(() => {
      $todoInput.value = ''
      $todoInput.focus()
    })
    .catch(error => console.log(error))
  }

  const toggleTodo = (e) => {
    // 클래스이름으로 가져와서 체크박스가 아닌 것을 클릭했을 때 return
    if(e.target.className !== 'todo_checkbox') return
    // 어떤 체크박스가 선택되었는지 구분하기 위해서
    // 체크박스를 구분하기 위해 설정한 data-id 라는 클래스를 가진
    // 가장 가까운 요소를 찾음
    const $item = e.target.closest('.item')
    // 찾은 요소가 가진 data-id 값을 가져옴 => 체크박스의 구분이 가능해짐 
    const id = $item.dataset.id
    const completed = e.target.checked

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed }),
    }).then(getTodos)
    .catch(error => console.error(error))
  } 
  // 투두리스트 데이터 수정하는 메서드 
  const changeEditMode = (e) => {
    const $item = e.target.closest('.item') // 체크박스처럼 수정할 아이템 찾아오고
    const $label = $item.querySelector('label') // 수정할 체크박스의 라벨 가져옴
    // 수정 버튼 눌렀을 때 입력되는 내용을 가지고 있는 input박스
    const $editInput = $item.querySelector('input[type="text"]')
    // 수정/ 삭제버튼 그룹 : 완료버튼 누르면 block
    const $contentButton = $item.querySelector('.content_buttons') 
    // 완료/ 취소버튼 그룹 : 수정버튼 누르면 block
    const $editButton = $item.querySelector('.edit_buttons') 
    const value = $editInput.value // focus 커서처리에 필요한 변수

    if(e.target.className === 'todo_edit_button') {
      // 만약 수정 버튼을 눌렀다면 
      $label.style.display = 'none' // 기존 내용을 가지고 있던 라벨은 숨겨주고
      $editInput.style.display = 'block' // 새로입력받을 창을 display
      $contentButton.style.display = 'none' // 수정/삭제버튼 숨기기
      $editButton.style.display = 'block' // 완료/취소버튼 block
      
      /** 포커스 속성을 그냥 적용하는 경우, 커서가 입력창 앞에 생김
       * => 인풋박스 밸류를 한번 초기화 해주고, 기존에 인풋박스가 가지고 있던 값을 재할당
       * => 포커스 커서가 글자 끝으로 가서 깜빡임 
       */
      $editInput.focus()
      $editInput.value = ''
      $editInput.value = value
    }

    if(e.target.className === 'todo_edit_cancel_button') {
      // 수정 버튼 옆 취소 버튼 눌렀을 때 ( 수정 버튼 눌렀을 때와 모두 반대 )
      $label.style.display = 'block'
      $editInput.style.display = 'none'
      $contentButton.style.display = 'block'
      $editButton.style.display = 'none'

      /** $label이 가지고 있는 값 = 변경 전 input박스의 내용
       * 취소 버튼을 누른 경우 변경 전 내용을 그대로 가지고 있어야 하므로
       * 라벨이 갖고있는 텍스트로 값을 재할당해줌 
       */
      $editInput.value = $label.innerText
    }
  }

  // fetch를 사용해 투두리스트의 내용을 수정
  const editTodo = (e) => {
    if(e.target.className !== 'todo_edit_confirm_button') return
    // 수정할 객체를 가져옴
    const $item = e.target.closest('.item')
    const id = $item.dataset.id
    const $editInput = $item.querySelector('input[type="text"]')
    const content = $editInput.value
    // 일부 데이터를 변경하고자 할 때는 patch를 사용 
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    .then(getTodos)
    .catch(error => console.error(error))
  }

  const removeTodo = (e) => {
    if(e.target.className !== 'todo_remove_button') return
    const $item = e.target.closest('.item')
    const id = $item.dataset.id

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(getTodos)
    .catch(error => console.error(error))
  }

  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos(API_URL); // 페이지 로드가 완전히 종료되었을 때, todo의 데이터를 불러오도록 함 
      pagination();
    })

    $form.addEventListener('submit', addTodo)
    $todos.addEventListener('click', toggleTodo)
    $todos.addEventListener('click', changeEditMode)
    $todos.addEventListener('click', editTodo)
    $todos.addEventListener('click', removeTodo)
  }
  init()
})()
