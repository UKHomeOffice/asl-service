import React from 'react';
import Layout from './base';

const Index = ({
  Component,
  ...props
}) => (
  <Layout { ...props }>
    <Component { ...props } />
  </Layout>
);

export default Index;
