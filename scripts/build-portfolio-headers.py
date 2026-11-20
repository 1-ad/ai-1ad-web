#!/usr/bin/env python3
"""Compose portfolio headers from the unmodified backup PNGs using ImageMagick.

Run from any directory: python3 scripts/build-portfolio-headers.py
The website uses only the resulting 600 × 200 JPEGs; no runtime dependency is added.
"""

from pathlib import Path
import shutil
import subprocess
import tempfile


ROOT = Path(__file__).resolve().parents[1]
SCALE = 3
WIDTH, HEIGHT = 600, 200

# Each placement is (banner size, center x, center y, displayed width).
# Oversized cards extend just beyond the scene, like the existing gallery headers.
FIVE = [
    ("300x600", 65, 100, 105),
    ("160x600", 174, 100, 52),
    ("300x250", 310, 92, 163),
    ("970x250", 487, 62, 215),
    ("728x90", 498, 143, 238),
]
SIX = [
    ("300x600", 65, 100, 105),
    ("160x600", 174, 100, 52),
    ("300x250", 310, 92, 163),
    ("300x50", 453, 46, 135),
    ("320x50", 477, 92, 155),
    ("728x90", 493, 153, 230),
]
FOUR = [
    ("300x600", 100, 100, 110),
    ("160x600", 215, 90, 56),
    ("300x250", 389, 82, 165),
    ("728x90", 445, 160, 250),
]
TWO_PORTRAIT = [("300x600", 171, 100, 112), ("300x250", 385, 93, 225)]
TWO_LANDSCAPE = [("300x250", 166, 100, 230), ("728x90", 450, 110, 290)]
THREE = [("300x600", 120, 100, 122), ("300x250", 324, 87, 190),
         ("728x90", 467, 155, 255)]
THREE_NARROW = [("160x600", 100, 100, 62), ("300x250", 305, 86, 190),
                ("728x90", 466, 164, 255)]
THREE_WIDE = [("300x600", 86, 100, 112), ("300x250", 268, 105, 180),
              ("970x250", 477, 92, 220)]

HEADERS = [
    ("blackberry/mtd", "#e0e9ee", "#7b9eaf", FIVE),
    ("box/bubbles", "#2687f2", "#004bab", TWO_PORTRAIT),
    ("box/cuttingcost", "#d7e8eb", "#83aeb8", TWO_PORTRAIT),
    ("databricks/zipline", "#f5f7f8", "#cbdce2", SIX),
    ("klaviyo/intro", "#50383f", "#292734", FIVE),
    ("flex/holiday_rearhandle", "#464a4b", "#101214", TWO_LANDSCAPE),
    ("jelmyto/aua-2021", "#c6eaf0", "#7765a8", SIX),
    ("jelmyto/kidney", "#e8e5f1", "#a398c0", FOUR),
    ("jelmyto/npp-patid", "#e0eff8", "#a99ac6", SIX),
    ("qualcomm/big-ideas", "#8c704a", "#322a23", THREE),
    ("qualcomm/built-in-ai", "#4c456b", "#151b35", THREE),
    ("qualcomm/levitate", "#3e6f86", "#1b2447", THREE),
    ("qualcomm/multiply", "#b5d8df", "#536a8c", THREE),
    ("qualcomm/revolution", "#d6142c", "#590715", THREE),
    ("loreal/bambieye", "#e8c5b9", "#af887b", TWO_PORTRAIT),
    ("hp/cadalyst", "#555860", "#1a1b1f", THREE_WIDE),
    ("hp/carepackprogram", "#eaf5f9", "#9fcedd", THREE_NARROW),
    ("hp/collaboration", "#fbe0ef", "#b13a83", THREE_NARROW),
    ("hp/manageability", "#d9b4f9", "#7b3bb0", THREE_NARROW),
]


def run(*args):
    subprocess.run(["magick", *map(str, args)], check=True)


def main():
    if not shutil.which("magick"):
        raise SystemExit("ImageMagick (magick) is required to rebuild these headers.")

    with tempfile.TemporaryDirectory(prefix="portfolio-headers-") as work:
        work = Path(work)
        for campaign, top, bottom, placements in HEADERS:
            campaign_dir = ROOT / "portfolio" / campaign
            sizes = {p.parent.name for p in campaign_dir.glob("*/backup.png")}
            assert sizes == {p[0] for p in placements}, campaign
            background = work / "background.png"
            run("-size", f"{WIDTH * SCALE}x{HEIGHT * SCALE}",
                f"gradient:{top}-{bottom}", background)
            compose = [background]
            for index, (size, x, y, width) in enumerate(placements):
                ad_width, ad_height = map(int, size.split("x"))
                height = width * ad_height / ad_width
                card = work / f"card-{index}.png"
                run(campaign_dir / size / "backup.png",
                    "-resize", f"{round(width * SCALE)}x{round(height * SCALE)}!",
                    "-background", "none", "-rotate", "-14", "+repage",
                    "(", "+clone", "-background", "black", "-shadow", "38x9+9+15", ")",
                    "+swap", "-background", "none", "-layers", "merge", "+repage", card)
                dx, dy = round((x - WIDTH / 2) * SCALE), round((y - HEIGHT / 2) * SCALE)
                compose.extend([card, "-gravity", "center", "-geometry", f"{dx:+d}{dy:+d}",
                                "-compose", "over", "-composite"])
            output = ROOT / "site" / "img" / (campaign.replace("/", "_") + ".jpg")
            run(*compose, "-resize", f"{WIDTH}x{HEIGHT}!", "-strip",
                "-sampling-factor", "4:4:4", "-quality", "92", output)
            print(output.relative_to(ROOT))


if __name__ == "__main__":
    main()
