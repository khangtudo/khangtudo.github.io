Add-Type -AssemblyName System.Drawing

function Check-Img($p, $name) {
    $img = [System.Drawing.Image]::FromFile($p)
    Write-Host "$name : $($img.Width) x $($img.Height)"
    $img.Dispose()
}

Check-Img "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\d7759a64-2839-4afe-9ecc-585861193f48.png" "Card Front"
Check-Img "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\cf7af421-45ae-4c8b-b74a-498d534726fb.png" "Card Back"
Check-Img "C:\Users\ADMIN\aicoworker\openclaw\media\outbound\1b114506-ff2f-45d3-9e54-5666429f13cc.png" "Screen Result"
