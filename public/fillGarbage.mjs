
// Пример использования
const garbage = {
    "6fTzQid": [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1]
    ],
    "RVnTkM59": [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1]
    ],
    "RVnTkM5": [
        [0, 0],
        [1, 0],
        [1, 1]
    ]
};

export function testfillGarbage(ship)
{
    const shipWidth = 8;
    const shipHeight = 11;
    let prevShipLayout = null; // null, если корабль пустой или неизвестно его текущее состояние
    
    for (const key in garbage)
    {
        const g = {}
        g[key] = garbage[key]

        const placed = []
        const nextShipLayout = ship.fitGarbageIntoShip(g, prevShipLayout);
        for (let i = 0; i < shipHeight; i++)
        {
            
            for (let j = 0; j < shipWidth; j++)
            {
                if (nextShipLayout[i][j] - (prevShipLayout? prevShipLayout[i][j] : 0))
                {
                    placed.push([i, j])
                }
            }
        }
        
        prevShipLayout = nextShipLayout
    }
}
