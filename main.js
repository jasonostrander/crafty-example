window.onload = function() {
    //setup the Crafty game with an FPS of 50 and stage width
    //and height
    Crafty.init(50, 580, 280);
    
    var levels= [
        {required:1, total:4},
        {required:2, total:4},
        {required:4, total:7},
        {required:7, total:12},
        {required:12, total:17},
        {required:17, total:25},
        {required:25, total:25}
    ]
    var current = 0;
    var singleton = null;
    var prompt = 'Click to begin';

    var toast = Crafty.scene('toast', function() {
        var toast = Crafty.e('2D, DOM, text')
            .attr({
                h: 50,
                w: Crafty.viewport.width,
                x: 0,
                y: Crafty.viewport.height/2 - 25
            })
            .text(prompt)
            .font('18pt Arial black')
            .css({color: 'black', 'text-align': 'center'});

        var fn = function(e) {
            Crafty.removeEvent(this, Crafty.stage.elem, 'click', fn);
            Crafty.scene('main');
        };

        Crafty.e('2D, DOM, Mouse')
            .attr({w: Crafty.viewport.width, h: Crafty.viewport.height})
            .areaMap([0,0], [Crafty.viewport.width, 0], 
                [Crafty.viewport.width, Crafty.viewport.height], 
                [0, Crafty.viewport.height])
            .bind('mousedown', fn)
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
                        this.destroy();
                    }
                });
                return this;
            },
            restart: function(x,y) {
                if (this._state !== 'expanding' && this._state !== 'collapsing') {
                    // this.w = 16, this.h = 16;
                    this.x = x, this.y = y;
                    this._state = 'expanding';
                }
                return this;
            }
        });

        // ball component player is trying to hit
        Crafty.c('ball', {
            init: function() {
                if (!this.has('Collision')) this.addComponent('Collision');
                if (!this.has('expand')) this.addComponent('expand');

                // make it a ball
                // maintain shape when expanding by setting to large value
                this.css({
                    '-moz-border-radius': '64px',
                    '-webkit-border-radius': '64px'
                });

                // Simulate cirle collision area with polygon
                // this.collision(new Crafty.polygon([8,0], [16,8], [8,16], [0,8]) );

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
                .onHit('expand', function(data) {
                    if (data) {
                        for (var i=0; i<data.length; i++) {
                            if (this.expanding === false && data[i].obj._state !== 'idle') {
                                this.xspeed = 0, this.yspeed = 0;
                                this.expand();
                                this.expanding = true;
                                score.incrementScore();
                            }
                        }
                    }
                });
            }
        });

        var score = Crafty.e('2D, DOM, Color, Text')
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
            .text('0/'+levels[current].required)
            .font('18pt Arial')
            .css({color: 'black', 'text-align': 'center'});

        var fn = function(e) {
            var x = e.clientX - Crafty.stage.x + document.body.scrollLeft + document.documentElement.scrollLeft;
            var y = e.clientY - Crafty.stage.y + document.body.scrollTop + document.documentElement.scrollTop;
    
                if (singleton == null) {
                    singleton = Crafty.e("2D, DOM, Color, expand, Player")
                    .attr({x:x, y:y})
                    .color('blue')
                    .css({
                        '-moz-border-radius': '64px',
                        '-webkit-border-radius': '64px'
                    });

                    singleton.expand();

                    // recursively called till all balls expanded
                    setTimeout(updateGameState, 1000);
                }
            };

        // Only allow the player to interact once
        Crafty.e('2D, DOM, Mouse')
            .attr({w: Crafty.viewport.width, h: Crafty.viewport.height})
            .areaMap([0,0], [Crafty.viewport.width, 0], 
                [Crafty.viewport.width, Crafty.viewport.height], 
                [0, Crafty.viewport.height])
            .bind('mousedown', fn);
    
            // create the balls
            for (var i = 0; i<levels[current].total; i++) {
               Crafty.e("2D, DOM, Color, ball").color('red');
            }

            // Crafty.e("2D, DOM, color, ball").color('red').attr({xspeed: 0, yspeed: 0, x: 200, y:200});
            // Crafty.e("2D, DOM, color, ball").color('blue').attr({xspeed: 0, yspeed: 0, x: 229, y:229}).expand();

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
                singleton = null;

                if (score.nextLevel()) {
                    // finish the game
                    current += 1;

                    if (levels[current] === undefined) {
                        // Yay, game is won
                        console.log('Game won!');
                        prompt = 'You won! Congratulations! Click to play again.'
                        current = 0;
                        Crafty.scene('toast');
                    } else {
                        prompt = 'Well done! Click to play the next level.'
                        Crafty.scene('toast');
                    }
                } else {
                    console.log('level failed');
                    prompt = 'Level failed. Click to try again.'
                    Crafty.scene('toast');
                }
            } else {
                setTimeout(updateGameState, 1000);
            }
        }
    });

    Crafty.scene('toast');
}


