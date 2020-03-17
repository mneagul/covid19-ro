$.getJSON({
    url: 'https://covid19.geo-spatial.org/api/dashboard/getDailyCaseReport',
    success: function(data) {
        var _data = data.data.data;
        _datasets = []
        _trendline = { x: [], y: [], pairs: [] }
        for (i=0; i<_data.length; i++) {
            _datasets.push({x: _data[i]['day_case'], y: _data[i]['new_case_no']});
            _trendline.x.push(_data[i]['day_no']);
            _trendline.y.push(_data[i]['total_case']);
            _trendline.pairs.push([_data[i]['day_no'], _data[i]['total_case']]);
        }
        lr = regression.exponential(_trendline.pairs);
        lrds = []
        for (i=0; i<lr.points.length; i++) {
            lrds.push(lr.points[i][1]);
        }
        configDailyCases['data']['datasets'][0]['data'] = _datasets;
        var ctxDailyCases = document.getElementById('canvasDailyCases').getContext('2d');
        window.myLine = new Chart(ctxDailyCases, configDailyCases);
        console.log(lr)
        configTrendline['data']['labels'] = _trendline.x;
        configTrendline['data']['datasets'][0]['data'] = _trendline.y;
        configTrendline['data']['datasets'][1]['data'] = lrds;
        configTrendline['data']['datasets'][1]['label'] = lr.string + '  R^2=' + lr.r2;
        var ctxTrendline = document.getElementById('canvasTrendline').getContext('2d');
        window.myLine = new Chart(ctxTrendline, configTrendline);
    }
});

$.getJSON({
    url: 'https://covid19.geo-spatial.org/api/statistics/getCaseRelations',
    success: function(data) {
        var _data = data.data.nodes;
        _women = 0;
        _men = 0;
        _total = _data.length;
        
        for (i=0; i<_data.length; i++) {
            if (_data[i].properties.gender == 'Bărbat') {
                _men += 1;
            } else {
                _women += 1;
            }

            for (var e in Object.keys(_bti)){
                var _k = Object.keys(_bti)[e];
                if (_data[i].properties.age != null) {
                    if (_data[i].properties.age >= _bti[_k].intervals.min && _data[i].properties.age <= _bti[_k].intervals.max) {
                        _bti[_k].count += 1;
                    }
                }
            }
            for (var e in Object.keys(_bai)){
                var _k = Object.keys(_bai)[e];
                if (_data[i].properties.age != null) {
                    if (_data[i].properties.age >= _bai[_k].intervals.min && _data[i].properties.age <= _bai[_k].intervals.max) {
                        _bai[_k].count += 1;
                    }
                }
            }
        }
        configDistributionBySex.data.datasets[0].data = [
            ((_women*100)/_total).toFixed(2), 
            ((_men*100)/_total).toFixed(2)
        ];
        
        for (var e in Object.keys(_bti)){
            var k = Object.keys(_bti)[e];
            configFreqByGeneration.data.datasets[0].data.push(_bti[k].count);
            configFreqByGeneration.data.labels.push(_bti[k].label);
        }
        
        for (var e in Object.keys(_bai)){
            var k = Object.keys(_bai)[e];
            configFreqByAge.data.datasets[0].data.push(_bai[k].count);
            configFreqByAge.data.labels.push(_bai[k].label);
        }

        var ctxDBS = document.getElementById('canvasDistributionBySex').getContext('2d');
        window.myLine = new Chart(ctxDBS, configDistributionBySex);
        var ctxFBG = document.getElementById('canvasFreqByGeneration').getContext('2d');
        window.myLine = new Chart(ctxFBG, configFreqByGeneration);
        var ctxFBA = document.getElementById('canvasFreqByAge').getContext('2d');
        window.myLine = new Chart(ctxFBA, configFreqByAge);
    }
});

