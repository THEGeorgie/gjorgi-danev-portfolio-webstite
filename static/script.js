function throw_error(error_data) {
    const error_box = document.getElementById("error-box");
    const error_text = document.createElement("p");
    error_text.innerText = error_data;
    error_box.appendChild(error_text);
    console.log(error_data);
}


function helloTriangle() {
    /** @type {HTMLCanvasElement|null} */
    const canvas = document.getElementById("drawing");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        const webgl1_support = !!canvas.getContext("webgl1");
        if (webgl_support) {
            throw_error("Browser support is obsolete webgl 2 is required but only webgl1 is supported ");
        } else {
            throw_error("Browser doe not support webgl!!!");
        }
        return;
    }

    const triangle_verticies = [
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ];
    const triangle_verticies_cpu_buffer = new Float32Array(triangle_verticies);

    const triangle_geo_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle_geo_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangle_verticies_cpu_buffer, gl.STATIC_DRAW);

    const vertex_shader_src_code = `#version 300 es
    precision mediump float;
    
    in vec2 vertex_position;

    void main(){
        gl_Position = vec4(vertex_position, 0.0, 1.0);
    }`;

    const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_shader, vertex_shader_src_code);
    gl.compileShader(vertex_shader);
    if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
        throw_error(`Error during vertex shader compilation ${gl.getShaderInfoLog(vertex_shader)}`);
        return;
    }

    const fragment_shader_src_code = `#version 300 es
    precision mediump float;
    
    out vec4 output_color;

    void main(){
        output_color = vec4(1.0, 0.0, 0.0, 1.0);

    }`;
    const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment_shader, fragment_shader_src_code);
    gl.compileShader(fragment_shader);
    if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)) {
        throw_error(`Error during fragment shader compilation ${gl.getShaderInfoLog(fragment_shader)}`);
        return;
    }

    const triangle_shader_program = gl.createProgram();
    gl.attachShader(triangle_shader_program, vertex_shader);
    gl.attachShader(triangle_shader_program, fragment_shader);
    gl.linkProgram(triangle_shader_program);

    if (!gl.getProgramParameter(triangle_shader_program, gl.LINK_STATUS)) {
        const link_error = gl.getProgramInfoLog(triangle_shader_program);
        throw_error(`Error during trinagle shader program compilation ${link_error}`);
        return;
    }
    const vertex_position_attribute_location = gl.getAttribLocation(triangle_shader_program, 'vertex_position');
    if (vertex_position_attribute_location < 0) {
        showError(`Failed to get attribute location for vertexPosition`);
        return;
    }


    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0,0,canvas.width, canvas.height);

    gl.useProgram(triangle_shader_program);
    gl.enableVertexAttribArray(vertex_position_attribute_location);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangle_geo_buffer);
    gl.vertexAttribPointer(
        vertex_position_attribute_location,
        2,
        gl.FLOAT,
        false,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.drawArrays(gl.TRIANGLES,0,3);


}

try {
    helloTriangle();
} catch (e) {
    throw_error(`Uncaught error during runtime: ${e}`);
}