import * as Shape from './model/shape.js'

export class GlobalState {
    constructor() {
        this.prevMesh = undefined
        this.activeShape = new Shape.Cube(1, 1, 1, 0xff0000)
        this.activeMesh = this.activeShape.getMesh()
        this.activeTexture = undefined
        this.onDrag = false
        this.speed = 0;
        this.accelaretion = 0.001;
    }

    updateShape(shape, renderMode = 0, callback) {
        this.prevMesh = this.activeMesh
         //NOTE: dat.gui is really weird with string-number alias option, its assigned value is not a string nor number so without parseInt renderMode value pass will fail
        renderMode = parseInt(renderMode)
        switch(shape) {
            case 'Cube':
                this.activeShape = new Shape.Cube(1, 1, 1, 0xff0000, renderMode)
                break;
            case 'Cone':
                this.activeShape = new Shape.Cone(1, 2, 0xff0000, renderMode)
                break;
            case 'Cylinder':
                this.activeShape = new Shape.Cylinder(1, 1, 2, 0xff0000, renderMode)
                break;
            case 'Sphere':
                this.activeShape = new Shape.Sphere(1, 0xff0000, renderMode)
                break;
            case 'Icosahedron':
                this.activeShape = new Shape.Icosahedron(1, 0xff00000, renderMode)
                break;
            case 'Torus':
                this.activeShape = new Shape.Torus(1, 0.3, 0xff0000, renderMode)
                break;
            case 'Teapot':
                this.activeShape = new Shape.Teapot(1, 0xff0000, renderMode)
                break;
            default:
        }
        this.activeMesh = this.activeShape.getMesh()
    }

    updateTexture() {
        this.prevMesh = this.activeMesh
        this.activeShape.setMesh(this.activeTexture)
        this.activeMesh = this.activeShape.getMesh()
    }

    updateRenderMode(renderMode = 0) {
        this.prevMesh = this.activeMesh
        //NOTE: dat.gui is really weird with string-number alias option, its assigned value is not a string nor number so without parseInt renderMode value pass will fail
        this.activeShape.renderMode = parseInt(renderMode)
        this.activeShape.setMesh(this.activeTexture)
        this.activeMesh = this.activeShape.getMesh()
    }
}