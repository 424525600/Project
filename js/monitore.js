// import { Z_BLOCK } from "zlib";

//监测点
var flagMonitor = false;
var newMonitore;
var addEntity;
var jiance_bool = false;
var jiancedian_infoDiv = ""

var positions = [];
var array_status = [];
var jiancedian_info = [
    { name: "监测点1", position: { longtitude: 108.0744619, latitude: 34.0503706 }, status: "red" },
    { name: "监测点2", position: { longtitude: 108.0864619, latitude: 34.0503706 }, status: "yellow" },
    { name: "监测点3", position: { longtitude: 108.0984619, latitude: 34.0503706 }, status: "orange" }
];
for (let i = 0; i < jiancedian_info.length; i++) {
    let position = Cesium.Cartesian3.fromDegrees(jiancedian_info[i].position.longtitude,jiancedian_info[i].position.latitude);
    positions.push(position);
    array_status.push(jiancedian_info[i].status);
}
var jiancedianTreeNodes = [
    {
        id: 1,
        url: "",
        open: true,
        layer3dtype: "yujin",
        name: "黄色预警",
        caption: "yujin01",
        visible: false,
        children:
            [
                {
                    id: 1 - 1,
                    pId: 1,
                    name: "监测点1",
                    pst: { longtitude: 108.0744619, latitude: 34.0503706 },
                    isChild: true,
                    status: "yellow"
                },
                {
                    id: 1 - 2,
                    pId: 1,
                    name: "监测点2",
                    pst: { longtitude: 108.0764619, latitude: 34.0503706 },
                    isChild: true,
                    status: "yellow"
                },
                {
                    id: 1 - 3,
                    pId: 1,
                    name: "监测点3",
                    pst: { longtitude: 108.0784619, latitude: 34.0503706 },
                    isChild: true,
                    status: "yellow"
                }
            ]
    }, {
        id: 2,
        url: "",
        open: true,
        layer3dtype: "ImageFileLayer",
        name: "橙色预警",
        caption: "yujin02",
        visible: false,
        children:
            [
                {
                    id: 2 - 1,
                    pId: 2,
                    name: "监测点4",
                    pst: { longtitude: 108.0748619, latitude: 34.0403706 },
                    isChild: true,
                    status: "orange"
                },
                {
                    id: 2 - 2,
                    pId: 2,
                    name: "监测点5",
                    pst: { longtitude: 108.0768619, latitude: 34.0403706 },
                    isChild: true,
                    status: "orange"
                },
                {
                    id: 2 - 3,
                    pId: 2,
                    name: "监测点6",
                    pst: { longtitude: 108.0788619, latitude: 34.0403706 },
                    isChild: true,
                    status: "orange"
                }
            ]
    }, {
        id: 3,
        url: "",
        open: true,
        layer3dtype: "ImageFileLayer",
        name: "红色预警",
        caption: "yujin03",
        visible: false,
        children:
            [
                {
                    id: 3 - 1,
                    pId: 3,
                    name: "监测点7",
                    pst: { longtitude: 108.0748619, latitude: 34.0403706 },
                    isChild: true,
                    status: "orange"
                },
                {
                    id: 3 - 2,
                    pId: 3,
                    name: "监测点8",
                    pst: { longtitude: 108.0768619, latitude: 34.0403706 },
                    isChild: true,
                    status: "orange"
                },
                {
                    id: 3 - 3,
                    pId: 3,
                    name: "监测点9",
                    pst: { longtitude: 108.0788619, latitude: 34.0403706 },
                    isChild: true,
                    status: "orange"
                }
            ]
    }
]



