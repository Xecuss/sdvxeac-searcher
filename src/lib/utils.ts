const sortMethod = (x: string, y: string) => x.localeCompare(y, 'ja', {
    numeric: true
});

export const sortPackages = (packages: string[]) => {
    // 月费会员曲包
    const monthPack = packages.filter(pack => pack.startsWith('20')).sort(sortMethod);
    // 乐曲曲包
    const normalPack = packages.filter(pack => pack.startsWith('コナステ版 SOUND VOLTEX 楽曲パック')).sort(sortMethod);
    // 免费
    const freePack = packages.filter(pack => pack === '最初からプレーできます').sort(sortMethod);
    // 其他 
    const othersPack = packages.filter(pack => 
        !pack.startsWith('コナステ版 SOUND VOLTEX 楽曲パック')
        && !pack.startsWith('20')
        && pack !== '最初からプレーできます'
    ).sort(sortMethod);
    return [...freePack, ...normalPack, ...monthPack, ...othersPack]
}

export const simpleDisplay = (name: string) => {
    if(name.startsWith('コナステ版 SOUND VOLTEX')) {
        return name.replace('コナステ版 SOUND VOLTEX', '')
    }
    return name;
}

export const statMusic = (musics: IMusicItem[]) => {
    const result = new Map<string, IMusicItem[]>();
    for(const music of musics) {
        let musicArr = result.get(music.pacakge);
        if(musicArr === undefined) {
            musicArr = [];
            result.set(music.pacakge, musicArr);
        }
        musicArr.push(music);
    }
    return [...result]
}

export const statPackInfo = (musics: IMusicItem[]) => {
    const packagesMap = new Map<string, number>();
    musics.forEach(({ pacakge }) => {
        const current = packagesMap.get(pacakge);
        if(current !== undefined) {
            packagesMap.set(pacakge, current + 1);
        }
        else {
            packagesMap.set(pacakge, 1);
        }
    });
    return packagesMap;
}