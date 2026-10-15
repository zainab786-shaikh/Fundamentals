#!/usr/bin/env python3
import os
import json

def generate_catalog():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    subjects = []

    icon_map = {
        'network': 'lan',
        'os': 'memory',
        'operating': 'memory',
        'architecture': 'developer_board',
        'organization': 'account_tree',
        'software': 'code',
        'engineering': 'code',
        'ai': 'smart_toy',
        'agent': 'smart_toy',
        'langchain': 'hub',
        'langraph': 'hub',
        'lang': 'hub',
        'database': 'storage',
        'algorithm': 'functions',
        'math': 'calculate',
        'data': 'data_object',
    }

    def get_icon(name):
        lower = name.lower()
        for k, v in icon_map.items():
            if k in lower:
                return v
        return 'menu_book'

    # Scan all top-level directories in repository
    for entry in sorted(os.listdir(repo_root)):
        full_path = os.path.join(repo_root, entry)
        if (
            os.path.isdir(full_path)
            and not entry.startswith('.')
            and entry not in ['fundamentals-web', 'scripts', 'scratch']
        ):
            md_files = [f for f in sorted(os.listdir(full_path)) if f.lower().endswith('.md')]
            if md_files:
                topics = []
                for f in md_files:
                    topics.append({
                        'name': f[:-3],
                        'path': f'{entry}/{f}',
                        'sha': 'main'
                    })
                subjects.append({
                    'name': entry,
                    'icon': get_icon(entry),
                    'topics': topics
                })

    target_dir = os.path.join(repo_root, 'fundamentals-web', 'src', 'assets')
    os.makedirs(target_dir, exist_ok=True)
    target_path = os.path.join(target_dir, 'catalog.json')
    
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(subjects, f, indent=2)

    print(f"✅ Generated {target_path} with {len(subjects)} subjects:")
    for s in subjects:
        print(f"   • {s['name']}: {len(s['topics'])} topics")

if __name__ == '__main__':
    generate_catalog()
