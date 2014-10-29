/* ref.js
 * @version: 0.4
 * @author: Albert ten Napel
 */
var ref = (function() {
	function Ref(v) {
		this.val = v;
		this._change = [];
	}
	Ref.prototype.get = function() {
		return this.val;
	};
	Ref.prototype.valueOf = function() {return this.get()};
	Ref.prototype.toString = function() {return ''+this.get()};
	Ref.prototype.set = function(v) {
		var t = this.get();
		this.val = v;
		this.refresh(t);
		return t;
	};
	Ref.prototype.update = function(f) {return this.set(f(this.get()))};
	Ref.prototype.refresh = function(t) {
		for(var i = 0, v = this.get(), a = this._change, l = a.length; i < l; i++) a[i](v, t, this);
		return this;
	};
	Ref.prototype.value = function(f) {this.valueOf = f; return this};
	Ref.prototype.show = function(f) {this.toString = f; return this};
	Ref.prototype.change = function(f) {this._change.push(f); return this};
	Ref.prototype.to = function(o, p, f) {
		var o = typeof o == 'string'? document.getElementById(o): o;
		if(f) this.change(function(v) {o[p] = f(v)});
		else this.change(function(v) {o[p] = v});
		return this.refresh(this.get());
	};
	Ref.prototype.from = function(o, p, f) {
		var self = this;
		if(o instanceof Ref) {
			if(p) o.change(function(v) {self.set(p(v))}); 
			else o.change(function(v) {self.set(v)}); 
		} else {
			var o = typeof o == 'string'? document.getElementById(o): o;
			if(f) o.addEventListener(p, function(e) {self.set(f(e))}, false);
			else o.addEventListener(p, function(e) {self.set(e)}, false);
		}
		return this;
	};
	function ref(v) {return new Ref(v)}
	return ref;
})();
