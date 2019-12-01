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
import ISelectionManager = powerbi.extensibility.ISelectionManager; 


import * as d3 from "d3";
type Selection<T> = d3.Selection<any, T, any, any>;

import { VisualSettings } from "./settings";

interface DataPoint{
    category: string;
    value: number;
    color: string;
    identity: powerbi.visuals.ISelectionId;
    highlighted: boolean;
};

interface ViewModel{
    dataPoints: DataPoint[];
    maxValue: number;
    highlights: boolean;
};

export class Visual implements IVisual {
    
    private host: powerbi.extensibility.visual.IVisualHost;
    private svg: Selection<any>;
    private barGroup: Selection<SVGElement>;
    private selectionManager: ISelectionManager;

    constructor(options: VisualConstructorOptions) {
        //html container for the visual
        this.host = options.host;

        
        //create drawing board 
        this.svg = d3.select(options.element)
        .append("svg") 
        .classed("my-little-chart",true); //css class property
        
        //create a new group element inside the svg
        this.barGroup = this.svg.append("g")
        .classed("bar-group",true);

        this.selectionManager = this.host.createSelectionManager();

    }

    public update(options: VisualUpdateOptions) {

        // let sample: DataPoint[] = [
        //     {
        //         category:"Apples",
        //         value: 10   
        //     },
        //     {
        //         category: "Bananas",
        //         value: 20
        //     },
        //     {
        //         category: "Cherry",
        //         value: 30
        //     },
        //     {
        //         category: "Kiwis",
        //         value: 40
        //     }        
        // ]
        
        // //allows the graph to stretch when resized
        // let viewModel: ViewModel = {
        //     dataPoints: sample,
        //     maxValue: d3.max(sample, x => x.value)
        // };
try{


        let viewModel = this.getViewModel(options);

        let vpWidth:number = options.viewport.width;
        let vpHeigth:number = options.viewport.height;

        this.svg.attr("width",vpWidth);
        this.svg.attr("height", vpHeigth);

        // this.svg.attr({
        //     width: vpWidth,
        //     height: vpHeigth
        // } as any);

        let yScale = d3.scaleLinear()
        .domain([0,viewModel.maxValue])
        .range([vpHeigth,0]);

        let xScale = d3.scaleBand()
        .domain(viewModel.dataPoints.map(d=> d.category))
        .range([0,vpWidth])
        .padding(0.1);

        let bars = this.barGroup
            .selectAll(".bar") //returns a list of child element matching certain filters
            .data(viewModel.dataPoints);
        
            bars.enter() //get the list of elements
            .append("rect") //bars in bar chart
            .classed("bar", true);

            bars.attr("width", xScale.bandwidth())
                .attr("height", d => vpHeigth - yScale(d.value))
                .attr("y", d=>yScale(d.value))
                .attr("x", d=> xScale(d.category))
                
            bars.style("fill", d => d.color)
            
            bars.style("fill-opacity", d => viewModel.highlights ? d.highlighted ? 1.0 : 0.5 : 1.0);

                bars.on("click", (d) => {                    
                    this.selectionManager
                        .select(d.identity, true)
                        // .then(ids => {
                        //     bars.attr({
                        //     "fill-opacity": ids.length > 0 ? 
                        //     d => ids.indexOf(d.identity) >= 0 ? 1 : 0.5
                        //     : 1.0
                        //     }as any)
                        //});//close then
                        .then (ids =>{
                            if (ids.length>0){
                                bars.style("fill-opacity", d => ids.indexOf(d.identity) >= 0 ? 1.0 : 0.5)
                            }
                            else{
                                bars.style("fill-opacity", 1.0)
                            }
                        })
                })//close onclick



            bars.exit()
                .remove();
            
            }
            catch(e){
                console.log(e);
            }
            
            //remove empty elements from svg canvas (when input data changes)

    }

private getViewModel(options: VisualUpdateOptions): ViewModel{
    
    let dv = options.dataViews;

    //empty viewmodel in case there is no data to return
    let viewModel: ViewModel ={
        dataPoints: [],
        maxValue:0,
        highlights: false
    };

    //input data check
    if (!dv 
        || !dv[0]
        || !dv[0].categorical
        || !dv[0].categorical.categories
        || !dv[0].categorical.categories[0].source
        || !dv[0].categorical.values)
        return viewModel;

    //reference to the categorical view itself
    let view  = dv[0].categorical;

    //reference to the category array. User can potentially add multiple category series (not in this case as we set the max to 1) so we need to specify which one to be used
    let categories = view.categories[0];

    let values = view.values[0];
    let highlights = values.highlights;

    for (let i = 0, len = Math.max(categories.values.length, values.values.length);i<len; i++){
        //grab category and value pairs and push them into the viewmodel
        viewModel.dataPoints.push({
            category: <string>categories.values[i],
            value: <number>values.values[i],
            color: this.host.colorPalette.getColor(<string>categories.values[i]).value,
            identity: this.host.createSelectionIdBuilder()
                                .withCategory(categories, i)
                                .createSelectionId(),
            highlighted: highlights ? highlights[i] ? true : false : false

        });
    }

    viewModel.maxValue = d3.max(viewModel.dataPoints, x => x.value);
    viewModel.highlights = viewModel.dataPoints.filter(d => d.highlighted).length > 0;
    
    return viewModel;
}


    // private static parseSettings(dataView: DataView): VisualSettings {
    //     return <VisualSettings>VisualSettings.parse(dataView);
    // }

    // /**
    //  * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
    //  * objects and properties you want to expose to the users in the property pane.
    //  *
    //  */
    // public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    //     return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    // }
}