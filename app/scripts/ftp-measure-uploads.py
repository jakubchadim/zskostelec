#!/usr/bin/env python3
"""
Measures wp-content/uploads on the WP hosting over FTP (read-only: lists
directories, never downloads or changes anything). Credentials come from
app/.env.local (FTP_HOST, FTP_USER, FTP_PASSWORD, optional FTP_ROOT) and
are never printed.

Usage (from app/):  python3 scripts/ftp-measure-uploads.py [out.json]

Splits files into WP originals vs. WordPress-generated size variants
(`name-300x200.jpg`) so we know what actually needs migrating.
"""
import ftplib
import json
import os
import re
import sys
import time
from collections import defaultdict

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_env(path):
    env = {}
    if os.path.exists(path):
        for line in open(path, encoding='utf-8'):
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, value = line.split('=', 1)
            env[key.strip()] = value.strip().strip('"').strip("'")
    return env


env = {**load_env(os.path.join(APP, '.env.local')), **os.environ}
HOST, USER, PASSWORD = env.get('FTP_HOST'), env.get('FTP_USER'), env.get('FTP_PASSWORD')
if not (HOST and USER and PASSWORD):
    sys.exit('Missing FTP_HOST / FTP_USER / FTP_PASSWORD in app/.env.local')

VARIANT = re.compile(r'-\d+x\d+\.[a-z0-9]+$', re.I)


def connect():
    try:
        ftp = ftplib.FTP_TLS(HOST, timeout=60)
        ftp.login(USER, PASSWORD)
        ftp.prot_p()
    except Exception:
        ftp = ftplib.FTP(HOST, timeout=60)
        ftp.login(USER, PASSWORD)
    ftp.encoding = 'utf-8'
    return ftp


def listdir(ftp, path):
    """[(name, type, size)] via MLSD, falling back to LIST parsing."""
    try:
        return [(n, f.get('type'), int(f.get('size', 0) or 0)) for n, f in ftp.mlsd(path, facts=['type', 'size']) if n not in ('.', '..')]
    except ftplib.error_perm:
        lines = []
        ftp.retrlines(f'LIST {path}', lines.append)
        out = []
        for line in lines:
            parts = line.split(None, 8)
            if len(parts) < 9 or parts[8] in ('.', '..'):
                continue
            out.append((parts[8], 'dir' if line.startswith('d') else 'file', int(parts[4]) if parts[4].isdigit() else 0))
        return out


def find_uploads(ftp):
    if env.get('FTP_ROOT'):
        return env['FTP_ROOT'].rstrip('/') + '/wp-content/uploads'
    # Look a few levels down for wp-content/uploads.
    queue = ['']
    for _ in range(4):
        nxt = []
        for base in queue:
            try:
                entries = listdir(ftp, base or '.')
            except Exception:
                continue
            for name, typ, _ in entries:
                if typ != 'dir':
                    continue
                path = f'{base}/{name}' if base else name
                if name == 'wp-content':
                    return f'{path}/uploads'
                nxt.append(path)
        queue = nxt[:200]
    sys.exit('wp-content/uploads not found - set FTP_ROOT in app/.env.local')


ftp = connect()
root = find_uploads(ftp)
print(f'uploads at: {root}')

stats = defaultdict(lambda: {'files': 0, 'bytes': 0})
by_year = defaultdict(lambda: {'orig_files': 0, 'orig_bytes': 0, 'variant_bytes': 0})
by_ext = defaultdict(lambda: {'files': 0, 'bytes': 0})
largest = []
dirs = [root]
started = time.time()

while dirs:
    path = dirs.pop()
    try:
        entries = listdir(ftp, path)
    except (ftplib.error_temp, EOFError, OSError):
        ftp = connect()
        entries = listdir(ftp, path)
    for name, typ, size in entries:
        full = f'{path}/{name}'
        if typ == 'dir':
            dirs.append(full)
            continue
        rel = full[len(root) + 1:]
        year = rel.split('/')[0] if re.match(r'^\d{4}/', rel) else 'other'
        ext = os.path.splitext(name)[1].lower() or '(none)'
        kind = 'variant' if VARIANT.search(name) else 'original'
        stats[kind]['files'] += 1
        stats[kind]['bytes'] += size
        by_ext[ext]['files'] += 1
        by_ext[ext]['bytes'] += size
        if kind == 'original':
            by_year[year]['orig_files'] += 1
            by_year[year]['orig_bytes'] += size
            largest.append((size, rel))
        else:
            by_year[year]['variant_bytes'] += size
    largest = sorted(largest, reverse=True)[:15]

ftp.quit()
gb = lambda b: round(b / 1e9, 2)
report = {
    'root': root,
    'seconds': round(time.time() - started),
    'originals': {'files': stats['original']['files'], 'GB': gb(stats['original']['bytes'])},
    'wp_variants': {'files': stats['variant']['files'], 'GB': gb(stats['variant']['bytes'])},
    'by_year': {y: {'files': v['orig_files'], 'orig_GB': gb(v['orig_bytes']), 'variants_GB': gb(v['variant_bytes'])} for y, v in sorted(by_year.items())},
    'by_ext': {e: {'files': v['files'], 'GB': gb(v['bytes'])} for e, v in sorted(by_ext.items(), key=lambda kv: -kv[1]['bytes'])},
    'largest_originals_MB': [(round(s / 1e6, 1), p) for s, p in largest],
}
out = sys.argv[1] if len(sys.argv) > 1 else None
if out:
    json.dump(report, open(out, 'w'), indent=2, ensure_ascii=False)
print(json.dumps(report, indent=2, ensure_ascii=False))
