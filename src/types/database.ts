export interface Golf {
    golf_id: string;
    start_schematic: string;
    test_schematic: string;
    isHidden: boolean;
    title: string;
    description: string;
    created_at: number;
    user_id: string;
}

export interface GolfLeaderboard {
    golf_id: string;
    user_id: string;
    score: number;
    commands: string;
    date: number;
}

export interface User {
    user_id: string;
    avatar: string;
    username: string;
    name: string;
}
