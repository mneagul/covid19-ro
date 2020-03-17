$.getJSON({
    url: 'https://covid19.geo-spatial.org/api/dashboard/getDailyCaseReport',
    success: function(data) {
        var _data = data.data.data;
        //_ds_it = [[1,3],[2,3],[3,3],[4,3],[5,3],[6,20],[7,62],[8,155],[9,229],[10,322],[11,453],[12,655],[13,888],[14,1128],[15,1694],[16,2036],[17,2502],[18,3089],[19,3858],[20,4636],[21,5883]];
        _ds_it = [3,3,20,62,155,229,322,453,655,888,1128,1694,2036,2502,3089,3858,4636,5883,7375,9172,10149,12462]
        _dslr = []
        for (var i in _ds_it){
            _dslr.push([i, _ds_it[i]])
        }
        _datasets = []
        _trendline = { x: [], y: [], pairs: [] }
        for (i=0; i<_data.length; i++) {
            _datasets.push({x: _data[i]['day_case'], y: _data[i]['new_case_no']});
            _trendline.x.push(_data[i]['day_no']);
            _trendline.y.push(_data[i]['total_case']);
            //_trendline.pairs.push([_data[i]['total_case'], _data[i]['day_no']]);
            _trendline.pairs.push([_data[i]['day_no'], _data[i]['total_case']]);
        }
        lr = regression.exponential(_trendline.pairs);
        lr_it = regression.exponential(_dslr)
        aY_it = []
        aY_ro = []
        lrds = []
        lrds_it = []
        _label = []
        for (i=0; i<lr.points.length; i++) {
            lrds.push(lr.points[i][1]);
            lrds_it.push(lr_it.points[i][1]);
            aY_it.push(_dslr[i][1]);
        }
 
        configTrendline['data']['labels'] = _trendline.x;
        configTrendline['data']['datasets'][0]['data'] = _trendline.y;
        configTrendline['data']['datasets'][1]['data'] = lrds;
        configTrendline['data']['datasets'][1]['label'] = lr.string + ' R^2='+lr.r2+' [Romania]';
        configTrendline['data']['datasets'][2]['data'] = aY_it;
        configTrendline['data']['datasets'][3]['data'] = lrds_it;
        configTrendline['data']['datasets'][3]['label'] = lr_it.string + '  R^2='+lr_it.r2+' [Italia]';
        var ctxTrendline = document.getElementById('canvasTrendline').getContext('2d');
        window.myLine = new Chart(ctxTrendline, configTrendline);
    }
});

var configTrendline = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'cazuri [Romania]',
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
        },
        {
            label: 'cazuri [Italia]',
            backgroundColor: window.chartColors.yellow,
            borderColor: window.chartColors.yellow,
            data: [],
            fill: false,
            borderColor: window.chartColors.yellow,
            showLine: false
        },
        {
            label: '',
            backgroundColor: window.chartColors.green,
            borderColor: window.chartColors.green,
            data: [],
            fill: false,
            borderColor: window.chartColors.green,
        }
    ]
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
                    labelString: 'Ziua'
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