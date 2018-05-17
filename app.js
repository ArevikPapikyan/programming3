var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var Grass = require('./public/classes/class.grass.js');
var Xotaker = require('./public/classes/class.xotaker.js');
var Gishatich = require('./public/classes/class.gishatich.js');
var Amenaker = require('./public/classes/class.amenaker.js');
var Bomb = require('./public/classes/class.bomb.js');

app.use(express.static("."));
app.get('/', function (req, res) {
    res.redirect('public');
});
server.listen(3000);

global.grassArr = [];
global.xotakerArr = [];
global.gishatichArr = [];
global.amenakerArr = [];
global.yndhanur = [];

global.w = 30;
global.h = 30;
global.side = 22;

io.sockets.emit('sending w, h, side', [w, h, side]);

global.matrix = [];

function genMatrix(w, h) {
    var matrix = [];
    for (var y = 0; y < h; y++) {
        matrix[y] = [];
        for (var x = 0; x < w; x++) {
            var r = Math.floor(Math.random() * 105);
            if (r < 20) r = 0;
            else if (r < 65) r = 1; // grass
            else if (r < 90) r = 2; // Xotaker
            else if (r < 100) r = 3; // Gishatich
            else if (r < 105) r = 4; // Amenaker
            matrix[y][x] = r;
        }
    }
    return matrix;
}

matrix = genMatrix(w, h);
io.on('connection', function (socket) {
    var dataToSend = [w, h, side];
    io.emit('sending width, height, side', dataToSend);
    socket.on('matrix', function (data) {
        matrix = data;
    });

    var grassArr = [], xotakerArr = [], gishatichArr = [], amenakerArr = [], yndhanur = [];

    setInterval(function () {
        for (var y in matrix) {
            for (var x in matrix[y]) {
                if (matrix[y][x] == 1) {
                    grassArr.push(new Grass(x * 1, y * 1, 1));
                }
                else if (matrix[y][x] == 2) {
                    xotakerArr.push(new Xotaker(x * 1, y * 1, 2));
                }
                else if (matrix[y][x] == 3) {
                    gishatichArr.push(new Gishatich(x * 1, y * 1, 3));
                }
                else if (matrix[y][x] == 4) {
                    amenakerArr.push(new Amenaker(x * 1, y * 1, 4))
                }
            }
        }

        io.sockets.emit("matrix", matrix);

        for (var i in grassArr) {
            yndhanur.push(grassArr[i]);
        }
        for (var i in xotakerArr) {
            yndhanur.push(xotakerArr[i]);
        }
        for (var i in gishatichArr) {
            yndhanur.push(gishatichArr[i]);
        }

        for (var i in grassArr) {
            grassArr[i].mul();
        }

        for (var i in xotakerArr) {
            xotakerArr[i].bazmanal();
            xotakerArr[i].utel();
            xotakerArr[i].mahanal();
        }

        for (var i in gishatichArr) {
            gishatichArr[i].bazmanal();
            gishatichArr[i].utel();
            gishatichArr[i].mahanal();
        }

        for (var i in amenakerArr) {
            amenakerArr[i].bazmanal();
            amenakerArr[i].utel();
            amenakerArr[i].mahanal();
        }

    }, 1500);
    var arr = [grassArr, xotakerArr, gishatichArr, amenakerArr, yndhanur]
    io.emit('sending arrays', arr);

});


// _______________BOMB_________________

bombArr = [];

setInterval(function () {
    var x = Math.floor(Math.random() * matrix[0].length);
    var y = Math.floor(Math.random() * matrix.length);
    bombArr.push(new Bomb(x, y));
    for (var i in bombArr) {
        bombArr[i].paytel();
    }
}, 1500);


// ___________STATISTICS______________

var statistics = {
    'xoteri qanak': grassArr.length,
    'xotakerneri qanak': xotakerArr.length,
    'gishatichneri qanak': gishatichArr.length,
    'amenakerneri qanak': amenakerArr.length,
    'bomberi qanak': bombArr.length,
}

setInterval(function () {

    statistics["xoteri qanak"] = grassArr.length;
    statistics["xotakerneri qanak"] = xotakerArr.length;
    statistics["gishatichneri qanak"] = gishatichArr.length;
    statistics["amenakerneri qanak"] = amenakerArr.length;
    statistics["bomberi qanak"] = bombArr.length;

    fs.writeFile('statistics.json', JSON.stringify(statistics), function (err) {
        if (err) throw err;
    });
}, 10000);

// problem with statistics