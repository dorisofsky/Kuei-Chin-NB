// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

// 指定图表的配置项和数据
myChart.showLoading();

$.get('HK.json', function(geoJson) {

	myChart.hideLoading();

	echarts.registerMap('HK', geoJson);

	myChart.setOption(option = {
		title: {
			text: '香港18区人口密度 （2011）',
			subtext: '此為Echart的範例檔',
			sublink: 'http://echarts.baidu.com/demo.html#map-HK'
		},
		tooltip: {
			trigger: 'item',
			formatter: '{b}<br/>{c} (p / km2)'
		},
		toolbox: {
			show: true,
			orient: 'vertical',
			left: 'right',
			top: 'center',
			feature: {
				dataView: { readOnly: false },
				restore: {},
				saveAsImage: {}
			}
		},
		visualMap: {
			min: 800,
			max: 50000,
			text: ['High', 'Low'],
			realtime: false,
			calculable: true,
			inRange: {
				color: ['lightskyblue', 'yellow', 'orangered']
			}
		},
		series: [{
			name: '香港18区人口密度',
			type: 'map',
			mapType: 'HK', // 自定义扩展图表类型
			itemStyle: {
				normal: { label: { show: true } },
				emphasis: { label: { show: true } }
			},
			data: [
				{ name: '中西区', value: 20057.34 },
				{ name: '湾仔区', value: 15477.48 },
				{ name: '东区', value: 31686.1 },
				{ name: '南区', value: 6992.6 },
				{ name: '油尖旺区', value: 44045.49 },
				{ name: '深水埗区', value: 40689.64 },
				{ name: '九龙城区', value: 37659.78 },
				{ name: '黄大仙区', value: 45180.97 },
				{ name: '观塘区', value: 55204.26 },
				{ name: '葵青区', value: 21900.9 },
				{ name: '荃湾区', value: 4918.26 },
				{ name: '屯门区', value: 5881.84 },
				{ name: '元朗区', value: 4178.01 },
				{ name: '北区', value: 2227.92 },
				{ name: '大埔区', value: 2180.98 },
				{ name: '沙田区', value: 9172.94 },
				{ name: '西贡区', value: 3368 },
				{ name: '离岛区', value: 806.98 }
			],
			// 自定义名称映射
			nameMap: {
				'Central and Western': '中西区',
				'Eastern': '东区',
				'Islands': '离岛',
				'Kowloon City': '九龙城',
				'Kwai Tsing': '葵青',
				'Kwun Tong': '观塘',
				'North': '北区',
				'Sai Kung': '西贡',
				'Sha Tin': '沙田',
				'Sham Shui Po': '深水埗',
				'Southern': '南区',
				'Tai Po': '大埔',
				'Tsuen Wan': '荃湾',
				'Tuen Mun': '屯门',
				'Wan Chai': '湾仔',
				'Wong Tai Sin': '黄大仙',
				'Yau Tsim Mong': '油尖旺',
				'Yuen Long': '元朗'
			}
		}]
	});
});
