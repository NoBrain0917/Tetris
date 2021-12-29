let isAudioStart = false
let audio;
let speed = 35;
let nextTetr;
let varscore = 0;
let hue = 0;
let isRb = false;
let isM = false;
let isMute = false;
let isRemix = false;
let BotOn = false;


getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


generateSequence = function() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        tetrominoSequence.push(name);
    }
}

getNextTetromino = function() {
    if (tetrominoSequence.length === 0) {
        generateSequence();
    }

    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    const row = name === 'I' ? -1 : -2;

    return {
        name: name,
        matrix: matrix,
        row: row,
        col: col
    };
}

rotate = function(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    return result;
}

isValidMove = function(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                playfield[cellRow + row][cellCol + col])) {
                    return false;
                }
            }
        }
    return true;
}

showNextTetr = function() {
    ctx.clearRect(0,0,150,150);
    var sans = nextTetr;
    for (let row = 0; row < sans.matrix.length; row++) {
            for (let col = 0; col < sans.matrix[row].length; col++) {
                if (sans.matrix[row][col]) {
                    ctx.fillStyle = colors[sans.name]
                    var xp = 70;
                    var yp = 100;
                    if(sans.name=="I") {
                        xp = 85;
                        yp = 55;
                    }
                    if(sans.name=="O") {
                        xp = 85;
                        yp = 100;
                    }
                    var col2 = (sans.col + col) * grid -xp;
                    var row2 = (sans.row + row) * grid +yp;
                    if(isM) sans.name = "S"
                    ctx.fillStyle = colors[sans.name];
                    ctx.fillRect(col2, row2, grid-1, grid-1);
                    ctx.fillStyle =  lightcolors[sans.name];
                    ctx.fillRect((col2)+2 , (row2), 28, 3);
                    ctx.fillStyle =  blackcolors[sans.name]
                    ctx.fillRect((col2) , (row2)+28, 31, 3);
                    ctx.fillStyle =  darkcolors[sans.name];
                    ctx.fillRect((col2) , (row2), 3, 28);
                    ctx.fillRect((col2)+28 , (row2), 3, 28);
                    if(isM) sans.name = "O"
            }
        }
    }
}

checkScore = function() {
    let score = $(".score");
    let orScore = Number(score.text());
    if(orScore!=varscore) {
        if(orScore>varscore) {
            orScore = varscore;
            $(".score").html(varscore)
        } else {
            varscore = orScore;
        }
    }
    return;
}

addScore = function(point,sans) {
    //나는 그루트다
    //나는 그루트다
    //나는 그루트다
    //나는 그루트다
    //나는 그루트다
    //나는 그루트다
    //나는 그루트다
    //나는 그루트다
    //나는 그루트다
    //나는 그루트다
    //나는 그루트다
    //나는 그루트다
    if(sans!="\u0073\u0061\u006e\u0073") return;
    let score = $(".score");
    let orScore = Number(score.text());
    checkScore();
    score.html(orScore+Number(point));
    score = Number(score.text())
    speed = 35 - Math.round(score / 120);
    if(speed<5) speed = 5;
    if(score>10000) {
        $(".made").addClass("animated_rainbow")
        $(".made").html("반짝반짝")
    }
    if(score>7000) {
        if(!isRemix) {
            isRemix = true;
            if(audio!=null) audio.main.stop();
            if(audio!=null) audio.remix.play();
        
        }
    }

}

addLine = function(point) {
    let line = $(".line");
    let orLine = Number(line.text());
    line.html(orLine+Number(point));
    line = Number(line.text())
}

placeTetromino = function() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                if (tetromino.row + row < 0) {
                    return showGameOver();
                }
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
                }
            }
        }
    addScore(2,"sans");
    varscore += 2;
    if(audio!=null) audio.hit.play();

    for (let row = playfield.length - 1; row >= 0; ) {
        if (playfield[row].every(cell => !!cell)) {
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r-1][c];
                }
            }
        addScore(100,"sans")
        varscore += 100;
        addLine(1)
        if(audio!=null) audio.lineRemove.play();
        } else {
            row--;
        }
    }
    if(isM) {
        tetromino = {name: "O", matrix: tetrominos["O"], row: -2, col: 4}
        nextTetr = {name: "O", matrix: tetrominos["O"], row: -2, col: 4}
        showNextTetr()
    } else {
    tetromino = nextTetr;
    nextTetr = getNextTetromino();
    showNextTetr();
    }
    
}

