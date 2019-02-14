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


var parseDate = (dateString, precision=1) => {
    let date = dateString.split('/').map(item => parseInt(item));
    switch(precision) {
        case 0:
            return date[2];
        case 1:
            return date[2] * 100 + date[1];
        case 2:
            return (date[2] * 100 + date[1]) * 100 + date[0];
        default:
            return 0;
    }
}

var monthToString = (month) => {
    switch(month) {
        case 1:
            return 'Jan';            
        case 2:
            return 'Feb';
        case 3:
            return 'Mar';
        case 4:
            return 'Apr';
        case 5:
            return 'May';
        case 6:
            return 'Jun';
        case 7:
            return 'Jul';
        case 8:
            return 'Aug';
        case 9:
            return 'Sep';
        case 10:
            return 'Oct';
        case 11:
            return 'Nov';
        case 12:
            return 'Dec';
        default:
            return 0;
    }
}

var stringifyDate = (date, precision=1) => {
    let y, m, d;
    switch(precision) {
        case 0:
            return date;
        case 1:
            y = parseInt(date / 100);
            m = date - y * 100;
            return monthToString(m) + "/" + y;
        case 2:
            y = parseInt(date / 10000);
            aux = date - y * 10000;
            m = parseInt(aux / 100);
            d = aux - m * 100;
            return d + "/" + monthToString(m) + "/" + y;
        default:
            return 0;
    }
}


var generateKV = (list, key) => {
    if(key === "month") {
        return list.map(item => [parseDate(item.date), parseInt(item.val)]);
    }
    return list.map(item => [item[key], parseInt(item.val)]);
}

var generatePlotData = (data, option='') => {
    var spendings = data
    .map(kv => kv[1] < 0 ? [kv[0], Math.abs(kv[1])] : [kv[0], 0])
    .sort((a, b) => a[0] - b[0])
    .reduce(reduceByKey, {});
    
    var income = data
    .map(kv => kv[1] >= 0 ? kv : [kv[0], 0])
    .sort((a, b) => a[0] - b[0])
    .reduce(reduceByKey, {});
    
    var keys = Object.keys(spendings);

    if(option === "month") {
        keys = keys.map(k => stringifyDate(k));
        console.log(keys);
    }
    
    return {spendings: Object.values(spendings), income: Object.values(income), keys: keys};
}

var reduceByKey = (accumulated, data) => {
    if (!(data[0] in accumulated)) {
        accumulated[data[0]] = data[1];
    } else {
        accumulated[data[0]] += data[1];
    }
    return accumulated;
}

var isAnalysis = ($("a[class=active]").text() === "Analysis");
if(isAnalysis) {
    var list = loadListArray();
    var kv = generateKV(list, "month");
    var data = generatePlotData(kv, "month");
    var spendingsSet = new Dataset(data.spendings, 'Total spent',[255, 50, 50]);
    var incomeSet = new Dataset(data.income, 'Total earned');
    plotAnalysis([spendingsSet, incomeSet], data.keys);
}

/* ============================     HOME      =============================== */

var monthToInt = (month) => {
    switch(month) {
        case 'Jan':
            return 1;            
        case 'Feb':
            return 2;
        case 'Mar':
            return 3;
        case 'Apr':
            return 4;
        case 'May':
            return 5;
        case 'Jun':
            return 6;
        case 'Jul':
            return 7;
        case 'Aug':
            return 8;
        case 'Sep':
            return 9;
        case 'Oct':
            return 10;
        case 'Nov':
            return 11;
        case 'Dec':
            return 12;
        default:
            return 0;
    }
}

var getToday = (precision=1) => {
    var today = Date(Date.now()).toString().split(" ");
    let y = parseInt(today[3]) - 2000;
    let m = monthToInt(today[1]);
    let d = parseInt(today[2]);
    switch(precision) {
        case 0:
            return y;
        case 1:
            return y * 100 + m;
        case 2:
            return (y * 100 + m) * 100 + d;
        default:
            return 0;
    }
}

var isHome = ($("a[class=active]").text() === "Home");
if(isHome) {
    var list = loadListArray();
    var current = list.reduce((sum, item) => sum += parseInt(item.val), 0);
    var today = getToday();
    var spendings = generateKV(list,"month").filter(kv => kv[1] < 0);
    var monthSpent = spendings
    .filter(kv => kv[0] == today)
    .reduce((sum, kv) => sum += Math.abs(kv[1]), 0);
    var months = new Set(spendings.map(kv => kv[0]));
    var monthAvg = spendings.reduce((sum, kv) => sum += Math.abs(kv[1]), 0) / months.size;

    $("#current").text(current);
    $("#month-spent").text(monthSpent);
    $("#month-avg").text(monthAvg);
}