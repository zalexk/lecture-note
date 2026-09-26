"""
把本地课程笔记复制进站点目录，并做三件规范化处理。

用法：
    python scripts/import-note.py <源 md 路径> <目标目录> <目标文件名(不含 .md)> [title]

例：
    python scripts/import-note.py \
        "D:/University/Year 2/ECO2021/笔记_ECO2021_Ch6_Wages-and-Unemployment.md" \
        "docs/ECO2021-Principles-of-Macroeconomics" \
        "ch6-wages-and-unemployment" \
        "Ch6 工资与失业"

行为：
  1. 目标目录不存在则创建；换行统一为 LF，编码 UTF-8。
  2. frontmatter：没有就注入；已有但缺 `title` 就在开头补上 title（VitePress 的 <title>
     与本地搜索都依赖它，缺了会退化成拿正文第一个 h1 当标题）。
  3. 来源表述清洗（站点红线）：正文中不得出现「录播 / 字幕 / 录音 / 转录 / SRT」，
     统一改写成「基于课件整理」。清洗后仍残留的，逐行打印出来由人处理。

退出码：0 = 导入成功（可能带 WARN）；1 = 失败。
"""
import os
import re
import sys

# 站点红线：这些词一律不得出现在公开站点上
FORBIDDEN = ["录播", "字幕", "录音", "转录", "SRT"]

# 有序替换：把"本讲无录播字幕"这类来源描述改写成"基于课件整理"
# 先长后短，避免短规则先命中把句子改坏
REWRITES = [
    # 「本讲**无录播字幕**，以下内容**完全来自课件**」
    (re.compile(r"本讲\*\*无录播字幕\*\*[，,]\s*以下内容\*\*完全来自课件\*\*"),
     "以下内容**完全基于课件**"),
    # 「本讲无录播字幕，内容完全来自课件」
    (re.compile(r"本讲无录播字幕[，,]\s*内容完全来自课件"),
     "本讲内容完全基于课件"),
    # 退化形式
    (re.compile(r"本讲\*\*无录播字幕\*\*"), "本讲内容**完全基于课件**"),
    (re.compile(r"本讲无录播字幕"), "本讲内容完全基于课件"),
    # 兜底：单独出现的「无录播字幕」「录播」「字幕」
    (re.compile(r"(?:\*\*)?无录播字幕(?:\*\*)?[，,]?\s*"), ""),
    (re.compile(r"录播字幕|录播|字幕"), "课件"),
]


def inject_title(text: str, title: str) -> tuple[str, str]:
    """返回 (新文本, 状态说明)。"""
    if not text.startswith("---\n"):
        return f"---\ntitle: {title}\n---\n\n" + text, "injected"

    end = text.find("\n---", 3)
    if end == -1:
        # frontmatter 没闭合，当成没有处理
        return f"---\ntitle: {title}\n---\n\n" + text, "injected(broken-fm)"

    fm = text[4:end]
    if re.search(r"^title\s*:", fm, re.M):
        return text, "kept"

    return "---\ntitle: " + title + "\n" + text[4:], "title-added"


def sanitize(text: str) -> tuple[str, list[str]]:
    """清掉站点红线词汇，返回 (新文本, 改动说明列表)。"""
    notes = []
    for pat, rep in REWRITES:
        text, n = pat.subn(rep, text)
        if n:
            notes.append(f"{pat.pattern!r} x{n} -> {rep!r}")
    return text, notes


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

    text, fm_state = inject_title(text, title)
    text, changes = sanitize(text)

    with open(dst, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)

    print(f"[ok] {src}")
    print(f"  -> {dst}")
    print(f"  chars={len(text)}  frontmatter={fm_state}")
    if changes:
        print("  [sanitize] 已改写来源表述:")
        for c in changes:
            print(f"    - {c}")

    # 清洗后仍残留的，逐行报出来（不静默放过）
    leftovers = []
    for i, line in enumerate(text.splitlines(), 1):
        if any(w in line for w in FORBIDDEN):
            leftovers.append((i, line.strip()[:120]))
    if leftovers:
        print(f"  [WARN] 仍有 {len(leftovers)} 处禁用词未清理，请手工处理:")
        for i, line in leftovers:
            print(f"    L{i}: {line}")
        return 0

    print("  [sanitize] 无禁用词残留")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