// by type intervals
_bti = {
    'silent': {
        intervals: {
            'min': 74,
            'max': 150
        },
        count: 0,
        label: 'The Silent Generation'
    },
    'babyboomers': {
        intervals: {
            'min': 55,
            'max': 73,
        },
        count: 0,
        label: 'Baby Boomers'
    },
    'generationx': {
        intervals: {
            'min': 39,
            'max': 54,
        },
        count: 0,
        label: 'Generation X'
    },
    'millennials': {
        intervals: {
            'min': 23,
            'max': 38,
        },
        count: 0,
        label: 'Millennials'
    },
    'generationz': {
        intervals: {
            'min': 10,
            'max': 22,
        },
        count: 0,
        label: 'Generation Z'
    }
}

// by age intervals
_bai = {
    'a0_14': {
        intervals: {
            'min': 0,
            'max': 14
        },
        count: 0,
        label: '0-14'
    },
    'a15_24': {
        intervals: {
            'min': 15,
            'max': 24,
        },
        count: 0,
        label: '15-24'
    },
    'a25_54': {
        intervals: {
            'min': 25,
            'max': 54,
        },
        count: 0,
        label: '25-54'
    },
    'a55_64': {
        intervals: {
            'min': 55,
            'max': 64,
        },
        count: 0,
        label: '55-64'
    },
    'a65': {
        intervals: {
            'min': 65,
            'max': 150,
        },
        count: 0,
        label: '64+'
    }
}

var configTrendline = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'cazuri',
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [],
            fill: false,
            borderColor: window.chartColors.blue,
            showLine: false
        },
        {
            label: '',
            backgroundColor: window.chartColors.orange,
            borderColor: window.chartColors.orange,
            data: [],
            fill: false,
            borderColor: window.chartColors.orange,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Ziua față de cazuri cumulative',
            fontSize: 18
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Ziua (din momentul declanșării în România)'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Cumulativ'
                }
            }]
        }
    }
};

var configFreqByGeneration = {
    type: 'outlabeledPie',
    data: {
        labels: [],
        datasets: [{
            backgroundColor: [window.chartColors.orange, window.chartColors.green, window.chartColors.yellow, window.chartColors.red, window.chartColors.blue ],
            data: []
        }]
    },
    options: {
        zoomOutPercentage: 50,
        repsonsive: true,
        title: {
            display: true,
            text: 'Frecvența după generație',
            fontSize: 18
        },
        legend: {
            display: false
        },
        display: true,
        elements: {
        },
        plugins: {
            legend: false,
            outlabels: {
                text: '%l %p',
                color: 'white',
                stretch: 45,
                font: {
                    resizable: true,
                    minSize: 12,
                    maxSize: 18
                }
            }
        }
    },
}

var configDistributionBySex = {
    type: 'doughnut',
    data: {
        labels: ['Feminin', 'Masculin'],
        datasets: [{
            backgroundColor: [window.chartColors.red, window.chartColors.blue],
            data: []
        }]
    },
    options: {
        repsonsive: true,
        title: {
            display: true,
            text: 'Distribuție după gen',
            fontSize: 18
        },
        legend: {
            display: false
        },
        display: true,
        elements: {
        }
    }
}

var configFreqByAge = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Grupe de vârstă',
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [],
            fill: false,
            borderColor: window.chartColors.blue
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Frecvența pe grupe de vârstă',
            fontSize: 18
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Interval Vârstă'
                }
            }],
            yAxes: [{
                //display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Frecvența'
                }
            }]
        }
    }
};

var configDailyCases = {
    type: 'line',
    data: {
        //labels: [],
        datasets: [{
            label: 'Cazuri unice',
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [],
            fill: false,
            borderColor: window.chartColors.blue
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Cazuri pe zile',
            fontSize: 18
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    format: 'YYYY-MM-DD',
                    tooltipFormat: 'll',
                    unit: 'day',
                    unitStepSize: 5
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Data'
                }
            }],
            yAxes: [{
                //display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Cazuri'
                }
            }]
        }
    }
};
