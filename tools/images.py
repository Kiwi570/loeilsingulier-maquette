#!/usr/bin/env python3
"""Prépare les dérivés web (AVIF + WebP) à partir des originaux fournis par la cliente.

Usage :  python3 -I tools/images.py /chemin/vers/PHOTOS

- lit src/data/photos.json (sélection, points focaux, largeurs) ;
- convertit chaque original en sRGB (profils Display P3 des iPhone compris),
  applique l'orientation EXIF (HEIC et JPEG), retire les métadonnées ;
- écrit static/img/photos/<id>-<largeur>.(avif|webp) et static/img/design/... ;
- écrit src/data/media.generated.json (dimensions réelles) utilisé par le générateur.

Les originaux ne sont pas versionnés : seul le résultat l'est.
Dépendances : Pillow >= 11 (AVIF), pillow-heif (HEIC).
"""
import io, json, sys, unicodedata
from pathlib import Path
from PIL import Image, ImageOps, ImageCms

try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:  # le HEIC sera signalé comme manquant
    pillow_heif = None

ROOT = Path(__file__).resolve().parent.parent
SRGB = ImageCms.createProfile('sRGB')
DEFAULT_W = [480, 960, 1440]
DESIGN_W = [480, 960, 1440]


def to_srgb(im):
    icc = im.info.get('icc_profile')
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGBA' if 'A' in im.getbands() or im.mode == 'P' else 'RGB')
    if icc:
        try:
            src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
            im = ImageCms.profileToProfile(im, src, SRGB, outputMode=im.mode)
        except Exception as e:  # profil illisible : on garde les valeurs telles quelles
            print('  ! profil ICC ignoré :', e)
    if im.mode == 'RGBA':
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[3])
        im = bg
    return im


def open_orig(path):
    im = Image.open(path)
    im.seek(0)  # MPO : première image seulement
    im = ImageOps.exif_transpose(im)
    return im


def save_set(im, out_dir, ident, widths, q_avif=52, q_webp=80):
    out = []
    w0, h0 = im.size
    ws = sorted({min(w, w0) for w in widths})
    for w in ws:
        h = round(h0 * w / w0)
        r = im if w == w0 else im.resize((w, h), Image.LANCZOS)
        r.save(out_dir / f'{ident}-{w}.webp', 'WEBP', quality=q_webp, method=6)
        r.save(out_dir / f'{ident}-{w}.avif', 'AVIF', quality=q_avif, speed=6)
        out.append(w)
    return {'w': w0, 'h': h0, 'widths': out}


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src_root = Path(sys.argv[1])
    only = set(sys.argv[2:])  # identifiants facultatifs : ne traiter que ceux-là
    data = json.loads((ROOT / 'src/data/photos.json').read_text())
    gp = ROOT / 'src/data/media.generated.json'
    gen = json.loads(gp.read_text()) if (only and gp.exists()) else {'photos': {}, 'design': {}}
    for group, sub, default in (('photos', 'photos', DEFAULT_W), ('design', 'design', DESIGN_W)):
        out_dir = ROOT / 'static/img' / sub
        out_dir.mkdir(parents=True, exist_ok=True)
        for it in data[group]:
            if only and it['id'] not in only:
                continue
            p = src_root / it['src']
            if not p.exists():  # noms de fichiers en Unicode décomposé (macOS)
                p = src_root / unicodedata.normalize('NFD', it['src'])
            if not p.exists():
                print('MANQUANT', p); continue
            print(group, it['id'])
            q = it.get('q')
            if it.get('frames'):
                g = Image.open(p)
                frames = []
                for k in range(getattr(g, 'n_frames', 1)):
                    g.seek(k)
                    fr = to_srgb(g.convert('RGB'))
                    frames.append(save_set(fr, out_dir, f"{it['id']}-{k + 1}", it.get('widths', default), q_avif=q or 60, q_webp=q or 86))
                gen[group][it['id']] = {**frames[0], 'frames': len(frames)}
                continue
            im = to_srgb(open_orig(p))
            kw = {'q_avif': 62, 'q_webp': q} if q else {}
            gen[group][it['id']] = save_set(im, out_dir, it['id'], it.get('widths', default), **kw)
    (ROOT / 'src/data/media.generated.json').write_text(json.dumps(gen, indent=1, ensure_ascii=False))
    print('ok', sum(len(v) for v in gen.values()), 'médias')


if __name__ == '__main__':
    main()
