// k6 benchmark skeleton. Run with: k6 run -e BASE_URL=https://staging.example scripts/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
const base = __ENV.BASE_URL || 'http://localhost:8080';
const failures = new Rate('daily_failures');
const latency = new Trend('daily_latency');
export const options = { scenarios: { api: { executor: 'ramping-vus', startVUs: 10, stages: [{ duration: '30s', target: 100 }, { duration: '60s', target: 100 }, { duration: '30s', target: 0 }], gracefulRampDown: '10s' } }, thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<500'], daily_failures: ['rate<0.01'] } };
export default function () {
  const response = http.get(`${base}/health`, { headers: { 'x-correlation-id': `load-${__VU}-${__ITER}` } });
  latency.add(response.timings.duration); failures.add(response.status !== 200);
  check(response, { 'health is 200': (r) => r.status === 200 }); sleep(1);
}
