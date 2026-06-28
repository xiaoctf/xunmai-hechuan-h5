import argparse
import json
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont
from qrcode.image.svg import SvgPathImage


ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "docs" / "二维码链接配置.json"
OUT_DIR = ROOT / "assets" / "qr"


def resolve_url(entry, base_url, survey_url):
    if entry["file"] == "survey":
        template = entry.get("url_template") if survey_url else entry.get("temporary_url_template")
        return template.replace("{SURVEY_URL}", survey_url).replace("{BASE_URL}", base_url)
    return entry["url_template"].replace("{BASE_URL}", base_url)


def load_font(size):
    candidates = [
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simsun.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def make_png_card(url, label, output_path):
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_Q,
        box_size=12,
        border=3,
    )
    qr.add_data(url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#261d18", back_color="#f7f1e5").convert("RGB")

    pad = 54
    label_h = 92
    card_w = qr_img.width + pad * 2
    card_h = qr_img.height + pad * 2 + label_h
    card = Image.new("RGB", (card_w, card_h), "#f7f1e5")
    draw = ImageDraw.Draw(card)

    draw.rounded_rectangle(
        (18, 18, card_w - 18, card_h - 18),
        radius=20,
        outline="#b43d2d",
        width=3,
    )
    card.paste(qr_img, (pad, pad))

    title_font = load_font(30)
    small_font = load_font(18)
    draw.text((pad, qr_img.height + pad + 24), label, fill="#261d18", font=title_font)
    draw.text((pad, qr_img.height + pad + 62), "寻脉合川 H5 数字导览入口", fill="#725f52", font=small_font)
    card.save(output_path)


def make_svg(url, output_path):
    img = qrcode.make(
        url,
        image_factory=SvgPathImage,
        error_correction=qrcode.constants.ERROR_CORRECT_Q,
        box_size=12,
        border=3,
    )
    img.save(output_path)


def main():
    parser = argparse.ArgumentParser(description="Generate QR codes for the Hechuan H5 package.")
    parser.add_argument("--base-url", default="http://localhost:8080", help="GitHub Pages base URL or local preview URL.")
    parser.add_argument("--survey-url", default="", help="Final survey URL. If empty, use #survey anchor.")
    args = parser.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    manifest = []

    for entry in config["entries"]:
        url = resolve_url(entry, args.base_url.rstrip("/"), args.survey_url.strip())
        stem = entry["file"]
        png_path = OUT_DIR / f"{stem}.png"
        svg_path = OUT_DIR / f"{stem}.svg"
        make_png_card(url, entry["label"], png_path)
        make_svg(url, svg_path)
        manifest.append(
            {
                "name": entry["name"],
                "label": entry["label"],
                "url": url,
                "png": str(png_path.relative_to(ROOT)).replace("\\", "/"),
                "svg": str(svg_path.relative_to(ROOT)).replace("\\", "/"),
                "usage": entry["usage"],
            }
        )

    (OUT_DIR / "qr-manifest.json").write_text(
        json.dumps({"base_url": args.base_url.rstrip("/"), "entries": manifest}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Generated {len(manifest)} QR entries in {OUT_DIR}")
    for item in manifest:
        print(f"- {item['name']}: {item['url']}")


if __name__ == "__main__":
    main()
