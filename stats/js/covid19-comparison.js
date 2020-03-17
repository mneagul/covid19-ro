var github_csv_data_url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';
var target_countries = [ 'italy' ]
var target_countries_start_date = [ '2/16/20' ]
var target_counterie_chart_color = [ 'green/yellow']

var db = {
    'dates': [],
    'countries': {}
}
console.log(window.location.search.substr(1));
$.get({
    url: github_csv_data_url,
    success: function(data) {
        dt = data.split('\n');
        head = dt[0].split(',');
        for (j=4; j<head.length; j++) {
            db.dates.push(Date.parse(head[j]));
        }
        for (i=1; i<dt.length; i++){
            l = dt[i].split(',');
            if (target_countries.includes(l[1].toLowerCase())) {
                db.countries[l[1].toLowerCase()] = {}
                db.countries[l[1].toLowerCase()]['total_cases'] = []
                for (j=4; j<l.length; j++) {
                    db.countries[l[1].toLowerCase()]['total_cases'].push(l[j])
                }
            }
        }
        getFromGeoSpatial();

    }
});

function getFromGeoSpatial() {
    $.getJSON({
        url: 'https://covid19.geo-spatial.org/api/dashboard/getDailyCaseReport',
        success: function(data) {
            var _data = data.data.data;

            _trendline = { x: [], y: [], pairs: [] }
            for (i=0; i<_data.length; i++) {
                _trendline.x.push(_data[i]['day_no']);
                _trendline.y.push(_data[i]['total_case']);
                _trendline.pairs.push([_data[i]['day_no'], _data[i]['total_case']]);
            }
            lr = regression.exponential(_trendline.pairs);
            lrds = []
            for (i=0; i<lr.points.length; i++) {
                lrds.push(lr.points[i][1]);
            }
            configTrendline['data']['labels'] = _trendline.x;
            configTrendline['data']['datasets'][0]['data'] = _trendline.y;
            configTrendline['data']['datasets'][1]['data'] = lrds;
            configTrendline['data']['datasets'][1]['label'] = lr.string + ' R^2='+lr.r2+' [Romania]';
            
            if (db.dates.length>0) {
                for (i=0; i<target_countries.length; i++) {
                    d = db.countries[target_countries[i]];
                    sd = Date.parse(target_countries_start_date[i]);
                    swi = db.dates.indexOf(sd);
                    target_value = []
                    console.log(d.total_cases[10])
                    for (k=swi; k<swi+_trendline.x.length; k++) {
                        target_value.push([k-swi+1, d.total_cases[k]]);
                    }
                    console.log(target_value);
                    tlr = regression.exponential(target_value);
                    tlrds = []
                    taY = []
                    for (k=0; k<tlr.points.length; k++) {
                        tlrds.push(tlr.points[k][1]);
                        taY.push(target_value[k][1])
                    }
                    ds0 = {
                        label: 'cazuri, start:['+target_countries_start_date[i]+'] ['+target_countries[i]+']',
                        backgroundColor: window.chartColors[target_counterie_chart_color[i].split('/')[0]],
                        borderColor: window.chartColors[target_counterie_chart_color[i].split('/')[0]],
                        data: taY,
                        fill: false,
                        borderColor: window.chartColors[target_counterie_chart_color[i].split('/')[0]],
                        showLine: false
                    }

                    ds1 = {
                        label: tlr.string + ' R^2='+tlr.r2 + ' [' +target_countries[i]+']',
                        backgroundColor: window.chartColors[target_counterie_chart_color[i].split('/')[1]],
                        borderColor: window.chartColors[target_counterie_chart_color[i].split('/')[1]],
                        data: tlrds,
                        fill: false,
                        borderColor: window.chartColors[target_counterie_chart_color[i].split('/')[1]]
                    }
                }

                configTrendline.data.datasets.push(ds0);
                configTrendline.data.datasets.push(ds1);  
            }
            
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
}