Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"

# Let's inspect the cards:
# Card 1 (Ko-fi): around x: 60..420, y: 180..540
# Card 2 (Momo): around x: 500..840, y: 180..540
# Card 3 (MB Bank): around x: 920..1280, y: 180..540

# Let's crop candidate regions and check their exact sizes
function Test-Crop($x, $y, $w, $h, $name) {
    $crop = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($crop)
    $dest = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $src = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $g.DrawImage($bmp, $dest, $src, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $crop.Save("C:\Users\ADMIN\projects\inid.me\assets\donate\$name.png")
    $crop.Dispose()
}

# The 3 cards are on a white background with a subtle border/shadow:
# Card 1: x=65, y=190, w=350, h=350 ? Let's check:
Test-Crop 60 180 360 360 "test-card-1"
Test-Crop 490 180 360 360 "test-card-2"
Test-Crop 920 180 360 360 "test-card-3"

$bmp.Dispose()
Write-Host "Test crops generated!"
