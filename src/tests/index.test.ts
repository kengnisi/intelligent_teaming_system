/**
 * /cache/_redis.js
 * redis的方法get和set
*/
const redis = require('redis')

let REDIS_CONF = {
  port: 6379,
  host: '127.0.0.1'
}

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', (err: Error) => {
  console.error('redis error', err)
})

/**
 * redis set
 * @param {string} key 键
 * @param {string} val 值
 * @param {number} timeout 过期时间，单位 s
 */
function set(key: string, val: string, timeout = 10) {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val)
  redisClient.expire(key, timeout)
}

/**
 * redis get
 * @param {string} key 键
 */
function get(key: string) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err: Error, val: string) => {
      if (err) {
        reject(err)
        return
      }
      if (val == null) {
        resolve(null)
        return
      }

      try {
        resolve(
          JSON.parse(val)
        )
      } catch (ex) {
        resolve(val)
      }
    })
  })
  return promise
}

describe("sum", () => {
  it('sum 1', () => {
    expect(1 + 1).toEqual(2)
  })
})

describe("set redis", () => {
  it("set redis", () => {
    set('userInfo', "hly")
    expect(get('userInfo')).toEqual("hly")
  })
})