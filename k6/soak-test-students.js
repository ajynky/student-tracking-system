import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 10 },   // ramp up
        { duration: '10m', target: 10 },  // hold for 10 minutes
        { duration: '2m', target: 0 },    // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<5000'],
        http_req_failed: ['rate<0.05'],
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:9095';
const TOKEN = __ENV.TOKEN || '';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
};

export default function () {
    const studentId = __ENV.STUDENT_ID || '00000000-0000-0000-0000-000000000000';
    const res = http.get(`${BASE_URL}/students/${studentId}`, { headers });
    check(res, {
        'status 200': (r) => r.status === 200,
        'response time < 5s': (r) => r.timings.duration < 5000,
    });
    sleep(1);
}