export function drawState(mat)
{
    const width = 8;
    const height = 11;
    const step = 40;

    const canvas = document.querySelector("#canvas");
    const context = canvas.getContext("2d");
    context.lineWidth = 4

    for (let i = 0; i < height; i++)
    {
        context.beginPath();
        context.moveTo(context.lineWidth, i * step + context.lineWidth);
        context.lineTo(width * step + context.lineWidth, i * step + context.lineWidth)
        context.stroke();
    }
    context.beginPath();
    context.moveTo(context.lineWidth, height * step + context.lineWidth);
    context.lineTo(width * step + context.lineWidth, height * step + context.lineWidth)
    context.stroke();
    for (let i = 0; i < width; i++)
    {
        context.beginPath();
        context.moveTo(i * step + context.lineWidth, context.lineWidth );
        context.lineTo(i * step + context.lineWidth, height * step + context.lineWidth)
        context.stroke();
    }
    context.beginPath();
    context.moveTo(width * step + context.lineWidth, context.lineWidth );
    context.lineTo(width * step + context.lineWidth, height * step + context.lineWidth)
    context.stroke();

    for (let i = 0; i < mat.length; i++)
    {
        for (let j = 0; j < mat[i].length; j++)
        {
            if (mat[i][j] === 1)
            {
                context.fillStyle = "green"
                context.fillRect(j*step + context.lineWidth * 1.5, i*step + context.lineWidth * 1.5, step - context.lineWidth , step - context.lineWidth   )
            }
            else
            {
                context.fillStyle = "white"
                context.fillRect(j*step + context.lineWidth * 1.5, i*step + context.lineWidth * 1.5, step - context.lineWidth , step - context.lineWidth )
            }
        }
    }
}

function downloadCanvasAsImage(canvas)
{
    // open canvas as image in new window
    canvas.toBlob((blob) => window.open(URL.createObjectURL(blob), '_blank'));
}