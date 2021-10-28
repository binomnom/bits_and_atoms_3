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
  let mouse_pos = createVector(mouseX, mouseY);

  //find the right city

  // find the right data point (now/future)

  //create forms

  //draw them
}