// Données du séjour — tout est modifiable ici.
// Les prix logement ont été relevés sur les annonces le 02/10/2026 pour les dates du séjour.
// Les trajets et prix de transport sont des ESTIMATIONS à ajuster.

const TRIP = {
  title: "Vacs entre potes",
  dates: "6 → 11 novembre 2026",
  nights: 5,
  participants: ["Fef", "Romain", "Mathos", "Ben", "Fanny", "Eline", "Nathan", "Bastien", "duch", "CamDuch"],
};

// Location de voiture : 2 voitures × ~300 € sur 5 jours + ~60 € de carburant/péages, divisé par 10
const CAR_PER_PERSON = 66;

const PLACES = [
  {
    id: "2alpes",
    name: "Les 2 Alpes",
    where: "Venosc, Isère",
    emoji: "🏔️",
    listing: "Chalet « L'Aiguille » — jacuzzi, sauna, billard, baby-foot, arcade",
    specs: "14 voyageurs · 5 chambres · 11 lits · 3 sdb · ★ 4,87",
    url: "https://www.airbnb.fr/rooms/35378331?adults=11&check_in=2026-11-06&check_out=2026-11-11",
    photos: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-35378331/original/e5671f41-9a46-4fdc-b964-b586e111d54c.jpeg?im_w=960",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-35378331/original/a3bf90ca-a070-4fe7-bbb9-46b4894d7413.jpeg?im_w=960",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-35378331/original/154cf922-44f3-4319-84f2-d06b4563d194.jpeg?im_w=960",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-35378331/original/bcc2e211-3f11-472b-8c42-8c21877dc1ba.jpeg?im_w=960",
    ],
    travelTime: "≈ 4h30",
    travelDetail: "TGV Paris → Grenoble (3h) + 1h15 de voiture",
    trainPerPerson: 110, // A/R estimé
    lodgingTotal: 2804, // 2 394 € Airbnb + ménage 210 € + linge 20 €/pers (à régler sur place)
    lodgingNote: "2 394 € sur Airbnb + 210 € ménage + 200 € linge obligatoires sur place",
    note: "Hors saison : station et télécabine probablement fermées début novembre.",
  },
  {
    id: "lacanau",
    name: "Lacanau",
    where: "Gironde",
    emoji: "🌊",
    listing: "Maison au calme, piscine privée chauffée, proche océan, lac et golf",
    specs: "12 personnes · 6 chambres · 4 sdb · ★ 10/10",
    url: "https://www.abritel.fr/location-vacances/p1534447?chkin=2026-11-06&chkout=2026-11-11&adults=10",
    photos: [
      "https://media.vrbo.com/lodging/34000000/33710000/33702700/33702679/be35dcb2.jpg",
      "https://media.vrbo.com/lodging/34000000/33710000/33702700/33702679/c471382d.jpg",
      "https://media.vrbo.com/lodging/34000000/33710000/33702700/33702679/2cfbcd96.jpg",
      "https://media.vrbo.com/lodging/34000000/33710000/33702700/33702679/ca304326.jpg",
      "https://media.vrbo.com/lodging/34000000/33710000/33702700/33702679/1e1b746b.jpg",
      "https://media.vrbo.com/lodging/34000000/33710000/33702700/33702679/c18d4bfc.jpg",
      "https://media.vrbo.com/lodging/34000000/33710000/33702700/33702679/40d34c18.jpg",
      "https://media.vrbo.com/lodging/34000000/33710000/33702700/33702679/2506af76.jpg",
    ],
    travelTime: "≈ 3h30",
    travelDetail: "TGV Paris → Bordeaux (2h10) + 1h de voiture",
    trainPerPerson: 120,
    lodgingTotal: 1580,
    lodgingNote: "Prix Abritel taxes et frais compris",
    note: "",
  },
  {
    id: "ernes",
    name: "Ernes",
    where: "Calvados, Normandie",
    emoji: "🍏",
    listing: "Cidrerie — maison 6 chambres avec piscine, jacuzzi et lac privé",
    specs: "13 personnes · 6 chambres · 3 sdb · ★ 9,4/10",
    url: "https://www.abritel.fr/location-vacances/p4897040vb?chkin=2026-11-06&chkout=2026-11-11&adults=10",
    photos: [
      "https://media.vrbo.com/lodging/122000000/121720000/121718600/121718518/6884752a.jpg",
      "https://media.vrbo.com/lodging/122000000/121720000/121718600/121718518/24e66811.jpg",
      "https://media.vrbo.com/lodging/122000000/121720000/121718600/121718518/20cbe73d.jpg",
      "https://media.vrbo.com/lodging/122000000/121720000/121718600/121718518/dfc9dd6e.jpg",
      "https://media.vrbo.com/lodging/122000000/121720000/121718600/121718518/8f93f9de.jpg",
      "https://media.vrbo.com/lodging/122000000/121720000/121718600/121718518/9386e68c.jpg",
      "https://media.vrbo.com/lodging/122000000/121720000/121718600/121718518/ee0ed5bd.jpg",
    ],
    travelTime: "≈ 2h45",
    travelDetail: "Train Paris → Caen (2h) + 35 min de voiture",
    trainPerPerson: 60,
    lodgingTotal: 1976,
    lodgingNote: "Prix Abritel taxes et frais compris",
    note: "",
  },
  {
    id: "stmalo",
    name: "St-Malo",
    where: "Saint-Jacut-de-la-Mer, Bretagne",
    emoji: "⛵",
    listing: "Villa d'architecte sur l'eau, vue mer, plage à pied",
    specs: "13 voyageurs · 7 chambres · 7 lits · 3 sdb · ★ 4,95",
    url: "https://www.airbnb.fr/rooms/735929490896328870?adults=11&check_in=2026-11-06&check_out=2026-11-11",
    photos: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-735929490896328870/original/a12266b0-3b53-42e3-96e0-f111f5e0d688.jpeg?im_w=960",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-735929490896328870/original/7eaece16-fc24-407a-96c0-021d2dc86836.jpeg?im_w=960",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-735929490896328870/original/8e644fd6-673c-4f34-963f-c6a710dbbae8.jpeg?im_w=960",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-735929490896328870/original/3ca39700-3525-428d-b5da-af8ac68407c1.jpeg?im_w=960",
    ],
    travelTime: "≈ 3h15",
    travelDetail: "TGV Paris → Saint-Malo (2h30) + 30 min de voiture",
    trainPerPerson: 100,
    lodgingTotal: 2196,
    lodgingNote: "Prix Airbnb total",
    note: "",
  },
];
