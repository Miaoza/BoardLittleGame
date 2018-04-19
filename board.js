/**
 * @Author: Nianko <nianko>
 * @Date:   2018-04-19T10:20:09+08:00
 * @Last modified by:   nianko
 * @Last modified time: 2018-04-19T18:46:07+08:00
 */

//9*9棋盘，e代表未落子
let container = null;   // div container
let toast = null;       // info show dom
let pieces = [];        // 棋盘信息
let user = '';          // 玩家x和o，默认x先落子
let victorys = {        // 获胜方式
  'x': [],
  'o': []
}

/**
 * [isWin 是否取得胜利]
 * @method isWin
 * @param  {[type]}  code [当前落下的棋子]
 * @param  {[array]}  list [可以连线的数组]
 * @return {Boolean}
 */
// let isWin = (code, list) => list.every((letter)=>(code===letter));
let isWin = (code, list) => list.filter(letter=>code===letter).length>=3;

/**
 * [showUserInfo 展示当前落子用户信息]
 * @method showUserInfo
 * @param  {[array]}     _victorys [获胜方式]
 * @return {[type]}
 */
let showUserInfo = (_victorys)=>toast.innerHTML = '当前玩家：'+user+'，获胜方式：'+JSON.stringify(_victorys);

/**
 * [uniqueArray 数组去重]
 * @method uniqueArray
 * @param  {[array]}    _arr [需要去重的数组]
 * @return {[type]}
 */
let uniqueArray = arr=>[...new Set(arr.map(item=>item.join('')))].map(item=>item.split('').map(val=>+val));

/**
 * [init 初始化]
 * @method init
 * @return {[type]}
 */
function init(){
  container = document.getElementsByClassName("container")[0];
  toast = document.getElementsByClassName('toast')[0];
  pieces = [
    ['e','e','e'],
    ['e','e','e'],
    ['e','e','e']
  ];
  user = 'x';
  victorys = {
    'x': [],
    'o': []
  };
  container.innerHTML = '';
  createChessboard(); // 创建棋盘
}

/**
 * [createChessboard 创建棋盘]
 * @method createChessboard
 * @return {[type]}
 */
function createChessboard(){
  let frag = document.createDocumentFragment();
  let div_node = document.createElement('div');

  pieces.map((rows, i)=>{ // pieces map start

    let _frag = document.createDocumentFragment();
    let row = div_node.cloneNode(false);

    rows.map((col, j)=>{
      let el = div_node.cloneNode(false);;
      el.innerHTML = col;
      el.setAttribute('class', 'cols');
      _frag.appendChild(el);
      el.onclick = function(){ // 玩家落子
        moveInChess(user, i, j);
      }
      el = null;
      return _frag;
    });

    row.appendChild(_frag);
    row.setAttribute('class', 'rows');
    frag.appendChild(row);
    row = null;
    _frag = null;

  }); // pieces map end

  container.appendChild(frag);
  div_node = null;
  frag = null;

  showUserInfo(victorys[user]);
}


/**
 * [moveInChess 落子]
 * @method moveInChess
 * @param  {[string]}    role ['x' or  'o']
 * @return {[type]}
 */
function moveInChess(role, i, j){
  if('e' === pieces[i][j]){
    pieces[i][j]=role;
    container.children[i].children[j].innerHTML = role;

    getResult(role, i, j);  // 获取落子后棋盘信息
  }else {
    alert("此处已落子，请重新落子");
  }
}

/**
 * [get_list 获取直线上获胜方式]
 * @method get_list
 * @param  {[string]} user  ['x' or 'o']
 * @param  {[array]} list  [棋盘信息]
 * @param  {[number]} index [行或列索引]
 * @return {[type]}
 */
function get_list(user, list, index){
  let owns = list.filter(item=>item===user);
  index_e = list.map((item, i)=>item==='e'&&i).filter(i=>typeof i === 'number');
  return 2===owns.length&&1===index_e.length&&[index_e[0], index];
}

