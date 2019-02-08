if(!localStorage.getItem('listId')) {
    localStorage['listId'] = 0;
}

/* ==============================     LIST      =============================== */
const numberOfAttr = 3;
const attrIndex = ['name', 'date', 'val'];
var list;


function listItem(name='', date='', val='', isChecked=false) {
    this.name = name;
    this.date = date;
    this.val = val;
    this.isChecked = isChecked;
}


var insertListItemHTML = (item) => {
    makeListItemHTML(item, 'pre');
}

var pushListItemHTML = (item) => {
    makeListItemHTML(item, 'pos');
}

var makeListItemHTML = (item, option) => {
    var tr = $("<tr>");
    var td = $("<td>");
    td.append($("<input>").attr('type','checkbox'));
    td.attr('class','check');
    tr.append(td);
    for(let i = 0; i < numberOfAttr; i++) {
        td = $("<td>");
        td.attr("contenteditable", "true");
        td.attr("class", attrIndex[i]);
        td.text(item[attrIndex[i]]);
        tr.append(td);
    }
    if(option === 'pre') 
        $("table").prepend(tr);
    else 
        $("table").append(tr);
}

var updateListHTML = (newList) => {
    $("table").remove();
    $(".tab").append($("<table>"));
    newList.map(pushListItemHTML);
}


var getListArray = () => {
    list = []
    $('tr').each(function() {
        let name = $(this).children('.name').text();
        let date = $(this).children('.date').text();
        let val = $(this).children('.val').text();
        let isChecked = $(this).children('.check').children().prop('checked');
        var item = new listItem(name, date, val, isChecked);
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

var isList = ($("a[class=active]").text() === "Spendings list");
if(isList) {
    list = loadListArray();
    updateListHTML(list);

    var add = document.getElementById("add");
    add.onclick = () => {
        var newItem = new listItem();
        list.unshift(newItem);
        insertListItemHTML(newItem);
    }

    var save = document.getElementById("save-button");
    save.onclick = () => {
        list = getListArray();
        storeListArray(list);
    }

    var isSelectable = false;
    var sel = document.getElementById("sel-button");
    sel.onclick = () => {
        if(isSelectable)
            $('td[class=check]').css('display','none');
        else 
            $('td[class=check]').css('display','table-cell');
        isSelectable = !isSelectable;
    }

    var areSelected = false;
    var selAll = document.getElementById("sel-all");
    selAll.onclick = () => {
        if(isSelectable) {
            if(areSelected)
                $('input[type=checkbox]').prop('checked',false);
            else
                $('input[type=checkbox]').prop('checked',true);
        } else { 
            $('td[class=check]').css('display','table-cell');
            $('input[type=checkbox]').prop('checked','true');
            isSelectable = true;
        }
        areSelected = !areSelected;
    }

    var delEmpty = document.getElementById("del-empty");
    delEmpty.onclick = () => {
        list = getListArray();
        list = list.filter(item => {
            return item.name != '';
        })
        updateListHTML(list);
    }

    var delSel = document.getElementById("del-sel");
    delSel.onclick = () => {
        list = getListArray();
        list = list.filter(item => {
            return item.isChecked != true;
        })
        updateListHTML(list);
        isSelectable = false;
        areSelected = false;
    }
}
