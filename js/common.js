// 通用工具
// 

// start------------------------------------------------------------------------------
// 解决Cesium1.50对gltf2.0/3dtiles数据读取的问题，在加载cesium.js后写入这段代码
// 原理参见 https://www.jianshu.com/p/e0e0a62c5726
var fixGltf = function(gltf) {
    if (!gltf.extensionsUsed) {
        return;
    }

    var v = gltf.extensionsUsed.indexOf('KHR_technique_webgl');
    var t = gltf.extensionsRequired.indexOf('KHR_technique_webgl');
    // 中招了。。
    if (v !== -1) {
        gltf.extensionsRequired.splice(t, 1, 'KHR_techniques_webgl');
        gltf.extensionsUsed.splice(v, 1, 'KHR_techniques_webgl');
        gltf.extensions = gltf.extensions || {};
        gltf.extensions['KHR_techniques_webgl'] = {};
        gltf.extensions['KHR_techniques_webgl'].programs = gltf.programs;
        gltf.extensions['KHR_techniques_webgl'].shaders = gltf.shaders;
        gltf.extensions['KHR_techniques_webgl'].techniques = gltf.techniques;
        var techniques = gltf.extensions['KHR_techniques_webgl'].techniques;

        gltf.materials.forEach(function (mat, index) {
            gltf.materials[index].extensions['KHR_technique_webgl'].values = gltf.materials[index].values;
            gltf.materials[index].extensions['KHR_techniques_webgl'] = gltf.materials[index].extensions['KHR_technique_webgl'];

            var vtxfMaterialExtension = gltf.materials[index].extensions['KHR_techniques_webgl'];

            for (var value in vtxfMaterialExtension.values) {
                var us = techniques[vtxfMaterialExtension.technique].uniforms;
                for (var key in us) {
                    if (us[key] === value) {
                        vtxfMaterialExtension.values[key] = vtxfMaterialExtension.values[value];
                        delete vtxfMaterialExtension.values[value];
                        break;
                    }
                }
            };
        });

        techniques.forEach(function (t) {
            for (var attribute in t.attributes) {
                var name = t.attributes[attribute];
                t.attributes[attribute] = t.parameters[name];
            };

            for (var uniform in t.uniforms) {
                var name = t.uniforms[uniform];
                t.uniforms[uniform] = t.parameters[name];
            };
        });
    }
}
Object.defineProperties(Cesium.Model.prototype, {
    _cachedGltf: {
        set: function (value) {
            this._vtxf_cachedGltf = value;
            if (this._vtxf_cachedGltf && this._vtxf_cachedGltf._gltf) {
                fixGltf(this._vtxf_cachedGltf._gltf);
            }
        },
        get: function () {
            return this._vtxf_cachedGltf;
        }
    }
});
// end ------------------------------------------------------------------------------

//重置，恢复初始
function reset() {
    debugger;
    viewer.entities.removeAll();
    viewer.scene.primitives.remove(tileset);
    planeEntities = [];
    targetY = 0.0;
    tileset = undefined;
    // globe.clippingPlanes=[];
}

scene.postRender.addEventListener(function() {
    var heading = scene.camera.heading;
    var x = -Cesium.Math.toDegrees(heading);
    var degrees = "rotate(" + x + "deg)";
    $("#compass").css("transform", degrees);
});

//			恢复指北方向
function reduceCompass() {
    $("#compass").css("transform", "rotate(0deg)");
    Camera.lookAt
    scene.camera.flyTo({
        destination: scene.camera.position,
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45)
        }
    });
}
//			正上空俯视
function reduceCompass2() {
    $("#compass").css("transform", "rotate(0deg)");
    scene.camera.flyTo({
        destination: scene.camera.position,
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90)
        }
    });
}




// 设置视角的位置和方位
// Cartesian 方式确定位置
function mySetView(longtitude, latitude, height, heading, pitch, roll) {
    viewer.camera.setView({
        // destination :  Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 400.0), // 设置位置
        destination: Cesium.Cartesian3.fromDegrees(longtitude, latitude, height), // 设置位置
        orientation: {
            heading: heading ? heading : Cesium.Math.toRadians(0.0), // 方向
            pitch: pitch ? pitch : Cesium.Math.toRadians(0.0),// 倾斜角度
            roll: roll ? roll : 0
        }
    });
}

// rectangle 方式
function mySetViewRectangle(longtitude1, latitude1, longtitude2, latitude2, heading, pitch, roll) {
    viewer.camera.setView({
        // destination: Cesium.Rectangle.fromDegrees(0.0, 20.0, 10.0, 30.0),
        destination: Cesium.Rectangle.fromDegrees(longtitude1, latitude1, longtitude2, latitude2),
        orientation: {
            heading: heading ? heading : Cesium.Math.toRadians(0.0), // 方向
            pitch: pitch ? pitch : Cesium.Math.toRadians(0.0),// 倾斜角度
            roll: roll ? roll : 0
        }
    });
}

function myFlyTo(longtitude, latitude, height, heading, pitch, roll) {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longtitude, latitude, height), // 设置位置
        orientation: {
            heading: heading ? heading : Cesium.Math.toRadians(0.0), // 方向
            pitch: pitch ? pitch : Cesium.Math.toRadians(0.0),// 倾斜角度
            roll: roll ? roll : 0
        },
        duration: 5, // 设置飞行持续时间，默认会根据距离来计算
        complete: function () {
            // 到达位置后执行的回调函数
            console.log('到达目的地');
        },
        cancle: function () {
            // 如果取消飞行则会调用此函数
            console.log('飞行取消')
        },
        pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
        maximumHeight: 5000, // 相机最大飞行高度
        // flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度
    });
}


