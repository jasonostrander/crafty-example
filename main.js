window.onload = function() {
    //setup the Crafty game with an FPS of 50 and stage width
    //and height
    Crafty.init(50, 580, 225);
    
    var levels= [3, 5, 7, 11, 17, 25];

    Crafty.scene('main', function() {
    
        Crafty.c('expand', {
            _state: 'idle',
            _alternate: false,
            expand: function() {
                this._state = 'expanding';
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
    
            // ball component player is trying to hit
            Crafty.c('ball', {    // "2D, DOM, color, collision, expand")
                init: function() {
                    if (!this.has('collision')) this.addComponent('collision');
                    if (!this.has('expand')) this.addComponent('expand');
    
                    this.attr({
                        x: (Crafty.viewport.width-16) * Math.random(),
                        y: (Crafty.viewport.height-16)*Math.random(),
                        w: 16,
                        h: 16,
                        xspeed: 1,
                        yspeed: 2,
                        expanding: false})
                    .bind("enterframe", function() {
                        this.x += this.xspeed;
                        this.y += this.yspeed;
            
                        if (this._x + this._w > Crafty.viewport.width) {
                            this.xspeed = -this.xspeed;
                        } else if (this._x < 0) {
                            this.xspeed = -this.xspeed;
                        }
                        if (this._y + this._h > Crafty.viewport.height) {
                            this.yspeed = -this.yspeed;
                        } else if (this._y < 0) {
                            this.yspeed = -this.yspeed;
                        }
                    })
                    .onhit('expand', function(data) {
                        if (this.expanding === false && data[0].obj._state === 'expanding') {
                            this.xspeed = 0, this.yspeed = 0;
                            this.expand();
                            this.expanding = true;
                            score.incrementScore();
                        }
                    });
                }
        });


        var score = Crafty.e('2D, DOM, color, text')
            .attr({
                x: 30,
                y: 30,
                h: 32,
                w: 32,
                _score: 0,
                incrementScore: function() {
                    console.log(this);
                    this._score += 1;
                    this.text(this._score + '/1');
                }
            })
            .color('black')
            .text('0/1')
            .font('18pt Arial');

        // Only allow the player to interact once
        var singleton = null;
        Crafty.addEvent(this, Crafty.stage.elem, 'click', function(e) {
            var x = e.clientX - Crafty.stage.x + document.body.scrollLeft + document.documentElement.scrollLeft;
            var y = e.clientY - Crafty.stage.y + document.body.scrollTop + document.documentElement.scrollTop;
    
                if (singleton === null) {
                    singleton = Crafty.e("2D, DOM, color, expand")
                    .attr({x:x, y:y})
                    .color('blue')
                    .expand();
                }
            });
    
            // create the balls
            for (var i = 0; i<5; i++) {
                Crafty.e("2D, DOM, color, ball").color('red');
        }
    });
    Crafty.scene('main');
}


