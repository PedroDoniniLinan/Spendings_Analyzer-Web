if(!localStorage.getItem('listId')) {
    localStorage['listId'] = 0;
}

/* ==============================     LIST      =============================== */
const numberOfAttr = 3;
const attrIndex = ['name', 'date', 'val'];
var list;


function listItem(name='', date='', val='') {
    // this.id = id;
    this.name = name;
    this.date = date;
    this.val = val;
}


var makeListItemHTML = (item) => {
    var tr = $("<tr>");
    for(let i = 0; i < numberOfAttr; i++) {
        var td = $("<td>")
        td.attr("contenteditable", "true");
        td.attr("class", attrIndex[i]);
        td.text(item[attrIndex[i]]);
        tr.append(td);
    }
    $("table").append(tr);
}

var updateListHTML = (newList) => {
    $("table").remove();
    $(".tab").append($("<table>"));
    newList.map(makeListItemHTML);
}

var getListArray = () => {
    list = []
    $('tr').each(function() {
        var name = $(this).children(".name").text();
        let date = $(this).children('.date').text();
        let val = $(this).children('.val').text();
        var item = new listItem(name, date, val);
        list.push(item);
    })
    return list;
}


var loadListArray = () => {
    list = []
    for(let i = 0; i < localStorage.listId; i++) {
        if(localStorage['item' + i]) {
            list.push(JSON.parse(localStorage['item' + i]));
        }
    }
    return list;
}

var storeListArray = () => {
    list.forEach((item, id) => {
        localStorage['item' + id] =  JSON.stringify(item);
    });
    let currentId = localStorage.listId;
    if(list.length < currentId) {
        for(let i = list.length; i < currentId; i++) {
            localStorage.removeItem('item' + i);
        }
    }
    localStorage.listId = list.length;
}

var add = document.getElementById("add");
add.onclick = () => {
    var newItem = new listItem();
    list.push(newItem);
    makeListItemHTML(newItem);
}

var save = document.getElementById("save-button");
save.onclick = () => {
    list = getListArray();
    storeListArray(list);
}


var delEmpty = document.getElementById("del-empty");
delEmpty.onclick = () => {
    list = list.filter(item => {
        return item.name != '';
    })
    updateListHTML(list);
}

var isList = ($("a[class=active]").text() === "Spendings list");
if(isList) {
    list = loadListArray();
    updateListHTML(list);
}
