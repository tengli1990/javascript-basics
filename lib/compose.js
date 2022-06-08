function initCompose() {
  // compose main

  function compose(...funcs){
    if(funcs.length ===0){
      return arg=>arg
    }
    
    if(funcs.length === 1){
      return funcs[0]
    }
    
    return funcs.reduce((a,b)=>{
      return (args)=>a(b(args))
    })
  }
  const fn1 = (x) => x + 10;
  const fn2 = (y) => y * 10;
  const fn3 = (z) => z - 10;
  let result = compose(fn3,fn2, fn1)(1);
  console.log('--result--', result);
}