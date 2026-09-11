const coupons = {

  'FiestasPatrias': {
    type: 'percent',
    value: 0,
    label: 'Fiestas Patrias',
    minSubtotal: 7,
    appliesToDiscounted: true,
    useDeviceDiscount: true,

    // Vigencia: 11 al 18 de septiembre de 2026
    validFrom: '2026-09-11',
    validUntil: '2026-09-18',

    eligibleDevices: [
      '3 Dispositivos',
      '4 Dispositivos',
      '5 Dispositivos'
    ]
  },


  'ClienteVip': {
    type: 'percent',
    value: 25,
    label: '',
    minSubtotal: 7,
    appliesToDiscounted: true,
    useDeviceDiscount: true
  },

  'iuiu': {
    type: 'percent',
    value: 0,
    label: '',
    minSubtotal: 0,
    appliesToDiscounted: false,
    useDeviceDiscount: false
  },

  'uiuyi': {
    type: 'percent',
    value: 5,
    label: '',
    minSubtotal: 10,
    appliesToDiscounted: true,
    useDeviceDiscount: true
  },

  '902026': {
    type: 'percent',
    value: 0,
    label: '',
    minSubtotal: 0,
    appliesToDiscounted: true,
    useDeviceDiscount: true
  },

  'VIP20': {
    type: 'percent',
    value: 15,
    label: '',
    minSubtotal: 80,
    appliesToDiscounted: false,
    useDeviceDiscount: false
  }

};


const couponDeviceDiscounts = {

  'FiestasPatrias': {
    defaultByDevice: {
      '1 Dispositivo': 0,
      '2 Dispositivos': 0,
      '3 Dispositivos': 25,
      '4 Dispositivos': 25,
      '5 Dispositivos': 25,
      '6 Dispositivos': 0
    }
  },


  'ClienteVip': {

    defaultByDevice: {
      '1 Dispositivo': 0,
      '2 Dispositivos': 5,
      '3 Dispositivos': 25,
      '4 Dispositivos': 25,
      '5 Dispositivos': 25,
      '6 Dispositivos': 25
    },

    products: {

      'Stella TV': {
        '1 Dispositivo': 0,
        '2 Dispositivos': 5,
        '3 Dispositivos': 20
      },

      'WeibTV (GVS)': {
        '1 Dispositivo': 0,
        '3 Dispositivos': 20,
        '5 Dispositivos': 20
      },

      'Tele-Latino': {
        '1 Dispositivo': 0,
        '4 Dispositivos': 20
      },

      'VeltixTV': {
        '1 Dispositivo': 0,
        '2 Dispositivos': 5,
        '3 Dispositivos': 20
      },

      '+Streaming': {
        '1 Dispositivo': 0,
        '2 Dispositivos': 0,
        '3 Dispositivos': 0
      }

    }
  },


  '902026': {
    defaultByDevice: {
      '1 Dispositivo': 0,
      '2 Dispositivos': 0,
      '3 Dispositivos': 5,
      '4 Dispositivos': 0,
      '5 Dispositivos': 7,
      '6 Dispositivos': 5
    }
  },


  'VIP20': {
    defaultByDevice: {
      '1 Dispositivo': 0,
      '2 Dispositivos': 0,
      '3 Dispositivos': 0,
      '4 Dispositivos': 0,
      '5 Dispositivos': 0,
      '6 Dispositivos': 0
    }
  }

};
