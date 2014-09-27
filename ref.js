/* ref.js
 * @version: 0.3.2
 * @author: Albert ten Napel
 */
var ref = (function() {
	function Ref(v, a) {
		if(typeof v == 'function') {
			this.fn = v;
			this.val = v();
		} else
			this.val = v;
		this.chain = [];
		if(a) this.dependsOn(a);
	}
	Ref.prototype.get = function() {
		return this._parser? this._parser(this.val): this.val;
	};
	Ref.prototype.valueOf = function() {return this.get()};
	Ref.prototype.toString = function() {return ''+this.get()};
	Ref.prototype.set = function(v) {
		var t = this.get();
		this.val = this._compiler? this._compiler(v): v;
		this.changed();
		return t;
	};
	Ref.prototype.update = function(f) {return this.set(f(this.get()))};
	Ref.prototype.map = function(f) {return this.update(f)};
	Ref.prototype.changed = function() {
		for(var i = 0, a = this.chain, l = a.length; i < l; i++)
			a[i].refresh();
	};
	Ref.prototype.refresh = function() {if(this.fn) this.set(this.fn())};
	Ref.prototype.dependsBy = function(a) {
		if(Array.isArray(a))
			for(var i = 0, l = a.length; i < l; i++)
				this.chain.push(a[i]);
		else this.chain.push(a);
		return this;
	};
	Ref.prototype.dependsOn = function(a) {
		if(Array.isArray(a))
			for(var i = 0, l = a.length; i < l; i++)
				a[i].dependsBy(this);
		else a.dependsBy(this);
		return this;
	};
	Ref.prototype.value = function(f) {this.valueOf = f; return this};
	Ref.prototype.show = function(f) {this.toString = f; return this};
	Ref.prototype.compiler = function(f) {
		this._compiler = f;
		return this;
	};
	Ref.prototype.parser = function(f) {
		this._parser = f;
		return this;
	};

	function PropRef(o, p, v, a) {
		this.obj = o;
		this.prop = p;
		if(o) {
			if(typeof v == 'function') {
				this.fn = v;
				o[p] = v();
			} else if(typeof v != 'undefined')
				o[p] = v;
		}
		this.chain = [];
		if(a) this.dependsOn(a);
	}
	PropRef.prototype = Object.create(Ref.prototype);
	PropRef.prototype.get = function() {
		if(!this.obj) return;
		var t = this.obj[this.prop];
		return this._parser? this._parser(t): t;
	};
	PropRef.prototype.set = function(v) {
		if(!this.obj) return;
		var o = this.obj, p = this.prop, t = this.get();
		o[p] = this._compiler? this._compiler(v): v;
		this.changed();
		return t;
	};
	PropRef.prototype.getObject = function(o) {return this.obj};
	PropRef.prototype.getProp = function(o) {return this.prop};
	PropRef.prototype.setObject = function(o) {
		var t = this.obj;
		this.obj = o;
		return t;
	};
	PropRef.prototype.setProp = function(p) {
		var t = this.prop;
		this.prop = p;
		return t;
	};

	function ref(v, p, i, a) {
		var t = typeof v;
		if(t == 'number' || t == 'string' ||
				t == 'boolean' || t == 'undefined')
			return new Ref(v, p);
		else {
			if(!p && v instanceof HTMLElement) {
				var n = v.tagName;
				if(n == 'INPUT' || n == 'SELECT')
					p = 'value';
				else if(n == 'DIV')
					p = 'innerHTML';
			}
			return new PropRef(v, p, i, a);
		}
	}

	return ref;
})();

function refId(v, p, i, a) {
	return ref(document.getElementById(v), p, i, a);
}
