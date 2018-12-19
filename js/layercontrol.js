// 图层控制

function getLayersInfoCompleted(getLayersInfoEventArgs) {
	
	if (getLayersInfoEventArgs) {
		{
			treeNodes = [];// 清空
			handleTreeData(getLayersInfoEventArgs);
			showWindow();
			$("#popupWin").css("display", "block");//初始化时隐藏图层控制

			$.fn.zTree.init($("#tree"), setting, treeNodes);
			zTree = $.fn.zTree.getZTreeObj("tree");
			rMenu = $("#rMenu");
			setLayerStatus();// 初始化的时候就要根据勾选来加载图层
		}
	}
	// createTempLayer();
}
// 图层组控制菜单的配置
var setting = {
	view : {
		dblClickExpand : false,
		showLine : false,
		showIcon : false,
		selectedMulti : false/*,
//		addHoverDom: addHoverDom, //当鼠标移动到节点上时，显示用户自定义控件
        removeHoverDom: removeHoverDom //离开节点时的操作
*/	},
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
			enable : true,
			idKey : "id",
			pIdKey : "pId",
			rootPId : "0"
		}
	},
	callback : {
		onRightClick: onRightClick,
		// onCheck : setLayerStatus,
		onCheck : zTreeOnCheck,
		onClick : zTreeOnClick,
		/*beforeRemove : beforeRemove,*/
		onRemove: onRemove //移除事件
	}
};
//设置所有的父节点不显示删除按钮
function setRemoveBtn(treeId, treeNode) {
//	dem 和dom都不能删除,只有osgb图层能删除
	if(treeNode.pId==1){
		return true;
	}else{
		return false;
	}
}
// 勾选显示或隐藏
function zTreeOnCheck(event, treeId, treeNode) {
	if(treeNode.layer3dtype == "3dtile"){
		if(treeNode.checked == true){//显示
			if (treeNode.tileset) {
				treeNode.tileset.setTilesetShowHide(true);
			}  else {
				//loadModel(treeNode.url);
			}
		}else{//隐藏
			if (treeNode.tileset) {
				treeNode.tileset.setTilesetShowHide(false);
			}
		}
	}else if(treeNode.layer3dtype == "ImageFileLayer"){
		if(treeNode.checked == true){//显示
			if (treeNode.tileset) {
				treeNode.tileset.show =true;
			}  else {
				var imagelayer;//ImageryLayerCollection中index越大，显示优先级越高
				switch (treeNode.url) {
					case "1":
						imagelayer = imageryLayers.addImageryProvider(tdtNoteLayerProvider,4);
						// 这里给定index没有作用，因为当图层数小于此数值时会赋予图层数而不是给定数
						break;
					case "2":
						imagelayer = imageryLayers.addImageryProvider(GridImagery,3);
						break;
					case "3":
						imagelayer = imageryLayers.addImageryProvider(tdtImagerLayerProvider, 2);
						imageryLayers.lowerToBottom(imagelayer);
						break;
					case "4":
						imagelayer = imageryLayers.addImageryProvider(TileCoordinatesImagery, 1);
						imageryLayers.lowerToBottom(imagelayer);
						break;
				}
				treeNode.tileset = imagelayer;
			}
		}else{//隐藏
			if (treeNode.tileset) {
				treeNode.tileset.show =false;
			}
		}
	}
	
	
};
function zTreeOnClick(event, treeId, treeNode) {// 单击触发图层透明度控制
	//当前图层已经加载过，不再加载，只定位
	if( Cesium.defined(treeNode.tileset)){
		treeNode.tileset.bindControl();
		viewer.zoomTo(treeNode.tileset.tileset, new Cesium.HeadingPitchRange(0.5, -0.2, 400));//高度暂时限定死
	}
	else{
		if (treeNode.layer3dtype == "3dtile" ) {
			// loadTileset(treeNode.url);
			var newTileSet  = new createTileset({url:treeNode.url});
			newTileSet.getTilesetShowHide();
			newTileSet.loadTileset(treeNode.url);
			treeNode.tileset = newTileSet;
			treeNode.tileset.bindControl();
		}  else if(treeNode.layer3dtype == "model"){
			loadModel(treeNode.url);
		} /* else if (treeNode.layer3dtype == "ImageFileLayer") {
			// loadModel(treeNode.url);
			alert("加载图层代码");影像在点击时没效果，打钩时加载就可以
		} */
	}
	if(!treeNode.checked){
		treeNode.check =true;
		treeNode.checked =true;
		zTree.updateNode(treeNode);//需要更新树
	}
};

