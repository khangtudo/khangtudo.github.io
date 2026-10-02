Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"

function Get-Black-BBox($minColX, $maxColX, $minRowY, $maxRowY, $label) {
    $minX = 9999; $maxX = -1; $minY = 9999; $maxY = -1
    for ($x = $minColX; $x -lt $maxColX; $x++) {
        for ($y = $minRowY; $y -lt $maxRowY; $y++) {
            $p = $bmp.GetPixel($x, $y)
            # Black pixel in QR code
            if ($p.R -lt 40 -and $p.G -lt 40 -and $p.B -lt 40) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    Write-Host "$label QR Black BBox: x=[$minX .. $maxX] (w=$($maxX - $minX + 1)), y=[$minY .. $maxY] (h=$($maxY - $minY + 1))"
    return @{ minX = $minX; maxX = $maxX; minY = $minY; maxY = $maxY }
}

# The 3 QR codes are situated between y=150 and y=550 (below header and above text labels)
$kofiBox = Get-Black-BBox 50 450 180 550 "Ko-fi"
$momoBox = Get-Black-BBox 460 900 180 550 "Momo"
# For MB Bank, let's find the QR code box (y: 200..530)
$mbBox = Get-Black-BBox 920 1300 200 530 "MB Bank QR"

# Also let's check where the labels and logos are for MB Bank:
# VIETQR PRO logo is above the QR (around y: 180..230)
# napas 247 | MB is below the QR (around y: 510..560)

$bmp.Dispose()
