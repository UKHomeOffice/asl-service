import React from 'react';
import { getTitle } from '../../../../lib/utils';
import ApplyChanges from '../containers/apply-changes';

const TableHeader = ({
  id,
  column,
  ascending,
  setSortColumn,
  sortable,
  title
}) => {
  const isSortable = sortable !== false && column !== undefined && ascending !== undefined;
  return (
    <th
      aria-sort={ isSortable ? (column === id ? (ascending ? 'ascending' : 'descending') : 'none') : undefined }
    >
      {
        isSortable
          ? <ApplyChanges
            sort={{
              column: id,
              ascending: column === id ? !ascending : true
            }}
            onApply={() => setSortColumn(id)}
            label={getTitle(id, { title })}
          />
          : getTitle(id, { title })
      }
    </th>
  );
};

export default TableHeader;
