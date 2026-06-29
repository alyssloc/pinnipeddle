export type Clues = [string, string, string, string, string, string];

export interface Species {
    id: string,
    name: string,
    scientificName: string,
    range: string,
    clues: Clues,
}

export const MAX_ATTEMPTS = 6;