/* Creacion de uno de los objetos, esta dentro de una funcion anonima que se 
ejecuta asi MediaStreamAudioDestinationNode, para no contaminar el scoupe*/
// MODELO
(function () {
  // Esta variable Board es el pizzarron
  self.Board = function (width, height) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;
  };

  self.Board.prototype = {
    //    Retorna las barras y la pelota
    get elements() {
      var elements = this.bars;
      elements.push(this.ball);
      return elements;
    },
  };
})();

(function () {
  self.Bar = function (x, y, width, height, board) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.board = board;
    // Accedo al board accedo al elemento bar y le agrego este objeto Bar
    this.board.bars.push(this);
    this.kind = "rectangle";
    this.speed = 10;
  };

  self.Bar.prototype = {
    down: function () {
      this.y += this.speed;
    },
    up: function () {
      this.x -= this.speed;
    },
    toString: function () {
      return "x: " + this.x + " y: " + this.y;
    },
  };
})();

// VISTA
(function () {
  /*La vista del canvas dependera de las propiedades de  width y heigth que se le asigne*/
  self.BoardView = function (canvas, board) {
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d"); //objeto con el cual se puede dibujar en JS
  };

  self.BoardView.prototype = {
    draw: function () {
      for (var i = this.board.elements.length - 1; i >= 0; i--) {
        var element = this.board.elements[i];
        draw(this.ctx, element);
      }
    },
  };

  function draw(ctx, element) {
    if (element !== null && element.hasOwnProperty("kind")) {
      switch (element.kind) {
        case "rectangle":
          ctx.fillRect(element.x, element.y, element.width, element.height);
          break;
      }
    }
  }
})();

// Instancias
var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar = new Bar(735, 100, 40, 100, board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);

// Para poder mover las barras se coloca el evento sobre el todo el DOM
document.addEventListener("keydown", function (evento) {
  if (evento.keyCode == 38) {
    bar.up();
  } else if (evento.keyCode == 40) {
    bar.down();
  }
});

self.addEventListener("load", main);

//CONTROLADOR: Ejecutara todos los elementos y pasa los parametros a la vista y modelo
function main() {
  board_view.draw();
}
