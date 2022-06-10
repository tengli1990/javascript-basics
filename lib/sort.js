
function initSort() {
  // 冒泡排序
  function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
          var temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }
  }

  console.log('1、冒泡排序')
  var arr = [23, 2, 3, 4, 24, 2, 342, 4, 52, 6, 3]
  bubbleSort(arr)
  console.log(arr)


  // 选择排序
  function selectionSort(arr) {
    var len = arr.length
    for (var i = 0; i < len; i++) {
      var cur = arr[i]
      for (var j = i + 1; j < len; j++) {
        if (cur > arr[j]) {
          var temp = arr[j]
          arr[j] = cur
          cur = temp
          arr[i] = cur
        }
      }
    }
  }
  console.log('2、选择排序')
  var selectionSrotArr = [3, 2, 1, 33, 22, 1, 55, 21, 45]
  selectionSort(selectionSrotArr)
  console.log(selectionSrotArr)

  // 插入排序
  function insertionSort(arr){
    var len = arr.length
    for(var i = 0; i < len; i++){
      for(var j = i+1; j >0; j--){
        if(arr[j] < arr[j-1]){
          var temp = arr[j]
          arr[j] = arr[j-1]
          arr[j-1] = temp
        }
      }
    }
  }

  console.log('3、插入排序')
  var insertionSortArr = [3, 2, 1, 33, 22, 1, 55, 21, 45]
  insertionSort(insertionSortArr)
  console.log(insertionSortArr)




}





