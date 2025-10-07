# PowerShell script to test Fleet Inventory APIs

Write-Host "🚀 Testing NeuroFleet Telemetry APIs" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Test 1: Get all telemetry data
Write-Host "`n📊 Test 1: Get All Vehicle Telemetry" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/vehicles/telemetry/all" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS: Found $($data.Count) vehicles with telemetry data" -ForegroundColor Green
    
    # Show sample vehicle data
    $sampleVehicle = $data[0]
    Write-Host "📋 Sample Vehicle Data:" -ForegroundColor Cyan
    Write-Host "   Make/Model: $($sampleVehicle.make) $($sampleVehicle.model)" -ForegroundColor White
    Write-Host "   License: $($sampleVehicle.licensePlate)" -ForegroundColor White
    Write-Host "   Status: $($sampleVehicle.status)" -ForegroundColor White
    Write-Host "   Battery: $($sampleVehicle.batteryLevel)%" -ForegroundColor White
    Write-Host "   Location: $($sampleVehicle.latitude), $($sampleVehicle.longitude)" -ForegroundColor White
    Write-Host "   Speed: $($sampleVehicle.speed) km/h" -ForegroundColor White
    Write-Host "   Last Update: $($sampleVehicle.lastUpdate)" -ForegroundColor White
}
catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get specific vehicle telemetry
Write-Host "`n🚗 Test 2: Get Specific Vehicle Telemetry" -ForegroundColor Yellow
try {
    $vehicleId = $data[0].id
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/vehicles/$vehicleId/telemetry" -UseBasicParsing
    $vehicleData = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS: Retrieved telemetry for vehicle $($vehicleData.licensePlate)" -ForegroundColor Green
}
catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Check WebSocket connection
Write-Host "`n🔌 Test 3: WebSocket Connection Test" -ForegroundColor Yellow
Write-Host "   WebSocket endpoint: ws://localhost:3001" -ForegroundColor White
Write-Host "   ℹ️  WebSocket testing requires browser or specialized tools" -ForegroundColor Cyan

# Test 4: Vehicle status distribution
Write-Host "`n📈 Test 4: Vehicle Status Distribution" -ForegroundColor Yellow
$statusCounts = @{}
foreach ($vehicle in $data) {
    if ($statusCounts.ContainsKey($vehicle.status)) {
        $statusCounts[$vehicle.status]++
    } else {
        $statusCounts[$vehicle.status] = 1
    }
}

Write-Host "📊 Status Distribution:" -ForegroundColor Cyan
foreach ($status in $statusCounts.Keys) {
    Write-Host "   ${status}: $($statusCounts[$status]) vehicles" -ForegroundColor White
}

# Test 5: Vehicle type distribution
Write-Host "`n🚙 Test 5: Vehicle Type Distribution" -ForegroundColor Yellow
$typeCounts = @{}
foreach ($vehicle in $data) {
    if ($typeCounts.ContainsKey($vehicle.vehicleType)) {
        $typeCounts[$vehicle.vehicleType]++
    } else {
        $typeCounts[$vehicle.vehicleType] = 1
    }
}

Write-Host "🔋 Vehicle Type Distribution:" -ForegroundColor Cyan
foreach ($type in $typeCounts.Keys) {
    Write-Host "   ${type}: $($typeCounts[$type]) vehicles" -ForegroundColor White
}

# Test 6: Battery level analysis
Write-Host "`n🔋 Test 6: Battery Level Analysis" -ForegroundColor Yellow
$batteryLevels = $data | ForEach-Object { $_.batteryLevel }
$avgBattery = ($batteryLevels | Measure-Object -Average).Average
$lowBattery = ($batteryLevels | Where-Object { $_ -lt 30 }).Count
$highBattery = ($batteryLevels | Where-Object { $_ -gt 70 }).Count

Write-Host "🔋 Battery Statistics:" -ForegroundColor Cyan
Write-Host "   Average Battery Level: $([math]::Round($avgBattery, 1))%" -ForegroundColor White
Write-Host "   Low Battery (<30%): $lowBattery vehicles" -ForegroundColor Red
Write-Host "   High Battery (>70%): $highBattery vehicles" -ForegroundColor Green

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green