// 主程序

var scene = viewer.scene;
var globe = viewer.scene.globe;

var viewModel = {
    debugBoundingVolumesEnabled : false,
    showPlane : true,
    edgeStylingEnabled : true
};

var targetY = 0.0;
var planeEntities = [];
var selectedPlane;
var clippingPlanes;
var planeEntity;



	
// Select plane when mouse down
var downHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
downHandler.setInputAction(function(movement) {
    var pickedObject = scene.pick(movement.position);
    if (Cesium.defined(pickedObject) &&
            Cesium.defined(pickedObject.id) &&
            Cesium.defined(pickedObject.id.plane)) {
        selectedPlane = pickedObject.id.plane;
        selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05);
        selectedPlane.outlineColor = Cesium.Color.WHITE;
        scene.screenSpaceCameraController.enableInputs = false;
    }
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

// Release plane on mouse up
var upHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
upHandler.setInputAction(function() {
    if (Cesium.defined(selectedPlane)) {
        selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
        selectedPlane.outlineColor = Cesium.Color.WHITE;
        selectedPlane = undefined;
    }

    scene.screenSpaceCameraController.enableInputs = true;
}, Cesium.ScreenSpaceEventType.LEFT_UP);

// Update plane on mouse move 
//移动鼠标控制剖切面的移动，这里为按x，y中较大方向移动
var moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
moveHandler.setInputAction(function(movement) {
    if (Cesium.defined(selectedPlane)) {
        var deltaX = movement.startPosition.x - movement.endPosition.x;
        var deltaY = movement.startPosition.y - movement.endPosition.y;
        if(deltaX*deltaX >= deltaY*deltaY){
            targetY += deltaX;
        }else{
            targetY += -deltaY; //y轴正方向向外，需要置反方向
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

function createPlaneUpdateFunction(plane) {
    return function () {
        plane.distance = targetY;
        //地形随着plane位置剖切，实现效果不好，锯齿较大
        //globe.clippingPlanes._planes["0"]._distance = targetY;
        return plane;
    };
}

var tileset;
function loadTileset(url) {
    clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes : [
            // new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 0.0),
            new Cesium.ClippingPlane(new Cesium.Cartesian3(1.0, 1.0, 0.0), 10.0)
        ],
        edgeWidth : viewModel.edgeStylingEnabled ? 1.0 : 0.0
    });
    tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url : url,
        clippingPlanes : clippingPlanes
    }));
    
    
    tileset.debugShowBoundingVolume = viewModel.debugBoundingVolumesEnabled;
    return tileset.readyPromise.then(function() {
        boundingSphere = tileset.boundingSphere;
        radius = boundingSphere.radius;

        
        for (var i = 0; i < clippingPlanes.length; ++i) {
            var plane = clippingPlanes.get(i);
            planeEntity = viewer.entities.add({
                position : boundingSphere.center,
                plane : {
                    dimensions : new Cesium.Cartesian2(radius * 2.5, radius * 2.5),
                    material : Cesium.Color.WHITE.withAlpha(0.1),
                    plane : new Cesium.CallbackProperty(createPlaneUpdateFunction(plane), false),
                    outline : true,
                    outlineColor : Cesium.Color.WHITE
                }
            });
            planeEntities.push(planeEntity);
        }
        //add 地形剖切
        // Create clipping planes for polygon around area to be clipped.
        globe.depthTestAgainstTerrain = true;
        var distance = -10;
        var position = tileset.boundingSphere.center;
        globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            modelMatrix : Cesium.Transforms.eastNorthUpToFixedFrame(position),
            planes : [
                new Cesium.ClippingPlane(new Cesium.Cartesian3( 1.0,  1.0, 0.0), distance)
            ],
            edgeWidth: 1.0,
            edgeColor: Cesium.Color.WHITE,
            enabled : true
        });
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, radius*4));

    return tileset;
    }).otherwise(function(error) {
        console.log(error);
    });
}

function loadModel(url) {
    clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes : [
            new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 0.0)
        ],
        edgeWidth : viewModel.edgeStylingEnabled ? 1.0 : 0.0
    });

    var position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 100.0);
    var heading = Cesium.Math.toRadians(135.0);
    var pitch = 0.0;
    var roll = 0.0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
    var entity = viewer.entities.add({
        name : url,
        position : position,
        orientation : orientation,
        model : {
            uri : url,
            scale : 8,
            minimumPixelSize : 100.0,
            clippingPlanes : clippingPlanes
        }
    });
    viewer.trackedEntity = entity;
    for (var i = 0; i < clippingPlanes.length; ++i) {
        var plane = clippingPlanes.get(i);
        var planeEntity = viewer.entities.add({
            position : position,
            plane : {
                dimensions : new Cesium.Cartesian2(300.0, 300.0),
                material : Cesium.Color.WHITE.withAlpha(0.1),
                plane : new Cesium.CallbackProperty(createPlaneUpdateFunction(plane), false),
                outline : true,
                outlineColor : Cesium.Color.WHITE
            }
        });

        planeEntities.push(planeEntity);
    }
}

// Power Plant design model provided by Bentley Systems
var bimUrl = Cesium.IonResource.fromAssetId(5743);
var pointCloudUrl = Cesium.IonResource.fromAssetId(5714);
var instancedUrl = '../../SampleData/Cesium3DTiles/Instanced/InstancedOrientation/tileset.json';
var modelUrl = '../../SampleData/models/CesiumAir/Cesium_Air.glb';

loadTileset(bimUrl);

// Track and create the bindings for the view model
var toolbar = document.getElementById('toolbar');
Cesium.knockout.track(viewModel);
Cesium.knockout.applyBindings(viewModel, toolbar);

Cesium.knockout.getObservable(viewModel, 'debugBoundingVolumesEnabled').subscribe(function(value) {
    if (Cesium.defined(tileset)) {
        tileset.debugShowBoundingVolume = value;
    }
});

Cesium.knockout.getObservable(viewModel, 'edgeStylingEnabled').subscribe(function(value) {
    var edgeWidth = value ? 1.0 : 0.0;
    clippingPlanes.edgeWidth = edgeWidth;
});

//控制剖切的显示与隐藏
Cesium.knockout.getObservable(viewModel, 'showPlane').subscribe(function(value) {
    
    var showPlane = value ? 1.0 : 0.0;	
    if(showPlane){		    	
        if(Cesium.defined(planeEntity)){
            planeEntity.show =true;
        }
    }else{
        if(Cesium.defined(planeEntity)){
            planeEntity.show =false;
        }		    	
    }
});