/**
 * [winMethod 获取胜利的方式]
 * @method winMethod
 * @param  {[string]}  user ['x' or 'o']
 * @param  {[array]}   chessArray [棋盘信息]
 * @return {[type]}
 */
function winMethod(user, chessArray){
  let list = []

  // x轴方向
  chessArray.map((rows, i)=>{
    let result = get_list(user, rows, i);
    result&&list.push(result);
  });

  // y轴方向
  let c_len = chessArray[0].length;
  while (c_len) {
    c_len--;
    let cols = getColumns(c_len);
    let result = get_list(user, cols, c_len);
    result&&list.push(result);
  }

  // 斜线
  chessArray.map((rows, i)=>{ // chessArray map start
    rows.map((col, j)=>{
      // 正斜线
      let pos = getPositiveLine(i, j);
      if(-1!==pos[0]){
        let index = pos.findIndex(elm=>'e'===elm);
        let result = get_list(user, pos, index);
        result&&list.push(result);
      }

      // 反斜线
      let rev = getReverseLine(i, j);
      if(-1!==rev[0]){
        let l = rows.length;
        let index = rev.findIndex(elm=>'e'===elm);
        let result = get_list(user, rev, l-index-1);
        result&&list.push(result);
      }
    });
  }); // chessArray map end

  victorys[user] = uniqueArray(list); // array去重
  showUserInfo(victorys[user]);       // user info
}

/**
 * [getColumns 获取当前列元素]
 * @method getColumns
 * @param  {[number]}   j [当前列索引]
 * @return {[type]}
 */
function getColumns(j){
  let list = [];
  let len = pieces.length;
  let i = 0;
  while (i<len) {
    list.push(pieces[i][j]);
    i++;
  }
  return list
}

/**
 * [getPositiveLine 正斜线]
 * @method getPositiveLine
 * @param  {[number]}        x [index x]
 * @param  {[number]}        y [index y]
 * @return {[type]}
 */
function getPositiveLine(x, y){
  let list = [];

  for(let i=0,j=0;i<x&&j<y;i++,j++){
    list.push(pieces[i][j]);
  }
  for(let i=x,j=y,r_l=pieces.length,c_l=pieces[i].length;i<r_l&&j<c_l;i++,j++){
    list.push(pieces[i][j]);
  }
  return list.length>=3?list:[-1];
}

/**
 * [getReverseLine 反斜线]
 * @method getReverseLine
 * @param  {[number]}       x [index x]
 * @param  {[number]}       y [index y]
 * @return {[type]}
 */
function getReverseLine(x, y){
  let list = [];
  for(let i=x,j=y,c_l=pieces[i].length;i>=0&&j<c_l;i--,j++){
    list.push(pieces[i][j]);
  }
  list.reverse();
  for(let i=x+1,j=y-1,r_l=pieces.length;i<r_l&&j>=0;i++,j--){
    list.push(pieces[i][j]);
  }
  return list.length>=3?list:[-1];
}

/**
 * [获取落子后棋盘结果]
 * @method
 * @param  {[string]} role ['x' or 'o']
 * @param  {[number]} i    [一维坐标]
 * @param  {[number]} j    [二维坐标]
 * @return {[type]}
 */
function getResult(role, i, j){
  let code = pieces[i][j];    // 当前落下的棋子
  let columns = getColumns(j); // 棋盘上当前列数据
  let obliques = [
    getPositiveLine(i, j),
    getReverseLine(i, j)
  ]; // 棋盘斜线上数据

  let is_success = isWin(code, pieces[i])||isWin(code, columns)||isWin(code, obliques[0])||isWin(code, obliques[1]);

  if(is_success){ // 某一方获得胜利
    alert(role+'获得胜利！');
    init();
    return ;
  }else{ // 棋盘无棋格可以落子
    let now_pieces = pieces.map((item)=>(item.join(""))).join("").split("");
    if(!now_pieces.includes('e')){
      alert('无可落子棋格！');
      init();
      return ;
    }

    //交换为对方落子
    user = 'x'===role?'o':'x';
    winMethod(user, pieces); // 获取可获得胜利方式
  }
}

// onload
function load(){
  init();
}
