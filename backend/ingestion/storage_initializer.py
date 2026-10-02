import os
import shutil
import hashlib
import json
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
STORAGE_DIR = BASE_DIR / "storage"

def get_file_checksum(filepath: Path) -> str:
    sha = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            sha.update(chunk)
    return sha.hexdigest()

def organize_real_storage():
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    
    # Real products specification
    products = [
        {
            "id": "ch2_ohr_ncp_20191015T041200_d_img_d18",
            "payload": "ohrc",
            "raw_img": DATA_DIR / "raw/ohrc/ch2_ohr_ncp_20191015T041200_d_img_d18.png",
            "xml": DATA_DIR / "raw/ohrc/OHRC-BOGUSLAWSKY-001.xml",
            "browse": DATA_DIR / "browse/ch2_ohr_ncp_20191015T041200_d_img_d18_browse.png",
            "thumb": DATA_DIR / "thumbnails/ch2_ohr_ncp_20191015T041200_d_img_d18_thumb.png",
        },
        {
            "id": "ch2_ohr_ncp_20220310T061500_d_img_d18",
            "payload": "ohrc",
            "raw_img": DATA_DIR / "raw/ohrc/ch2_ohr_ncp_20220310T061500_d_img_d18.png",
            "xml": DATA_DIR / "raw/ohrc/OHRC-TYCHO-AM-04.xml",
            "browse": DATA_DIR / "browse/ch2_ohr_ncp_20220310T061500_d_img_d18_browse.png",
            "thumb": DATA_DIR / "thumbnails/ch2_ohr_ncp_20220310T061500_d_img_d18_thumb.png",
        },
        {
            "id": "ch2_ohr_ncp_20220324T184000_d_img_d18",
            "payload": "ohrc",
            "raw_img": DATA_DIR / "raw/ohrc/ch2_ohr_ncp_20220324T184000_d_img_d18.png",
            "xml": DATA_DIR / "raw/ohrc/OHRC-TYCHO-PM-05.xml",
            "browse": DATA_DIR / "browse/ch2_ohr_ncp_20220324T184000_d_img_d18_browse.png",
            "thumb": DATA_DIR / "thumbnails/ch2_ohr_ncp_20220324T184000_d_img_d18_thumb.png",
        },
        {
            "id": "ch2_tmc_ncn_20200411T093000_d_img_d18",
            "payload": "tmc2",
            "raw_img": DATA_DIR / "raw/tmc2/ch2_tmc_ncn_20200411T093000_d_img_d18.png",
            "xml": DATA_DIR / "raw/tmc2/TMC-BOGUSLAWSKY-002.xml",
            "browse": DATA_DIR / "browse/ch2_tmc_ncn_20200411T093000_d_img_d18_browse.png",
            "thumb": DATA_DIR / "thumbnails/ch2_tmc_ncn_20200411T093000_d_img_d18_thumb.png",
        },
        {
            "id": "ch2_tmc_ncn_20210828T144500_d_img_d18",
            "payload": "tmc2",
            "raw_img": DATA_DIR / "raw/tmc2/ch2_tmc_ncn_20210828T144500_d_img_d18.png",
            "xml": DATA_DIR / "raw/tmc2/TMC-SHACKLETON-006.xml",
            "browse": DATA_DIR / "browse/ch2_tmc_ncn_20210828T144500_d_img_d18_browse.png",
            "thumb": DATA_DIR / "thumbnails/ch2_tmc_ncn_20210828T144500_d_img_d18_thumb.png",
        },
        {
            "id": "ch2_iir_ncn_20210828T144500_d_cub_d18",
            "payload": "iirs",
            "raw_img": DATA_DIR / "raw/iirs/ch2_iir_ncn_20210828T144500_d_cub_d18.png",
            "xml": DATA_DIR / "raw/iirs/IIRS-SHACKLETON-003.xml",
            "browse": DATA_DIR / "browse/ch2_iir_ncn_20210828T144500_d_cub_d18_browse.png",
            "thumb": DATA_DIR / "thumbnails/ch2_iir_ncn_20210828T144500_d_cub_d18_thumb.png",
        }
    ]

    for p in products:
        p_dir = STORAGE_DIR / p["payload"] / p["id"]
        (p_dir / "browse").mkdir(parents=True, exist_ok=True)
        (p_dir / "data").mkdir(parents=True, exist_ok=True)
        (p_dir / "geometry").mkdir(parents=True, exist_ok=True)
        
        # 1. Copy raw data
        dst_raw = p_dir / "data" / f"{p['id']}.png"
        if p["raw_img"].exists():
            shutil.copy2(p["raw_img"], dst_raw)
            # Also ensure it exists in data/raw/{p['id']}.png for direct static route
            shutil.copy2(p["raw_img"], DATA_DIR / "raw" / f"{p['id']}.png")
        
        # 2. Copy XML label
        if p["xml"].exists():
            shutil.copy2(p["xml"], p_dir / f"{p['id']}.xml")
        
        # 3. Copy/Generate browse preview
        dst_browse = p_dir / "browse" / f"{p['id']}_browse.png"
        if p["browse"].exists():
            shutil.copy2(p["browse"], dst_browse)
        elif dst_raw.exists():
            shutil.copy2(dst_raw, dst_browse)
        
        # 4. Generate WebP preview and thumbnail
        if dst_raw.exists():
            with Image.open(dst_raw) as img:
                # WebP Preview
                preview_path = p_dir / "preview.webp"
                img.save(preview_path, "WEBP", quality=90)
                
                # Standard Preview PNG
                shutil.copy2(dst_raw, p_dir / "preview.png")
                
                # Thumbnail
                thumb_path = p_dir / "thumbnail.png"
                img.copy().resize((256, 256), Image.Resampling.LANCZOS).save(thumb_path, "PNG")
                
                # Copy to data/thumbnails/{p['id']}_thumb.png
                shutil.copy2(thumb_path, DATA_DIR / "thumbnails" / f"{p['id']}_thumb.png")
                
                # Copy to data/browse/{p['id']}_browse.png
                shutil.copy2(dst_raw, DATA_DIR / "browse" / f"{p['id']}_browse.png")
                
                # For IIRS, generate false color and single band composite
                if p["payload"] == "iirs":
                    rgb_path = p_dir / "rgb_composite.png"
                    img.convert("RGB").save(rgb_path, "PNG")
                    false_color = p_dir / "false_color.png"
                    img.convert("RGB").save(false_color, "PNG")

        print(f"Organized storage for {p['id']}")

if __name__ == "__main__":
    organize_real_storage()
