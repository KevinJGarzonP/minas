const fieldDiv = document.querySelector("#campo");
const messages = document.querySelector("#mensajes");
const columnsSelector = document.querySelector("#numColumns");
const rowsSelector = document.querySelector("#numRows");
const sideButton = document.querySelector("#createField");
const displayBombs = document.querySelector("#bombNumber");
const reloadButton = document.querySelector("#reload");
const instructions = document.querySelector("#instructions");
const instructionsTitle = document.querySelector("#instructionsTitle");

let bombNumber = 0;
let remainingBombs = 0;
let fieldArray= [];
let sectorsOpened = 0;
let numColumns = 0;
let numRows = 0;
let closeBombs = 0;
let freeCells = [];

reloadButton.style.display = "none";
instructions.style.display = "none";

instructionsTitle.addEventListener("click", () => {
	if (instructions.style.display == "none") {
		instructions.style.display = "block";
	} else {
		instructions.style.display = "none";
	}
})

sideButton.addEventListener("click", (event) => {
	event.preventDefault();
	if ((columnsSelector.value > 2 && columnsSelector.value < 11) && rowsSelector.value > 2) {
		numColumns = parseInt(columnsSelector.value);
		numRows = parseInt(rowsSelector.value);
		sideButton.disabled = "true";
		createField(numColumns, numRows);
		gridField(numColumns, numRows);
		maxBombNumber = (numRows * (numColumns - 1));
		bombNumber = Math.floor(numColumns * numRows * 0.15);
		remainingBombs = bombNumber;
		displayBombs.textContent = remainingBombs;		
		defineBombSectors();
	} else {
		alert("Escoge un número de columnas entre 3 y 10 y un número de filas mayor o igual a 3");
	}
})

function createField (columns, rows) {
	for (let i = 0; i < rows; i++) {
		let row = [];
		for (let i = 0; i < columns; i++) {
			let column = document.createElement("button");
			column.className = "sector";
			fieldDiv.appendChild(column);
			row.push(column);
		}
		fieldArray.push(row);
	}
}

function gridField (columns, rows) {
	let gridColumns = "";
	let gridRows = "";
	for (let i = 0; i < columns; i++) {
		gridColumns += "50px ";
		fieldDiv.style.gridTemplateColumns = gridColumns;
	}
	for (let i = 0; i < rows; i++) {
		gridRows += "50px ";
		fieldDiv.style.gridTemplateRows = gridRows;
	}
}

function randomNum (min, max) {
    let number = Math.floor(Math.random() * (max - min + 1) + min);
    return number;
}

function defineBombSectors () {
	let index = 0
	for (index; index < bombNumber; index++) {
    	let bombColumn = randomNum(0, numColumns - 1);
    	let bombRow = randomNum(0, numRows - 1);
    	if (!fieldArray[bombRow][bombColumn].hasAttribute("bomb")) {
    		fieldArray[bombRow][bombColumn].setAttribute("bomb", true);
    	} else {
        	index--;
    	}
	}
	activateField();
}

function activateField () {
	fieldArray.forEach((row, indexR) => {
		row.forEach((element, indexC) => {
			let hint = "";
    		element.addEventListener("click", () => {
    			
        		element.classList.toggle("clicked");
        		if (element.getAttribute("bomb") == "true") {
            		element.textContent = "💣";
            		element.style.color = "rgb(0, 0, 0, 1)";
    				element.style.fontSize = "1.5rem";
            		gameOver();
        		} else {
            		sectorsOpened++;
            		hint = findCloseBombs(element, indexC, indexR);
            		if (hint == 0) {
            			hint = "";
            		}
            		element.textContent = hint;
            		element.style.color = "rgb(0, 0, 0, 1)";
    				element.style.fontSize = "1.5rem";
            		checkWin();
        		}
        		
        		element.disabled = "true";
    		})
    		element.addEventListener("contextmenu", (event) => {
    			event.preventDefault();
    			if (element.textContent == "🚩") {
    				element.textContent = "";
    			} else {
    				element.textContent = "🚩";
    			}
    			element.style.color = "rgb(250, 250, 250, 1)";
    			element.style.fontSize = "1.5rem";
    		})
		})
    	    
	});
}

