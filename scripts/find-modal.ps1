Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Let's save crops of various regions to inspect them
function Save-Crop($x, $y, $w, $h, $name) {
    $crop = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($crop)
    $dest = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $src = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $g.DrawImage($bmp, $dest, $src, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $out = "C:\Users\ADMIN\projects\inid.me\assets\donate\$name.png"
    $crop.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
    Write-Host "Saved $name ($w x $h)"
}

# In 8adfee01-3f78-4dde-af8a-ffd964c345b9.png:
# Let's crop the whole modal content area or 3 columns
# Total width 1344, height 738
# Modal seems centered. Let's find modal boundaries first.
# Check vertical column around x=200, x=672, x=1100
for ($y = 50; $y -lt 700; $y += 50) {
    $p1 = $bmp.GetPixel(200, $y)
    $p2 = $bmp.GetPixel(672, $y)
    $p3 = $bmp.GetPixel(1100, $y)
    Write-Host "y=$y | 200: $($p1.R),$($p1.G),$($p1.B) | 672: $($p2.R),$($p2.G),$($p2.B) | 1100: $($p3.R),$($p3.G),$($p3.B)"
}

$bmp.Dispose()
