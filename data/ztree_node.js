// ztree的节点数据源文件
var zNodes =
    [
        {
            id: 1,
            pId: 0,
            name: "BIM",
            open: true,
            checked: false,
            isChild: false,
            chkDisabled: true,
            children:
                [
                    {
                        id: 11,
                        pId: 1,
                        name: "小类模型1-1",
                        url: Cesium.IonResource.fromAssetId(8564),
                        layer3dtype: "3dtile",
                        checked: false,
                        isChild: true,
                        layerID: "11",
                        tileset: null,
                        entity: null
                    },
                    {
                        id: 12,
                        pId: 1,
                        name: "小类模型1-2",
                        url: Cesium.IonResource.fromAssetId(5714),
                        layer3dtype: "3dtile",
                        checked: false,
                        isChild: true,
                        layerID: "12",
                        tileset: null,
                        entity: null
                    },
                    {
                        id: 13,
                        pId: 1,
                        name: "小类模型1-3",
                        url: "http://localhost:8080/Project/SampleData/Cesium3DTiles/Instanced/InstancedOrientation/tileset.json",
                        layer3dtype: "3dtile",
                        checked: false,
                        isChild: true,
                        layerID: "13",
                        tileset: null,
                        entity: null
                    }
                ]
        },
        {
            id: 2,
            pId: 0,
            name: "影像",
            open: true,
            checked: false,
            isChild: false,
            chkDisabled: true,
            children:
                [
                    {
                        url: "1",
                        layer3dtype: "ImageFileLayer",
                        name: "注记",
                        caption: "",
                        checked: false
                    }, {
                        url: "2",
                        layer3dtype: "ImageFileLayer",
                        name: "经纬格网",
                        caption: "",
                        checked: false
                    }, {
                        url: "3",
                        layer3dtype: "ImageFileLayer",
                        name: "天地图",
                        caption: "",
                        checked: true
                    }, {
                        url: "4",
                        layer3dtype: "ImageFileLayer",
                        name: "谷歌影像",
                        caption: "",
                        checked: false
                    }
                ]
        },
        {
            id: 3,
            pId: 0,
            name: "构件",
            open: true,
            checked: false,
            isChild: false,
            // chkDisabled: true,
            children:
                [
                    {
                        url: "",
                        layer3dtype: "goujian",
                        name: "结构",
                        caption: "goujian01",
                        visible: false
                    }, {
                        url: "",
                        layer3dtype: "goujian",
                        name: "机电",
                        caption: "goujian02",
                        visible: false
                    }, {
                        url: "",
                        layer3dtype: "goujian",
                        name: "装修",
                        caption: "goujian03",
                        visible: false
                    }
                ]
        },

    ];