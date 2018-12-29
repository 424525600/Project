/* 
//预警点点值，超过区间分别显示黄、橙、红色预警
pointJson = [{id,type,val,status,name,company,longtitude,latitude},
    {id,type,val,status,name,company,longtitude,latitude},...]
*/
var pointJson=[
    {"id":123,"type":123,"val":123,"status":123,"name":123,"company":123,"longtitude":123,"latitude":123},
    {"id":123,"type":123,"val":123,"status":123,"name":123,"company":123,"longtitude":123,"latitude":123}
];
var warningPrimitivesYellow = new Cesium.PrimitiveCollection();
var warningPrimitivesOrange = new Cesium.PrimitiveCollection();
var warningPrimitivesRed = new Cesium.PrimitiveCollection();
var attributesYellow =[];
var attributesOrange =[];
var attributesRed =[];
var yuJinYuZhi1 = 5;
var yuJinYuZhi2 = 8;
var yuJinYuZhi3 = 10;
var warningPoint = function(pointJson){
    if(!Cesium.defined(viewer)){
        return;
    }
    let lengthP = pointJson.length;
    for(let i=0;i<lengthP;i++){
        let longtitude = pointJson[i].longtitude;
        let latitude = pointJson[i].latitude;
        let id = pointJson[i].id;
        let tempInstance = createInstance(viewer,longtitude,latitude,id);
        if(pointJson[i].val < yuJinYuZhi1){
            break;
        }else if(pointJson[i].val >= yuJinYuZhi1 && pointJson[i].val < yuJinYuZhi2){
            warningPrimitivesYellow.add(tempInstance);
            let attributes= tempInstance.getGeometryInstanceAttributes(id);//获取某个实例的属性集
            attributesYellow.push(attributes);
        }else if(pointJson[i].val >= yuJinYuZhi2 && pointJson[i].val < yuJinYuZhi3 ){
            warningPrimitivesOrange.add(tempInstance);
            let attributes= tempInstance.getGeometryInstanceAttributes(id);//获取某个实例的属性集
            attributesOrange.push(attributes);
        }else if(pointJson[i].val >= yuJinYuZhi3){
            warningPrimitivesRed.add(tempInstance);
            let attributes= tempInstance.getGeometryInstanceAttributes(id);//获取某个实例的属性集
            attributesRed.push(attributes);
        }
    }

    //定期修改颜色
    setInterval(function (attributesYellow,attributesOrange,attributesRed) {
        for(let i=0;i<attributesYellow.length;i++){
            attributesYellow[i].color = Cesium.ColorGeometryInstanceAttribute.toValue(
                Cesium.Color.fromRandom({
                    red:1.0,
                    green:1.0,
                    maximumBlue:0.1,
                    maximumAlpha:1.0,
                    minimumAlpha:0.2
                }));
        };
        for(let i=0;i<attributesYellow.length;i++){
            attributesOrange[i].color = Cesium.ColorGeometryInstanceAttribute.toValue(
                Cesium.Color.fromRandom({
                    red:1.0,
                    blue:1.0,
                    maximumBlue:0.1,
                    maximumAlpha:1.0,
                    minimumAlpha:0.2
                }));
        };
        for(let i=0;i<attributesYellow.length;i++){
            attributesRed[i].color = Cesium.ColorGeometryInstanceAttribute.toValue(
                Cesium.Color.fromRandom({
                    red:1.0,
                    maximumGreen:0,
                    maximumBlue:0.1,
                    maximumAlpha:1.0,
                    minimumAlpha:0.2
                }));
        };
    }, 2000);
}

    /* //创建新几何实体
    function createInstance(viewer,longtitude,latitude,id){
        let instanceId = 'circle_'+ id;
        // 更新单个GeometryInstance的属性
        var circleInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.CircleGeometry({
                center: Cesium.Cartesian3.fromDegrees(longtitude, latitude),
                radius: 25.0,
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    new Cesium.Color(1.0, 0.0, 0.0, 0.5)),
                show: new Cesium.ShowGeometryInstanceAttribute(true) //显示或者隐藏
            },
            id: instanceId
        });
        var primitive = new Cesium.Primitive({
            geometryInstances: circleInstance,
            appearance: new Cesium.PerInstanceColorAppearance({
                translucent: false,
                closed: true
            })
        });
        viewer.scene.primitives.add(primitive);
        return primitive;
    }
}
// 更新单个GeometryInstance的属性
var circleInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.CircleGeometry({
        center: Cesium.Cartesian3.fromDegrees(107.20, 30.55),
        radius: 25000.0,
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
setInterval(function() {
    //获取某个实例的属性集
    var attributes = primitive.getGeometryInstanceAttributes('circle');
    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
        Cesium.Color.fromRandom({
            red:1.0,
            maximumGreen:0,
            maximumBlue:0.1,
            maximumAlpha:1.0,
            minimumAlpha:0.2
        }));
}, 2000); */