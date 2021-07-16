class Game {
    constructor() {
        this._sizeX = 90;
        this._sizeY = 48;
        this._sizePixel = 10;
        this._height = this._sizeY * this._sizePixel;
        this._width = this._sizeX * this._sizePixel;
        this._speed = 200;
        this._isStarted = false;
        this._isPaused = true;
        this._isCell = false; // Если true использвуется класс Cell, иначе boolean
        this._isBiom = false;
        this._isRandomCell = false;
        this._fieldBiom = [];
        this._fieldBiomColor = [];
        this._countCycles = 0;
        this._yearDethGlobal = 4;
        this._saveFromGlobal = 2;
        this._saveToGlobal = 3;
        this._reprodGlobal = 3;
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
        this._mapButton = document.getElementById('map');
        this._mapButton.addEventListener('click', this._onClickMapButton.bind(this));
        this._mapButton.style.opacity = 0.6;
        this._mapButton.disabled = true;
        this._settingBiom = document.getElementById('settingBiom');
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
        if (this._sizePixelSlider.value === '2') {
            this._widthSlider.disabled = false;
            this._heightSlider.disabled = false;
        }
        this._sizePixelSlider.disabled = false;
        this._speedSlider.disabled = false;
        this._field = this._emptyField(this._isCell);
        this._ctx.clearRect(0, 0, this._width, this._height);
    }
    _onClickRandomButton() {
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._field = this._emptyField(this._isCell);
        this._randomField(100);
        if (this._isBiom)
            this._drawField();
        this._drawCell();
    }
    _onClickMapButton() {
        this._fieldBiom = [];
        this._fieldBiomColor = [];
        this._generateMap();
        this._drawField();
        this._drawCell();
    }
    _onClickCanvas(event) {
        const x = Math.floor(event.offsetX / this._sizePixel);
        const y = Math.floor(event.offsetY / this._sizePixel);
        this._field[y][x] = this._isCell ? new Cell(this._yearDethGlobal) : true;
        this._drawPoint(x, y);
    }
    _makeStep() {
        this._field = this._calculation();
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._isRandomCell ? this._randomField(this._chanceRandomCell) : '';
        this._drawField(); // if biom
        this._drawCell();
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
                        const neighborsFrom = this._isBiom ? this._field[y][x].getSaveFrom() : this._saveFromGlobal;
                        const neighborsTo = this._isBiom ? this._field[y][x].getSaveTo() : this._saveToGlobal;
                        if (neighbors < neighborsFrom || neighbors > neighborsTo) {
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
                        const reproduction = this._isBiom ? 3 + this._fieldBiom[y][x].getConditionReprod() : this._reprodGlobal;
                        const cell = this._isBiom ? new Cell(4, this._fieldBiom[y][x]) : new Cell(this._yearDethGlobal);
                        calculationField[y][x] = (neighbors === reproduction) ? cell : undefined;
                    }
                }
                else { // Стандартная
                    if (this._field[y][x]) {
                        calculationField[y][x] = (neighbors < this._saveFromGlobal || neighbors > this._saveToGlobal) ? false : true;
                    }
                    else {
                        calculationField[y][x] = (neighbors === this._reprodGlobal) ? true : false;
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
    _generateMap() {
        const res = (this._sizeX + this._sizeY) / 5;
        const frame = 20;
        const frameres = 5;
        const spaceRangeX = Math.ceil(this._sizeX / res);
        const spaceRangeY = Math.ceil(this._sizeY / res);
        const frameRange = Math.floor(frame / frameres);
        const noise = new PerlinNoise([spaceRangeX, spaceRangeY, frameRange]);
        for (let i = 0; i < frame; i++) {
            for (let y = 0; y < this._sizeY; y++) {
                let colors = [];
                let bioms = [];
                for (let x = 0; x < this._sizeX; x++) {
                    const pixel = (noise.getPointNoise([x / res, y / res]) + 1) / 2;
                    let color;
                    let biom;
                    if (pixel < 0.25) {
                        color = '#000077';
                        biom = 'sea';
                    }
                    else if (pixel < 0.32) {
                        color = '#0000BB';
                        biom = 'sea';
                    }
                    else if (pixel < 0.35) {
                        color = '#2222FF';
                        biom = 'sea';
                    }
                    else if (pixel < 0.45) {
                        color = '#EBBC50';
                        biom = 'beach';
                    }
                    else if (pixel < 0.65) {
                        color = '#00AA00';
                        biom = 'forest';
                    }
                    else if (pixel < 0.75) {
                        color = '#007700';
                        biom = 'forest';
                    }
                    else if (pixel < 0.8) {
                        color = '#666666';
                        biom = 'mountain';
                    }
                    else if (pixel < 0.83) {
                        color = '#555555';
                        biom = 'mountain';
                    }
                    else {
                        color = '#DDDDDD';
                        biom = 'mountain';
                    }
                    colors.push(color);
                    bioms.push(new Biom(biom));
                    // this._ctx.fillStyle = color;
                    // this._drawPoint(x, y);
                }
                this._fieldBiomColor.push(colors);
                this._fieldBiom.push(bioms);
            }
        }
    }
    _drawPoint(x, y) {
        this._ctx.fillStyle = this._isCell ? '#00C800' : '#000000';
        this._ctx.fillRect(x * this._sizePixel, y * this._sizePixel, this._sizePixel, this._sizePixel);
    }
    _drawCell() {
        for (let y = 0; y < this._sizeY; y++) {
            for (let x = 0; x < this._sizeX; x++) {
                if (this._field[y][x]) {
                    this._ctx.fillStyle = this._isCell ? this._field[y][x].getColor() : '#000000';
                    this._ctx.fillRect(x * this._sizePixel, y * this._sizePixel, this._sizePixel, this._sizePixel);
                }
            }
        }
    }
    _drawField() {
        for (let y = 0; y < this._sizeY; y++) {
            for (let x = 0; x < this._sizeX; x++) {
                if (this._isBiom) {
                    this._ctx.fillStyle = this._fieldBiomColor[y][x];
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
                    if (this._isCell) {
                        this._field[y][x] = this._isBiom ? new Cell(4, this._fieldBiom[y][x]) : new Cell(this._yearDethGlobal);
                    }
                    else {
                        this._field[y][x] = true;
                    }
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
        this._yearDethGlobal = this._lifeSlider.value;
        this._lifeText.textContent = this._yearDethGlobal.toString();
    }
    _onSlideSave() {
        if (this._saveSliderOne.value <= this._saveSliderTwo.value) {
            this._saveFromGlobal = this._saveSliderOne.value;
            this._saveToGlobal = this._saveSliderTwo.value;
        }
        else {
            this._saveSliderOne.value = this._saveToGlobal;
            this._saveSliderTwo.value = this._saveFromGlobal;
        }
        this._saveText.textContent = this._saveFromGlobal != this._saveToGlobal ? `${this._saveFromGlobal} - ${this._saveToGlobal}` : `${this._saveFromGlobal}`;
    }
    _onSlideReprod() {
        this._reprodGlobal = parseInt(this._reprodSlider.value);
        this._reprodText.textContent = this._reprodGlobal.toString();
    }
    _onSlideType() {
        this._isCell = (this._typeSlider.value === '1') ? false : true;
        this._isBiom = (this._typeSlider.value === '3') ? true : false;
        this._saveSliderOne.disabled = (this._typeSlider.value === '3') ? true : false;
        this._saveSliderTwo.disabled = (this._typeSlider.value === '3') ? true : false;
        this._reprodSlider.disabled = (this._typeSlider.value === '3') ? true : false;
        this._lifeSlider.disabled = (this._typeSlider.value === '2') ? false : true;
        this._settingBiom.style.opacity = (this._typeSlider.value === '3') ? 1 : 0;
        this._mapButton.disabled = (this._typeSlider.value === '3') ? false : true;
        this._mapButton.style.opacity = (this._typeSlider.value === '3') ? 1 : 0.6;
        switch (this._typeSlider.value) {
            case '1':
                this._typeText.textContent = 'Стандартный';
                this._ctx.fillStyle = '#000000';
                break;
            case '2':
                this._typeText.textContent = 'Клетки с возрастом';
                this._ctx.fillStyle = '#00C800';
                break;
            case '3':
                this._typeText.textContent = 'Биомы';
                this._ctx.fillStyle = '#00C800';
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
    constructor(old, biom) {
        this._age = 0;
        this._yearOfDeath = 4;
        this._saveFrom = 2;
        this._saveTo = 3;
        this._reprod = 3;
        this._yearOfDeath = old ? old : this._yearOfDeath;
        this._colorsByYear = this._createColors();
        if (biom) {
            this._biom = biom;
            this._yearOfDeath += this._biom.getConditionLife();
            this._saveFrom += this._biom.getConditionSaveFrom();
            this._saveTo += this._biom.getConditionSaveTo();
            this._reprod += this._biom.getConditionReprod();
        }
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
    getYearOfDeath() {
        return this._yearOfDeath;
    }
    getSaveFrom() {
        return this._saveFrom;
    }
    getSaveTo() {
        return this._saveTo;
    }
    getReprod() {
        return this._reprod;
    }
    checkOld() {
        return this._age > this._yearOfDeath;
    }
}
class Biom {
    constructor(name) {
        this._name = name;
        switch (this._name) {
            case 'sea':
                this._conditionLife = -2; // 2
                this._conditionSaveFrom = -1; // 1 - 2 
                this._conditionSaveTo = -1; // 
                this._conditionReprod = -1; // 2 
                break;
            case 'beach':
                this._conditionLife = 4; // 8
                this._conditionSaveFrom = -1; // 1 - 4
                this._conditionSaveTo = 1;
                this._conditionReprod = -1; // 2
                break;
            case 'forest':
                this._conditionLife = 16; // 20
                this._conditionSaveFrom = 0; // 2 - 3
                this._conditionSaveTo = 0;
                this._conditionReprod = 0; // 3
                break;
            case 'mountain':
                this._conditionLife = -2; // 2
                this._conditionSaveFrom = 0; // 2 - 5
                this._conditionSaveTo = 2;
                this._conditionReprod = 0; // 3
                break;
        }
    }
    getName() {
        return this._name;
    }
    getConditionLife() {
        return this._conditionLife;
    }
    getConditionSaveFrom() {
        return this._conditionSaveFrom;
    }
    getConditionSaveTo() {
        return this._conditionSaveTo;
    }
    getConditionReprod() {
        return this._conditionReprod;
    }
    setConditionLife(value) {
        this._conditionLife = value;
    }
    setConditionSaveFrom(value) {
        this._conditionSaveFrom = value;
    }
    setConditionSaveTo(value) {
        this._conditionSaveTo = value;
    }
    setConditionReprod(value) {
        this._conditionReprod = value;
    }
}
class PerlinNoise {
    constructor(tile, octaves, unbias) {
        this._dimension = 2;
        this._octaves = 1;
        this._unbias = false;
        this._scaleFactor = 2 * Math.pow(this._dimension, -0.5);
        this._gradient = new Map();
        this._tile = tile;
        this._tile.push(0, 0);
        this._octaves = octaves ? octaves : this._octaves;
        this._unbias = unbias ? unbias : this._unbias;
    }
    _generateGradient() {
        let randomPoint = [];
        for (let i = 0; i < this._dimension; i++) {
            randomPoint.push(this._randomGauss(0, 1));
        }
        let sum;
        let scale = randomPoint.map(i => sum += Math.pow(i, 2), sum = 0).reverse()[0];
        scale = Math.pow(scale, -0.5);
        let vector = [];
        for (let coord of randomPoint) {
            vector.push(coord * scale);
        }
        return vector;
    }
    _getPlainNoise(point) {
        let gridCoords = [];
        for (let coord of point) {
            const minCoord = Math.floor(coord);
            const maxCoord = minCoord + 1;
            gridCoords.push([minCoord, maxCoord]);
        }
        let product = [];
        for (let item of gridCoords[0]) {
            product.push([item, gridCoords[1][0]]);
            product.push([item, gridCoords[1][1]]);
        }
        let dots = [];
        for (let gridPoint of product) {
            let exist = false;
            for (let keys of this._gradient.keys()) {
                if (keys && gridPoint[0] === keys[0] && gridPoint[1] === keys[1]) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                this._gradient.set(gridPoint, this._generateGradient());
            }
            let gradient = [];
            for (let keys of this._gradient.keys()) {
                if (keys && gridPoint[0] === keys[0] && gridPoint[1] === keys[1]) {
                    gradient = this._gradient.get(keys);
                    break;
                }
            }
            let dot = 0;
            for (let i = 0; i < this._dimension; i++) {
                dot += gradient[i] * (point[i] - gridPoint[i]);
            }
            dots.push(dot);
        }
        let dim = this._dimension;
        while (dots.length > 1) {
            dim -= 1;
            const s = this._smoothstep(point[dim] - gridCoords[dim][0]);
            const nextDots = [];
            while (dots.length > 0) {
                nextDots.push(this._lerp(s, dots.shift(), dots.shift()));
            }
            dots = nextDots;
        }
        return dots[0] * this._scaleFactor;
    }
    getPointNoise(point) {
        let ret = 0;
        for (let oct = 0; oct < this._octaves; oct++) {
            const octTwo = 1 << oct;
            const newPoint = [];
            for (let i = 0; i < point.length; i++) {
                let coord = point[i];
                coord *= octTwo;
                if (this._tile[i]) {
                    coord %= this._tile[i] * octTwo;
                }
                newPoint.push(coord);
            }
            ret += this._getPlainNoise(newPoint) / octTwo;
        }
        ret /= 2 - Math.pow(2, (1 - this._octaves));
        if (this._unbias) {
            let r = (ret + 1) / 2;
            for (let i = 0; i < Math.floor(this._octaves / 2 + 0.5); i++) {
                r = this._smoothstep(r);
            }
            ret = r * 2 - 1;
        }
        return ret;
    }
    _randomGauss(mean, stdDev) {
        const u1 = 1 - Math.random();
        const u2 = 1 - Math.random();
        const stdNormal = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        const randNormal = mean + stdDev * stdNormal;
        return randNormal;
    }
    _smoothstep(t) {
        return t * t * (3 - 2 * t);
    }
    _lerp(t, a, b) {
        return a + t * (b - a);
    }
}
const game = new Game();
