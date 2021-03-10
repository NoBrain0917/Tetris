
const A = -3.78;
const B = -8.8;
const C = -0.59;
const D = 8.2;
/*
const A = -0.510066
const B = -0.35663
const C = -0.184483
const D = 7.60666
*/
const E = 3.7;
const F = 2.5;
const G = 4.0;
const moveCount = {"O":1,"I":2,"S":2,"Z":2,"L":4,"J":4,"T":4};

Object.prototype.clone = function() {
    return Object.assign({},this);
}

Array.prototype.clone = function() {
    var a = JSON.parse(JSON.stringify(this))
    a[-1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    a[-2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    return a;
}

AI = function() {
}

AI.prototype.run = function(pf, t) {
    
    var maxCol = 0;
    var minCol = 0;
    var filed = pf.clone();
    var tetro = t.clone();
    var landRow = 0;
    var score = 0;
    var bestScore = null;
    var matrix = null;

    for(var n=0;n<moveCount[tetro.name];n++) {
        if(n>0) {
            if(matrix==null) {
                matrix = rotate(tetro.matrix);
                tetro.matrix = matrix;
            } else {
                matrix = rotate(matrix);
                tetro.matrix = matrix;
            }
        }
        for(var z=10;z>0;z--) {
            if (isMove(tetro.matrix, -2, z, filed)) {
                maxCol = z;
                break;
            }
        }
        for(var i=-2;i<10;i++) {
            if (isMove(tetro.matrix, -2, i,filed)) {
                minCol = i;
                break;
            }
        }
        
        for (var col= minCol; col < maxCol+1; col++) {
            filed = pf.clone();
            tetro = t.clone();
            if(n>0) tetro.matrix = matrix;
            for(var row=0;row<20;row++) {
                if (!isMove(tetro.matrix, row, col,filed)) {
                    landRow = row-1
                    break;
                }
            }
            tetro.row = landRow;
            tetro.col = col;
            if(!gameOver) place(filed, tetro);

            result = (A*totalAdd(filed)) + (B*holes(filed).length) + (C*bumpiness(filed)) + (D*lines(filed)) +(G*bumpBlock(filed,tetro))
            score = {"col":col,"score":result,"matrix":tetro.matrix};
            if(bestScore==null) bestScore = score
            if(bestScore.score<score.score) bestScore = score;
        }
    }
    return bestScore;
}

totalAdd = function(filed) {
    var add = 0;
    var df = false;
    for(var x=0;x<10;x++) {
        for(var y=0;y<filed.length;y++) {
            if(filed[y][x]!=0) {
                add += 20-y;
                break;
            }
        }
    }
    return add;
}

holes = function(filed){
    var result = [];
    for(var c = 0; c < 10; c++){
        var block = false;
        for(var r = 0; r < filed.length; r++){
            if (filed[r][c] != 0) {
                block = true;
            }else if (filed[r][c] == 0 && block){
                result.push({"x":c,"y":r})
            }
        }
    }
    return result;
};

isLine = function(row,filed){
    for(var c = 0; c < 10; c++){
        if (filed[row][c] == 0){
            return false;
        }
    }
    return true;
};

bumpBlock = function(filed,tet) {
    var total = 0;
    for(var n=0;n<tet.matrix.length;n++) {
        if(filed[tet.row+1][tet.col+n]!=0) {
            total++
            
        }
    }
    return total;

}

lines = function(filed){
    var count = 0;
    for(var r = 0; r < filed.length; r++){
        if (isLine(r,filed)){
            count++;
        }
    }
    return count;
};

columnHeight = function(filed, column){
    var r = 0;
    for(; r < filed.length && filed[r][column] == 0; r++);
    return filed.length - r;
};

bumpiness = function(filed){
    var total = 0;
    for(var c = 0; c < 10 ; c++){
        total += Math.abs(columnHeight(filed,c) - columnHeight(filed,c+ 1));
    }
    return total;
}

blockOver = function(filed) {
    var hole = holes(filed);
    hole.sort(function(left, right){
        return right.y - left.y;
    }); 
    var total = 0;
    var alreadyX = [];
    var h = null;
    for(var n=0;n<hole.length;n++) {
        h = hole[n];
        if(alreadyX.indexOf(h.x)!=-1) continue;
        for(var y=0;y<filed.length;y++) {
            if(filed[y][h.x]!=0) {
                if(y>=h.y) break
                total++;
                alreadyX.push(h.x)
            }
        }
    }
    return total;
}

place = function(field, tetrom) {
    for (let row = 0; row < tetrom.matrix.length; row++) {
        for (let col = 0; col < tetrom.matrix[row].length; col++) {
            if (tetrom.matrix[row][col]) {
                field[tetrom.row + row][tetrom.col + col] = tetrom.name;
                }
            }
        }
        return field
}

isMove = function(matrix, cellRow, cellCol, field) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                cellCol + col < 0 ||
                cellCol + col >= field[0].length ||
                cellRow + row >= field.length ||
                field[cellRow + row][cellCol + col])) {
                    return false;
                }
            }
        }
    return true;
}


standardDeviation = function(filed) {
    var total = []
    for(var c=0;c<10;c++) {
        total[c] = columnHeight(filed,c);
    }
    var average = total.reduce((a, b) => a + b) / total.length;
    for(var c=0;c<total.length;c++) {
        total[c] -= average;
        total[c] = total[c]*total[c];
    }
    return Math.sqrt((total.reduce((a, b) => a + b)/total.length))
    
}

reachWall = function(filed,tetro) {
    var total =0;
    for(var i=0;i<tetro.matrix.length;i++) {
        for(var j=0;j<tetro.matrix[i].length;j++) {

            if(tetro.matrix[i][j]==1){
                if(filed[tetro.row+i][tetro.col-j]!=0) {
                    total++
                    console.log(tetro.row+i,tetro.col-j)
                }
                
            }
        }
    }
    return total;
}