function createInitialDrawFunc ({nodes, start, end }, sketch) {
  return sketch.draw = () => {
    sketch.noStroke()
    maze.drawNodes(nodes, start, end, sketch)
  }
}

(function () {
  function makeInitialMaze(nodes) {
    const size = document.getElementById('size').valueAsNumber

    if (!nodes) {
      nodes = new Array(size).fill()
                             .map((_, x) => {
                               return new Array(size).fill()
                                                     .map((_, y) => ({ x, y, isWall: Math.random(1) < 0.3}))
                             })
    }
    
    const start = nodes[0][0]
    const end = nodes[size - 1][size - 1]

    if (start.isWall) start.isWall = false
    if (end.isWall) end.isWall = false

    const currentMaze = maze.makeMaze(nodes, start, end, createInitialDrawFunc, true)

    return {
      currentMaze,
      nodes,
      start,
      end
    }
  }

  let { currentMaze, nodes, start, end } = makeInitialMaze()

  // Toggle walls
  document.addEventListener('click', event => {
    const xOffset = document.getElementById('menu').clientWidth
    const x = Math.floor((event.x - xOffset) / (window.innerHeight / nodes.length))
    const y = Math.floor((event.y) / (window.innerHeight / nodes.length))

    if (nodes[x] && nodes[x][y]) {
      if (currentMaze) {
        currentMaze.remove()
      }

      const oldCanvas = document.querySelector('.p5Canvas')
    
      if (oldCanvas) oldCanvas.remove()
      nodes[x][y].isWall = !nodes[x][y].isWall
      const mazeData = makeInitialMaze(nodes)

      nodes = mazeData.nodes
      start = mazeData.start
      end = mazeData.end
      currentMaze = mazeData.currentMaze
    }
  })

  document.getElementById('size').addEventListener('change', _ => {
    if (currentMaze) {      
      currentMaze.remove()
    }

    const oldCanvas = document.querySelector('.p5Canvas')
    
    if (oldCanvas) oldCanvas.remove()
    const mazeData = makeInitialMaze()

    nodes = mazeData.nodes
    start = mazeData.start
    end = mazeData.end
    currentMaze = mazeData.currentMaze
  })

  document.getElementById('start').addEventListener('click', _ => {
    if (currentMaze) {
      console.log(currentMaze)
      currentMaze.remove()
    }

    const oldCanvas = document.querySelector('.p5Canvas')
    
    if (oldCanvas) oldCanvas.remove()

    currentMaze = maze.makeMaze(nodes, start, end, aStar.createSolveFunc, true)
  })
})()