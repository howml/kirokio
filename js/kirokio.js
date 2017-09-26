//! kirokio.js
//! version : 0.20170614
//! authors : howmori
//! license : MIT
//! howml.org

// ベースレイヤー(MAP)の設定
maptiks.trackcode='cd02c3aa-6877-4413-b792-edaa23a83b14';
var map;
var zoom = 12;
var center = new L.LatLng(42.0754 , 140.5769);
var api_key = 'pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpcGg5dDdjdDAxMmt1OW5qdzUzMWMxamUifQ.8nfM3INfFUehVzKhmNOrJQ';
var mierune = new L.tileLayer('https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png', {
    attribution: "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL."
});
var osm = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
var hybrid = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.nal0mpda/{z}/{x}/{y}.png?access_token=' + api_key, {
    attribution: '&copy; <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a> , &copy; OpenStreetMap, &copy; Mapbox'
});

//overlayMapsCS立体図
var m_CS = new L.tileLayer('http://kouapp.main.jp/csmap/tile/hokkaido/{z}/{x}/{y}.jpg', {
	attribution: 'この地図の作成に当たっては、国土地理院長の承認を得て、同院発行の基盤地図情報を使用した。(承認番号 平28情使 第830号)',
    opacity: 0.5 
    });

//KMLの読み込み(森町の範囲)
var Map_KML_Style = {
    "color": "#c46200",
    "weight": 1.5,
    "opacity": 0.6,
    "fillColor": "#ef7700",
    "fillOpacity": 0.2
};
var Map_KML_Style_old = {
    "color": "#c46200",
    "weight": 1.5,
    "opacity": 0.6,
    "fillColor": "#ef7700",
    "fillOpacity": 0.2
};
var Map_KML_Property1 = L.geoJson(null, {
style: Map_KML_Style 
});
var Map_KML_Property2 = L.geoJson(null, {
style: Map_KML_Style_old 
});
var Map_KML_Property3 = L.geoJson(null, {
style: Map_KML_Style_old 
});
var Map_KML_Mori = omnivore.kml('data/mori.kml', null, Map_KML_Property1); 
var Map_KML_MoriOld = omnivore.kml('data/MoriOld.kml', null, Map_KML_Property2); 
var Map_KML_SawaraOld = omnivore.kml('data/SawaraOld.kml', null, Map_KML_Property3); 
   
//minimapの表示
 var o_std_mini = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

    
//iconの指定
var groupKirokioIcon = L.icon({
    iconUrl: 'img/markerr.png',
    iconSize: [40, 40],
    iconAnchor:[25, 20],
    popupAnchor:[-5, -20],
});
var groupLocalwikiIcon = L.icon({
    iconUrl: 'img/markerg.png',
    iconSize: [40, 40],
    iconAnchor:[25, 20],
    popupAnchor:[-5, -20],
});

// キロキオCSVの読み込み
var ua = navigator.userAgent;
var groupKirokio = L.geoCsv(); 
$.get("data/kirokio.csv", function(kirokio) {
    groupKirokio = L.geoCsv(kirokio, {
        fieldSeparator: ',',
        firstLineTitles: true,
        // マーカー指定
        pointToLayer: function (feature, layer) {
            return L.marker(layer, { icon: groupKirokioIcon});
        },
        // コンテンツの表示   
        onEachFeature: function (feature, layer) {
            contents  = '<h4>' +feature.properties['name']+ '</h4>';
            contents += '<table width="250px">';
            contents += '<tr>'; 
            contents += '<td>写真</td>';          
            contents += '<td>';
            // agentがスマートフォンの場合とそうじゃない場合で挙動を変える
            var agent = navigator.userAgent;
        	if(agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || agent.search(/iPod/) != -1 || agent.search(/Android/) != -1){
                if(feature.properties['pics2'] != false) {
                    contents += '<a href="scrollnyc/index.html?p1=' +feature.properties['pics']+ '&p2=' +feature.properties['pics2']+ '&E=end" target="new">';
                    contents += '<img src="' +feature.properties['thumbnail']+ '" /></a>';         
                } else {
                contents += '<a href="' +feature.properties['pics']+ '" data-lity="data-lity">';
                contents += '<img src="' +feature.properties['thumbnail']+ '" /></a>';
                }
	        } else {
                if(feature.properties['pics2'] != false) {
                    contents += '<a href="scrollnyc/index.html?p1=' +feature.properties['pics']+ '&p2=' +feature.properties['pics2']+ '&E=end" data-lity="data-lity">';
                    contents += '<img src="' +feature.properties['thumbnail']+ '" /></a>';         
                } else {
                    contents += '<a href="' +feature.properties['pics']+ '" data-lity="data-lity">';
                    contents += '<img src="' +feature.properties['thumbnail']+ '" /></a>';
                }
            }
            contents += '</td>';
            contents += '</tr>';
            if(feature.properties['url'] != false) {
                contents += '<tr>';
                contents += '<td>参照</td>';
                contents += '<td> <a href="' +feature.properties['url']+ '" target="_blank">関連リンク</a></td>';
                contents += '<tr>';
            }
            contents += '</table>';
            layer.bindPopup(contents);
            layer.bindLabel(feature.properties['name']);
        }
    }).addTo(groupKirokio);
});

// LocalWikiCSVの読み込み
var groupLocalwiki = L.geoCsv(); 
$.get("data/localwiki.csv", function(localwiki) {
    groupLocalwiki= L.geoCsv(localwiki, {
        fieldSeparator: ',',
        firstLineTitles: true,
    // マーカー指定
        pointToLayer: function (feature, layer) {
            return L.marker(layer, { icon: groupLocalwikiIcon});
        },
    // コンテンツの表示       
        onEachFeature: function (feature, layer) {
            contents = '<a href="' +feature.properties['url']+ '" target="_blank">';
            contents += '<h3>' +feature.properties['name']+ '</h3></a>';
            layer.bindPopup(contents);
            layer.bindLabel(feature.properties['name']);
        }
    }).addTo(groupLocalwiki);
});

//地図の描写
$(function () {
    map = new L.map('map', {
        maptiks_id: 'Maps API Leaflet Example',
        center: center,
        zoom: zoom,
        zoomControl: true,
        layers: [mierune, groupKirokio, groupLocalwiki]
    });
    map.attributionControl.setPrefix('<a href="http://leafletjs.com">Leaflet</a>');
    var baseLayer = {
    "MIERUNE": mierune,
    "OSM": osm,
    "衛星写真": hybrid,
    };
    var overlayMaps = {
    "写真": groupKirokio,
    "Localwiki": groupLocalwiki,
    "現在の森町範囲を表示": Map_KML_Mori,
    "旧森町範囲を表示": Map_KML_MoriOld,
    "旧砂原町範囲を表示": Map_KML_SawaraOld,
    "CS立体図を重ねる": m_CS,
    };
    L.control.scale().addTo(map);
    L.control.layers(baseLayer,overlayMaps, {collapsed: true, position: 'topright'}).addTo(map);
    var MiniMap = new L.Control.MiniMap(o_std_mini,{zoomLevelOffset:-5}).addTo(map);

});
