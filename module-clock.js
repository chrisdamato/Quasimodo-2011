;(function(exports){
	var clock = exports.clock = {
		adjust: function(ms) {return ms},
		_now: new Date(),
		_s: undefined,
		_m: undefined,
		_d: undefined,
		/*
		hooks for changes to clock
		*/
		onSecond: function() {},
		onMinute: function() {},
		onDate: function() {},
		update: function() {
			var now = this._now;
			now.setTime( this.adjust( Date.now() ) );
			if (now.getSeconds()==this._s) {
				return;
			} else {
				this.onSecond();
				this._s=now.getSeconds();
			}
			if (now.getMinutes()==this._m) {
				return;
			} else {
				this.onMinute();
				this._m=now.getMinutes();
			}
			if (now.getDate()==this._d) {
				return;
			} else {
				this.onDate();
				this._d=now.getDate();
			}
		},
	};

	clock.__defineGetter__("now", function() {
		return this._now;
		}
	)

	clock.tick = (function() {
			this.update();
			setTimeout(this.tick,1000)
		}).bind(clock);


}(this));