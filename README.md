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
o.n.get() === n.get();
```
