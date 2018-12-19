/* //一： SingleTileImageryProvider  单张图片服务
var mapsingle = new Cesium.SingleTileImageryProvider({
    url: 'sampledata/images/globe.jpg'
}); */
//二： 多图层叠加
//天地图影像
var tdtImagerLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
    layer: "tiandituImg",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "tiandituImg",
    show: true,
    maximumLevel: 18
});
//天地图注记
var tdtNoteLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
    layer: "tiandituImgMarker",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "tiandituImgMarker",
    show: true,
    maximumLevel: 16
});
//三：GridImageryProvider
var GridImagery = new Cesium.GridImageryProvider();
//四：TileCoordinatesImageryProvider
// var TileCoordinatesImagery = new Cesium.TileCoordinatesImageryProvider();
var TileCoordinatesImagery = Cesium.createTileMapServiceImageryProvider({
    url: './maps/taile/tiles'
});
var imageryLayers = viewer.imageryLayers;
imageryLayers.removeAll();
// var tdtNoteLayer = imageryLayers.addImageryProvider(tdtNoteLayerProvider);//添加注记图层
// var GridImageryLayer = imageryLayers.addImageryProvider(GridImagery);//添加格网图层
// var tdtImagerLayer = imageryLayers.addImageryProvider(tdtImagerLayerProvider);
// var TileCoordinatesImageryLayer = imageryLayers.addImageryProvider(TileCoordinatesImagery);