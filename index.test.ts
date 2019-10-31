import test from 'ava'
import pDelay from '@byungi/p-delay'
import LRUCache from '.'

const history = (c: any) => [Object.keys(c._cache), Object.keys(c._oldCache)]

test('get/set/has', t => {
    const cache = new LRUCache<number>({ max: 2 })

    t.false(cache.has('a'))
    cache.set('a', 1)
    t.is(cache.get('a'), 1)
    t.true(cache.has('a'))

    cache.set('1', 2) // => Be replaced.
    t.true(cache.has('a'))
    cache.set('2', 3)
    t.true(cache.has('a'))

    cache.set('3', 4) // => drop
    t.false(cache.has('a'))
})

test('replacement', t => {
    const cache = new LRUCache<number>({ max: 3 })

    cache.set('a', 1)
    t.deepEqual(history(cache), [['a'], []])
    cache.set('b', 1)
    t.deepEqual(history(cache), [['a', 'b'], []])
    cache.set('c', 1)
    t.deepEqual(history(cache), [[], ['a', 'b', 'c']])
    cache.set('d', 1)
    t.deepEqual(history(cache), [['d'], ['a', 'b', 'c']])
    cache.set('e', 1)
    t.deepEqual(history(cache), [['d', 'e'], ['a', 'b', 'c']])
    cache.set('f', 1)
    t.deepEqual(history(cache), [[], ['d', 'e', 'f']])
    cache.get('d')
    t.deepEqual(history(cache), [['d'], ['e', 'f']])
})

test('ttl', async t => {
    const cache = new LRUCache<number>({ max: 2, ttl: 100 })

    cache.set('a', 1)
    t.true(cache.has('a'))
    await pDelay(50)
    t.true(cache.has('a'))
    await pDelay(50)
    t.false(cache.has('a'))

    cache.set('b', 1)
    t.true(cache.has('b'))
    await pDelay(50)
    cache.get('b') // => renew
    await pDelay(50)
    t.true(cache.has('b'))
})

test('renewTTL is `false`', async t => {
    const cache = new LRUCache<number>({ max: 2, ttl: 100, renewTTL: false })
    cache.set('a', 1)
    t.true(cache.has('a'))
    await pDelay(50)
    t.true(cache.has('a'))
    await pDelay(50)
    t.false(cache.has('a'))

    cache.set('b', 1)
    t.true(cache.has('b'))
    await pDelay(50)
    cache.get('b') // => not renew
    await pDelay(50)
    t.false(cache.has('b'))
})
