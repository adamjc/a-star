(function () {
  let { currentMaze, nodes, start, end } = initialise()

  function initialise(nodes, start = { x: 0, y: 0 }, end = { x: null, y: null }) {
    const size = document.getElementById('size').valueAsNumber

    if (end.x === null || end.y === null) {
      end.x = size - 1
      end.y = size - 1
    }

    if (!nodes) {
      nodes = new Array(size).fill()
                             .map((_, x) => {
                               return new Array(size).fill()
                                                     .map((_, y) => ({ x, y, isWall: Math.random(1) < 0.3}))
                             })
    }
    
    nodes[start.x][start.y] = start
    nodes[end.x][end.y] = end

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

  document.querySelector('.node-selectors__node--wall').addEventListener('click', event => {
    // Get all node-selector buttons and unset them all
    document.querySelectorAll('.node-selectors button').forEach(el => el.disabled = false)

    event.target.disabled = true
  })

  document.querySelector('.node-selectors__node--start').addEventListener('click', event => {
    // Get all node-selector buttons and unset them all
    document.querySelectorAll('.node-selectors button').forEach(el => el.disabled = false)

    event.target.disabled = true
  })

  document.querySelector('.node-selectors__node--end').addEventListener('click', event => {
    // Get all node-selector buttons and unset them all
    document.querySelectorAll('.node-selectors button').forEach(el => el.disabled = false)

    event.target.disabled = true
  })

  // Toggle walls/start/end
  document.getElementById('maze').addEventListener('click', event => {
    const maze = document.getElementById('maze')
    const mazeBounds = maze.getBoundingClientRect()
    const nodeSize = maze.clientHeight / nodes.length
    const x = Math.floor((event.x - mazeBounds.left) / nodeSize)  
    const y = Math.floor((event.y - mazeBounds.top) / nodeSize)
    const type = [...document.querySelectorAll('.node-selectors button')].filter(el => el.disabled)[0].innerText

    if (nodes[x] && nodes[x][y]) {
      if (type === 'Start') {
        start = nodes[x][y]
      } else if (type === 'End') {
        end = nodes[x][y]
      } else {
        nodes[x][y].isWall = !nodes[x][y].isWall
      }

      removeMaze()
      
      const mazeData = initialise(nodes, start, end)

      nodes = mazeData.nodes
      start = mazeData.start
      end = mazeData.end
      currentMaze = mazeData.currentMaze
    }
  })

  // Redraw if size changes
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