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