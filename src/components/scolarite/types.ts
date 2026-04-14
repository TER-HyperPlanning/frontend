export interface ScolariteAccount {
    id: string
    nom: string
    prenom: string
    email: string
    phone: string
}

export const MOCK_ACCOUNTS: ScolariteAccount[] = [
    {
        id: '1',
        nom: 'DUPONT',
        prenom: 'Marie',
        email: 'marie.dupont@univ-evry.fr',
        phone: '+33 6 12 34 56 78',
    },
    {
        id: '2',
        nom: 'MARTIN',
        prenom: 'Lucas',
        email: 'lucas.martin@univ-evry.fr',
        phone: '+33 7 23 45 67 89',
    },
    {
        id: '3',
        nom: 'BERNARD',
        prenom: 'Sophie',
        email: 'sophie.bernard@univ-evry.fr',
        phone: '+33 6 98 76 54 32',
    },
    {
        id: '4',
        nom: 'PETIT',
        prenom: 'Thomas',
        email: 'thomas.petit@univ-evry.fr',
        phone: '+33 6 54 32 10 98',
    },
    {
        id: '5',
        nom: 'ROBERT',
        prenom: 'Camille',
        email: 'camille.robert@univ-evry.fr',
        phone: '+33 7 65 43 21 09',
    },
    {
        id: '6',
        nom: 'MOREAU',
        prenom: 'Julie',
        email: 'julie.moreau@univ-evry.fr',
        phone: '+33 6 87 65 43 21',
    },
    {
        id: '7',
        nom: 'LEROY',
        prenom: 'Antoine',
        email: 'antoine.leroy@univ-evry.fr',
        phone: '+33 7 98 76 54 32',
    },
    {
        id: '8',
        nom: 'SIMON',
        prenom: 'Emma',
        email: 'emma.simon@univ-evry.fr',
        filieres: ['Informatique'],
    },
]
