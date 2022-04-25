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
  };

  self.Bar.prototype = {
    down: function () {},
    up: function () {},
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

self.addEventListener("load", main);

//CONTROLADOR: Ejecutara todos los elementos y pasa los parametros a la vista y modelo
function main() {
  var board = new Board(800, 400);
  var bar = new Bar(20, 100, 40, 100, board);
  var bar = new Bar(735, 100, 40, 100, board);
  var canvas = document.getElementById("canvas");
  var board_view = new BoardView(canvas, board);
  board_view.draw();
}