runAI = function(speed) {
    var int = setInterval(function(){
        if(speed==null) speed = 100;
        var aa,bb,cc,dd;
        var ai = new AI().run(playfield,tetromino);
    
        tetromino.col = ai.col;
        tetromino.matrix = ai.matrix;
        for(var n=tetromino.row;n<20;n++) {
            if (!isValidMove(tetromino.matrix, n, tetromino.col)) {
                tetromino.row = n-1;
                if(!gameOver) placeTetromino();
                break
            }
        }
        if(gameOver) {
            clearInterval(int);
        }
    },speed)
}

aiTest = function(speed){
    if(speed==null) speed = 130;
    var ai = new AI().run(playfield,tetromino);
    setTimeout(function(){
    if(tetromino.matrix!=ai.matrix) {
        if(audio!=null) audio.blockRotate.play();
        tetromino.matrix = ai.matrix;
    }
},speed)
    if(ai.col>tetromino.col) {
        var int = setInterval(function(){
            tetromino.col+=1;
            if(gameOver) clearInterval(int);
            if(tetromino.col==ai.col) {
                clearInterval(int);
                setTimeout(function(){
                    for(var n=tetromino.row;n<20;n++) {
                        if (!isValidMove(tetromino.matrix, n, tetromino.col)) {
                            tetromino.row = n-1;
                            if(!gameOver) placeTetromino();
                            setTimeout(function(){
                                aiTest(speed);
                            },speed)
                            break
                        }
                    }
                },speed)
            }
    },speed)
    } else if(ai.col<tetromino.col) {
        var int = setInterval(function(){
            tetromino.col-=1;
            if(tetromino.col==ai.col) {
                if(gameOver) clearInterval(int);
                clearInterval(int);
                setTimeout(function(){
                    for(var n=tetromino.row;n<20;n++) {
                        if (!isValidMove(tetromino.matrix, n, tetromino.col)) {
                            tetromino.row = n-1;
                            if(!gameOver) placeTetromino();
                            setTimeout(function(){
                                aiTest(speed);
                            },speed)
                            break
                        }
                    }
                },speed)
            }
    },speed)
    } else {
        setTimeout(function(){
            for(var n=tetromino.row;n<20;n++) {
                if (!isValidMove(tetromino.matrix, n, tetromino.col)) {
                    tetromino.row = n-1;
                    if(!gameOver) placeTetromino();
                    setTimeout(function(){
                        aiTest(speed);
                    },speed)
                    break
                }
            }
        },speed) 
    }
    }


        /*
        while(ai.col!=tetromino.col) {
            if(ai.col>tetromino.col) {
                setTimeout(function(){
                    tetromino.col =- 1;
                },n);
                n+=200;
                break;
            } else if(ai.col<tetromino.col) {
                setTimeout(function(){
                    tetromino.col =+ 1;
                },n);
                n+=200;
                break;
            } else {
                tetromino.col = ai.col;
            }
        }
        */
    
    


showGameOver = function() {
    if(audio!=null) audio.main.stop();
    if(audio!=null) audio.gameOver.play();
    if(audio!=null) if(isRemix) audio.remix.stop()
    cancelAnimationFrame(rAF);
    gameOver = true;
    isRb = false;
    isRemix = false;
    isMute = false;
    if($("body").hasClass("gray")) $("body").removeClass("gray")


    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60 + 30);

    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px dotFont';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 + 20);
    context.font = '20px dotFont';
    context.fillText('press Enter!', canvas.width / 2, canvas.height / 2 + 50);
    isM = false;
}

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const ctx = document.getElementById("next").getContext('2d')
const grid = 32;
let tetrominoSequence = [];

let playfield = [];

for (let row = -2; row < 20; row++) {
    playfield[row] = [];
    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}

const tetrominos = {
'I': [
  [0,0,0,0],
  [1,1,1,1],
  [0,0,0,0],
  [0,0,0,0]
],
'J': [
  [1,0,0],
  [1,1,1],
  [0,0,0],
],
'L': [
  [0,0,1],
  [1,1,1],
  [0,0,0],
],
'O': [
  [1,1],
  [1,1],
],
'S': [
  [0,1,1],
  [1,1,0],
  [0,0,0],
],
'Z': [
  [1,1,0],
  [0,1,1],
  [0,0,0],
],
'T': [
  [0,1,0],
  [1,1,1],
  [0,0,0],
]
};

