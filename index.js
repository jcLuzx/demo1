//注册绑定画布对象
var context = document.getElementById('puzzle').getContext('2d');
//引入拼图图片
var img = new Image();
img.src = 'images/bao4.jpg';
//添加监听事件 并打乱图片
img.addEventListener('load',drawTiles,false)

//获取画布宽度
var boardSize = document.getElementById('puzzle').width;
//获取滑块值
var tileCount = document.getElementById('scale').value;
//计算出没行没列拼图大小
var tileSize = boardSize / tileCount;

//储存用户点击位置
var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;
//储存空白位置 solved判断拼图是否成功
var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;
var solved = false;

//初始化拼图排列位置
//创建画板对象
var boardParts = new Object;
setBoard();
function setBoard() {
  //创建拼图对应的二维数组
  boardParts = new Array(tileCount);
  for(var i = 0; i < tileCount; ++i) {
    boardParts[i] = new Array(tileCount);
    for(var j = 0; j < tileCount; ++j){
      //遍历储存每个拼图的坐标
      boardParts[i][j] = new Object;
      boardParts[i][j].x = (tileCount - 1) - i
      boardParts[i][j].y = (tileCount - 1) - j
    }
  }
  emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
  emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
}

//监听设置难度滑块
document.getElementById('scale').onchange = function() {
  tileCount = this.value;
  tileSize = boardSize / tileCount;
  //初始化位置
  setBoard();
  //显示滑块
  drawTiles()
}

//鼠标在画布上移动时总是计算拼图在二维数组的位置
document.getElementById('puzzle').onmousemove = function (e) {
  console.log('监听');
  //鼠标x坐标 - 画布左边距 / 画布宽度  向下取整 计算得到拼图在二维数组中的坐标
  clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize)
  clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize)
}

//点击移动拼图
document.getElementById('puzzle').onclick = function () {
  //判断点击的拼图是否在空白拼图周围
  if(distance(clickLoc.x,clickLoc.y,emptyLoc.x,emptyLoc.y) == 1) {
    console.log('点击移动拼图');
    slideTile(emptyLoc,clickLoc)
    drawTiles()
    //被点击拼图移动到空白位置
  }
  if(solved){
    setTimeout(function() {alert('完成')},500)
  }
}
function distance (x1,y1,x2,y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}
//调换空格  拼图位置
function slideTile(toLoc, fromLoc) {
  if(!solved) {
    boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
    boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
    boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
    boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
    toLoc.x = fromLoc.x;
    toLoc.y = fromLoc.y;
    // console.log(toLoc);
    console.log( fromLoc);
    //检测是否成功
    checkSolved();
  }
}
//显示绘制空白拼图
function drawTiles() {
  //清空盒子
  context.clearRect (0, 0, boardSize, boardSize)
  for(var i = 0; i < tileCount; ++i){
    for(var j = 0; j < tileCount; ++j) {
      var x = boardParts[i][j].x;
      var y = boardParts[i][j].y;

      if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {
        context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize,
          i * tileSize, j * tileSize, tileSize, tileSize)
      }
    }
  }
}
//判断拼图是否完成
function checkSolved() {
  var flag = true;
  for (var i = 0; i < tileCount; ++i){
    for(var j = 0; j < tileCount; ++j){
      if(boardParts[i][j].x != i || boardParts[i][j].y != j){
        flag = false
      }
    }
  }
  solved = flag
}