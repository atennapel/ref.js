/* ref.js
 * @version: 0.4.2
 * @author: Albert ten Napel
 */
var ref = (function() {
	// util
	function _id(id) {
		return typeof id == 'string'? document.getElementById(id): id;
	}
	function _event(id, name, f) {
		var el = _id(id);
		if(Array.isArray(name)) {
			for(var i = 0, l = name.length; i < l; i++)
				el.addEventListener(name[i], f, false);
		} else el.addEventListener(name, f, false);
		return el;
	}

	// Ref
	function Ref(v) {this.val = v; this._change = []}
	Ref.prototype.get = function() {return this.val};
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
		for(var i = 0, v = this.get(), a = this._change, l = a.length; i < l; i++) a[i](v, this, t);
		return this;
	};

	Ref.prototype.value = function(f) {this.valueOf = f; return this};
	Ref.prototype.show = function(f) {this.toString = f; return this};
	Ref.prototype.change = function(f) {this._change.push(f); return this};

	Ref.prototype.to = function(o, p, f) {
		var o = _id(o);
		if(f) this.change(function(v, t, tt) {o[p] = f(v, t, tt)});
		else this.change(function(v) {o[p] = v});
		return this.refresh(this.get());
	};
	Ref.prototype.from = function(o, p, f) {
		var self = this;
		if(o instanceof Ref) {
			if(p) o.change(function(v) {self.set(p(v, self))}); 
			else o.change(function(v) {self.set(v)});
		} else {
			var o = _id(o);
			if(f) _event(o, p, function(e) {self.set(f(e, self))}, false);
			else _event(o, p, function(e) {self.set(e)}, false);
		}
		return this;
	};

	// RefProp
	function RefProp(o, p) {this.obj = o; this.prop = p; this._change = []}
	RefProp.prototype = Object.create(Ref.prototype);
	RefProp.prototype.get = function() {return this.obj[this.prop]};
	RefProp.prototype.set = function(v) {
		var t = this.get();
		this.obj[this.prop] = v;
		this.refresh(t);
		return t;
	};

	// RefArray
	function RefArray(a) {this.val = a; this._change = []}
	RefArray.prototype = Object.create(Ref.prototype);
	RefArray.prototype.get = function(i) {
		return arguments.length == 0? this.val: this.val[i];
	};
	RefArray.prototype.valueOf = function() {return this.get(0)};
	RefArray.prototype.toString = function() {return '['+this.get().join(', ')+']'};
	RefArray.prototype.set = function(i, v) {
		var t;
		if(arguments.length == 1) {
			t = this.get();
			this.val = i;
		} else {
			t = this.get(i);
			this.val[i] = v;
		}
		this.refresh(t);
		return t;
	};
	
	// ref and static methods
	function ref(v, p) {return typeof p == 'string'? new RefProp(v, p): Array.isArray(v)? new RefArray(v): new Ref(v)}
	ref.id = _id;
	ref.event = _event;
	ref.click = function(id, f) {return _event(id, 'click', f)};
	ref.change = function(id, f) {return _event(id, 'change', f)};

	return ref;
})();
