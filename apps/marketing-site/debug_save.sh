#!/bin/bash
# Run this AFTER saving a post in the admin
# It checks the latest revision for code-block-pro data

echo "=== All posts ==="
sqlite3 /home/james/Repos/oatmeal-olive-instrument/apps/marketing-site/data.db \
  "SELECT id, slug, status, draft_revision_id FROM ec_posts"

echo ""
echo "=== Latest 3 revisions (any collection) ==="
sqlite3 /home/james/Repos/oatmeal-olive-instrument/apps/marketing-site/data.db "
SELECT r.id, r.entry_id, r.created_at,
  CASE WHEN r.data LIKE '%code-block-pro%' THEN '✅ HAS code-block-pro' ELSE '❌ no cbp' END
FROM revisions r
ORDER BY r.created_at DESC
LIMIT 3
"

echo ""
echo "=== Content from all posts (looking for non-text blocks) ==="
sqlite3 /home/james/Repos/oatmeal-olive-instrument/apps/marketing-site/data.db "
SELECT slug, content FROM ec_posts
" | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if '|' not in line: continue
    slug, raw = line.split('|', 1)
    try:
        content = json.loads(raw)
        non_text = [b for b in content if b.get('_type') != 'block']
        if non_text:
            print(f'  {slug}: {len(non_text)} non-text block(s):')
            for b in non_text:
                print(f'    {json.dumps(b, indent=2)[:300]}')
        else:
            print(f'  {slug}: only text blocks ({len(content)} total)')
    except:
        print(f'  {slug}: FAILED to parse content')
"

echo ""
echo "=== Checking latest revision data for code-block-pro blocks ==="
sqlite3 /home/james/Repos/oatmeal-olive-instrument/apps/marketing-site/data.db "
SELECT data FROM revisions ORDER BY created_at DESC LIMIT 1
" | python3 -c "
import sys, json
raw = sys.stdin.read().strip()
if not raw:
    print('  No revisions found')
    sys.exit()
try:
    data = json.loads(raw)
    content = data.get('content', [])
    if isinstance(content, list):
        non_text = [b for b in content if b.get('_type') != 'block']
        if non_text:
            print(f'  Latest revision has {len(non_text)} non-text block(s):')
            for b in non_text:
                print(f'    {json.dumps(b, indent=2)[:400]}')
        else:
            print(f'  Latest revision: only text blocks ({len(content)} total)')
    else:
        print(f'  Content field is not an array: {type(content)}')
except Exception as e:
    print(f'  Parse error: {e}')
"
