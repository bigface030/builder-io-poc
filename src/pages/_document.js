import { Html, Head, Main, NextScript } from 'next/document';
import ivm from 'isolated-vm';
import { Builder } from '@builder.io/react';

const isolate = new ivm.Isolate({ memoryLimit: 128 });
const context = isolate.createContextSync();
Builder.setServerContext(context);

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
