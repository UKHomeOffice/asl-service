import { get } from 'lodash';

export default {
  id: {},
  name: {
    show: true
  },
  email: {
    show: true
  },
  phoneNumber: {
    show: true
  },
  address: {
    show: true,
    accessor() {
      return get(this, 'country');
    }
  },
  car: {
    show: true,
    accessor: 'car.year'
  },
  animals: {
    show: true
  }
};