var treeNodes = [];
var layerID = 0;
// 处理layers中的子图层信息为 ztree所需的数据格式
function handleTreeData(data) {
	var layers = data;
	var rnode1 = {};
	var rnode2 = {};
	var rnode3 = {};
	rnode1.id = 1;
	rnode1.pId = 0;
	rnode1.name = "BIM";
	rnode1.open = true;
	rnode1.checked = false;
	rnode1.isChild = false;
	rnode1.chkDisabled=true;
	treeNodes.push(rnode1);

	rnode2.id = 2;
	rnode2.pId = 0;
	rnode2.name = "影像";
	rnode2.open = true;
	rnode2.checked = false;
	rnode2.isChild = false;
	rnode2.chkDisabled=true;
	treeNodes.push(rnode2);

	rnode3.id = 3;
	rnode3.pId = 0;
	rnode3.name = "大类3";
	rnode3.open = true;
	rnode3.checked = false;
	rnode3.isChild = false;
	rnode3.chkDisabled=true;
	treeNodes.push(rnode3);

	var length = layers.length;
	for (var i = 0; i < length; i++) {
		var node = {};
		if (layers[i].layer3dtype == "3dtile") {
			node.id = i + 4;
			node.pId = 1;
			node.name = layers[i].name;
			node.url =layers[i].url;
			node.layer3dtype = layers[i].layer3dtype;
			node.dataSourceName=layers[i].datasourcename; //这里要指定，后续查询分析要用到
			node.dataSetName=layers[i].datasetname;  //这里要指定，后续查询分析要用到
			if (layers[i].visible|| layers[i].visible== "true") {
				node.checked = true;
			}
			node.isChild = true;
			node.layerID = 1 + "." + i;
			node.tileset = null;
			node.entity =null;
		} else if (layers[i].layer3dtype == "ImageFileLayer") {
			node.id = i + 4;
			node.pId = 2;
			node.name = layers[i].name;
			node.url =layers[i].url;
			node.layer3dtype = layers[i].layer3dtype;
			if (layers[i].visible|| layers[i].visible== "true") {
				node.checked = true;
			}
			node.isChild = true;
			node.layerID = 2 + "." + i;
			node.tileset = null;
			// node.entity =loadModel(modelUrl);
		} 
		if(node&&node.pId){
			treeNodes.push(node);
		}

	}
}

// 通过子图层layersID可见性控制
function setLayerStatus() {
	
	if(!arrayLayerNames) arrayLayerNames= [];// 图层名称数组置空
	if(!arrayLayerUrls) arrayLayerUrls= [];// 图层url数组置空
	zTree = $.fn.zTree.getZTreeObj("tree"), checkCount = zTree
			.getCheckedNodes(true);
	var notCheckCount = zTree.getCheckedNodes(false);
	
	var checkLength = checkCount.length;
	  //不用了是因为要url要换成后台配置好的
	for (var i = 0; i < checkLength; i++) {
		if (checkCount[i].isChild) {
			// setlayer(checkCount[i], true, checkCount[i].layer3dtype);
			//这里实现定位功能就好吧
			// viewer.zoomTo(checkCount[i].tileset, new Cesium.HeadingPitchRange(0.5, -0.2, 600));
			zTreeOnCheck(null,null,checkCount[i]);
		}
	}
	for (var i = 0; i < notCheckCount.length; i++) {
		if (notCheckCount[i].isChild) {
			//setlayer(notCheckCount[i], false, notCheckCount[i].layer3dtype);
		}
	}

}
/*
 * 设置图层的可见与隐藏，记录下name和url
 */
