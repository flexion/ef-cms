import { elasticsearchMappings } from './elasticsearch-mappings';
import { elasticsearchPerformanceMappings } from 'web-api/elasticsearch/elasticsearch-performance-mappings';

export type esIndexType = { index: string };

export const elasticsearchIndexes: string[] = Object.keys(
  elasticsearchMappings,
);

export const elasticsearchPerformanceIndexes: string[] = Object.keys(
  elasticsearchPerformanceMappings,
);
