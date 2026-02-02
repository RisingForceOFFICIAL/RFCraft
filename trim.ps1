$f = "C:\Users\RisingForce\Documents\atom's worst templates\minecraft\index.html"
$c = [System.IO.File]::ReadAllText($f)
$lastNewline = $c.LastIndexOf([char]10)
$c = $c.Substring(0, $lastNewline + 1)
[System.IO.File]::WriteAllText($f, $c)
Write-Host "Trimmed. New size:" (Get-Item $f).Length
