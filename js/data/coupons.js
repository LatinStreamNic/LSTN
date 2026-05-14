const coupons={
  'LATINSTREAM':{
    type:'percent',
    value:15,
    label:'',
    minSubtotal:7,
    appliesToDiscounted:false,
    useDeviceDiscount:true
  },
  'MAMA':{
    type:'percent',
    value:15,
    label:'',
    minSubtotal:6,
    appliesToDiscounted:true,
    useDeviceDiscount:true
  },
  'MUNDIAL2026':{
    type:'percent',
    value:25,
    label:'',
    minSubtotal:7,
    appliesToDiscounted:false,
    useDeviceDiscount:true
  },
  'VIP20':{
    type:'percent',
    value:15,
    label:'',
    minSubtotal:80,
    appliesToDiscounted:false,
    useDeviceDiscount:true
  }
};

const couponDeviceDiscounts={
  'MAMA':{
    defaultByDevice:{
      '1 Dispositivo':5,
      '2 Dispositivos':10,
      '3 Dispositivos':15,
      '5 Dispositivos':25,
      '6 Dispositivos':15
    },
    products:{
      'Stella TV':{
      '1 Dispositivo':5,
      '2 Dispositivos':10,
      '3 Dispositivos':15},

      'WeibTV (GVS)':{
      '1 Dispositivo':5, 
      '3 Dispositivos':15,
      '5 Dispositivos':25},

      'Tele-Latino':{
      '1 Dispositivo':5,
      '6 Dispositivos':15},

      'VeltixTV':{
      '1 Dispositivo':5,
      '2 Dispositivos':10,
      '3 Dispositivos':15},

      '+Streaming':{'1 Dispositivo':10,'2 Dispositivos':20,'3 Dispositivos':30}
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
