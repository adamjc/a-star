const aStar = (() => {
  function createSolveFunc ({ nodes, start, end, openSet, closedSet }, sketch) {
    return solveMaze = () => {
      start.hasChanged = true // force a re-draw of the starting node, just a dirty hack.

      const nodeSize = (sketch.width / nodes.length) - 1
      // draw all nodes
      maze.drawNodes(nodes, start, end, sketch)
    
      if (openSet.length) {
        const currentNode = openSet.shift()
        maze.drawPath(currentNode, nodes, sketch)
    
        if (currentNode === end) {
          console.log(`Found end node in: ${sketch.frameCount}`)
          sketch.noLoop()
        }
        
        closedSet = closedSet.concat(currentNode)
        currentNode.isClosed = true
        currentNode.isOpen = false
        currentNode.hasChanged = true

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
            neighbour.isOpen = true
            neighbour.hasChanged = true
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

  return {
    findCost,
    createSolveFunc
  }
})()