Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-Image($x, $y, $w, $h, $name) {
    $crop = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($crop)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::White)
    $dest = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $src = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $g.DrawImage($bmp, $dest, $src, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $outPath = "C:\Users\ADMIN\projects\inid.me\assets\donate\$name.png"
    $crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
    Write-Host "Exported: $name ($w x $h)"
}

# 1. Ko-fi QR: Pure square QR code (320x320)
Crop-Image 80 205 320 320 "kofi-qr"

# 2. Momo QR: Pure square QR code (320x320)
Crop-Image 513 204 320 320 "momo-qr"

# 3. MB Bank VietQR: Complete VietQR Pro card with its logos, exactly ending above the blue text
Crop-Image 960 185 295 365 "mbbank-vietqr"

# 4. MB Bank Pure Square QR (for standard square display)
Crop-Image 977 235 263 263 "mbbank-qr-square"

$bmp.Dispose()
Write-Host "All crops saved with perfection!"
