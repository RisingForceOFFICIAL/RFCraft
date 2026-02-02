$c = [System.IO.File]::ReadAllText("C:\Users\RisingForce\Documents\atom's worst templates\minecraft\index.html")
$idx = $c.IndexOf("spawnZombie")
Write-Host "spawnZombie at index: $idx"
if ($idx -ge 0) {
    $snippet = $c.Substring($idx, [Math]::Min(400, $c.Length - $idx))
    Write-Host $snippet
}
Write-Host "---"
# Count braces in script section only
$scriptIdx = $c.IndexOf("<script>")
$scriptEnd = $c.IndexOf("</script>")
if ($scriptIdx -ge 0 -and $scriptEnd -ge 0) {
    $script = $c.Substring($scriptIdx, $scriptEnd - $scriptIdx)
    $open = ($script.ToCharArray() | Where-Object {$_ -eq '{'}).Count
    $close = ($script.ToCharArray() | Where-Object {$_ -eq '}'}).Count
    Write-Host "Script braces - Open: $open, Close: $close, Diff: $($open - $close)"
}
