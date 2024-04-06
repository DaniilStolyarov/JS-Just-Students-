export async function findPlanetPath(ship)
{
    const json = await ship.getUniverse()
    console.log(json)
    const nodesSet = getAllNodes(json.universe)
    nodesSet.delete("Earth")
    nodesSet.delete("Eden")
    
    let currentPath = ['Earth']
    let currentWeight = 0
    while (nodesSet.size != 0)
    {
        let paths = []
        const nodes = [...nodesSet]
        for (const node of nodes)
        {
            paths.push(...makeGraph(json.universe, currentPath.at(-1), node))
        }
        paths = paths.sort(function (a, b)
        {
            return b.path.length - a.path.length
        })
        if (paths.length < 1) 
        {
            console.log("broke because no next path found")
            break;
        }
        currentPath = currentPath.concat(paths[0].path.slice(1))
        currentWeight += paths[0].weight 
        for (let vertice of paths[0].path)
        {
            nodesSet.delete(vertice)
        }
    }
    let pathToEden = makeGraph(json.universe, currentPath.at(-1), "Eden")[0].path.slice(1)
    currentPath = currentPath.concat(pathToEden)
    return {currentPath, currentWeight}
}

export function getAllNodes(edges)
    {
        const set = new Set()
        for (const edge of edges)
        {
            set.add(edge[0])
            set.add(edge[1])
        }
        return set
    }
export function makeGraph(edges, from = 'Earth', to = 'Eden')
    {
        const graph = new graphlib.Graph();
    
        for (const edge of edges)
        {
            graph.setEdge(edge[0], edge[1], edge[2])
        }
    
        
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