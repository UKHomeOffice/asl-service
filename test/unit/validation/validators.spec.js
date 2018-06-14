import validators from '../../../lib/validation/validators';

const doTest = (value, params, type, expected) => {
  test(`testing '${value}' against ${params}`, () => {
    expect(validators[type](value, params)).toBe(expected);
  });
};

describe('validation', () => {
  describe('type', () => {
    describe('valid', () => {
      const values = [
        'A string value',
        [1, 2, 3],
        57,
        { an: 'Object' }
      ];

      const params = [
        'string',
        'array',
        'number',
        'object'
      ];

      values.forEach((value, index) => doTest(value, params[index], 'type', true));
    });

    describe('invalid', () => {
      const values = [
        'A string',
        [1, 2, 3],
        { a: 'b' },
        [1, 2, 3]
      ];

      const params = [
        'number',
        'string',
        'array',
        'object'
      ];

      values.forEach((value, index) => doTest(value, params[index], 'type', false));
    });
  });

  describe('maxLength', () => {
    describe('valid', () => {
      const values = [
        'A string value',
        [1, 2, 3],
        new Array(256).fill('.').join('')
      ];
      const params = [
        15,
        5,
        256
      ];
      values.forEach((value, index) => doTest(value, params[index], 'maxLength', true));
    });

    describe('invalid', () => {
      const values = [
        'A string value',
        [1, 2, 3],
        new Array(257).fill('.').join('')
      ];
      const validators = [
        5,
        2,
        256
      ];
      values.forEach((value, index) => doTest(value, validators[index], 'maxLength', false));
    });
  });

  describe('match', () => {
    describe('valid', () => {
      const values = [
        'A string value',
        '12345',
        'www.something.com/test'
      ];
      const params = [
        /^A string/,
        /\d/,
        /\/test$/
      ];
      values.forEach((value, index) => doTest(value, params[index], 'match', true));
    });

    describe('invalid', () => {
      const values = [
        'A string value',
        12345,
        ['A string']
      ];
      const validators = [
        /striing/,
        /\d/,
        /A string/
      ];
      values.forEach((value, index) => doTest(value, validators[index], 'match', false));
    });
  });

  describe('definedValues', () => {
    describe('valid', () => {
      const values = [
        'A string',
        ['a', 'b', 'c']
      ];
      const validators = [
        ['A string', 'something'],
        ['a', 'b', 'something', 'c']
      ];
      values.forEach((value, index) => doTest(value, validators[index], 'definedValues', true));
    });

    describe('invalid', () => {
      const values = [
        'Something else',
        ['a', 'b', 'c', 'd']
      ];
      const validators = [
        ['A string', 'Something'],
        ['a', 'something', 'b', 'c']
      ];
      values.forEach((value, index) => doTest(value, validators[index], 'definedValues', false));
    });
  });

  describe('required', () => {
    describe('valid', () => {
      const values = [
        0,
        false,
        'string'
      ];
      values.forEach(value => doTest(value, true, 'required', true));
    });

    describe('invalid', () => {
      const values = [
        '',
        null,
        undefined
      ];
      values.forEach(value => doTest(value, true, 'required', false));
    });
  });
});