var arrayLayerNames;
var arrayLayerUrls;
function setlayer(node, isShow, layerType) {
//if(name=="qwer"){
//				console.log("name=qwer");
//				console.log(name, isShow, layerType);
//			}
	if (layerType == "3dtile") {
		if (arrayLayerNames.indexOf(node.name) < 0) {
			arrayLayerNames.push(node.name);
		}
		var url = node.url? node.url: arrayLayerUrls[arrayLayerNames.indexOf(node.name)];
		if (arrayLayerUrls.indexOf(url) < 0) {
			arrayLayerUrls.push(url);
		}

		// 获取三维图层
		
		var layer1 = scene.layers.find(node.name);
		if (layer1) {// 图层加载过
			if (layer1.visible == false && isShow)// 当前不显示且需要显示
				layer1.visible = true;
			else if (layer1.visible == true && !isShow)// 当前显示且需要不显示
				layer1.visible = false;
		} else if (isShow) {// 图层没有加载过，且需要显示

			var temp3D = scene.addS3MTilesLayerByScp(url, {
						name : node.name
					});
			// addModelbyUrl(url, name); //奇怪，跳过不执行方法中的then事件
			// 设置图层不可选择
			temp3D.then(function(layer) {
//				layer.visibleDistanceMax =800;  //设置模型显示最大高度，超过这个距离不加载
				// // 设置背景色透明
				// 		var backgroundcolor = Cesium.Color.fromRga(0, 0, 0);
				// 		layer.transperantBackColor = backgroundcolor;
				// 		layer.transperantBackColorTolerance = 24;
						console.log("成功添加图层");
						layer.selectEnabled = false;
						layer.visible = true;
						layer.cullEnabled = false;
						layer.setQueryParameter({// 设置查询参数
							url : serverurl,
							dataSourceName : node.dataSourceName,
							dataSetName : node.dataSetName,
							keyWord : 'SmID'
						});
//						获取或设置图层的LOD层级切换距离缩放系数。默认系数1，设置越小，在距离较大时仍有较高清晰度，同时浏览器也会占据较大内存
						layer.lodRangeScale = 0.9;
					});
		}
	} else if (layerType == "ImageFileLayer") {
		if (arrayLayerNames.indexOf(node.name) < 0) {
			arrayLayerNames.push(node.name);
		}
		var imageURL = node.url? node.url:arrayLayerUrls[arrayLayerNames.indexOf(node.name)];
		if (arrayLayerUrls.indexOf(imageURL) < 0) {
			arrayLayerUrls.push(imageURL);
		}
		// console.log("viewer.imageryLayers");
		// console.log(viewer.imageryLayers);
		// 获取二维图层
		var length_temp =  viewer.imageryLayers._layers.length;//不能直接写到for循环里，不然增加一个图层后，length增加，会陷入无限迭代循环
		for (var i = 0; i < length_temp; i++) {// 获取图层个数
			// viewer.imageryLayers._layers[0]是全球背景底图 ._layers["0"].show
			var imagelayer = viewer.imageryLayers._layers[i];
			if (!imagelayer._imageryProvider._name&&i !=length_temp-1){//不存在name字段，说明是默认加载的全球背景底图image
				continue;
			}
			if (!imagelayer._imageryProvider._name&&i ==length_temp-1){//不存在name字段，说明是默认加载的全球背景底图image
				viewer.imageryLayers
						.addImageryProvider(new Cesium.SuperMapImageryProvider(
								{
									url : imageURL,
									name:node.name
								}));
				continue;
			}
			if (imagelayer._imageryProvider._name==node.name) {
				if (imagelayer.show == false && isShow)// 当前不显示且需要显示
					imagelayer.show = true;
				else if (imagelayer.show == true && !isShow)// 当前显示且需要不显示
					imagelayer.show = false;
			} else if (imagelayer._imageryProvider._name!=node.name
					&& isShow && i == viewer.imageryLayers._layers.length-1) {// 图层未加载
				// 添加SuperMap iServer发布的影像服务

				viewer.imageryLayers
						.addImageryProvider(new Cesium.SuperMapImageryProvider(
								{
									url : imageURL,
									name:node.name
								}));
			}
		}
	} else if (layerType == "TerrainFileLayer") {
		console.log(viewer.terrainProvider);
		if (arrayLayerNames.indexOf(node.name) < 0) {
			arrayLayerNames.push(node.name);
		}
		var demURL = node.url? node.url: arrayLayerUrls[arrayLayerNames.indexOf(node.name)];
		if (arrayLayerUrls.indexOf(demURL) < 0) {
			arrayLayerUrls.push(demURL);
		}else{
			return;//存在同名图层，那就不做处理了
		}
		 if (isShow) {
			viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
				url : demURL,
				requestWaterMask : false,// 是否请求水面标志位（用于水面特效），默认不请求
				requestVertexNormals : false,// 是否请求法线（用于光照效果），默认不请求
				isSct : true  // 是否为iServer发布的TIN地形服务
				});
		}
	}
}

//增加节点
function addHoverDom(treeId, treeNode) {
	var sObj = $("#" + treeNode.tId + "_span"); // 获取节点信息
	if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
		return;

	var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
			+ "' title='add node' onfocus='this.blur();'></span>"; // 定义添加按钮
	sObj.after(addStr); // 加载添加按钮
	var btn = $("#addBtn_" + treeNode.tId);

	// 绑定添加事件，并定义添加操作
	if (btn)
		btn.bind("click", function() {
					var zTree = $.fn.zTree.getZTreeObj("tree");
					// 将新节点添加到数据库中
					var name = 'NewNode';
					$.post(	'./index.php?r=data/addtree&pid=' + treeNode.id
									+ '&name=' + name, function(data) {
								var newID = data; // 获取新添加的节点Id
								zTree.addNodes(treeNode, {
											id : newID,
											pId : treeNode.id,
											name : name
										}); // 页面上添加节点
								var node = zTree.getNodeByParam("id", newID,
										null); // 根据新的id找到新添加的节点
								zTree.selectNode(node); //让新添加的节点处于选中状态
							});
				});
}
/*
 * 删除图层操作
 */
