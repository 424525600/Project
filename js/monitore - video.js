//风险点监控
var flagMonitor = false;
var newMonitore;
var addEntity;
function monitore(positions) {
    //save current id
    var currentId = -1;
    //save entities ids
    this.ids = [];
    //save entities
    this.entities = new Cesium.EntityCollection();
    // get entity by the id or index
    this.get_addEntity = function (id) {
        var entity = this.entities.getById(id);
        if (Cesium.defined(entity)) {
            return entity;
        }
    }
    //get entities
    this.get_enities = function (id) {
        if (Cesium.defined(this.entities)) {
            return this.entities;
        }
    }
    //hide all the entities
    var redWallEntities = new Cesium.EntityCollection();
    this.hideEntities = function () {
        redWallEntities.show = false;
        this.entities.show = false;
    }
    //display all the entities
    this.displayEntities = function () {
        redWallEntities.show = true;
        this.entities.show = true;
    }



    //add some symbol and label which can be cliked,and show in the scene.
    if (!viewer) {
        return;
    }
    let num_length = positions.length;
    for (let i = 0; i < num_length; i++) {
        /* let videoDiv1 =document.createElement("video");
        videoDiv1.id = "trailer"+i;
        let videoDiv2 =document.createElement("source");
        videoDiv1.appendChild(videoDiv2);

        let str_html = '<video id="trailer'+ i +'" style="visibility: hidden"  muted autoplay loop crossorigin controls>'
				+'<source src=" " type="video/mp4">'
						+'Your browser does not support the <code>video</code> element.'
            +'</video>';
            document.getElementById("video").append(str_html); */
        let addEntity = addBillboard(undefined, i, positions[i]);
        let id = addEntity.id;
        this.ids.push(id);
        this.entities.add(addEntity);
    }

    //create list table,this postion can be located after located.

    //add listener to this symbol,show videos when clicked. 

    var videoUrls = ["https://cesiumjs.org/videos/Sandcastle/big-buck-bunny_trailer.mp4",
        "../images/video/qjzb.mp4",
        "https://cesiumjs.org/videos/Sandcastle/big-buck-bunny_trailer.mp4",
        "https://cesiumjs.org/videos/Sandcastle/big-buck-bunny_trailer.mp4",
        "https://cesiumjs.org/videos/Sandcastle/big-buck-bunny_trailer.mp4"];

    var handlerEntity = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    
    handlerEntity.setInputAction(function (movement) {
        var videos = videoUrls;
        var pickedObject = scene.pick(movement.position);
        if (Cesium.defined(pickedObject) &&
            Cesium.defined(pickedObject.id) &&
            Cesium.defined(pickedObject.id.name)) {
            var name = pickedObject.id.name;
            if (!Cesium.defined(pickedObject.id._position))
                return;
            // currentId = parseInt(pickedObject.id.name);//?????获取id号
            
            debugger;//不知道为什么，视屏出不来。。。。。。
            var videoElement = document.getElementById("trailer0");
            videoElement.baseURI = "https://cesiumjs.org/videos/Sandcastle/big-buck-bunny_trailer.mp4";
            // videoElement.currentSrc = videoUrls[currentId];
            var position = pickedObject.id._position._value;
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height + 1;
            redWall = viewer.entities.add({
                name: '当前-' + name,
                wall: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([longitude - 0.001255, latitude, cartographic.height + 100,
                    longitude + 0.001255, latitude, cartographic.height + 100]),
                    minimumHeights: [cartographic.height + 9.44, cartographic.height + 9.44],
                    material: videoElement
                }
            });
            // redWallEntities.add(redWall);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    //增加billboard 实体
    /* 参数：
    id：编号
    position：位置,只有经纬度
    
    返回： billboards数组 entitycollection对象
     */
    function addBillboard(billboards, id, position) {
        if (!Cesium.defined(billboards)) {
            // Create a billboard collection with two billboards
            var billboards = viewer.entities.add(new Cesium.BillboardCollection());
        }
        var addEntity = viewer.entities.add({
            name: '' + id + "号监测点",
            position: position,
            billboard: {
                id: id,
                show: true,
                scale: 1.0,
                sizeInMeters: true,
                image: './images/Cesium_Logo_overlay.png',
                distanceDisplayCondition: 3000
            }
        });
        return addEntity;
        /*  // billboards.add({
         //     name : '检测点'+id,    
         //     position: position,
         //     billboard: {
         //         id: id,
         //         show: true,
         //         position: position,
         //         scale: 1.0,
         //         sizeInMeters: true,
         //         image: './images/Cesium_Logo_overlay.png'
         //         // position: Cesium.Cartesian3.ZERO,
         //         // pixelOffset: Cesium.Cartesian2.ZERO,
         //         // eyeOffset: Cesium.Cartesian3.ZERO,
         //         // heightReference: Cesium.HeightReference.NONE,
         //         // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
         //         // verticalOrigin: Cesium.VerticalOrigin.CENTER,
         //         // scale: 1.0,
         //         // image: '../images/Cesium_Logo_overlay.png',
         //         // imageSubRegion: undefined,
         //         // color: Cesium.Color.WHITE,
         //         // rotation: 0.0,
         //         // alignedAxis: Cesium.Cartesian3.ZERO,
         //         // width: undefined,
         //         // height: undefined,
         //         // scaleByDistance: undefined,
         //         // translucencyByDistance: undefined,
         //         // pixelOffsetScaleByDistance: undefined,
         //         // sizeInMeters: false,
         //         // distanceDisplayCondition: undefined
         //     }
         // });
         // return billboards; */
    }

    // return this;
}

var clickButton = document.getElementById("jiance");
var jiance_bool = false;
var positions = [];
var position1 = Cesium.Cartesian3.fromDegrees(108.0744619, 34.0503706);
var position2 = Cesium.Cartesian3.fromDegrees(108.0764619, 34.0503706);
var position3 = Cesium.Cartesian3.fromDegrees(108.0784619, 34.0503706);
positions.push(position1);
positions.push(position2);
positions.push(position3);
if (clickButton) {

    clickButton.onclick = function () {
        debugger;
        if (jiance_bool) {//当前已经开启了监测点查看功能，关闭，然后退出；否则开启
            newMonitore.hideEntities();
            jiance_bool = false;
            return;
        }
        if (!flagMonitor) {
            newMonitore = new monitore(positions);
            let id = newMonitore.ids[0];
            addEntity = newMonitore.get_addEntity(id);
            flagMonitor = true;
            if (addEntity) {
                viewer.zoomTo(addEntity, new Cesium.HeadingPitchRange(0, -0.8, 800));
            } else { }
        } else {
            newMonitore.displayEntities();
            if (addEntity) {
                viewer.zoomTo(addEntity, new Cesium.HeadingPitchRange(0, -0.8, 800));
            }
        }
        jiance_bool = true;
    }
}