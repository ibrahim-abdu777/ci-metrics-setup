function summarize(metrics) {
  const count = metrics.length;
  const passed = metrics.filter(metric => metric.status === 'passed').length;
  const unknown = metrics.filter(metric => metric.status === 'unknown').length;
  const failed = metrics.filter(metric => metric.status === 'failed').length;
  const flaky = metrics.filter(metric => metric.status === 'flaky').length;
  const skipped = metrics.filter(metric => metric.status === 'skipped').length;
  const noDuration = metrics.filter(metric => metric.duration_ms === null || metric.duration_ms === undefined).length;
  const withDuration = metrics.filter(metric => typeof metric.duration_ms === 'number');
  const rated = count - skipped - unknown;
  const effectivelyPassed = passed + flaky;
  return {
    count,
    passed,
    failed,
    flaky,
    skipped,
    unknown,
    passRate: rated ? effectivelyPassed / rated : 0,
    averageDurationMs: withDuration.length ? withDuration.reduce((sum, metric) => sum + metric.duration_ms, 0) / withDuration.length : 0,
    noDuration,
  };
}
module.exports = { summarize };
