window.onload = function () {
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
        // console.log('pes', typeof this.id);
        // all.field[this.id.substring(this.id.length-1)] = 'cross';
        //координата х = ID клєтки % 3;
        //координата y = floor(ID клєтки / 3);
        let cx = Number.parseInt(this.id.substring(this.id.length - 1)) % 3;
        let cy = Math.floor(Number.parseInt(this.id.substring(this.id.length - 1)) / 3);
        // console.log('cx, cy: ', cx, cy);
        // console.log('this: ', this);

        if (all.fieldGetSimbol(cx, cy) == 'empty') {
            // countClick > 0 ? all.move(cx, cy, 'zerro') : all.move(cx, cy, 'cross');
            all.move(cx, cy, 'cross');
        }
        else alert('Клітинка зайнята, походіть в інше місце!');
        pes = all.isMust('cross', 'empty');     //провіряємо чи є два ворожих символа і одне пусте місце в
        if (pes.free != -1) {                   //одній лінії
            all.computerMove(pes.free, 'zerro');
        } else {
            pes = all.isMust('zerro', 'empty'); //провіряємо чи є два своїх символа і одне пусте місце в
            if (pes.free != -1) {                
                all.computerMove(pes.free, 'zerro');
                console.log('1 free place and 2 zerros');
            } else {
                pes = all.isFreeTwo('empty', 'zerro'); //провіряємо чи є два пустих місця і один свій символ
                if (pes.must === true) {
                    all.computerMove(pes.free, 'zerro');
                    console.log('2 free places and 1 zerro', pes.free);
                } else {                    
                    if (all.getFirstFreeCorner() != -1) {
                        all.computerMove(all.getFirstFreeCorner(), 'zerro');
                        console.log('Corner: ', all.getFirstFreeCorner());
                    }
                }
            }
        }

        countClick *= -1;
        // console.log('countClick: ', countClick);
        // console.log(all.isMust('zerro', 'empty'));
        console.log('winner: ', all.isWinner());

        all.renderField();
        console.log('isNothing: ', all.isNothing());
        // console.log(this.id.substring(this.id.length - 1))
    }




    const all = {
        countM: 0,
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
            if (this.fieldGetSimbol(x, y) == 'empty') {
                this.field[y * 3 + x] = symbol;
            }
        },
        moveByNumber(number, symbol) {
            if (this.field[number] == 'empty') {
                this.field[number] = symbol;
            }else {
                alert('computer try do move to cell ', number);
            }

        },
        whoMove() {
            let countMove = 0;
            return function () {
                countMove += 1;
                return countMove;
            }
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
                        console.log('freeCells: ', freeCells);
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
            for (el of this.linesV2) {
                if (this.field[el[0]] == 'cross' && this.field[el[1]] == 'cross' && this.field[el[2]] == 'cross')
                    return 'cross';
                if (this.field[el[0]] == 'zerro' && this.field[el[1]] == 'zerro' && this.field[el[2]] == 'zerro')
                    return 'zerro';
            }
            return -1;
        },
        computerMove(numb, pSimbol) {
            // setTimeout(function(){this.moveByNumber.bind(all, numb, pSimbol)}, 500);
            this.moveByNumber(numb, pSimbol);
        },
        getFirstFreeCorner() {
            const corners = [0, 2, 6, 8];
            for (let i = 0; i < corners.length; i++) {
                if (this.field[corners[i]] == 'empty'){
                    // console.log('corner: ', this.field[corners[i]]);
                    return corners[i];                    
                }
            }
            return -1;
        }


    }//all

    // console.log(field);
    console.log(all.renderField());
    // let pes = all.whoMove();
    // pes();
    // console.log(all.whoMove()());
    // console.log(all.whoMove()());
    // console.log(all.whoMove()());
    // all.move(2, 2, 'zerro');
    // all.move(2, 1, 'zerro');
    all.renderField();

}