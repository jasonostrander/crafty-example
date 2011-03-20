window.onload = function() {
    //setup the Crafty game with an FPS of 50 and stage width
    //and height
    Crafty.init(50, 580, 225);
    
    //create a player entity with premade components
    var ball = Crafty.e("2D, DOM, fourway, color")
        .attr({x: Crafty.viewport.width / 2, w: 16, h: 16, xspeed: 1, yspeed: 2})
        .color('red')
        .bind("enterframe", function() {
        	this.x += this.xspeed;
        	this.y += this.yspeed;

        	if (this._x + this._w > Crafty.viewport.width) {
                this.xspeed = -this.xspeed;
        		// this.x = 0;
        	} else if (this._x < 0) {
        		// this.x = Crafty.viewport.width;
                this.xspeed = -this.xspeed;
        	}
        	if (this._y + this._h > Crafty.viewport.height) {
        		// this.y = 0;
                this.yspeed = -this.yspeed;
        	} else if (this._y < 0) {
        		// this.y = Crafty.viewport.height;
                this.yspeed = -this.yspeed;
        	}
        });

    Crafty.c('expand', {
        _expanding: true,
        init: function() {
            if (!this.has('tween')) this.addComponent('tween');

            this.bind('enterframe', function(e) {
                if (this._expanding) {
                    this.w += 1;
                    this.h += 1;

                    if (this.w > 64 ) {
                        this._expanding = false;
                    }
                }
            });
        },
        restart: function() {
            this.w = 16, this.h = 16;
            this._expanding = true;
        }
    });

    var test = Crafty.e("2D, DOM, color, expand")
        .attr({x: Crafty.viewport.width/4, y: Crafty.viewport.height/2, w: 16, h:16})
        .color('blue');

    Crafty.addEvent(this, Crafty.stage.elem, 'click', function(e) {
        console.log('new elem', e.x, e.y, e);
        test.attr({x:e.clientX, y:e.clientY});
        test.restart();
        // Crafty.e("2D, DOM, color").color('blue').attr({x: e.x, y: e.y, w: 16, h:16});
    });
}


