Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$img = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source image: $($img.Width) x $($img.Height)"

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
    Write-Host "Saved: $outPath"
}

# Image width is 1200, height is 675
# 1. Ko-fi (Left QR box: x=50, y=260, w=260, h=300)
$rectKofi = New-Object System.Drawing.Rectangle(55, 270, 255, 260)
Crop-Image $img $rectKofi "C:\Users\ADMIN\projects\inid.me\assets\donate\kofi-qr.png"

# 2. Momo (Center QR box: x=370, y=260, w=260, h=300)
$rectMomo = New-Object System.Drawing.Rectangle(375, 270, 255, 260)
Crop-Image $img $rectMomo "C:\Users\ADMIN\projects\inid.me\assets\donate\momo-qr.png"

# 3. MB Bank VietQR (Right card: x=710, y=250, w=245, h=330)
$rectMB = New-Object System.Drawing.Rectangle(710, 250, 245, 330)
Crop-Image $img $rectMB "C:\Users\ADMIN\projects\inid.me\assets\donate\mbbank-vietqr.png"

$img.Dispose()
Write-Host "All 3 QR codes cropped successfully!"
