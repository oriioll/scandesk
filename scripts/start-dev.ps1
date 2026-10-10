## Starts all services in dev mode

$BASE_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$ROOT_DIR = Join-Path $BASE_DIR ".."

Write-Host "Starting Angular..."
Start-Process powershell -ArgumentList "cd `"$ROOT_DIR/angular`"; ng serve"

Write-Host "Starting Node..."
Start-Process powershell -ArgumentList "cd `"$ROOT_DIR/node`"; npm run dev"

Write-Host "Starting Laravel..."
Start-Process powershell -ArgumentList "cd `"$ROOT_DIR/laravel`"; php artisan serve"

Write-Host "All started-up!"
