export async function loadMusicDB() {
    const res = await import('../data/music_db.json');
    return res;
}