
// Power Plant design model provided by Bentley Systems
var bimUrl = Cesium.IonResource.fromAssetId(5743);
var pointCloudUrl = Cesium.IonResource.fromAssetId(5714);
var instancedUrl = 'http://localhost:8080/Project/SampleData/Cesium3DTiles/Instanced/InstancedOrientation/tileset.json';
var modelUrl = '../../SampleData/models/CesiumAir/Cesium_Air.glb';

// loadTileset(bimUrl);
var newTileSet  = new createTileset({url:bimUrl});
// createTileset.loadTileset();

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
        // globe.clippingPlanes._planes["0"]._distance = targetY;
        return plane;
    };
}

function createTileset(options) {
    if (!Cesium.defined(options)) {
        options = {
            url: 'http://localhost:8080/Project/SampleData/Cesium3DTiles/Instanced/InstancedOrientation/tileset.json'
        };
    }
    this.ops = options;
    // this.tileset;
    // this.primitive3Dtile;
    // var clippingPlanes;
    /* if(!Cesium.defined(this.ops.url)){
        return;
    }else{
        loadTileset(this.ops.url);
    } */
    this.getTileset = function () {
        if (Cesium.defined(this.tileset))
            return this.tileset;
    };
    this.getclippingPlanes = function () {
        if (Cesium.defined(this.clippingPlanes))
            return this.clippingPlanes;
    };
    this.getPosition = function () {
        if (Cesium.defined(this.position))
            return this.position;
    };
    this.getTilesetShowHide = function () {
        if (Cesium.defined(this.primitive3Dtile))
            return this.primitive3Dtile;
    };
    function setTilesetShowHide(boolShow) {
        if (Cesium.defined(this.primitive3Dtile))
            this.primitive3Dtile.show = boolShow;
    }
    this.loadTileset = function (url) {
        var that = this;
        //已经存在一个3dtile的数据后，需要先初始化，否则会有多重剖切面plane
        if (Cesium.defined(this.primitive3Dtile)) {
            // reset();
            return;
        }
        this.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: [
                // new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 0.0),
                new Cesium.ClippingPlane(new Cesium.Cartesian3(1.0, 1.0, 0.0), 10.0)
            ],
            edgeWidth: viewModel.edgeStylingEnabled ? 1.0 : 0.0
        });
        this.primitive3Dtile = new Cesium.Cesium3DTileset({
            url: url,
            clippingPlanes: this.clippingPlanes
        });
        this.tileset = viewer.scene.primitives.add(this.primitive3Dtile);
        this.tileset.debugShowBoundingVolume = viewModel.debugBoundingVolumesEnabled;
        var tileset = this.tileset;
        this.tileset.readyPromise.then(function (tileset) {
            var tileset0 = tileset;
            // var clippingPlanes= tileset._clippingPlanes;
            var clippingPlanes = that.clippingPlanes;
            boundingSphere = tileset0.boundingSphere;
            radius = boundingSphere.radius;
            for (var i = 0; i < clippingPlanes.length; ++i) {
                var plane = clippingPlanes.get(i);
                planeEntity = viewer.entities.add({
                    position: boundingSphere.center,
                    plane: {
                        dimensions: new Cesium.Cartesian2(radius * 2.5, radius * 2.5),
                        material: Cesium.Color.WHITE.withAlpha(0.1),
                        plane: new Cesium.CallbackProperty(createPlaneUpdateFunction(plane), false),
                        outline: true,
                        outlineColor: Cesium.Color.WHITE
                    }
                });
                planeEntities.push(planeEntity);
            }
            /* //add 地形剖切
            // Create clipping planes for polygon around area to be clipped.
            globe.depthTestAgainstTerrain = false;
            var distance = -10;
            // var position = this.tileset.boundingSphere.center;
            var position = boundingSphere.center;
            globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
                modelMatrix : Cesium.Transforms.eastNorthUpToFixedFrame(position),
                planes : [
                    new Cesium.ClippingPlane(new Cesium.Cartesian3( 1.0,  1.0, 0.0), distance)
                ],
                edgeWidth: 1.0,
                edgeColor: Cesium.Color.WHITE,
                enabled : true
            }); */
            viewer.zoomTo(tileset0, new Cesium.HeadingPitchRange(0.5, -0.2, radius * 4));
        }).otherwise(function (error) {
            console.log(error);
        });
    };
    //控制3dtile数据的显示、隐藏
    this.showHide3Dtile = function (boolShow) {
        if (boolShow) {
            primitive3Dtile.show = true;
        }
        else {
            primitive3Dtile.show = false;
        }
    };
    //重置，恢复初始
    this.reset = function () {
        //viewer.entities.removeAll();
        viewer.scene.primitives.remove(this.tileset);
        planeEntities = [];
        targetY = 0.0;
        this.tileset = undefined;
        // globe.clippingPlanes=[];
    };
}

createTileset.prototype.bindControl = function () {
    var that = this;
    // Track and create the bindings for the view model
    var toolbar = document.getElementById('toolbar');
    Cesium.knockout.track(viewModel);
    try { Cesium.knockout.applyBindings(viewModel, toolbar); } catch (e) { }

    Cesium.knockout.getObservable(viewModel, 'debugBoundingVolumesEnabled').subscribe(function (value) {
        if (Cesium.defined(that.tileset)) {
            that.tileset.debugShowBoundingVolume = value;
        }
    });

    Cesium.knockout.getObservable(viewModel, 'edgeStylingEnabled').subscribe(function (value) {
        var edgeWidth = value ? 1.0 : 0.0;
        that.clippingPlanes.edgeWidth = edgeWidth;
    });

    //控制剖切的显示与隐藏
    Cesium.knockout.getObservable(viewModel, 'showPlane').subscribe(function (value) {

        var showPlane = value ? 1.0 : 0.0;
        if (showPlane) {
            for(let i = 0;i<planeEntities.length;i++){
                var planeEntity = planeEntities[i];
                if (Cesium.defined(planeEntity)) {
                    planeEntity.show = true;
                }
            }
            
        } else {
            for(let i = 0;i<planeEntities.length;i++){
                var planeEntity = planeEntities[i];
                if (Cesium.defined(planeEntity)) {
                    planeEntity.show = false;
                }
            }
        }
    });
}
createTileset.prototype.setTilesetShowHide = function(boolShow){
    var that =this;
    if(Cesium.defined(that.primitive3Dtile))
        that.primitive3Dtile.show =boolShow;
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
