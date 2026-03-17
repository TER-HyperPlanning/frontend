export interface ScolariteAccount {
    id: string
    nom: string
    prenom: string
    email: string
    filieres: string[]
}

export interface Filiere {
    id: string
    nom: string
}

export const FILIERES: Filiere[] = [
    { id: 'info', nom: 'Informatique' },
    { id: 'miage', nom: 'MIAGE' },
    { id: 'maths', nom: 'Mathématiques' },
    { id: 'physique', nom: 'Physique' },
    { id: 'chimie', nom: 'Chimie' },
    { id: 'bio', nom: 'Biologie' },
    { id: 'eco', nom: 'Économie' },
    { id: 'droit', nom: 'Droit' },
    { id: 'gestion', nom: 'Gestion' },
    { id: 'langues', nom: 'Langues Étrangères' },
]

export const MOCK_ACCOUNTS: ScolariteAccount[] = [
    {
        id: '1',
        nom: 'DUPONT',
        prenom: 'Marie',
        email: 'marie.dupont@univ-evry.fr',
        filieres: ['Informatique', 'MIAGE'],
    },
    {
        id: '2',
        nom: 'MARTIN',
        prenom: 'Lucas',
        email: 'lucas.martin@univ-evry.fr',
        filieres: ['Mathématiques'],
    },
    {
        id: '3',
        nom: 'BERNARD',
        prenom: 'Sophie',
        email: 'sophie.bernard@univ-evry.fr',
        filieres: ['Physique', 'Chimie'],
    },
    {
        id: '4',
        nom: 'PETIT',
        prenom: 'Thomas',
        email: 'thomas.petit@univ-evry.fr',
        filieres: ['Économie', 'Gestion'],
    },
    {
        id: '5',
        nom: 'ROBERT',
        prenom: 'Camille',
        email: 'camille.robert@univ-evry.fr',
        filieres: ['Droit'],
    },
    {
        id: '6',
        nom: 'MOREAU',
        prenom: 'Julie',
        email: 'julie.moreau@univ-evry.fr',
        filieres: ['Biologie', 'Chimie'],
    },
    {
        id: '7',
        nom: 'LEROY',
        prenom: 'Antoine',
        email: 'antoine.leroy@univ-evry.fr',
        filieres: ['Langues Étrangères'],
    },
    {
        id: '8',
        nom: 'SIMON',
        prenom: 'Emma',
        email: 'emma.simon@univ-evry.fr',
        filieres: ['Informatique'],
    },
]
