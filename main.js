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

// Funcion de la pelota
(function () {
  self.Ball = function (x, y, radius, board) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed_y = 0;
    this.speed_x = 3;
    this.board = board;
    board.ball = this;
    this.kind = "circle";
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
      this.y -= this.speed;
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
    //   Este clean evita que se repinte las barras al momento de bajar o subir
    clean: function () {
      this.ctx.clearRect(0, 0, this.board.width, this.board.height);
    },

    draw: function () {
      for (var i = this.board.elements.length - 1; i >= 0; i--) {
        var element = this.board.elements[i];
        draw(this.ctx, element);
      }
    },

    play: function () {
      this.clean();
      this.draw();
    },
  };

//   Dibuja barras y bola con canvas
  function draw(ctx, element) {
    switch (element.kind) {
      case "rectangle":
        ctx.fillRect(element.x, element.y, element.width, element.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius, 0, 7);
        ctx.fill();
        ctx.closePath();
        break;
    }
  }
})();

// Instancias
var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar2 = new Bar(735, 100, 40, 100, board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10 , board);
// Para poder mover las barras se coloca el evento sobre el todo el DOM
document.addEventListener("keydown", function (event) {
  if (event.keyCode === 38) {
    event.preventDefault();
    bar.up();
  } else if (event.keyCode === 40) {
    event.preventDefault();
    bar.down();
  } else if (event.keyCode === 87) {
    // W
    event.preventDefault();
    bar_2.up();
  } else if (event.keyCode === 83) {
    // S
    event.preventDefault();
    bar_2.down();
  } else if (event.keyCode === 32) {
    // PAUSE
    event.preventDefault();
    board.playing = !board.playing;
  }
});

window.requestAnimationFrame(controller);
//CONTROLADOR: Ejecutara todos los elementos y pasa los parametros a la vista y modelo
function controller() {
  board_view.play();
  window.requestAnimationFrame(controller);
}
