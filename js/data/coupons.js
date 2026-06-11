const coupons={
  'LATINSTREAM':{
    type:'percent',
    value:0,
    label:'',
    minSubtotal:7,
    appliesToDiscounted:false,
    useDeviceDiscount:true
  },
  'MAMA':{
    type:'percent',
    value:0,
    label:'',
    minSubtotal:0,
    appliesToDiscounted:false,
    useDeviceDiscount:false
  },
  'MUNDIAL2026':{
    type:'percent',
    value:5,
    label:'',
    minSubtotal:10,
    appliesToDiscounted:true,
    useDeviceDiscount:true
  },
  'VIP20':{
    type:'percent',
    value:15,
    label:'',
    minSubtotal:80,
    appliesToDiscounted:false,
    useDeviceDiscount:false
  }
};

const couponDeviceDiscounts={
  'MUNDIAL2026':{
    defaultByDevice:{
      '1 Dispositivo':0,
      '2 Dispositivos':3,
      '3 Dispositivos':5,
      '5 Dispositivos':7,
      '6 Dispositivos':5
    },
    products:{
      'Stella TV':{
      '1 Dispositivo':0,
      '2 Dispositivos':3,
      '3 Dispositivos':5},

      'WeibTV (GVS)':{
      '1 Dispositivo':0, 
      '3 Dispositivos':3,
      '5 Dispositivos':7},

      'Tele-Latino':{
      '1 Dispositivo':0,
      '6 Dispositivos':5},

      'VeltixTV':{
      '1 Dispositivo':4,
      '2 Dispositivos':5,
      '3 Dispositivos':7},

      '+Streaming':{
        '1 Dispositivo':0,
        '2 Dispositivos':0,
        '3 Dispositivos':0}
    }
  },
  'LATINSTREAM':{
    defaultByDevice:{'1 Dispositivo':5,'2 Dispositivos':10,'3 Dispositivos':15,'5 Dispositivos':18,'6 Dispositivos':15}
  },
  'MUNDIAL2026':{
    defaultByDevice:{'1 Dispositivo':0,'2 Dispositivos':0,'3 Dispositivos':25,'5 Dispositivos':35,'6 Dispositivos':25}
  },
  'VIP20':{
    defaultByDevice:{'1 Dispositivo':0,'2 Dispositivos':0,'3 Dispositivos':0,'5 Dispositivos':0,'6 Dispositivos':0}
  }
};
