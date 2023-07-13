import Movesets from "@/data";

function CharacterPage({ params: { character } }: { params: { character: string } }) {
    const x = Movesets[character as keyof typeof Movesets];
    return JSON.stringify(x);
};

export default CharacterPage;
