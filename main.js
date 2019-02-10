(function () {
  let { currentMaze, nodes, start, end } = initialise()

  function initialise(nodes) {
    const size = document.getElementById('size').valueAsNumber

    if (!nodes) {
      nodes = new Array(size).fill()
                             .map((_, x) => {
                               return new Array(size).fill()
                                                     .map((_, y) => ({ x, y, isWall: Math.random(1) < 0.3}))
                             })
    }
    
    let startX = document.getElementById('startX').valueAsNumber
    let endX = document.getElementById('endX').valueAsNumber
    let startY = document.getElementById('startY').valueAsNumber
    let endY = document.getElementById('endY').valueAsNumber

    startX = startX > nodes.length - 1 || startX < 0 ? 0 : startX
    endX = endX > nodes.length - 1 || endX < 0 ? 0 : endX
    startY = startY > nodes[0].length - 1 || startY < 0 ? 0 : startY
    endY = endY > nodes[0].length - 1 || endY < 0 ? 0 : endY
    
    const start = nodes[startX][startY]
    const end = nodes[endX][endY]

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

  function createInitialDrawFunc ({nodes, start, end }, sketch) {
    return sketch.draw = () => {
      sketch.noStroke()
      maze.drawNodes(nodes, start, end, sketch)
    }
  }

  // Toggle walls
  document.addEventListener('click', event => {
    const maze = document.getElementById('maze')
    const mazeBounds = maze.getBoundingClientRect()
    const nodeSize = Math.floor(maze.clientHeight / nodes.length)
    const x = Math.floor((event.x - mazeBounds.left) / nodeSize)  
    const y = Math.floor((event.y - mazeBounds.top) / nodeSize)

    if (nodes[x] && nodes[x][y]) {
      removeMaze()
      
      nodes[x][y].isWall = !nodes[x][y].isWall
      const mazeData = initialise(nodes)

      nodes = mazeData.nodes
      start = mazeData.start
      end = mazeData.end
      currentMaze = mazeData.currentMaze
    }
  })

  document.querySelectorAll('.node__initialiser').forEach(element => {
    element.addEventListener('change', _ => {
      removeMaze()
      
      const mazeData = initialise(nodes)
  
      nodes = mazeData.nodes
      start = mazeData.start
      end = mazeData.end
      currentMaze = mazeData.currentMaze
    })
  })

  document.getElementById('size').addEventListener('change', _ => {
    removeMaze()

    const mazeData = initialise()

    nodes = mazeData.nodes
    start = mazeData.start
    end = mazeData.end
    currentMaze = mazeData.currentMaze
  })

  document.getElementById('start').addEventListener('click', _ => {
    removeMaze()

    currentMaze = maze.makeMaze(nodes, start, end, aStar.createSolveFunc, true)
  })

  function removeMaze () {
    if (currentMaze) {
      currentMaze.remove()
    }

    const oldCanvas = document.querySelector('.p5Canvas')
    
    if (oldCanvas) oldCanvas.remove()
  }
})()