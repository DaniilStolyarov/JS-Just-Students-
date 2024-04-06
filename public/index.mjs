import { Ship } from "./api.mjs";
import { drawState } from "./drawState.mjs";
import { genEmpty, razn } from "./mat.mjs";
import { print } from "./mat.mjs";
const sleep = ms => new Promise(r => setTimeout(r, ms));
// start and load universe data
let ship = new Ship();
ship.logPaths = []
await ship.fetchUniverse();

// const neighbours = ship.graph.outEdges(ship.planet)
const paths = ship.makeGraph("Earth", "Eden")
paths.sort((a, b) =>
    {
        return a.path.length - b.path.length
    })
const fromEarthToEden = paths[0]
await travelPath(fromEarthToEden.path,  false)

// start main cycle
const allPathsFromEden = bfsAllPaths(ship.graph, "Eden")

for (let maxLoopCounter = 0; maxLoopCounter < 10;  maxLoopCounter += 1)
{
    let path = allPathsFromEden[0];
    console.log(allPathsFromEden.join(",\n"))
    if (path.at(-1) === "Earth") 
    {
        allPathsFromEden.shift();
        continue
    };
    const slicedPath = path.slice(1);

    console.log(slicedPath)
    const result = await travelPath(slicedPath);
    if (typeof result === "string")
    {
        // !!!! 
        // add returned path to the end of list. It`ll become forever loop if there`s infinite garbage
        allPathsFromEden.push(path)
        const pathsToEden = ship.makeGraph(result, "Eden")
        pathsToEden.sort((a, b) => {return a.path.length - b.path.length})
        const chosenPathToEden = pathsToEden[0]
        await travelPath(chosenPathToEden.path.slice(1), false)
    }
    allPathsFromEden.shift()
}

function bfsAllPaths(graph, startNode) {
    
    let paths = []
    helpRec([startNode])
    function helpRec(path)
    {
        const newPaths = []
        const outEdges = graph.outEdges(path.at(-1))
        if (outEdges.length === 0) return;

        for (let edge of outEdges)
        {
            if (path.includes(edge.w)) return
            const newPath = []
            Object.assign(newPath, path)
            newPath.push(edge.w)
            newPaths.push(newPath)
        }
        paths =     paths.concat(newPaths)
        for (let newPath of newPaths)
        {
            helpRec(newPath)
        }
    }
    return paths;
}
async function travelPath(path, useEdenReturnLogic = true)
{
    ship.logPaths.push(path);
    for (let planet of path)
    {   
        console.log("PLANET", planet)

        const tempResult = await handlePlanet(planet, useEdenReturnLogic)
        
        if (useEdenReturnLogic)
        {
            if (tempResult == false) 
            {
                return planet;
            };
        }
    }
}

