let title = document.getElementById("title");
let taskinput = document.getElementById("taskinput");
let addtaskbtn = document.getElementById("addtaskbtn");
let message = document.getElementById("message");
let tasknb = document.getElementById("tasknb");
let compnb = document.getElementById("compnb");
let tasklist = document.getElementById("tasklist");
let completedlist = document.getElementById("completedlist");
let bombbtn = document.getElementById("bomb"); 

let count = 0;
let compcount = 0;
 

let tasks = [];
 
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
bombbtn.addEventListener("click", function() {
    let userconfirm = confirm("This will reset everything(ALL TASKS DELETED)");
    if (userconfirm === true) {
        tasklist.innerHTML = "";
        completedlist.innerHTML = "";
        count = 0;
        tasknb.textContent = count;
        compcount = 0;
        compnb.textContent = compcount;
        tasks = [];
        saveTasks();
        message.textContent = "Deleted Everything.";
    }
})
 

function createTask(taskText, noteText, isCompleted) {
    noteText = noteText || "";
    isCompleted = isCompleted || false;
 
    let list = document.createElement("li");
 
    let textspan = document.createElement("span");
    textspan.textContent = taskText;
    textspan.classList.add("task-name");
 
    let renamebtn = document.createElement("button");
    renamebtn.textContent = "Rename task";
 
    let note = document.createElement("input");
    note.type = "text";
    note.placeholder = "Add a note";
    note.classList.add("note-input");
    note.value = noteText;
 
    let deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete";
 
    let complete = document.createElement("button");
    complete.id = "complete";
    complete.textContent = "✓";
 

    let taskObj = { text: taskText, note: noteText, completed: isCompleted };
    tasks.push(taskObj);
 
    renamebtn.addEventListener("click", function () {
        if (textspan.isContentEditable) {
            textspan.contentEditable = "false";
            renamebtn.textContent = "Rename task";
            taskObj.text = textspan.textContent;
            saveTasks();
            message.textContent = "Task has been renamed.";
        } else {
            textspan.contentEditable = "true";
            textspan.focus();
            renamebtn.textContent = "Save";
 
            let selection = window.getSelection();
            let range = document.createRange();
            range.selectNodeContents(textspan);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });
 
    textspan.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            renamebtn.click();
        }
    });
 
    note.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            taskObj.note = note.value;
            saveTasks();
            message.textContent = "Note has been added.";
            note.blur();
        }
    });
 
    deletebtn.addEventListener("click", function () {
        let idx = tasks.indexOf(taskObj);
        if (idx > -1) tasks.splice(idx, 1);
        saveTasks();
 
        list.remove();
        if (taskObj.completed) {
            compcount--;
            compnb.textContent = compcount;
        } else {
            count--;
            tasknb.textContent = count;
        }
        message.textContent = "Task has been deleted";
    });
 
    complete.addEventListener("click", function () {
        if (complete.style.color !== "white") {
            complete.disabled = true;
            deletebtn.disabled = true;
            note.disabled = true;
            renamebtn.disabled = true;
 
            complete.style.color = "white";
            complete.style.backgroundColor = "blue";
 
            setTimeout(() => {
                completedlist.appendChild(list);
                renamebtn.remove();
 
                count--;
                tasknb.textContent = count;
                compcount++;
                compnb.textContent = compcount;
 
                complete.disabled = false;
                deletebtn.disabled = false;
                note.disabled = false;
 
                taskObj.completed = true;
                saveTasks();
            }, 1000);
        } else {
            complete.disabled = false;
            deletebtn.disabled = false;
            note.disabled = false;
        }
    });
 
    list.appendChild(textspan);
    list.appendChild(renamebtn);
    list.appendChild(note);
    list.appendChild(deletebtn);
    list.appendChild(complete);
 
    if (isCompleted) {

        completedlist.appendChild(list);
        renamebtn.remove();
        note.disabled = true;
        complete.style.color = "white";
        complete.style.backgroundColor = "blue";
        compcount++;
        compnb.textContent = compcount;
    } else {
        tasklist.appendChild(list);
        count++;
        tasknb.textContent = count;
    }
 
}
 
addtaskbtn.addEventListener("click", function () {
    let tasktext = taskinput.value.trim();
    if (tasktext === "") {
        message.textContent = "Nothing has been added.";
        return;
    }
 
    createTask(tasktext, "", false);
    saveTasks();
 
    taskinput.value = "";
    message.textContent = "Task added successfully";
});
 

let savedTasks = localStorage.getItem("tasks");
if (savedTasks != null) {
    let parsed = JSON.parse(savedTasks);
    parsed.forEach(function (t) {
        createTask(t.text, t.note, t.completed);
    });
}