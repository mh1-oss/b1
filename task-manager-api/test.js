const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('--- STARTING TESTS ---');
    let user1Token, user2Token, taskId;

    // 1. Register User 1
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: `testuser1_${Date.now()}`, email: `test1_${Date.now()}@example.com`, password: 'password123' })
        });
        const data = await res.json();
        console.log('Register User 1:', data);
        user1Token = data.token;
    } catch (err) { console.error(err); }

    // 2. Create Task for User 1
    try {
        const res = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user1Token}` },
            body: JSON.stringify({ title: 'Task 1', description: 'Description 1' })
        });
        const data = await res.json();
        console.log('Create Task User 1:', data);
        taskId = data.id;
    } catch (err) { console.error(err); }

    // 3. Get Tasks for User 1
    try {
        const res = await fetch(`${BASE_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${user1Token}` }
        });
        const data = await res.json();
        console.log(`Get Tasks User 1 (Count: ${data.length}):`, data);
    } catch (err) { console.error(err); }

    // 4. Update Task
    try {
        const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user1Token}` },
            body: JSON.stringify({ status: true })
        });
        const data = await res.json();
        console.log('Update Task User 1:', data);
    } catch (err) { console.error(err); }

    // 5. Register User 2
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: `testuser2_${Date.now()}`, email: `test2_${Date.now()}@example.com`, password: 'password123' })
        });
        const data = await res.json();
        console.log('Register User 2:', data);
        user2Token = data.token;
    } catch (err) { console.error(err); }

    // 6. User 2 Tries to Get User 1's Task (Should be empty list since they only get theirs)
    try {
        const res = await fetch(`${BASE_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${user2Token}` }
        });
        const data = await res.json();
        console.log(`Get Tasks User 2 (Count: ${data.length}):`, data);
    } catch (err) { console.error(err); }

    // 7. User 2 Tries to Delete User 1's Task (Should Fail)
    try {
        const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${user2Token}` }
        });
        const data = await res.json();
        console.log('User 2 Delete User 1 Task Result:', data);
    } catch (err) { console.error(err); }

    // 8. User 1 Deletes Task
    try {
        const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${user1Token}` }
        });
        const data = await res.json();
        console.log('User 1 Delete Task Result:', data);
    } catch (err) { console.error(err); }

    console.log('--- TESTS FINISHED ---');
    process.exit(0);
}

// Give server a bit to start
setTimeout(testAPI, 1000);
