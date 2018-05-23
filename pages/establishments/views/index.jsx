import React from 'react';
import App from '../../common/views/app';
import DataTable from '../../common/views/containers/datatable';
import SearchBar from '../../common/views/containers/search';
import ExportLink from '../../common/views/containers/export-link';
import FilterSummary from '../../common/views/containers/filter-summary';

const formatters = {
  name: {
    format: (name, item) => {
      return <a href={`/establishment/${item.id}`}>{name}</a>;
    }
  }
};

const Index = props => (
  <App {...props}>
    <header>
      <h2>&nbsp;</h2>
      <h1>Establishments</h1>
    </header>
    <SearchBar />
    <FilterSummary />
    <DataTable formatters={formatters} />
    <ExportLink />
  </App>
);

export default Index;
