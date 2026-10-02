Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"

# Sample horizontal line across the cards around y = 350
$line = ""
for ($x = 0; $x -lt $bmp.Width; $x += 10) {
    $pixel = $bmp.GetPixel($x, 350)
    # If bright/white: W, if dark: D, if colored: C
    if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) {
        $c = "W"
    } elseif ($pixel.R -lt 50 -and $pixel.G -lt 50 -and $pixel.B -lt 50) {
        $c = "B"
    } else {
        $c = "."
    }
    $line += $c
}
Write-Host "Sample y=350: $line"
$bmp.Dispose()
