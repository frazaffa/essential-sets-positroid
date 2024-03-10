"use strict";

/** 
Author: Francesca Zaffalon
Paper: Combinatorics of Essential Sets for Positroids
This project implements Algorithm 1 of the aforementioned paper.
*/
var gridSize = 8;

function emptyMatrix(dummy) {
  emptyArray = [];

  for (var _i = 0; _i < gridSize; _i++) {
    var row = Array(gridSize + 1).fill(dummy);
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

  for (var index = 0; index < lst.length; index++) {
    elem = lst[index];
    label = elem[0];
    i = elem[1] - 1;
    j = elem[2] - 1;
    labelMatrix[i][j] = label;
  }
}

label_to_matrix([[0, 8, 1], [1, 4, 2], [2, 8, 4], [2, 3, 4], [3, 1, 8]]);

function refresh() {
  console.log("refreshing");
  shadingMatrix = emptyMatrix(0);
  labelReadMatrix = emptyMatrix(0); // const labelMatrix = emptyMatrix(-1);

  dottingMatrix = emptyMatrix(0);
  shadeTable();
}

function mylogging(str) {
  var printtime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (printtime) {
    var currentdate = new Date();
    var datetime = "[" + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + "]<br/>";
  } else {
    datetime = "";
  }

  mylogdiv = document.getElementById("logging-div");
  mylogdiv.innerHTML += datetime + str + "<br/>";
  mylogdiv.scrollTop = mylogdiv.scrollHeight;
}

function run() {
  gridSize = document.getElementById("gridSize").value;
  console.log(gridSize); // gridSize = 

  commands = document.getElementById("input-area").value; // mylogging("Running Command:" + commands, true);

  eval("RANKCONDITIONS = " + commands);
  createTable();
  label_to_matrix(RANKCONDITIONS);
  refresh();
} // label_to_matrix([
//     [1,1,4],
//     [1,2,5],
//     [0,3,2],
//     [2,1,8],
// ])


shadingCellOnClickMatrix = null;

function clickedCell(p, q) {
  // when the cell (p,q) is clicked.
  table = document.getElementById("grid-table");
  cell = table.rows[p].cells[q];

  if (shadingCellOnClickMatrix == null) {
    shadingCellOnClickMatrix = emptyMatrix(0);
    shadeRowAndAntiDiagonal(p, q, shadingCellOnClickMatrix);
  } else {
    shadingCellOnClickMatrix = null;
  }

  shadeTable();
}

function createTable() {
  // n is size
  var table = document.getElementById("grid-table");
  table.innerHTML = ""; // delete existing table
  // Loop through each row in the matrices

  var _loop = function _loop(_i2) {
    // Create a table row
    var row = document.createElement('tr'); // Loop through each element in the row

    var _loop2 = function _loop2(_j) {
      // console.log("here");
      // Create a table cell
      var cell = document.createElement('td');
      cell.setAttribute("id", "cell-" + _i2 + "-" + _j);

      cell.onclick = function () {
        console.log("Clicked the cell:" + _i2 + " " + _j);
        clickedCell(_i2, _j);
      }; // Set the class for styling


      if (gridSize > 10) {
        cell.className = 'grid-cell-small';
      } else {
        cell.className = 'grid-cell';
      } // Append the cell to the row


      row.appendChild(cell);
    };

    for (var _j = 0; _j < gridSize + 1; _j++) {
      _loop2(_j);
    }

    table.appendChild(row);
  };

  for (var _i2 = 0; _i2 < gridSize; _i2++) {
    _loop(_i2);
  }
}

DEFAULTBORDERCOLOR = "green";

function shadeTable() {
  if (labelMatrix.length != gridSize || shadingMatrix.length != gridSize) {
    alert("Label/Shading Matrix has wrong size!");
    return;
  } // Loop through each row in the matrices


  for (var _i3 = 0; _i3 < gridSize; _i3++) {
    for (var _j2 = 0; _j2 < gridSize + 1; _j2++) {
      // Create a table cell
      var _cell = document.getElementById("cell-" + _i3 + "-" + _j2); // Set the opacity based on the shading matrix


      if (shadingMatrix[_i3][_j2] != 0) {
        _cell.style.backgroundColor = "rgb(178,190,181)"; // cell.style.borderColor = "black";
      } else {
        _cell.style.backgroundColor = "rgba(242,242,242,255)";
        _cell.style.opacity = 1;
      }

      if (shadingCellOnClickMatrix == null) {
        _cell.classList.remove("border-row");

        _cell.classList.remove("border-anti-diagonal"); // cell.style.borderColor = DEFAULTBORDERCOLOR;

      } else {
        if (shadingCellOnClickMatrix[_i3][_j2] == 1) {
          _cell.classList.add("border-row"); // cell.style.borderColor = "red";

        } else if (shadingCellOnClickMatrix[_i3][_j2] == 2) {
          _cell.classList.add("border-anti-diagonal"); // cell.style.borderColor = "orange";

        } else {
          // cell.style.borderColor = DEFAULTBORDERCOLOR;
          _cell.classList.remove("border-row");

          _cell.classList.remove("border-anti-diagonal");
        }
      }

      _cell.innerText = labelMatrix[_i3][_j2] !== -1 ? labelMatrix[_i3][_j2] : "";

      if (labelReadMatrix[_i3][_j2] != 0) {
        _cell.style.color = "black";
      } else {
        _cell.style.color = "black";
      }

      if (dottingMatrix[_i3][_j2] != 0) {
        _cell.style.color = "black";
        _cell.innerText += '•';
      } else {// Set the label text
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

  for (var _i4 = 0; _i4 < gridSize; _i4++) {
    for (var _j3 = 0; _j3 < gridSize + 1; _j3++) {
      if (labelReadMatrix[_i4][_j3] != 0) {
        continue;
      }

      if (labelMatrix[_i4][_j3] != -1 && labelMatrix[_i4][_j3] <= minElem) {
        minElem = labelMatrix[_i4][_j3];
        minPosition = [_i4, _j3];
      }
    }
  }

  if (minPosition == null) {
    return null;
  }

  labelReadMatrix[minPosition[0]][minPosition[1]] = 1;
  return minPosition;
}

function findMaxLabel() {
  // Returns the position of smallest unshaded label from the shadingMatrix and labelling matrix
  maxElem = 0;
  maxPosition = null;

  for (var _i5 = 0; _i5 < gridSize; _i5++) {
    for (var _j4 = 0; _j4 < gridSize + 1; _j4++) {
      // if (labelReadMatrix[i][j] != 0) {
      //     continue;
      // }
      if (labelMatrix[_i5][_j4] != 0 && labelMatrix[_i5][_j4] >= maxElem) {
        maxElem = labelMatrix[_i5][_j4];
        maxPosition = [_i5, _j4];
      }
    }
  } // if (maxPosition == null){
  //     return null;
  // }
  // // ilabelReadMatrix[maxPosition[0]][maxPosition[1]] = 1;


  return maxPosition;
}

function findDotsInTriangleOnLeftBottom(p, q) {
  // console.log("new call! "  + p + " " + q);
  numDots = 0;

  for (var _count = p; _count <= p + q; _count++) {
    for (var _j5 = 0; _j5 < gridSize + 1; _j5++) {
      if (_count + _j5 > p + q) {
        break;
      }

      rowNum = _count % gridSize;
      console.log('Row Num:', rowNum); // console.log("Find Dotting Call to Cell " + i + " " + j); 

      if (dottingMatrix[rowNum][_j5] != 0) {
        numDots += 1;
      }
    }
  }

  return numDots;
}

function shadeRowAndAntiDiagonal(p, q, myMatrix) {
  // console.log(shadingMatrix);
  for (var _j6 = 0; _j6 < gridSize + 1; _j6++) {
    myMatrix[p][_j6] = 2; // 2 is for ROW elements
    // the antidiagonal: formula => for column C, the row number is ((p+q) - C) mod (gridSize + 1) 

    row_num = p + q - _j6;

    if (row_num < 0) {
      row_num += gridSize; // add
    }

    if (row_num >= gridSize) {
      row_num -= gridSize;
    } // console.log(row_num);


    myMatrix[row_num][_j6] = 1; // 1 is for ANTI DIAGONAL elements
  }
}

function progress() {
  position = smallestUnseenLabelPos();

  if (position == null) {
    // done with processing labels.
    progress_2();
    return;
  }

  mylogging("Smallest Unseen Label Position: " + position);
  ind_i = position[0];
  ind_j = position[1];
  labelValue = labelMatrix[ind_i][ind_j];
  numDots = findDotsInTriangleOnLeftBottom(ind_i, ind_j);
  mylogging("Number of Dots in the Triangle on Left Bottom: " + numDots);
  a = ind_j + 1 - labelValue - numDots;
  count = 0;

  while (a > 0) {
    my_row = findFirstNonFilledRowStartingFrom(ind_i);
    mylogging("First Empty Row Index: " + my_row);

    if (my_row == null) {
      alert("No empty row found for label position: (" + i + " " + j + ").");
    } // console.log("My Row" + my_row);


    my_dot_col = findColumnForDotting(my_row, labelValue);
    dottingMatrix[my_row][my_dot_col] = 1;
    shadeRowAndAntiDiagonal(my_row, my_dot_col, shadingMatrix);
    shadeTable();
    numDots = findDotsInTriangleOnLeftBottom(ind_i, ind_j);
    b = ind_j + 1 - labelValue - numDots; // if (a > 0) {

    mylogging("Value of a (= j + 1 - labelValue - numDots): " + a); // }

    if (a == b) {
      error_exit();
      return;
    }

    a = b;
  }

  mylogging("<hr/>");
  shadeTable(); // alert("Progress");
}

function check() {
  for (var _i6 = 0; _i6 < gridSize; _i6++) {
    for (var _j7 = 0; _j7 < gridSize + 1; _j7++) {
      // Create a table cell
      var _cell2 = document.getElementById("cell-" + _i6 + "-" + _j7); // Set the opacity based on the shading matrix


      if (shadingMatrix[_i6][_j7] == 0) {
        alert("Grid is not fully shaded!");
        mylogging("Check Failed: Grid is not fully shaded!");
        return; // cell.style.borderColor = "black";
      }
    }
  }

  error = false;
  mylogging("Grid is fully shaded - ✅");

  for (var _i7 = 0; _i7 < gridSize; _i7++) {
    for (var _j8 = 0; _j8 < gridSize + 1; _j8++) {
      if (labelMatrix[_i7][_j8] != -1) {
        labelValue = labelMatrix[_i7][_j8];
        numDots = findDotsInTriangleOnLeftBottom(_i7, _j8);
        a = _j8 + 1 - labelValue - numDots;

        if (a == 0) {
          mylogging("Label (" + (_i7 + 1) + "," + (_j8 + 1) + "): ✅");
        } else {
          mylogging("Label (" + (_i7 + 1) + "," + (_j8 + 1) + "): ❌");
          error = true;
        }
      }
    }
  }

  if (error) {
    error_exit();
    return;
  } // alert("All check Successful!");


  mylogging("Check Passed");
}

function error_exit() {
  alert("E^r is not valid");
  mylogging("Invalid E^r. Refreshing...");
  refresh();
}

function progress_2() {
  position = findMaxLabel();
  console.log(position);
  maxLabel = labelMatrix[position[0]][position[1]];
  console.log(maxLabel);
  empty_row = findFirstNonFilledRowStartingFrom(0);

  if (empty_row == null) {
    mylogging("All rows filled!");
    return;
  }

  my_dot_col = findColumnForDotting(empty_row, maxLabel);
  mylogging("Found column" + my_dot_col + " for row " + empty_row);

  if (my_dot_col == null) {
    error_exit();
    return;
  }

  console.log("Empty row: ", empty_row);
  console.log("My Dot col:", my_dot_col);
  dottingMatrix[empty_row][my_dot_col] = 1;
  labelReadMatrix[empty_row][my_dot_col] = 1;
  shadeRowAndAntiDiagonal(empty_row, my_dot_col, shadingMatrix);
  shadeTable();
}

function findColumnForDotting(row_num, label_value) {
  for (var _j9 = 0; _j9 < gridSize + 1; _j9++) {
    if (_j9 - findDotsInTriangleOnLeftBottom(row_num, _j9) == label_value) {
      // we found the cell
      return row_num, _j9;
    }
  }

  return null;
}

function findFirstNonFilledRowStartingFrom(row_num) {
  // returns the first row that is not fully shaded starting from the row_num (including row_num)
  for (var _count2 = 0; _count2 < gridSize; _count2++) {
    i = (_count2 + row_num) % gridSize;

    for (var _j10 = 0; _j10 < gridSize + 1; _j10++) {
      // console.log("checking non-filled cell " + i + " " + j);
      if (shadingMatrix[i][_j10] == 0) {
        // console.log("Found unshaded!");
        return i;
      }
    }
  }

  return null;
}

createTable();
shadeTable();