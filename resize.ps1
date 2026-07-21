Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('Z:\SHOP_CLI\UniqueSofa\reference UI.png')
$ratio = 900.0 / $img.Width
$newW = 900
$newH = [int]($img.Height * $ratio)
$bmp = New-Object System.Drawing.Bitmap($newW, $newH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, 0, 0, $newW, $newH)
$bmp.Save('Z:\SHOP_CLI\UniqueSofa\ref_small.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
Write-Host "done $newW x $newH"
