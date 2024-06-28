import { DawsonPublicApp } from './dawson-public-app';

export function generateStaticParams() {
  return [{ slug: [''] }];
}

export default function Page() {
  return <DawsonPublicApp />;
}
