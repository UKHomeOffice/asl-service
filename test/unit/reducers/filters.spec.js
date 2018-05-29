import { merge } from 'lodash';
import reducer, { applyFilters } from 'reducers/filters';
import data from '../fixtures/data';
import schema from '../fixtures/schema';

describe('rootReducer', () => {
  test('returns an empty object on init', () => {
    const expected = {};
    expect(reducer(undefined, {})).toEqual(expected);
  });

  test('SET_FILTERS sets the state', () => {
    const expected = {
      '*': ['test']
    };
    expect(reducer(undefined, { type: 'SET_FILTERS', filters: expected })).toEqual(expected);
  });

  test('SET_FILTER removes filters on other keys', () => {
    const initial = {
      test: ['test-value-1']
    };
    const input = {
      '*': ['test']
    };
    const expected = {
      '*': ['test']
    };
    expect(reducer(initial, { type: 'SET_FILTERS', filters: input })).toEqual(expected);
  });

  test('SET_FILTERS overwrites existing filters', () => {
    const initial = {
      test: ['test-value-1']
    };
    const input = {
      test: ['test-value-2']
    };
    const expected = {
      test: ['test-value-2']
    };
    expect(reducer(initial, { type: 'SET_FILTERS', filters: input })).toEqual(expected);
  });

  test('SET_FILTER adds a new filter', () => {
    const key = 'test';
    const value = 'test-value';
    const expected = {
      test: ['test-value']
    };
    expect(reducer({}, { type: 'SET_FILTER', key, value })).toEqual(expected);
  });

  test('SET_FILTER replaces an existing filter for a key', () => {
    const key = 'test';
    const value = 'test-value-2';
    const initial = {
      test: ['test-value-1']
    };
    const expected = {
      test: ['test-value-2']
    };
    expect(reducer(initial, { type: 'SET_FILTER', key, value })).toEqual(expected);
  });

  test('SET_FILTER sets to an empty array if passed a falsy value', () => {
    const key = 'test';
    const value = null;
    const initial = {
      test: ['test-value-1']
    };
    const expected = {
      test: []
    };
    expect(reducer(initial, { type: 'SET_FILTER', key, value })).toEqual(expected);
  });

  test('SET_FILTER ignores duplicates', () => {
    const key = 'test';
    const value = 'test-value-1';
    const initial = {
      test: ['test-value-1']
    };
    const expected = {
      test: ['test-value-1']
    };
    expect(reducer(initial, { type: 'SET_FILTER', key, value })).toEqual(expected);
  });

  describe('applyFilters()', () => {
    const state = { schema, data };

    describe('Multi-field search *', () => {
      test('filters on a text field', () => {
        const filters = {
          '*': ['Mahalia']
        };
        const filtered = applyFilters({ ...state, filters });
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(4);
      });

      test('filters on a nested field', () => {
        const filters = {
          '*': [2004]
        };
        const filtered = applyFilters({ ...state, filters });
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(5);
      });

      test('filters on a field containing an array', () => {
        const filters = {
          '*': ['Flightless cormorant']
        };
        const filtered = applyFilters({ ...state, filters });
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(5);
      });

      test('filters on a field containing an array checking any entries present', () => {
        const filters = {
          '*': ['Flightless cormorant', 'Stone sheep']
        };
        const filtered = applyFilters({ ...state, filters });
        expect(filtered.length).toBe(2);
        expect(filtered[0].id).toBe(5);
        expect(filtered[1].id).toBe(6);
      });

      test('filters on a field containing an array checking every entry present', () => {
        const filters = {
          '*': ['Lapwing (unidentified)', 'Black vulture']
        };
        const schema = merge({}, state.schema, { animals: { comparator: 'AND' } });
        const filtered = applyFilters({ ...state, filters, schema });
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(3);
      });

      test('excludes partial matches if exact: true', () => {
        const filters = {
          '*': ['Lapwing (unidentified)', 'Black']
        };
        const schema = merge({}, state.schema, { animals: { comparator: 'AND', exact: true } });
        const filtered = applyFilters({ ...state, filters, schema });
        expect(filtered.length).toBe(0);
      });

      test('includes partial matches if exact option omitted', () => {
        const filters = {
          '*': ['Lapwing (unidentified)', 'Black']
        };
        const schema = merge({}, state.schema, { animals: { comparator: 'AND' } });
        const filtered = applyFilters({ ...state, filters, schema });
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(3);
      });
    });

    describe('Nominated field search', () => {
      test('filters on a single text field', () => {
        const filters = {
          email: ['bpymar0@trellian.com']
        };
        const filtered = applyFilters({ ...state, filters });
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(1);
      });

      test('filters on multiple fields', () => {
        const filters = {
          name: ['a'],
          email: ['bwintersgill2@wikimedia.org']
        };
        const filtered = applyFilters({ ...state, filters });
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(3);
      });

      test('filters on multiple fields', () => {
        const filters = {
          name: ['abdc'],
          email: ['bwintersgill2@wikimedia.org']
        };
        const filtered = applyFilters({ ...state, filters });
        expect(filtered.length).toBe(0);
      });

      test('filters on complex data types using custom accessor functions', () => {
        const filters = {
          contacts: ['Chosen Name']
        };
        const withContacts = data.map(row => {
          return {
            ...row,
            contacts: Array.from([1, 2, 3, 4, 5], id => {
              return { id, name: 'Test name' };
            })
          };
        });
        withContacts[3].contacts[2].name = 'Chosen Name';
        const schema = merge({}, state.schema, {
          contacts: {
            accessor(row) {
              return row.contacts.map(c => c.name);
            }
          }
        });
        const filtered = applyFilters({ data: withContacts, schema, filters });
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(4);
      });
    });

    describe('combined single-field and multi-field search', () => {
      test('if wildcard filter is empty, filters only on specific field', () => {
        const filters = {
          '*': [],
          animals: ['Painted stork']
        };
        const filtered = applyFilters({ ...state, filters });
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(1);
      });
    });

  });
});
