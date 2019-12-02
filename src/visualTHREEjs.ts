"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import IViewport = powerbi.IViewport;

import { VisualSettings } from "./settings";


import * as THREE from "three";
import { ThresholdArrayGenerator } from "d3";


export class Visual implements IVisual {
    private target: HTMLElement;
    private settings: VisualSettings;
    private viewport: IViewport;

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private mesh: THREE.Mesh;
    private group: THREE.Group;

    // Set the scene size.
    //const WIDTH = window.innerWidth;
	private WIDTH;
    //const HEIGHT = window.innerHeight;
	private HEIGHT;
	
    // Set some camera attributes.
    private VIEW_ANGLE = 45;
    
    private NEAR = 0.1;
    private FAR = 10000;

    

    constructor(options: VisualConstructorOptions) {

        this.target = document.createElement( 'div' );
        this.target.className = "test";
        this.target.id = "container";
        options.element.appendChild(this.target);


        //this.WIDTH = this.viewport.width;
        //this.HEIGHT = this.viewport.height;
        this.WIDTH = 300;
        this.HEIGHT = 300;

        
        const ASPECT =this.WIDTH / this.HEIGHT;
        
        const container = document.querySelector('#container');

    // Create a WebGL renderer, camera and a scene
    this.renderer = new THREE.WebGLRenderer();
    this.camera =
        new THREE.PerspectiveCamera(
            this.VIEW_ANGLE,
            ASPECT,
            this.NEAR,
            this.FAR
        );

    this.scene = new THREE.Scene();

    // Add the camera to the scene.
    this.scene.add(this.camera);

    // Start the renderer.
    this.renderer.setSize(this.WIDTH, this.HEIGHT);

    // Attach the renderer-supplied
    // DOM element.
    container.appendChild(this.renderer.domElement);

     // create a point light
     const pointLight =
     new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // add to the scene
        this.scene.add(pointLight);

// create the sphere's material
const sphereMaterial =
new THREE.MeshLambertMaterial(
  {
    color: 0xCC0000
  });

// Set up the sphere vars
const RADIUS = 50;
const SEGMENTS = 16;
const RINGS = 16;

// Create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
const sphere = new THREE.Mesh(

new THREE.SphereGeometry(
  RADIUS,
  SEGMENTS,
  RINGS),

sphereMaterial);

// Move the Sphere back in Z so we
// can see it.
sphere.position.z = -300;

// Finally, add the sphere to the scene.
this.scene.add(sphere);

        console.log(this.scene);

    }


    public update(options: VisualUpdateOptions) {

        this.WIDTH = options.viewport.width;
        this.HEIGHT = options.viewport.height;
        
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.render(this.scene, this.camera);

    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}
