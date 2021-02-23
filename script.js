function main() {


    // global variable declarations:

    let list = document.querySelector(".todolist");
    let inputElm = document.querySelector("input");
    let clearButton = document.querySelector("button");
    let itemsArray = JSON.parse(localStorage.getItem("todos")) || [];
    let filterBy = "all";
    let filters = document.querySelectorAll("a");

    if (itemsArray.length == 0) {
        document.querySelector(".filters").style.display = "none"; //hiding the filter buttons
    }else{
        inputElm.style.borderBottom = "1px solid black";
    }
    

    //assigining event listeners  to text-input, filter buttons and enter key  
    inputElm.addEventListener("keyup", handleKey);
    clearButton.addEventListener("click", handleClear);
    filters.forEach(e => { e.addEventListener("click", handleFilter); });

    createUI("all");// populating UI with saved items



    //function to handle enter key press
    function handleKey(event) {
        if (event.keyCode == 13) {
            if (inputElm.value.length == 0) {
                alert("Name cannot be empty");
            }
            else {
                document.querySelector(".filters").style.display = "block";
                let todo = {
                    name: event.target.value,
                    isDone: false
                }
                itemsArray.push(todo);
                createUI(filter());
                inputElm.value = "";
                inputElm.style.boxShadow = "none";
                inputElm.style.borderBottom = "1px solid black";
                localStorage.setItem("todos", JSON.stringify(itemsArray));
            }
        }
    }

    //helper function to get tage name of filter                         
    function filter() {
        filters.forEach(e => {
            if (e.className == "selected") {
                filterBy = e.dataset.tag;
            }
        });
        return filterBy;
    }

    //function to create UI depending on which tag is selected
    function createUI(str) {
        list.innerHTML = "";
        if (str == "all") {
            itemsArray.forEach((item, i) => {
                buildUI(item, i);
            });
        }
        else if (str == "active") {
            console.log("active");
            itemsArray.forEach((item, i) => {
                if (item.isDone == false) {
                    buildUI(item, i);
                }
            });
        }
        else if (str == "completed") {
            itemsArray.forEach((item, i) => {
                if (item.isDone == true) {
                    buildUI(item, i);
                }
            });
        }
    }


    //function to create UI
    function buildUI(item, i) {
        let movieItem = document.createElement("li");
        let checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.addEventListener("change", handleCheck);
        checkBox.checked = item.isDone;
        checkBox.classList.add("styled-checkbox");
        checkBox.setAttribute("data-id", i);
        checkBox.setAttribute("id", i);
        let p = document.createElement("label");
        p.innerText = item.name;
        p.style.textTransform="capitalize";
        p.setAttribute("data-id", i);
        p.setAttribute("for",i)
        if (item.isDone == true) {
            p.style.textDecoration = "line-through";
            p.style.color="grey";
        } else {
            p.style.textDecoration = "none";
        }
        let span = document.createElement("span");
        span.innerText = "❌ ";
        span.setAttribute("data-id", i)
        span.addEventListener("click", handleDelete);
        movieItem.append(checkBox, p, span);
        list.append(movieItem);
    }

    //function to handle checkbox change
    function handleCheck(event) {
        let id = event.target.dataset.id;
        itemsArray[id].isDone = !itemsArray[id].isDone;
        localStorage.setItem("todos", JSON.stringify(itemsArray));
        createUI(filter());
    }

    //function to handle delete button click
    function handleDelete(event) {
        if (event.target.nodeName == "SPAN") {
            itemsArray.splice(event.target.dataset.id, 1);
            localStorage.setItem("todos", JSON.stringify(itemsArray));
            createUI(filter());
        }

        if (list.childElementCount == 0 && filter() == "all") {
            document.querySelector(".filters").style.display = "none";
            inputElm.style.boxShadow = "0 5px 10px 6px rgba(0, 0, 0, 0.137)";
            inputElm.style.borderBottom = "none";
        }
    }

    //function to handle clear completed buttton click               
    function handleClear() {
        itemsArray = itemsArray.filter(e => {
            return e.isDone == false;
        });
        localStorage.setItem("todos", JSON.stringify(itemsArray));
        createUI(filter());
    }

    //function to handle filters like all, completed and active 
    function handleFilter(event) {
        filters.forEach(e => {
            e.classList.remove("selected");
        });
        if (event.target.dataset.tag == "all") {
            event.target.classList.add("selected");
            createUI("all");

        }
        else if (event.target.dataset.tag == "active") {
            event.target.classList.add("selected");
            createUI("active");

        }
        else if (event.target.dataset.tag == "completed") {
            event.target.classList.add("selected");
            createUI("completed");
        }
    }
}

//calling the main function
main();