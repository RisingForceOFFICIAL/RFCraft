$base = "C:\Users\RisingForce\Documents\atom's worst templates\minecraft"
$main = Join-Path $base "index.html"
$parts = @("cont1.js", "cont2.js", "cont3.js", "cont4.js")

foreach ($p in $parts) {
    $content = [System.IO.File]::ReadAllText((Join-Path $base $p))
    [System.IO.File]::AppendAllText($main, $content)
    Write-Host "Appended $p - File size now:" (Get-Item $main).Length
}

# Verify ending
$text = [System.IO.File]::ReadAllText($main)
$trimmed = $text.TrimEnd()
if ($trimmed.EndsWith("</html>")) {
    Write-Host "SUCCESS: File ends with </html>"
} else {
    $lastChars = $trimmed.Substring([Math]::Max(0, $trimmed.Length - 50))
    Write-Host "WARNING: File does NOT end with </html>. Last chars: $lastChars"
}

Write-Host "Final size:" (Get-Item $main).Length
