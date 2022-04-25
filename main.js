// MODELO
/* Creación de uno de los objetos, esta dentro de una función anónima que se 
ejecuta asi MediaStreamAudioDestinationNode, para no contaminar el scope*/
(function () {
  // Esta variable Board es el pizarrón
  self.Board = function (width, height) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.ball = null;
    this.bars = [];
    this.playing = false;
  };

  self.Board.prototype = {
    //    Retorna las barras y la pelota
    get elements() {
      var elements = this.bars.map(function (bar) {
        return bar;
      });
      elements.push(ball);
      return elements;
    },
  };
})();

// VISTA
/*La vista del canvas dependerá de las propiedades de  width y height que se le asigne*/
(function () {
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
    // Choque de la bola
    check_collisions: function () {
      for (var i = this.board.bars.length - 1; i >= 0; i--) {
        var bar = this.board.bars[i];
        if (hit(bar, this.board.ball)) {
          this.board.ball.collision(bar);
        }
      }
    },
    // Funcion inicia juego
    play: function () {
      if (this.board.playing) {
        this.clean();
        this.draw();
        this.check_collisions();
        this.board.ball.move();
      }
    },
  };

  function hit(a, b) {
    // Revisa si a colisiona con b
    var hit = false;

    // Colisiones horizontales
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
      // Colisiones verticales
      if (b.y + b.height >= a.y && b.y < a.y + a.height) {
        hit = true;
      }
    }

    // Colisión de a con b
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
      if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
        hit = true;
      }
    }

    // Colisión de b con a
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
      if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
        hit = true;
      }
    }

    return hit;
  }
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

  //   Para que las barras se muevan
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

// Función de la pelota
(function () {
  self.Ball = function (x, y, radius, board) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed_y = 0;
    this.speed_x = 3;
    this.board = board;
    this.direction = 1;
    this.bounce_angle = 0;
    this.max_bounce_angle = Math.PI / 12;
    this.speed = 3;

    board.ball = this;
    this.kind = "circle";
  };

  // Para que la pelota se mueva
  self.Ball.prototype = {
    move: function () {
      this.x += this.speed_x * this.direction;
      this.y += this.speed_y;
    },
    get width() {
      return this.radius * 2;
    },
    get height() {
      return this.radius * 2;
    },
    collision: function (bar) {
      // Reacciona a la colisión con una barra que recibe como parámetro
      var relative_intersect_y = bar.y + bar.height / 2 - this.y;
      var normalized_intersect_y = relative_intersect_y / (bar.height / 2);
      // Angulo de la pelota
      this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

      this.speed_y = this.speed * -Math.sin(this.bounce_angle);
      this.speed_x = this.speed * Math.cos(this.bounce_angle);

      if (this.x > this.board.width / 2) this.direction = -1;
      else this.direction = 1;
    },
  };
})();

// Instancias
var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar2 = new Bar(735, 100, 40, 100, board);
var canvas = document.getElementById("canvas", board);
var board_view = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);

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
    bar2.up();
  } else if (event.keyCode === 83) {
    // S
    event.preventDefault();
    bar2.down();
  } else if (event.keyCode === 32) {
    // PAUSE con la barra espaciador
    event.preventDefault();
    board.playing = !board.playing;
  }
});

board_view.draw();
window.requestAnimationFrame(controller);
//CONTROLADOR: Ejecutara todos los elementos y pasa los parámetros a la vista y modelo
function controller() {
  board_view.play();
  window.requestAnimationFrame(controller);
}
