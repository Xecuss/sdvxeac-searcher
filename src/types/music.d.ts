interface IMusicDifficulty {
    id: number;
    name: string;
    level: number;
}

interface IMusicItem {
    name: string;
    artist: string;
    difficulties: IMusicDifficulty[];
    category: string[];
    cover: string;
    pacakge: string;
}