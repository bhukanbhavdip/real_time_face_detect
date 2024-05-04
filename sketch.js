let faceapi;
let detections = [];

let video;
let canvas;

function setup() {
  canvas = createCanvas(480, 360);//this method is include in ps5.js library
  canvas.id("canvas");

  video = createCapture(VIDEO);//this method is include in ps5.js library
  video.id("video");
  video.size(width, height);

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;
  console.log(detections);

  clear();
  drawBoxs(detections);
  drawLandmarks(detections);
  drawExpressions(detections, 20, 250, 14);

  faceapi.detect(gotFaces);
}

function drawBoxs(detections){
  if (detections.length > 0) {
    for (f=0; f < detections.length; f++){
      let {_x, _y, _width, _height} = detections[f].alignedRect._box;
      stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}

function drawLandmarks(detections){
  if (detections.length > 0) {
    for (f=0; f < detections.length; f++){
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke(44, 169, 225);
        strokeWeight(3);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace) {
  if (detections.length > 0) {
    let expressions = detections[0].expressions;
    let dominantExpression = getDominantExpression(expressions);

    textFont('Helvetica Neue');
    textSize(20);
    noStroke();
    fill(49,69,255);

    text("Expression: " + dominantExpression, x, y);
  } else {
    text("No Face Detected", x, y);
  }
}

function getDominantExpression(expressions) {
  let expressionLabels = Object.keys(expressions);
  let maxPercentage = 0;
  let dominantExpression = '';

  expressionLabels.forEach(label => {
    let percentage = expressions[label];
    if (percentage > maxPercentage) {
      maxPercentage = percentage;
      dominantExpression = label;
    }
  });

  return dominantExpression;
}