function removeHoverDom(treeId, treeNode) {
	$("#addBtn_" + treeNode.tId).unbind().remove();
}
function beforeRemove(e, treeId, treeNode) {
	return confirm("你确定要删除吗？");
}
//右键调用删除时没有调用ztree更新事件，这里单独写出来
function removeLayer(e, treeId, treeNode){
	onRemove(e, treeId, treeNode);
	hideRMenu();
//	调用ztree更新事件
	zTree.removeNode(treeNode);
}
function onRemove(e, treeId, treeNode) {
	var layerType =treeNode.layer3dtype;
	var name =treeNode.name;
	console.log(treeNode);
	//删除图层的操作
	var index = arrayLayerNames.indexOf(name);
	if (index > -1) {
		arrayLayerNames.splice(index, 1);
		arrayLayerUrls.splice(index, 1);
	}
	if (layerType == "3dtile") {
		// 获取三维图层
		console.log("scene.layers");
		console.log(scene.layers);
		var layer1 = scene.layers.find(name);
		if (layer1) {
			scene.layers.remove(name, true);
		}
	} else if (layerType == "ImageFileLayer") {		
		// 获取二维图层
		var imagerylayers =viewer.imageryLayers._layers;
		for (var i = 0; i < imagerylayers.length; i++) {// 获取图层个数
			if(imagerylayers[i]._imageryProvider._name==name){
				if(!imagerylayers[i].isDestroyed()){
					viewer.imageryLayers.remove(imagerylayers[i],true); //imagerylayers 图层移除方法
					break;
				}
			}
		}
	} else if (layerType == "TerrainFileLayer") {

			viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
				url : '',
				requestWaterMask : false,// 是否请求水面标志位（用于水面特效），默认不请求
				requestVertexNormals : false,// 是否请求法线（用于光照效果），默认不请求
				isSct : true  // 是否为iServer发布的TIN地形服务
				});
	}
}

//鼠标右键功能
function onRightClick(event, treeId, treeNode) {
	zTree = $.fn.zTree.getZTreeObj("tree");
	//var x = event.clientX+48;
	//var y = event.clientY-132;
	var x = event.clientX;
	var y = event.clientY - 45;
	/*if (treeNode.layer3dtype== "3dtile") {
		zTree.selectNode(treeNode);
		showRMenu("model",treeNode.name, x, y);
	}else if (treeNode.layer3dtype== "ImageFileLayer") {
		zTree.selectNode(treeNode);
		showRMenu("image",treeNode.name, x, y);
	}else{
		zTree.cancelSelectedNode();
		showRMenu("terrain",treeNode.name, x, y);
	}*/
	if (treeNode.layer3dtype == "ImageFileLayer") {
		$("#m_del").hide();
		$("#m_resetOpacity").show();
		rMenu.css({
			"top": y + "px",
			"left": x + "px",
			"visibility": "visible"
		});
	} else if (treeNode.layer3dtype == "3dtile") {
		$("#m_del").show();
		$("#m_resetOpacity").show();
		rMenu.css({
			"top": y + "px",
			"left": x + "px",
			"visibility": "visible"
		});
	} else {
		$("#m_del").hide();
		$("#m_resetOpacity").hide();
	}
	$("body").bind("mousedown", onBodyMouseDown);
	//		更新全局变量
	window.event = event;
	window.treeId = treeId;
	window.treeNode = treeNode;
}

function hideRMenu() {
	if (rMenu) rMenu.css({ "visibility": "hidden" });
	$("body").unbind("mousedown", onBodyMouseDown);
}
function onBodyMouseDown(event) {
	if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
		rMenu.css({ "visibility": "hidden" });
	}
}

function showWindow() {
	if (document.getElementById("popupWin")) {
		// alert("popupWin");
		$("#popupWin").css("display", "block");
	} else {
		$("<div id='popupWin'></div>").addClass("popupWin").appendTo($("#cesiumContainer"));
	}
	$("#popupWin").css("display", "block");
	var str = "";
	str += '<div class="winTitle" style="position: absolute;left: 10px;top: 50px;background-color: rgb(147,147,147,0.5);border-radius: 5px;">' +
			'<span class="title_left">图层控制</span>' +
			'<span class="title_right"><a href="javascript:closeWindow()" style="float:right;width: 15px;color:#000000;" title="关闭窗口">X</a></span>' +
			'<br style="clear:right"/>' ;


	str += '<div class="winContent" style="overflow-y:auto;height:auto;">';
	str += '<ul id="tree" class="ztree"></ul>';
	str += '</div></div>';
	$("#popupWin").html(str);
}