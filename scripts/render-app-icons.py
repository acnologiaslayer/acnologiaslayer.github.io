#!/usr/bin/env python3
"""Rasterise an Arcane app-icon SVG into the platform icon sets.

Chrome headless is used as the renderer (it is the only SVG rasteriser
available on this machine), then Pillow assembles the multi-resolution .ico
and .icns containers.

Usage: render-app-icons.py <icon.svg> <outdir> [--tauri | --electron]
"""
import subprocess
import sys
import struct
from pathlib import Path
from PIL import Image

CHROME = "google-chrome"


def render(svg: Path, size: int, out: Path) -> None:
    """Render the SVG at an exact pixel size.

    Chrome enforces a minimum window width (roughly 500px on Linux), so small
    icons cannot be screenshotted directly: the result is a crop of a much
    wider viewport and the artwork lands outside it. Everything is therefore
    rendered once at a large master size and downsampled with Lanczos, which
    also gives better small-size antialiasing than the browser would.
    """
    master = 1024
    cache = out.parent / f"_master_{svg.stem}.png"
    if not cache.exists():
        html = Path("/tmp/_icon_render.html")
        html.write_text(
            f'<html><body style="margin:0">'
            f'<img src="file://{svg}" width="{master}" height="{master}">'
            f"</body></html>"
        )
        subprocess.run(
            [
                CHROME,
                "--headless",
                "--disable-gpu",
                "--no-sandbox",
                "--hide-scrollbars",
                "--default-background-color=00000000",
                f"--screenshot={cache}",
                f"--window-size={master},{master}",
                f"file://{html}",
            ],
            check=True,
            capture_output=True,
        )
        im = Image.open(cache).convert("RGBA").crop((0, 0, master, master))
        im.save(cache)

    im = Image.open(cache).convert("RGBA")
    if size != master:
        im = im.resize((size, size), Image.LANCZOS)
    im.save(out)


def build_icns(pngs: dict, out: Path) -> None:
    """Assemble an .icns from PNG payloads (Apple icon container format)."""
    types = {16: b"icp4", 32: b"icp5", 64: b"icp6", 128: b"ic07", 256: b"ic08", 512: b"ic09", 1024: b"ic10"}
    body = b""
    for size, t in types.items():
        if size not in pngs:
            continue
        data = pngs[size].read_bytes()
        body += t + struct.pack(">I", len(data) + 8) + data
    out.write_bytes(b"icns" + struct.pack(">I", len(body) + 8) + body)


def main() -> None:
    svg = Path(sys.argv[1]).resolve()
    outdir = Path(sys.argv[2])
    mode = sys.argv[3] if len(sys.argv) > 3 else "--tauri"
    outdir.mkdir(parents=True, exist_ok=True)
    tmp = Path("/tmp/_icons")
    tmp.mkdir(exist_ok=True)

    sizes = [16, 32, 48, 64, 128, 256, 512, 1024]
    rendered = {}
    for s in sizes:
        p = tmp / f"{s}.png"
        render(svg, s, p)
        rendered[s] = p

    if mode == "--tauri":
        named = {
            "32x32.png": 32,
            "64x64.png": 64,
            "128x128.png": 128,
            "128x128@2x.png": 256,
            "icon.png": 512,
            "logo.png": 512,
            "Square30x30Logo.png": 30,
            "Square44x44Logo.png": 44,
            "Square71x71Logo.png": 71,
            "Square89x89Logo.png": 89,
            "Square107x107Logo.png": 107,
            "Square142x142Logo.png": 142,
            "Square150x150Logo.png": 150,
            "Square284x284Logo.png": 284,
            "Square310x310Logo.png": 310,
            "StoreLogo.png": 50,
        }
    else:
        named = {"icon.png": 512, "logo.png": 512}

    for name, size in named.items():
        if size in rendered:
            Image.open(rendered[size]).convert("RGBA").save(outdir / name)
        else:
            p = tmp / f"n{size}.png"
            render(svg, size, p)
            Image.open(p).convert("RGBA").save(outdir / name)

    # Windows .ico: multi-resolution
    Image.open(rendered[256]).convert("RGBA").save(
        outdir / "icon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    )
    # macOS .icns
    build_icns(rendered, outdir / "icon.icns")
    print(f"wrote icon set to {outdir}")


if __name__ == "__main__":
    main()
