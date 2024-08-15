import {
  sequencePerformanceLogsMappings,
  systemPerformanceLogsIndex,
} from 'web-api/elasticsearch/system-performance-logs-mappings';

export const elasticsearchPerformanceMappings = {
  [systemPerformanceLogsIndex]: sequencePerformanceLogsMappings,
};
