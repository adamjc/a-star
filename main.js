function removeNode (nodeIndex, set) {
  return set.slice(0, nodeIndex).concat(set.slice(nodeIndex + 1, set.length))
}

// Pick the node that minimises f(n) = g(n) + h(n)
const pickBestNode = (set) => set.reduce((chosen, current) => current.f < chosen.f ? current : chosen)

// Manhattan distance
const findCost = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

function findNeighbours (node, set) {
  // we are in a maze, you can only move in one of four directions, so your neighbours are above, below, left and right.
  let neighbours = []

  if (set[node.x - 1] && set[node.x - 1][node.y] && !set[node.x - 1][node.y].isWall) {
    neighbours.push(set[node.x - 1][node.y])
  }

  if (set[node.x + 1] && set[node.x + 1][node.y] && !set[node.x + 1][node.y].isWall) {
    neighbours.push(set[node.x + 1][node.y])
  }

  if (set[node.x][node.y - 1] && !set[node.x][node.y - 1].isWall) {
    neighbours.push(set[node.x][node.y - 1])
  }

  if (set[node.x][node.y + 1] && !set[node.x][node.y + 1].isWall) {
    neighbours.push(set[node.x][node.y + 1])
  }

  return neighbours
}

function drawPath (node) {
  const nodeSize = (width / nodes.length) - 1
  
  fill(0, 0, 255)
  square(node.x * nodeSize, node.y * nodeSize, nodeSize)
  
  if (node.bestNode) {
    drawPath(node.bestNode)
  }
}

const size = 25
const nodes = new Array(size).fill()
                               .map((_, x) => {
                                 return new Array(size).fill().map((_, y) => ({ x, y, isWall: Math.random(1) < 0.2 }))
                               })
const start = nodes[0][0]
const end = nodes[size - 1][size - 1]
start.g = 0
start.f = 0 + findCost(start, end)
let openSet = [start]
let closedSet = []

function setup () {
  createCanvas(500, 500)
}

function draw () {
  const nodeSize = (width / nodes.length) - 1
  // draw all nodes
  for (let x = 0; x < nodes.length; x += 1) {
    for (let y = 0; y < nodes[x].length; y += 1) {
      if (nodes[x][y].isWall) fill (0, 0, 0)
      else fill(255, 255, 255)

      square(x * nodeSize, y * nodeSize, nodeSize)
    }
  }

  // draw all nodes in the open set
  openSet.forEach(node => {
    fill(0, 255, 0)
    square(node.x * nodeSize, node.y * nodeSize, nodeSize)
  })

  // draw all nodes in the closed set  
  closedSet.forEach(node => {
    fill(255, 0, 0)
    square(node.x * nodeSize, node.y * nodeSize, nodeSize)
  })

  if (openSet.length) {
    const currentNode = pickBestNode(openSet)
  
    if (currentNode === end) {
      // found the end node, make the path
      console.log('Found end node')
      console.log(currentNode)
      drawPath(currentNode)
      noLoop()
    }

    openSet = removeNode(openSet.indexOf(currentNode), openSet)
    closedSet = closedSet.concat(currentNode)

    // find neighbours of current node
    const neighbours = findNeighbours(currentNode, nodes)
    
    for (let i = 0; i < neighbours.length; i++) {
      // if neighbour is in closed set, ignore it
      const neighbour = neighbours[i]

      if (closedSet.includes(neighbour)) continue
            
      const newG = currentNode.g + findCost(currentNode, neighbour)
      
      if (!openSet.includes(neighbour)) {
        openSet.push(neighbour)
      } else if (newG > neighbour.g) {
        continue
      }

      neighbour.g = newG
      neighbour.f = newG +  findCost(neighbour, end)
      neighbour.bestNode = currentNode
    }
  } else {
    console.log('No solution found')
    noLoop()
  }
}