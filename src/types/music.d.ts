interface IMusicDifficulty {
    id: number;
    name: string;
    level: number;
}

interface IMusicItem {
    id: string;
    name: string;
    artist: string;
    difficulties: IMusicDifficulty[];
    category: string[];
    cover: string;
    pacakge: string;
}

interface IMusicDB {
    progress: number;
    data: IMusicItem[]
}