(function () {
  document.getElementById('start').addEventListener('click', (event => {
    const oldCanvas = document.querySelector('.p5Canvas')
    
    if (oldCanvas) oldCanvas.remove()

    const size = document.getElementById('size').valueAsNumber

    const nodes = new Array(size).fill()
                             .map((_, x) => {
                               return new Array(size).fill().map((_, y) => ({ x, y, isWall: Math.random(1) < 0.3}))
                             })

    const start = nodes[0][0]
    const end = nodes[size - 1][size - 1]

    makeMaze(nodes, start, end)
  }))
})()