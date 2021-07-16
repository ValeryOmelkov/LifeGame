class Game {
    protected _canvas: any;
    public _ctx: any;

    protected _sizeX: number = 90;
    protected _sizeY: number = 48;
    protected _sizePixel: number = 10;
    protected _height: number = this._sizeY * this._sizePixel;
    protected _width: number = this._sizeX * this._sizePixel;
    protected _speed: number = 200;

    protected _isStarted: boolean = false;
    protected _isPaused: boolean = true;
    protected _isCell: boolean = false; // Если true использвуется класс Cell, иначе boolean
    protected _isBiom: boolean = false;
    protected _isRandomCell: boolean = false;

    protected _playAndPause: any;
    protected _stepButton: HTMLElement;
    protected _refreshButton: HTMLElement;
    protected _randomButton: HTMLElement;
    protected _mapButton: HTMLElement;

    protected _typeText: HTMLElement;
    protected _widthText: HTMLElement;
    protected _heightText: HTMLElement;
    protected _sizePixelText: HTMLElement;
    protected _speedText: HTMLElement;
    protected _lifeText: HTMLElement;
    protected _saveText: HTMLElement;
    protected _reprodText: HTMLElement;
    protected _randomCellText: HTMLElement;

    protected _typeSlider: any;
    protected _widthSlider: any;
    protected _heightSlider: any;
    protected _sizePixelSlider: any;
    protected _speedSlider: any;
    protected _lifeSlider: any;
    protected _saveSliderOne: any;
    protected _saveSliderTwo: any;
    protected _reprodSlider: any;
    protected _randomCellSlider: any;

    protected _settingBiom: HTMLElement;

    protected _fieldBiom: Array<Array<Biom>> = [];
    protected _fieldBiomColor: Array<Array<String>> = [];
    protected _field: Array<Array<boolean | Cell | undefined>>;
    protected _intervalStart: number;
    protected _countCycles: number = 0;
    protected _cycles: HTMLElement;

    protected _yearDethGlobal: number = 4;
    protected _saveFromGlobal: number = 2;
    protected _saveToGlobal: number = 3;
    protected _reprodGlobal: number = 3;
    protected _chanceRandomCell: number = 0;

    constructor (){
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
        this._playAndPause = document.getElementById('startAndPause')
        this._playAndPause.addEventListener('click', this._onClickPlayOrPause.bind(this));
        this._stepButton = document.getElementById('step');
        this._stepButton.addEventListener('click', this._makeStep.bind(this));
        this._refreshButton = document.getElementById('refresh');
        (<any>this._refreshButton).disabled = true;
        (<any>this._refreshButton).style.opacity = 0.6;
        this._refreshButton.addEventListener('click', this._refresh.bind(this));
        this._randomButton = document.getElementById('randomField');
        this._randomButton.addEventListener('click', this._onClickRandomButton.bind(this));
        this._mapButton = document.getElementById('map');
        this._mapButton.addEventListener('click', this._onClickMapButton.bind(this));
        (<any>this._mapButton).style.opacity = 0.6;
        (<any>this._mapButton).disabled = true;

        this._settingBiom = document.getElementById('settingBiom');

        // Поле
        this._field = this._emptyField(this._isCell);
        this._cycles = document.getElementById('cycles')
    }

    protected _onClickPlayOrPause(): void{
        if(!this._isStarted){
            this._playAndPause.src = 'image/pause.png'
            this._isStarted = true;
            this._typeSlider.disabled = true;
            this._widthSlider.disabled = true;
            this._heightSlider.disabled = true;
            this._sizePixelSlider.disabled = true;
            this._speedSlider.disabled = true;
            (<any>this._stepButton).disabled = true;
            (<any>this._stepButton).style.opacity = 0.6;
            (<any>this._randomButton).disabled = true;
            (<any>this._randomButton).style.opacity = 0.6;
            (<any>this._refreshButton).disabled = false;
            (<any>this._refreshButton).style.opacity = 1;
            this._intervalStart = setInterval(() => {
                this._makeStep();
            }, this._speed);
        } else {
            this._playAndPause.src = 'image/play.png'
            this._isStarted = false;
            clearInterval(this._intervalStart);
            (<any>this._stepButton).disabled = false;
            (<any>this._stepButton).style.opacity = 1;
            this._speedSlider.disabled = false;
        }
    }

    protected _refresh(): void{
        clearInterval(this._intervalStart);
        this._isStarted = false;
        this._isPaused = false;
        this._countCycles = 0;
        this._cycles.textContent = this._countCycles.toString();
        (<any>this._randomButton).disabled = false;
        (<any>this._randomButton).style.opacity = 1;
        (<any>this._refreshButton).disabled = true;
        (<any>this._refreshButton).style.opacity = 0.6;
        (<any>this._stepButton).disabled = false;
        (<any>this._stepButton).style.opacity = 1;
        this._playAndPause.src = 'image/play.png'
        this._typeSlider.disabled = false;
        if(this._sizePixelSlider.value === '2'){
            this._widthSlider.disabled = false;
            this._heightSlider.disabled = false;
        }
        this._sizePixelSlider.disabled = false;
        this._speedSlider.disabled = false;
        this._field = this._emptyField(this._isCell);
        this._ctx.clearRect(0, 0, this._width, this._height);
    }

    protected _onClickRandomButton(): void{
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._field = this._emptyField(this._isCell);
        this._randomField(100);
        if(this._isBiom) this._drawField();
        this._drawCell();
    }

    protected _onClickMapButton(): void{
        this._fieldBiom = [];
        this._fieldBiomColor = [];
        this._generateMap();
        this._drawField();
        this._drawCell();
    }

    protected _onClickCanvas(event: any): void{
        const x = Math.floor(event.offsetX/this._sizePixel); 
        const y = Math.floor(event.offsetY/this._sizePixel);
        this._field[y][x] = this._isCell ? new Cell(this._yearDethGlobal) : true;
        this._drawPoint(x, y);
    }

    protected _makeStep(): void{
        this._field = this._calculation();
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._isRandomCell ? this._randomField(this._chanceRandomCell) : '';
        this._drawField(); // if biom
        this._drawCell();
        this._countCycles++;
        this._cycles.textContent = this._countCycles.toString() 
    }

    protected _calculation(): Array<Array<boolean | Cell | undefined>>{
        let calculationField: Array<Array<boolean | Cell | undefined>> = this._emptyField(this._isCell);
        for (let y: number = 0; y < this._sizeY; y++){
            for (let x: number = 0; x < this._sizeX; x++){
                let neighbors: number = this._countNeighbors(x, y);
                if(this._isCell){ // Клетка с возрастом
                    if (this._field[y][x]){
                        const neighborsFrom: number = this._isBiom ? (<Cell>this._field[y][x]).getSaveFrom() : this._saveFromGlobal;
                        const neighborsTo: number = this._isBiom ? (<Cell>this._field[y][x]).getSaveTo() : this._saveToGlobal;
                        if(neighbors < neighborsFrom || neighbors > neighborsTo){
                            delete this._field[y][x];
                            calculationField[y][x] = undefined;
                        } else {
                            (<Cell>this._field[y][x]).addAge();
                            calculationField[y][x] = this._field[y][x];
                            if((<Cell>this._field[y][x]).checkOld()){
                                delete this._field[y][x];
                                calculationField[y][x] = undefined;
                            }
                        }
                    } else {
                        const reproduction: number = this._isBiom ? 3 + this._fieldBiom[y][x].getConditionReprod() : this._reprodGlobal;
                        const cell: Cell = this._isBiom ? new Cell(4, this._fieldBiom[y][x]) : new Cell(this._yearDethGlobal);
                        calculationField[y][x] = (neighbors === reproduction) ? cell : undefined; 
                    }
                } else { // Стандартная
                    if (this._field[y][x]){
                        calculationField[y][x] = (neighbors < this._saveFromGlobal || neighbors > this._saveToGlobal) ? false : true; 
                    } else {
                        calculationField[y][x] = (neighbors === this._reprodGlobal) ? true : false; 
                    }
                }
            }
        }
        return calculationField;
    }

    protected _countNeighbors(x: number, y: number): number{
        let sum: number = 0;
        let minY: number = (y === 0) ? 0: y-1;
        let minX: number = (x === 0) ? 0: x-1;
        let maxY: number = (y === this._sizeY-1) ? this._sizeY - 1 : y+1;
        let maxX: number = (x === this._sizeX-1) ? this._sizeX - 1 : x+1; 
        for (let i: number = minY; i <= maxY; i++){
            for (let j: number = minX; j <= maxX; j++){
                if(x === j && y === i) continue;
                if(this._field[i][j]) sum++;
            }
        }
        return sum;
    }

    protected _emptyField(isCell: boolean): Array<Array<boolean | Cell | undefined>>{
        let arrayField: Array<Array<boolean | Cell | undefined>> = [];
        for (let i: number = 0; i<this._sizeY; i++){
            let localArray: Array<boolean | Cell | undefined> = [];
            for (let j: number = 0; j<this._sizeX; j++){
                isCell ? localArray.push(undefined) : localArray.push(false);
            }
            arrayField.push(localArray);
        }
        return arrayField;
    }

    protected _generateMap(): void{
        const res = (this._sizeX + this._sizeY) / 5;
        const frame = 20;
        const frameres = 5;
        const spaceRangeX = Math.ceil(this._sizeX / res);
        const spaceRangeY = Math.ceil(this._sizeY / res);
        const frameRange = Math.floor(frame / frameres);

        const noise = new PerlinNoise([spaceRangeX, spaceRangeY, frameRange]);

        for(let i = 0; i < frame; i++){
            for(let y = 0; y < this._sizeY; y++){
                let colors: Array<String> = [];
                let bioms: Array<Biom> = [];
                for(let x = 0; x < this._sizeX; x++){
                    const pixel: number = (noise.getPointNoise([x/res, y/res]) + 1) / 2;
                    let color: string;
                    let biom: string;
                    if (pixel < 0.25){
                        color = '#000077';
                        biom = 'sea';
                    } else if(pixel < 0.32){
                        color = '#0000BB';
                        biom = 'sea';
                    } else if (pixel < 0.35){
                        color = '#2222FF';
                        biom = 'sea';
                    } else if (pixel < 0.45){
                        color = '#EBBC50';
                        biom = 'beach';
                    } else if (pixel < 0.65){
                        color = '#00AA00';
                        biom = 'forest';
                    } else if(pixel < 0.75){
                        color = '#007700';
                        biom = 'forest';
                    } else if(pixel < 0.8){
                        color = '#666666';
                        biom = 'mountain';
                    } else if(pixel < 0.83){
                        color = '#555555';
                        biom = 'mountain';
                    } else {
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

    public _drawPoint(x: number, y: number): void{
        this._ctx.fillStyle = this._isCell ? '#00C800' : '#000000';
        this._ctx.fillRect(x*this._sizePixel, y*this._sizePixel, this._sizePixel, this._sizePixel);
    }

    protected _drawCell(): void{
        for (let y: number = 0; y < this._sizeY; y++){
            for (let x: number = 0; x < this._sizeX; x++){
                if (this._field[y][x]){
                    this._ctx.fillStyle = this._isCell ? (<Cell>this._field[y][x]).getColor() : '#000000';
                    this._ctx.fillRect(x*this._sizePixel, y*this._sizePixel, this._sizePixel, this._sizePixel);
                }
            }
        }
    }

    protected _drawField(): void{
        for (let y: number = 0; y < this._sizeY; y++){
            for (let x: number = 0; x < this._sizeX; x++){
                if(this._isBiom){
                    this._ctx.fillStyle = this._fieldBiomColor[y][x];
                    this._ctx.fillRect(x*this._sizePixel, y*this._sizePixel, this._sizePixel, this._sizePixel);
                }
            }
        }
    }

    protected _randomField(probability: number): void{
        for (let i: number = 0; i < (this._sizeX * this._sizeY) / 5; i++){
            const chance: number = Math.round(Math.random() * 100);
            if (chance <= probability){
                const x = Math.floor(Math.random() * (this._sizeX));
                const y = Math.floor(Math.random() * (this._sizeY));
                if(!this._field[y][x]){
                    if(this._isCell){
                        this._field[y][x] = this._isBiom ? new Cell(4, this._fieldBiom[y][x]) : new Cell(this._yearDethGlobal);
                    } else {
                        this._field[y][x] =  true;
                    }
                }
            }
        }
    }

    protected _onSlideWidth(): void{
        this._sizeX = this._widthSlider.value;
        this._width = this._sizeX * this._sizePixel;
        this._widthText.textContent = this._sizeX.toString();
        this._canvas.width = this._width;
        this._canvas.style.width = this._width;
    }

    protected _onSlideHeight(): void{
        this._field = this._emptyField(this._isCell);
        this._sizeY = this._heightSlider.value;
        this._height = this._sizeY * this._sizePixel;
        this._heightText.textContent = this._sizeY.toString();
        this._canvas.height = this._height;
        this._canvas.style.height = this._height;
    }

    protected _onSlideSizePixel(): void{
        switch(this._sizePixelSlider.value){
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

    protected _onSlideSpeed(): void{
        this._speed = this._speedSlider.value;
        const sec = Math.floor(this._speed / 1000);
        const milisec = this._speed - (sec * 1000);
        this._speedText.textContent = milisec < 100 ? `${sec}.0${milisec}` : `${sec}.${milisec}`;
    }

    protected _onSlideLife(): void{
        this._yearDethGlobal = this._lifeSlider.value;
        this._lifeText.textContent = this._yearDethGlobal.toString();
    }

    protected _onSlideSave(): void{
        if (this._saveSliderOne.value <= this._saveSliderTwo.value){
            this._saveFromGlobal = this._saveSliderOne.value;
            this._saveToGlobal = this._saveSliderTwo.value;
        } else {
            this._saveSliderOne.value = this._saveToGlobal
            this._saveSliderTwo.value = this._saveFromGlobal 
        }
        this._saveText.textContent = this._saveFromGlobal != this._saveToGlobal ? `${this._saveFromGlobal} - ${this._saveToGlobal}` : `${this._saveFromGlobal}` ; 
    }

    protected _onSlideReprod(): void{
        this._reprodGlobal = parseInt(this._reprodSlider.value);
        this._reprodText.textContent = this._reprodGlobal.toString(); 
    }

    protected _onSlideType(): void{
        this._isCell = (this._typeSlider.value === '1') ? false : true;
        this._isBiom = (this._typeSlider.value === '3') ? true : false;
        this._saveSliderOne.disabled = (this._typeSlider.value === '3') ? true : false;
        this._saveSliderTwo.disabled = (this._typeSlider.value === '3') ? true : false;
        this._reprodSlider.disabled = (this._typeSlider.value === '3') ? true : false;
        this._lifeSlider.disabled = (this._typeSlider.value === '2') ? false : true;
        (<any>this._settingBiom).style.opacity = (this._typeSlider.value === '3') ? 1 : 0;
        (<any>this._mapButton).disabled = (this._typeSlider.value === '3') ? false : true;
        (<any>this._mapButton).style.opacity = (this._typeSlider.value === '3') ? 1 : 0.6;
        switch(this._typeSlider.value){
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

    protected _onSlideRandomCell(): void{
        this._chanceRandomCell = this._randomCellSlider.value;
        this._isRandomCell = this._chanceRandomCell > 0 ? true : false;
        this._randomCellText.textContent = `${this._chanceRandomCell}%`;
    }
}

class Cell {
    protected _age: number = 0;
    protected _yearOfDeath: number = 4;
    protected _saveFrom: number = 2;
    protected _saveTo: number = 3;
    protected _reprod: number = 3;
    protected _color: string;
    protected _colorsByYear: Array<string>;
    protected _biom: Biom;

    constructor(old?: number, biom?: Biom){
        this._yearOfDeath = old ? old : this._yearOfDeath;
        this._colorsByYear = this._createColors();
        if(biom){
            this._biom = biom;
            this._yearOfDeath += this._biom.getConditionLife();
            this._saveFrom += this._biom.getConditionSaveFrom();
            this._saveTo += this._biom.getConditionSaveTo();
            this._reprod += this._biom.getConditionReprod();
        }
    }

    protected _createColors(): Array<string>{
        const colors: Array<string> = [];
        const step: number = Math.floor(200 / this._yearOfDeath);
        let red: number = 0;
        let green: number = 200;
        colors.push(`#00C800`);
        for(let i: number = 1; i < this._yearOfDeath; i++){
            red += step;
            green -= step;
            colors.push(`#${red.toString(16).toUpperCase()}${green.toString(16).toUpperCase()}00`);
        }
        colors.push(`#C80000`);
        return colors;
    }

    public getColor(): string{
        return this._colorsByYear[this._age];
    }

    public addAge(): void{
        this._age++;
    }

    public getYearOfDeath(): number{
        return this._yearOfDeath;
    }

    public getSaveFrom(): number{
        return this._saveFrom;
    }

    public getSaveTo(): number{
        return this._saveTo;
    }

    public getReprod(): number{
        return this._reprod;
    }

    public checkOld(): boolean{
        return this._age > this._yearOfDeath;
    }
}

class Biom{
    protected _name: string;
    protected _conditionLife: number;
    protected _conditionSaveFrom: number;
    protected _conditionSaveTo: number;
    protected _conditionReprod: number;

    constructor(name: string){
        this._name = name;
        switch(this._name){
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

    public getName(): string{
        return this._name;
    }

    public getConditionLife(): number{
        return this._conditionLife;
    }

    public getConditionSaveFrom(): number{
        return this._conditionSaveFrom;
    }

    public getConditionSaveTo(): number{
        return this._conditionSaveTo;
    }

    public getConditionReprod(): number{
        return this._conditionReprod;
    }

    public setConditionLife(value: number): void{
        this._conditionLife = value;
    }

    public setConditionSaveFrom(value: number): void{
        this._conditionSaveFrom = value;
    }

    public setConditionSaveTo(value: number): void{
        this._conditionSaveTo = value;
    }

    public setConditionReprod(value: number): void{
        this._conditionReprod = value;
    }
}

class PerlinNoise{
    protected _dimension: number = 2;
    protected _octaves: number = 1;
    protected _tile: Array<number>;
    protected _unbias: boolean = false;
    protected _scaleFactor: number = 2 * Math.pow(this._dimension, -0.5);
    public _gradient = new Map();

    constructor(tile: Array<number>, octaves?: number, unbias?: boolean){
        this._tile = tile;
        this._tile.push(0, 0);
        this._octaves = octaves ? octaves : this._octaves;
        this._unbias = unbias ? unbias : this._unbias;
    }

    protected _generateGradient(): Array<number>{
        let randomPoint: Array<number> = [];
        for (let i: number = 0; i < this._dimension; i++){
            randomPoint.push(this._randomGauss(0, 1));
        }
        
        let sum: number;
        let scale = randomPoint.map(i => sum += Math.pow(i, 2), sum = 0).reverse()[0]
        scale = Math.pow(scale, -0.5);

        let vector: Array<number> = [];
        for(let coord of randomPoint){
            vector.push(coord * scale);
        }

        return vector;
    }

    protected _getPlainNoise(point: Array<number>): number{
        let gridCoords: Array<Array<number>> = [];
        for(let coord of point){
            const minCoord = Math.floor(coord);
            const maxCoord = minCoord + 1;
            gridCoords.push([minCoord, maxCoord]);
        }

        let product: Array<Array<number>> = [];
        for(let item of gridCoords[0]){
            product.push([item, gridCoords[1][0]])
            product.push([item, gridCoords[1][1]])
        }

        let dots: Array<number> = [];
        for(let gridPoint of product){
            let exist: boolean = false;
            for(let keys of this._gradient.keys()){
                if(keys && gridPoint[0] === keys[0] && gridPoint[1] === keys[1]){
                    exist = true;
                    break;
                }
            }
            if(!exist){
                this._gradient.set(gridPoint, this._generateGradient());
            }

            let gradient: Array<number> = []
            for(let keys of this._gradient.keys()){
                if(keys && gridPoint[0] === keys[0] && gridPoint[1] === keys[1]){
                    gradient = this._gradient.get(keys);
                    break;
                }
            }

            let dot: number = 0;
            for(let i: number = 0; i < this._dimension; i++){
                dot += gradient[i] * (point[i] - gridPoint[i]);
            }
            dots.push(dot);
        }

        let dim: number = this._dimension;
        while(dots.length > 1){
            dim -= 1;
            const s: number = this._smoothstep(point[dim] - gridCoords[dim][0])

            const nextDots: Array<number> = [];
            while(dots.length > 0){
                nextDots.push(this._lerp(s, dots.shift(), dots.shift()));
            }
            dots = nextDots;
        }

        return dots[0] * this._scaleFactor;
    }

    public getPointNoise(point: Array<number>): number{
        let ret: number = 0;
        for(let oct: number = 0; oct < this._octaves; oct++){
            const octTwo: number = 1 << oct;
            const newPoint: Array<number> = [];
            for(let i: number = 0; i < point.length; i++){
                let coord: number = point[i];
                coord *= octTwo;
                if(this._tile[i]){
                    coord %= this._tile[i] * octTwo;
                }
                newPoint.push(coord);
            }
            ret += this._getPlainNoise(newPoint) / octTwo;
        }
        ret /= 2 - Math.pow(2, (1 - this._octaves));

        if(this._unbias){
            let r: number = (ret + 1) / 2;
            for(let i: number = 0; i < Math.floor(this._octaves / 2 + 0.5); i++){
                r = this._smoothstep(r);
            }
            ret = r * 2 - 1;
        }

        return ret;
    }

    protected _randomGauss(mean: number, stdDev: number): number{
        const u1 = 1 - Math.random();
        const u2 = 1 - Math.random();
        const stdNormal = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2)
        const randNormal = mean + stdDev * stdNormal;
        return randNormal;
    }

    protected _smoothstep(t: number): number{
        return t * t * (3 - 2 * t);
    }

    protected _lerp(t: number, a: number, b: number): number{
        return a + t * (b - a);
    }
}

const game = new Game();