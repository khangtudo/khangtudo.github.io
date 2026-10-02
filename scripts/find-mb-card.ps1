Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

$minX = 9999; $maxX = -1; $minY = 9999; $maxY = -1
for ($x = 940; $x -lt 1280; $x++) {
    for ($y = 170; $y -lt 580; $y++) {
        $p = $bmp.GetPixel($x, $y)
        # Not white (content of VietQR logo, QR, or footer logo)
        if ($p.R -lt 245 -or $p.G -lt 245 -or $p.B -lt 245) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "MB Bank Card Non-White Box: x=[$minX .. $maxX] (w=$($maxX - $minX + 1)), y=[$minY .. $maxY] (h=$($maxY - $minY + 1))"

$bmp.Dispose()
