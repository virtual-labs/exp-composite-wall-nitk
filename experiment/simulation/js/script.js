const canvas = document.querySelector("#simscreen");
const ctx = canvas.getContext("2d");
const btnStart = document.querySelector(".btn-start");
const btnReset = document.querySelector(".btn-reset");
const voltageButtons = document.querySelectorAll(".voltage");
const vfspinner = document.querySelector("#vfspinner");
const temperature1 = document.querySelector("#temp1");
const temperature2 = document.querySelector("#temp2");
const temperature3 = document.querySelector("#temp3");
const temperature4 = document.querySelector("#temp4");
const temperature5 = document.querySelector("#temp5");
const temperature6 = document.querySelector("#temp6");
const temperature7 = document.querySelector("#temp7");
const btnCheck1 = document.querySelector(".btn-check1");
const btnCheck2 = document.querySelector(".btn-check2");
const taskTitle = document.querySelector(".task-title");

btnStart.addEventListener("click", initiateProcess);
btnReset.addEventListener("click", resetAll);
voltageButtons.forEach((voltage) =>
  voltage.addEventListener("click", () => setVoltage(voltage)
  
)
);

let steadyState = 0;
let currentVoltage = 0;
//controls section
let v = 0;
let vf = 0;

//timing section
let simTimeId = setInterval("", "1000");
let TimeInterval = setInterval("", "1000");
let TimeInterval1 = setInterval("", "1000");
let time = 0;
let time1 = 0;
let time2 = 0;

//point tracing section and initial(atmospheric section)
let t1 = [26, 26, 28.1, 27.5, 26.5, 27, 28];
let th = [45,45,45,45, 45, 45];
let off = [0,0,0,0,0,0];
let slope = [-282.86, -315.71, -354.29];
// let k = [40.83, 37.99, 37.61];
var heat = 0, r = 0, k =0, data=[];

//temporary or dummy variables for locking buttons
let temp = 0;
let temp1 = 2;
let temp2 = 0;
let tempslope = 0;
let tempk = 0;

function displayDiv(ele) {
  const taskScreen = document.querySelectorAll(".task-screen");
  taskScreen.forEach((task) => {
    task.classList.add("hide");
  });
  if (ele.classList.contains("tool-objective")) {
    document.querySelector(".objective").classList.remove("hide");
    taskTitle.textContent = "Objective";
  }
  if (ele.classList.contains("tool-description")) {
    document.querySelector(".description").classList.remove("hide");
    taskTitle.textContent = "Description";
  }
  if (ele.classList.contains("tool-explore")) {
    document.querySelector(".explore").classList.remove("hide");
    taskTitle.textContent = "Experiment";
    if (temp2 !== 1) {
      drawModel();
      startsim();
      varinit();
    }
  }
  if (ele.classList.contains("tool-practice")) {
    document.querySelector(".practice").classList.remove("hide");
    taskTitle.textContent = "Solve";
    if (temp2 == 1) {
      temp1 = 1;
      validation();
      document.querySelector("#info").innerHTML = "Temperature Distribution";
      document.querySelector("#extraInfo").innerHTML = "Move the cursor to the graph to see the points";
      
    } else {
      document.querySelector("#info").innerHTML =
        "Perform the experiment to solve the questions";
        document.querySelector("#extraInfo").innerHTML =
        "";
      document.querySelector(".graph-div").classList.add("hide");
      document.querySelector(".questions").classList.add("hide");
    }
  }
}


//Change in Variables with respect to time
function varinit() {
  // varchange();
  //Variable r1 slider and number input types
  // $("#vslider").slider("value", v);
  // $("#vspinner").spinner("value", v);

  // //$('#vfslider').slider("value", vf);
  // $("#vfspinner").spinner("value", vf);
  $('#vslider').slider("value", v);	
	$('#vspinner').spinner("value", v);
  console.log(currentVoltage, vf);
  if(time2 > 0){ t1[0] += off[0];};
  if(time2 > 0){ t1[1] += off[1];};
  if(time2 > 1){t1[2] += off[2];};
  if(time2 > 1){t1[3] += off[3];};
  if(time2 > 2){t1[4] += off[4];};
  if(time2 > 2){t1[5] += off[5];};
  if(time2 > 0){t1[6] += off[6];};

  if(v == "10"){
    heat = 19.6;
    r = 0.4235;
    k = 1.73;
    data = [40.75, 36.95, 32.45];
  }
  else if(v == "20"){
    heat = 31.95;
    r = 0.3521;
    k = 2.09;
    data = [44.95, 38.55, 33.7];
  }
  else if(v == "30"){
    heat = 47.85;
    r = 0.3103;
    k = 2.37;
    data = [49.7, 42.3, 34.85];
  }
  else{
    heat = 0;
    r = 0;
    k = 0;
    data = [0,0,0];
  }

  vfspinner.textContent = vf;
  temperature1.textContent = t1[0].toFixed(2);
  temperature2.textContent = t1[1].toFixed(2);
  console.log(temperature2.textContent);
  temperature3.textContent = t1[2].toFixed(2);
  temperature4.textContent = t1[3].toFixed(2);
  temperature5.textContent = t1[4].toFixed(2);
  temperature6.textContent = t1[5].toFixed(2);
  temperature7.textContent = t1[6].toFixed(2);

  

}

