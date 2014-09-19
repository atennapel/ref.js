ref.js
======

Take references of primitive values or object properties

```javascript
var n = 10;
var o = {n: n};
n = 11;
o.n !== n;

var n = ref(10);
var o = {n: n};
n.set(11);
// the + operator unwraps the primitive value from the ref
+o.n === +n;

var o = {a: 10};
var a = o.a;
a = 11;
o.a !== a;

var o = {a: 10};
var a = ref(o, 'a');
a.set(11);
o.a === +a;
```
