class Game {
    protected _isStarted: boolean = false;
    protected _isPaused: boolean = true;
    protected _canvas: any;
    protected _ctx: any;
    protected _sizeX: number = 75;
    protected _sizeY: number = 45;
    protected _field: Array<Array<boolean>>;
    protected _startButton: HTMLElement;
    protected _pauseButton: HTMLElement;
    protected _refreshButton: HTMLElement;
    protected _randomButton: HTMLElement;
    protected _interval: number;
    protected _countCycles: number = 0;
    protected _cycles: HTMLElement;
    protected _sizePixel: number = 10;
    protected _height: number = this._sizeY * this._sizePixel;
    protected _width: number = this._sizeX * this._sizePixel;

    constructor (){
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
        this._cycles = document.getElementById('cycles')
        this._ctx = this._canvas.getContext('2d'); 
        this._field = this._emptyField();
    }

    protected _start(): void{
        if(!this._isStarted || this._isPaused){
            this._isStarted = true;
            this._isPaused = false;
            (<any>this._randomButton).disabled = true;
            this._interval = setInterval(() => {
                this._field = this._calculation();
                this._ctx.clearRect(0, 0, this._width, this._height);
                this._drawField();
                this._countCycles++;
                this._cycles.textContent = this._countCycles.toString()
            }, 50);
        }
    }

    protected _pause(): void{
        clearInterval(this._interval);
        this._isPaused = true;
    }

    protected _refresh(): void{
        clearInterval(this._interval);
        this._isStarted = false;
        this._isPaused = false;
        this._countCycles = 0;
        this._cycles.textContent = this._countCycles.toString();
        (<any>this._randomButton).disabled = false;
        this._field = this._emptyField();
        this._ctx.clearRect(0, 0, this._width, this._height);
    }

    protected _onClickRandomButton(): void{
        (<any>this._randomButton).disabled = true;
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._field = this._randomField();
        this._drawField();
    }

    protected _onClickCanvas(event: any): void{
        const x = Math.floor(event.offsetX/this._sizePixel); 
        const y = Math.floor(event.offsetY/this._sizePixel);
        this._field[y][x] = true;
        this._drawPoint(x, y);
    }

    protected _calculation(): Array<Array<boolean>>{
        let calculationField: Array<Array<boolean>> = this._emptyField();
        for (let y: number = 0; y < this._sizeY; y++){
            for (let x: number = 0; x < this._sizeX; x++){
                let neighbors: number = this._countNeighbors(x, y);
                if (this._field[y][x]){
                    calculationField[y][x] = neighbors < 2 || neighbors > 3 ? false : true; 
                } else {
                    calculationField[y][x] = neighbors == 3 ? true : false; 
                }
            }
        }
        return calculationField;
    }

    protected _countNeighbors(x: number, y: number): number{
        let sum: number = 0;
        let minY: number = (y == 0) ? 0: y-1;
        let minX: number = (x == 0) ? 0: x-1;
        let maxY: number = (y == this._sizeY-1) ? this._sizeY - 1 : y+1;
        let maxX: number = (x == this._sizeX-1) ? this._sizeX - 1 : x+1; 
        for (let i: number = minY; i <= maxY; i++){
            for (let j: number = minX; j <= maxX; j++){
                if(x == j && y == i) continue;
                if (this._field[i][j]) sum++;
            }
        }
        return sum;
    }

    protected _emptyField(): Array<Array<boolean>>{
        let arrayField: Array<Array<boolean>> = [];
        for (let i: number = 0; i<this._sizeY; i++){
            let localArray: Array<boolean> = [];
            for (let j: number = 0; j<this._sizeX; j++){
                localArray.push(false);
            }
            arrayField.push(localArray);
        }
        return arrayField;
    }

    protected _drawPoint(x: number, y: number): void{
        this._ctx.fillRect(x*this._sizePixel, y*this._sizePixel, this._sizePixel, this._sizePixel);
    }

    protected _drawField(): void {
        for (let y: number = 0; y < this._sizeY; y++){
            for (let x: number = 0; x < this._sizeX; x++){
                if (this._field[y][x]){
                    this._ctx.fillRect(x*this._sizePixel, y*this._sizePixel, this._sizePixel, this._sizePixel);
                }  
            }
        }
    }

    protected _randomField(): Array<Array<boolean>>{
        let randomField: Array<Array<boolean>> = this._emptyField();
        for (let i: number = 0; i < (this._sizeX * this._sizeY) / 5; i++){
            const x = Math.floor(Math.random() * (this._sizeX));
            const y = Math.floor(Math.random() * (this._sizeY));
            randomField[y][x] = true;
        }
        return randomField;
    }
}

const game = new Game();