Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Check row y from 530 to 580 for column x=1100 (near MB logo)
for ($y = 530; $y -le 580; $y++) {
    $nonWhite = 0
    for ($x = 980; $x -le 1230; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            $nonWhite++
        }
    }
    Write-Host "y=$y : non-white pixels = $nonWhite"
}

$bmp.Dispose()
