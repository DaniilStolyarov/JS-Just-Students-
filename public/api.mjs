const {TOKEN, ORIGIN} = (await import("./config.json", {
  assert: {
    type: "json"
  },
})).default;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const latency = 150
export class Ship
{
  constructor()
  {
    this.headers = new Headers();
    this.headers.append("X-Auth-Token", TOKEN)
    this.headers.append("Content-Type", "application/json")
    this.width = 8;
    this.height = 11;
    this.graph = null;
    this.planet = 'Earth'
    this.garbage = {}
  }
  async fetchUniverse()
  {
    const universe = await this.getUniverse();
    /*const universe = {
      name: "MyTeam",
      ship: {
      capacityX: 8,
      capacityY: 11,
      fuelUsed: 1000,
      garbage: {},
      planet: {
        name : "D"
      }
      },
      universe: [
        ["A", "B", 120],
  ["B", "Earth", 80],
  ["C", "B", 120],
  ["C", "D", 150],
  ["D", "I", 100],
  ["E", "D", 90],
  ["E", "F", 110],
  ["F", "K", 140],
  ["G", "A", 130],
  ["G", "L", 130],
  ["Earth", "G", 80],
  ["Earth", "H", 100],
  ["H", "N", 120],
  ["H", "C", 110],
  ["I", "H", 90],
  ["I", "J", 100],
  ["J", "E", 120],
  ["J", "Eden", 110],
  ["K", "J", 80],
  ["L", "M", 100],
  ["M", "Earth", 110],
  ["M", "R", 90],
  ["N", "M", 120],
  ["N", "O", 20],
  ["O", "T", 40],
  ["O", "I", 60],
  ["Eden", "O", 10],
  ["Eden", "P", 130],
  ["P", "K", 130],
  ["P", "V", 40],
  ["Q", "L", 40],
  ["R", "Q", 40],
  ["R", "S", 90],
  ["S", "N", 120],
  ["T", "S", 30],
  ["T", "U", 20],
  ["U", "Eden", 120],
  ["V", "U", 120]
      ]
      } */
    this.width = universe.ship.capacityY;
    this.height = universe.ship.capacityX;
    this.planet = universe.ship.planet.name
    this.garbage = universe.ship.garbage
    console.log("currentPlanet", this.planet)
    this.loadGraph(universe.universe)
    await sleep(latency);
  }
  async getUniverse()
  {
      const PATH = "/player/universe";
      let response = await fetch(ORIGIN + PATH, {headers : this.headers})
      let json = await response.json();
    await sleep(latency);
    return json;
  }

  async postTravel(planets)
  {
      const request = {
          planets: planets
      }
      const body = JSON.stringify(request)
      console.log(body)
      const PATH = "/player/travel";
      let response = await fetch(ORIGIN + PATH, {headers : this.headers, method : "POST", body: body})
      let json = await response.json();
    await sleep(latency);
    return json;
  }

  async deleteReset()
  {
    const PATH = "/player/reset";
    let response = await fetch(ORIGIN + PATH, {headers : this.headers, method: "DELETE"})
    let json = await response.json();
    await sleep(latency);
    return json;
  }

  async getRounds()
  {
    const PATH = "/player/rounds";
    let response = await fetch(ORIGIN + PATH, {headers : this.headers})
    let json = await response.json();
    await sleep(latency);
    return json;
  }

