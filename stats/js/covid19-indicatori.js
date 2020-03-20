$.getJSON({
  url: 'https://covid19.geo-spatial.org/airly/BaneasaNord.json',
  success: function(data) {
    _data = data.data;
    //polutionConfig['data'] = _data;
    _datasets = []
    entry = -1;
    indicator_keys = {'pm10_data': "PM10", 'pm25_data': "PM25"};
    for (var indicator in indicator_keys) {
      entry += 1;
      indicator_data = {
        'label': indicator_keys[indicator],
        'data': [],
        'borderWidth': 1,
        'fill': false
      };
      indicator_values = _data[indicator];
      for (i=0; i<indicator_values.columns.length; i++) {
        _date = indicator_values.columns[i];
        _value = indicator_values.series[i].y;
        indicator_data.data.push({x: _date, y:_value});
      }
      pal = palette('tol-dv', Object.keys(indicator_keys).length).map(function(hex) {
        return '#' + hex;
      });
      //indicator_data['backgroundColor'] = 'rgba(0, 0, 0, 0.1)';
      indicator_data['borderColor'] = pal[entry];
      //indicator_data['borderColor'] = indicator_data['backgroundColor'];

      _datasets.push(indicator_data);
    };
    polutionConfig['data'] = {}
    polutionConfig['data']['datasets'] = _datasets;
    _options = polutionConfig.options;

    annotations = [

    ]
    _options['annotation'] = {
      drawTime: 'afterDatasetsDraw',
      annotations: annotations
    }

    var ctxPolution = document.getElementById('canvasPolution').getContext('2d');
    window.polution = new Chart(ctxPolution, polutionConfig);
  }
});

var polutionConfig = {
    type: 'line',
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Indicatori airlive.ro',
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
                    labelString: 'Indicator'
                }
            }]
        }
    }
};
