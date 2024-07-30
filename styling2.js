let texts = [];
let z = 1;
let blink = false;
let id = "null";

let connections = [];
let selektiert = [];

let selectedText = null;
let check = false;
let buttons = false;

let inputText = "text";
let typing = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  frameRate(30);
  textSize(32);
  fill(200);
  blink = true;
  typing = true;
  button = createButton("update");
  button.position(0, 100);
  button.mousePressed(checkbuttons);
  button.value(buttons);
  // textAlign(CENTER);
}

function draw() {
  background(0, 50);

  check = false;

  for (let i = 0; i < texts.length; i++) {
    Id = texts[i].id;
    texte = texts[i].text;
    gr = texts[i].textgr;
    // console.log(Id);
    if (buttons) {
      texts[i].update();
    }

    if (i > 0 && !selectedText) {
      texts[i].connect(texts[i - 1]);
      // selectedText.connect(text[i]);
    }
    for (let z = 0; z < selektiert.length; z++) {
      sec = selektiert[z].text;
      if (Id === sec) {
        // text[i].connect2(selektiert[z]);

        strokeWeight(3);
        stroke(0, 0, 255);
        line(
          texts[i].pos.x,
          texts[i].pos.y - gr / 2,
          selektiert[z].pos.x,
          selektiert[z].pos.y - selektiert[z].textgr / 2
        );
      }
    }
    texts[i].display();
    if (
      mouseX >= texts[i].pos.x &&
      mouseX <= texts[i].pos.x + textWidth(texts[i].text) &&
      mouseY >= texts[i].pos.y - texts[i].textgr &&
      mouseY <= texts[i].pos.y
    ) {
      check = true;
      // console.log("ich bin über text");
    }
  }

  d = round(sin(frameCount / 5));

  rectMode(CORNER);
  noStroke();

  fill(100);

  let mouse = createVector(mouseX, mouseY);
  let pos1 = createVector(width / 2, height / 2);

  let dir = p5.Vector.sub(mouse, pos1);
  let distance = dir.mag();
  let l = map(distance, 0, windowWidth / 2, 100, 5);
  textSize(l);
  text(inputText, mouseX, mouseY);

  if (mouseIsPressed === true && check === false) {
    if (inputText.length > 0) {
      count(l);
    }

    typing = true;
    inputText = "";
  }

  if (blink && d === 0) {
    rect(mouseX, mouseY - 30, 5, 30);
  }

  if (selectedText) {
    // Highlight the selected text
    noFill();
    strokeWeight(1);
    stroke(255);
    // rect(
    //   selectedText.pos.x,
    //   selectedText.pos.y - 32,
    //   textWidth(selectedText.text),
    //   32
    // );
    textSize(selectedText.textgr);
    text(selectedText.text, selectedText.pos.x, selectedText.pos.y);
    // console.log(selectedText);
  }

  // console.log(selectedText);
}

function checkbuttons() {
  buttons = !buttons;
  button.value(buttons);
}

function keyTyped() {
  if (typing) {
    inputText += key; // Append the pressed key to the inputText
    blink = false;
  }
}

function keyPressed() {
  // Allow backspace functionality
  if (typing && keyCode === BACKSPACE) {
    inputText = inputText.slice(0, -1); // Remove the last character
    blink = true; // Remove the last character
  }
}

function mousePressed() {
  // typing = true;
  // selectedText = null;

  // Check if a text element is clicked
  for (let i = 0; i < texts.length; i++) {
    if (
      mouseX >= texts[i].pos.x &&
      mouseX <= texts[i].pos.x + textWidth(texts[i].text) &&
      mouseY >= texts[i].pos.y - 32 &&
      mouseY <= texts[i].pos.y
    ) {
      selectedText = texts[i];
      console.log(selectedText);
      // typing = false;
      return;
    }
  }

  // lastMouseX = mouseX;
  // lastMouseY = mouseY;
  // inputText = ""; // Reset input text when mouse is pressed
}

function count(l) {
  textgr = l;

  for (let i = 0; i < z; i++) {
    if (selectedText) {
      id = selectedText.text;
      selektiert.push(selectedText);
      console.log(selektiert);
    }
    let p = new Freitext(mouseX, mouseY, inputText, id, textgr);
    texts.push(p);

    if (selectedText) {
      let connection = { start: selectedText.pos.copy(), end: p.pos.copy() };
      connections.push(connection);
      // console.log(connections);
      // } else {
      //   let connetction2 = { start: p.pos.copy(), end: p.pos.copy() };
      //   connections.push(connetction2);
      console.log(selectedText);
    }
  }
}

class Freitext {
  constructor(x, y, t, i, l) {
    this.pos = createVector(x, y);
    this.posOld = createVector(x, y);
    this.vel = createVector(0, 0);
    this.text = t;
    this.acc = createVector(1.0, 1.0);
    this.id = i;
    this.textgr = l;
  }

  update() {
    this.posOld = this.pos.copy();
    // this.acc = createVector(random(-1, 1), random(-1, 1));

    let mouse = createVector(mouseX, mouseY);

    let dir = p5.Vector.sub(mouse, this.pos);

    let distance = dir.mag();

    if (distance > 20) {
      dir.normalize();
      dir.mult(0.01);
      this.acc = dir;
    } else {
      this.acc.set(0, 0);
    }

    this.vel.add(this.acc);
    this.vel.limit(3);
    this.pos.add(this.vel);

    // texts[i].pos.x + textWidth(texts[i].text)

    if (this.pos.x + textWidth(this.text) >= width) {
      this.vel.x = -this.vel.x;
    }
    if (this.pos.x <= 0) {
      this.vel.x = -this.vel.x;
    }

    if (this.pos.y >= height) {
      this.vel.y = -this.vel.y;
    }
    if (this.pos.y - this.textgr <= 0) {
      this.vel.y = -this.vel.y;
    }

    // if (selectedText) {
    //   let connection = { start: selectedText.pos.copy(), end: this.pos.copy() };
    //   connections.push(connection);

    // }
  }

  display() {
    fill(100, 100, 210);
    // fill(0, 0, 255, 100);

    textSize(this.textgr);
    strokeWeight(5);
    // stroke(255, 255, 255);
    stroke("blue");
    text(this.text, this.pos.x, this.pos.y);
  }

  connect(previousText) {
    stroke(255);
    strokeWeight(1);
    // line(this.pos.x, this.pos.y, previousText.pos.x, previousText.pos.y);
  }
}
