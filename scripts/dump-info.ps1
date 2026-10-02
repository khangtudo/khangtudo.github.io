Add-Type -AssemblyName System.Drawing

function Dump-Image-Info($path, $tag) {
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    Write-Host "=== Tag: $tag Dimensions: $($bmp.Width) x $($bmp.Height) ==="
    
    # Save a thumbnail 600px wide to inspect if needed
    $thumb = New-Object System.Drawing.Bitmap(600, [int]($bmp.Height * 600 / $bmp.Width))
    $g = [System.Drawing.Graphics]::FromImage($thumb)
    $g.DrawImage($bmp, 0, 0, $thumb.Width, $thumb.Height)
    $g.Dispose()
    $thumb.Save("C:\Users\ADMIN\projects\inid.me\assets\donate\thumb-$tag.png")
    $thumb.Dispose()
    $bmp.Dispose()
}

Dump-Image-Info "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png" "img1"
Dump-Image-Info "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\7398dad9-8895-4d4c-a1da-dfa08aa931fa.png" "img2"
