$c = [System.IO.File]::ReadAllText("C:\Users\RisingForce\Documents\atom's worst templates\minecraft\index.html")
$idx = $c.IndexOf("function spawnZombie")
$snippet = $c.Substring($idx, [Math]::Min(500, $c.Length - $idx))
Write-Host $snippet
Write-Host "---"
Write-Host "Total length:" $c.Length
# Check for syntax issues - count braces
$open = ($c.ToCharArray() | Where-Object {$_ -eq '{'}).Count
$close = ($c.ToCharArray() | Where-Object {$_ -eq '}'}).Count
Write-Host "Open braces: $open, Close braces: $close"
