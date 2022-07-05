

let canvas = document.getElementById("main-canvas");
var ctx = canvas.getContext("2d");

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let importObject = { env: { drawLine: drawLine, clearCanvas: clearCanvas } };

let render = (async () => {


    if (WebAssembly.instantiateStreaming) {
        var { instance: instance, module: mod } = await WebAssembly.instantiateStreaming(
            fetch("/target/wasm32-unknown-unknown/debug/meenle_noonle.wasm"),
            importObject
        );
    } else if (WebAssembly.instantiate){
        console.log("Your browser is old. Proceeding with WebAssembly.instantiate which waits for \
        the entire wasm binary to be downloaded before preparing.")
        let wasm = await fetch("/target/wasm32-unknown-unknown/debug/meenle_noonle.wasm");
        let arrBuff = await wasm.arrayBuffer()
        var { instance: instance, module: mod } = await WebAssembly.instantiate(arrBuff, importObject);
    } else {
        document.getElementById("title").innerHTML = "your browser is probably old, because wasm is \
        unavailable. no Meenlo-Noonle for you! you are missing out!"
    }
    
    let render = instance.exports.render;


    scalar = 1;
    x_angle = Math.PI;
    y_angle = Math.PI;
    z_angle = Math.PI;
    render(scalar, x_angle/4, y_angle/2, z_angle);



    scaler = document.getElementById("scaler");
    scaler.addEventListener("input", (event) => {
        scalar = event.target.value;
        render(scalar, x_angle, y_angle, z_angle);

    });
    x_rotater = document.getElementById("x-rotater");
    x_rotater.addEventListener("input", (event) => {
        x_angle = event.target.value;
        render(scalar, x_angle, y_angle, z_angle);
    });
    y_rotater = document.getElementById("y-rotater");
    y_rotater.addEventListener("input", (event) => {
        y_angle = event.target.value;
        render(scalar, x_angle, y_angle, z_angle);
    });
    z_rotater = document.getElementById("z-rotater");
    z_rotater.addEventListener("input", (event) => {
        z_angle = event.target.value;
        render(scalar, x_angle, y_angle, z_angle);
    });

    console.log('To access the %crender(scale, x_angle, y_angle, z_angle)%c function in the console, \
await it with the following code: %crender = await render%c And no btw, I don\'t know of a way to await \
that automatically. 😕', 
    "font-family:monospace; border:solid; padding:0 3px 0 3px",
    "", 
    "font-family:monospace; border:solid; padding:0 3px 0 3px", 
    "")
    // debugger;

        return render;
})()