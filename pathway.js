const grid = document.getElementById("grid");
const colCountInput = document.getElementById("colCount");
const rowCountInput = document.getElementById("rowCount");
const startXThing = document.getElementById("startPointX");
const startYThing = document.getElementById("startPointY");
const endXThing = document.getElementById("endPointX");
const endYThing = document.getElementById("endPointY");
const algorithmSelect = document.getElementById("algorithm");
const createGridButton = document.getElementById("createGridButton");
const setPointsButton = document.getElementById("setPointsButton");
const startSearchButton = document.getElementById("startSearchButton");
const resetButton = document.getElementById("resetButton");



let columnCount = 10;
let rowCount = 10;
let startPoint = { x: 1, y: 1 };
let endPoint = { x: 10, y: 10 };



createGridButton.addEventListener("click", () => {
   columnCount = parseInt(colCountInput.value, 10) || columnCount;
   rowCount = parseInt(rowCountInput.value, 10) || rowCount;
   colCountInput.value = columnCount;
   rowCountInput.value = rowCount;
   startPoint.x = 1;
   startPoint.y = 1;
   endPoint.x = columnCount;
   endPoint.y = rowCount;
   startXThing.value = startPoint.x;
   startYThing.value = startPoint.y;
   endXThing.value = endPoint.x;
   endYThing.value = endPoint.y;
   buildGrid();
});



setPointsButton.addEventListener("click", () => {
   const newStartX = parseInt(startXThing.value, 10);
   const newStartY = parseInt(startYThing.value, 10);
   const newEndThingyx = parseInt(endXThing.value, 10);
   const newEndThingyy = parseInt(endYThing.value, 10);



   if (validCells(newStartX, newStartY) && validCells(newEndThingyx, newEndThingyy)) {
       if (newStartX === newEndThingyx && newStartY === newEndThingyy) {
           alert("startpoint and endpoint cant be the same");
           return;
       }
       startPoint = { x: newStartX, y: newStartY };
       endPoint = { x: newEndThingyx, y: newEndThingyy };
       clearSearchColors();
       buildGrid(true);
   } else {
       alert("coordinates must be within grid.");
   }
});



startSearchButton.addEventListener("click", () => {
   clearSearchColors();
   runBreadthFirstSearch();
});



resetButton.addEventListener("click", () => {
   resetWalls();
});



function validCells(x, y) {
   return x >= 1 && x <= columnCount && y >= 1 && y <= rowCount;
}



function buildGrid(keepWalls = false) {
   const wallCells = new Set();
   if (keepWalls) {
       const currentCells = grid.querySelectorAll("td");
       currentCells.forEach((cell) => {
           if (cell.dataset.blocked === "true") {
               wallCells.add(`${cell.dataset.x},${cell.dataset.y}`);
           }
       });
   }
   grid.innerHTML = "";
   for (let y = 1; y <= rowCount; y++) {
       const row = document.createElement("tr");
       for (let x = 1; x <= columnCount; x++) {
           const cell = document.createElement("td");
           cell.dataset.x = x;
           cell.dataset.y = y;
           const isWall = keepWalls && wallCells.has(`${x},${y}`);
           cell.dataset.blocked = isWall ? "true" : "false";
           cell.className = "";


           if (x === startPoint.x && y === startPoint.y) {
               cell.classList.add("start");
               cell.dataset.role = "start";
               cell.dataset.blocked = "false";
           } else if (x === endPoint.x && y === endPoint.y) {
               cell.classList.add("goal");
               cell.dataset.role = "goal";
               cell.dataset.blocked = "false";
           } else if (isWall) {
               cell.classList.add("wall");
               cell.dataset.role = "cell";
           } else {
               cell.dataset.role = "cell";
           }
           cell.addEventListener("click", () => {
               if (cell.dataset.role === "start" || cell.dataset.role === "goal") {
                   return;
               }
               const isBlocked = cell.dataset.blocked === "true";
               cell.dataset.blocked = isBlocked ? "false" : "true";
               cell.classList.toggle("wall", !isBlocked);
           });
           row.appendChild(cell);
       }
       grid.appendChild(row);
   }
}



function clearSearchColors() {
   const cells = grid.querySelectorAll("td");
   cells.forEach((cell) => {
       if (cell.dataset.role === "cell") {
           cell.classList.remove("visited", "path");
           if (cell.dataset.blocked === "false") {
               cell.classList.remove("wall");
           }
       }
   });
   markStartGoal();
}



function markStartGoal() {
   const cells = grid.querySelectorAll("td");
   cells.forEach((cell) => {
       const x = parseInt(cell.dataset.x, 10);
       const y = parseInt(cell.dataset.y, 10);
       if (x === startPoint.x && y === startPoint.y) {
           cell.className = "start";
           cell.dataset.role = "start";
           cell.dataset.blocked = "false";
       } else if (x === endPoint.x && y === endPoint.y) {
           cell.className = "goal";
           cell.dataset.role = "goal";
           cell.dataset.blocked = "false";
       } else {
           if (cell.dataset.blocked === "true") {
               cell.className = "wall";
               cell.dataset.role = "cell";
           } else {
               cell.className = "";
               cell.dataset.role = "cell";
           }
       }
   });
}



function resetWalls() {
   const cells = grid.querySelectorAll("td");
   cells.forEach((cell) => {
       if (cell.dataset.role === "cell") {
           cell.dataset.blocked = "false";
           cell.className = "";
       }
   });
   markStartGoal();
}



function getCell(x, y) {
   return grid.querySelector(`td[data-x='${x}'][data-y='${y}']`);
}



function runBreadthFirstSearch() {
   const startKey = `${startPoint.x},${startPoint.y}`;
   const goalKey = `${endPoint.x},${endPoint.y}`;
   const queue = [startKey];
   const visitedSet = new Set([startKey]);
   const parent = {};
   const visitedOrder = [];
   while (queue.length > 0) {
       const current = queue.shift();
       const [cx, cy] = current.split(",").map(Number);
       if (current === goalKey) {
           break;
       }
       const directions = [
           { dx: 1, dy: 0 },
           { dx: -1, dy: 0 },
           { dx: 0, dy: 1 },
           { dx: 0, dy: -1 },
       ];
       for (const { dx, dy } of directions) {
           const nx = cx + dx;
           const ny = cy + dy;
           const nextKey = `${nx},${ny}`;
           if (!validCells(nx, ny) || visitedSet.has(nextKey)) {
               continue;
           }
           const neighbor = getCell(nx, ny);
           if (!neighbor || neighbor.dataset.blocked === "true") {
               continue;
           }
           visitedSet.add(nextKey);
           parent[nextKey] = current;
           queue.push(nextKey);
           visitedOrder.push(nextKey);
       }
   }
   animateSearch(visitedOrder, parent, goalKey);
}
function animateSearch(visitedOrder, parent, goalKey) {
   visitedOrder.forEach((key) => {
       const [x, y] = key.split(",").map(Number);
       const cell = getCell(x, y);
       if (cell && cell.dataset.role === "cell") {
           cell.classList.add("visited");
       }
   });
   const path = restorePath(parent, goalKey);
   path.forEach((key) => {
       const [x, y] = key.split(",").map(Number);
       const cell = getCell(x, y);
       if (cell && cell.dataset.role === "cell") {
           cell.classList.remove("visited");
           cell.classList.add("path");
       }
   });
}




function restorePath(parent, goalKey) {
   const path = [];
   let current = goalKey;
   while (current && parent[current]) {
       if (current === `${startPoint.x},${startPoint.y}`) {
           break;
       }
       path.unshift(current);
       current = parent[current];
   }
   return path;
}



buildGrid();







