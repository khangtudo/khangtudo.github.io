Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-Image($x, $y, $w, $h, $name) {
    $crop = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($crop)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    # Fill white background
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

# 1. Ko-fi pure QR code with clean quiet zone
# Black bbox: [100..379], [225..504]. Center: x=239.5, y=364.5. Let's make it a 320x320 square centered:
# x = 240 - 160 = 80, y = 365 - 160 = 205
Crop-Image 80 205 320 320 "kofi-qr"

# 2. Momo pure QR code with clean quiet zone
# Black bbox: [534..812], [225..503]. Center: x=673, y=364. Center 320x320 square:
# x = 673 - 160 = 513, y = 364 - 160 = 204
Crop-Image 513 204 320 320 "momo-qr"

# 3. MB Bank VietQR Full Template (Including VietQR Pro logo, QR code, napas 247 | MB)
# Non-white box: x=[981..1233] (center=1107), y=[201..579] (h=378)
# Let's crop from x=962 to 1252 (w=290), y=186 to 596 (h=410):
Crop-Image 960 186 295 410 "mbbank-vietqr"

# Also crop pure square QR of MB Bank in case needed:
# Black bbox: [993..1223] (center=1108), [251..481] (center=366). Center 280x280 square:
# x = 1108 - 140 = 968, y = 366 - 140 = 226
Crop-Image 968 226 280 280 "mbbank-qr-pure"

$bmp.Dispose()
Write-Host "All QR codes cleanly exported!"
