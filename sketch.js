
const   w = 512,
        h = 512,
        letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        playerSideWhite = true;

let isWhiteTurn = true,
    pgn = [],
    selection = [-1, -1],
    canWhiteCastleKing = true,
    canWhiteCastleQueen = true,
    canBlackCastleKing = true,
    canBlackCastleQueen = true;


function preload() {
  // load pieces
  wk = loadImage('assets/king_w.png');
  bk = loadImage('assets/king_b.png');
  wq = loadImage('assets/queen_w.png');
  bq = loadImage('assets/queen_b.png');
  wb = loadImage('assets/bishop_w.png');
  bb = loadImage('assets/bishop_b.png');
  wn = loadImage('assets/knight_w.png');
  bn = loadImage('assets/knight_b.png');
  wp = loadImage('assets/pawn_w.png');
  bp = loadImage('assets/pawn_b.png');
  wr = loadImage('assets/rook_w.png');
  br = loadImage('assets/rook_b.png');  
}

function setup() {
  cnv = createCanvas(w, h);
  cnv.mousePressed(playerMove);
  imageMode(CENTER);
  // two-demencial board array
  arr = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
  ]
}

function draw() {
  drawBoard();
  drawPices();
}

function drawBoard() {
  background(222, 227, 230);
  fill(140, 162, 173);
  noStroke();
  // background layout
  for (i = 0; i < 8; i++)
    for (j = 0; j < 8; j++)
      if ((i + j) % 2 != 0)
        rect(i * w / 8, j * w / 8 , w / 8, w / 8);
  // square indexing
  for (i = 0; i < 8; i++) {
    if (i % 2 == 0) fill(222, 227, 230);
    else fill(140, 162, 173);
    text(playerSideWhite ? letters[i] : letters[7 - i], i * w / 8 + 5, w - 5);
    text(playerSideWhite ? 8 - i : i + 1, w - 10, i * w / 8 + 15 );
  }
}

function drawPices() {
  for (i = 0; i < 8; i++)
    for (j = 0; j < 8; j++) {
      switch(arr[playerSideWhite ? i : 7 - i][playerSideWhite ? j : 7 - j]) {
        case 'br': image(br, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'bb': image(bb, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'bn': image(bn, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'bk': image(bk, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'bq': image(bq, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'bp': image(bp, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'wr': image(wr, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'wb': image(wb, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'wn': image(wn, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'wk': image(wk, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'wq': image(wq, j * w / 8 + w / 16, i * w / 8 + w / 16); break;
        case 'wp': image(wp, j * w / 8 + w / 16, i * w / 8 + w / 16);
      }
    }
}

function playerMove() {
  x = floor(mouseX * 8 / w);
  y = floor(mouseY * 8 / w);
  if ((arr[y][x][0] == 'w' && isWhiteTurn) || (arr[y][x][0] == 'b' && !isWhiteTurn)) {
    selection = [y, x];
  } else {
    if (isLegal(selection[0], selection[1], y, x))
      makeMove(selection[0], selection[1], y, x);
    selection = [-1, -1];
  }
}

function isLegal(y0, x0, y, x) {
  if (y0 == -1 || isInCheck(y0, x0, y, x)) return false;
  switch(arr[y0][x0][1]){
    // king
    case 'k':
      if (abs(y - y0) <= 1 && abs(x - x0) <= 1)
        return true
      return false;
    // bishop
    case 'b': 
      if (abs(x - x0) == abs(y - y0)) {
        ax = x0; bx = x; if (x0 > x) { t = ax; ax = bx; bx = t; }
        ay = y0; by = y; if (y0 > y) { t = ay; ay = by; by = t; }
        for (i = ax, j = ay; i < bx, j < by; i++, j++)
          if (arr[j][i] != '  ' && i != ax && j != ay)
            return false
        return true;
      }
      return false;
    // rook
    case 'r':
      if (x == x0) {
        a = y0; b = y; if (y0 > y) { t = a; a = b; b = t; }
        for (i = a; i < b; i++)
          if (arr[i][x] != '  ' && i != a)
            return false;
        return true;
      } else if (y == y0) {
        a = x0; b = x; if (x0 > x) { t = a; a = b; b = t; }
        for (i = a; i < b; i++)
          if (arr[y][i] != '  ' && i != a)
            return false;
        return true;
      }
      return false;
    // pawn
    case 'p':
      // regular move 1 square ahead
      if ((arr[y][x] == '  ') && (x0 == x) &&
        ((y0 - y == 1) && isWhiteTurn || (y0 - y == -1) && !isWhiteTurn)) {
          return true;
      // 1st move 2 squares ahead
      } else if ((arr[y][x] == '  ') && (x0 == x) &&
        ((y0 == 6 && isWhiteTurn) || (y0 == 1 && !isWhiteTurn)) &&
        ((y0 - y == 2) && isWhiteTurn || (y0 - y == -2) && !isWhiteTurn)) {
          return true;
      // cupture
      } else if ((arr[y][x][0] == 'b' && isWhiteTurn) || (arr[y][x][0] == 'w' && !isWhiteTurn)) {
        if ((y0 - y == 1 && abs(x0 - x) == 1 && isWhiteTurn) ||
        (y0 - y == -1 && abs(x0 - x) == 1 && !isWhiteTurn))
          return true;
      // en peasant

      }
      return false;
    // queen
    case 'q':
      if (x == x0) {
        a = y0; b = y; if (y0 > y) { t = a; a = b; b = t; }
        for (i = a; i < b; i++)
          if (arr[i][x] != '  ' && i != a)
            return false;
        return true;
      } else if (y == y0) {
        a = x0; b = x; if (x0 > x) { t = a; a = b; b = t; }
        for (i = a; i < b; i++)
          if (arr[y][i] != '  ' && i != a)
            return false;
        return true;
      } else if (abs(x - x0) == abs(y - y0)) {
        ax = x0; bx = x; if (x0 > x) { t = ax; ax = bx; bx = t; }
        ay = y0; by = y; if (y0 > y) { t = ay; ay = by; by = t; }
        for (i = ax, j = ay; i < bx, j < by; i++, j++)
          if (arr[j][i] != '  ' && i != ax && j != ay)
            return false
        return true;
      }
      return false;
    // knight
    case 'n':
      if ((abs(x - x0) == 2 && abs(y - y0) == 1) || (abs(x - x0) == 1 && abs(y - y0) == 2)) 
        return true;
      return false;
    // shouldn't ever get here
    default:
      return false;
  }
}

function isInCheck(y0, x0, y, x) {
  return false;
}

function makeMove(y0, x0, y, x) {
  piece = arr[y0][x0];
  arr[y0][x0] = '  ';
  arr[y][x] = piece;
  isWhiteTurn = !isWhiteTurn;
  append(pgn, [[x0, y0], [x, y]]);
}
