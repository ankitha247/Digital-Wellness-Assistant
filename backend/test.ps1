# test.ps1
Write-Host "=== Testing Backend API ===" -ForegroundColor Green

# Test 1: Signup
Write-Host "`n1. Testing Signup..." -ForegroundColor Yellow
$signupBody = @{
    email = "test_$(Get-Date -Format 'HHmmss')@test.com"
    password = "password123"
    name = "Test User"
} | ConvertTo-Json

$signupResponse = Invoke-RestMethod -Uri http://localhost:8000/auth/signup `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $signupBody

Write-Host "Signup Response:" -ForegroundColor Cyan
$signupResponse

# Check profile_complete
if ($signupResponse.profile_complete -eq $false) {
    Write-Host "✅ Signup returns profile_complete: false - CORRECT" -ForegroundColor Green
} else {
    Write-Host "❌ Signup returns profile_complete: $($signupResponse.profile_complete) - WRONG!" -ForegroundColor Red
}

# Test 2: Login
Write-Host "`n2. Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $signupResponse.email
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri http://localhost:8000/auth/login `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $loginBody

Write-Host "Login Response:" -ForegroundColor Cyan
$loginResponse

# Test 3: Profile Setup
Write-Host "`n3. Testing Profile Setup..." -ForegroundColor Yellow
$profileBody = @{
    user_id = $signupResponse.id
    bio = "Test bio"
} | ConvertTo-Json

$profileResponse = Invoke-RestMethod -Uri http://localhost:8000/profile/setup `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $profileBody

Write-Host "Profile Setup Response:" -ForegroundColor Cyan
$profileResponse

# Test 4: Login after profile setup
Write-Host "`n4. Testing Login after profile setup..." -ForegroundColor Yellow
$login2Response = Invoke-RestMethod -Uri http://localhost:8000/auth/login `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $loginBody

Write-Host "Login after profile setup:" -ForegroundColor Cyan
$login2Response

if ($login2Response.profile_complete -eq $true) {
    Write-Host "✅ Login returns profile_complete: true after profile setup - CORRECT" -ForegroundColor Green
} else {
    Write-Host "❌ Login still returns profile_complete: $($login2Response.profile_complete) - WRONG!" -ForegroundColor Red
}