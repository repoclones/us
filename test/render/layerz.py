#!/usr/bin/env python3
"""
atlas_layers_tool.py

Features:
[1] Export layers (crop SubTexture entries from atlas JSON + PNG)
    - naming modes: path | ordered | flat

[2] Layers -> HTML / PSD
    - HTML: generates an HTML file that draws layers positioned & sized according to atlas JSON
    - PSD: attempts to create a layered PSD (best-effort). If no PSD writer available,
           falls back to creating a ZIP of layer PNGs + manifest.

Dependencies:
    pip install pillow

Optional (for PSD output):
    - psd_tools (if it supports writing on your environment) OR psdwriter
    If not present, script falls back to ZIP fallback.

Usage:
    python atlas_layers_tool.py
"""

import json
import os
import sys
import math
from pathlib import Path
from PIL import Image

try:
    # Optional PSD writer libs (not guaranteed available)
    import psd_tools  # often read-only, may not support writing
except Exception:
    psd_tools = None

import zipfile

# -------------------------
# Utilities
# -------------------------
def ensure_dir(path):
    Path(path).mkdir(parents=True, exist_ok=True)

def sanitize_for_fs(s: str) -> str:
    # Replace problematic characters for file/folder names
    return s.replace("\\", "_").replace("/", "_").replace(":", "_")

# -------------------------
# Export layers
# -------------------------
def export_layers(atlas_json_path, atlas_png_path, out_dir, naming="path"):
    """
    atlas_json_path: path to atlas json (structure with "SubTexture" list and "width","height")
    atlas_png_path: path to the atlas PNG
    out_dir: folder to write exported PNGs
    naming: "path" | "ordered" | "flat"
    returns list of dict {name, out_path, x,y,width,height}
    """
    with open(atlas_json_path, "r", encoding="utf-8") as f:
        atlas = json.load(f)
    subtextures = atlas.get("SubTexture") or atlas.get("subtextures") or []
    atlas_w = atlas.get("width", None)
    atlas_h = atlas.get("height", None)

    img = Image.open(atlas_png_path).convert("RGBA")

    base_out = Path(out_dir)
    ensure_dir(base_out)
    exported = []

    for idx, s in enumerate(subtextures):
        name = s.get("name") or s.get("path") or f"sub_{idx}"
        x = int(s.get("x", 0))
        y = int(s.get("y", 0))
        w = int(s.get("width", s.get("width", 0)))
        h = int(s.get("height", s.get("height", 0)))

        # crop region (ensure not out of bounds)
        box = (x, y, x + w, y + h)
        cropped = img.crop(box)

        if naming == "path":
            # Treat slashes in name as folders; sanitize each part
            parts = [sanitize_for_fs(p) for p in name.split("/") if p != ""]
            target_dir = base_out.joinpath(*parts[:-1]) if len(parts) > 1 else base_out
            ensure_dir(target_dir)
            filename = sanitize_for_fs(parts[-1]) + ".png"
            out_path = target_dir / filename
        elif naming == "ordered":
            # prefix by zero-padded index, keep path structure but convert slashes to underscores
            safe = sanitize_for_fs(name).replace("/", "_")
            idx_str = str(idx+1).zfill(3)
            target_dir = base_out
            ensure_dir(target_dir)
            out_path = target_dir / f"{idx_str}_{safe}.png"
        else:  # flat
            safe = sanitize_for_fs(name.split("/")[-1])
            out_path = base_out / (safe + ".png")

        cropped.save(out_path)
        exported.append({
            "name": name,
            "out_path": str(out_path),
            "x": x, "y": y, "width": w, "height": h,
            "index": idx
        })
        print(f"[export] {name} -> {out_path}  ({w}x{h} @ {x},{y})")

    print(f"[done] exported {len(exported)} layers to {base_out}")
    return exported, atlas_w, atlas_h

# -------------------------
# HTML generator
# -------------------------
HTML_TEMPLATE = """<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>DragonBones Frame 0 Preview</title>
<style>
  html,body{{margin:0;padding:0;background:#222;color:#fff;font-family:Arial}}
  #stage{{position:relative; width:{w}px; height:{h}px; margin:10px; border:1px solid #444; background:transparent;}}
  #stage img{{position:absolute; image-rendering: optimizeQuality;}}
  .note{{margin:10px;color:#ddd}}
</style>
</head>
<body>
<div class="note">Canvas size: {w}×{h}. Layers follow slot order (first = bottom).</div>
<div id="stage">
{imgs}
</div>
<script>
(function() {{
  const stage = document.getElementById('stage');
  function fit(){{
    const maxW = window.innerWidth - 40;
    const maxH = window.innerHeight - 120;
    const ratio = Math.min(maxW / {w}, maxH / {h}, 1);
    stage.style.transform = 'scale(' + ratio + ')';
    stage.style.transformOrigin = 'top left';
  }}
  window.addEventListener('resize', fit);
  fit();
}})();
</script>
</body>
</html>
"""

def generate_html(ske_json, exported_layers, atlas_w, atlas_h, out_html_path):
    """
    Assemble model at frame 0 using ske.json transforms.
    """
    # Map layer name -> file
    name_to_layer = {Path(l["name"]).name: l for l in exported_layers}

    imgs_html = []
    armature = ske_json["armature"][0]
    for skin in armature.get("skin", []):
        for slot in skin.get("slot", []):
            for display in slot.get("display", []):
                name = Path(display.get("name") or display.get("path")).name
                if name not in name_to_layer:
                    continue
                layer = name_to_layer[name]
                rel_path = os.path.relpath(layer["out_path"], Path(out_html_path).parent)
                rel_path_str = rel_path.replace("\\", "/")

                # Transform
                t = display.get("transform", {})
                tx, ty = t.get("x", 0), t.get("y", 0)
                scx, scy = t.get("scX", 1), t.get("scY", 1)
                rot = t.get("skX", 0)  # in degrees

                style = (
                    f"left:0; top:0; "
                    f"transform: translate({tx}px,{ty}px) "
                    f"rotate({rot}deg) scale({scx},{scy}); "
                    f"transform-origin: center center; "
                )
                img_tag = f'<img src="{rel_path_str}" style="{style}" alt="{name}">'
                imgs_html.append(img_tag)

    html = HTML_TEMPLATE.format(w=atlas_w, h=atlas_h, imgs="\n".join(imgs_html))
    with open(out_html_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"[html] saved -> {out_html_path}")