/* 笔记
var viewer = new Cesium.Viewer('cesiumDemo',{
        baseLayerPicker: false,
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        })
    });

    var scene = viewer.scene;
    var canvas = viewer.canvas; // 获取画布
    canvas.setAttribute('tabindex', '0'); // 获取焦点
    canvas.onclick = function() {
        canvas.focus();
    };
    var ellipsoid = viewer.scene.globe.ellipsoid; // 获取地球球体对象

    // 禁用默认的事件处理程序
    // 如果为真，则允许用户旋转相机。如果为假，相机将锁定到当前标题。此标志仅适用于2D和3D。
    scene.screenSpaceCameraController.enableRotate = false;
    // 如果为true，则允许用户平移地图。如果为假，相机将保持锁定在当前位置。此标志仅适用于2D和Columbus视图模式。
    scene.screenSpaceCameraController.enableTranslate = false;
    // 如果为真，允许用户放大和缩小。如果为假，相机将锁定到距离椭圆体的当前距离
    scene.screenSpaceCameraController.enableZoom = false;
    // 如果为真，则允许用户倾斜相机。如果为假，相机将锁定到当前标题。这个标志只适用于3D和哥伦布视图。
    scene.screenSpaceCameraController.enableTilt = false;
    // 如果为true，则允许用户使用免费外观。如果错误，摄像机视图方向只能通过转换或旋转进行更改。此标志仅适用于3D和哥伦布视图模式。
    scene.screenSpaceCameraController.enableLook = false;

    // 鼠标开始位置
    var startMousePosition;
    // 鼠标位置
    var mousePosition;
    // 鼠标状态标志
    var flags = {
        looking : false,
        moveForward : false, // 向前
        moveBackward : false, // 向后
        moveUp : false,// 向上
        moveDown : false,// 向下
        moveLeft : false,// 向左
        moveRight : false// 向右
    };

    var handler = new Cesium.ScreenSpaceEventHandler(canvas);

    // 接收用户鼠标（手势）事件
    handler.setInputAction(function(movement) {
        // 处理鼠标按下事件
        // movement: 接收值为一个对象，含有鼠标单击的x，y坐标
        flags.looking = true;
        // 设置鼠标当前位置
        mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(function(movement) {
        // 处理鼠标移动事件
        // 更新鼠标位置
        mousePosition = movement.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function(position) {
        // 处理鼠标左键弹起事件
        flags.looking = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    // 根据键盘按键返回标志
    function getFlagForKeyCode(keyCode) {
        switch (keyCode) {
            case 'W'.charCodeAt(0):
                return 'moveForward';
            case 'S'.charCodeAt(0):
                return 'moveBackward';
            case 'Q'.charCodeAt(0):
                return 'moveUp';
            case 'E'.charCodeAt(0):
                return 'moveDown';
            case 'D'.charCodeAt(0):
                return 'moveRight';
            case 'A'.charCodeAt(0):
                return 'moveLeft';
            default:
                return undefined;
        }
    }
    // 监听键盘按下事件
    document.addEventListener('keydown', function(e) {
        // 获取键盘返回的标志
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== 'undefined') {
            flags[flagName] = true;
        }
    }, false);

    // 监听键盘弹起时间
    document.addEventListener('keyup', function(e) {
        // 获取键盘返回的标志
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== 'undefined') {
            flags[flagName] = false;
        }
    }, false);

    // 对onTick事件进行监听
    // onTick事件：根据当前配置选项，从当前时间提前计时。应该每个帧都调用tick，而不管动画是否发生。
    // 简单的说就是每过一帧都会执行这个事件
    viewer.clock.onTick.addEventListener(function(clock) {
        // 获取实例的相机对象
        var camera = viewer.camera;

        if (flags.looking) {
            // 获取画布的宽度
            var width = canvas.clientWidth;
            // 获取画布的高度
            var height = canvas.clientHeight;

            // Coordinate (0.0, 0.0) will be where the mouse was clicked.
            var x = (mousePosition.x - startMousePosition.x) / width;
            var y = -(mousePosition.y - startMousePosition.y) / height;
            var lookFactor = 0.05;

            camera.lookRight(x * lookFactor);
            camera.lookUp(y * lookFactor);
        }

        // 获取相机高度
        // cartesianToCartographic(): 将笛卡尔坐标转化为地图坐标，方法返回Cartographic对象，包含经度、纬度、高度
        var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;

        var moveRate = cameraHeight / 100.0;

        // 如果按下键盘就移动
        if (flags.moveForward) {
            camera.moveForward(moveRate);
        }
        if (flags.moveBackward) {
            camera.moveBackward(moveRate);
        }
        if (flags.moveUp) {
            camera.moveUp(moveRate);
        }
        if (flags.moveDown) {
            camera.moveDown(moveRate);
        }
        if (flags.moveLeft) {
            camera.moveLeft(moveRate);
        }
        if (flags.moveRight) {
            camera.moveRight(moveRate);
        }
    });

*/