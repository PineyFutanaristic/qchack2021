let command, data;
let button;
let event_list = [];
let reset_button;
let not_button;
let cnot_button;
let and_button;
// let gd = false;
function setup() {
  createCanvas(800, 800);
  command = createInput('');
  command.position(100, 0);
  command.size(80);
  command.input(myInputEvent);
  not_button = createButton('add NOT');
  not_button.position(400, 0);
  not_button.mousePressed(wait_add_NOT);
  not_button = createButton('add CNOT');
  not_button.position(200, 0);
  not_button.mousePressed(wait_add_CNOT);
  reset_button = createButton('reset');
  reset_button.position(500, 0);
  reset_button.mousePressed(fully_reset);
  and_button = createButton('add AND');
  and_button.position(300, 0);
  and_button.mousePressed(wait_add_AND);
}

function wait_add_AND() {
  let query = command.value().split(" ");
  let target = parseInt(query[0]);
  let list_of_and = [];
  for (let i = 1; i < query.length; i ++)
      list_of_and.push(parseInt(query[i]));
  add_AND(list_of_and, target);
}

function wait_add_CNOT() {
  let query = command.value().split(" ");
  add_CNOT(parseInt(query[0]), parseInt(query[1]));
}

function wait_add_NOT() {
  add_NOT(parseInt(command.value()));
}
function fully_reset() {
  event_list = [];
  // qubits_count = 8;
}

function apply_change() {
  
}

function myInputEvent() {
  return this.value();
  // console.log('you are typing: ', this.value());
}

let qubits_count = 8, event_count = 0;
let bit_val = [0, 0, 0, 0, 0, 0, 0, 0];

function add_qubits() {
  qubits_count ++;
}

function remove_qubits() {
  qubits_count --;
}

function get_y_coor(nth_line) { // 0 indexed
  return 50 + nth_line * 40;
}

function get_x_event(nth_event) {
  return 135 + nth_event * 30;
}

function draw_a_line(nth_line) {
  strokeWeight(4);
  stroke("black");
  let y_coor = get_y_coor(nth_line);
  line(120, y_coor, 600, y_coor);
  fill(bit_val[nth_line] * 255);
  rect(80, y_coor - 25, 35, 35);
  fill(255 * (1 - bit_val[nth_line]));
  noStroke();
  textSize(32);
  text(bit_val[nth_line].toString(), 87, y_coor + 7);
  fill(0);
  textSize(32);
  text("q" + nth_line.toString(), 20, y_coor);
  return;
}

function draw_output() {
  fill(0);
  let y_coor = get_y_coor(qubits_count) + 20;
  stroke("black");
  strokeWeight(2);
  line(70, y_coor, 600, y_coor);
  line(70, y_coor + 3, 600, y_coor + 3);
  fill(0);
  textSize(32);
  noStroke();
  text("C", 20, y_coor + 4);
}

function draw_NOT(nth_line, nth_event) {
  noStroke();
  temp_val[nth_line] = 1 - temp_val[nth_line];
  let y = get_y_coor(nth_line);
  let x = get_x_event(nth_event);
  fill("green");
  rect(x - 10, y - 10, 20, 20);
}

function draw_CNOT(control, target, nth_event) {
  noStroke();
  if (temp_val[control] == 1) temp_val[target] = 1 - temp_val[target];
  console.log(control, target, nth_event);
  let x = get_x_event(nth_event);
  let y1 = get_y_coor(control);
  let y2 = get_y_coor(target);
  fill("purple");
  rect(x - 10, y1 - 10, 20, 20);
  // rect(x - 10, y2 - 10, 20, 20);
  circle(x , y2, 30);
  stroke("purple");
  line(x, y1 + 10,x , y2 - 10);
  // stroke("white");
  // stroke(220);
  stroke("black");
  // noStroke();
}

function draw_AND(list_of_and, target, nth_event) {
  list_of_and.push(target);
  fill("red");
  let x = get_x_event(nth_event);
  let min_y = 10000, max_y = 0;
  let flag = false;
  for (let i = 0; i < list_of_and.length; i ++) {
    if (temp_val[list_of_and[i]] == 0) flag = true;
    let y = get_y_coor(list_of_and[i]);
    max_y = max(max_y, y);
    min_y = min(min_y, y);
    rect(x - 10, y - 10, 20, 20);
  }
  if (flag == false) temp_val[target] = 1 - temp_val[target];
  stroke("red");
  strokeWeight(4);
  line(x, min_y, x, max_y);
  noStroke();
  circle(x , get_y_coor(target), 30);
}
let temp_val = [0, 0 , 0 ,0 , 0 , 0 , 0 , 0 , 0];
function draw() {
  background(220);
  frameRate(60);
  textSize(15);
  // stroke("black");
  fill("black");
  text("command: ",25, 15);
  for (let i = 0; i < qubits_count; i ++)
      draw_a_line(i);
  // draw_NOT(2, 0);
  // draw_NOT(2, 1);
  // draw_CNOT(3, 5, 2);
  draw_output();
  // let dr_list = [0, 3, 7];
  // draw_AND(dr_list, 5, 5);
  for (let i = 0; i < qubits_count; i ++) {
    temp_val[i] = bit_val[i];
  }
  for (let i = 0; i < event_list.length; i ++) {
    if (event_list[i].type == "NOT") {
      draw_NOT(event_list[i].control, event_list[i].event);
    }
    else if (event_list[i].type == "CNOT") {
      draw_CNOT(event_list[i].control, event_list[i].target, event_list[i].event);
    }
    else if (event_list[i].type == "AND") {
      draw_AND(event_list[i].list_and, event_list[i].target, event_list[i].event);
    }
  }
  for (let i = 0; i < qubits_count; i ++) {
    show_val(i);
  }
}

function show_val(nth_line) {
  strokeWeight(4);
  stroke('black');
  let y_coor = get_y_coor(nth_line);
  // line(120, y_coor, 600, y_coor);
  // fill(bit_val[nth_line] * 255);
  // rect(80, y_coor - 25, 35, 35);
  // fill(255 * (1 - bit_val[nth_line]));
  noStroke();
  textSize(32);
  text(temp_val[nth_line].toString(), 650, y_coor + 7);
  return;
}

function add_NOT(which_bit) {
  if (which_bit >= qubits_count) return;
  console.log(which_bit);
  let kth_event = event_list.length;
  event_list.push({
    type: "NOT",
    control: which_bit,
    event: kth_event
  });
}

function add_CNOT(_control, _target) {
  // console.log(_control);
  // console.log(_target);
  let kth_event = event_list.length;
  event_list.push({
    type: "CNOT",
    control: _control,
    target: _target,
    event: kth_event
  });
}

function add_AND(_list_and, _target) {
  let kth_event = event_list.length;
  event_list.push({
    type: "AND",
    list_and: _list_and,
    target: _target,
    event: kth_event
  });
}

function add_measure(_source, _output) {
  let kth_event = event_list.length;
  event_list.push({
    type: "AND",
    source: _source,
    output: _output,
    event: kth_event
  });
}

function mousePressed() {
  if (mouseX >= 80 && mouseX <= 115) {
    for (let nth = 0; nth < qubits_count; nth ++) {
      let y_coor = get_y_coor(nth);
      if (mouseY >= y_coor - 25 && mouseY <= y_coor + 10)
          bit_val[nth] = 1 - bit_val[nth];
    }
  }
  // console.log(command.value().length);
  
  // let full_command = string(command.value());
  // let commands = command.split(" ");
  // console.log(commands);
}
