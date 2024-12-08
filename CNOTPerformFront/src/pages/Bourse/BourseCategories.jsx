// Import statements
import React, { useState } from "react";
import {
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

// Image imports
import univ from "../../assets/images/icon/univolymp.png";
import developpement from "../../assets/images/icon/devsport.png";
import valeur from "../../assets/images/icon/valeursolymp.png";
import admin from "../../assets/images/icon/administration.png";
import entourage from "../../assets/images/icon/entourage.png";

// Card Component
const Card = ({ image, title, subtitle, children, footer }) => (
  <div className="my-3 w-full overflow-hidden rounded-lg bg-black text-white shadow-lg sm:w-96">
    <div className="p-6">
      <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
      <h3 className="mb-4 text-lg text-gray-400">{subtitle}</h3>
      <p className="mb-4">{children}</p>
      <div className="flex justify-end space-x-2">{footer}</div>
    </div>
  </div>
);

function BourseCategories() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [open, setOpen] = useState("");
  const [developpementDescription, setDeveloppementDescription] = useState("Les programmes mondiaux Développement du sport sont consacrés à la promotion du développement du sport, de la relève à l’élite, en collaboration avec les Fédérations Internationales et nationales et d’autres partenaires clés. Ils offrent quatre niveaux de soutien : soutien aux jeunes athlètes sur leur")
  const [valeurDescription, setValeurDescription] = useState("Le programme des valeurs olympiques vise à fournir le soutien nécessaire aux CNO pour promouvoir le sport pour tous, ainsi que les valeurs et principes fondamentaux de l’Olympisme dans le domaine du sport et de l’éducation, tout en assurant des conditions de pratique sportive équitables sans ")
  const [adminDescription, setAdminDescription] = useState("Les programmes mondiaux ci-dessous ont pour priorité d’aider les CNO à développer et maintenir des structures administratives solides et durables afin d’offrir à leurs athlètes et membres le soutien dont ils ont besoin. Ils visent à permettre l’accès aux dirigeants et collaborateurs des CNO à un large éventail de")
  const [entourageDescription, setEntourageDescription] = useState("Pour tout athlète, pour toute équipe, évoluer dans le bon environnement est essentiel pour progresser. Tant de facteurs sont primordiaux pour un bon entourage : bénéficier du soutien de personnes sensibilisées à des sujets clés tels que la protection des athlètes intègres et la lutte contre le dopage, la discrimination, le harcèlement et la manipulation des compétitions. Les programmes mondiaux Entourage soutiennent les membres de l’entourage, notamment les entraîneurs, en leur proposant des outils pour améliorer leurs")
  const [cardsData, setCardsData] = useState([
  
    
    {
      image: univ,
      title: "Universalité des Jeux Olympiques",
      subtitle: "Formation et éducation",
      description:
        "Les programmes mondiaux Universalité des Jeux Olympiques visent à donner la possibilité aux CNO du monde entier de soutenir des athlètes et équipes d’élite en leur apportant un soutien financier et technique dans leur préparation pour les Jeux",
      color: "#0369a1",
      domaine: "Athlètes et développement du sport",
      voirPlus: false
    },
    {
      image: entourage,
      title: "Entourage",
      subtitle: "Communauté et soutien",
      description: entourageDescription,
      color: "#16a34a",
      domaine: "Athlètes et développement du sport",
      voirPlus: true
    },
   
    {
      image: developpement,
      title: "Développement du Sport",
      subtitle: "Promotion et soutien",
      description: developpementDescription,
      color: "#fcd34d",
      domaine: "Athlètes et développement du sport",
      voirPlus: true
    },
    {
      image: admin,
      title: "Gestion des CNO et partage de connaissances",
      subtitle: "Gestion efficace",
      description: adminDescription,
      color: "#292524",
      domaine: "Capacité organisationnelle et rayonnement communautaire",
      voirPlus: true
    },
   
    {
      image: valeur,
      title: "Valeurs Olympiques",
      subtitle: "Respect, Excellence, Amitié",
      description: valeurDescription,
      color: "#dc2626",
      domaine: "Capacité organisationnelle et rayonnement communautaire",
      voirPlus: true
    },
 
  ]);

  const toggle = () => setModal(!modal);

  const toggleAccordion = (id) => {
    setOpen(open === id ? "" : id);
  };


  const voirPlus = (title) => {
    setCardsData((prevCardsData) =>
      prevCardsData.map((card) => {
        if (card.title === title) {
          switch (title) {
            case "Développement du Sport":
              card.description =
                "Les programmes mondiaux Développement du sport sont consacrés à la promotion du développement du sport, de la relève à l’élite, en collaboration avec les Fédérations Internationales et nationales et d’autres partenaires clés. Ils offrent quatre niveaux de soutien : soutien aux jeunes athlètes sur leur chemin vers une carrière prometteuse et une qualification pour les JOJ, soutien aux athlètes dans leur transition du niveau régional ou continental au niveau mondial, soutien aux athlètes ayant dû fuir leur pays en leur permettant de concourir en tant qu’athlètes réfugiés, contribution au développement du sport à grande échelle dans différents pays en accompagnant le renforcement du système sportif national.";
              break;
            case "Valeurs Olympiques":
              card.description =
                "Le programme des valeurs olympiques vise à fournir le soutien nécessaire aux CNO pour promouvoir le sport pour tous, ainsi que les valeurs et principes fondamentaux de l’Olympisme dans le domaine du sport et de l’éducation, tout en assurant des conditions de pratique sportive équitables sans discrimination d’aucune sorte et en soutenant la santé et l’intégrité des athlètes. Le programme est structuré autour de deux domaines d’action principaux : au niveau des organisations( l’objectif du programme est de veiller à ce que les organisations sportives soient gérées de manière sûre, durable et inclusive), au niveau communautaire(le but est d’aider davantage de personnes à s’engager dans le sport et avoir une activité physique et de promouvoir une éducation, une culture et un héritage fondés sur l’Olympisme et ses valeurs.)";
              break;
            case "Gestion des CNO et partage de connaissances":
              card.description =
                "Les programmes mondiaux ci-dessous ont pour priorité d’aider les CNO à développer et maintenir des structures administratives solides et durables afin d’offrir à leurs athlètes et membres le soutien dont ils ont besoin. Ils visent à permettre l’accès aux dirigeants et collaborateurs des CNO à un large éventail de formations et de cours dans de nombreux domaines liés à la gestion efficace d’un CNO au quotidien. Les enseignements et le soutien mutuels sont également importants ; c’est pourquoi ces programmes encouragent aussi les partages de connaissances et d’expérience entre CNO.";
              break;
            case "Entourage":
              card.description =
                "Pour tout athlète, pour toute équipe, évoluer dans le bon environnement est essentiel pour progresser. Tant de facteurs sont primordiaux pour un bon entourage : bénéficier du soutien de personnes sensibilisées à des sujets clés tels que la protection des athlètes intègres et la lutte contre le dopage, la discrimination, le harcèlement et la manipulation des compétitions. Les programmes mondiaux Entourage soutiennent les membres de l’entourage, notamment les entraîneurs, en leur proposant des outils pour améliorer leurs compétences à tous les niveaux.";
              break;
            default:
              break;
          }
          card.voirPlus = false;
        }
        return card;
      })
    );
  };

  return (
    <React.Fragment>
      <section className="offer-section" id="bourses">
        <h1> Bourses Olympiques </h1>
  
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {cardsData.map((card, index) => (
              <Card
                key={index}
                image={card.image}
                title={card.title}
                subtitle={card.subtitle}
                footer={
                  <Button
                    color="primary"
                    className="font-16 btn-block m-auto"
                    style={{ borderRadius: "25px" }}
                    onClick={() => {
                      setSelectedProgram(card);
                      toggle();
                    }}
                  >
                    Consulter
                  </Button>
                }
              >
                {card.description}{card.voirPlus && <a className="text-secondary" onClick={() => {
                  voirPlus(card.title);
                  card.voirPlus = false;
                }}>  Voir Plus...</a> }
              </Card>
            ))}
          </div>
        </div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>{selectedProgram?.title}</ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="auto">
                <img
                  className="img-fluid rounded"
                  src={selectedProgram?.image}
                  alt="Skote"
                  style={{ backgroundColor: selectedProgram?.color }}
                />
              </Col>
              <Col>
                <h2 className="text-2xl font-semibold">
                  {selectedProgram?.domaine}
                </h2>
              </Col>
            </Row>
            <Row className="mt-3">
              <h5>Ce groupe comprend les programmes suivants :</h5>
              <Col>
                <Accordion open={open} toggle={toggleAccordion}>
                  {selectedProgram?.title ===
                    "Universalité des Jeux Olympiques" && (
                    <>
                      <AccordionItem>
                        <AccordionHeader targetId="1">
                          Bourses olympiques pour athlètes
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                          Destinés à tous les CNO et à leurs athlètes, en
                          particulier à ceux qui en ont le plus grand besoin,
                          ces deux programmes offrent un soutien financier et
                          technique aux athlètes d’élite qui ont le potentiel
                          pour se qualifier pour les Jeux Olympiques, augmentant
                          ainsi l’universalité de ces derniers. Ces bourses
                          individuelles sont versées mensuellement aux
                          bénéficiaires dans le but de contribuer à leur
                          préparation et leur qualification pour les Jeux
                          Olympiques, que ce soit dans leur pays ou dans un
                          centre d’entraînement de haut niveau à l’étranger.
                          Pour Paris 2024, les CNO ayant les plus grandes
                          délégations aux Jeux Olympiques pourront choisir une
                          option à la carte leur offrant une flexibilité
                          supplémentaire pour l’utilisation du programme.
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="2">
                          Milano  Cortina 2026. Los Angeles 2028. Alpes francaises 2030 
                        </AccordionHeader>
                        <AccordionBody accordionId="2">
                          Bources olypiques pour athlètes Los Angeles 2028 : 
                          Les athlètes qui ambitionnent de concourir aux jeux olympiques de Los Angeles 2028 ne connaissent pas tous les memes conditions d'entrainements 
                          et de compétition . Afin d'uniformiser autant que possible les règles du jeu , des bourses individuelles sont prévues pour les CNO aux délégations traditionnellements plus grandes délégations aux jeux Olympiques et qui disposent déja de systèmes en place pour la haute performance sportive peuvent postuler pour recevoir des subventions forfaitaires qui sont assorties d'une plus grande souplesse en matière d'utilisation des fonds et de comptes à rendre . Afin d'encourager la parité femmes-hommes , la Solidarité Olympique 
                          procèdera , dans la messures du possible . à des allocations budgétaires équilibrées entre les genres . Grace à l'augmentation du budget pour la périodes 2025-2028 
                          , le nombre de bourses individuelles par CNO est passé de 5 à 6 .
                          Bourses olympiques pour athlètes
Milano Cortina 2026
Des bourses pour les Jeux Olympiques d'hiver sont disponibles pour aider des athlètes à s'entraîner et se qualifier pour les Jeux Olympiques Milano Cortina 2026 et Alpes françaises 2030. À l'instar de la version du programme pour les Jeux d'été, ces bourses individuelles et des options à la carte sont proposées aux CNO en fonction de leur niveau de participation aux sports d'hiver. Le but est d'améliorer les conditions d'entraînement et de compétition des athlètes de niveau olympique, tout en contribuant à la compétitivité et à l'universalité des Jeux, en donnant la priorité aux CNO de moindre taille et aux athlètes féminines.
                        </AccordionBody>
                      </AccordionItem>
                      
                      <AccordionItem>
                        <AccordionHeader targetId="2">
                       Soutien aux athlètes réfugiés
                        </AccordionHeader>
                        <AccordionBody accordionId="2"> Ouvert à tous les CNO de pays accueillant des réfugiés, ce programme cherche à repérer les athlètes réfugiés de haut niveau à travers le monde et à les soutenir dans leur préparation en vue de participer à des compétitions d'élite. À l'image du nombre croissant de réfugiés et de personnes déplacées de force dans le monde, le budget alloué à ce programme a augmenté en conséquence depuis la dernière période de quatre ans. Une assistance financière et technique est mise à la disposition d'un nombre limité d'athlètes réfugiés sous forme de bourses individuelles.
                        </AccordionBody>
                      </AccordionItem>
                    </>
                  )}
                  {selectedProgram?.title === "Entourage" && (
                    <>
                      <AccordionItem>
                        <AccordionHeader targetId="3">
                          Stages techniques pour  les entraîneurs et l'entourage des athlètes
                        </AccordionHeader>
                        <AccordionBody accordionId="3">
                        Les entraîneurs et autres membres de l'entourage d'un athlète jouent un rôle important dans le développement d'un athlète. C'est la raison pour laquelle la Solidarité Olympique offre aux membres de l'entourage, aux juges, aux officiels techniques et à d'autres personnes la possibilité de participer à des stages de courte durée afin de renforcer leurs compétences et leurs connaissances. Des formations spécifiques aux différents sports sont proposées en parallèle de cours spécialisés sur des sujets transversaux comme la condition physique, la planification des entraînements, la préparation mentale, la nutrition, etc. En travaillant étroitement avec les Fl, ce programme permet aux CNO d'enrichir les connaissances techniques sportives spécifiques ainsi que les capacités des entraîneurs et des membres de l'entourage dans leur pays. Le soutien a été étendu afin d'inclure un éventail plus large de membres et d'officiels appartenant à l'entourage des athlètes, comme l'éventuelle participation d'entraîneurs d'e-sports.
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="4">
                          Bourses olympiques pour entraîneurs
                        </AccordionHeader>
                        <AccordionBody accordionId="4">
                        La formation continue est indispensable pour que les entraîneurs restent au fait des derniers changements et des innovations les plus récentes dans leur domaine. Les systèmes sportifs nationaux peuvent indirectement bénéficier de meilleures normes d'entraînement. Un soutien financier est mis à la disposition des entraîneurs afin qu'ils augmentent leurs compétences, leurs connaissances et leurs expériences par le biais d'une formation de plusieurs mois dans des centres sportifs de haut niveau et des universités. Trois types de formation sont proposées: formation en sciences du sport, formation sportive spécifique et formation sur mesure dont le contenu doit être proposé par le CNO.
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="5">
                          Transition de carrière des athlètes
                        </AccordionHeader>
                        <AccordionBody accordionId="5">
                        Tous les athlètes finissent, à un moment donné, par devoir passer à autre chose après le sport. La Solidarité Olympique apporte une assistance financière aux CNO afin qu'ils soutiennent les athlètes dans l'acquisition de nouvelles compétences, de connaissances et de possibilités pour poursuivre une carrière post-sportive avec succès. Plusieurs options sont disponibles, entre des formations académiques et pro-fessionnelles, la participation à des ateliers proposés par Athlete365, le programme d'entreprenariat Business Accelerator ou encore la possibilité de suivre des études de niveau Master.
Soutien apporté aux

de niveau Master.
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="6">
                      Soutien apporté aux commissions des athlètes
                        </AccordionHeader>
                        <AccordionBody accordionId="6">
                        Le soutien apporté aux commissions des athlètes consiste à donner aux athlètes les moyens de se faire entendre au sein du mouvement sportif mondial. En soutenant un large éventail d'activités des commissions des athlètes au sein des CNO, des réunions aux élections, en passant par les forums, ou plus simplement la création d'une commission des athlètes lorsqu'il n'en existe pas encore, les CNO mettent en place un réseau mondial de représentation des athlètes à l'échelle de chaque pays.
                        Un soutien est également apporté aux représentants des athlètes de sorte qu'ils puissent participer aux forums continentaux des athlètes tous les deux ans.
                        </AccordionBody>
                      </AccordionItem>
                    </>
                  )}
                  {selectedProgram?.title === "Développement du Sport" && (
                    <>
                      <AccordionItem>
                        <AccordionHeader targetId="7">
                          Développement du système sportif national
                        </AccordionHeader>
                        <AccordionBody accordionId="7">
                        Les CNO dont les structures sportives élémentaires et les structures d'entraînement de base doivent être renforcées ont une solution à leur disposition. Ce programme est en effet conçu pour tirer l'ensemble du système vers le haut, des structures d'entrainement à la formation des encadrants en passant par les processus de développement des athlètes et de leurs performances, les politiques de bonne gouvernance, les projets en matière de médecine du sport, et bien d'autres. Seront visés en priorité les CNO qui démontrent un véritable potentiel d'amélioration dans ces domaines.
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="8">
                          Subvention pour athlètes de niveau continental
                        </AccordionHeader>
                        <AccordionBody accordionId="8">
                        Pour passer aux échelons supérieurs dans leur sport respectif, les athlètes ont parfois besoin d'une aide qui suffit à générer chez eux de meilleurs résultats à l'entraine-ment et en compétition. Cette subvention donne la possibilité aux athlètes de niveau continental de participer à des camps d'entrainement, de s'offrir les services d'un entraineur ou de couvrir les frais de participation à des compétitions de haut niveau nécessaires et pertinentes dans le cadre de leur programme d'entrainement.
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="9">
                         Subvention pour les sport d'équipe 
                        </AccordionHeader>
                        <AccordionBody accordionId="9">
                        Le programme de subvention pour les sports d'équipe permet aux CNO de sélectionner une équipe nationale qui bénéficiera d'un soutien technique et financier sur toute la durée du plan 2025-
                        2028. Cette subvention vise à épauler des équipes nationales afin qu'elles puissent s'entrainer et participer à des compétitions régionales, continentales ou internationales avec pour objectif de tenter de se qualifier pour les Jeux Olympiques. Afin d'augmenter le nombre d'équipes féminines participant à ce programme, les CNO ont la possibilité de diviser le budget disponible entre deux équipes, pour autant que l'une d'entre elles soit une équipe féminine. La subvention peut aussi servir à financer des camps d'entrainement, les frais des entraineurs et de l'équipe liés à la participation à des compétitions, et plus encore.
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="10">
                    Dévellopement des jeunes athlètes 
                        </AccordionHeader>
                        <AccordionBody accordionId="10">
                        Le programme de développement des jeunes athlètes apporte une assistance aux CNO pour qu'ils repèrent et entrainent leurs jeunes athlètes pour des compétitions juniors, ainsi que pour aider ces jeunes talents à participer à des épreuves de qualification en vue de leur sélection aux Jeux Olympiques de la Jeunesse d'été et d'hiver. Les CNO ont trois options à disposition: soutien technique et financier pour détecter et entrainer les jeunes athlètes; soutien financier pour participer aux épreuves de qualification des JOJ; opportunités d'entrainement et de compétition de durée variable organisées par les Fl pour un nombre limité de jeunes athlètes talentueux, ou, dans certains cas, pour des entraineurs et officiels. Grâce à une hausse du budget 2025-2028, de nouveaux projets cibleront les athlètes des sports figurant au programme des Jeux Olympiques de la Jeunesse Dakar 2026, en ciblant en particulier les athlètes des CNO africains.
                        </AccordionBody>
                      </AccordionItem>
                    </>
                  )}
                  {selectedProgram?.title === "Valeurs Olympiques" && (
                    <>
                      <AccordionItem>
                        <AccordionHeader targetId="11">
                          Initiatives
                        </AccordionHeader>
                        <AccordionBody accordionId="11">
                          <p>
                          Tel que le prévoit la Charte olympique, le rôle des CNO est de promouvoir les principes fondamentaux et les valeurs de l'Olympisme dans leurs pays, en particulier dans les domaines du sport et de l'édu-cation. Le programme des initiatives au niveau des valeurs olympiques propose des financements et de l'expertise aux CNO qui travaillent à la mise en place de processus ayant comme objectif le changement au niveau des organisations et/ou des communautés.
Le changement au niveau des organisations débouchera, à terme, sur le fait que

les CNO et les organisations sportives nationales gèreront un mouvement sûr, durable et inclusif. Au travers du changement au niveau des communautés, les CNO et les organisations sportives nationales viennent en aide aux citoyens en leur permettant de trouver une communauté dans le sport et pratiquer une activité phy-sique; bâtir des compétences sociales, morales et vitales transférables au travers de l'éducation fondée sur l'Olympisme et ses valeurs. L'objectif étant de créer et promouvoir une culture et un héritage olympiques.
Les CNO peuvent profiter de ce programme de différentes manières: en tant que «responsables de la mise en œuvre», en tant que «partenaires», (mise en œuvre conjointe) ou en tant que «bail-leurs de fonds», (une autre organisation se chargeant alors de la mise en œuvre), par exemple, en rejoignant le consortium

Olympisme365
                          </p>
                         
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="11">
                         Bources d'études et de formation aux valeurs olympiques 
                        </AccordionHeader>
                        <AccordionBody accordionId="11">
                          <p>
                          Des bourses spéciales sont proposées aux responsables administratifs et au personnel médical des CNO pour suivre des formations complètes ou des modules d'enseignement dans le but d'approfondir leurs connaissances dans un large éventail de domaines (médecine du sport, nutrition, santé mentale, lutte contre le dopage, protection, et bien d'autres). En étoffant leurs compétences et leurs savoir-faire, les parties prenantes du Mouvement olympique seront mieux armées pour instaurer ces changements au niveau des organisations et des communautés.
                          </p>

                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="11">
                          Journéé olympique
                        </AccordionHeader>
                        <AccordionBody accordionId="11">
                          <p>
                          La Journée olympique célèbre, chaque année, le sport, la santé et l'appartenance à une communauté. En cette journée du 23 juin (ou autour de cette date), le monde entier est invité à pratiquer une activité physique. La Charte olympique encourage les CNO à organiser des événements à l'occasion de la Journée olympique afin de promouvoir le Mouvement olympique et les valeurs olympiques. À cette fin, le programme offre des subsides aux CNO pour les aider à organiser les célébrations de la Journée olympique, dans le but d'encourager chacun à pratiquer un sport et avoir une activité physique, tout en profitant de nouveaux enseignements sur la culture, l'héritage et les valeurs olympiques.
                          </p>
                       
                        </AccordionBody>
                      </AccordionItem>
                    </>
                    
                  )}
                  {selectedProgram?.title ===
                    "Gestion des CNO et partage de connaissances" && (
                    <>
                      <AccordionItem>
                        <AccordionHeader targetId="12">
                          Développement de l’administration des CNO
                        </AccordionHeader>
                        <AccordionBody accordionId="12">
                       
                          <ul style={{ listStyleType: "square" }}>
                            <li>
                            Ce programme vise à soutenir les
CNO, en particulier ceux disposant de ressources limitées, à couvrir leurs coûts opérationnels et pouvoir ainsi atteindre et maintenir de meilleures normes de gestion. La subvention administrative, qui a été augmentée de 11% pour la période
2025-2028, permet de couvrir une partie des frais de fonctionnement des CNO.
Une subvention supplémentaire est à la disposition des CNO aux ressources limitées, afin de leur permettre de se doter de structures administratives plus solides durables, indispensables à l'élargissement de leurs activités et services.
Les initiatives en gestion des CNO donnent la possibilité à ces derniers de renforcer leurs structures de gestion et de remédier à leurs éventuelles faiblesses dans ce domaine. Il est possible de renforcer les capacités opérationnelles grâce à des projets visant à garantir une gestion et une gouvernance financière appropriées, par une assistance en matière de planification stratégique, par la modernisation des outils informatiques, l'amélioration des outils de communication, et bien d'autres mesures.
                            </li>
                           
                          </ul>
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="13">
                          Cours nationaux pour dirigeants sportifs
                        </AccordionHeader>
                        <AccordionBody accordionId="13">
                        Les athlètes ne sont pas les seuls à chercher à s'améliorer dans leur travail. En dehors de l'aire de compétition, il est important pour les instances d'administration sportive de rester au fait des méthodes de gestion actuelles ainsi que des bonnes pratiques. C'est pourquoi la Solidarité Olympique propose des cours d'administration sportive et des cours avancés en management du sport. Au final, plus les CNO peuvent compter sur des officiels et des collaborateurs bien formés et dotés de meilleures compétences, plus leurs capacités de gestion et leurs méthodes de travail en ressortent renforcés. La Solidarité Olympique fournit le matériel de formation, le cadre pour dispenser les cours et supervise la formation des formateurs. Les CNO sont incités à garantir une égalité d'accès à ces formations professionnelles, en visant un minimum de 40% de participation
                        féminine.
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="14">
                          Formation internationale en management du sport
                        </AccordionHeader>
                        <AccordionBody accordionId="14">
                        Pour renforcer la capacité des CNO et de leurs membres, ce programme donne accès à une formation internationale en management du sport de haut niveau à travers le Master Exécutif en Management des Organisations Sportives (MEMOS).
Dispensé par un réseau d'universités, le MEMOS comporte plusieurs modules répartis sur une année. Il est proposé en trois langues (anglais, espagnol et français).
Les participants sont appelés à réaliser un projet professionnel visant à améliorer un aspect de la gestion de leur organisation ou du développement de leur sport
Iheb
Iheb Yahyaoui
dans leur pays respectifs.
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="15">
                          Échanges entre CNO
                        </AccordionHeader>
                        <AccordionBody accordionId="15">
                        Il n'est pas rare de tirer les meilleures leçons directement de nos pairs. C'est l'idée qui sous-tend le programme d'échanges entre CNO, dont l'objectif est de faciliter le partage du savoir et l'échange des bonnes pratiques entre les CNO.
De la gestion financière aux ressources humaines, en passant par la protection et le développement du sport, le programme est destiné à permettre à tous les CNO de fonctionner de manière plus efficace et autonome. Deux formes d'échanges/ d'ateliers peuvent être organisés: ceux proposés par les CNO et ceux proposés par la Solidarité Olympique.

                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader targetId="16">
                          Forums pour les CNO {" "}
                        </AccordionHeader>
                        <AccordionBody accordionId="16">
                        Les forums pour les CNO constituent une occasion unique de réunir les CNO et la Solidarité Olympique pour échanger des connaissances, partager des informations et tisser des réseaux. Ces forums peuvent être organisés par thème en fonction des différents secteurs fonctionnels au sein des CNO ou pour aborder différentes thématiques ponctuelles, comme la préparation des délégations en vue de la prochaine

édition des Jeux Olympiques.
                        </AccordionBody>
                      </AccordionItem>
                     
                    </>
                  )}
                </Accordion>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
           Fermer
            </Button>
          </ModalFooter>
        </Modal>
      </section>
    </React.Fragment>
  );
}

export default BourseCategories;
