$c = [System.IO.File]::ReadAllText("C:\Users\RisingForce\Documents\atom's worst templates\minecraft\index.html")

# Extract script content between first <script> tag body and closing </script>
$startTag = "<script>"
$endTag = "</scr" + "ipt>"
$si = $c.IndexOf($startTag)
$ei = $c.LastIndexOf($endTag)
Write-Host "Script tag at: $si"
Write-Host "End script at: $ei"

if ($si -ge 0 -and $ei -ge 0) {
    $jsStart = $si + $startTag.Length
    # Skip the src script tag - find second <script>
    $si2 = $c.IndexOf($startTag, $si + 1)
    if ($si2 -gt $si) {
        $jsStart = $si2 + $startTag.Length
        Write-Host "Second script tag at: $si2"
    }
    $js = $c.Substring($jsStart, $ei - $jsStart)
    $open = 0
    $close = 0
    foreach ($ch in $js.ToCharArray()) {
        if ($ch -eq '{') { $open++ }
        if ($ch -eq '}') { $close++ }
    }
    Write-Host "JS braces - Open: $open, Close: $close, Diff: $($open - $close)"
    # Save JS for node validation
    [System.IO.File]::WriteAllText("C:\Users\RisingForce\Documents\atom's worst templates\minecraft\temp_validate.js", $js)
}
