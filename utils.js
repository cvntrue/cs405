function multiplyMatrices(matrixA, matrixB) {
    var result = [];

    for (var i = 0; i < 4; i++) {
        result[i] = [];
        for (var j = 0; j < 4; j++) {
            var sum = 0;
            for (var k = 0; k < 4; k++) {
                sum += matrixA[i * 4 + k] * matrixB[k * 4 + j];
            }
            result[i][j] = sum;
        }
    }

    // Flatten the result array
    return result.reduce((a, b) => a.concat(b), []);
}
function createIdentityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}
function createScaleMatrix(scale_x, scale_y, scale_z) {
    return new Float32Array([
        scale_x, 0, 0, 0,
        0, scale_y, 0, 0,
        0, 0, scale_z, 0,
        0, 0, 0, 1
    ]);
}

function createTranslationMatrix(x_amount, y_amount, z_amount) {
    return new Float32Array([
        1, 0, 0, x_amount,
        0, 1, 0, y_amount,
        0, 0, 1, z_amount,
        0, 0, 0, 1
    ]);
}

function createRotationMatrix_Z(radian) {
    return new Float32Array([
        Math.cos(radian), -Math.sin(radian), 0, 0,
        Math.sin(radian), Math.cos(radian), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_X(radian) {
    return new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(radian), -Math.sin(radian), 0,
        0, Math.sin(radian), Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_Y(radian) {
    return new Float32Array([
        Math.cos(radian), 0, Math.sin(radian), 0,
        0, 1, 0, 0,
        -Math.sin(radian), 0, Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function getTransposeMatrix(matrix) {
    return new Float32Array([
        matrix[0], matrix[4], matrix[8], matrix[12],
        matrix[1], matrix[5], matrix[9], matrix[13],
        matrix[2], matrix[6], matrix[10], matrix[14],
        matrix[3], matrix[7], matrix[11], matrix[15]
    ]);
}

const vertexShaderSource = `
attribute vec3 position;
attribute vec3 normal; // Normal vector for lighting

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

uniform vec3 lightDirection;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vNormal = vec3(normalMatrix * vec4(normal, 0.0));
    vLightDirection = lightDirection;

    gl_Position = vec4(position, 1.0) * projectionMatrix * modelViewMatrix; 
}

`

const fragmentShaderSource = `
precision mediump float;

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float shininess;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vLightDirection);
    
    // Ambient component
    vec3 ambient = ambientColor;

    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * diffuseColor;

    // Specular component (view-dependent)
    vec3 viewDir = vec3(0.0, 0.0, 1.0); // Assuming the view direction is along the z-axis
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = spec * specularColor;

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}

`

/**
 * @WARNING DO NOT CHANGE ANYTHING ABOVE THIS LINE
 */



/**
 * 
 * @TASK1 Calculate the model view matrix by using the chatGPT
 */

function getChatGPTModelViewMatrix() {
    const transformationMatrix = new Float32Array([
        // you should paste the response of the chatGPT here:
        0.433, -0.25, 0.366, 0.3,
        0.354, 0.354, -0.354, -0.25,
        0.5, 0.5, 0.5, 0,
        0, 0, 0, 1

    ]);
    return getTransposeMatrix(transformationMatrix);
}


/**
 * 
 * @TASK2 Calculate the model view matrix by using the given 
 * transformation methods and required transformation parameters
 * stated in transformation-prompt.txt
 */
function getModelViewMatrix() {
    // calculate the model view matrix by using the transformation
    // methods and return the modelView matrix in this method
    // Translation matrix
    
// Translation matrix
const translationMatrix = translate(0.3, -0.25, 0);

// Scaling matrix
const scalingMatrix = scale(0.5, 0.5, 1);

// Rotation matrices
const rotationXMatrix = rotateX(30);
const rotationYMatrix = rotateY(45);
const rotationZMatrix = rotateZ(60);

// Combine all transformations
const modelViewMatrix = multiplyMatrices(
    translationMatrix,
    scalingMatrix,
    rotationXMatrix,
    rotationYMatrix,
    rotationZMatrix
);

return modelViewMatrix;
}

// Function to translate
function translate(tx, ty, tz) {
return new Float32Array([
    1, 0, 0, tx,
    0, 1, 0, ty,
    0, 0, 1, tz,
    0, 0, 0, 1
]);
}

// Function to scale
function scale(sx, sy, sz) {
return new Float32Array([
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, 0, 1
]);
}

// Function to rotate around the x-axis
function rotateX(angle) {
const radian = (Math.PI / 180) * angle;
const cos = Math.cos(radian);
const sin = Math.sin(radian);

return new Float32Array([
    1, 0, 0, 0,
    0, cos, -sin, 0,
    0, sin, cos, 0,
    0, 0, 0, 1
]);
}

// Function to rotate around the y-axis
function rotateY(angle) {
const radian = (Math.PI / 180) * angle;
const cos = Math.cos(radian);
const sin = Math.sin(radian);

return new Float32Array([
    cos, 0, sin, 0,
    0, 1, 0, 0,
    -sin, 0, cos, 0,
    0, 0, 0, 1
]);
}

// Function to rotate around the z-axis
function rotateZ(angle) {
const radian = (Math.PI / 180) * angle;
const cos = Math.cos(radian);
const sin = Math.sin(radian);

return new Float32Array([
    cos, -sin, 0, 0,
    sin, cos, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]);
}

// Function to multiply matrices
function multiplyMatrices(...matrices) {
return matrices.reduce((result, matrix) => {
    const product = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            product[i * 4 + j] = 0;
            for (let k = 0; k < 4; k++) {
                product[i * 4 + j] += result[k * 4 + j] * matrix[i * 4 + k];
            }
        }
    }
    return product;
}, new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]));
}

/**
 * @TASK3 Ask CHAT-GPT to animate the transformation calculated in 
 * task2 infinitely with a period of 10 seconds. 
 * First 5 seconds, the cube should transform from its initial 
 * position to the target position.
 * The next 5 seconds, the cube should return to its initial position.
 */
function getPeriodicMovement(startTime) {
    // Get the current time
    const currentTime = (new Date().getTime() - startTime) / 1000; // Convert to seconds

    // Define the total animation period (10 seconds)
    const animationPeriod = 10;

    // Calculate the time within the current 10-second period
    const elapsedSeconds = currentTime % animationPeriod;

    // Define the initial and target transformations
    const initialTransform = getModelViewMatrix();
    const targetTransform = getChatGPTModelViewMatrix();

    // Interpolate between initial and target transformations
    const interpolate = (elapsedSeconds <= 5) ? elapsedSeconds / 5 : (10 - elapsedSeconds) / 5;
    const interpolatedMatrix = interpolateMatrices(initialTransform, targetTransform, interpolate);

    return interpolatedMatrix;
}

// Function to interpolate between two matrices
function interpolateMatrices(matrix1, matrix2, t) {
    const result = new Float32Array(matrix1.length);
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = matrix1[i] + t * (matrix2[i] - matrix1[i]);
    }
    return result;
}