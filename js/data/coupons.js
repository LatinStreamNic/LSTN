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
    value:20,
    label:'',
    minSubtotal:7,
    appliesToDiscounted:false,
    useDeviceDiscount:false
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
  'MAMA':{
    defaultByDevice:{
      '1 Dispositivo':10,
      '2 Dispositivos':15,
      '3 Dispositivos':20,
      '5 Dispositivos':25,
      '6 Dispositivos':20
    },
    products:{
      'Stella TV':{
      '1 Dispositivo':10,
      '2 Dispositivos':15,
      '3 Dispositivos':20},

      'WeibTV (GVS)':{
      '1 Dispositivo':10, 
      '3 Dispositivos':20,
      '5 Dispositivos':25},

      'Tele-Latino':{
      '1 Dispositivo':10,
      '6 Dispositivos':20},

      'VeltixTV':{
      '1 Dispositivo':10,
      '2 Dispositivos':15,
      '3 Dispositivos':20},

      '+Streaming':{
        '1 Dispositivo':10,
        '2 Dispositivos':15,
        '3 Dispositivos':20}
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
