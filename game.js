class Game {
    constructor() {
        this._isStarted = false;
        this._isPaused = true;
        this._sizeX = 75;
        this._sizeY = 45;
        this._countCycles = 0;
        this._sizePixel = 10;
        this._height = this._sizeY * this._sizePixel;
        this._width = this._sizeX * this._sizePixel;
        this._canvas = document.getElementById('field');
        this._canvas.addEventListener('click', this._onClickCanvas.bind(this));
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._canvas.style.height = this._height;
        this._canvas.style.width = this._width;
        this._startButton = document.getElementById('start');
        this._startButton.addEventListener('click', this._start.bind(this));
        this._pauseButton = document.getElementById('pause');
        this._pauseButton.addEventListener('click', this._pause.bind(this));
        this._refreshButton = document.getElementById('refresh');
        this._refreshButton.addEventListener('click', this._refresh.bind(this));
        this._randomButton = document.getElementById('randomField');
        this._randomButton.addEventListener('click', this._onClickRandomButton.bind(this));
        this._cycles = document.getElementById('cycles');
        this._ctx = this._canvas.getContext('2d');
        this._field = this._emptyField();
    }
    _start() {
        if (!this._isStarted || this._isPaused) {
            this._isStarted = true;
            this._isPaused = false;
            this._randomButton.disabled = true;
            this._interval = setInterval(() => {
                this._field = this._calculation();
                this._ctx.clearRect(0, 0, this._width, this._height);
                this._drawField();
                this._countCycles++;
                this._cycles.textContent = this._countCycles.toString();
            }, 50);
        }
    }
    _pause() {
        clearInterval(this._interval);
        this._isPaused = true;
    }
    _refresh() {
        clearInterval(this._interval);
        this._isStarted = false;
        this._isPaused = false;
        this._countCycles = 0;
        this._cycles.textContent = this._countCycles.toString();
        this._randomButton.disabled = false;
        this._field = this._emptyField();
        this._ctx.clearRect(0, 0, this._width, this._height);
    }
    _onClickRandomButton() {
        this._randomButton.disabled = true;
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._field = this._randomField();
        this._drawField();
    }
    _onClickCanvas(event) {
        const x = Math.floor(event.offsetX / this._sizePixel);
        const y = Math.floor(event.offsetY / this._sizePixel);
        this._field[y][x] = true;
        this._drawPoint(x, y);
    }
    _calculation() {
        let calculationField = this._emptyField();
        for (let y = 0; y < this._sizeY; y++) {
            for (let x = 0; x < this._sizeX; x++) {
                let neighbors = this._countNeighbors(x, y);
                if (this._field[y][x]) {
                    calculationField[y][x] = neighbors < 2 || neighbors > 3 ? false : true;
                }
                else {
                    calculationField[y][x] = neighbors == 3 ? true : false;
                }
            }
        }
        return calculationField;
    }
    _countNeighbors(x, y) {
        let sum = 0;
        let minY = (y == 0) ? 0 : y - 1;
        let minX = (x == 0) ? 0 : x - 1;
        let maxY = (y == this._sizeY - 1) ? this._sizeY - 1 : y + 1;
        let maxX = (x == this._sizeX - 1) ? this._sizeX - 1 : x + 1;
        for (let i = minY; i <= maxY; i++) {
            for (let j = minX; j <= maxX; j++) {
                if (x == j && y == i)
                    continue;
                if (this._field[i][j])
                    sum++;
            }
        }
        return sum;
    }
    _emptyField() {
        let arrayField = [];
        for (let i = 0; i < this._sizeY; i++) {
            let localArray = [];
            for (let j = 0; j < this._sizeX; j++) {
                localArray.push(false);
            }
            arrayField.push(localArray);
        }
        return arrayField;
    }
    _drawPoint(x, y) {
        this._ctx.fillRect(x * this._sizePixel, y * this._sizePixel, this._sizePixel, this._sizePixel);
    }
    _drawField() {
        for (let y = 0; y < this._sizeY; y++) {
            for (let x = 0; x < this._sizeX; x++) {
                if (this._field[y][x]) {
                    this._ctx.fillRect(x * this._sizePixel, y * this._sizePixel, this._sizePixel, this._sizePixel);
                }
            }
        }
    }
    _randomField() {
        let randomField = this._emptyField();
        for (let i = 0; i < (this._sizeX * this._sizeY) / 5; i++) {
            const x = Math.floor(Math.random() * (this._sizeX));
            const y = Math.floor(Math.random() * (this._sizeY));
            randomField[y][x] = true;
        }
        return randomField;
    }
}
const game = new Game();
