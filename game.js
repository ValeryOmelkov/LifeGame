class Game {
    constructor() {
        this._sizeX = 76;
        this._sizeY = 46;
        this._sizePixel = 10;
        this._height = this._sizeY * this._sizePixel;
        this._width = this._sizeX * this._sizePixel;
        this._speed = 200;
        this._isStarted = false;
        this._isPaused = true;
        this._isCell = false; // Если true использвуется класс Cell, иначе boolean
        this._isRandomCell = false;
        this._countCycles = 0;
        this._yearDeth = 4;
        this._saveFrom = 2;
        this._saveTo = 3;
        this._reprod = 3;
        this._chanceRandomCell = 0;
        //Канвас
        this._canvas = document.getElementById('field');
        this._canvas.addEventListener('click', this._onClickCanvas.bind(this));
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._canvas.style.height = this._height;
        this._canvas.style.width = this._width;
        this._ctx = this._canvas.getContext('2d');
        // Текстовые элементы для слайдеров 
        this._typeText = document.getElementById('typeText');
        this._widthText = document.getElementById('widthText');
        this._heightText = document.getElementById('heightText');
        this._sizePixelText = document.getElementById('sizePixelText');
        this._speedText = document.getElementById('speedText');
        this._lifeText = document.getElementById('lifeText');
        this._saveText = document.getElementById('saveText');
        this._reprodText = document.getElementById('reprodText');
        this._randomCellText = document.getElementById('randomCellText');
        // Слайдеры
        this._typeSlider = document.getElementById('typeSlider');
        this._widthSlider = document.getElementById('widthSlider');
        this._heightSlider = document.getElementById('heightSlider');
        this._sizePixelSlider = document.getElementById('sizePixelSlider');
        this._speedSlider = document.getElementById('speedSlider');
        this._lifeSlider = document.getElementById('lifeSlider');
        this._saveSliderOne = document.getElementById('saveSliderOne');
        this._saveSliderTwo = document.getElementById('saveSliderTwo');
        this._reprodSlider = document.getElementById('reprodSlider');
        this._randomCellSlider = document.getElementById('randomCellSlider');
        this._typeSlider.oninput = this._onSlideType.bind(this);
        this._widthSlider.oninput = this._onSlideWidth.bind(this);
        this._heightSlider.oninput = this._onSlideHeight.bind(this);
        this._sizePixelSlider.oninput = this._onSlideSizePixel.bind(this);
        this._speedSlider.oninput = this._onSlideSpeed.bind(this);
        this._lifeSlider.oninput = this._onSlideLife.bind(this);
        this._saveSliderOne.oninput = this._onSlideSave.bind(this);
        this._saveSliderTwo.oninput = this._onSlideSave.bind(this);
        this._reprodSlider.oninput = this._onSlideReprod.bind(this);
        this._randomCellSlider.oninput = this._onSlideRandomCell.bind(this);
        // Кнопки
        this._playAndPause = document.getElementById('startAndPause');
        this._playAndPause.addEventListener('click', this._onClickPlayOrPause.bind(this));
        this._stepButton = document.getElementById('step');
        this._stepButton.addEventListener('click', this._makeStep.bind(this));
        this._refreshButton = document.getElementById('refresh');
        this._refreshButton.disabled = true;
        this._refreshButton.style.opacity = 0.6;
        this._refreshButton.addEventListener('click', this._refresh.bind(this));
        this._randomButton = document.getElementById('randomField');
        this._randomButton.addEventListener('click', this._onClickRandomButton.bind(this));
        // Поле
        this._field = this._emptyField(this._isCell);
        this._cycles = document.getElementById('cycles');
    }
    _onClickPlayOrPause() {
        if (!this._isStarted) {
            this._playAndPause.src = 'image/pause.png';
            this._isStarted = true;
            this._typeSlider.disabled = true;
            this._widthSlider.disabled = true;
            this._heightSlider.disabled = true;
            this._sizePixelSlider.disabled = true;
            this._speedSlider.disabled = true;
            this._stepButton.disabled = true;
            this._stepButton.style.opacity = 0.6;
            this._randomButton.disabled = true;
            this._randomButton.style.opacity = 0.6;
            this._refreshButton.disabled = false;
            this._refreshButton.style.opacity = 1;
            this._intervalStart = setInterval(() => {
                this._makeStep();
            }, this._speed);
        }
        else {
            this._playAndPause.src = 'image/play.png';
            this._isStarted = false;
            clearInterval(this._intervalStart);
            this._stepButton.disabled = false;
            this._stepButton.style.opacity = 1;
            this._speedSlider.disabled = false;
        }
    }
    _refresh() {
        clearInterval(this._intervalStart);
        this._isStarted = false;
        this._isPaused = false;
        this._countCycles = 0;
        this._cycles.textContent = this._countCycles.toString();
        this._randomButton.disabled = false;
        this._randomButton.style.opacity = 1;
        this._refreshButton.disabled = true;
        this._refreshButton.style.opacity = 0.6;
        this._stepButton.disabled = false;
        this._stepButton.style.opacity = 1;
        this._playAndPause.src = 'image/play.png';
        this._typeSlider.disabled = false;
        this._widthSlider.disabled = false;
        this._heightSlider.disabled = false;
        this._sizePixelSlider.disabled = false;
        this._speedSlider.disabled = false;
        this._field = this._emptyField(this._isCell);
        this._ctx.clearRect(0, 0, this._width, this._height);
    }
    _onClickRandomButton() {
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._field = this._emptyField(this._isCell);
        this._randomField(100);
        this._drawField();
    }
    _onClickCanvas(event) {
        const x = Math.floor(event.offsetX / this._sizePixel);
        const y = Math.floor(event.offsetY / this._sizePixel);
        this._field[y][x] = this._isCell ? new Cell(this._yearDeth) : true;
        this._drawPoint(x, y);
    }
    _makeStep() {
        this._field = this._calculation();
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._isRandomCell ? this._randomField(this._chanceRandomCell) : '';
        this._drawField();
        this._countCycles++;
        this._cycles.textContent = this._countCycles.toString();
    }
    _calculation() {
        let calculationField = this._emptyField(this._isCell);
        for (let y = 0; y < this._sizeY; y++) {
            for (let x = 0; x < this._sizeX; x++) {
                let neighbors = this._countNeighbors(x, y);
                if (this._isCell) { // Клетка с возрастом
                    if (this._field[y][x]) {
                        if (neighbors < this._saveFrom || neighbors > this._saveTo) {
                            delete this._field[y][x];
                            calculationField[y][x] = undefined;
                        }
                        else {
                            this._field[y][x].addAge();
                            calculationField[y][x] = this._field[y][x];
                            if (this._field[y][x].checkOld()) {
                                delete this._field[y][x];
                                calculationField[y][x] = undefined;
                            }
                        }
                    }
                    else {
                        calculationField[y][x] = (neighbors === this._reprod) ? new Cell(this._yearDeth) : undefined;
                    }
                }
                else { // Стандартная
                    if (this._field[y][x]) {
                        calculationField[y][x] = (neighbors < this._saveFrom || neighbors > this._saveTo) ? false : true;
                    }
                    else {
                        calculationField[y][x] = (neighbors === this._reprod) ? true : false;
                    }
                }
            }
        }
        return calculationField;
    }
    _countNeighbors(x, y) {
        let sum = 0;
        let minY = (y === 0) ? 0 : y - 1;
        let minX = (x === 0) ? 0 : x - 1;
        let maxY = (y === this._sizeY - 1) ? this._sizeY - 1 : y + 1;
        let maxX = (x === this._sizeX - 1) ? this._sizeX - 1 : x + 1;
        for (let i = minY; i <= maxY; i++) {
            for (let j = minX; j <= maxX; j++) {
                if (x === j && y === i)
                    continue;
                if (this._field[i][j])
                    sum++;
            }
        }
        return sum;
    }
    _emptyField(isCell) {
        let arrayField = [];
        for (let i = 0; i < this._sizeY; i++) {
            let localArray = [];
            for (let j = 0; j < this._sizeX; j++) {
                isCell ? localArray.push(undefined) : localArray.push(false);
            }
            arrayField.push(localArray);
        }
        return arrayField;
    }
    _drawPoint(x, y) {
        this._ctx.fillStyle = this._isCell ? '#00C800' : '#000000';
        this._ctx.fillRect(x * this._sizePixel, y * this._sizePixel, this._sizePixel, this._sizePixel);
    }
    _drawField() {
        for (let y = 0; y < this._sizeY; y++) {
            for (let x = 0; x < this._sizeX; x++) {
                if (this._field[y][x]) {
                    this._isCell ? this._ctx.fillStyle = this._field[y][x].getColor() : '#000000';
                    this._ctx.fillRect(x * this._sizePixel, y * this._sizePixel, this._sizePixel, this._sizePixel);
                }
            }
        }
    }
    _randomField(probability) {
        for (let i = 0; i < (this._sizeX * this._sizeY) / 5; i++) {
            const chance = Math.round(Math.random() * 100);
            if (chance <= probability) {
                const x = Math.floor(Math.random() * (this._sizeX));
                const y = Math.floor(Math.random() * (this._sizeY));
                if (!this._field[y][x]) {
                    this._isCell ? this._field[y][x] = new Cell(this._yearDeth) : this._field[y][x] = true;
                }
            }
        }
    }
    _onSlideWidth() {
        this._sizeX = this._widthSlider.value;
        this._width = this._sizeX * this._sizePixel;
        this._widthText.textContent = this._sizeX.toString();
        this._canvas.width = this._width;
        this._canvas.style.width = this._width;
    }
    _onSlideHeight() {
        this._field = this._emptyField(this._isCell);
        this._sizeY = this._heightSlider.value;
        this._height = this._sizeY * this._sizePixel;
        this._heightText.textContent = this._sizeY.toString();
        this._canvas.height = this._height;
        this._canvas.style.height = this._height;
    }
    _onSlideSizePixel() {
        console.log(typeof this._sizePixelSlider.value);
        switch (this._sizePixelSlider.value) {
            case '1':
                this._sizePixel = 5;
                this._sizeX = this._widthSlider.value * 2;
                this._sizeY = this._heightSlider.value * 2;
                this._widthSlider.disabled = true;
                this._heightSlider.disabled = true;
                break;
            case '2':
                this._sizePixel = 10;
                this._sizeX = this._widthSlider.value;
                this._sizeY = this._heightSlider.value;
                this._widthSlider.disabled = false;
                this._heightSlider.disabled = false;
                break;
            case '3':
                this._sizePixel = 20;
                this._sizeX = Math.ceil(this._widthSlider.value / 2);
                this._sizeY = Math.ceil(this._heightSlider.value / 2);
                this._widthSlider.disabled = true;
                this._heightSlider.disabled = true;
                break;
        }
        this._sizePixelText.textContent = this._sizePixel.toString();
        this._width = this._sizeX * this._sizePixel;
        this._height = this._sizeY * this._sizePixel;
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._canvas.style.height = this._height;
        this._canvas.style.width = this._width;
    }
    _onSlideSpeed() {
        this._speed = this._speedSlider.value;
        const sec = Math.floor(this._speed / 1000);
        const milisec = this._speed - (sec * 1000);
        this._speedText.textContent = milisec < 100 ? `${sec}.0${milisec}` : `${sec}.${milisec}`;
    }
    _onSlideLife() {
        this._yearDeth = this._lifeSlider.value;
        this._lifeText.textContent = this._yearDeth.toString();
    }
    _onSlideSave() {
        if (this._saveSliderOne.value <= this._saveSliderTwo.value) {
            this._saveFrom = this._saveSliderOne.value;
            this._saveTo = this._saveSliderTwo.value;
        }
        else {
            this._saveSliderOne.value = this._saveTo;
            this._saveSliderTwo.value = this._saveFrom;
        }
        this._saveText.textContent = this._saveFrom != this._saveTo ? `${this._saveFrom} - ${this._saveTo}` : `${this._saveFrom}`;
    }
    _onSlideReprod() {
        this._reprod = parseInt(this._reprodSlider.value);
        this._reprodText.textContent = this._reprod.toString();
    }
    _onSlideType() {
        this._isCell = (parseInt(this._typeSlider.value) === 1) ? false : true;
        switch (this._typeSlider.value) {
            case '1':
                this._typeText.textContent = 'Стандартный';
                this._ctx.fillStyle = '#000000';
                this._lifeSlider.disabled = true;
                break;
            case '2':
                this._typeText.textContent = 'Клетки с возрастом';
                this._ctx.fillStyle = '#00C800';
                this._lifeSlider.disabled = false;
                break;
        }
        this._field = this._emptyField(this._isCell);
        this._ctx.clearRect(0, 0, this._width, this._height);
    }
    _onSlideRandomCell() {
        this._chanceRandomCell = this._randomCellSlider.value;
        this._isRandomCell = this._chanceRandomCell > 0 ? true : false;
        this._randomCellText.textContent = `${this._chanceRandomCell}%`;
    }
}
class Cell {
    constructor(old) {
        this._age = 0;
        this._yearOfDeath = 8;
        this._yearOfDeath = old ? old : this._yearOfDeath;
        this._colorsByYear = this._createColors();
    }
    _createColors() {
        const colors = [];
        const step = Math.floor(200 / this._yearOfDeath);
        let red = 0;
        let green = 200;
        colors.push(`#00C800`);
        for (let i = 1; i < this._yearOfDeath; i++) {
            red += step;
            green -= step;
            colors.push(`#${red.toString(16).toUpperCase()}${green.toString(16).toUpperCase()}00`);
        }
        colors.push(`#C80000`);
        return colors;
    }
    getColor() {
        return this._colorsByYear[this._age];
    }
    addAge() {
        this._age++;
    }
    checkOld() {
        return this._age > this._yearOfDeath;
    }
}
const game = new Game();
