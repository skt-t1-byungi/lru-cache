type CacheElement<V> = {val: V; expire: number}
type CacheMap<V> = Record<string, CacheElement<V>>

export class LRUCache<V, K extends string> {
    private _max: number
    private _ttl: number
    private _cache: CacheMap<V> = {}
    private _oldCache: CacheMap<V> = {}
    private _size = 0

    constructor ({ max = Infinity, ttl = Infinity } = {}) {
        this._max = max
        this._ttl = ttl
    }

    has (key: K) {
        const now = Date.now()
        if (hasOwn(this._cache, key) && this._cache[key].expire > now) return true
        if (hasOwn(this._oldCache, key) && this._cache[key].expire > now) return true
        return false
    }

    set (key: K, val: V, { ttl = this._ttl } = {}) {
        const el = { val, expire: Date.now() + ttl }
        if (hasOwn(this._cache, key)) {
            this._cache[key] = el
        } else {
            this._set(key, el)
        }
    }

    _set (key: K, el: CacheElement<V>) {
        this._cache[key] = el
        this._size++
        if (this._size >= this._max) {
            this._oldCache = this._cache
            this._cache = {}
            this._size = 0
        }
    }

    get (key: K) {
        if (hasOwn(this._cache, key)) {
            const el = this._cache[key]
            if (el.expire > Date.now()) return el.val

            delete this._cache[key]
            this._size--
            return
        }

        if (hasOwn(this._oldCache, key)) {
            const el = this._oldCache[key]
            delete this._oldCache[key]

            if (el.expire > Date.now()) {
                this._set(key, el)
                return el.val
            }
        }
    }

    delete (key: K) {
        if (hasOwn(this._cache, key)) this._size--
        delete this._cache[key]
        delete this._oldCache[key]
    }

    clear () {
        this._cache = {}
        this._oldCache = {}
        this._size = 0
    }
}

export default LRUCache

function hasOwn (o: object, k: string): boolean {
    return Object.prototype.hasOwnProperty.call(o, k)
}
