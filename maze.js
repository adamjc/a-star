const maze = (() => {
  function makeMaze (nodes, start, end, drawFunc = aStar.createSolveFunc, reset = false) {
    return new p5(sketch => {
      let openSet = [start]
      let closedSet = []
    
      start.g = 0
      start.f = 0 + aStar.findCost(start, end)
    
      if (start.isWall) start.isWall = false
      if (end.isWall) end.isWall = false
    
      sketch.setup = () => {
        if (reset) resetNodes(nodes)
        sketch.createCanvas(sketch.windowHeight, sketch.windowHeight)
      }
    
      sketch.draw = drawFunc({ nodes, start, end, openSet, closedSet }, sketch)
    })
  }
  
  function resetNodes (nodes) {
    for (var x = 0; x < nodes.length; x += 1) {
      for (var y = 0; y < nodes.length; y += 1) {
        nodes[x][y].hasChanged = true
        nodes[x][y].bestNode = null
        nodes[x][y].isOpen = false
        nodes[x][y].isClosed = false
      }
    }
  }

  function drawNode (x, y, width, sketch, radius = width) {
    sketch.square(x, y, width)
  }
  
  function drawNodes (nodes, start, end, sketch) {
    const nodeSize = (sketch.width / nodes.length) - 1
  
    for (let x = 0; x < nodes.length; x += 1) {
      for (let y = 0; y < nodes[x].length; y += 1) {
        const node = nodes[x][y]

        if (node.hasChanged) {
          sketch.strokeWeight(1)
          sketch.stroke('#fff')
            
          if (node.isWall) {
            sketch.fill('#444')
          } else if (node === start) {
            sketch.fill('cyan')
          } else if (node === end) {
            sketch.fill('#ffccff')
          } else if (node.isOpen) {
            sketch.fill('#2bd1fc')
          } else if (node.isClosed) {
            sketch.fill('#ff48c4')
          } else {
            sketch.fill('#fff')
          }

          drawNode(x * nodeSize, y * nodeSize, nodeSize, sketch)

          node.hasChanged = false
        }
      }
    }
  }

  function drawPath (node, nodes, sketch) {
    const nodeSize = (sketch.width / nodes.length) - 1
    
    sketch.stroke('#fff')
    sketch.strokeWeight(2)
  
    if (node.bestNode) {
      node.hasChanged = true
      const startX = (node.x * nodeSize) + (nodeSize / 2)
      const startY = (node.y * nodeSize) + (nodeSize / 2)
      const endX = (node.bestNode.x * nodeSize) + (nodeSize / 2)
      const endY = (node.bestNode.y * nodeSize) + (nodeSize / 2)
      sketch.line(startX, startY, endX, endY)
      drawPath(node.bestNode, nodes, sketch)
    }
  }

  return {
    makeMaze,
    drawNodes,
    drawPath
  }
})()