//water temperature changes
function watertemp() {
  switch (vf) {
    case 19.6:
      t1[6] += 2.2;
      break;
    case 31.95:
      t1[6] += 1.2;
      break;
    case 60:
      t1[6] += 1.2;
      break;
  }
}

//stops simulations
function simperiod() {
  if (time1 >= 5.0) {
    clearInterval(TimeInterval);
    clearInterval(TimeInterval1);
    time1 = 0;
    time2 = 0;
    temp1 = 0;
    temp2 = 1;
    watertemp();
    //printcomment("Click forward button for calculations", 1);
    //printcomment("Click restart button for doing experienment again", 2);

    ctx.clearRect(620, 485, 100, 50);
    t1[6] = t1[6].toFixed(1);
    ctx.font = "15px Comic Sans MS";
    //ctx.fillText(t1[5]+" \u00B0C", 470, 170);
    ctx.fillText(t1[6] + " \u00B0C", 650, 500);
    // printcomment("", 2);
  } else {
    drawGradient();
    steadyState = 5 - Math.round(time1);
    if (steadyState > 0) {
      document.querySelector(".comment").innerHTML = `Wait for ${steadyState} seconds for steady state`;
      btnReset.setAttribute("disabled", true);
    } else {
      document.querySelector(".comment").innerHTML = "Steady state achieved";
      btnReset.removeAttribute("disabled");
    }
    if (steadyState === 0) {
      temp2 = 0;

    
    }
    // printcomment(
    //   "Wait for " + (5 - Math.round(time1)) + " seconds for steady state",
    //   2
    // );
  }
}
//draw gradient w.r.t. time in thermometer water flow and heater
function drawGradient() {
//heater simulation
var h = 400*20*time1;

  //create gradient
  var grd1 = ctx.createLinearGradient(0, 0, h, 0)
  grd1.addColorStop(0,"red");
  grd1.addColorStop(1,"white");
  // Fill with gradient
  ctx.fillStyle = grd1;
  ctx.fillRect(380, 50, 29, 205);
   

  //outer parallel tube simulation
  var t1 = 120*10*time1;
  //create gradient
  var grd2 = ctx.createLinearGradient(0, 0, t1, 0)
  // grd2.addColorStop(0,"#FF0000");
  grd2.addColorStop(0,"#FF6666");
  grd2.addColorStop(1,"white");
  // Fill with gradient
  ctx.fillStyle = grd2;
  ctx.fillRect(410, 60, 69, 185);


  var t2 = 100*3*time1;
  //create gradient
  var grd3 = ctx.createLinearGradient(0, 0, t2, 0)
  // grd3.addColorStop(0,"#FF3300");
  grd3.addColorStop(0,"#FF704D");
  grd3.addColorStop(1,"white");
  // Fill with gradient
  ctx.fillStyle = grd3;
  ctx.fillRect(480, 60, 69, 185);

  
  var t3 = 100*2*time1;
  //create gradient
  var grd4 = ctx.createLinearGradient(0, 0, t3, 0)
  grd4.addColorStop(0,"#FF6600");
  grd4.addColorStop(1,"white");
  // Fill with gradient
  ctx.fillStyle = grd4;
  ctx.fillRect(550, 60, 69, 185);

 //left part

 var t4 = 80*2*time1;
  var y4 = 370 - 0.4*t4;
  //create gradient
  var grd5 = ctx.createLinearGradient(370, 0, y4, 0)
  grd5.addColorStop(0,"#FF6600");
  grd5.addColorStop(1,"white");
  // Fill with gradient
  ctx.fillStyle = grd5;
  ctx.fillRect(170, 60, 69, 185);


  var t5 = 100*time1;
  var y5 = 370 - t5;

  //create gradient
  var grd6 = ctx.createLinearGradient(370, 0, y5, 0)
  // grd6.addColorStop(0,"#FF3300");
  grd6.addColorStop(0,"#FF704D");
  grd6.addColorStop(1,"white");
  // Fill with gradient
  ctx.fillStyle = grd6;
  ctx.fillRect(240, 60, 69, 185);

  var t6 = 120 * 4 * time1; // Updated to match grd2 speed
  var y6 = 370 - 0.2*t6;

  //create gradient
  var grd7 = ctx.createLinearGradient(370, 0, y6, 0)
  // grd7.addColorStop(0,"#FF0000");
  grd7.addColorStop(0,"#FF6666");
  grd7.addColorStop(1,"white");
  // Fill with gradient
  ctx.fillStyle = grd7;
  ctx.fillRect(310, 60, 69, 185);
  

//   //cross sectional simulation
//   var x = 168,
//     y = 281,
//     // Radii of the white glow.
//     innerRadius = 4*time1,
//     outerRadius = 10*time1,
//     // Radius of the entire circle.
//     radius = 50;

// var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
// //gradient.addColorStop(0, 'white');
// gradient.addColorStop(0, '#ff9999');
// gradient.addColorStop(.59,"#99ccff");
// gradient.addColorStop(1, 'white');

// ctx.arc(168, 281, radius, 0, 2 * Math.PI);

// ctx.fillStyle = gradient;
// ctx.fill();

// //thermometer heights add offset
 if(time1 > 0){  th[0] += .8;};
 if(time1 > 0){  th[1] += .75;};
 if(time1 > 1){  th[2] += .6;};
 if(time1 > 1){  th[3] += .65;};
 if(time1 > 2){  th[4] += .4;};
 if(time1 > 2){  th[5] += .35;};

 //thermometers drawing
    ctx.fillStyle = "black";
    ctx.lineJoin = "round";

  //thermometer reading
  ctx.beginPath();
  ctx.fillRect(274.25, 408, 2, -1.1*th[0]);
  ctx.fillRect(326.25, 408, 2, -1.1*th[1]);
  ctx.fillRect(374.25, 408, 2, -1.1*th[2]);
  ctx.fillRect(426,    408, 2, -1.1*th[3]);
  ctx.fillRect(474.25, 408, 2, -1.1*th[4]);
  ctx.fillRect(526.25, 408, 2, -1.1*th[5]);


 // Adjust font size and family as needed
 ctx.font = "bold 16px Comic Sans MS";
ctx.textAlign = 'center'; // Center the text horizontally

// Add text labels below the thermometers

ctx.fillText('T1', 274.25, 450); // Adjust the Y-coordinate as needed
ctx.fillText('T2', 326.25, 450); // Adjust the Y-coordinate as needed
ctx.fillText('T3', 374.25, 450); // Adjust the Y-coordinate as needed
ctx.fillText('T4', 426,    450); // Adjust the Y-coordinate as needed
ctx.fillText('T5', 474.25, 450); // Adjust the Y-coordinate as needed
ctx.fillText('T6', 526.25, 450); // Adjust the Y-coordinate as needed


//  ctx.arc(168, 281, 50, 0, 2 * Math.PI);   
//  ctx.stroke();
//  ctx.beginPath();
//  ctx.arc(168, 281, 20, 0, 2 * Math.PI);
//  ctx.stroke();


}

