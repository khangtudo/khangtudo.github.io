Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-Image($x, $y, $w, $h, $name) {
    $crop = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($crop)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $dest = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $src = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $g.DrawImage($bmp, $dest, $src, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $crop.Save("C:\Users\ADMIN\projects\inid.me\assets\donate\$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
    Write-Host "Saved $name : $w x $h"
}

# In 8adfee01 (1344 x 738):
# Card 1 (Ko-fi):
# The white rounded card is around x=60, y=175, w=360, h=360.
# The QR code itself with white quiet zone is x=80, y=195, w=320, h=320.
Crop-Image 60 175 360 360 "kofi-card"
Crop-Image 80 195 320 320 "kofi-qr-clean"

# Card 2 (Momo):
# The white rounded card is around x=490, y=175, w=360, h=360.
# The QR code itself with white quiet zone is x=510, y=195, w=320, h=320.
Crop-Image 490 175 360 360 "momo-card"
Crop-Image 510 195 320 320 "momo-qr-clean"

# Card 3 (MB Bank VietQR):
# Notice: In 8adfee01, the third card is at x=920, y=175.
# Let's check its full height: top header is at y=190, bottom napas/MB logo is at y=560.
# Full VietQR card: x=920, y=175, w=360, h=400.
# Pure VietQR square code inside:
Crop-Image 920 175 360 405 "mbbank-card-full"
Crop-Image 975 240 250 250 "mbbank-qr-clean"

$bmp.Dispose()
