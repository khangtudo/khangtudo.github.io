from PIL import Image

src = r'C:\Users\ADMIN\aicoworker\openclaw\media\outbound\8adfee01-3f78-4dde-af8a-ffd964c345b9.png'
img = Image.open(src)
w, h = img.size
print(f"Loaded image size: {w}x{h}")

# The image is 1200x675
# Let's crop the 3 payment cards accurately:
# 1. Ko-fi (Left card)
kofi = img.crop((50, 260, 310, 560))
kofi.save(r'C:\Users\ADMIN\projects\inid.me\assets\donate\kofi-qr.png')

# 2. Momo (Center card)
momo = img.crop((370, 260, 630, 560))
momo.save(r'C:\Users\ADMIN\projects\inid.me\assets\donate\momo-qr.png')

# 3. MB Bank VietQR (Right card including VietQR header & bank info)
mbbank = img.crop((700, 240, 950, 650))
mbbank.save(r'C:\Users\ADMIN\projects\inid.me\assets\donate\mbbank-vietqr.png')

print("All 3 QR codes cropped and saved successfully!")