// initial model
function drawModel() {
  ctx.clearRect(0,0,550,400); //clears the complete canvas#simscreen everytime

  ctx.font = "bold 17px Comic Sans MS";
  ctx.fillText("pressed", 155, 15);
  ctx.fillText("Wood", 155, 35);
  ctx.fillText("Bakelite", 255, 35);
  ctx.fillText("Cast", 330, 15);
  ctx.fillText("Iron", 330, 35);
  ctx.fillText("Heater", 410, 42);

  ctx.fillText("5", 170, 260);
  ctx.fillText("3", 235, 260);
  ctx.fillText("1", 310, 260);
  ctx.fillText("2", 475, 260);
  ctx.fillText("4", 545, 260);
  ctx.fillText("6", 615, 260);

    //thermometers
    ctx.fillStyle = "black";
   ctx.lineJoin = "round";
   ctx.beginPath();
   ctx.rect(268, 290, 15, 142);
   ctx.fillRect(273, 408, 6, 10);
   ctx.rect(420, 290, 15, 142);
   ctx.fillRect(424, 408, 6, 10);
   ctx.rect(468, 290, 15, 142);
   ctx.fillRect(472, 408, 6, 10);
   ctx.rect(320, 290, 15, 142);
   ctx.fillRect(324, 408, 6, 10);
   ctx.rect(368, 290, 15, 142);
   ctx.fillRect(372, 408, 6, 10);
   ctx.rect(520, 290, 15, 142);
   ctx.fillRect(524, 408, 6, 10);
  //  ctx.rect(60, 78, 280, 30);
  //  ctx.rect(80, 58, 240, 20);
  // left bottom thickness height
  //230
  ctx.lineWidth = 4;
   ctx.rect(170, 60, 70, 185);
   ctx.rect(240, 60, 70, 185);
   ctx.rect(310, 60, 70, 185);
   ctx.rect(380, 50, 30, 205);
   ctx.rect(410, 60, 70, 185);
   ctx.rect(480, 60, 70, 185);
   ctx.rect(550, 60, 70, 185);
   //ctx.rect(296, 117, 15, 2)
   ctx.stroke();
  //  ctx.clearRect(296, 127, 15, 2)
  //  ctx.clearRect(84, 57, 15, 2)
   ctx.beginPath()
   //60 height 55 length
   ctx.moveTo(195, 60); // 55 + 100 = 155
   ctx.lineTo(170, 40); // 30 + 100 = 130
   ctx.moveTo(275, 60); // 105 + 100 = 205
   ctx.lineTo(275, 40); // 105 + 100 = 205
   ctx.moveTo(325, 60); // 155 + 100 = 255
   ctx.lineTo(335, 40); // 165 + 100 = 265
  //  ctx.moveTo(285, 50); // 185 + 100 = 285
  //  ctx.lineTo(285, 40); // 185 + 100 = 285
  //  ctx.lineTo(310, 40); // 210 + 100 = 310
  ctx.moveTo(395, 60); // 155 + 100 = 255
  ctx.lineTo(405, 40); // 165 + 100 = 265


   ctx.stroke(); 

 
    drawGradient();
    
}