const colors = {
'I': '#00f0f0',
'O': '#f0f000',
'T': '#a000f0',
'S': '#00f000',
'Z': '#f00000',
'J': '#0000f0',
'L': '#f0a000'
};
const lightcolors = {
    'I': '#aefbfb',
    'O': '#fbfbb3',
    'T': '#e7bcfb',
    'S': '#b4fbb4',
    'Z': '#fbb0b0',
    'J': '#b3b3fb',
    'L': '#fbe3b3'
};
const darkcolors = {
    'I': '#00d8d8',
    'O': '#d8d800',
    'T': '#9000d8',
    'S': '#00d800',
    'Z': '#d80000',
    'J': '#0000d8',
    'L': '#d78b00'
};
const blackcolors = {
    'I': '#007a7a',
    'O': '#7b7b00',
    'T': '#500078',
    'S': '#006e00',
    'Z': '#710000',
    'J': '#000073',
    'L': '#8b5c00'
};

let count = 0;
let tetromino;
nextTetr==null? tetromino = getNextTetromino():tetromino = nextTetr;
let rAF = null;
let gameOver = false;


glowReset = function(){
    context.fillStyle = null
    context.strokeStyle = null
    context.shadowColor = null
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.strokeStyle = lightcolors[tetromino.name]
}


var colorss = [
    "#b4b2b5",
    "#dfd73f",
    "#6ed2dc",
    "#66cf5d",
    "#c542cb",
    "#d0535e",
    "#3733c9"
  ];
  let linePos = 0


