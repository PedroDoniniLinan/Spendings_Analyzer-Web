if(!localStorage.getItem('listId')) {
    localStorage['listId'] = 0;
}

/* ==============================     LIST      =============================== */
const numberOfAttr = 3;
const attrIndex = ['name', 'date', 'val'];
var list;


function ListItem(name='', date='', val='', isChecked=false) {
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
        var item = new ListItem(name, date, val, isChecked);
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

var isList = ($("a[class=active]").text() === "Financial list");
if(isList) {
    list = loadListArray();
    updateListHTML(list);

    var add = document.getElementById("add");
    add.onclick = () => {
        var newItem = new ListItem();
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

/* ============================     ANALYSIS      =============================== */

function Dataset(data, label='', color=[46, 127, 44]) {
    this.data = data;
    this.label = label;
    this.backgroundColor = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ', 0.5)';
    this.borderColor = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ', 1)';
    this.borderWidth = 1;
}

var plotAnalysis = (datasets, label, axisStep) => {
    var ctx = document.getElementById("analysis-graphic");
    ctx.setAttribute("height", "200px");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: label,
            datasets: datasets
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                        stepSize: axisStep
                    }
                }]
            }
        }
    });
}

var formatDate = (date) => {
    var splitDate = date.split('/').map(item => parseInt(item));
    var month;
    switch(splitDate[1]) {
        case 1:
            month = 'Jan';
            break;
        case 2:
            month = 'Fev';
            break;
        case 3:
            month = 'Mar';
            break;
        case 4:
            month = 'Apr';
            break;
        case 5:
            month = 'May';
            break;
        case 6:
            month = 'Jun';
            break;
        case 7:
            month = 'Jul';
            break;
        case 8:
            month = 'Aug';
            break;
        case 9:
            month = 'Sep';
            break;
        case 10:
            month = 'Oct';
            break;
        case 11:
            month = 'Nov';
            break;
        case 12:
            month = 'Dec';
            break;
        default:
            break;
    }
    var year = splitDate[2];
    return month + '/' + year;
}

var accumulateByKey = (accumulated, data) => {
    if (!(data[0] in accumulated)) {
        accumulated[data[0]] = data[1];
    } else {
        accumulated[data[0]] += data[1];
    }
    return accumulated;
}

var createMissingKeys = (keys, obj) => {
    for(k of keys) {
        if(!(k in obj)) {
            obj[k] = 0;
        }
    }
    return obj;
}

var mapListToData = () => {
    var list = loadListArray();
    var pairs = list.map(item => [formatDate(item.date), parseInt(item.val)]);
    var months = pairs.map(kv => kv[0]).reduce((list, item) => {
        list.push(item);
        return list;
    }, []);
    var monthSet = new Set(months);
    var spendings = createMissingKeys(monthSet, pairs.filter(pair => pair[1] < 0).map(item => [item[0], Math.abs(item[1])]).reduce(accumulateByKey, {}));
    var income = createMissingKeys(monthSet, pairs.filter(pair => pair[1] > 0).reduce(accumulateByKey, {}));

    return {spendings: Object.values(spendings), income: Object.values(income), months: Array.from(monthSet)};
}

var isAnalysis = ($("a[class=active]").text() === "Analysis");
if(isAnalysis) {
    var data = mapListToData();
    var monthSpendings = new Dataset(data.spendings, 'Total spent',[255, 50, 50]);
    var monthIncome = new Dataset(data.income, 'Total earned');
    plotAnalysis([monthSpendings, monthIncome], data.months);
}
