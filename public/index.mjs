import { Ship } from "./api.mjs";
import { drawState } from "./drawState.mjs";
import { genEmpty, razn } from "./mat.mjs";
import { print } from "./mat.mjs";
const sleep = ms => new Promise(r => setTimeout(r, ms));
// start and load universe data
let ship = new Ship();
ship.logPaths = []
await ship.fetchUniverse();

// console.log(await ship.deleteReset())
// await sleep(100000000)

const paths = ship.makeGraph(ship.planet, "Eden")
paths.sort((a, b) =>
    {
        return a.path.length - b.path.length
    })
const fromEarthToEden = paths[0]
console.log(fromEarthToEden.path.join(" -> "))
await travelPath(fromEarthToEden.path.slice(1),  false)

// start main cycle
const allPathsFromEden = bfsAllPaths(ship.graph, "Eden") 

try
{
    while(true)
{
    let path = allPathsFromEden[0];
    if (!path) break;
    if (path.at(-1) === "Earth") 
    {
        allPathsFromEden.shift();
        continue
    };
    const slicedPath = path.slice(1);


    console.log(slicedPath)
    const result = await travelPath(slicedPath);
    if (/* typeof result === "string"*/ true)
    {
        console.log(result)
        // !!!! 
        // add returned path to the end of list. It`ll become forever loop if there`s infinite garbage
        if (typeof result === "string")
        {
            allPathsFromEden.push(path)
        }
        const pathsToEden = ship.makeGraph(result, "Eden")
        pathsToEden.sort((a, b) => {return a.path.length - b.path.length})
        const chosenPathToEden = pathsToEden[0]
        
        console.log("PATH TO EDEN!", chosenPathToEden)
        
        await travelPath(chosenPathToEden.path.slice(1), false)
        
    }
    allPathsFromEden.shift()
}
}
catch (err)
{
    console.error(err)
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
            if (path.includes(edge.w)) continue
            const newPath = []
            Object.assign(newPath, path)
            newPath.push(edge.w)
            newPaths.push(newPath)
        }
        paths = paths.concat(newPaths)
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
    let sliceTravelResult, sliceTravelPlanet, sliceTravelPlanetIndex;

    if (path && path.length > 0)
    {
        console.log(path)
        sliceTravelResult = await ship.postTravel(path);
        console.log(sliceTravelResult)
    }
    if (sliceTravelResult && sliceTravelResult.planetDiffs)
    {
        sliceTravelPlanet = sliceTravelResult.planetDiffs.at(-1).to;

        sliceTravelPlanetIndex = path.indexOf(sliceTravelPlanet)
    }
    if (sliceTravelPlanetIndex != -1)
    {
        path = path.slice(sliceTravelPlanetIndex)
    }
    
    for (let planet of path)
    {   
        await ship.fetchUniverse();
        console.log("from PLANET", ship.planet)
        console.log("to PLANET", planet)

        const tempResult = await handlePlanet(planet, useEdenReturnLogic, sliceTravelPlanetIndex ? sliceTravelResult : null)
        sliceTravelResult = null;
        if (useEdenReturnLogic)
        {
            if (tempResult == false) 
            {
                return planet;
            };
        }
    }
    return path.at(-1)
}

async function handlePlanet(nextPlanet, useEdenReturnLogic = true, travelResult = null)
{
    if (nextPlanet == ship.planet && !travelResult) return;


    if (!travelResult)
    {
        travelResult = await ship.postTravel([nextPlanet])
    }
    console.log(travelResult)

    
    const garbage = travelResult.planetGarbage;
    console.log(garbage)
    if (/*!ship.prevShipLayout*/true )
    {
        
    }
    ship.prevShipLayout = genEmpty(ship.height, ship.width, 0 ); // null, если корабль пустой или неизвестно его текущее состояние
        if (travelResult.shipGarbage )
        {
            for (let key in travelResult.shipGarbage)
            {
                for (let block of travelResult.shipGarbage[key])
                {
                    ship.prevShipLayout[block[0]][block[1]] = 1
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
            const nextShipLayout = ship.fitGarbageAnyRotate(g, ship.prevShipLayout);

            const placed = razn(ship.prevShipLayout, nextShipLayout)
            ship.garbage[key] = placed
            console.log(ship.garbage)
            
            ship.prevShipLayout = nextShipLayout
            drawState(ship.prevShipLayout)

        }
        catch(err)
        {
            
            continue
        }
    }  

    if ([...Object.keys(ship.garbage)].length > 0 && [...Object.keys(garbage)].length > 0)
    {
        const collectResult = await ship.postCollect(ship.garbage);
        console.log("collectResult", collectResult)
        if (useEdenReturnLogic)
        {
            if (collectResult && collectResult.error && collectResult.error.startsWith("you have to take at least"))
            {
                console.log("EDEN RETURNING")
                return false;
            }
        }
    }
    const result = ship.fitGarbageAnyRotate({test: [[0,0], [1,0]]}, ship.prevShipLayout)

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