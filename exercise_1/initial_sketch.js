console.log('Loading...');

let table;

const canvasWidth = 700;
const canvasHeight = 700;

// https://p5js.org/reference/#/p5/loadTable
function preload() {
  table = loadTable('future_cities_data_truncated.csv', 'csv', 'header');
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  print('All cities:', table.getColumn('current_city'));
}

function draw() {
  background('#bae');
  // print('mouse X: ' + mouseX);
  // print('mouse Y: ' + mouseY);
  let row = int(map(constrain(mouseX, 0, canvasWidth), 0, canvasWidth, 1, table.getRowCount()));
  let column = int(map(constrain(mouseY, 0, canvasHeight), 0, canvasHeight, 1, table.getColumnCount()));
  // print('row no: ' + row);
  // print('column no: ' + column);

  let current_value = table.getString(row-1, column-1);
  
  text(current_value, constrain(mouseX, 20, width-20), constrain(mouseY, 20, height-20));

}
