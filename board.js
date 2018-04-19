/**
 * @Author: Nianko <nianko>
 * @Date:   2018-04-19T10:20:09+08:00
 * @Last modified by:   nianko
 * @Last modified time: 2018-04-19T15:33:09+08:00
 */

//9*9棋盘，e代表未落子
let container = null;   // div container
let toast = null;       // info show dom
let pieces = [];        // 棋盘信息
let user = '';          // 玩家x和o，默认x先落子
let is_success = false; // 是否有人获胜
let victorys = {        // 获胜方式
  'x': [],
  'o': []
}

// onload
function load(){
  init();
}

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
  is_success = false;
  victorys = {
    'x': [],
    'o': []
  };
  createChessboard(); // 创建棋盘
}

/**
 * [createChessboard 创建棋盘]
 * @method createChessboard
 * @return {[type]}
 */
let createChessboard = ()=>{
  let frag = document.createDocumentFragment();

  pieces.map((rows, i)=>{ // pieces map start

    let _frag = document.createDocumentFragment();
    let row = document.createElement('div');

    rows.map((col, j)=>{
      let el = document.createElement('div');
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
  showUserInfo([]);
  frag = null;
}

/**
 * [showUserInfo 展示当前落子用户信息]
 * @method showUserInfo
 * @param  {[array]}     victorys [获胜方式]
 * @return {[type]}
 */
let showUserInfo = (victorys)=>toast.innerHTML = '当前玩家：'+user+'，获胜方式：'+JSON.stringify(victorys);

/**
 * [moveInChess 落子]
 * @method moveInChess
 * @param  {[string]}    role ['x' or  'o']
 * @return {[type]}
 */
let moveInChess = (role, i, j)=>{
  if('e' === pieces[i][j]){
    pieces[i][j]=role;
    container.children[i].children[j].innerHTML = role;

    getResult(role, i, j);
  }else {
    alert("此处已落子，请重新落子");
  }
}

/**
 * [winMethod 获取胜利的方式]
 * @method winMethod
 * @param  {[string]}  user ['x' or 'o']
 * @return {[type]}
 */
let winMethod = (user) => {
  let list = []
  pieces.map((rows, i)=>{
    let index_u = rows.map((item, index)=>(item===user&&index)).filter((j)=>(typeof j === 'number'));
    let index_e = rows.map((item, index)=>(item==='e'&&index)).filter((j)=>(typeof j === 'number'));
    2===index_u.length&&1===index_e.length&&list.push([i,index_e[0]]);
  });

  let col_indexs = [0, 1, 2];
  col_indexs.map((j)=>{
    let cols = [
      pieces[0][j],pieces[1][j],pieces[2][j]
    ];
    let owns = cols.filter((item)=>(item===user));
    let index_e = cols.map((item, index)=>(item==='e'&&index)).filter((i)=>(typeof i === 'number'));
    2===owns.length&&1===index_e.length&&list.push([index_e[0],j]);
  });

  let obliques = [
    [pieces[0][0],pieces[1][1],pieces[2][2]],
    [pieces[0][2],pieces[1][1],pieces[2][0]]
  ]; // 棋盘斜线上数据
  obliques.map((arr, index)=>{
    let owns = arr.filter((item)=>(item===user));
    let index_e = arr.map((item, idx)=>('e'===item&&idx)).filter((i)=>(typeof i === 'number'));
    0===index&&2===owns.length&&1===index_e.length&&list.push([index_e[0],index_e[0]]);
    1===index&&2===owns.length&&1===index_e.length&&list.push([index_e[0],index_e[0]===2?0:index_e[0]===0?2:1]);
  });

  victorys[user] = uniqueArray(list);
  showUserInfo(victorys[user]);
}

/**
 * [uniqueArray 数组去重]
 * @method uniqueArray
 * @param  {[array]}    _arr [需要去重的数组]
 * @return {[type]}
 */
let uniqueArray = arr=>[...new Set(arr.map(item=>item.join('')))].map(item=>item.split('').map(val=>+val));

/**
 * [isWin 是否取得胜利]
 * @method isWin
 * @param  {[type]}  code [当前落下的棋子]
 * @param  {[array]}  list [可以连线的数组]
 * @return {Boolean}
 */
let isWin = (code, list) => list.every((letter)=>(code===letter));

/**
 * [获取落子后棋盘结果]
 * @method
 * @param  {[string]} role ['x' or 'o']
 * @param  {[number]} i    [一维坐标]
 * @param  {[number]} j    [二维坐标]
 * @return {[type]}
 */
let getResult = function(role, i, j){
  let code = pieces[i][j];    // 当前落下的棋子
  let columns = [pieces[0][j],pieces[1][j],pieces[2][j]]; // 棋盘上当前列数据
  let obliques = [
    [pieces[0][0],pieces[1][1],pieces[2][2]],
    [pieces[0][2],pieces[1][1],pieces[2][0]]
  ]; // 棋盘斜线上数据

  is_success = isWin(code, pieces[i])||isWin(code, columns)||isWin(code, obliques[0])||isWin(code, obliques[1]);

  if(is_success){
    alert(role+'获得胜利！');
    container.innerHTML = '';
    init();
    return ;
  }else{
    let now_pieces = pieces.map((item)=>(item.join(""))).join("").split("");
    if(!now_pieces.includes('e')){
      alert('无可落子棋格！');
      container.innerHTML = '';
      init();
    }
    user = 'x'===role?'o':'x';
    winMethod(user);
  }
}
