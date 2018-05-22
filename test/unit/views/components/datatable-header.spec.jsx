import React from 'react';
import { shallow } from 'enzyme';
import TableHeader from 'views/components/datatable-header';
import ApplyChanges from 'views/containers/apply-changes';

describe('<TableHeader />', () => {
  test('renders a <th> element with a title-case id if only passed id', () => {
    const wrapper = shallow(<TableHeader id="test" />);
    expect(wrapper.get(0).type).toBe('th');
    expect(wrapper.text()).toBe('Test');
  });

  test('formats text if passed a title function', () => {
    const wrapper = shallow(<TableHeader id="test" title={text => text.toUpperCase() }/>);
    expect(wrapper.text()).toBe('TEST');
  });

  test('adds aria-sort="none" to the th if sortable but not current column', () => {
    const wrapper = shallow(
      <TableHeader
        id="test"
        column="another"
        ascending={true}
      />
    );
    expect(wrapper.find('[aria-sort="none"]').length).toBe(1);
  });

  test('adds an <ApplyChanges /> element as a child if sortable', () => {
    const wrapper = shallow(
      <TableHeader
        id="test"
        column="another"
        ascending={true}
      />
    );
    expect(wrapper.find(ApplyChanges).length).toBe(1);
  });

  test('adds aria-sort="ascending" to the th if current column and ascending is true', () => {
    const wrapper = shallow(
      <TableHeader
        id="test"
        column="test"
        ascending={true}
      />
    );
    expect(wrapper.find('[aria-sort="ascending"]').length).toBe(1);
  });

  test('adds aria-sort="descending" to the th if current column and ascending is true', () => {
    const wrapper = shallow(
      <TableHeader
        id="test"
        column="test"
        ascending={false}
      />
    );
    expect(wrapper.find('[aria-sort="descending"]').length).toBe(1);
  });

  test('calls setSortColumn with the current column id if changes applied', () => {
    const mockSetSortColumn = jest.fn();
    const wrapper = shallow(
      <TableHeader
        id="test"
        column="another"
        ascending={false}
        setSortColumn={mockSetSortColumn}
      />
    );
    wrapper.find(ApplyChanges).prop('onApply')();
    expect(mockSetSortColumn.mock.calls[0][0]).toBe('test');
  });
});
