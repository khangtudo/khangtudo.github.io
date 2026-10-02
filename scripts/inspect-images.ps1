Add-Type -AssemblyName System.Drawing

function Analyze-Image($path) {
    $img = [System.Drawing.Image]::FromFile($path)
    Write-Host "File: $path"
    Write-Host "Dimensions: $($img.Width) x $($img.Height)"
    $img.Dispose()
}

Analyze-Image "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png"
Analyze-Image "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\7398dad9-8895-4d4c-a1da-dfa08aa931fa.png"
