type CacheElement<T> = {val: T; expire: number; ttl: number}
type CacheMap<T> = Record<string, CacheElement<T>>

export class LRUCache<T> {
    private _max: number
    private _ttl: number
    private _cache: CacheMap<T> = {}
    private _oldCache: CacheMap<T> = {}
    private _size = 0

    constructor ({ max = Infinity, ttl = Infinity } = {}) {
        this._max = max
        this._ttl = ttl
    }

    has (key: string) {
        if (hasOwn(this._cache, key)) {
            const el = this._cache[key]
            if (el.expire <= Date.now()) {
                delete this._cache[key]
                this._size--
                return false
            }
            return true
        }
        if (hasOwn(this._oldCache, key)) {
            const el = this._oldCache[key]
            if (el.expire <= Date.now()) {
                delete this._oldCache[key]
                return false
            }
            return true
        }
        return false
    }

    set (key: string, val: T, { ttl = this._ttl } = {}) {
        const el = { val, ttl, expire: Date.now() + ttl }
        if (hasOwn(this._cache, key)) {
            this._cache[key] = el
        } else {
            this._set(key, el)
        }
    }

    private _set (key: string, el: CacheElement<T>) {
        this._cache[key] = el
        this._size++
        if (this._size >= this._max) {
            this._oldCache = this._cache
            this._cache = {}
            this._size = 0
        }
    }

    get (key: string) {
        if (hasOwn(this._cache, key)) {
            const el = this._cache[key]
            const now = Date.now()
            if (el.expire > now) {
                el.expire = now + el.ttl
                return el.val
            }
            delete this._cache[key]
            this._size--
            return
        }
        if (hasOwn(this._oldCache, key)) {
            const el = this._oldCache[key]
            delete this._oldCache[key]
            const now = Date.now()
            if (el.expire > now) {
                el.expire = now + el.ttl
                this._set(key, el)
                return el.val
            }
        }
    }

    delete (key: string) {
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
