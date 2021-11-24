import RankManager from "./regist";
import './jquery-3.6.0';

var rankSheet = document.getElementById('rank-sheet');
var gameCanvas = document.getElementById('game-box');
var openChart = document.getElementById('open-chart');
var rankMng = new RankManager();

var childNum = 0;
var isOpen = false;
var isClose = true;
var count = 1;

openChart.addEventListener('click', open_close);

function open_close() {
    if (!isOpen && isClose) {
        isOpen = true;
        isClose = false;
        rankSheet.style.display = 'block';
        gameCanvas.style.display = 'none';
        rankTable();
    }
    else if (isOpen && !isClose) {
        isOpen = false;
        isClose = true;
        childNum = 0;
        count = 1;
        cleanList();
        rankSheet.style.display = 'none';
        gameCanvas.style.display = 'block';
    }
}

function cleanList() {
    while (rankSheet.childElementCount != 1) {
        rankSheet.removeChild(rankSheet.childNodes[1]);
    }
}

function createList(name, score) {
    if (childNum < 10) {
        childNum++;
        let list = document.createElement('li');
        rankSheet.appendChild(list);

        list.innerText = count++ + '. ' + name + ' ' + score + 'm';
    }
    else {
        return;
    }
    if (rankSheet.childElementCount > 4) {
        rankSheet.childNodes[1].style.backgroundColor = 'gold';
        rankSheet.childNodes[2].style.backgroundColor = 'silver';
        rankSheet.childNodes[3].style.backgroundColor = 'SaddleBrown';
    }
}

function rankTable() {
    async function getRank() {
        var rankData = await rankMng.getData();
        rankData.forEach(i => {
            createList(i.name, i.score);
        });
    } getRank();

}

