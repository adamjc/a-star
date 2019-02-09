function makeMaze (nodes, start, end) {
  new p5(sketch => {
    let openSet = [start]
    let closedSet = []
  
    start.g = 0
    start.f = 0 + findCost(start, end)
  
    if (end.isWall) {
      end.isWall = false
    }
  
    sketch.setup = () => {
      sketch.createCanvas(sketch.windowHeight, sketch.windowHeight)
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
    
      // draw all nodes in the open set
      openSet.forEach(node => {
        sketch.fill('#2bd1fc')
        drawNode(node.x * nodeSize, node.y * nodeSize, nodeSize, sketch)
      })
    
      // draw all nodes in the closed set  
      closedSet.forEach(node => {
        sketch.fill('#ff48c4')
        drawNode(node.x * nodeSize, node.y * nodeSize, nodeSize, sketch)
      })
    
      if (openSet.length) {
        const currentNode = openSet.shift()
        drawPath(currentNode, nodes, sketch)

        if (currentNode === end) {
          // found the end node, make the path
          console.log(`Found end node in: ${sketch.frameCount}`)
          sketch.noLoop()
        }
        
        closedSet = closedSet.concat(currentNode)
    
        // find neighbours of current node
        const neighbours = findNeighbours(currentNode, nodes)
        
        for (let i = 0; i < neighbours.length; i++) {
          const neighbour = neighbours[i]
    
          if (closedSet.includes(neighbour)) continue
    
          const newG = currentNode.g + findCost(currentNode, neighbour)
    
          if (!openSet.includes(neighbour)) {
            neighbour.g = newG
            neighbour.f = newG + findCost(neighbour, end)
            neighbour.bestNode = currentNode
            openSet = addNeighbour(neighbour, openSet)
          } else if (newG >= neighbour.g) {
            continue
          }
    
          neighbour.g = newG
          neighbour.f = newG + findCost(neighbour, end)
          neighbour.bestNode = currentNode
        }
      } else {
        console.log(`No solution found in: ${sketch.frameCount}`) 
        sketch.noLoop()
      }
    }
  })
}

const removeNode = (nodeIndex, set) =>set.slice(0, nodeIndex).concat(set.slice(nodeIndex + 1, set.length))

const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
const euclidean = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

const findCost = (a, b, heuristic = euclidean) => heuristic(a, b)

function addNeighbour (node, set) {
  for (let i = 0; i < set.length; i += 1) {
    // The +1 ensures that the best node is *much* better than our current direction
    if (node.f <= (set[i].f + 1)) {
      return set.slice(0, i).concat(node).concat(set.slice(i, set.length))
    }
  }
  
  return set.concat(node)
}

function findNeighbours (node, set) {
  const x = set[node.x]
  const leftX = set[node.x - 1]
  const rightX = set[node.x + 1]

  const leftUp = leftX ? leftX[node.y - 1] : null
  const up = x[node.y - 1] ? x[node.y - 1] : null
  const rightUp = rightX ? rightX[node.y - 1] : null
  const left = leftX ? leftX[node.y] : null
  const right = rightX ? rightX[node.y] : null
  const leftDown = leftX ? leftX[node.y + 1] : null
  const down = x[node.y + 1] ? x[node.y + 1] : null
  const rightDown = rightX ? rightX[node.y + 1] : null

  const neighbours = [
    leftUp, up, rightUp, left, right, leftDown, down, rightDown
  ]

  return neighbours.map(neighbour => {
    if (neighbour && !neighbour.isWall) return neighbour
  }).filter(el => el)
}

function drawPath (node, nodes, sketch) {
  const nodeSize = (sketch.width / nodes.length) - 1
  
  sketch.stroke('#fff')
  sketch.strokeWeight(4)

  if (node.bestNode) {
    const startX = (node.x * nodeSize) + (nodeSize / 2)
    const startY = (node.y * nodeSize) + (nodeSize / 2)
    const endX = (node.bestNode.x * nodeSize) + (nodeSize / 2)
    const endY = (node.bestNode.y * nodeSize) + (nodeSize / 2)
    sketch.line(startX, startY, endX, endY)
    drawPath(node.bestNode, nodes, sketch)
  }
}

function drawNode (x, y, width, sketch, radius = 0) {
  sketch.square(x, y, width, radius, radius, radius, radius)
}