function comment1() {
  if (currentVoltage != 0) {
    time = 0;
    temp = 1;
    // $("#vspinner").spinner({disabled : true});
    // //$("#vfspinner").spinner({disabled : true});
    // $("#vslider").slider({disabled : true});
    // $("#vfslider").slider({disabled : true});
    clearInterval(simTimeId);
    //printcomment("start simulation", 0);
    if (currentVoltage == 10) {
      vf = 19.6;
    } else if (currentVoltage == 20) {
      vf = 31.95;
    } else if (currentVoltage == 30) {
      vf = 47.85;
    }
    offset();
  }
}

//offset for thermometer and temp change
function offset() {
  if (currentVoltage == 10) {
    //path = "./images//currentVoltage1.jpg";
    off[0] = 2.92;
    off[1] = 2.98;
    off[2] = 2.175;
    off[3] = 2.4;
    off[4] = 1.8;
    off[5] = 2;
    off[6] = 0.76;
  } else if (currentVoltage == 20) {
    //path = "./images//currentVoltage2.jpg";
    off[0] = 3.78;
    off[1] = 3.8;
    off[2] = 2.825;
    off[3] = 3.05;
    off[4] = 2.166;
    off[5] = 2.466;
    off[6] = 0.92;
  } else if (currentVoltage == 30) {
    //path = "./images//currentVoltage3.jpg";
   off[0] = 4.72;
    off[1] = 4.76;
    off[2] = 3.5;
    off[3] = 3.75;
    off[4] = 2.466;
    off[5] = 2.933;
    off[6] = 1.06;
  }
  // temp1 = 0;
  // temp2 = 1;
}
function setVoltage(ele) {
  currentVoltage = Number(ele.value);
  btnStart.removeAttribute("disabled");
}

function startsim() {
  simTimeId = setInterval("time=time+0.1; comment1(); ", "100");
}
function initiateProcess() {
  if (currentVoltage === 0) return;
  btnStart.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => voltage.setAttribute("disabled", true));
  simstate();
}

