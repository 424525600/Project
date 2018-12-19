// cuon-utils.js (c) 2012 kanda and matsuda
/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current 
 */
function initShaders(gl, vshader, fshader) {
    //�����������
    var program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('Failed to create program');
        return false;
    }
    //ʹ�ó������
    gl.useProgram(program);
    gl.program = program;

    return true;
}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
    // ������ɫ������
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        return null;
    }

    // �����������
    var program = gl.createProgram();
    if (!program) {
        return null;
    }

    // Ϊ������������ɫ��
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // ���ӳ������
    gl.linkProgram(program);

    // �������״̬
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
    // ������ɫ������
    var shader = gl.createShader(type);
    if (shader == null) {
        console.log('unable to create shader:Type- ' + type);
        return null;
    }

    // ����ɫ�������������ɫ������Դ����
    gl.shaderSource(shader, source);

    // ������ɫ��
    gl.compileShader(shader);

    // ������״̬
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader:Type- ' + type + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

/** 
 * Initialize and get the rendering for WebGL
 * @param canvas <cavnas> element
 * @param opt_debug flag to initialize the context for debugging
 * @return the rendering context for WebGL
 */
function getWebGLContext(canvas, opt_debug) {
    // Get the rendering context for WebGL
    var gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) return null;

    // if opt_debug is explicitly false, create the context for debugging
    if (arguments.length < 2 || opt_debug) {
        gl = WebGLDebugUtils.makeDebugContext(gl);
    }

    return gl;
  
}
