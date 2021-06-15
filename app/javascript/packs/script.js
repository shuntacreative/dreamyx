
$('.effect').on('inview', function() {
	 var $item = $(this);
	 $item.addClass('start');
});


$(function(){
$('a[href^=#]').click(function(){
var speed = 500;
var href= $(this).attr("href");
var target = $(href == "#" || href == "" ? 'html' : href);
var position = target.offset().top;
$("html, body").animate({scrollTop:position}, speed, "swing");
return false;
});
});

//トップへ戻るボタン
$(function() {
    var topBtn = $('#to_top');   
    topBtn.hide();
    //スクロールが100に達したらボタン表示
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            topBtn.fadeIn();
        } else {
            topBtn.fadeOut();
        }
    });
});

//スマホメニュー
var bnrBtn = $('#g_navi');
var bnrBtn2 = $('#h_box_sp');
var menuOpen = false;
var scrollpos;

$('.bg_bl').hide();

var ttt = false;

$(function(){
        $(".menu_btn").on("click", function() {
	if(ttt == false) {
          bnrBtn.fadeIn();
		  bnrBtn2.fadeIn();
          menuOpen = true;
		  $('.om').hide();
		  $('.bg_bl').fadeIn();
		  scrollpos = $(window).scrollTop();
      $('body').addClass('fixed').css({'top': -scrollpos});
	        $(".menu_btn").addClass('opened');
	  ttt = true;
	} else {
		bnrBtn.fadeOut();
		  bnrBtn2.fadeOut();
          menuOpen = false;
		  $('.om').show();
		  $('.bg_bl').fadeOut();
		  $('body').removeClass('fixed').css({'top': 0});
		  $(".menu_btn").removeClass('opened');
      window.scrollTo( 0 , scrollpos );
	  ttt = false;
	}
        });
});

	 
$(window).resize(function(){
    var w = $(window).width();
    var x = 1100;
    if (w >= x) {
		bnrBtn.fadeIn();
		bnrBtn2.fadeIn();
        menuOpen = false;
		$('.bg_bl').hide();
		ttt = false;
		$(".menu_btn").removeClass('opened');
    } else if (ttt == false) {
		bnrBtn.fadeOut();
		bnrBtn2.fadeOut();
	}
});

//画像切替
$(function() {

  var $elem = $('.img-switch');
  var sp = '_sp.';
  var pc = '_pc.';
  var replaceWidth = 960;

  function imageSwitch() {
    var windowWidth = parseInt($(window).width());
    $elem.each(function() {
      var $this = $(this);
      if(windowWidth >= replaceWidth) {
        $this.attr('src', $this.attr('src').replace(sp, pc));
      } else {
        $this.attr('src', $this.attr('src').replace(pc, sp));
      }
    });
  }
  imageSwitch();

  var resizeTimer;
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      imageSwitch();
    }, 200);
  });
});

//アコーディオン
$(function(){
        $(".ac_menu").on("click", function() {
            $(this).next().slideToggle(); 
            $(this).toggleClass("active"); 
        });
});

/*$(function() {
  
var nav    = $('#g_navi'),
    offset = nav.offset();
  
$(window).scroll(function () {
  if($(window).scrollTop() > offset.top) {
    nav.addClass('nav_fixed');
  } else {
    nav.removeClass('nav_fixed');
  }
});
$(window).resize(function(){
	offset = nav.offset();
 }); 
});*/

window.onload = function() {

$(function() {
  var $win = $(window),
      $main = $('main'),
      $nav = $('#g_navi'),
      navHeight = $nav.outerHeight(),
      navPos = $nav.offset().top,
      fixedClass = 'nav_fixed';

  $win.on('load scroll', function() {
    var value = $(this).scrollTop();
    if ( value > navPos ) {
      $nav.addClass(fixedClass);
//     $main.css('margin-top', navHeight);
    } else {
      $nav.removeClass(fixedClass);
//      $main.css('margin-top', '0');
    }
  });
  
  $win.on('resize', function() {
	  navPos = $nav.offset().top;
  });
  
});


}
$(".hover").mouseleave(
  function () {
    $(this).removeClass("hover");
  }
);


const todoList = []
let inputForm, todoMain, tabButton, sortMenu
let displayTarget = "inbox"
let sortIndex = "created-desc"