async function handlePlanet(nextPlanet, useEdenReturnLogic = true)
{

    if (nextPlanet == "Earth") return;
    
    try
    {
        const resu = await ship.postTravel([nextPlanet])
    }
    catch(err)
    {
        console.log(err)
    }
    const travelResult = 
    {
        "planetGarbage": {
            "2FvakD": [
                [
                    0,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    2,
                    1
                ],
                [
                    3,
                    1
                ],
                [
                    2,
                    2
                ]
            ],
            "2FvbCi": [
                [
                    0,
                    1
                ],
                [
                    0,
                    0
                ],
                [
                    1,
                    1
                ],
                [
                    2,
                    1
                ],
                [
                    2,
                    0
                ],
                [
                    3,
                    0
                ]
            ],
            "2FvvP1": [
                [
                    0,
                    2
                ],
                [
                    0,
                    1
                ],
                [
                    0,
                    0
                ],
                [
                    1,
                    2
                ],
                [
                    2,
                    2
                ],
                [
                    2,
                    1
                ]
            ],
            "2FwFZJ": [
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    1
                ],
                [
                    3,
                    1
                ]
            ],
            "2FwG63": [
                [
                    0,
                    0
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    0
                ],
                [
                    1,
                    1
                ],
                [
                    2,
                    1
                ]
            ],
            "2FwbGL": [
                [
                    0,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    0,
                    2
                ],
                [
                    1,
                    2
                ],
                [
                    1,
                    3
                ]
            ],
            "2Fwbiq": [
                [
                    0,
                    0
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    0
                ],
                [
                    3,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    3,
                    1
                ],
                [
                    0,
                    2
                ],
                [
                    1,
                    2
                ],
                [
                    1,
                    3
                ]
            ],
            "2Fwvu8": [
                [
                    0,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    1,
                    2
                ],
                [
                    2,
                    2
                ],
                [
                    2,
                    3
                ],
                [
                    3,
                    3
                ]
            ],
            "2FxG5R": [
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    1
                ],
                [
                    3,
                    1
                ]
            ],
            "2FxGXv": [
                [
                    0,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    2,
                    1
                ],
                [
                    1,
                    2
                ],
                [
                    1,
                    3
                ],
                [
                    2,
                    3
                ],
                [
                    3,
                    3
                ]
            ],
            "2FxbiD": [
                [
                    0,
                    0
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    0,
                    2
                ],
                [
                    1,
                    2
                ],
                [
                    2,
                    2
                ],
                [
                    3,
                    2
                ],
                [
                    2,
                    3
                ]
            ],
            "2FxcAi": [
                [
                    0,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ]
            ],
            "HXLk": [
                [
                    0,
                    0
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    0
                ],
                [
                    3,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    0,
                    2
                ],
                [
                    1,
                    2
                ],
                [
                    2,
                    2
                ],
                [
                    0,
                    3
                ],
                [
                    2,
                    3
                ]
            ],
            "HXoF": [
                [
                    0,
                    2
                ],
                [
                    1,
                    2
                ],
                [
                    1,
                    1
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    2
                ],
                [
                    3,
                    2
                ]
            ],
            "HryY": [
                [
                    0,
                    2
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    1
                ]
            ],
            "HsS3": [
                [
                    0,
                    2
                ],
                [
                    0,
                    1
                ],
                [
                    0,
                    0
                ],
                [
                    1,
                    2
                ],
                [
                    1,
                    1
                ]
            ],
            "JCcL": [
                [
                    0,
                    0
                ],
                [
                    1,
                    0
                ]
            ],
            "JXnd": [
                [
                    0,
                    2
                ],
                [
                    0,
                    1
                ],
                [
                    0,
                    0
                ],
                [
                    1,
                    2
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    2
                ],
                [
                    3,
                    2
                ]
            ],
            "JYF8": [
                [
                    0,
                    3
                ],
                [
                    0,
                    2
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    3
                ],
                [
                    1,
                    1
                ],
                [
                    2,
                    3
                ],
                [
                    2,
                    1
                ],
                [
                    3,
                    3
                ],
                [
                    3,
                    2
                ],
                [
                    3,
                    1
                ],
                [
                    3,
                    0
                ]
            ],
            "JsRR": [
                [
                    0,
                    0
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    0
                ],
                [
                    3,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    2,
                    1
                ],
                [
                    2,
                    2
                ],
                [
                    3,
                    2
                ]
            ],
            "Jssv": [
                [
                    0,
                    2
                ],
                [
                    0,
                    1
                ],
                [
                    0,
                    0
                ],
                [
                    1,
                    1
                ],
                [
                    2,
                    1
                ],
                [
                    3,
                    1
                ],
                [
                    3,
                    0
                ]
            ],
            "KD8T": [
                [
                    0,
                    0
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    0
                ],
                [
                    3,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ]
            ],
            "KYJk": [
                [
                    0,
                    0
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    0
                ],
                [
                    3,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    3,
                    1
                ]
            ],
            "KYmF": [
                [
                    0,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    2,
                    1
                ],
                [
                    0,
                    2
                ],
                [
                    2,
                    2
                ],
                [
                    3,
                    2
                ],
                [
                    2,
                    3
                ]
            ],
            "KswY": [
                [
                    0,
                    2
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    1,
                    0
                ],
                [
                    2,
                    1
                ],
                [
                    3,
                    1
                ]
            ],
            "LD7q": [
                [
                    0,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    1,
                    2
                ]
            ],
            "LDaL": [
                [
                    0,
                    0
                ],
                [
                    0,
                    1
                ],
                [
                    1,
                    1
                ],
                [
                    2,
                    1
                ],
                [
                    0,
                    2
                ],
                [
                    2,
                    2
                ],
                [
                    0,
                    3
                ],
                [
                    2,
                    3
                ],
                [
                    3,
                    3
                ]
            ]
        },
        "shipGarbage":  {
            "71B2XMi": [
            [
            2,
            10
            ],
            [
            2,
            9
            ],
            [
            2,
            8
            ],
            [
            3,
            8
            ]
            ]
            } ,
        "fuelDiff": 34,
        "planetDiffs": [
            {
                "from": "Earth",
                "to": "H",
                "fuel": 44
            }
        ]
    }


    if (nextPlanet == "Eden") return;
    const garbage = travelResult.planetGarbage;

    if (!ship.prevShipLayout )
    {
        ship.prevShipLayout = genEmpty(ship.height, ship.width, 0 ); // null, если корабль пустой или неизвестно его текущее состояние
        if (travelResult.shipGarbage )
        {
            for (let key in travelResult.shipGarbage)
            {
                for (let block of travelResult.shipGarbage[key])
                {
                    ship.prevShipLayout[block[1]][block[0]] = 1
                }
            }
        }
    }

    drawState(ship.prevShipLayout)


    for (const key in garbage)
    {
        const g = {}
        g[key] = garbage[key]
        
        try 
        {
            const nextShipLayout = ship.fitGarbageIntoShip(g, ship.prevShipLayout);

            const placed = razn(ship.prevShipLayout, nextShipLayout)
            const garbage = {}
            garbage[key] = placed;
            const collectResult = await ship.postCollect(garbage)
            drawState(nextShipLayout)
            ship.prevShipLayout = nextShipLayout

        }
        catch(err)
        {
            
            continue
        }
    }  
    const result = ship.fitGarbageIntoShip({test: [[0,0], [1,0], [2,0], [3,0]]}, ship.prevShipLayout)

    if (useEdenReturnLogic)
    {
        if (result === null)
        {
            console.log("EDEN RETURNING")
            return false;
        }
    }
    print(ship.prevShipLayout) 
}

console.log(ship.logPaths)