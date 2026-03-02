const FS_KEY = 'fs_files'

function load() {
    return JSON.parse(localStorage.getItem(FS_KEY) || '{}')
}

function save(files) {
    localStorage.setItem(FS_KEY, JSON.stringify(files))
}

export function writeFile(name, content) {
    const files = load()
    files[name] = {
        content,
        created: files[name]?.created || Date.now(),
        modified: Date.now()
    }
    save(files)
}

export function readFile(name) {
    const files = load()
    return files[name] || null
}

export function deleteFile(name) {
    const files = load()
    delete files[name]
    save(files)
}

export function listFiles() {
    const files = load()
    return Object.entries(files).map(([name, meta]) => ({
        name,
        created: meta.created,
        modified: meta.modified
    }))
}