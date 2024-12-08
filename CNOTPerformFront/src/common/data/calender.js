const events = [
  {
    id: 1,
    title: "Entourage",
    start: new Date().setDate(new Date().getDate() + 1),
    className: "bg-success text-white",
  },
  {
    id: 2,
    title: "Entourage",
    start: new Date(),
    end: new Date(),
    className: "bg-success text-white",
  },
  {
    id: 3,
    title: "Gestion des CNO",
    start: new Date().setDate(new Date().getDate() + 18),
    className: "bg-dark text-white",
  },
  {
    id: 4,
    title: "All Day Event",
    start: new Date().setDate(new Date().getDate() - 9),
    className: "bg-primary text-white",
  },
  {
    id: 5,
    title: "Universalité des jeux olympiques",
    start: new Date().setDate(new Date().getDate() - 3),
    className: "bg-info text-white",
  },
  {
    id: 6,
    title: "Valeurs olympiques",
    start: new Date().setDate(new Date().getDate()),
    className: "bg-danger text-white",
  },
  {
    id: 7,
    title: "Repeating Event",
    start: new Date().setDate(new Date().getDate() + 4),
    className: "bg-primary text-white",
  },
  {
    id: 8,
    title: "Développement du Sport",
    start: new Date().setDate(new Date().getDate() - 5),
    end: new Date().setDate(new Date().getDate() - 3),
    className: "bg-warning text-white",
  },
];

const calenderDefaultCategories = [
  {
    id: 1,
    title: "Entourage",
    type: "bg-success",
  },
  {
    id: 2,
    title: "Universalité des jeux olympiques",
    type: "bg-info",
  },
  {
    id: 3,
    title: "Développement du Sport",
    type: "bg-warning",
  },
  {
    id: 4,
    title: "Valeurs olympiques",
    type: "bg-danger",
  },
  {
    id: 5,
    title: "Gestion des CNO",
    type: "bg-secondary",
  },
];

export { calenderDefaultCategories, events };
