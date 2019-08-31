import React from 'react';
import { NextPageContext } from 'next-server/dist/lib/utils';

interface DocumentProps {}

function Document({  }: DocumentProps) {
  return <p>cake</p>;
}

Document.getInitialProps = async ({ query }: NextPageContext) => {
  return {};
};

export default Document;
