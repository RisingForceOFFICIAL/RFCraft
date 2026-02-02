$lines = Get-Content "C:\Users\RisingForce\Documents\atom's worst templates\minecraft\index.html"
$script = $lines[280..4117] -join "`n"
Set-Content -Path "C:\Users\RisingForce\Documents\atom's worst templates\minecraft\_check.js" -Value $script
node --check "C:\Users\RisingForce\Documents\atom's worst templates\minecraft\_check.js" 2>&1