loop = function() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);
    checkScore();
    if(isMute) {
    context.fillStyle = "#1a191c";
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    context.shadowBlur = 0;
    context.shadowColor = "none";
    context.setTransform(1, 0, 0, 1, 0, 0);
  
    for (let i = 0; i < 1000; i++) {
      context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.01})`;
      context.fillRect(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height),
        Math.floor(Math.random() * 30) + 1,
        Math.floor(Math.random() * 30) + 1
      );
  
      context.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
      context.fillRect(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height),
        Math.floor(Math.random() * 25) + 1,
        Math.floor(Math.random() * 25) + 1
      );
    }
    
    context.fillStyle = colorss[Math.floor(Math.random() * 40)];
    context.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * canvas.width,
      Math.random() * canvas.height
    );
    }

    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                let name = playfield[row][col];
                if(isM) name = "S"
                context.fillStyle = isRb? `hsl(${hue}, 100%, 50%)`:colors[name];
                context.fillRect(col * grid, row * grid, grid-1, grid-1);
                context.fillStyle =  isRb? `hsl(${hue}, 100%, 80%)`:lightcolors[name];
                context.fillRect((col * grid)+2 , (row * grid), 28, 3);
                context.fillStyle =  isRb? `hsl(${hue}, 100%, 30%)`:blackcolors[name]
                context.fillRect((col * grid) , (row * grid)+28, 31, 3);
                context.fillStyle =  isRb? `hsl(${hue}, 100%, 45%)`:darkcolors[name];
                context.fillRect((col * grid) , (row * grid), 3, 28);
                context.fillRect((col * grid)+28 , (row * grid), 3, 28);
            } 
        }
    }

    for(var n=tetromino.row;n<20;n++) {
        var preview;
        if (!isValidMove(tetromino.matrix, n, tetromino.col)) {
            preview = n-1
            break;
        }
    }
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                context.fillStyle = 'black';
                if(isM) tetromino.name = "S"
                context.shadowColor = isRb? `hsl(${hue}, 100%, 80%)`:lightcolors[tetromino.name];
                context.shadowBlur = 8;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.strokeStyle = isRb? `hsl(${hue}, 100%, 45%)`:darkcolors[tetromino.name]
                context.fillRect((tetromino.col + col) * grid, (preview + row) * grid, grid-1, grid-1);
                context.strokeRect((tetromino.col + col) * grid, (preview + row) * grid, grid-2, grid-2);
                glowReset();
                if(isM) tetromino.name = "O"
            }
        }
    }


    if (tetromino) {
        if (++count > speed) {
            tetromino.row++;
            count = 0;
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                placeTetromino();
            }
        }

    

        context.fillStyle = colors[tetromino.name];

        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (let col = 0; col < tetromino.matrix[row].length; col++) {
                if (tetromino.matrix[row][col]) {
                    
                    var col2 = (tetromino.col + col) * grid;
                    var row2 = (tetromino.row + row) * grid;
                    if(isM) tetromino.name = "S"
                    context.fillStyle = isRb? `hsl(${hue}, 100%, 50%)`:colors[tetromino.name];
                    context.fillRect(col2, row2, grid-1, grid-1);
                    context.fillStyle =  isRb? `hsl(${hue}, 100%, 80%)`:lightcolors[tetromino.name];
                    context.fillRect((col2)+2 , (row2), 28, 3);
                    context.fillStyle =  isRb? `hsl(${hue}, 100%, 30%)`:blackcolors[tetromino.name]
                    context.fillRect((col2) , (row2)+28, 31, 3);
                    context.fillStyle =  isRb? `hsl(${hue}, 100%, 45%)`:darkcolors[tetromino.name];
                    context.fillRect((col2) , (row2), 3, 28);
                    context.fillRect((col2)+28 , (row2), 3, 28);
                    if(isM) tetromino.name = "O"
                }
            }
        }
    }
    hue++
    if (hue >= 360) {
        hue = 0
    }
}

let kw = "";

document.addEventListener('keydown', function(e) {
    if (gameOver) {
        

        if(e.key==="Enter") {
        if(audio!=null) audio.gameOver.stop();
        if(audio!=null) audio.main.play();
        tetrominoSequence = [];
        playfield = [];
        $(".score").html("0");
        $(".line").html("0");
        speed = 35;
        count = 0;
        rAF = null;
        context.clearRect(0,0,canvas.weight,canvas.height);
        ctx.clearRect(0,0,150,150)
        gameOver = false;
        for (let row = -2; row < 20; row++) {
            playfield[row] = [];
            for (let col = 0; col < 10; col++) {
                playfield[row][col] = 0;
            }
        }

        rAF = requestAnimationFrame(loop);
        tetromino = getNextTetromino()
        nextTetr = getNextTetromino();
        showNextTetr();
        
    }
        return;
    }
    kw+=e.key
    if(isAudioStart==false) {
        audio = new GameAudio();
        audio.main.play();
        isAudioStart = true;
    }
    if(kw.indexOf("rainbow")!=-1) {
        if(isRb) {
            isRb = false;
        } else {
            isRb = true;
        }
        kw=""
    }
    if(kw.indexOf("mute")!=-1) {
        if(isMute) {
            isMute = false;
        } else {
            isMute = true;
        }
        kw=""
    }
    if(kw.indexOf("1827")!=-1) {
        if($("body").hasClass("gray")) {
            $("body").removeClass("gray")
    } else {
        $("body").addClass("gray")
    }
    kw=""
    }
    if(kw.indexOf("minecraft")!=-1) {
        if(!isM) {
            isM = true;
            nextTetr = {name: "O", matrix: tetrominos["O"], row: -2, col: 4};
            tetromino = {name: "O", matrix: tetrominos["O"], row: -2, col: 4};
        }
        kw=""
    }
        if(kw.indexOf("auto")!=-1) {
        if(!BotOn) {
            BotOn = true;
            aiTest();
        }
        kw=""
    }

    if (e.which === 37 || e.which === 39||e.key === "a"||e.key==="d") {
        const col = e.which === 37||e.key === "a"
        ? tetromino.col - 1
        : tetromino.col + 1;

        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }

    if (e.which === 38||e.key==="w") {
        const matrix = rotate(tetromino.matrix);
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
            if(audio!=null) audio.blockRotate.play();
        }
    }

    if(e.which === 40||e.key==="s") {
        const row = tetromino.row + 1;

        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            placeTetromino();
            return;
        }
        tetromino.row = row;
    }
    
    if(e.key===" ") {
        for(var n=tetromino.row;n<20;n++) {
            if (!isValidMove(tetromino.matrix, n, tetromino.col)) {
                tetromino.row = n-1;
                placeTetromino();
                break
            }
        }
    }
    if ( e.keyCode == 123) { 

        e.preventDefault();

        e.returnValue = false;

    }
});



    rAF = requestAnimationFrame(loop);
    nextTetr = getNextTetromino();
    showNextTetr();

    Object.defineProperty(console, '_commandLineAPI', { get : function() { throw '콘솔을 사용할 수 없습니다.' } });

console.log("하하 호호 이스터에그");


