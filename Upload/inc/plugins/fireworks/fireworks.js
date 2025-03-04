////////////////////////////////////////////////////////////////////////
// Fireworks-Script (c) 2012, Dominik Scholz / go4u.de Webdesign
////////////////////////////////////////////////////////////////////////

var fireworks = {

	///////////////////////////// configuration ////////////////////////////
	
	// random colors
	_color: ['#D0D0D0', '#FF0000', '#FFFF00', '#22FF00', '#2040FF', '#00CCFF', '#FF00FF', '#A319D6'],
	// gravity factor
	_gravity: 0.07,
	// air resistance factor
	_resistance: 0.975,
	// zIndex of particles
	_zIndex: 20000,
	// maximal age of particles (in msec)
	_maxAge: 2000,
	// interval of appearing explosions (in msec)
	_interval: [500, 2500],
	// amount of particles per explosion
	_particlesPerExplosion: 40,
	// maximal speed of particle at moment of explosion
	_speed: 5,

	
	
	///////////////////////////// private vars /////////////////////////////
	
	_particles: [],
	_bodyWidth: 0,
	_bodyHeight: 0,
	_count: 0,
	_lastInterval: 0,

	

	////////////////////////////// functions ///////////////////////////////

	// init fireworks
	init: function()
	{
		this._addEventListener(window, 'resize', function() { return fireworks.resize.apply(fireworks); });
		this._addEventListener(window, 'load', function() { return fireworks.start.apply(fireworks); });
	},
	
	
	// add an event listener
	_addEventListener: function(el, name, handler)
	{
		if (el.addEventListener)
			el.addEventListener(name, handler, false); 
		else if (el.attachEvent)
			el.attachEvent('on' + name, handler);
	},
	
	
	// start fireworks
	start: function()
	{
		// init window size
		this.resize();

		// start to move snow
		this._lastInterval = this._time();
		requestAnimFrame(function() {fireworks._move();});
		
		this._addExplosion();
	},
	
	
	// add a new explosion
	_addExplosion: function()
	{
		var x = Math.floor(Math.random() * this._bodyWidth),
			y = Math.floor((Math.random() * .5 + .1) * this._bodyHeight),
			dx = Math.random() * 10 - 5,
			dy = Math.random() * -2 - 1,
			c1 = this._random(this._color),
			c2 = this._random(this._color);
		
		for (var i = 0; i < this._particlesPerExplosion; i++)
		{
			this._createParticle(
				x,
				y,
				dx,
				dy,
				i / (this._particlesPerExplosion - 1) * 180 * Math.PI,
				Math.random() * this._speed,
				Math.random() > .5 ? c1 : c2
			);
		}
		
		window.setTimeout(
			function() { return fireworks._addExplosion.apply(fireworks);},
			Math.random() * (this._interval[1] - this._interval[0]) + this._interval[0]
		);
	},
	
	
	// get current time
	_time: function()
	{
		return +new Date();
	},
	

	// return a random array element
	_random: function(arr)
	{
		return arr[
			Math.floor(
				Math.random() * (arr.length)
			)
		];
	},
	
	
	// creates a new particle
	_createParticle: function(x, y, dx, dy, rot, speed, color)
	{
		var el = null,
			foundEl = false,
			p = this._particles;

		// look for old particle
		for (var i = 0, l = p.length; i < l; i++)
			if (p[i].data.age > 1)
			{
				el = p[i];
				foundEl = true;
				break;
			}
	
		// create span child for particles
		if (!foundEl)
		{
			el = document.createElement('div');
			el.className      = 'particle';
			el.style.position = 'absolute';
			el.style.fontSize = '20px';
			el.style.zIndex   = this._zIndex;
			el.style.width    = '10px';
			el.style.overflow = 'hidden';
			el.innerHTML      = '&#x25cf;';
		}

		el.style.left     = x + 'px';
		el.style.top      = y + 'px';
		el.style.color    = color;
		el.data = {
			x: x,
			y: y,
			dx: Math.cos(rot) * speed + dx,
			dy: Math.sin(rot) * speed + dy,
			color: color,
			age: Math.random() * .25
		};
		
		if (!foundEl)
		{
			document.getElementsByTagName('body')[0].appendChild(el);
			this._particles.push(el);
		}
	},

	
	// move existing particles
	_move: function()
	{
		requestAnimFrame(function() {fireworks._move();});
	
		// calculate movement factor
		var dif = this._time() - this._lastInterval;
		this._lastInterval = this._time();
		var delta = dif / 20;
		
		var el,
			d,
			p = this._particles,
			r = Math.pow(this._resistance, delta),
			g = this._gravity * delta,
			a = dif / this._maxAge;
		
		for (var i = 0, l = p.length; i < l; i++)
		{
			el = p[i];
			d = el.data;
			
			if (d.age > 1)
				continue;
			
			d.age += a;
			d.dy += g;
			d.dx *= r;
			d.dy *= r;
			d.x += d.dx * delta;
			d.y += d.dy * delta;
			
			if (d.x < 0)
			{
				d.dx *= -1;
				d.x = 0;
			}
			if (d.x > this._bodyWidth)
			{
				d.dx *= -1;
				d.x = this._bodyWidth;
			}
			if (d.y < 0)
			{
				d.dy *= -1;
				d.y = 0;
			}
			if (d.y > this._bodyHeight)
			{
				d.dy *= -1;
				d.y = this._bodyHeight;
			}
			
			if (d.age > 1)
				d.x = d.y = 0;
			
			el.style.left = d.x + 'px';
			el.style.top = d.y + 'px';
			el.style.color = (Math.random() * .5 + d.age >= 1) ? 'transparent' : d.color;
			el.style.fontSize = (1 - d.age) * 5 + 5 + 'px';
		}
	},
	

	// calculate new positions for all particles
	resize: function()
	{
		// get new width and height
		this._bodyWidth = this._getWindowWidth() - 10;
		this._bodyHeight = this._getWindowHeight() - 20;
	},

	
	// get window width
	_getWindowWidth: function()
	{
		return document.getElementsByTagName('body')[0].offsetWidth;
	},

	
	// get window height
	_getWindowHeight: function()
	{
		var h = Math.max(self.innerHeight || 0, window.innerHeight || 0);
		
		if (document.documentElement)
			h = Math.max(h, document.documentElement.clientHeight || 0);
		if (document.body)
		{
			h = Math.max(h, document.body.clientHeight || 0);
			h = Math.max(h, document.body.scrollHeight || 0);
			h = Math.max(h, document.body.offsetHeight || 0);
		}
		
		return h;
	}

};

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function (cb){
			window.setTimeout(cb, 1000 / 60);
		  };
})();

fireworks.init();