  async postCollect(garbage)
  {
    const request = {
          garbage: garbage
      }
      const body = JSON.stringify(request)
      console.log(body)
      const PATH = "/player/collect";
      let response = await fetch(ORIGIN + PATH, {headers : this.headers, method : "POST", body: body})
      let json = await response.json();
    await sleep(latency);
    return json;
  }
   fitGarbageIntoShip(garbage, currentShipLayout) {
    
    let shipWidth = this.width
    let shipHeight = this.height
    let cargoCapacity = shipHeight * shipWidth
    let maxArea = 0;
    let bestPlacement = null;
    let cargoFilled = 0;

    const garbageIds = Object.keys(garbage);

    function rotate(shape) {
        return shape.map(([x, y]) => [y, x]);
    }

    function fitShapeInSpace(x, y, shape, ship) {
        for (const [dx, dy] of shape) {
            if (x + dx < 0 || x + dx >= shipWidth || y + dy < 0 || y + dy >= shipHeight || ship[y + dy][x + dx]) {
                return false;
            }
        }
        return true;
    }

    function placeShape(x, y, shape, ship) {
        for (const [dx, dy] of shape) {
            ship[y + dy][x + dx] = 1;
        }
    }

    function removeShape(x, y, shape, ship) {
        for (const [dx, dy] of shape) {
            ship[y + dy][x + dx] = 0;
        }
    }

    function fitShapes(ship, index) {
        if (index === garbageIds.length) {
            let area = 0;
            for (let y = 0; y < shipHeight; y++) {
                for (let x = 0; x < shipWidth; x++) {
                    if (ship[y][x] === 1) {
                        area++;
                    }
                }
            }
            if (area > maxArea) {
                maxArea = area;
                bestPlacement = JSON.parse(JSON.stringify(ship));
                cargoFilled = area; // Обновляем cargoFilled
            }
            return;
        }

        const id = garbageIds[index];
        const shape = garbage[id];
        for (let i = 0; i < 4; i++) {
            const rotatedShape = rotate(shape);
            garbage[id] = rotatedShape;
            for (let y = 0; y < shipHeight; y++) {
                for (let x = 0; x < shipWidth; x++) {
                    if (fitShapeInSpace(x, y, rotatedShape, ship)) {
                        placeShape(x, y, rotatedShape, ship);
                        fitShapes(ship, index + 1);
                        removeShape(x, y, rotatedShape, ship);
                    }
                }
            }
        }
        garbage[id] = shape;
    }

    const initialShip = currentShipLayout || Array.from({ length: shipHeight }, () => Array(shipWidth).fill(0));
    if (currentShipLayout) {
        // Если передано текущее состояние корабля, вычисляем текущее заполнение грузового отсека
        for (let y = 0; y < shipHeight; y++) {
            for (let x = 0; x < shipWidth; x++) {
                if (currentShipLayout[y][x] === 1) {
                    cargoFilled++;
                }
            }
        }
    } else {
        // Если корабль пустой, он должен загрузиться как минимум на 30% от объема грузового отсека
        cargoFilled = Math.ceil(cargoCapacity * 0.3);
    }
    // Проверка правила дозагрузки на 5%
    const additionalCargoRequired = Math.ceil(cargoCapacity * 0.05);
    if (cargoFilled < cargoCapacity) {
        cargoFilled += additionalCargoRequired;
    }
    fitShapes(initialShip, 0);

    return bestPlacement;
}
   fitGarbageAnyRotate(garbage, currentShipLayout)
   {
    
    let result = this.fitGarbageIntoShip(garbage, currentShipLayout)
    if (result == null)
    {
      for (let i = 0; i < 3; i++)
      {
        
        for (let key in garbage)
        {
          garbage[key] = rotateFigure(garbage[key])
        }
        
        result = this.fitGarbageIntoShip(garbage, currentShipLayout)
        if (result != null) return result;
      }
    }
    return result;
   }


  loadGraph(edges)
    {
        const graph = new graphlib.Graph({multigraph: true});

        for (const edge of edges)
        {
            graph.setEdge(edge[0], edge[1], edge[2])
        }
        this.graph = graph
    }
  makeGraph( from = 'Earth', to = 'Eden')
    {
      const graph = this.graph;
        // Функция для обхода графа с весами
        function findPaths(graph, start, end, visited, path, paths) {
            visited.add(start);
            path.push(start);
        
            if (start === end) {
                paths.push({ path: path.slice(), weight: calculateWeight(graph, path) });
            } else {
                graph.successors(start).forEach(neighbor => {
                    if (!visited.has(neighbor)) {
                        findPaths(graph, neighbor, end, visited, path, paths);
                    }
                });
            }
        
            visited.delete(start);
            path.pop();
        }
        
        // Функция для вычисления веса пути
        function calculateWeight(graph, path) {
            let weight = 0;
            for (let i = 0; i < path.length - 1; i++) {
                const edge = graph.edge(path[i], path[i + 1]);
                if (edge) {
                    weight += edge;
                }
                
            }
            return weight;
        }
        
        // Находим все возможные пути и их суммарный вес
        const startNode = from;
        const endNode = to;
        const visited = new Set();
        const paths = [];
        findPaths(graph, startNode, endNode, visited, [], paths);
        
        // Выводим результат
        return paths
    }
  
}

function rotateFigure(coords) {
  // Находим максимальные координаты по x и y
  let maxX = 0;
  let maxY = 0;
  for (const [x, y] of coords) {
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
  }

  // Создаем новый массив для повернутых координат
  const rotatedCoords = [];

  // Проходимся по всем клеткам в новой матрице и копируем значения из исходной, поворачивая их
  for (let x = 0; x <= maxX; x++) {
      for (let y = 0; y <= maxY; y++) {
          if (coords.some(coord => coord[0] === x && coord[1] === y)) {
              rotatedCoords.push([maxY - y, x]); // Поворот на 90 градусов
          }
      }
  }

  return rotatedCoords;
}