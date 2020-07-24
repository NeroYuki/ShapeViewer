
export class Option {
    constructor() {
        //lighting
        this.ambientLightIntensity = 0.2;
        this.lighting = true;
        this.lightingPosX = 3;
        this.lightingPosY = 3;
        this.lightingPosZ = 2;
        this.lightsource = false;
        this.shadow = false;
        //transformation
        this.enablePositionDragging = false;
        this.enableScaleDragging = false;
        this.enableRotationDragging = false;
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = 0;
        //texture
        this.useTexture = false;
        this.textureColor = 0xff0000
        this.textureData = undefined
        this.textureFile = undefined
        //dummy field to open texture browser
        this.dummyBrowser = function () {}
        //camera
        this.lookAtEyeX = 0
        this.lookAtEyeY = 0
        this.lookAtEyeZ = 5
        this.lookAtCenterX = 0
        this.lookAtCenterY = 0
        this.lookAtCenterZ = 0
        this.lookAtUpX = 0
        this.lookAtUpY = 1
        this.lookAtUpZ = 0
        this.perspectiveFovy = 75
        this.perspectiveAspectX = (window.innerWidth > window.innerHeight)? 1 : window.innerWidth / window.innerHeight
        this.perspectiveAspectY = (window.innerWidth < window.innerHeight)? 1 : window.innerHeight / window.innerWidth
        this.perspectiveZNear = 0.1
        this.perspectiveZFar = 1000
        //animation
        this.isAnimateBouncing = false;
        this.isAnimateRotating = false;
    }

    fileSelect(cb) {
        let fileDialog = document.getElementById("file-input")
        fileDialog.click()
        fileDialog.onchange = (e) => { 
            if (e.target.files.length < 1) {
                alert('Please at least choose one file')
                return
            } 

            let reader = new FileReader()
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = (e) => {
                var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
                if (match == null) {
                    throw 'Could not parse result'; // should not happen
                }
                this.textureData = e.target.result
                cb()
            }
        }
    }
}


export class ShapePicker {
    constructor() {
        this.shape = "Cube"

        this.toCube = function() {this.shape = "Cube"}
        this.toSphere = function() {this.shape = "Sphere"}
        this.toCylinder = function() {this.shape = "Cylinder"}
        this.toCone = function() {this.shape = "Cone"}
        this.toIcosahedron = function() {this.shape = "Icosahedron"}
        this.toTorus = function() {this.shape = "Torus"}
        this.toTeapot = function() {this.shape = "Teapot"}
    }
}

export class ModePicker {
    constructor() {
        //0 - Solid, 1 - Wireframe, 2 - Point
        this.renderMode = 0

        this.toSolid = function() {this.renderMode = 0}
        this.toLine = function() {this.renderMode = 1}
        this.toPoint = function() {this.renderMode = 2}
    }
}