function monitore(jiancedian_info) {
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
        let addEntity = addBillboard(undefined, i, positions[i], array_status[i]);
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
    function addBillboard(billboards, id, position, status) {
        if (!Cesium.defined(billboards)) {
            // Create a billboard collection with two billboards
            var billboards = viewer.entities.add(new Cesium.BillboardCollection());
        }
        let imgUrl = 'images/Cesium_Logo_Color_Overlay.png';
        switch (status) {
            case "red":
                imgUrl = 'images/img/red-warning.png';
                break;
            case "orange":
                imgUrl = 'images/img/orange-warning.png';
                break;
            case "yellow":
                imgUrl = 'images/img/yellow-warning.png';
                break;
        }
        var addEntity = viewer.entities.add({
            name: '' + id + "号监测点",
            position: position,
            billboard: {
                id: id,
                show: true,
                scale: 1.0,
                sizeInMeters: true,
                image: imgUrl,
                distanceDisplayCondition: 3000
            }
        });
        var billboard = addEntity.billboard;
        billboard._blinkInterval = setInterval(function(){
            if(billboard.show==false){
                billboard.show=true;
            }else{
                billboard.show=false;
            }
        },250);
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

    this.showMonitore = function () {
        if (document.getElementById("monitore")) {
            // alert("popupWin");
            if ($("#monitore").is(':visible')) {
                $("#monitore").hide(500);
                $("#popupWin").show(500);//显示图层控制
                return;
            } else {
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

    this.createMonitoreList = function (jiancedian_info) {
        var monitoreInfos = jiancedian_info;
        var setting = {
            view: {
                dblClickExpand: false,
                showLine: false,
                showIcon: false,
                selectedMulti: false
            },
            edit: {
                enable: true,
                showRenameBtn: false,
                showRemoveBtn: false//setRemoveBtn
            },
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onCheck: zTreeOnCheck,
                onClick: zTreeOnClick,
            }
        };

        //监测点 单击实现定位
        function zTreeOnClick(event, treeId, treeNode) {
            if (!treeNode.isChild)
                return;
            var position = treeNode.pst;
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(position.longtitude, position.latitude, 500.0)
            });
            if (false) {
                //update
            } else {
                //show
                $("#monitore").hide();//隐藏列表
                $("#jiancedian_infoDiv").css("display","block");
            }
        }
        $.fn.zTree.init($("#treeMointoreList"), setting, jiancedianTreeNodes);

    }
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
newMonitore.createMonitoreList(jiancedian_info);

//下拉选项框
var xialakuang = $(".xialaan");
    var right_select = $(".right_select");
    var xiala_div = $(".xiala_div")
    for (var i = 0; i < xialakuang.length; i++) {
      xialakuang[i].index = i;
      var onOff = true;
      var This = i;
      xialakuang[i].onclick = function () {
        if (onOff) {
          for (var j = 0; j < xiala_div.length; j++) {
            if (this.index == j) {
              xiala_div[j].style.display = 'block';
              var xiala_input = xiala_div[j].getElementsByClassName("xiala_input");
              if (j == 0) {
                for (var k = 0; k < xiala_input.length; k++) {
                  xiala_input[k].index = k;
                  xiala_input[k].onclick = function () {
                    var value = xiala_input[this.index].value;
                    right_select[0].value = value;
                    $(".xiala_div").css("display", "none")
                  }
                }
              }
              if (j == 1) {
                for (var k = 0; k < xiala_input.length; k++) {
                  xiala_input[k].index = k;
                  xiala_input[k].onclick = function () {
                    var value = xiala_input[this.index].value;
                    right_select[1].value = value;
                    $(".xiala_div").css("display", "none")
                  }
                }
              }
              if (j == 2) {
                for (var k = 0; k < xiala_input.length; k++) {
                  xiala_input[k].index = k;
                  xiala_input[k].onclick = function () {
                    var value = xiala_input[this.index].value;
                    right_select[2].value = value;
                    $(".xiala_div").css("display", "none")
                  }
                }
              }
            } else {
              xiala_div[j].style.display = 'none';
            }
          }
        } else {
          $(".xiala_div").css("display", "none")
        }
        onOff = !onOff
      }
    }
    for (var i = 0; i < right_select.length; i++) {
      right_select[i].index = i;
      var onOff = true;
      var This = i;
      right_select[i].onclick = function () {
        if (onOff) {
          for (var j = 0; j < xiala_div.length; j++) {
            if (this.index == j) {
              xiala_div[j].style.display = 'block';
              var xiala_input = xiala_div[j].getElementsByClassName("xiala_input");
              if (j == 0) {
                for (var k = 0; k < xiala_input.length; k++) {
                  xiala_input[k].index = k;
                  xiala_input[k].onclick = function () {
                    var value = xiala_input[this.index].value;
                    right_select[0].value = value;
                    $(".xiala_div").css("display", "none")
                  }
                }
              }
              if (j == 1) {
                for (var k = 0; k < xiala_input.length; k++) {
                  xiala_input[k].index = k;
                  xiala_input[k].onclick = function () {
                    var value = xiala_input[this.index].value;
                    right_select[1].value = value;
                    $(".xiala_div").css("display", "none")
                  }
                }
              }
              if (j == 2) {
                for (var k = 0; k < xiala_input.length; k++) {
                  xiala_input[k].index = k;
                  xiala_input[k].onclick = function () {
                    var value = xiala_input[this.index].value;
                    right_select[2].value = value;
                    $(".xiala_div").css("display", "none")
                  }
                }
              }
            } else {
              xiala_div[j].style.display = 'none';
            }
          }
        } else {
          $(".xiala_div").css("display", "none")
        }
        onOff = !onOff
      }
    }
    $("#edit").click(function(){
        var edit_text = $(".edit_text");
        if(edit_text[0].readOnly == true){
            for (var i = 0; i < edit_text.length; i++) {
                edit_text[i].readOnly=false;
            }
        }else{
            for (var i = 0; i < edit_text.length; i++) {
                edit_text[i].readOnly=true;
            }
        }        
    });

    $("#jiancedian_infoClose").click(function(){
        $("#jiancedian_infoDiv").hide();
        // if(document.getElementById("monitore").display == "none"){
            $("#monitore").show();
        // }        
    });
    //  let imgUrl = 'images/Cesium_Logo_Color_Overlay.png';
    //  let position =positions[0];debugger;
    // var addEntity = viewer.entities.add({
    //     name: "1号监测点",
    //     position: position,
    //     billboard: {
    //         id: "id",
    //         show: true,
    //         // scale: 1.0,
    //         // sizeInMeters: true,
    //         image: imgUrl,
    //         distanceDisplayCondition: 3000
    //     }
    // });