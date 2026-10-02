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

# Crop MB Bank VietQR without any of the "MB Bank" text at the bottom:
# Top header "VIETQR PRO" starts at y=200. Let's start at y=192.
# Footer "napas 247 | MB" ends around y=572.
# x starts at 960, width = 295.
# Height: 575 - 192 = 383
Crop-Image 960 192 295 383 "mbbank-vietqr"

# Also pure square QR for MB Bank:
# Black bbox: x=[993 .. 1223], y=[251 .. 481].
# Square with 16px quiet zone:
# x = 993 - 16 = 977, y = 251 - 16 = 235, w = 231 + 32 = 263, h = 263
Crop-Image 977 235 263 263 "mbbank-qr-square"

$bmp.Dispose()
