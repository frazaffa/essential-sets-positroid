/** 
Author: Francesca Zaffalon
Paper: Combinatorics of Essential Sets for Positroids
This project implements Algorithm 1 of the aforementioned paper.
*/

var gridSize = 8;

function emptyMatrix(dummy){
    emptyArray = [];
    for (let i = 0; i < gridSize; i++) {
        const row = Array(gridSize+1).fill(dummy);
        emptyArray.push(row);
    }
    return emptyArray;
}

shadingMatrix = emptyMatrix(0);
labelReadMatrix = emptyMatrix(0);
labelMatrix = emptyMatrix(-1);
dottingMatrix = emptyMatrix(0);

function label_to_matrix(lst) {
    labelMatrix = emptyMatrix(-1);
    for (let index = 0; index < lst.length; index++) {
        elem = lst[index];
        label = elem[0];
        i = elem[1] - 1;
        j = elem[2] - 1;
        labelMatrix[i][j] = label;
    }
}

label_to_matrix([
    [1,5,2],
    [2,1,4],
    [2,4,4],
    [3,1,8],
])

function refresh() {
    console.log("refreshing");
    shadingMatrix = emptyMatrix(0);
    labelReadMatrix = emptyMatrix(0);
    // const labelMatrix = emptyMatrix(-1);
    dottingMatrix = emptyMatrix(0);
    shadeTable();
}

function mylogging(str, printtime=false) {

    if (printtime) {
    var currentdate = new Date(); 
    var datetime = "[" + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds()
                + "]<br/>";
    }
    else {
        datetime = "";
    }
    mylogdiv = document.getElementById("logging-div");
    mylogdiv.innerHTML += datetime + str + "<br/>";
    mylogdiv.scrollTop = mylogdiv.scrollHeight;
}


function run() {
    commands = document.getElementById("input-area").value;
    mylogging("Running Command:" + commands, true);
    eval(commands);
    refresh();
    
}
// label_to_matrix([
//     [1,1,4],
//     [1,2,5],
//     [0,3,2],
//     [2,1,8],
// ])

shadingCellOnClickMatrix = null;

function clickedCell(p,q) {
    // when the cell (p,q) is clicked.
    table = document.getElementById("grid-table");
    cell = table.rows[p].cells[q];

    if (shadingCellOnClickMatrix == null) {
        shadingCellOnClickMatrix = emptyMatrix(0);
        shadeRowAndAntiDiagonal(p,q,shadingCellOnClickMatrix);
    }
    else {
        shadingCellOnClickMatrix = null;
    }
    shadeTable();
}
function createTable() {
    // n is size

    const table = document.getElementById("grid-table");
    table.innerHTML = ""; // delete existing table

    // Loop through each row in the matrices
    for (let i = 0; i < gridSize; i++) {
        // Create a table row
        const row = document.createElement('tr');

        // Loop through each element in the row
        for (let j = 0; j < gridSize+1; j++) {

            // console.log("here");
            // Create a table cell
            const cell = document.createElement('td');
            cell.setAttribute("id", "cell-"+i+"-"+j);
            cell.onclick = function () {
                console.log("Clicked the cell:" + i + " " + j);
            clickedCell(i,j);
            }
            // Set the class for styling
            if (gridSize > 10) {
                cell.className = 'grid-cell-small';
            }
            else {
                cell.className = 'grid-cell';
            }
            
            // Append the cell to the row
            row.appendChild(cell);
        }

        table.appendChild(row);
    }
}

DEFAULTBORDERCOLOR = "green";