# -------------------------
# PSD generator (best-effort)
# -------------------------
def generate_psd(ske_json, exported_layers, atlas_w, atlas_h, out_psd_path):
    """
    Assemble model into layered PSD-like output.
    If PSD writing not supported, fallback = ZIP with PNGs + manifest.
    """
    name_to_layer = {Path(l["name"]).name: l for l in exported_layers}
    armature = ske_json["armature"][0]
    layers_for_manifest = []

    if psd_tools:
        try:
            from psd_tools.api.layers import Layer
            from psd_tools.api.psd_image import PSDImage
            psd = PSDImage.new(mode="RGBA", size=(atlas_w, atlas_h))

            # slots (bottom to top)
            for skin in armature.get("skin", []):
                for slot in skin.get("slot", []):
                    for display in slot.get("display", []):
                        name = Path(display.get("name") or display.get("path")).name
                        if name not in name_to_layer:
                            continue
                        layer_info = name_to_layer[name]
                        im = Image.open(layer_info["out_path"]).convert("RGBA")

                        # Apply transform
                        t = display.get("transform", {})
                        tx, ty = t.get("x", 0), t.get("y", 0)
                        scx, scy = t.get("scX", 1), t.get("scY", 1)
                        rot = t.get("skX", 0)

                        canvas = Image.new("RGBA", (atlas_w, atlas_h), (0, 0, 0, 0))
                        temp = im.resize((int(im.width * scx), int(im.height * scy)))
                        temp = temp.rotate(rot, expand=True, center=(temp.width//2, temp.height//2))
                        canvas.paste(temp, (int(tx), int(ty)), temp)

                        layer = Layer.from_image(canvas)
                        layer.name = name
                        psd.append(layer)

            psd.save(out_psd_path)
            print(f"[psd] saved -> {out_psd_path}")
            return
        except Exception as e:
            print("[psd] psd_tools write attempt failed:", e)

    # --- fallback: ZIP of layers + manifest ---
    zip_path = Path(out_psd_path).with_suffix(".zip")
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for skin in armature.get("skin", []):
            for slot in skin.get("slot", []):
                for display in slot.get("display", []):
                    name = Path(display.get("name") or display.get("path")).name
                    if name not in name_to_layer:
                        continue
                    layer_info = name_to_layer[name]
                    arcname = os.path.basename(layer_info["out_path"])
                    zf.write(layer_info["out_path"], arcname)
                    t = display.get("transform", {})
                    layers_for_manifest.append({
                        "name": name,
                        "file": arcname,
                        "x": t.get("x", 0),
                        "y": t.get("y", 0),
                        "scaleX": t.get("scX", 1),
                        "scaleY": t.get("scY", 1),
                        "rotation": t.get("skX", 0)
                    })
        manifest = {
            "canvas": {"width": atlas_w, "height": atlas_h},
            "layers": layers_for_manifest
        }
        zf.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))
    print(f"[psd-fallback] Saved ZIP + manifest -> {zip_path}")


# -------------------------
# CLI / Main
# -------------------------
def main():
    print("LAYERZ")
    print("=================")
    print("[1] Export layers (crop SubTexture entries)")
    print("[2] Layers -> HTML / PSD")
    choice = input("Choose an option (1/2): ").strip()

    if choice == "1":
        atlas_json = input("Path to atlas JSON: ").strip()
        atlas_png = input("Path to atlas PNG: ").strip()
        out_dir = input("Output folder (will be created): ").strip() or "exported_layers"
        print("Naming modes: path | ordered | flat")
        naming = input("Naming mode (path/ordered/flat) [path]: ").strip() or "path"
        exported, atlas_w, atlas_h = export_layers(atlas_json, atlas_png, out_dir, naming=naming)
        print("Done.")

    elif choice == "2":
        atlas_json = input("Path to atlas JSON: ").strip()
        atlas_png = input("Path to atlas PNG: ").strip()
        ske_json_path = input("Path to ske.json: ").strip()
        out_dir = input("Working folder for exported layers (will be created): ").strip() or "exported_layers"
        naming = input("Naming mode for export (path/ordered/flat) [path]: ").strip() or "path"
        exported, atlas_w, atlas_h = export_layers(atlas_json, atlas_png, out_dir, naming=naming)

        with open(ske_json_path, "r", encoding="utf-8") as f:
            ske_json = json.load(f)

        print("[A] Generate HTML preview")
        print("[B] Generate PSD (best-effort)")
        sub = input("Choose (A/B or both separated by comma): ").strip().lower()

        if "a" in sub or "," in sub:
            out_html = input("Output HTML filename [layers_preview.html]: ").strip() or "layers_preview.html"
            generate_html(ske_json, exported, atlas_w, atlas_h, out_html)

        if "b" in sub or "," in sub:
            out_psd = input("Output PSD filename (or .zip fallback) [layers.zip]: ").strip() or "layers.zip"
            generate_psd(ske_json, exported, atlas_w, atlas_h, out_psd)


    else:
        print("Invalid choice. Exiting.")

if __name__ == "__main__":
    main()
