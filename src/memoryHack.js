const randomInt = (max) => Math.floor(Math.random() * Math.floor(max))
const delay = t => new Promise(res => setTimeout(res, t * 1000));
const shuffleArray = (array) => array.map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value)

function playSound(name, volume){
    const sound = new Audio(name)
    sound.volume = volume || 0.15;
    sound.play();     
    return sound
}
var rows = 4;
var columns = 8;
var amountOfNumbers = 0;
var data;
var choosingNumbers = 0;
var gameInProgress = 0;

var timeToPrepare = 0;
var timeToRemember = 0;
var timeToCheck = 0;
async function getHackData(amount)
{
  var allPositions = [];
  for(var i = 0;i < rows; i++)
  {
    for(var j = 0; j < columns; j++)
    {
      allPositions.push([i,j]);
    }
  }
  allPositions = shuffleArray(allPositions);
  var positions = allPositions.slice(0,amount);
  var hackData = [];
  for(var i = 1;i <= amount; i++)
  {
    hackData.push([i,positions[i-1]]);
  }
  data = hackData;
}
async function drawNumbers()
{
  for(var i = 0; i < data.length; i++)
  {
    $("#"+String(data[i][1][0])+String(data[i][1][1])).html(data[i][0]);
  }
}
async function clearSquares()
{
  for(var i = 0; i < rows; i++)
  {
    for(var j = 0; j < columns; j++)
    $("#"+String(i)+String(j)).empty();
  }
}
function squareClick(x,y)
{
  if(choosingNumbers == 1)
  {
    if((x == data[0][1][0]) && (y == data[0][1][1]))
    {
      //playSound('audio/click.mp3');
      $("#"+String(x)+String(y)).html(`<svg width="116" height="116" style="vertical-align: top;"><rect  fill="#e9e345" width="116" height="116" x="0" y="0"/></svg>`);
      data.shift();
    }else{
      gameInProgress = 0;
      $("#updateDiv").html("x");
      $("#updateDiv").html("");
    }
    if(data.length == 0)
    {
      gameInProgress = 0;
      $("#updateDiv").html("x");
      $("#updateDiv").html("");
    }
  }
}
async function stopProgressBar()
{
  $("#progress-bar").stop(true,true);
}
async function startHack(){
  gameInProgress = 1;
  getHackData(amountOfNumbers);
  $("#textBox").show();
  $("#text").html("PRZYGOTUJ SIĘ");
  var progBar = $("#progress-bar");
  progBar.css("width","100%");
  progBar.animate({
    width: "0px"
  }, {
    duration: timeToPrepare*1000,
    ease: "linear",
  });
  await delay(timeToPrepare);
  await stopProgressBar();
  $("#progress-bar").stop(true,true);
  $("#textBox").hide();
  $("#maze").show();
  await drawNumbers();
  progBar = $("#progress-bar");
  progBar.css("width","100%");
  progBar.animate({
    width: "0px"
  }, {
    duration: timeToRemember*1000,
    ease: "linear",
  });
  await delay(timeToRemember);
  await stopProgressBar();
  // $("#progress-bar").stop(true,true);
  await clearSquares();
  choosingNumbers = 1;
  // $("#progress-bar").stop(true,true);
  progBar.css("width","100%");
  progBar.animate({
    width: "0px"
  }, {
    duration: timeToCheck*1000,
    ease: "linear",
  });
  return new Promise(async (output) => {

    $('body').on('DOMSubtreeModified', '#updateDiv', function(){
      if (gameInProgress==0) {
        $("#progress-bar").stop(true,true);
        choosingNumbers = 0;
        gameInProgress = 0;
        result = 0;
        output(data.length == 0 ? 1 : 0);
      }
    });
    await delay(timeToCheck)
    choosingNumbers = 0;
    gameInProgress = 0;
    result = 0;
    // $("#progress-bar").stop(true,true);
    output(0);
  });
}

async function start()
{
  $("#buttonDiv").hide();
  $("#mainSpot").show();
  $("#progress-bar").stop(true,true);
  progBar = $("#progress-bar");
  progBar.css("width","100%");
  var val = await startHack();
  await clearSquares();
  //val == 1 ? playSound('audio/done.mp3') : playSound('audio/fail.mp3');
  var result = val == 1 ? "PRZYZNANO DOSTĘP" : "BRAK DOSTĘPU";
  $("#text").html(result);
  $("#textBox").show();
  $("#maze").hide();
  var progBar = $("#progress-bar");
  progBar.css("width","100%");
  progBar.animate({
    width: "0px"
  }, {
    duration: 2*1000,
    ease: "linear",
  });
  await delay(2);
  $("#textBox").hide();
  $("#mainSpot").hide();
  $("#buttonDiv").show();
}

$("#buttonStart").on( "click", function() {
  data = [];
  $("#progress-bar").stop(true,true);
  timeToPrepare = 4;
  timeToCheck = document.getElementById("timeToCheck").value;
  timeToRemember = document.getElementById("timeToRemember").value;
  amountOfNumbers = document.getElementById("amount").value;
  start();
});