function gameOver() {
    fieldArray.forEach((row) => {
    	row.forEach((element) => {
    		if (element.getAttribute("bomb") == "true") {
            		element.textContent = "💣";
            		element.style.color = "rgb(0, 0, 0, 1)";
    				element.style.fontSize = "1.5rem";
    		}
    		element.classList.toggle("blocked");
        	element.disabled = "true";
    	})
    })
    let LoseMessage = document.createElement("p");
    LoseMessage.innerHTML = "¡Booom! Has perdido el juego.";
    messages.innerText = "";
    messages.appendChild(LoseMessage);
	reloadButtonAppears();
}

function evaluateCell (cellCoordinates) {
	if (fieldArray[cellCoordinates[1]][cellCoordinates[0]].getAttribute("bomb") == "true") {
		closeBombs++;
	}
}

function existenceCell (cellCoordinates) {
	if (fieldArray[cellCoordinates[1]]) {
		if (fieldArray[cellCoordinates[1]][cellCoordinates[0]]) {
			return true;
		}
	}
}

function clearCells (cellCoordinates) {
	if (fieldArray[cellCoordinates[1]][cellCoordinates[0]].className != "sector clicked") {
		fieldArray[cellCoordinates[1]][cellCoordinates[0]].click();	
	}
}


function findCloseBombs (button, keyColumn, keyRow) {
	
	closeBombs = 0;
	freeCells = [];
	
    let northCell = [keyColumn, keyRow - 1];
    let southCell = [keyColumn, keyRow + 1];
    let eastCell = [keyColumn + 1, keyRow];
    let westCell = [keyColumn - 1, keyRow];
    let northEastCell = [keyColumn + 1, keyRow - 1];
    let northWestCell = [keyColumn - 1, keyRow - 1];
    let southEastCell = [keyColumn + 1, keyRow + 1];
    let southWestCell = [keyColumn - 1, keyRow + 1];
    
    if (!button.hasAttribute("bomb")) {
    	if (existenceCell(northCell)) {
    		evaluateCell(northCell);
    		freeCells.push(northCell);
    	}
    	if (existenceCell(southCell)) {
    		evaluateCell(southCell);
    		freeCells.push(southCell);
    	}
    	if (existenceCell(eastCell)) {
    		evaluateCell(eastCell);
    		freeCells.push(eastCell);
    	}
    	if (existenceCell(westCell)) {
    		evaluateCell(westCell);
    		freeCells.push(westCell);
    	}
    	if (existenceCell(northEastCell)) {
    		evaluateCell(northEastCell);
    		freeCells.push(northEastCell);
    	}
    	if (existenceCell(northWestCell)) {
    		evaluateCell(northWestCell);
    		freeCells.push(northWestCell);
    	}
    	if (existenceCell(southEastCell)) {
    		evaluateCell(southEastCell);
    		freeCells.push(southEastCell);
    	}
    	if (existenceCell(southWestCell)) {
    		evaluateCell(southWestCell);
    		freeCells.push(southWestCell);
    	}
    	
    	
    	if (closeBombs == 0) {
    		button.textContent = closeBombs;
    		freeCells.forEach((freeCell) => {
    			clearCells(freeCell);
    		})
    		closeBombs = 0;
    	}
          
        return closeBombs;
    }
}

function checkWin () {
    if ((numColumns * numRows) - bombNumber == sectorsOpened) {
    	fieldArray.forEach((row) => {
    		row.forEach((element) => {
        		element.disabled = "true";
    		})
    	})
        let winMessage = document.createElement("p");
        winMessage.innerHTML = "¡Enhorabuena! Encontraste todos los sectores seguros. Ganaste el juego";
        messages.innerText = "";
        messages.appendChild(winMessage);
        reloadButtonAppears();
    }
}

function reloadButtonAppears () {
	reloadButton.style.display = "block";
	reloadButton.addEventListener("click", () => {
		window.location.reload();
	})
}
