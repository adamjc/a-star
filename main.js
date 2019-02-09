(function () {
  function makeInitialMaze(nodes) {
    const size = document.getElementById('size').valueAsNumber

    if (!nodes) {
      nodes = new Array(size).fill()
                             .map((_, x) => {
                               return new Array(size).fill().map((_, y) => ({ x, y, isWall: Math.random(1) < 0.3}))
                             })
    }
    
    const start = nodes[0][0]
    const end = nodes[size - 1][size - 1]

    if (start.isWall) start.isWall = false
    if (end.isWall) end.isWall = false

    new p5(sketch => {
      sketch.setup = () => {
        const canvas = sketch.createCanvas(sketch.windowHeight, sketch.windowHeight)
        
        canvas.parent('maze')
      }

      sketch.draw = () => {
        sketch.noStroke()
        const nodeSize = (sketch.width / nodes.length) - 1
        // draw all nodes
        for (let x = 0; x < nodes.length; x += 1) {
          for (let y = 0; y < nodes[x].length; y += 1) {
            if (nodes[x][y].isWall) sketch.fill('#444')
            else sketch.fill(255, 255, 255)
      
            drawNode(x * nodeSize, y * nodeSize, nodeSize, sketch)
          }
        }
      }
    })

    return {
      nodes,
      start,
      end
    }
  }

  let { nodes, start, end } = makeInitialMaze()

  document.addEventListener('click', event => {
    const xMenuOffset = document.getElementById('menu').clientWidth
    const x = Math.floor((event.x - xMenuOffset) / (window.innerHeight / nodes.length))
    const y = Math.floor((event.y) / (window.innerHeight / nodes.length))


    if (nodes[x] && nodes[x][y]) {
      // debugger
      const oldCanvas = document.querySelector('.p5Canvas')
    
      if (oldCanvas) oldCanvas.remove()
      nodes[x][y].isWall = !nodes[x][y].isWall
      const mazeDeets = makeInitialMaze(nodes)

      nodes = mazeDeets.nodes
      start = mazeDeets.start
      end = mazeDeets.end
    }
  })

  document.getElementById('size').addEventListener('click', _ => {
    const oldCanvas = document.querySelector('.p5Canvas')
    
    if (oldCanvas) oldCanvas.remove()
    const mazeDeets = makeInitialMaze()

    nodes = mazeDeets.nodes
    start = mazeDeets.start
    end = mazeDeets.end
  })

  document.getElementById('start').addEventListener('click', _ => {
    const oldCanvas = document.querySelector('.p5Canvas')
    
    if (oldCanvas) oldCanvas.remove()

    makeMaze(nodes, start, end)
  })
})()