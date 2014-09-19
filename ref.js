/* ref.js
 * @version: 0.1
 * @author: Albert ten Napel
 */
var ref = (function() {
	function Ref(v) {this.val = v}
	Ref.prototype.get = function() {return this.val};
	Ref.prototype.valueOf = function() {return this.get()};
	Ref.prototype.set = function(v) {
		var t = this.val;
		this.val = v;
		return t;
	};
	Ref.prototype.update = function(f) {return this.set(f(this.get()))};
	Ref.prototype.map = function() {return this.update()};

	function PropRef(o, p) {this.obj = o; this.prop = p}
	PropRef.prototype = Object.create(Ref.prototype);
	PropRef.prototype.get = function() {return this.obj[this.prop]};
	PropRef.prototype.set = function(v) {
		var o = this.obj, p = this.prop, t = o[p];
		o[p] = v;
		return t;
	};

	function ref(v, p) {
		if(arguments.length < 2)
			return new Ref(v);
		else
			return new PropRef(v, p);
	}

	return ref;
})();
