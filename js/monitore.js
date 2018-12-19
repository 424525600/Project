//风险点监控
var flagMonitor = false;
var newMonitore;
var addEntity;
var jiance_bool = false;
var positions = [];
var position1 = Cesium.Cartesian3.fromDegrees(108.0744619, 34.0503706);
var position2 = Cesium.Cartesian3.fromDegrees(108.0864619, 34.0503706);
var position3 = Cesium.Cartesian3.fromDegrees(108.0984619, 34.0503706);
positions.push(position1);
positions.push(position2);
positions.push(position3);
var infos=[
    {name:"监测点1",position:{longtitude:108.0744619, latitude:34.0503706}},
    {name:"监测点2",position:{longtitude:108.0864619, latitude:34.0503706}},
    {name:"监测点3",position:{longtitude:108.0984619, latitude:34.0503706}}
];

function monitore(infos) {
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
        /*  billboards.add({
             name : '检测点'+id,    
             position: position,
             billboard: {
                 id: id,
                 show: true,
                 position: position,
                 scale: 1.0,
                 sizeInMeters: true,
                 image: './images/Cesium_Logo_overlay.png'
                 // position: Cesium.Cartesian3.ZERO,
                 // pixelOffset: Cesium.Cartesian2.ZERO,
                 // eyeOffset: Cesium.Cartesian3.ZERO,
                 // heightReference: Cesium.HeightReference.NONE,
                 // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                 // verticalOrigin: Cesium.VerticalOrigin.CENTER,
                 // scale: 1.0,
                 // image: '../images/Cesium_Logo_overlay.png',
                 // imageSubRegion: undefined,
                 // color: Cesium.Color.WHITE,
                 // rotation: 0.0,
                 // alignedAxis: Cesium.Cartesian3.ZERO,
                 // width: undefined,
                 // height: undefined,
                 // scaleByDistance: undefined,
                 // translucencyByDistance: undefined,
                 // pixelOffsetScaleByDistance: undefined,
                 // sizeInMeters: false,
                 // distanceDisplayCondition: undefined
             }
         });
         return billboards; */
    }

    this.showMonitore = function() {
        if (document.getElementById("monitore")) {
            // alert("popupWin");
            if($("#monitore").is(':visible')){
                $("#monitore").hide(500);
                $("#popupWin").show(500);//显示图层控制
                return;
            }else{
                $("#popupWin").hide(500);//隐藏图层控制
                $("#monitore").show(500);
                return;
            }
        } else {
            $("<div id='monitore'></div>").addClass("monitore").appendTo($("#cesiumContainer"));
            // $("#monitore").css("display", "block");
            var str = "";
            str += '<div class="winTitle" style="position: absolute;left: 10px;top: 50px;background-color: rgb(147,147,147,0.5);border-radius: 5px;">' +
                '<span class="title_left">监测点</span>' +
                '<br style="clear:right"/>';


            str += '<div class="winContent" style="overflow-y:auto;height:auto;">';
            str += '<ul id="treeMointoreList" class="ztree"></ul>';
            str += '</div></div>';
            $("#monitore").html(str);
            $("#popupWin").hide(500);//隐藏图层控制
        }
        
    }
    
    this.createMonitoreList = function (infos) {
        var monitoreInfos = infos;
        var setting = {
            view : {
                dblClickExpand : false,
                showLine : false,
                showIcon : false,
                selectedMulti : false
            	},
            edit: {
                enable: true,
                showRenameBtn:false,
                showRemoveBtn: false//setRemoveBtn
            },
            check : {
                enable : true
            },
            data : {
                simpleData : {
                    enable : true
                }
            },
            callback : {
                onCheck : zTreeOnCheck,
                onClick : zTreeOnClick,
            }
        };

        //监测点 单击实现定位
        function zTreeOnClick(event, treeId, treeNode) {
            var position =treeNode.position;
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(position.longtitude, position.latitude, 500.0)
            });
        }

        if (monitoreInfos) {
            {
                var treeNodes = [];// 清空
                var rnode1 = {};
                rnode1.id = 0;
                rnode1.name = "BIM";
                rnode1.open = true;
                rnode1.checked = false;
                rnode1.isChild = false;
                rnode1.chkDisabled=true;
                treeNodes.push(rnode1);
            
                var length = monitoreInfos.length;
                for (var i = 0; i < length; i++) {
                    var node = {};
                    node.id = i + 4;
                    node.pId = 0;
                    node.name = monitoreInfos[i].name;
                    node.position = monitoreInfos[i].position;
                    node.isChild = true;
                    if(node&&node.id){
                        treeNodes.push(node);
                    }
                };
                
                $.fn.zTree.init($("#treeMointoreList"), setting, treeNodes);
            }
        }
    }
    
    // return this;
}
//先创建节点，然后再绑定树
$("<div id='monitore'></div>").addClass("monitore").appendTo($("#cesiumContainer"));
// $("#monitore").css("display", "block");
var str = "";
str += '<div class="winTitle" style="position: absolute;left: 10px;top: 50px;background-color: rgb(147,147,147,0.5);border-radius: 5px;">' +
    '<span class="title_left">监测点</span>' +
    '<br style="clear:right"/>';


str += '<div class="winContent" style="overflow-y:auto;height:auto;">';
str += '<ul id="treeMointoreList" class="ztree"></ul>';
str += '</div></div>';
$("#monitore").html(str);
$("#monitore").hide();//初始化隐藏
newMonitore = new monitore(positions);
newMonitore.createMonitoreList(infos);

// 更新单个GeometryInstance的属性
  var circleInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.CircleGeometry({
                center: Cesium.Cartesian3.fromDegrees(107.20, 30.55),
                radius: 250000.0,
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                new Cesium.Color(1.0, 0.0, 0.0, 0.5)),
                show: new Cesium.ShowGeometryInstanceAttribute(true) //显示或者隐藏
            },
            id: 'circle'
        });
        var primitive = new Cesium.Primitive({
            geometryInstances: circleInstance,
            appearance: new Cesium.PerInstanceColorAppearance({
                translucent: false,
                closed: true
            })
        });
        viewer.scene.primitives.add(primitive);
        //定期修改颜色
        setInterval(function () {
            //获取某个实例的属性集
            var attributes = primitive.getGeometryInstanceAttributes('circle');
            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
            Cesium.Color.fromRandom({
                alpha: 1.0
            }));
        }, 2000);