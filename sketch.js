console.log('Loading...');

// parameters to play with
const canvasWidth = 850;
const canvasHeight = 850;
const safe_border = 20;

const full_fade = 255;
const fade_window = 40;
const min_radius = 140;
const max_points = 60;

// internal variables
let table;
let temp_min_value;
let temp_max_value;


function preload() {
  table = loadTable('future_cities_data_truncated.csv', 'csv', 'header');
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  textAlign(CENTER, CENTER);
  textSize(24);
  noStroke();

  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  print('All cities:', table.getColumn('current_city'));
  print('finding min and max temperatures in dataset...')

  let now_temp_min_value = min(table.getColumn('Annual_Mean_Temperature'));
  let now_temp_max_value = max(table.getColumn('Annual_Mean_Temperature'));
  let future_temp_min_value = min(table.getColumn('future_Annual_Mean_Temperature'));
  let future_temp_max_value = max(table.getColumn('future_Annual_Mean_Temperature'));

  temp_min_value = min(now_temp_min_value, future_temp_min_value);
  temp_max_value = max(now_temp_max_value, future_temp_max_value);

  print(
    'min temperature now: ', now_temp_min_value, '\n',
    'max temperature now: ', now_temp_max_value, '\n',
    'future min temperature: ', future_temp_min_value, '\n',
    'future max temperature: ', future_temp_max_value
  );
}

function draw() {
  background('#bae');
  translate(canvasWidth / 2, canvasHeight / 2);

  // get mouse position constrained to a safe zone
  let mouse_pos = processed_mouse_pos();

  // find the right city
  let index = int(map(mouse_pos.y, safe_border, canvasHeight - safe_border, 0, table.getRowCount() - 1));
  let city = table.get(index, 'current_city');

  // find the right fade between data points (now/future)
  let fade_value = int(map(mouse_pos.x, (canvasWidth - fade_window) / 2, (canvasWidth + fade_window) / 2, 0, full_fade));

  // calculate polygon details
  let now_temp = table.get(index, 'Annual_Mean_Temperature');
  let future_temp = table.get(index, 'future_Annual_Mean_Temperature');
  let num_points_now = int(map(now_temp, temp_min_value, temp_max_value, 3, max_points));
  let num_points_future = int(map(future_temp, temp_min_value, temp_max_value, 3, max_points));

  // draw them
  fill(207, 231, 49, 255 - fade_value);
  polygon(0, 0, min_radius + min_radius * (now_temp / temp_max_value), num_points_now);

  fill(231, 207, 23, fade_value);
  polygon(0, 0, min_radius + min_radius * (now_temp / temp_max_value), num_points_future);

  // add city name as label
  fill(0);
  text(city, 0, 0);
}

// taken from https://p5js.org/examples/form-regular-polygon.html
function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function processed_mouse_pos() {
  let result = createVector(mouseX, mouseY);
  result.x = constrain(result.x, (canvasWidth - fade_window) / 2, (canvasWidth + fade_window) / 2);
  result.y = constrain(result.y, safe_border, canvasHeight - safe_border);
  return result;
}