window.onload = function() {
    //setup the Crafty game with an FPS of 50 and stage width
    //and height
    Crafty.init(50, 580, 225);
    
    var levels= [
        {required:1, total:4},
        {required:2, total:4},
        {required:4, total:7},
        {required:5, total:12},
        {required:10, total:17},
        {required:17, total:25}
    ]
    var current = 0;
    var hits = 0;
    var singleton = null;
    var prompt = 'Click to begin';

    var intro = Crafty.scene('intro', function() {
        var intro = Crafty.e('2D, DOM, color, text')
            .attr({
                h: Crafty.viewport.height/2,
                w: Crafty.viewport.width/2,
                x: Crafty.viewport.width/4,
                y: Crafty.viewport.height/4
            })
            .color('black')
            .text(prompt)
            .font('18pt Arial');

        var fn = function(e) {
            Crafty.removeEvent(this, Crafty.stage.elem, 'click', fn);
            Crafty.scene('main');
        };

        Crafty.addEvent(this, Crafty.stage.elem, 'click', fn);
    });

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
                            updateGameState();
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
                        expanding: false
                    })
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
                            hits += 1;
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
                _required: levels[current].required,
                incrementScore: function() {
                    this._score += 1;
                    this.text(this._score + '/' + this._required);
                },
                nextLevel: function() {
                    if (this._score >= this._required)
                        return true;
                    return false;
                }
            })
            .color('black')
            .text('0/'+levels[current].required)
            .font('18pt Arial');

        // Only allow the player to interact once
        Crafty.addEvent(this, Crafty.stage.elem, 'click', function(e) {
            var x = e.clientX - Crafty.stage.x + document.body.scrollLeft + document.documentElement.scrollLeft;
            var y = e.clientY - Crafty.stage.y + document.body.scrollTop + document.documentElement.scrollTop;
    
                if (singleton == null) {
                    singleton = Crafty.e("2D, DOM, color, expand, player")
                    .attr({x:x, y:y})
                    .color('blue')
                    .expand();
                }
            });
    
            // create the balls
            for (var i = 0; i<levels[current].total; i++) {
                Crafty.e("2D, DOM, color, ball").color('red');
        }

        function updateGameState() {
            var ids = Crafty('expand').toArray();
            var finish = true;
            for (var i = 0; i<ids.length; i++) {
                var e = Crafty(ids[i]);
                if ( !(e._state === 'done' || e._state === 'idle') ) {
                    finish = false;
                }
            }

            if (finish) {
                if (score.nextLevel()) {
                    // finish the game
                    current += 1;

                    if (levels[current] === undefined) {
                        // Yay, game is won
                        console.log('Game won!');
                        prompt = 'You won! Congratulations! Click to play again.'
                        current = 0;
                        setTimeout(function() {Crafty.scene('intro');}, 500);
                    } else {
                        singleton = null;
                        setTimeout(function() {Crafty.scene('main');}, 500);
                    }
                } else {
                    console.log('level failed');
                    prompt = 'Level failed. Click to try again.'
                    setTimeout(function() {Crafty.scene('intro');}, 500);
                }
            }
        }
    });

    Crafty.scene('intro');
}


