export function getHealthStatus() {
  return {
    status: 'ok',
    service: 'weeklypulse-api',
    timestamp: new Date().toISOString()
  };
}
