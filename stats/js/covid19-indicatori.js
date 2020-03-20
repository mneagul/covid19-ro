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
        'borderWidth': 1
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
      {
            drawTime: "afterDatasetsDraw",
            id: "vline1",
            type: "line",
            mode: "vertical",
            scaleID: 'x-axis-0',
            value: "2020-02-25",
            borderColor: "black",
            borderWidth: 5,
            label: {
              backgroundColor: "red",
              content: "Carantina pt Hubei, Lombardia, Veneto",
              enabled: false
            }
      },
      {
            drawTime: "afterDatasetsDraw",
            id: "vline2",
            type: "line",
            mode: "vertical",
            scaleID: 'x-axis-0',
            value: "2020-03-02",
            borderColor: "black",
            borderWidth: 5,
            label: {
              backgroundColor: "red",
              content: "Izolare la domiciliu pt China, Coreea, Iran, Italia de nord",
              enabled: false
            }
      },
      {
            drawTime: "afterDatasetsDraw",
            id: "vline3",
            type: "line",
            mode: "vertical",
            scaleID: 'x-axis-0',
            value: "2020-03-08",
            borderColor: "black",
            borderWidth: 5,
            label: {
              backgroundColor: "red",
              content: "Interzicere a adunarilor de peste 1000 oameni",
              enabled: false
            }
      },
      {
            drawTime: "afterDatasetsDraw",
            id: "vline4",
            type: "line",
            mode: "vertical",
            scaleID: 'x-axis-0',
            value: "2020-03-09",
            borderColor: "black",
            borderWidth: 5,
            label: {
              backgroundColor: "red",
              content: "Interzicere a adunarilor de peste 1000 oameni",
              enabled: false
            }
      },
      {
            drawTime: "afterDatasetsDraw",
            id: "vline5",
            type: "line",
            mode: "vertical",
            scaleID: 'x-axis-0',
            value: "2020-03-10",
            borderColor: "black",
            borderWidth: 5,
            label: {
              backgroundColor: "red",
              content: "Suspendare a transportului public rutier si feroviar din si spre Italia",
              enabled: false
            }
      },
      {
            drawTime: "afterDatasetsDraw",
            id: "vline6",
            type: "line",
            mode: "vertical",
            scaleID: 'x-axis-0',
            value: "2020-03-11",
            borderColor: "black",
            borderWidth: 5,
            label: {
              backgroundColor: "red",
              content: "Inchiderea scolilor",
              enabled: false
            }
      },
      {
            drawTime: "afterDatasetsDraw",
            id: "vline7",
            type: "line",
            mode: "vertical",
            scaleID: 'x-axis-0',
            value: "2020-03-14",
            borderColor: "black",
            borderWidth: 5,
            label: {
              backgroundColor: "red",
              content: "Anuntare Decretare stare de urgenta",
              enabled: false
            }
      },
    ];
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
