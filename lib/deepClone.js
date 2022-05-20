
// 正常类型拷贝
function deepClone(obj, cacheObj = new WeakMap()) {
  const isArray = (obj) => {
    return Array.isArray(obj)
  }

  const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }
  // 非引用类型直接返回
  if (!isObject(obj) && !isArray(obj)) {
    return obj
  }

  let result
  // json {...obj}
  if (isObject(obj)) {
    result = { ...obj }
  }

  // array  [...obj]
  if (isArray(obj)) {
    result = [...obj]
  }

  // 有缓存返回缓存
  if (cacheObj.has(obj)) {
    return cacheObj.get(obj)
  }
  cacheObj.set(obj, result)

  for (let key in obj) {
    if (isObject(obj[key]) || isArray(obj[key])) {
      result[key] = deepClone(obj[key])
    } else {
      result[key] = obj[key]
    }
  }

  return result
}

var obj1 = {
  arr: [
    {
      a: 1,
      b: 2
    },
    {
      a: 3,
      b: 4
    }
  ],
  o: {
    h: 'h',
    y: 'y'
  }
}

var newObj = deepClone(obj1)

newObj.arr[0].a = 100
newObj.o.h = 'hhhhhhh'

console.log(newObj)


// 拷贝正则
function cloneRegExp(regexp) {
  // reFlags.exec(regexp) 与 regexp.flags 相同
  const result = new regexp.constructor(regexp.source, reFlags.exec(regexp))
  result.lastIndex = regexp.lastIndex
  return result
}
const reFlags = /\w*$/

cloneRegExp(/xyz/gim)