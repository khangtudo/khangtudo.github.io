Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$img = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source image: $($img.Width) x $($img.Height)"

# The actual image is 1344 x 738
# Scale factor compared to 1200x675 is approx 1344/1200 = 1.12
function Crop-Image($source, $rect, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $rect.Width, $rect.Height)
    $g.DrawImage($source, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved: $outPath ($($rect.Width)x$($rect.Height))"
}

# 1. Ko-fi: x=65, y=300, w=285, h=285
$rectKofi = New-Object System.Drawing.Rectangle(65, 300, 285, 285)
Crop-Image $img $rectKofi "C:\Users\ADMIN\projects\inid.me\assets\donate\kofi-qr.png"

# 2. Momo: x=425, y=300, w=285, h=285
$rectMomo = New-Object System.Drawing.Rectangle(425, 300, 285, 285)
Crop-Image $img $rectMomo "C:\Users\ADMIN\projects\inid.me\assets\donate\momo-qr.png"

# 3. MB Bank VietQR (Toàn bộ thẻ VietQR): x=800, y=275, w=275, h=370
$rectMB = New-Object System.Drawing.Rectangle(800, 275, 275, 370)
Crop-Image $img $rectMB "C:\Users\ADMIN\projects\inid.me\assets\donate\mbbank-vietqr.png"

$img.Dispose()
Write-Host "Accurate cropping completed!"
