
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function promiseResolvionHandler(promise2, x, resolve, reject) {
  // 处理循环引用
  if (x === promise2) {
    throw new Error('循环调用了promise')
  }

  // 处理promise对象
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(y => {
        // 如果y是个 thenable｜promise对象等
        promiseResolvionHandler(promise2, y, resolve, reject)
      }, reject)
    }
    x.state === FULFILLED && resolve(this.value)
    x.state === REJECTED && reject(this.value)
  }


  // 处理thenable对象
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    if (typeof x.then === 'function') {
      x.then(y => {
        promiseResolvionHandler(promise2, y, resolve, reject)
      }, reject)
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }

}

class MyPromise {
  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.resolvedCallbacks = []
    this.rejectedCallbacks = []

    this.resolve = (value) => {
      if ((typeof value === 'object' || typeof value === 'function') && value.then) {
        promiseResolvionHandler(this, value, this.resolve, this.reject)
        return
      }
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = FULFILLED
          this.value = value

          if (this.resolvedCallbacks.length) {
            this.resolvedCallbacks.map(fn => fn(this.value))
          }
        }
      })
    }

    this.reject = (value) => {
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED
          this.value = value
          if (this.rejectedCallbacks.length) {
            this.rejectedCallbacks.map(fn => fn())
          }
        }
      })
    }

    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  then(
    onResolved = val => val,
    onRejected = err => {
      throw new Error(err)
    }
  ) {
    const promise2 = new MyPromise((resolve, reject) => {
      // 处理正常态
      if (this.state === PENDING) {
        this.resolvedCallbacks.push(() => {
          const x = onResolved(this.value)
          promiseResolvionHandler(promise2, x, resolve, reject)
        })

        this.rejectedCallbacks.push(() => {
          const x = onRejected(this.value)
          promiseResolvionHandler(promise2, x, resolve, reject)
        })
      }

      // 处理成功态
      if (this.state === FULFILLED) {
        const x = onResolved(this.value)
        promiseResolvionHandler(promise2, x, resolve, reject)
      }

      // 处理失败态
      if (this.state === REJECTED) {
        const x = onRejected(this.value)
        promiseResolvionHandler(promise2, x, resolve, reject)
      }
    })

    return promise2
  }

  catch(callback) {
    return this.then(null, callback)
  }

  static resolve(value) {
    if ((typeof value !== 'object' || typeof value !== 'function') && !value.then) {
      return new MyPromise(resolve => {
        resolve(value)
      })
    }
    return value
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const promiseNum = promises.length
      const resolveResult = new Array(promiseNum)
      let promiseIndex = 0

      const resolveHandler = (index, data) => {
        resolveResult[index] = data
        promiseIndex++

        if (promiseIndex === promiseNum) {
          resolve(resolveResult)
        }
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(data => {
          resolveHandler(index, data)
        }, reject)
      })
    })
  }

  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      const promiseNum = promises.length
      const resolveResult = new Array(promiseNum)
      let promiseIndex = 0

      const resolveHandler = (index, data) => {
        resolveResult[index] = data
        promiseIndex++

        if (promiseIndex === promiseNum) {
          resolve(resolveResult)
        }
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(data => {
          resolveHandler(index, {
            status: FULFILLED,
            value: data
          })
        }, error => {
          resolveHandler(index, {
            status: REJECTED,
            reason: error
          })
        })
      })
    })
  }

}


function initMyPromiseDemo() {
  MyPromise.all([
    new MyPromise((resolve, reject) => {
      setTimeout(() => { resolve(3) }, 3000)
    }), 2
  ]).then(res => {
    console.log('支持Promise.all', res)
  })

  MyPromise.allSettled([
    new MyPromise((resolve, reject) => {
      setTimeout(() => { reject(3) }, 3000)
    }), 2
  ]).then(res => {
    console.log('支持Promise.allSettled', res)
  })

  // step1
  new MyPromise((resolve, reject) => {
    resolve('step1 - 支持同步resolve')
  }).then(res => {
    console.log(res)
  })

  // step1.1
  new MyPromise((resolve, reject) => {
    reject('step1.1 - 支持reject报错')
  }).then(res => {
    console.log(res)
  })

  new MyPromise((resolve, reject) => {
    reject('step1.2 - 支持catch')
  }).catch(res => {
    console.log(res)
  })

  // step2
  new MyPromise((resolve, reject) => {
    resolve(new MyPromise((resolve, reject) => {
      resolve('step2 - 支持resolve传递promise对象 && 支持空then')
    }))
  }).then().then(res => {
    console.log(res)
    return 'step2.1 - 支持多个then'
  }).then(res => {
    console.log(res)
    return {
      then(y) {
        y('step2.2 - thenable')
      }
    }
  }).then(res => {
    console.log(res)
    return new MyPromise((resolve, reject) => {
      resolve('step2.3 - 支持then传递Promise对象')
    })
  }).then(res => {
    console.log(res)
  })

  // step3
  new MyPromise((resolve, reject) => {
    setTimeout(() => {

    }, 50)
  }).then(res => {
    console.log(res)
  })

  // step3
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('step3 - 只会异步resolve')
    }, 2000)
  }).then(res => {
    console.log(res)
  })
}
