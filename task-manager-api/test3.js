const fs = require('fs');
const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    const logStream = fs.createWriteStream('test_results.txt', { flags: 'w' });
    const log = (msg) => logStream.write(msg + '\n');

    log('--- STARTING TESTS ---');
    let user1Token, user2Token, taskId;

    try {
        const r1 = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: `u1_${Date.now()}`, email: `u1_${Date.now()}@test.com`, password: 'password123' })
        });
        const d1 = await r1.json();
        log(`Register User 1: success, username: ${d1.user.username}`);
        user1Token = d1.token;

        const r2 = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user1Token}` },
            body: JSON.stringify({ title: 'Task 1', description: 'Desc 1' })
        });
        const d2 = await r2.json();
        log(`Create Task for User 1: success, task ID: ${d2.id}`);
        taskId = d2.id;

        const r3 = await fetch(`${BASE_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${user1Token}` }
        });
        const d3 = await r3.json();
        log(`Get Tasks User 1: count = ${d3.length}`); // Should be 1

        const r4 = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user1Token}` },
            body: JSON.stringify({ status: true })
        });
        const d4 = await r4.json();
        log(`Update Task User 1: success, new status = ${d4.status}`);

        const r5 = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: `u2_${Date.now()}`, email: `u2_${Date.now()}@test.com`, password: 'password123' })
        });
        const d5 = await r5.json();
        log(`Register User 2: success, username: ${d5.user.username}`);
        user2Token = d5.token;

        const r6 = await fetch(`${BASE_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${user2Token}` }
        });
        const d6 = await r6.json();
        log(`Get Tasks User 2: count = ${d6.length}`); // Should be 0

        const r7 = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${user2Token}` }
        });
        const d7 = await r7.json();
        log(`User 2 Delete User 1 Task Result: error = ${d7.error}`); // Should fail

        const r8 = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${user1Token}` }
        });
        const d8 = await r8.json();
        log(`User 1 Delete Task Result: message = ${d8.message}`); // Should succeed

        log('--- TESTS FINISHED ---');
    } catch (err) {
        log(`ERROR: ${err.message}`);
    } finally {
        logStream.end();
    }
}

testAPI();
