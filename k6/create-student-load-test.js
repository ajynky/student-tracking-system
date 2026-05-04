import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:9095';
const TOKEN = __ENV.TOKEN || '';
const CLASS_ID = __ENV.CLASS_ID || '00000000-0000-0000-0000-000000000000';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`,
};

export default function () {
  const payload = JSON.stringify({
    name: `Load Test Student ${uuidv4()}`,
    rollNo: `LT-${Math.floor(Math.random() * 999999)}`,
    classId: CLASS_ID,
    userId: uuidv4(),
  });

  const res = http.post(`${BASE_URL}/students`, payload, { headers });
  check(res, {
    'POST /students status 201': (r) => r.status === 201,
    'POST /students response time < 5s': (r) => r.timings.duration < 5000,
  });
  sleep(1);
}