function shadeTable() {

    if (labelMatrix.length != gridSize || shadingMatrix.length != gridSize) {
        alert("Label/Shading Matrix has wrong size!");
        return;
    }
    // Loop through each row in the matrices
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize+1; j++) {

            // Create a table cell
            const cell = document.getElementById("cell-"+i+"-"+j);
            // Set the opacity based on the shading matrix
            if (shadingMatrix[i][j] != 0){
                cell.style.backgroundColor = "rgb(178,190,181)";
                // cell.style.borderColor = "black";
            }
            else {
                cell.style.backgroundColor = "rgba(242,242,242,255)"
                cell.style.opacity = 1;
            }

            if (shadingCellOnClickMatrix == null) {
                cell.classList.remove("border-row");
                cell.classList.remove("border-anti-diagonal");
                // cell.style.borderColor = DEFAULTBORDERCOLOR;
            }

            else {
                if (shadingCellOnClickMatrix[i][j] == 1){
                    cell.classList.add("border-row");
                    // cell.style.borderColor = "red";
                    }
                else if (shadingCellOnClickMatrix[i][j] == 2){
                    cell.classList.add("border-anti-diagonal");
                    // cell.style.borderColor = "orange";
                    }
                else {
                        // cell.style.borderColor = DEFAULTBORDERCOLOR;
                        cell.classList.remove("border-row");
                        cell.classList.remove("border-anti-diagonal");
                }
            }

            cell.innerText = labelMatrix[i][j] !== -1 ? labelMatrix[i][j] : "";


            if (labelReadMatrix[i][j] != 0){
                cell.style.color = "black";
            }
            else {
                cell.style.color = "black";            
            }

            if (dottingMatrix[i][j] != 0 ) {
                cell.style.color = "black";
                cell.innerText += '•';
                
            }
            else {
                // Set the label text
                // cell.style.color = "black";
                // cell.innerText = labelMatrix[i][j] !== -1 ? labelMatrix[i][j] : '';
            }
        }
    }
}

function smallestUnseenLabelPos() {
    // Returns the position of smallest unshaded label from the shadingMatrix and labelling matrix


    minElem = 10000;
    minPosition = null;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize+1; j++) {
            if (labelReadMatrix[i][j] != 0) {
                continue;
            }
            if (labelMatrix[i][j] != -1 && labelMatrix[i][j] <= minElem) {
                minElem = labelMatrix[i][j];
                minPosition = [i,j];
            }
        }
    }
    
    if (minPosition == null){
        return null;
    }
    labelReadMatrix[minPosition[0]][minPosition[1]] = 1;
    return minPosition;    
}

function findMaxLabel() {
    // Returns the position of smallest unshaded label from the shadingMatrix and labelling matrix


    maxElem = 0;
    maxPosition = null;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize+1; j++) {
            // if (labelReadMatrix[i][j] != 0) {
            //     continue;
            // }
            if (labelMatrix[i][j] != 0 && labelMatrix[i][j] >= maxElem) {
                maxElem = labelMatrix[i][j];
                maxPosition = [i,j];
            }
        }
    }
    
    // if (maxPosition == null){
    //     return null;
    // }
    // // ilabelReadMatrix[maxPosition[0]][maxPosition[1]] = 1;
    return maxPosition;    
}
function findDotsInTriangleOnLeftBottom(p,q){
    // console.log("new call! "  + p + " " + q);
    numDots = 0;
    for (let count = p; count <= p+q; count++) {
        for (let j = 0; j < gridSize+1; j++) {
            if (count + j > p + q) {
                break;
            }
            
            rowNum = count%gridSize;
            console.log('Row Num:', rowNum);
            // console.log("Find Dotting Call to Cell " + i + " " + j); 
            if (dottingMatrix[rowNum][j] != 0) {
                numDots += 1;
            }
        }
    }
    return numDots;
}

function shadeRowAndAntiDiagonal(p, q, myMatrix) {
    // console.log(shadingMatrix);
    for (let j = 0; j < gridSize+1; j++){
        myMatrix[p][j] = 2; // 2 is for ROW elements
        // the antidiagonal: formula => for column C, the row number is ((p+q) - C) mod (gridSize + 1) 
        row_num = (p + q) - j;
        if (row_num < 0) {
            row_num += gridSize; // add
        }
        if (row_num >= gridSize) {
            row_num -= gridSize;
        }
        // console.log(row_num);
        myMatrix[row_num][j] = 1; // 1 is for ANTI DIAGONAL elements
    }
}


