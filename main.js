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
        _state: 'expanding',
        _alternate: false,
        init: function() {
            if (!this.has('tween')) this.addComponent('tween');

            this.bind('enterframe', function(e) {
                if (this._state === 'expanding') {
                    this.w += 1;
                    this.h += 1;

                    if (this._alternate) {
                        this.x -= 1;
                        this.y -=1;
                        this._alternate = false;
                    } else {
                        this._alternate = true;
                    }

                    if (this.w > 64 ) {
                        this._state = 'collapsing';
                    }
                } else if (this._state === 'collapsing') {
                    this.w -= 1;
                    this.h -= 1;

                    if (this._alternate) {
                        this.x += 1;
                        this.y +=1;
                        this._alternate = false;
                    } else {
                        this._alternate = true;
                    }

                    if (this.w < 0 ) {
                        this._state = 'done';
                    }
                } else if (this._state === 'done') {
                    this.destroy();
                }
            });
        },
        restart: function(x,y) {
            if (this._state !== 'expanding' && this._state !== 'collapsing') {
                // this.w = 16, this.h = 16;
                this.x = x, this.y = y;
                this._state = 'expanding';
            }
        }
    });

    var singleton = null;
    Crafty.addEvent(this, Crafty.stage.elem, 'click', function(e) {
        var x = e.clientX - Crafty.stage.x + document.body.scrollLeft + document.documentElement.scrollLeft;
        var y = e.clientY - Crafty.stage.y + document.body.scrollTop + document.documentElement.scrollTop;

        if (singleton === null) {
            singleton = Crafty.e("2D, DOM, color, expand")
            .attr({x:x, y:y})
            .color('blue');
        }
    });
}