function simstate() {
  if (temp == 1) {
    temp = 0;
    temp1 = 1;
    TimeInterval = setInterval("time1=time1+.1; simperiod();", "100");
    TimeInterval1 = setInterval("time2=time2+1; varinit()", "1000");
    document.getElementById("formula").style.visibility="visible";
  }
}

//Calculations of the experienment
function validation() {
  // datapoints = [
  //   { x: 25, y: t1[0] },
  //   { x: 37, y: t1[1] },
  //   { x: 52, y: t1[2] },  
  //   // { x: 0.28, y: t1[3] },
  //   // { x: 0.35, y: t1[4] },
  // ];
  // document.querySelector(".graph-div").classList.remove("hide");
  // document.querySelector(".questions").classList.remove("hide");
  // drawgraph("graph", datapoints, "Length from heater", "Average Temperatures");
  // if (currentVoltage == 10) {
  //   tempslope = slope[0];
  //   tempk = k[0];
  // } else if (currentVoltage == 20) {
  //   tempslope = slope[1];
  //   tempk = k[1];
  // } else if (currentVoltage == 30) {
  //   tempslope = slope[2];
  //   tempk = k[2];
  // }
  // btnCheck1.addEventListener("click", () => validateAnswer1());
  // btnCheck2.addEventListener("click", () => validateAnswer2());
  if (currentVoltage == 10) {
    t1 = [40.75, 36.95, 32.45];
    
    r = 0.4235;
    k = 1.73;

  } else if (currentVoltage == 20) {
    t1 = [44.95, 38.55, 33.7];
    r = 0.3521;
    k = 2.09;
  } else if (currentVoltage == 30) {
    t1 = [49.7, 42.3, 34.85];
    r = 0.3103;
    k = 2.37;
  }
  var datapoints = [
    { x: 25, y: t1[0] },
    { x: 37, y: t1[1] },
    { x: 52, y: t1[2] }
  ];

  document.querySelector(".graph-div").classList.remove("hide");
  document.querySelector(".questions").classList.remove("hide");
  drawgraph("graph", datapoints, "Length from heater (mm)", "Average Temperatures (°C)");

  btnCheck1.addEventListener("click", () => validateAnswer1());
  btnCheck2.addEventListener("click", () => validateAnswer2());
}

function validateAnswer1() {
  const correctAnswer = document.querySelector(".correct-answer1");
  const unit = document.querySelector(".question-unit1");
  unit.innerHTML = `<sup>&deg;</sup>C/W`;
  let userEnteredValue = Number(
    document.querySelector(".question-input1").value
  );
  let answer = userEnteredValue === r ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = '<p><span style=" color: #028102;">Correct answer</span> <span style="color: #e7722b;"> Q = '+r+' <sup>&deg;</sup>C/W</span> ';
    console.log("hi " +r);
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function validateAnswer2() {
  const correctAnswer = document.querySelector(".correct-answer2");
  const unit = document.querySelector(".question-unit2");
  unit.innerHTML = `W/m.K`;
  let userEnteredValue = Number(
    document.querySelector(".question-input2").value
  );
  let answer = userEnteredValue === k ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = '<p><span style=" color: #028102;">Correct answer</span> <span style="color: #e7722b;"> K = '+k+' W/m.K</span> ';
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function resetAll() {
  btnStart.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => {
    voltage.removeAttribute("disabled");
    voltage.checked = false;
  });
  document.querySelector(".comment").innerHTML = "";
  // if (temp1 == 0) {
  temp2 = 0;
  temp1 = 2;
  t1 = [26, 26, 28.1, 27.5, 26.5, 27, 28];
  th = [45, 45, 45, 45, 45, 45];
  currentVoltage = 0;
  vf = 0;
  document.querySelector(".correct-answer1").innerHTML = "";
  document.querySelector(".question-unit1").innerHTML = `<sup>&deg;</sup>C/m`;
  document.querySelector(".question-input1").value = "";
  document.querySelector(".correct-answer2").innerHTML = "";
  document.querySelector(".question-unit2").innerHTML = `W/m.K`;
  document.querySelector(".question-input2").value = "";
  document.getElementById("formula").style.visibility="hidden";

   // Clear the canvas
   ctx.clearRect(0, 0, canvas.width, canvas.height);
  varinit();
  startsim();
  drawModel();
  
}

function movetoTop() {
  practiceDiv.scrollIntoView();
}
