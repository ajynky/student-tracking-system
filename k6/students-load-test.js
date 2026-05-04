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

const BASE_URL = __ENV.BASE_URL || 'http://localhost:9095';
const TOKEN = __ENV.TOKEN || '';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
};

export default function () {
    // Test 1 — Get all students
    const listRes = http.get(`${BASE_URL}/students?page=0&size=10`, { headers });
    check(listRes, {
        'GET /students status 200': (r) => r.status === 200,
        'GET /students response time < 2s': (r) => r.timings.duration < 2000,
    });

    sleep(1);

    // Test 2 — Get student by ID (replace with a real UUID from your DB)
    const studentId = __ENV.STUDENT_ID || '00000000-0000-0000-0000-000000000000';
    const getRes = http.get(`${BASE_URL}/students/${studentId}`, { headers });
    check(getRes, {
        'GET /students/{id} status 200': (r) => r.status === 200,
        'GET /students/{id} response time < 2s': (r) => r.timings.duration < 2000,
    });

    sleep(1);
}