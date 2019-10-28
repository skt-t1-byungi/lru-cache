# @byungi/lru-cache
> Typed fast LRU cache for browser.

Implemented by the fast lru algorithm of [hashlru](https://github.com/dominictarr/hashlru).
Added [ttl](https://en.wikipedia.org/wiki/Time_to_live) and old browser support.


[![npm](https://flat.badgen.net/npm/v/@byungi/lru-cache)](https://www.npmjs.com/package/@byungi/lru-cache)
[![license](https://flat.badgen.net/github/license/skt-t1-byungi/lru-cache)](https://github.com/skt-t1-byungi/lru-cache/blob/master/LICENSE)

## Install
```sh
npm i @byungi/lru-cache
```

## Example
```js
import LRUCache from '@byungi/lru-cache'

const cache = new LRUCache({max: 2, ttl: 100})

cache.set('a', 1)
console.log(cache.has('a')) // => true

cache.set('b', 2)
cache.set('c', 3)
cache.set('d', 4)
console.log(cache.has('a')) // => false

console.log(cache.has('d')) // => true
setTimeout(()=> {
    // After ttl(100ms).
    console.log(cache.has('d')) // => false
}, 100)
```

## API
### new LRUCache(options?)
Create an instance.

#### options
- `max` - Maximum cache size. (Default: `Infinity`)
- `ttl` - Default `ttl` when calling a `cache.set()`. (Default: `Infinity`)

### cache.set(key, value, options?)
Set value by key.

#### options
- `ttl` - Time to live.

### cache.get(key)
Get value by key.

### cache.has(key)
Returns whether a key exists.

### cache.delete(key)
Delete value by key

### cache.clear()
Delete all values.

## License
MIT
