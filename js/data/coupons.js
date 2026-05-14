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
    minSubtotal:0,
    appliesToDiscounted:true,
    useDeviceDiscount:true
  },

  'MUNDIAL2026':{
    type:'percent',
    value:12.5,
    label:'',
    minSubtotal:7,
    appliesToDiscounted:true,
    useDeviceDiscount:true
  },

  'VIP20':{
    type:'percent',
    value:10,
    label:'',
    minSubtotal:80,
    appliesToDiscounted:true,
    useDeviceDiscount:true
  }
};

const couponDeviceDiscounts={

  'MAMA':{
    products:{

      'Stella TV':{
        '1 Dispositivo':5,
        '2 Dispositivos':10,
        '3 Dispositivos':15
      },

      'WeibTV (GVS)':{
        '1 Dispositivo':5,
        '3 Dispositivos':15,
        '5 Dispositivos':20
      },

      'Tele-Latino':{
        '1 Dispositivo':5,
        '6 Dispositivos':15
      },

      'VeltixTV':{
        '1 Dispositivo':5,
        '2 Dispositivos':10,
        '3 Dispositivos':15
      }

    }
  }

};