/** Todo一個単位のHTML文字列を生成する */
function createTodoHtmlString(todo) {
  let htmlString = ""
  const editType = todo.isEdit ? "editFixed" : "edit"
  const editButtonLabel = todo.isEdit ? "編集完了" : "編集"
  const doneType = todo.isDone ? "inbox" : "done"
  const doneButtonLabel = todo.isDone ? "未完了" : "完了"
  let todoTextCell, priorityCell
  if (todo.isEdit) {
    todoTextCell =
      '<td class="cell-text"><input class="input-edit" type="text" value=' +
      todo.text +
      " /></td>"
    priorityCell =
      '<td class="cell-priority"><input class="input-priority" type="number" value=' +
      todo.priority +
      " /></td>"
  } else {
    todoTextCell = '<td class="cell-text">' + todo.text + "</td>"
    priorityCell = '<td class="cell-priority">' + todo.priority + "</td>"
  }
  htmlString += '<tr id="' + todo.id + '">'
  htmlString +=
    '<td class="cell-edit-button"><button data-type="' +
    editType +
    '">' +
    editButtonLabel +
    "</button></td>"
  htmlString += todoTextCell
  htmlString += '<td class="cell-created-at">' + todo.createdAt + "</td>"
  htmlString += priorityCell
  htmlString += '<td class="cell-done">'
  htmlString += '<button data-type="' + doneType + '">'
  htmlString += doneButtonLabel
  htmlString += "</button></td>"
  htmlString += "</td>"
  htmlString += '<td class="cell-delete">'
  htmlString += '<button data-type="delete">'
  htmlString += '削除'
  htmlString += "</button></td>"
  htmlString += "</tr>"
  return htmlString
}

/** todoの完了ステートの変更 */
function updateTodoState(todo, type) {
  todo.isDone = type === "done"
  updateTodoList()
}

/** ソート関数 */
function sortTodos(a, b) {
  switch (sortIndex) {
    case "created-desc":
      return Date.parse(b.createdAt) - Date.parse(a.createdAt)
    case "created-asc":
      return Date.parse(a.createdAt) - Date.parse(b.createdAt)
    case "priority-desc":
      return b.priority - a.priority
    case "priority-asc":
      return a.priority - b.priority
    default:
      return todoList
  }
}

/** 編集モード */
function editTodo(todo, type) {
  todo.isEdit = type === "edit"
  updateTodoList()
}

/** todoを削除 */
function deleteTodo(todo) {
  // 対象のTo-doオブジェクトの配列内のインデックスを調べる
  const index = todoList.findIndex((t) => t.id === todo.id)
  // 配列から削除する
  todoList.splice(index, 1)
}

/** TodoListの描画を更新する */
function updateTodoList() {
  let htmlStrings = ""
  // HTMLを書き換える
  todoList
    .filter(todo => todo.isDone !== (displayTarget === "inbox"))
    .sort(sortTodos)
    .forEach(todo => {
      // 新しいHTMLを出力
      htmlStrings += createTodoHtmlString(todo)
      todoMain.innerHTML = htmlStrings
    })
  todoMain.innerHTML = htmlStrings
  // 書き換えたHTMLにイベントをバインドする
  todoList
    .filter(todo => todo.isDone !== (displayTarget === "inbox"))
    .forEach(todo => {
      const todoEl = document.getElementById(todo.id)
      if (todoEl) {
        todoEl.querySelectorAll("button").forEach(btn => {
          const type = btn.dataset.type
          btn.addEventListener("click", event => {
            if (type.indexOf("edit") >= 0) {
              editTodo(todo, type)
            } else if (type.indexOf("delete") >= 0) {
              deleteTodo(todo)
              updateTodoState(todo, type)
            } else {
              updateTodoState(todo, type)
            }
          })
        })
        // 編集状態の場合はテキストフィールドにもイベントをバインドする
        if (todo.isEdit) {
          todoEl.querySelector(".input-edit").addEventListener("input", event => {
            todo.text = event.currentTarget.value
          })
          todoEl
            .querySelector(".input-priority")
            .addEventListener("input", event => {
              todo.priority = parseInt(event.currentTarget.value, 10)
            })
        }
      }
    })
}

/** フォームをクリアする */
function clearInputForm() {
  inputForm["input-text"].value = ""
}

/** todoListを追加する */
function addTodo(todoObj) {
  todoObj.id = "todo-" + (todoList.length + 1)
  todoObj.createdAt = new Date().toLocaleString()
  todoObj.priority = 3
  todoObj.isDone = false
  todoObj.isEdit = false
  todoList.unshift(todoObj)
  updateTodoList()
  clearInputForm()
}

/** Todoを登録する処理 */
function handleSubmit(event) {
  event.preventDefault()
  const todoObj = {
    text: inputForm["input-text"].value
  }
  addTodo(todoObj)
}

/** インボックス / 完了済の切り分け */
function handleTabClick(event) {
  const me = event.currentTarget
  displayTarget = me.dataset.target
  updateTodoList()
}

/** ソートの実行 */
function handleSort(e) {
  sortIndex = e.currentTarget.value
  updateTodoList()
}

/** DOMを変数に登録する */
function registerDOM() {
  inputForm = document.querySelector("#input-form")
  todoMain = document.querySelector("#todo-main")
  tabButton = document.querySelector("#tab").querySelectorAll("button")
  sortMenu = document.querySelector("#sort-menu")
}

/** DOMにイベントを設定する */
function bindEvents() {
  inputForm.addEventListener("submit", event => handleSubmit(event))
  tabButton.forEach(tab => {
    tab.addEventListener("click", event => handleTabClick(event))
  })
  sortMenu.addEventListener("change", event => handleSort(event))
}

/** 初期化 */
function initialize() {
  registerDOM()
  bindEvents()
  updateTodoList()
}

document.addEventListener("DOMContentLoaded", initialize.bind(this))

