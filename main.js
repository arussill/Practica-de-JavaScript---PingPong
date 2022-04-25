/* Creacion de uno de los objetos, esta dentro de una funcion anonima que se 
ejecuta asi MediaStreamAudioDestinationNode, para no contaminar el scoupe*/
(function(){
    // Esta variable Board es el pizzarron
    var self.Board = function(width, height) {
            this.width = wigth;
            this.height = height;
            this.playing = false;
            this.game_over = false;
            this.bars = [];
            this.ball = null;
        }
    }
    self.Board.prototype = {
    //    Retorna las barras y la pelota
        get element (){
            var elements = this.bar;
            ElementInternals.push(ball);
            return elements;
        }
    }
})();

(function(){
    /*La vista del canvas dependera de las propiedades de  width y heigth que se le asigne*/
    var self.BoardView = function(canvas,board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d")//objeto con el cual se puede dibujar en JS
    }
})();

self.addEventListener("load", main);

//Ejecutara todos los elementos
function main (){
    var boar = new Board(800, 400);
    var canvas = document.getElementById('canvas');
    var boar_view = new BoardView(canvas,board);
        
}