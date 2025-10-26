import json
from PIL import Image
import os

def scale_atlas(atlas_path, new_png_path):
    # Load atlas JSON
    with open(atlas_path, "r", encoding="utf-8") as f:
        atlas = json.load(f)

    # Old image size
    old_w, old_h = atlas["width"], atlas["height"]

    # New image size
    new_img = Image.open(new_png_path)
    new_w, new_h = new_img.size

    # Compute scale factors
    scale_x = new_w / old_w
    scale_y = new_h / old_h

    print(f"[Atlas] Old size: {old_w}x{old_h}")
    print(f"[Atlas] New size: {new_w}x{new_h}")
    print(f"[Atlas] Scale factors: {scale_x:.3f}, {scale_y:.3f}")

    # Update atlas
    atlas["width"] = new_w
    atlas["height"] = new_h
    for sub in atlas.get("SubTexture", []):
        sub["x"] = round(sub["x"] * scale_x)
        sub["y"] = round(sub["y"] * scale_y)
        sub["width"] = round(sub["width"] * scale_x)
        sub["height"] = round(sub["height"] * scale_y)

    out_path = atlas_path.replace(".json", "_resized.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(atlas, f, ensure_ascii=False, indent=2)

    print(f"[Atlas] Saved resized atlas: {out_path}")
    return scale_x, scale_y


def scale_skeleton(skel_path, scale_x, scale_y):
    with open(skel_path, "r", encoding="utf-8") as f:
        skel = json.load(f)

    print("[Skeleton] Scaling bones, slots, and meshes...")

    def scale_transform(transform):
        if "x" in transform:
            transform["x"] *= scale_x
        if "y" in transform:
            transform["y"] *= scale_y
        # skX/skY are rotations, leave untouched

    for armature in skel.get("armature", []):
        # Bones
        for bone in armature.get("bone", []):
            scale_transform(bone)

        # Skins → Slots → Displays
        for skin in armature.get("skin", []):
            for slot in skin.get("slot", []):
                for display in slot.get("display", []):
                    if "transform" in display:
                        scale_transform(display["transform"])
                    if "vertices" in display:
                        verts = display["vertices"]
                        for i in range(0, len(verts), 2):
                            verts[i] *= scale_x
                            verts[i+1] *= scale_y

        # Bone poses (affine matrices)
        for bonepose in armature.get("bonePose", []):
            # Each bonePose is [a, b, c, d, tx, ty]
            for i in range(0, len(bonepose), 6):
                bonepose[i+4] *= scale_x  # tx
                bonepose[i+5] *= scale_y  # ty

        # Slot poses
        if "slotPose" in armature:
            sp = armature["slotPose"]
            for i in range(0, len(sp), 6):
                sp[i+4] *= scale_x  # tx
                sp[i+5] *= scale_y  # ty

    out_path = skel_path.replace(".json", "_resized.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(skel, f, ensure_ascii=False, indent=2)

    print(f"[Skeleton] Saved resized skeleton: {out_path}")



def main():
    atlas_path = input("Enter path to atlas JSON: ").strip()
    new_png_path = input("Enter path to NEW texture PNG: ").strip()
    scale_x, scale_y = scale_atlas(atlas_path, new_png_path)

    choice = input("Also scale skeleton JSON? (y/n): ").strip().lower()
    if choice == "y":
        skel_path = input("Enter path to skeleton JSON: ").strip()
        scale_skeleton(skel_path, scale_x, scale_y)


if __name__ == "__main__":
    main()
