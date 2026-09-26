"""
把本地课程笔记复制进站点目录，并注入 VitePress 需要的 frontmatter。

用法：
    python scripts/import-note.py <源 md 路径> <目标目录> <目标文件名(不含 .md)> [title]

例：
    python scripts/import-note.py \
        "D:/University/Year 2/ECO2021/笔记_ECO2021_Ch6_Wages-and-Unemployment.md" \
        "docs/ECO2021-Principles-of-Macroeconomics" \
        "ch6-wages-and-unemployment" \
        "Ch6 工资与失业"

行为：
  - 目标目录不存在则创建
  - 若源文件已带 YAML frontmatter，则原样保留，只在缺失时补 title
  - 换行统一为 LF，编码 UTF-8
"""
import os
import sys


def main() -> int:
    if len(sys.argv) < 4:
        print(__doc__)
        return 1

    src, dst_dir, stem = sys.argv[1], sys.argv[2], sys.argv[3]
    title = sys.argv[4] if len(sys.argv) > 4 else stem

    if not os.path.isfile(src):
        print(f"[x] 源文件不存在: {src}")
        return 1

    os.makedirs(dst_dir, exist_ok=True)
    dst = os.path.join(dst_dir, stem + ".md")

    text = open(src, encoding="utf-8").read().replace("\r\n", "\n")

    # 已有 frontmatter 就不重复注入
    has_fm = text.startswith("---\n")
    if not has_fm:
        text = f"---\ntitle: {title}\n---\n\n" + text

    with open(dst, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)

    print(f"[ok] {src}")
    print(f"  -> {dst}")
    print(f"  chars={len(text)}  frontmatter={'kept' if has_fm else 'injected'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
