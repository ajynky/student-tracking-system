import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10,
    duration: '30s',
    thresholds: {
        http_req_duration: ['p(95)<5000'],
        http_req_failed: ['rate<0.05'],
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:9092';
const TOKEN = __ENV.TOKEN || '';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
};

export default function () {
    // Test 1 — Get attendance by student
    const studentId = __ENV.STUDENT_ID || '00000000-0000-0000-0000-000000000000';
    const res = http.get(`${BASE_URL}/attendance/student/${studentId}`, { headers });
    check(res, {
        'GET /attendance/student/{id} status 200': (r) => r.status === 200,
        'GET /attendance/student/{id} response time < 2s': (r) => r.timings.duration < 2000,
    });

    sleep(1);
}