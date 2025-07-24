import os
import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
from pathlib import Path

# Constants
THUMB_HEIGHT = 256
THUMB_DIR = "thumb"
SUPPORTED_EXTS = (".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp")


def find_images_in_dir(root_dir):
    image_files = []
    for dirpath, _, filenames in os.walk(root_dir):
        for file in filenames:
            if file.lower().endswith(SUPPORTED_EXTS):
                full_path = os.path.join(dirpath, file)
                rel_path = os.path.relpath(full_path, root_dir)
                image_files.append((full_path, rel_path))
    return image_files


def generate_thumbnail(img, height=THUMB_HEIGHT):
    aspect_ratio = img.width / img.height
    new_size = (int(height * aspect_ratio), height)
    return img.resize(new_size, Image.LANCZOS)


def save_thumbnail(img, rel_path):
    out_path = os.path.join(THUMB_DIR, rel_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path)


def auto_generate_thumbnails(image_paths):
    for full_path, rel_path in image_paths:
        img = Image.open(full_path).convert("RGBA")
        thumb = generate_thumbnail(img)
        save_thumbnail(thumb, rel_path)
    messagebox.showinfo("Done", f"Generated thumbnails saved to '{THUMB_DIR}/'")


def manual_edit_image(img, img_name, save_callback):
    top = tk.Toplevel()
    top.title(f"Edit: {img_name}")
    img = img.convert("RGBA")
    orig_w, orig_h = img.size

    # Detect screen size and scale if too big
    screen_w = top.winfo_screenwidth()
    screen_h = top.winfo_screenheight()
    max_w = int(screen_w * 0.8)
    max_h = int(screen_h * 0.8)

    # Scale factor for display (preview only)
    preview_scale = min(1.0, min(max_w / orig_w, max_h / orig_h))
    preview_w = int(orig_w * preview_scale)
    preview_h = int(orig_h * preview_scale)

    canvas = tk.Canvas(top, width=preview_w, height=preview_h, bg="black")
    canvas.grid(row=0, column=0, columnspan=4)

    params = {
        "scale": tk.DoubleVar(value=1.0),
        "rotate": tk.DoubleVar(value=0),
        "move_x": tk.IntVar(value=0),
        "move_y": tk.IntVar(value=0)
    }

    display_img = None

    def update_preview():
        nonlocal display_img
        preview = img.copy()

        # Apply transformations
        scale = params["scale"].get()
        angle = params["rotate"].get()
        move_x = params["move_x"].get()
        move_y = params["move_y"].get()

        scaled = preview.resize((int(orig_w * scale), int(orig_h * scale)), Image.LANCZOS)
        rotated = scaled.rotate(angle, expand=True)

        bg = Image.new("RGBA", (orig_w, orig_h), (0, 0, 0, 0))
        paste_x = (orig_w - rotated.width) // 2 + move_x
        paste_y = (orig_h - rotated.height) // 2 + move_y
        bg.paste(rotated, (paste_x, paste_y), rotated)

        display_img = bg

        # Downscale for preview
        preview_disp = bg.resize((preview_w, preview_h), Image.LANCZOS)
        tk_img = ImageTk.PhotoImage(preview_disp)
        canvas.img = tk_img
        canvas.delete("all")
        canvas.create_image(0, 0, anchor="nw", image=tk_img)

    def on_apply():
        update_preview()

    def on_done():
        final_img = display_img if display_img else img.copy()
        save_callback(final_img)
        top.destroy()

    # Controls
    tk.Label(top, text="Scale:").grid(row=1, column=0)
    tk.Entry(top, textvariable=params["scale"]).grid(row=1, column=1)

    tk.Label(top, text="Rotate (°):").grid(row=2, column=0)
    tk.Entry(top, textvariable=params["rotate"]).grid(row=2, column=1)

    tk.Label(top, text="Move X:").grid(row=1, column=2)
    tk.Entry(top, textvariable=params["move_x"]).grid(row=1, column=3)

    tk.Label(top, text="Move Y:").grid(row=2, column=2)
    tk.Entry(top, textvariable=params["move_y"]).grid(row=2, column=3)

    tk.Button(top, text="Apply", command=on_apply).grid(row=3, column=1)
    tk.Button(top, text="Done", command=on_done).grid(row=3, column=2)

    update_preview()



def choose_images_and_edit(image_paths):
    root = tk.Tk()
    root.title("Select Images to Edit")
    listbox = tk.Listbox(root, selectmode=tk.MULTIPLE, width=80)
    listbox.pack()

    for _, rel_path in image_paths:
        listbox.insert(tk.END, rel_path)

    def on_confirm():
        selected = listbox.curselection()
        if not selected:
            root.destroy()
            auto_generate_thumbnails(image_paths)
            return

        def next_image(index):
            if index >= len(selected):
                messagebox.showinfo("Done", f"All edited images saved to '{THUMB_DIR}/'")
                root.destroy()
                return

            i = selected[index]
            full_path, rel_path = image_paths[i]
            img = Image.open(full_path).convert("RGBA")

            def save_callback(edited_img):
                thumb = generate_thumbnail(edited_img)
                save_thumbnail(thumb, rel_path)
                next_image(index + 1)

            manual_edit_image(img, rel_path, save_callback)

        root.withdraw()
        next_image(0)

    tk.Button(root, text="Proceed", command=on_confirm).pack(pady=10)
    root.mainloop()


def main_menu():
    root = tk.Tk()
    root.withdraw()
    choice = messagebox.askquestion("Multi-Tool", "Choose a tool:\n[Yes] Generate Thumbnails\n[No] Exit")
    if choice == "yes":
        root_dir = filedialog.askdirectory(title="Select Root Folder of Images")
        if not root_dir:
            return
        images = find_images_in_dir(root_dir)
        if not images:
            messagebox.showwarning("No Images", "No images found in the selected folder.")
            return
        choose_images_and_edit(images)
    else:
        root.destroy()


if __name__ == "__main__":
    main_menu()
