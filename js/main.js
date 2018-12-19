// 主程序
var viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,//是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,//是否显示图层选择器    
    fullscreenButton: false,//是否显示全屏按钮    
    geocoder: false,//是否显示geocoder小器件，右上角查询按钮    
    homeButton: false,//是否显示Home按钮    
    infoBox: false,//是否显示信息框    
    sceneModePicker: false,//是否显示3D/2D选择器    
    selectionIndicator: false,//是否显示选取指示器组件    
    timeline: false,//是否显示时间轴    
    navigationHelpButton: false,//是否显示右上角的帮助按钮    
    scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源    
    clock: new Cesium.Clock(),//用于控制当前时间的时钟对象    
    selectedImageryProviderViewModel: undefined,//当前图像图层的显示模型，仅baseLayerPicker设为true有意义    
    imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(),//可供BaseLayerPicker选择的图像图层ProviderViewModel数组    
    selectedTerrainProviderViewModel: undefined,//当前地形图层的显示模型，仅baseLayerPicker设为true有意义    
    terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(),//可供BaseLayerPicker选择的地形图层ProviderViewModel数组    
    // imageryProvider: new Cesium.OpenStreetMapImageryProvider({
    // 	credit: '',
    // 	url: '//192.168.0.89:5539/planet-satellite/'
    // }),//图像图层提供者，仅baseLayerPicker设为false有意义
    // terrainProvider: Cesium.createWorldTerrain(),
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),//地形图层提供者，仅baseLayerPicker设为false有意义    
    // skyBox: new Cesium.SkyBox({
    // 	sources: {
    // 		positiveX: 'Cesium-1.7.1/Skybox/px.jpg',
    // 		negativeX: 'Cesium-1.7.1/Skybox/mx.jpg',
    // 		positiveY: 'Cesium-1.7.1/Skybox/py.jpg',
    // 		negativeY: 'Cesium-1.7.1/Skybox/my.jpg',
    // 		positiveZ: 'Cesium-1.7.1/Skybox/pz.jpg',
    // 		negativeZ: 'Cesium-1.7.1/Skybox/mz.jpg'
    // 	}
    // }),//用于渲染星空的SkyBox对象    
    fullscreenElement: document.body,//全屏时渲染的HTML元素,    
    useDefaultRenderLoop: true,//如果需要控制渲染循环，则设为true    
    targetFrameRate: undefined,//使用默认render loop时的帧率    
    showRenderLoopErrors: false,//如果设为true，将在一个HTML面板中显示错误信息    
    automaticallyTrackDataSourceClocks: true,//自动追踪最近添加的数据源的时钟设置    
    contextOptions: undefined,//传递给Scene对象的上下文参数（scene.options）    
    sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式    
    mapProjection: new Cesium.WebMercatorProjection(),//地图投影体系    
    dataSources: new Cesium.DataSourceCollection()
});
viewer.extend(Cesium.viewerCesiumNavigationMixin, {});
viewer._cesiumWidget._creditContainer.style.display = "none";
var scene = viewer.scene;
var globe = viewer.scene.globe;

var viewModel = {
    debugBoundingVolumesEnabled : false,
    showPlane : true,
    edgeStylingEnabled : true
};
var rectangle = new Cesium.Rectangle(Cesium.Math.toRadians(-180),Cesium.Math.toRadians(-80),
Cesium.Math.toRadians(180),Cesium.Math.toRadians(80));
var imagelayer = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
    url: 'http://localhost:9002/api/wmts/gettile/72ce4faf5e9e4671a69794da69e8d6a3/{z}/{x}/{y}',
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    minimumLevel: 1,
    rectangle:  rectangle,
    maximumLevel: 18,
    credit: 'http://www.bjxbsj.cn',
}), {
    show: true
});
viewer.imageryLayers.add(imagelayer);
viewer.scene.camera.flyTo({destination: rectangle});
/* // 指北针
document.getElementById("btnCompass").onclick= function(){
    reduceCompass();
};
document.getElementById("btnCompass").ondblclick= function(){
    reduceCompass2();
}; */




