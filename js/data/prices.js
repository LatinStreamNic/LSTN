
const officialDevicePrices={

  'Stella TV|1 mes': {
    '1 Dispositivo': {price:4.50, oldPrice:5.00, available:false},
    '2 Dispositivos': {price:5.95, oldPrice:7.00, available:false},
    '3 Dispositivos': {price:7.20, oldPrice:9.00, available:true},
  },
  'Stella TV|2 meses': {
    '1 Dispositivo': {price:9.00, oldPrice:10.00, available:false},
    '2 Dispositivos': {price:12.05, oldPrice:14.18, available:false},
    '3 Dispositivos': {price:14.40, oldPrice:18.00, available:true},
  },
  'Stella TV|3 meses': {
    '1 Dispositivo': {price:13.50, oldPrice:15.00, available:false},
    '2 Dispositivos': {price:17.85, oldPrice:21.00, available:false},
    '3 Dispositivos': {price:21.60, oldPrice:27.00, available:true},
  },
  'Stella TV|6 meses': {
    '1 Dispositivo': {price:27.00, oldPrice:30.00, available:true},
    '2 Dispositivos': {price:35.70, oldPrice:42.00, available:false},
    '3 Dispositivos': {price:43.20, oldPrice:54.00, available:true},
  },
  'Stella TV|9 meses': {
    '1 Dispositivo': {price:40.50, oldPrice:45.00, available:true},
    '2 Dispositivos': {price:53.55, oldPrice:63.00, available:false},
    '3 Dispositivos': {price:64.80, oldPrice:81.00, available:true},
  },
  'Stella TV|12 meses': {
    '1 Dispositivo': {price:54.00, oldPrice:60.00, available:true},
    '2 Dispositivos': {price:71.40, oldPrice:84.00, available:false},
    '3 Dispositivos': {price:76.80, oldPrice:96.00, available:true},
  },

  'WeibTV (GVS)|1 mes': {
    '1 Dispositivo': {price:4.50, oldPrice:5.00, available:false},
    '3 Dispositivos': {price:8.00, oldPrice:10.00, available:true},
    '5 Dispositivos': {price:11.25, oldPrice:15.00, available:true},
  },
  'WeibTV (GVS)|2 meses': {
    '1 Dispositivo': {price:9.00, oldPrice:10.00, available:true},
    '3 Dispositivos': {price:16.00, oldPrice:20.00, available:true},
    '5 Dispositivos': {price:22.50, oldPrice:30.00, available:true},
  },
  'WeibTV (GVS)|3 meses': {
    '1 Dispositivo': {price:13.50, oldPrice:15.00, available:true},
    '3 Dispositivos': {price:24.00, oldPrice:30.00, available:true},
    '5 Dispositivos': {price:33.75, oldPrice:45.00, available:true},
  },
  'WeibTV (GVS)|6 meses': {
    '1 Dispositivo': {price:27.00, oldPrice:30.00, available:true},
    '3 Dispositivos': {price:48.00, oldPrice:60.00, available:true},
    '5 Dispositivos': {price:67.50, oldPrice:90.00, available:true},
  },
  'WeibTV (GVS)|9 meses': {
    '1 Dispositivo': {price:40.50, oldPrice:45.00, available:true},
    '3 Dispositivos': {price:61.20, oldPrice:76.50, available:true},
    '5 Dispositivos': {price:101.25, oldPrice:135.00, available:true},
  },
  'WeibTV (GVS)|12 meses': {
    '1 Dispositivo': {price:54.00, oldPrice:60.00, available:true},
    '3 Dispositivos': {price:72.00, oldPrice:90.00, available:true},
    '5 Dispositivos': {price:135.00, oldPrice:180.00, available:true},
  },
  'WeibTV (GVS)|18 meses': {
    '1 Dispositivo': {price:81.00, oldPrice:90.00, available:true},
    '3 Dispositivos': {price:128.00, oldPrice:160.00, available:true},
    '5 Dispositivos': {price:202.50, oldPrice:270.00, available:true},
  },

  'Tele-Latino|1 mes': {
    '1 Dispositivo': {price:3.65, oldPrice:4.05, available:false},
    '6 Dispositivos': {price:5.76, oldPrice:7.20, available:true},
  },
  'Tele-Latino|2 meses': {
    '1 Dispositivo': {price:7.29, oldPrice:8.10, available:false},
    '6 Dispositivos': {price:11.84, oldPrice:14.80, available:true},
  },
  'Tele-Latino|3 meses': {
    '1 Dispositivo': {price:10.94, oldPrice:12.15, available:false},
    '6 Dispositivos': {price:17.28, oldPrice:21.60, available:true},
  },
  'Tele-Latino|6 meses': {
    '1 Dispositivo': {price:21.87, oldPrice:24.30, available:true},
    '6 Dispositivos': {price:32.16, oldPrice:40.20, available:true},
  },
  'Tele-Latino|9 meses': {
    '1 Dispositivo': {price:32.81, oldPrice:36.45, available:true},
    '6 Dispositivos': {price:44.00, oldPrice:55.00, available:true},
  },
  'Tele-Latino|12 meses': {
    '1 Dispositivo': {price:43.74, oldPrice:48.60, available:true},
    '6 Dispositivos': {price:60.72, oldPrice:75.90, available:true},
  },

  'VeltixTV|1 mes': {
    '1 Dispositivo': {price:4.50, oldPrice:5.00, available:true},
    '2 Dispositivos': {price:5.53, oldPrice:6.50, available:true},
    '3 Dispositivos': {price:6.40, oldPrice:8.00, available:true},
  },
  'VeltixTV|2 meses': {
    '1 Dispositivo': {price:9.00, oldPrice:10.00, available:true},
    '2 Dispositivos': {price:11.05, oldPrice:13.00, available:true},
    '3 Dispositivos': {price:12.80, oldPrice:16.00, available:true},
  },
  'VeltixTV|3 meses': {
    '1 Dispositivo': {price:13.50, oldPrice:15.00, available:true},
    '2 Dispositivos': {price:16.58, oldPrice:19.50, available:true},
    '3 Dispositivos': {price:19.20, oldPrice:24.00, available:true},
  },
  'VeltixTV|6 meses': {
    '1 Dispositivo': {price:27.00, oldPrice:30.00, available:true},
    '2 Dispositivos': {price:33.15, oldPrice:39.00, available:true},
    '3 Dispositivos': {price:38.40, oldPrice:48.00, available:true},
  },
  'VeltixTV|9 meses': {
    '1 Dispositivo': {price:40.50, oldPrice:45.00, available:true},
    '2 Dispositivos': {price:49.73, oldPrice:58.50, available:true},
    '3 Dispositivos': {price:57.60, oldPrice:72.00, available:true},
  },
  'VeltixTV|12 meses': {
    '1 Dispositivo': {price:54.00, oldPrice:60.00, available:true},
    '2 Dispositivos': {price:66.30, oldPrice:78.00, available:true},
    '3 Dispositivos': {price:76.80, oldPrice:96.00, available:true},
  },

  '+Streaming|1 mes': {
    '1 Dispositivo': {price:4.50, oldPrice:5.00, available:false},
    '2 Dispositivos': {price:8.50, oldPrice:10.00, available:false},
    '3 Dispositivos': {price:12.00, oldPrice:15.00, available:false},
  },

};
