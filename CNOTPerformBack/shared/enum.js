const mailStatus ={
    seen : 'Seen',
    unseen : 'Unseen',
};

Object.freeze(mailStatus);

const bourseStatus ={
    attente : 'attente',
    acceptee : 'acceptee',
    refusee : 'refusee'
};

Object.freeze(bourseStatus);

const bourseGroupes ={
    universalite : 'Universalité des jeux Olympiques',
    entourage : 'Entourage',
    developpement : 'Développement du Sport',
    valeurs : 'Valeurs Olympiques',
    capciteadministration : 'Gestion des CNO et partage de connaissances',
};

Object.freeze(bourseGroupes);

const bourseDomaines ={
    developpement : 'Athlètes et développement du Sport',
    valeurs : 'Valeurs',
    capciteadministration : 'Développement des capacités et administration',
};

Object.freeze(bourseDomaines);

module.exports ={
    mailStatus,
    bourseGroupes,
    bourseDomaines,
    bourseStatus
};