import * as THREE from 'three';
import { TeapotBufferGeometry } from '../../node_modules/three/examples/jsm/geometries/TeapotBufferGeometry.js';

export class Shape {
    // position = {
    //     x: 0,
    //     y: 0,
    //     z: 0
    // }
    // rotation = {
    //     x: 0,
    //     y: 0,
    //     z: 0,
    // }
    // scale = {
    //     x: 1,
    //     y: 1,
    //     z: 1,
    // }
    constructor(color, renderMode) {
        this.color = color
        //0 - Solid, 1 - Wireframe, 2 - Point
        this.renderMode = renderMode
        this.texture = undefined
    }
}

export class Cube extends Shape {
    constructor(height, width, depth, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            h: height,
            w: width,
            d: depth
        }
        this.mesh = undefined
        this.SEGMENT_RATE = 12
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.BoxGeometry(
            this.size.w, 
            this.size.h, 
            this.size.d, 
            Math.max(parseInt(this.size.w * this.SEGMENT_RATE), 1), 
            Math.max(parseInt(this.size.h * this.SEGMENT_RATE), 1),
            Math.max(parseInt(this.size.d * this.SEGMENT_RATE), 1)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({map: texture}) 
        }
        else material = new THREE.MeshLambertMaterial({color: this.color})
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.BoxGeometry(
            this.size.w, 
            this.size.h, 
            this.size.d, 
            Math.max(parseInt(this.size.w * this.SEGMENT_RATE), 1), 
            Math.max(parseInt(this.size.h * this.SEGMENT_RATE), 1),
            Math.max(parseInt(this.size.d * this.SEGMENT_RATE), 1)
        )
        let geo = new THREE.EdgesGeometry( geometry );
        let mat = new THREE.LineBasicMaterial( { color: this.color, linewidth: 1 } );
        return new THREE.LineSegments( geo, mat );
    }

    setPointMesh() {
        let geometry = new THREE.BoxGeometry(
            this.size.w, 
            this.size.h, 
            this.size.d, 
            1, //Segment at 1 to render only real vertices
            1, //Segment at 1 to render only real vertices
            1 //Segment at 1 to render only real vertices
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++ ) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({color: this.color, size: 0.01})
        let particles = new THREE.Points( geo, mat );
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch(this.renderMode) {
            case 0: 
                this.mesh = this.setSolidMesh(texture); 
                break;
            case 1: 
                this.mesh = this.setWiredMesh(); 
                break;
            case 2: 
                this.mesh = this.setPointMesh(); 
                break;
            default: console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
    //Add getPointMesh
    //Add getLineMesh
}

export class Cone extends Shape {
    constructor(radius, height, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            r: radius,
            h: height
        }
        this.mesh = undefined
        this.HEIGHT_SEGMENT_RATE = 12
        this.RADIAL_SEGMENT_RATE = 32
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.ConeGeometry(
            this.size.r, 
            this.size.h, 
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2), 
            Math.max(parseInt(this.size.h * this.HEIGHT_SEGMENT_RATE), 1)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({map: texture}) 
        }
        else material = new THREE.MeshLambertMaterial({color: this.color})
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.ConeGeometry(
            this.size.r, 
            this.size.h, 
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2), 
            Math.max(parseInt(this.size.h * this.HEIGHT_SEGMENT_RATE), 1)
        )
        let geo = new THREE.EdgesGeometry( geometry );
        let mat = new THREE.LineBasicMaterial( { color: this.color, linewidth: 1 } );
        return new THREE.LineSegments( geo, mat );
    }

    setPointMesh() {
        let geometry = new THREE.ConeGeometry(
            this.size.r, 
            this.size.h, 
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2), 
            1 //Segment at 1 to render only real vertices
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++ ) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({color: this.color, size: 0.01})
        let particles = new THREE.Points( geo, mat );
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch(this.renderMode) {
            case 0: 
                this.mesh = this.setSolidMesh(texture); 
                break;
            case 1: 
                this.mesh = this.setWiredMesh(); 
                break;
            case 2: 
                this.mesh = this.setPointMesh(); 
                break;
            default: console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

export class Cylinder extends Shape {
    constructor(radiusBottom, radiusTop, height, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            rt: radiusTop,
            rb: radiusBottom,
            h: height
        }
        this.mesh = undefined
        this.HEIGHT_SEGMENT_RATE = 12
        this.RADIAL_SEGMENT_RATE = 32
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.CylinderGeometry(
            this.size.rt, 
            this.size.rb, 
            this.size.h, 
            Math.max(parseInt(this.size.rt * this.RADIAL_SEGMENT_RATE), 2), 
            Math.max(parseInt(this.size.h * this.HEIGHT_SEGMENT_RATE), 1)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({map: texture}) 
        }
        else material = new THREE.MeshLambertMaterial({color: this.color})
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.CylinderGeometry(
            this.size.rt, 
            this.size.rb, 
            this.size.h, 
            Math.max(parseInt(this.size.rt * this.RADIAL_SEGMENT_RATE), 2), 
            Math.max(parseInt(this.size.h * this.HEIGHT_SEGMENT_RATE), 1)
        )
        let geo = new THREE.EdgesGeometry( geometry );
        let mat = new THREE.LineBasicMaterial( { color: this.color, linewidth: 1 } );
        return new THREE.LineSegments( geo, mat );
    }

    setPointMesh() {
        let geometry = new THREE.CylinderGeometry(
            this.size.rt, 
            this.size.rb, 
            this.size.h, 
            Math.max(parseInt(this.size.rt * this.RADIAL_SEGMENT_RATE), 2), 
            1 //Segment at 1 to render only real vertices
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++ ) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({color: this.color, size: 0.01})
        let particles = new THREE.Points( geo, mat );
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch(this.renderMode) {
            case 0: 
                this.mesh = this.setSolidMesh(texture); 
                break;
            case 1: 
                this.mesh = this.setWiredMesh(); 
                break;
            case 2: 
                this.mesh = this.setPointMesh(); 
                break;
            default: console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

export class Sphere extends Shape {
    constructor(radius, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            r: radius
        }
        this.mesh = undefined
        this.RADIAL_SEGMENT_RATE = 32
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.SphereGeometry(
            this.size.r, 
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2), 
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({map: texture}) 
        }
        else material = new THREE.MeshLambertMaterial({color: this.color})
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.SphereGeometry(
            this.size.r, 
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2), 
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2)
        )
        let geo = new THREE.EdgesGeometry( geometry );
        let mat = new THREE.LineBasicMaterial( { color: this.color, linewidth: 1 } );
        return new THREE.LineSegments( geo, mat );
    }

    setPointMesh() {
        let geometry = new THREE.SphereGeometry(
            this.size.r, 
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2), 
            Math.max(parseInt(this.size.r * this.RADIAL_SEGMENT_RATE), 2)
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++ ) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({color: this.color, size: 0.01})
        let particles = new THREE.Points( geo, mat );
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch(this.renderMode) {
            case 0: 
                this.mesh = this.setSolidMesh(texture); 
                break;
            case 1: 
                this.mesh = this.setWiredMesh(); 
                break;
            case 2: 
                this.mesh = this.setPointMesh(); 
                break;
            default: console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

export class Torus extends Shape {
    constructor(radius, tube, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            r: radius,
            t: tube
        }
        this.mesh = undefined
        this.TUBULAR_SEGMENT_RATE = 32
        this.RADIAL_SEGMENT_RATE = 32
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.TorusGeometry(
            this.size.r,
            this.size.t,
            Math.max(parseInt(this.RADIAL_SEGMENT_RATE * this.size.t), 2),
            Math.max(parseInt(this.TUBULAR_SEGMENT_RATE * this.size.r), 2)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({map: texture}) 
        }
        else material = new THREE.MeshLambertMaterial({color: this.color})
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.TorusGeometry(
            this.size.r,
            this.size.t,
            Math.max(parseInt(this.RADIAL_SEGMENT_RATE * this.size.t), 2),
            Math.max(parseInt(this.TUBULAR_SEGMENT_RATE * this.size.r), 2)
        )
        let geo = new THREE.EdgesGeometry( geometry );
        let mat = new THREE.LineBasicMaterial( { color: this.color, linewidth: 1 } );
        return new THREE.LineSegments( geo, mat );
    }

    setPointMesh() {
        let geometry = new THREE.TorusGeometry(
            this.size.r,
            this.size.t,
            Math.max(parseInt(this.RADIAL_SEGMENT_RATE * this.size.t), 2),
            Math.max(parseInt(this.TUBULAR_SEGMENT_RATE * this.size.r), 2)
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++ ) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({color: this.color, size: 0.01})
        let particles = new THREE.Points( geo, mat );
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch(this.renderMode) {
            case 0: 
                this.mesh = this.setSolidMesh(texture); 
                break;
            case 1: 
                this.mesh = this.setWiredMesh(); 
                break;
            case 2: 
                this.mesh = this.setPointMesh(); 
                break;
            default: console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

export class Icosahedron extends Shape {
    constructor(radius, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            r: radius
        }
        this.mesh = undefined
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new THREE.IcosahedronGeometry(
            this.size.r,
            0
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({map: texture}) 
        }
        else material = new THREE.MeshLambertMaterial({color: this.color})
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new THREE.IcosahedronGeometry(
            this.size.r,
            0
        )
        let geo = new THREE.EdgesGeometry( geometry );
        let mat = new THREE.LineBasicMaterial( { color: this.color, linewidth: 1 } );
        return new THREE.LineSegments( geo, mat );
    }

    setPointMesh() {
        let geometry = new THREE.IcosahedronGeometry(
            this.size.r,
            0
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.vertices.length; i++ ) {
            geo.vertices.push(geometry.vertices[i]);
        }

        let mat = new THREE.PointsMaterial({color: this.color, size: 0.01})
        let particles = new THREE.Points( geo, mat );
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch(this.renderMode) {
            case 0: 
                this.mesh = this.setSolidMesh(texture); 
                break;
            case 1: 
                this.mesh = this.setWiredMesh(); 
                break;
            case 2: 
                this.mesh = this.setPointMesh(); 
                break;
            default: console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}

export class Teapot extends Shape {
    constructor(radius, color = 0xffffff, renderMode = 0) {
        super(color, renderMode)
        this.size = {
            r: radius
        }
        this.RADIAL_SEGMENT_RATE = 12;
        this.mesh = undefined
        this.setMesh()
    }

    setSolidMesh(texture = undefined) {
        let geometry = new TeapotBufferGeometry(
            this.size.r,
            Math.max(parseInt(this.RADIAL_SEGMENT_RATE * this.size.t), 2)
        )
        let material;
        if (texture !== undefined) {
            material = new THREE.MeshLambertMaterial({map: texture}) 
        }
        else material = new THREE.MeshLambertMaterial({color: this.color})
        return new THREE.Mesh(geometry, material)
    }

    setWiredMesh() {
        let geometry = new TeapotBufferGeometry(
            this.size.r,
            Math.max(parseInt(this.RADIAL_SEGMENT_RATE * this.size.t), 2)
        )
        let geo = new THREE.EdgesGeometry( geometry );
        let mat = new THREE.LineBasicMaterial( { color: this.color, linewidth: 1 } );
        return new THREE.LineSegments( geo, mat );
    }

    setPointMesh() {
        let geometry = new TeapotBufferGeometry(
            this.size.r,
            Math.max(parseInt(this.RADIAL_SEGMENT_RATE * this.size.t), 2)
        )
        let geo = new THREE.Geometry();

        for (var i = 0; i < geometry.attributes.position.array.length / 3; i++ ) {
            geo.vertices.push(new THREE.Vector3(geometry.attributes.position.array[i * 3], geometry.attributes.position.array[i * 3 + 1], geometry.attributes.position.array[i * 3 + 2]));
        }

        let mat = new THREE.PointsMaterial({color: this.color, size: 0.01})
        let particles = new THREE.Points( geo, mat );
        particles.sortParticles = true;
        return particles
    }

    setMesh(texture = undefined) {
        //console.log(this.renderMode)
        switch(this.renderMode) {
            case 0: 
                this.mesh = this.setSolidMesh(texture); 
                break;
            case 1: 
                this.mesh = this.setWiredMesh(); 
                break;
            case 2: 
                this.mesh = this.setPointMesh(); 
                break;
            default: console.log('errr')
        }
        this.mesh.castShadow = true
    }

    getMesh() {
        return this.mesh
    }
}