export const systemPerformanceLogsMappings = {
  properties: {
    date: {
      type: 'date',
    },
    duration: {
      type: 'integer',
    },
    metricName: {
      type: 'keyword',
    },
  },
};

export const systemPerformanceLogsIndex: string = 'system-performance-logs';
