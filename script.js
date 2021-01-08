window.onload = function () {
    const LEVEL = 2;
    let countClick = 1;
    const blocks = this.document.getElementsByClassName('single-block');
    for (el of blocks) {
        el.addEventListener('click', clicked);
    }
    const getCountClick = function (sup) {
        let click = 0;
        return function () {
            return click++;
        }
    }
    function clicked() {
        let pes = null;
        // const idCurrentCell = this.id;
        const numberClickedCell = this.id.substring(this.id.length - 1)
        // console.log('numberClickedCell: ', numberClickedCell);
        // all.field[this.id.substring(this.id.length-1)] = 'cross';
        //координата х = ID клєтки % 3;
        //координата y = floor(ID клєтки / 3);
        let cx = Number.parseInt(this.id.substring(this.id.length - 1)) % 3;
        let cy = Math.floor(Number.parseInt(this.id.substring(this.id.length - 1)) / 3);
        // console.log('cx, cy: ', cx, cy);
        // console.log('this: ', this);

        if (all.fieldGetSimbol(cx, cy) == 'empty') {
            // countClick > 0 ? all.move(cx, cy, 'zerro') : all.move(cx, cy, 'cross');
            // all.playSound(snd.step2);
            // all.playSound(snd.step);
            // all.playSound(snd.step);
            all.isWrong = false;
            all.move(cx, cy, 'cross');


            if (LEVEL == 2 && all.field[4] == 'empty') {

                all.computerMove(4, 'zerro');
                // all.playSound(snd.step);
            }
            else {
                pes = all.isMust('zerro', 'empty');     //провіряємо чи є два ворожих символа і одне пусте місце в
                if (pes.free != -1) {
                    //одній лінії
                    all.computerMove(pes.free, 'zerro');
                    // all.playSound(snd.step); 
                }
                else {
                    pes = all.isMust('cross', 'empty'); //провіряємо чи є два своїх символа і одне пусте місце в
                    if (pes.free != -1) {

                        all.computerMove(pes.free, 'zerro');
                        // all.playSound(snd.step);
                        // console.log('1 free place and 2 zerros');
                    }
                    else {
                        pes = all.isFreeTwo('empty', 'zerro'); //провіряємо чи є два пустих місця і один свій символ
                        if (pes.must === true) {

                            all.computerMove(pes.free, 'zerro');
                            // all.playSound(snd.step);
                            // console.log('2 free places and 1 zerro', pes.free);
                        }
                        else {
                            if (all.getRandomFreeCorner() != -1) {
                                // console.log('.sounddddddddddddd');

                                all.computerMove(all.getRandomFreeCorner(), 'zerro');
                                // all.playSound(snd.wrong);
                                // console.log('Corner: ', all.getRandomFreeCorner());
                            }
                            else {
                                if (all.getRandomFreeCells() != -1) {
                                    all.computerMove(all.getRandomFreeCells(), 'zerro');
                                    // console.log('get free cells: ', all.getRandomFreeCells());
                                }
                            }
                        }
                    }
                }
            }
            // console.log('get free cells: ', all.getRandomFreeCells());
        }
        else {
            all.playSound(snd.nothing);
            // document.getElementById(this.id).style.width = '1%';
            all.isWrong = true;

            all.animate(document.getElementById(`img-${numberClickedCell}`));
        }
        countClick *= -1;
        // console.log('countClick: ', countClick);
        // console.log(all.isMust('zerro', 'empty'));
        // console.log('winner: ', all.isWinner());
        // if (all.isWinner() == 'cross' || all.isWinner() == 'zerro') {
        //     all.playSound(snd.win);
        // }

        // console.log('isNothing: ', all.isNothing());
        // if (all.isNothing()) {
        //     all.playSound(snd.nothing);
        // }
        // all.renderField();
        // console.log(this.id.substring(this.id.length - 1))
    }




    const all = {
        countM: 0,
        isWrong: false,
        field: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],

        lines: [
            { x0: 0, y0: 0, x1: 1, y1: 0, x2: 2, Y2: 0 },
            { x0: 0, y0: 1, x1: 1, y1: 1, x2: 2, Y2: 1 },
            { x0: 0, y0: 2, x1: 1, y1: 2, x2: 2, Y2: 2 },

            { x0: 0, y0: 0, x1: 0, y1: 1, x2: 0, Y2: 2 },
            { x0: 1, y0: 0, x1: 1, y1: 1, x2: 1, Y2: 2 },
            { x0: 2, y0: 0, x1: 2, y1: 1, x2: 2, Y2: 2 },

            { x0: 0, y0: 0, x1: 1, y1: 1, x2: 2, Y2: 2 },
            { x0: 0, y0: 2, x1: 1, y1: 1, x2: 2, Y2: 0 }
        ],
        linesV2: [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ],
        renderField() {
            for (let k = 0; k < this.field.length; k++) {
                let name = '';
                switch (this.field[k]) {
                    case 'cross': name = 'cross.png'; break;
                    case 'zerro': name = 'zerro.png'; break;
                    case 'empty': name = ''; break;
                    default: name = '';
                }
                document.getElementById(`img-${k}`).src = name;
            }
        },
        fieldGetSimbol(x, y) {
            return this.field[y * 3 + x];
        },
        move(x, y, symbol) {
            const cell = document.getElementById(`img-${y * 3 + x}`);
            if (this.fieldGetSimbol(x, y) == 'empty') {
                this.field[y * 3 + x] = symbol;
                cell.src = `${symbol}.png`;
                // cell.style.width = '20%';
                this.animate(cell);
            }
        },
        moveByNumber(number, symbol) {
            const cell = document.getElementById(`img-${number}`);
            if (this.field[number] == 'empty') {
                // this.isWrong = false;
                this.field[number] = symbol;
                cell.src = `${symbol}.png`;
                cell.style.width = '1%';
                const th = this;
                function run() {
                    th.animate(cell);

                }

                setTimeout(run, 500);
            }
            //  else {
            //     // alert('computer try do move to cell ', number);
            //     console.log('IS NOT EMPTYYYYYYYYYYY');
            // }

        },
        animate(elem) {
            let t = 0;
            let dWidth = 0;
            const step = 1 / 10;
            const p0 = 0.0;
            const p1 = 1.2;
            const p2 = 0.8;
            const th2 = this;
            let startTime = undefined;
            let lastTime = undefined;

            function run() {
                startTime = new Date();
                dWidth = (1 - t) ** 2 * p0 + 2 * t * (1 - t) * p1 + t ** 2 * p2;
                if (Array.isArray(elem)) {     
                    for (let winCell of elem) {
                        console.log('winCell:', winCell);
                        winCell.style.width = (dWidth * 100).toString() + '%';
                    }
                }
                else {
                    // console.log('elem:',elem);
                    elem.style.width = (dWidth * 100).toString() + '%';
                }
    // console.log('elem.style.width: ', elem.style.width);
    // console.log('t: ', t);

    if (t == 0) {
        if (!all.isWrong)
            th2.playSound(th2.createSound().step);
        // console.log('winner: ', all.isWinner());
        if (all.isWinner().winner == 'cross' || all.isWinner().winner == 'zerro') {
            console.log('win');
            all.playSound(snd.win);
        }

        // console.log('isNothing: ', all.isNothing());
        if (all.isNothing()) {
            all.playSound(snd.wrong);
        }
    }
    lastTime = new Date();
    time = lastTime.getTime() - startTime.getTime();
    // console.log('time: ', time);
    if (t < (1 - step)) {
        requestAnimationFrame(run);
    }
    t += (step * 2);
}
run();
        },
whoMove() {
    let countMove = 0;
    return function () {
        countMove += 1;
        return countMove;
    }
},
is(symbol, elseSymbol) {
    for (line of this.linesV2) {

    }
    // this.lines.forEach(el => el.reduce((akk, val) => akk + ))
},
isMust(symbol, elseSymbol) {
    let free = -1;
    for (line of this.linesV2) {
        let cntEnemySymbols = 0;
        //заняті місця противником
        let sumPlaced = 0;  // сума номерів лінії для знаходження незайнятого місця
        for (let i = 0; i < 3; i++) {
            if (this.field[line[i]] == symbol) {
                cntEnemySymbols++;
                sumPlaced += i;      //сума номерів лінії зайнятої противником
                // console.log('cntEnemySymbols: ', cntEnemySymbols);
            }
        }
        if (cntEnemySymbols == 2) {      //якщо дві клітинки зайняті
            switch (sumPlaced) {
                case 1: free = 2; break;    //0 + 1 = 1     => free:2
                case 2: free = 1; break;    //0 + 2 = 2     => free:1
                case 3: free = 0; break;    //1 + 2 = 3     => free:0
                default: free = -1;
            }
            if (this.field[line[free]] == elseSymbol) {     //і якщо є вільне місце 
                return { must: true, free: line[free] }         //вернути номер поля з вільним місцем
            }
        }
    }
    return { must: false, free: -1 };
},
isFreeTwo(symbol, elseSymbol) {
    let free = -1;
    for (line of this.linesV2) {
        let cntEnemySymbols = 0;
        //заняті місця противником
        let sumPlaced = 0;  // сума номерів лінії для знаходження незайнятого місця
        for (let i = 0; i < 3; i++) {
            if (this.field[line[i]] == symbol) {
                cntEnemySymbols++;
                sumPlaced += i;      //сума номерів лінії зайнятої противником
                // console.log('cntEnemySymbols: ', cntEnemySymbols);
            }
        }
        if (cntEnemySymbols == 2) {      //якщо дві клітинки зайняті
            switch (sumPlaced) {
                case 1: free = 2; break;    //0 + 1 = 1     => free:2
                case 2: free = 1; break;    //0 + 2 = 2     => free:1
                case 3: free = 0; break;    //1 + 2 = 3     => free:0
                default: free = -1;
            }
            if (this.field[line[free]] == elseSymbol) { //і якщо є вільне місце 
                // const freeCels = [0, 1, 2];
                const freeCells = [0, 1, 2].filter(num => num !== free); //виключаємо з рандома заняте місце
                // console.log('freeCells: ', freeCells);
                free = freeCells[Math.floor(Math.random() * 2)];    //вибираємо випадково одне з двох вільних місць
                return { must: true, free: line[free] }         //вернути номер поля з вільним місцем
            }
        }
    }
    return { must: false, free: -1 };
},
isNothing() {
    let countNothingLine = 0;
    let isExistCross = false;
    let isExistZerro = false;
    for (el of this.linesV2) {
        isExistCross = false;
        isExistZerro = false;
        // const [el] = this.field;
        // console.log(el);
        const kit = el
            .filter(elem => this.field[elem] !== 'empty')
            .forEach(elem => {

                if (this.field[elem] == 'zerro') {
                    isExistZerro = true;
                    // console.log('isExistZerro is finded');
                }
                if (this.field[elem] == 'cross') {
                    isExistCross = true;
                    // console.log('isExistCross is finded');
                }
            })
        if (isExistCross && isExistZerro) {
            countNothingLine++;
        }
    }
    return countNothingLine === 8;
    // return countNothingLine;
},
isWinner() {
    const winnerCells = [];
    for (let i = 0; i < this.linesV2.length; i++) {
        if (this.field[this.linesV2[i][0]] == 'cross' && this.field[this.linesV2[i][1]] == 'cross' && this.field[this.linesV2[i][2]] == 'cross') {
            winnerCells.push(document.getElementById(`img-${this.field[this.linesV2[i][0]]}`));
            winnerCells.push(document.getElementById(`img-${this.field[this.linesV2[i][1]]}`));
            winnerCells.push(document.getElementById(`img-${this.field[this.linesV2[i][2]]}`));
            // this.animate(winnerCells);
            return { winner: 'cross', winnerLine: i };
        }
        if (this.field[this.linesV2[i][0]] == 'zerro' && this.field[this.linesV2[i][1]] == 'zerro' && this.field[this.linesV2[i][2]] == 'zerro') {
            winnerCells.push(document.getElementById(`img-${this.linesV2[i][0]}`));
            winnerCells.push(document.getElementById(`img-${this.linesV2[i][1]}`));
            winnerCells.push(document.getElementById(`img-${this.linesV2[i][2]}`));
            // console.log('tttt: ',this.linesV2[i][2]);
            // console.log('winnerCells: ', winnerCells);
            // this.animate(winnerCells);
            
            return { winner: 'zerro', winnerLine: i };
        }
    }
    return { winner: -1, winnerLine: -1 };
},
computerMove(numb, pSimbol) {
    // setTimeout(function(){this.moveByNumber.bind(all, numb, pSimbol)}, 500);
    // this.moveByNumber(numb, pSimbol);

    this.isWrong = false;
    this.moveByNumber(numb, pSimbol);

},
getFirstFreeCorner() {
    const corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
        if (this.field[corners[i]] == 'empty') {
            // console.log('corner: ', this.field[corners[i]]);
            return corners[i];
        }
    }
    return -1;
},
getRandomFreeCorner() {
    // const corners = [0, 2, 6, 8];
    const corners = [0, 2, 6, 8].filter(num => this.field[num] == 'empty');
    // console.log('corners: ', corners);
    if (corners.length > 1) {   //якщо два і більше елементів то вибирати випадково
        return corners[Math.floor(Math.random() * corners.length)];
    }
    else if (corners.length == 1) { //якщо всього один елемент то не вибирати випадково
        return corners[0];
    }
    return -1;
},
getRandomFreeCells(){
    const fld = this.field;
    // const tr = fld.filter(num => fld[num] == 'empty');
    const tr = [];
    for (let i = 0; i < fld.length; i++) {
        if (fld[i] == 'empty') {
            tr.push(i);
        }
    }
    // console.log('tr: ', tr);
    return tr.length > 0 ? tr[Math.floor(Math.random() * tr.length)] : -1;
    // return tr[Math.floor(Math.random() * tr.length)];
},
createSound() {
    let step = new Audio('./sounds/Sound_08079.mp3');
    let step2 = new Audio('./sounds/Sound_08079_copy.mp3');
    let win = new Audio('./sounds/Sound_11088.wav.mp3');
    let wrong = new Audio('./sounds/Sound_11089.wav.mp3');
    let nothing = new Audio('./sounds/Sound_16665.mp3');
    return { step, step2, win, wrong, nothing };
},
playSound(sound) {
    sound.play();
}
    }//all

// console.log(field);
// console.log(all.renderField());
// let pes = all.whoMove();
// pes();
// console.log(all.whoMove()());
// console.log(all.whoMove()());
// console.log(all.whoMove()());
// all.move(2, 2, 'zerro');
// all.move(2, 1, 'zerro');
all.renderField();
const snd = all.createSound();

}