function progress() {
    position = smallestUnseenLabelPos();
    if (position == null){
        // done with processing labels.
        return progress_2();
    }
    mylogging("Smallest Unseen Label Position: " + position);
    ind_i = position[0];
    ind_j = position[1];
    labelValue = labelMatrix[ind_i][ind_j];
    numDots = findDotsInTriangleOnLeftBottom(ind_i, ind_j);
    mylogging("Number of Dots in the Triangle on Left Bottom: " + numDots);
    a = ind_j + 1 - labelValue - numDots;
    count = 0;
    while (a>0){
        my_row = findFirstNonFilledRowStartingFrom(ind_i);
        mylogging("First Empty Row Index: " + my_row);
        if (my_row == null){
            alert("No empty row found for label position: (" + i + " " + j + ").");
        }
        // console.log("My Row" + my_row);
        my_dot_col = findColumnForDotting(my_row, labelValue);
    
        dottingMatrix[my_row][my_dot_col] = 1;
        shadeRowAndAntiDiagonal(my_row, my_dot_col, shadingMatrix);
        shadeTable();
        numDots = findDotsInTriangleOnLeftBottom(ind_i, ind_j);
        b = ind_j + 1 - labelValue - numDots;
        // if (a > 0) {
        mylogging("a = " + a);
        // }
        if (a == b) {
            error_exit();
            return -1;
        }
        a = b;

    }

    mylogging("<hr/>")
    shadeTable();
    return 0;
    // alert("Progress");

}

function check() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize+1; j++) {

            // Create a table cell
            const cell = document.getElementById("cell-"+i+"-"+j);
            // Set the opacity based on the shading matrix
            if (shadingMatrix[i][j] == 0){
                mylogging("Check Failed: Grid is not fully shaded!");
                return;
                // cell.style.borderColor = "black";
            }
        }
    }

    error = false;
    mylogging("Grid is fully shaded - ✅");
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize+1; j++) {
            if (labelMatrix[i][j] != -1) {
                labelValue = labelMatrix[i][j];
                numDots = findDotsInTriangleOnLeftBottom(i, j);
                a = j + 1 - labelValue - numDots;
                if (a == 0) {
                    mylogging("Label (" + (i+1) + "," + (j+1) + "): ✅");
                }
                else {
                    mylogging("Label (" + (i+1) + "," + (j+1) + "): ❌");
                    error = true;
                }
            }
        }
    }

    if (error) {
        error_exit();
        return;
    }

    // alert("All check Successful!");
    mylogging("Check Passed");
}

function auto_run() {
    res = 0;
    while (res == 0) {
        res = progress();
    }

    check();
}

function error_exit() {
    alert("E^r is not valid");
    mylogging("Invalid E^r. Refreshing...");
    refresh();
}


function progress_2(){
    position = findMaxLabel();
    console.log(position);
    maxLabel = labelMatrix[position[0]][position[1]];
    console.log(maxLabel);
    empty_row = findFirstNonFilledRowStartingFrom(0);

    if (empty_row == null) {
        mylogging("All rows filled!");
        return 10;
    }
    my_dot_col = findColumnForDotting(empty_row, maxLabel);
    mylogging("Found column #" + (my_dot_col + 1) + " for row #" + (empty_row + 1));
    if (my_dot_col == null) {
        error_exit();
        return -1;
    }

    console.log("Empty row: ", empty_row);
    console.log("My Dot col:", my_dot_col);
    dottingMatrix[empty_row][my_dot_col] = 1;
    labelReadMatrix[empty_row][my_dot_col] = 1;
    shadeRowAndAntiDiagonal(empty_row, my_dot_col, shadingMatrix);
    shadeTable();
    return 0;

}

function findColumnForDotting(row_num, label_value) {
    for (let j = 0; j < gridSize+1; j++){
        if (j - findDotsInTriangleOnLeftBottom(row_num, j) == label_value) {
            // we found the cell
            return (row_num, j);
        }
    }
    return null;
} 

function findFirstNonFilledRowStartingFrom(row_num) {
    // returns the first row that is not fully shaded starting from the row_num (including row_num)
    for (let count = 0; count < gridSize; count++) {
        i = (count + row_num)%gridSize;
        for (let j = 0; j < gridSize+1; j++) {
            // console.log("checking non-filled cell " + i + " " + j);
            if (shadingMatrix[i][j] == 0){
                // console.log("Found unshaded!");
                return i;
            }
        }
    }
    return null;
}


createTable();
shadeTable();