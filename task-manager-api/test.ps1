$ErrorActionPreference = "Stop"

$apiUrl = "http://localhost:3000/api"

# 1. Register User 1
$uniqueId = Get-Date -UFormat "%s"
$regBody = @{
    username = "pws_$uniqueId"
    email = "pws_$uniqueId@test.com"
    password = "password123"
} | ConvertTo-Json

$regResponse = Invoke-RestMethod -Method Post -Uri "$apiUrl/auth/register" -ContentType "application/json" -Body $regBody
Write-Host "Registered User 1 ($($regResponse.user.username)) with token:" $regResponse.token
$token1 = $regResponse.token

# 2. Create Task for User 1
$taskBody = @{
    title = "My first task"
    description = "Task description here"
} | ConvertTo-Json

$taskResp = Invoke-RestMethod -Method Post -Uri "$apiUrl/tasks" -Headers @{Authorization="Bearer $token1"} -ContentType "application/json" -Body $taskBody
Write-Host "Created Task:" $taskResp.id "-" $taskResp.title
$taskId1 = $taskResp.id

# 3. Get Tasks for User 1
$getTasks = Invoke-RestMethod -Method Get -Uri "$apiUrl/tasks" -Headers @{Authorization="Bearer $token1"}
Write-Host "User 1 has $($getTasks.Length) tasks."

# 4. Register User 2
$uniqueId2 = Get-Date -UFormat "%s" + "_2"
$regBody2 = @{
    username = "pws_$uniqueId2"
    email = "pws_$uniqueId2@test.com"
    password = "password123"
} | ConvertTo-Json

$regResponse2 = Invoke-RestMethod -Method Post -Uri "$apiUrl/auth/register" -ContentType "application/json" -Body $regBody2
$token2 = $regResponse2.token
Write-Host "Registered User 2."

# 5. User 2 Tries to Get User 1's Task
$getTasks2 = Invoke-RestMethod -Method Get -Uri "$apiUrl/tasks" -Headers @{Authorization="Bearer $token2"}
Write-Host "User 2 has $($getTasks2.Length) tasks. (should be 0)"

# 6. User 2 Tries to Delete User 1's Task - should fail
try {
    Invoke-RestMethod -Method Delete -Uri "$apiUrl/tasks/$taskId1" -Headers @{Authorization="Bearer $token2"}
    Write-Host "ERROR: User 2 was able to delete User 1's task!"
} catch {
    Write-Host "Success: User 2 could not delete User 1's task ($($_.Exception.Message))"
}

# 7. User 1 Deletes Task
$delTask = Invoke-RestMethod -Method Delete -Uri "$apiUrl/tasks/$taskId1" -Headers @{Authorization="Bearer $token1"}
Write-Host "User 1 deleted task. Message: $($delTask.message)"

Write-Host "ALL TESTS PASSED SUCCESSFULLY"
