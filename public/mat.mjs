export function genEmpty(width, height, value = 0)
{
    let arr = []
    for (let i = 0; i < width; i++)
    {
        let a = new Array(height);

        if(Object.seal) {
            // fill array with some value because
            // empty slots can not be changed after calling Object.seal
            a.fill(value);
        
            Object.seal(a);
          // now a is a fixed-size array with mutable entries
        }
        arr.push(a)
    }
    return arr
}
export function print(mat)
{
    let res = ""
    for (let i = 0; i < mat.length; i++)
    {
        for (let j = 0; j < mat[i].length; j++)
        {
            res += mat[i][j]
        }
        res += "\n"
    }
}
export function razn(mat1, mat2)
{
    const answer = []
    for (let i = 0; i < mat1.length; i++)
        {
            
            for (let j = 0; j < mat1[0].length; j++)
            {
                if (mat2[i][j] - (mat1 ? mat1[i][j] : 0))
                {
                    answer.push([i, j])
                }
            }
        }
    return answer
}

export function fullPercentage(garbage, capacity)
{
    let sum = 0
    for (let key of [...Object.keys(garbage)])
    {
        sum += garbage[key].length;
    }
    return sum / capacity;
}