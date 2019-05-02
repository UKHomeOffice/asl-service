import React from 'react';
import Layout from './base';

const Index = ({
  Component,
  ...props
}) => (
  <Layout footerLinks={[{ label: 'Privacy notice', href: '/privacy' }]} { ...props }>
    <Component { ...props } />
  </Layout>
);

export default Index;
