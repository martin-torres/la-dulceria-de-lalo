import qrcode
from PIL import Image

url = "https://candy-cush.vercel.app"

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

logo_path = "/Users/lomalinda007yahoo.com/Documents/Project Apps/La Dulceria de Lalo/public/logo-source.png"
try:
    logo = Image.open(logo_path)
    qr_width, qr_height = qr_img.size
    logo_size = int(qr_width * 0.3)
    logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
    pos = ((qr_width - logo_size) // 2, (qr_height - logo_size) // 2)
    qr_img.paste(logo, pos)
    print(f"Logo embedded from {logo_path}")
except Exception as e:
    print(f"Could not embed logo: {e}")

output_path = "/Users/lomalinda007yahoo.com/Documents/Project Apps/La Dulceria de Lalo/public/qr-code.png"
qr_img.save(output_path)
print(f"QR code saved to: {output_path}")
print(f"URL: {url}")
