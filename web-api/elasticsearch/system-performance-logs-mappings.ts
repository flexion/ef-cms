export const systemPerformanceLogsMappings = {
  properties: {
    date: {
      type: 'date',
    },
    duration: {
      type: 'integer',
    },
    environment: {
      type: 'keyword',
    },
    metricName: {
      type: 'keyword',
    },
  },
};

export const systemPerformanceLogsIndex: string = 'system-performance-logs';
