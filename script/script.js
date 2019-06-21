const addText = document.getElementById('add-text');
const addBtn = document.getElementById('add-button');
const listDiv = document.getElementsByClassName('todo-list')[0];
const clearBtn = document.getElementById('comp-clear');

let compId = 0;
let todoList = [];

function createCompElement(id, inputText, checked) {
    let comp__container = document.createElement('div');
    let newTodo__div = document.createElement('div');
    let newBtn = document.createElement('button');
    let newCheckbox = document.createElement('input');
    let newText = document.createElement('div');
    let newLine__div = document.createElement('div');
    let newLine = document.createElement('hr');

    newBtn.setAttribute("type", "button");
    newBtn.id = 'comp-delete';
    newBtn.textContent = 'X';
    newBtn.addEventListener('click', deleteButtonHandler);

    newCheckbox.setAttribute("type", "checkbox");
    newCheckbox.id = 'comp-check';
    newCheckbox.addEventListener('click', checkBoxHandler);

    newText.innerHTML = inputText;
    if(checked) {
        newText.style.textDecoration = 'line-through';
        newText.style.textDecorationColor = 'red';
        newCheckbox.checked = true;
    }
    else {
        newText.style.textDecoration = 'none';
        newCheckbox.checked = false;
    }
    newTodo__div.className = 'todo-comp';
    newTodo__div.appendChild(newBtn);
    newTodo__div.appendChild(newCheckbox);
    newTodo__div.appendChild(newText);

    newLine__div.className = 'todo-line';
    newLine__div.appendChild(newLine);

    comp__container.appendChild(newTodo__div);
    comp__container.appendChild(newLine__div);

    listDiv.appendChild(comp__container);

    const prevHeight = parseInt(listDiv.clientHeight);
    listDiv.style.height = prevHeight+12+'px';

    comp__container.id = id;
    comp__container.text = inputText;
    comp__container.checked = checked;

    todoList.push({
        id: id,
        text: inputText,
        checked: checked
    });
    localStorage.todoList = JSON.stringify(todoList);
}

function addButtonHandler(event) {
    if(addText.value.length > 0) {
        const inputText = addText.value;
        addText.value = null;

        createCompElement(compId++, inputText, false);
    }
}

function clearButtonHandler(event) {
    while(listDiv.firstChild) {
        listDiv.removeChild(listDiv.firstChild);
    }
    listDiv.style.height = '10px';
    localStorage.clear('todoList');
    todoList = [];
}

function deleteButtonHandler(event) {
    const selectedId = event.target.parentElement.parentElement.id;
    const child = document.getElementById(selectedId);
    listDiv.removeChild(child);

    todoList = todoList.filter((comp) => {
        return comp.id != selectedId;
    });
    localStorage.todoList = JSON.stringify(todoList);

    const prevHeight = parseInt(listDiv.style.height);
    listDiv.style.height = prevHeight-52+'px';
}

function checkBoxHandler(event) {
    const selectedId = event.target.parentElement.parentElement.id;
    const child = document.getElementById(selectedId).firstChild.lastChild;   
    if(event.target.checked) {
        child.style.textDecoration = 'line-through';
        child.style.textDecorationColor = 'red';

        todoList.map((comp) => {
            if(comp.id == selectedId) {
                comp.checked = true;
            }
        });
        localStorage.todoList = JSON.stringify(todoList);
    }
    else {
        child.style.textDecoration = 'none';

        todoList.map((comp) => {
            if(comp.id == selectedId) {
                comp.checked = false;
            }
        });
        localStorage.todoList = JSON.stringify(todoList);
    }
}

function loadHandler(event) {
    let list = [];
    if(localStorage.todoList != undefined) {
        list = JSON.parse(localStorage.todoList);
        for(let i=0; i<list.length; i++) {
            createCompElement(list[i].id, list[i].text, list[i].checked);
            compId = list[i].id+1;
        }
    }
}

function enterSubmitHandler(event) {
    event.preventDefault();
    if(event.keyCode == 13) {
        addButtonHandler();
    }    
}

addBtn.addEventListener('click', addButtonHandler);
clearBtn.addEventListener('click', clearButtonHandler);
window.addEventListener('load',loadHandler);
window.addEventListener('keyup', enterSubmitHandler);