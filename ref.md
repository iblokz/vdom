## hooks
- create
- update
- destroy
- remove

## module arch
```js
function updateClass (oldVnode, vnode) {}

module.exports = {create: updateClass, update: updateClass};
```

## vnode structure
```json
{
	"sel": "sel",
	"data": "data",
	"children": "children",
  "text": "text",
	"elm": "elm",
	"key": "key"
}
```
