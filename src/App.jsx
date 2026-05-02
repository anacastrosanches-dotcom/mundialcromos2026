import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── PALETA ──────────────────────────────────────────
const C = {
  bg: "#090d16", surf: "#111827", surf2: "#1a2540", surf3: "#253058",
  green: "#00C853", red: "#FF1744", gold: "#FFD600", rare: "#FF6D00", legend: "#CE93D8",
  border: "rgba(255,255,255,0.08)", border2: "rgba(255,255,255,0.13)",
  text: "#e8eaf0", muted: "#7b85a0",
};

// ── SUPABASE ─────────────────────────────────────────
// ⚠️  Substitui pelos teus valores do Supabase Dashboard → Settings → API
const SUPABASE_URL  = "https://kvizmljhfzyysntipatl.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2aXptbGpoZnp5eXNudGlwYXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2Nzg2NzEsImV4cCI6MjA5MzI1NDY3MX0.z1c10X79rG9pTzMYrxo3pc2f-0AZty82IlteYwRlX60";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── DADOS ────────────────────────────────────────────
// 48 equipas oficiais Panini Mundial 2026 (por ordem do álbum)
const SECTIONS = [
  {id:"FWC",name:"Introdução/Museu FIFA",flag:"🏆",count:20},
  {id:"COC",name:"Coca-Cola",flag:"🥤",count:12},
  // Group A
  {id:"USA",name:"EUA",flag:"🇺🇸",count:20},
  {id:"PAN",name:"Panamá",flag:"🇵🇦",count:20},
  {id:"CAN",name:"Canadá",flag:"🇨🇦",count:20},
  {id:"ECU",name:"Equador",flag:"🇪🇨",count:20},
  // Group B
  {id:"ARG",name:"Argentina",flag:"🇦🇷",count:20},
  {id:"PER",name:"Peru",flag:"🇵🇪",count:20},
  {id:"CHI",name:"Chile",flag:"🇨🇱",count:20},
  {id:"ALG",name:"Argélia",flag:"🇩🇿",count:20},
  // Group C
  {id:"MEX",name:"México",flag:"🇲🇽",count:20},
  {id:"RSA",name:"África do Sul",flag:"🇿🇦",count:20},
  {id:"URU",name:"Uruguai",flag:"🇺🇾",count:20},
  {id:"CIV",name:"Costa do Marfim",flag:"🇨🇮",count:20},
  // Group D
  {id:"ENG",name:"Inglaterra",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",count:20},
  {id:"NGA",name:"Nigéria",flag:"🇳🇬",count:20},
  {id:"AUS",name:"Austrália",flag:"🇦🇺",count:20},
  {id:"UKR",name:"Ucrânia",flag:"🇺🇦",count:20},
  // Group E
  {id:"GER",name:"Alemanha",flag:"🇩🇪",count:20},
  {id:"SCO",name:"Escócia",flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",count:20},
  {id:"HUN",name:"Hungria",flag:"🇭🇺",count:20},
  {id:"NZL",name:"Nova Zelândia",flag:"🇳🇿",count:20},
  // Group F
  {id:"POR",name:"Portugal",flag:"🇵🇹",count:20},
  {id:"CRO",name:"Croácia",flag:"🇭🇷",count:20},
  {id:"GHA",name:"Gana",flag:"🇬🇭",count:20},
  {id:"MAR",name:"Marrocos",flag:"🇲🇦",count:20},
  // Group G
  {id:"ESP",name:"Espanha",flag:"🇪🇸",count:20},
  {id:"BRA",name:"Brasil",flag:"🇧🇷",count:20},
  {id:"JPN",name:"Japão",flag:"🇯🇵",count:20},
  {id:"CRC",name:"Costa Rica",flag:"🇨🇷",count:20},
  // Group H
  {id:"FRA",name:"França",flag:"🇫🇷",count:20},
  {id:"BEL",name:"Bélgica",flag:"🇧🇪",count:20},
  {id:"TUN",name:"Tunísia",flag:"🇹🇳",count:20},
  {id:"PAR",name:"Paraguai",flag:"🇵🇾",count:20},
  // Group I
  {id:"NED",name:"Holanda",flag:"🇳🇱",count:20},
  {id:"SEN",name:"Senegal",flag:"🇸🇳",count:20},
  {id:"SUI",name:"Suíça",flag:"🇨🇭",count:20},
  {id:"KOR",name:"Coreia do Sul",flag:"🇰🇷",count:20},
  // Group J
  {id:"NOR",name:"Noruega",flag:"🇳🇴",count:20},
  {id:"KSA",name:"Arábia Saudita",flag:"🇸🇦",count:20},
  {id:"QAT",name:"Qatar",flag:"🇶🇦",count:20},
  {id:"IRQ",name:"Iraque",flag:"🇮🇶",count:20},
  // Group K
  {id:"POL",name:"Polónia",flag:"🇵🇱",count:20},
  {id:"COL",name:"Colômbia",flag:"🇨🇴",count:20},
  {id:"EGY",name:"Egito",flag:"🇪🇬",count:20},
  {id:"JOR",name:"Jordânia",flag:"🇯🇴",count:20},
  // Group L
  {id:"SWE",name:"Suécia",flag:"🇸🇪",count:20},
  {id:"AUT",name:"Áustria",flag:"🇦🇹",count:20},
  {id:"BIH",name:"Bósnia-Herzegovina",flag:"🇧🇦",count:20},
  {id:"UZB",name:"Uzbequistão",flag:"🇺🇿",count:20},
  // Extra teams (remaining 48)
  {id:"HAI",name:"Haiti",flag:"🇭🇹",count:20},
  {id:"CPV",name:"Cabo Verde",flag:"🇨🇻",count:20},
  {id:"CUW",name:"Curaçau",flag:"🇨🇼",count:20},
  {id:"COD",name:"RD Congo",flag:"🇨🇩",count:20},
  {id:"IRN",name:"Irão",flag:"🇮🇷",count:20},
  {id:"TUR",name:"Turquia",flag:"🇹🇷",count:20},
  {id:"CZE",name:"Chéquia",flag:"🇨🇿",count:20},
];

const PLAYERS = {
  // FWC,
  FWC1:"Introdução",
  FWC2:"Introdução",
  FWC3:"Mascote Oficial",
  FWC4:"Slogan Oficial",
  FWC5:"Bola Oficial",
  FWC6:"Canadá (País Anfitrião)",
  FWC7:"México (País Anfitrião)",
  FWC8:"EUA (País Anfitrião)",
  FWC9:"Itália 1934 ⭐",
  FWC10:"Uruguai 1950 ⭐",
  FWC11:"Alemanha 1954 ⭐",
  FWC12:"Brasil 1962 ⭐",
  FWC13:"Alemanha 1974 ⭐",
  FWC14:"Argentina 1986 ⭐",
  FWC15:"Brasil 1994 ⭐",
  FWC16:"Brasil 2002 ⭐",
  FWC17:"Itália 2006 ⭐",
  FWC18:"Alemanha 2014 ⭐",
  FWC19:"Argentina 2022 ⭐",
  FWC20:"França 1998 ⭐",
  // USA,
  USA1:"Emblem",
  USA2:"Matt Freese",
  USA3:"Chris Richards",
  USA4:"Tim Ream",
  USA5:"Mark McKenzie",
  USA6:"Alex Freeman",
  USA7:"Antonee Robinson",
  USA8:"Tyler Adams",
  USA9:"Tanner Tessmann",
  USA10:"Weston McKennie",
  USA11:"Christian Roldan",
  USA12:"Timothy Weah",
  USA13:"Team Photo",
  USA14:"Diego Luna",
  USA15:"Malik Tillman",
  USA16:"Christian Pulisic 💎",
  USA17:"Brenden Aaronson",
  USA18:"Ricardo Pepi",
  USA19:"Haji Wright",
  USA20:"Folarin Balogun",
  // PAN,
  PAN1:"Emblem",
  PAN2:"Orlando Mosquera",
  PAN3:"Michael Murillo",
  PAN4:"Andres Andrade",
  PAN5:"Fidel Escobar",
  PAN6:"Anibal Godoy",
  PAN7:"Cristian Martinez",
  PAN8:"Jose Cordoba",
  PAN9:"Edgar Barcenas",
  PAN10:"Carlos Harvey",
  PAN11:"Adalberto Carrasquilla",
  PAN12:"Ismael Diaz",
  PAN13:"Team Photo",
  PAN14:"Jose Fajardo",
  PAN15:"Jose Luiz Rodriguez",
  PAN16:"Cecilio Waterman",
  PAN17:"Alberto Quintero",
  PAN18:"Alfredo Stephens",
  PAN19:"Rolando Blackburn",
  PAN20:"Cesar Blackman",
  // CAN,
  CAN1:"Emblem",
  CAN2:"Dayne St.Clair",
  CAN3:"Alphonso Davies 💎",
  CAN4:"Alistair Johnston",
  CAN5:"Samuel Adekugbe",
  CAN6:"Richie Laryea",
  CAN7:"Derek Cornelius",
  CAN8:"Moïse Bombito",
  CAN9:"Kamal Miller",
  CAN10:"Stephen Eustáquio",
  CAN11:"Ismaël Koné",
  CAN12:"Jonathan Osorio",
  CAN13:"Team Photo",
  CAN14:"Jacob Shaffelburg",
  CAN15:"Mathieu Choinière",
  CAN16:"Niko Sigur",
  CAN17:"Tajon Buchanan",
  CAN18:"Liam Millar",
  CAN19:"Cyle Larin",
  CAN20:"Jonathan David",
  // ECU,
  ECU1:"Emblem",
  ECU2:"Hernán Galíndez",
  ECU3:"Gonzalo Valle",
  ECU4:"Piero Hincapié",
  ECU5:"Pervis Estupiñán",
  ECU6:"Willian Pacho",
  ECU7:"Ángelo Preciado",
  ECU8:"Joel Ordóñez",
  ECU9:"Moises Caicedo",
  ECU10:"Alan Franco",
  ECU11:"Kendry Paez",
  ECU12:"Pedro Vite",
  ECU13:"Team Photo",
  ECU14:"John Yeboah",
  ECU15:"Leonardo Campana",
  ECU16:"Gonzalo Plata",
  ECU17:"Nilson Angulo",
  ECU18:"Alan Minda",
  ECU19:"Kevin Rodriguez",
  ECU20:"Enner Valencia",
  // ARG,
  ARG1:"Emblem",
  ARG2:"Emiliano Martinez",
  ARG3:"Nahuel Molina",
  ARG4:"Cristian Romero",
  ARG5:"Nicolas Otamendi",
  ARG6:"Nicolas Tagliafico",
  ARG7:"Leonardo Balerdi",
  ARG8:"Enzo Fernandez",
  ARG9:"Alexis Mac Allister",
  ARG10:"Rodrigo De Paul",
  ARG11:"Exequiel Palacios",
  ARG12:"Leandro Paredes",
  ARG13:"Team Photo",
  ARG14:"Nico Paz",
  ARG15:"Franco Mastantuono",
  ARG16:"Nico Gonzalez",
  ARG17:"Lionel Messi 💎",
  ARG18:"Lautaro Martinez",
  ARG19:"Julian Alvarez",
  ARG20:"Giuliano Simeone",
  // PER,
  PER1:"Emblem",
  PER2:"Pedro Gallese",
  PER3:"Alexander Callens",
  PER4:"Carlos Zambrano",
  PER5:"Miguel Trauco",
  PER6:"Luis Abram",
  PER7:"Aldo Corzo",
  PER8:"Josepmir Ballon",
  PER9:"Renato Tapia",
  PER10:"Andy Polo",
  PER11:"Christian Cueva",
  PER12:"Edison Flores",
  PER13:"Team Photo",
  PER14:"Sergio Pena",
  PER15:"Joao Grimaldo",
  PER16:"Bryan Reyna",
  PER17:"Andre Carrillo",
  PER18:"Paolo Guerrero",
  PER19:"Gianluca Lapadula",
  PER20:"Alex Valera",
  // CHI,
  CHI1:"Emblem",
  CHI2:"Claudio Bravo",
  CHI3:"Gabriel Arias",
  CHI4:"Gary Medel",
  CHI5:"Guillermo Maripan",
  CHI6:"Mauricio Isla",
  CHI7:"Eugenio Mena",
  CHI8:"Charles Aranguiz",
  CHI9:"Arturo Vidal",
  CHI10:"Erick Pulgar",
  CHI11:"Marcelino Nunez",
  CHI12:"Felipe Mora",
  CHI13:"Team Photo",
  CHI14:"Alexis Sanchez",
  CHI15:"Damian Pizarro",
  CHI16:"Luciano Cabral",
  CHI17:"Fabian Castillo",
  CHI18:"Ben Brereton Diaz",
  CHI19:"Paulo Diaz",
  CHI20:"Victor Davila",
  // ALG,
  ALG1:"Emblem",
  ALG2:"Alexis Guendouz",
  ALG3:"Ramy Bensebaini",
  ALG4:"Youcef Atal",
  ALG5:"Rayan Aït-Nouri",
  ALG6:"Mohamed Amine Tougai",
  ALG7:"Aïssa Mandi",
  ALG8:"Ismael Bennacer",
  ALG9:"Houssem Aquar",
  ALG10:"Hicham Boudaoui",
  ALG11:"Ramiz Zerrouki",
  ALG12:"Nabil Bentalab",
  ALG13:"Team Photo",
  ALG14:"Farés Chaibi",
  ALG15:"Riyad Mahrez",
  ALG16:"Said Benrhama",
  ALG17:"Anis Hadj Moussa",
  ALG18:"Amine Gouiri",
  ALG19:"Baghdad Bounedjah",
  ALG20:"Mohammed Amoura",
  // MEX,
  MEX1:"Emblem",
  MEX2:"Luis Malagón",
  MEX3:"Johan Vasquez",
  MEX4:"Cesar Montes",
  MEX5:"Jesus Gallardo",
  MEX6:"Israel Reyes",
  MEX7:"Edson Alvarez",
  MEX8:"Marcel Ruiz",
  MEX9:"Hirving Lozano",
  MEX10:"Raúl Jiménez",
  MEX11:"Alexis Vega",
  MEX12:"Roberto Alvarado",
  MEX13:"Team Photo",
  MEX14:"Orbelin Pineda",
  MEX15:"Uriel Antuna",
  MEX16:"Chucky Lozano",
  MEX17:"Luis Romo",
  MEX18:"Santi Giménez 💎",
  MEX19:"Julián Quiñones",
  MEX20:"Henry Martin",
  // RSA,
  RSA1:"Emblem",
  RSA2:"Ronwen Williams",
  RSA3:"Ricardo Goss",
  RSA4:"Siyanda Xulu",
  RSA5:"Rushine de Reuck",
  RSA6:"Reeve Frosler",
  RSA7:"Sifiso Hlanti",
  RSA8:"Ethan Brooks",
  RSA9:"Mothobi Mvala",
  RSA10:"Teboho Mokoena",
  RSA11:"Themba Zwane",
  RSA12:"Itumeleng Khune Mbatha",
  RSA13:"Team Photo",
  RSA14:"Bathasi Aubaas",
  RSA15:"Yaya Sithole",
  RSA16:"Sipho Mbule",
  RSA17:"Lyle Foster",
  RSA18:"Iqraam Rayners",
  RSA19:"Mohau Nkota",
  RSA20:"Oswin Appollis",
  // URU,
  URU1:"Emblem",
  URU2:"Sergio Rochet",
  URU3:"Sebastian Caceres",
  URU4:"Ronald Araujo",
  URU5:"Jose Gimenez",
  URU6:"Matias Vina",
  URU7:"Nahitan Nandez",
  URU8:"Rodrigo Bentancur",
  URU9:"Nicolas de la Cruz",
  URU10:"Lucas Torreira",
  URU11:"Facundo Pellistri",
  URU12:"Maximiliano Araujo",
  URU13:"Team Photo",
  URU14:"Manuel Ugarte",
  URU15:"Federico Valverde 💎",
  URU16:"Darwin Nunez",
  URU17:"Maxi Gomez",
  URU18:"Brian Rodriguez",
  URU19:"Agustin Canobbio",
  URU20:"Benja Toro",
  // CIV,
  CIV1:"Emblem",
  CIV2:"Yahia Fofana",
  CIV3:"Ghislain Konan",
  CIV4:"Wilfried Singo",
  CIV5:"Odilon Kossounou",
  CIV6:"Evan Ndicka",
  CIV7:"Willy Boly",
  CIV8:"Emmanuel Agbadou",
  CIV9:"Ousmane Diomande",
  CIV10:"Franck Kessie",
  CIV11:"Seko Fofana",
  CIV12:"Ibrahim Sangare",
  CIV13:"Team Photo",
  CIV14:"Jean-Philippe Gbamin",
  CIV15:"Amad Diallo",
  CIV16:"Sébastien Haller",
  CIV17:"Simon Adringa",
  CIV18:"Yan Diomande",
  CIV19:"Evann Guessand",
  CIV20:"Oumar Diakite",
  // ENG,
  ENG1:"Emblem",
  ENG2:"Jordan Pickford",
  ENG3:"John Stones",
  ENG4:"Marc Guéhi",
  ENG5:"Ezri Konsa",
  ENG6:"Trent Alexander-Arnold",
  ENG7:"Reece James",
  ENG8:"Dan Burn",
  ENG9:"Jordan Henderson",
  ENG10:"Declan Rice",
  ENG11:"Jude Bellingham 💎",
  ENG12:"Cole Palmer",
  ENG13:"Team Photo",
  ENG14:"Morgan Rogers",
  ENG15:"Anthony Gordon",
  ENG16:"Phil Foden",
  ENG17:"Bukayo Saka",
  ENG18:"Harry Kane 💎",
  ENG19:"Marcus Rashford",
  ENG20:"Ollie Watkins",
  // AUS,
  AUS1:"Emblem",
  AUS2:"Mathew Ryan",
  AUS3:"Joe Gauci",
  AUS4:"Harry Souttar",
  AUS5:"Alessandro Circati",
  AUS6:"Jordan Bos",
  AUS7:"Aziz Behich",
  AUS8:"Cameron Burgess",
  AUS9:"Lewis Miller",
  AUS10:"Milos Degenek",
  AUS11:"Jackson Irvine",
  AUS12:"Riley McGree",
  AUS13:"Team Photo",
  AUS14:"Aiden O'Neill",
  AUS15:"Connor Metcalfe",
  AUS16:"Patrick Yazbek",
  AUS17:"Craig Goodwin",
  AUS18:"Kusini Vengi",
  AUS19:"Nestory Irankunda",
  AUS20:"Mohamed Touré",
  // GER,
  GER1:"Emblem",
  GER2:"Marc-André ter Stegen",
  GER3:"Jonathan Tah",
  GER4:"David Raum",
  GER5:"Nico Schlotterbeck",
  GER6:"Antonio Rüdiger",
  GER7:"Waldemar Anton",
  GER8:"Ridle Baku",
  GER9:"Maximilian Mittelstadt",
  GER10:"Joshua Kimmich 💎",
  GER11:"Florian Wirtz 💎",
  GER12:"Felix Nmecha",
  GER13:"Team Photo",
  GER14:"Leon Goretzka",
  GER15:"Jamal Musiala",
  GER16:"Serge Gnabry",
  GER17:"Kai Havertz",
  GER18:"Leroy Sane",
  GER19:"Karim Adeyemi",
  GER20:"Nick Woltemade",
  // SCO,
  SCO1:"Emblem",
  SCO2:"Craig Gordon",
  SCO3:"Liam Kelly",
  SCO4:"Grant Hanley",
  SCO5:"Jack Hendry",
  SCO6:"Liam Cooper",
  SCO7:"Aaron Hickey",
  SCO8:"Andrew Robertson",
  SCO9:"John McGinn",
  SCO10:"Callum McGregor",
  SCO11:"Billy Gilmour",
  SCO12:"Scott McTominay",
  SCO13:"Team Photo",
  SCO14:"Ryan Christie",
  SCO15:"Stuart Armstrong",
  SCO16:"Ryan Jack",
  SCO17:"Lawrence Shankland",
  SCO18:"Lyndon Dykes",
  SCO19:"Kenny McLean",
  SCO20:"Che Adams",
  // POR,
  POR1:"Emblem",
  POR2:"Diogo Costa",
  POR3:"Jose Sa",
  POR4:"Ruben Dias",
  POR5:"Pepe",
  POR6:"Nuno Mendes",
  POR7:"Joao Cancelo",
  POR8:"Vitinha",
  POR9:"Bruno Fernandes",
  POR10:"Bernardo Silva",
  POR11:"Joao Neves",
  POR12:"Ruben Neves",
  POR13:"Team Photo",
  POR14:"Rafael Leao",
  POR15:"Pedro Neto",
  POR16:"Joao Felix",
  POR17:"Gonçalo Ramos",
  POR18:"Cristiano Ronaldo 💎",
  POR19:"Diogo Jota",
  POR20:"Francisco Trincao",
  // CRO,
  CRO1:"Emblem",
  CRO2:"Dominik Livaković",
  CRO3:"Duje Caleta-Car",
  CRO4:"Josko Gvardiol",
  CRO5:"Josip Stanišić",
  CRO6:"Luka Vušković",
  CRO7:"Josip Sutalo",
  CRO8:"Kristijan Jakic",
  CRO9:"Luka Modrić 💎",
  CRO10:"Mateo Kovacic",
  CRO11:"Martin Baturina",
  CRO12:"Lovro Majer",
  CRO13:"Team Photo",
  CRO14:"Mario Pasalic",
  CRO15:"Petar Sucic",
  CRO16:"Ivan Perišić",
  CRO17:"Marco Pasalic",
  CRO18:"Ante Budimir",
  CRO19:"Andrej Kramarić",
  CRO20:"Franjo Ivanovic",
  // GHA,
  GHA1:"Emblem",
  GHA2:"Lawrence Ati Zigi",
  GHA3:"Tariq Lamptey",
  GHA4:"Mohammed Salisu",
  GHA5:"Alidu Seidu",
  GHA6:"Alexander Djiku",
  GHA7:"Gideon Mensah",
  GHA8:"Caleb Yirenkyi",
  GHA9:"Abdul Issahaku Fatawu",
  GHA10:"Thomas Partey",
  GHA11:"Salis Abdul Samed",
  GHA12:"Kamaldeen Sulemana",
  GHA13:"Team Photo",
  GHA14:"Mohammed Kudus",
  GHA15:"Inaki Williams",
  GHA16:"Jordan Ayew",
  GHA17:"Andrew Ayew",
  GHA18:"Joseph Paintsil",
  GHA19:"Osman Bukari",
  GHA20:"Antoine Semenyo",
  // MAR,
  MAR1:"Emblem",
  MAR2:"Yassine Bounou",
  MAR3:"Munir Mohamedi",
  MAR4:"Nayef Aguerd",
  MAR5:"Romain Saiss",
  MAR6:"Jawad El Yamiq",
  MAR7:"Noussair Mazraoui",
  MAR8:"Achraf Hakimi 💎",
  MAR9:"Azzedine Ounahi",
  MAR10:"Sofyan Amrabat",
  MAR11:"Selim Amallah",
  MAR12:"Hakim Ziyech",
  MAR13:"Team Photo",
  MAR14:"Sofiane Boufal",
  MAR15:"Bilal El Khannouss",
  MAR16:"Ilias Chair",
  MAR17:"Abdessamad Ezzalzouli",
  MAR18:"Youssef En-Nesyri",
  MAR19:"Ayoub El Kaabi",
  MAR20:"Zakaria Aboukhlal",
  // ESP,
  ESP1:"Emblem",
  ESP2:"Unai Simon",
  ESP3:"Robin Le Normand",
  ESP4:"Aymeric Laporte",
  ESP5:"Dean Huijsen",
  ESP6:"Pedro Porro",
  ESP7:"Dani Carvajal",
  ESP8:"Marc Cucurella",
  ESP9:"Martín Zubimendi",
  ESP10:"Rodri",
  ESP11:"Pedri",
  ESP12:"Fabian Ruiz",
  ESP13:"Team Photo",
  ESP14:"Mikel Merino",
  ESP15:"Lamine Yamal 💎",
  ESP16:"Dani Olmo",
  ESP17:"Nico Williams",
  ESP18:"Ferran Torres",
  ESP19:"Álvaro Morata",
  ESP20:"Mikel Oyarzabal",
  // BRA,
  BRA1:"Emblem",
  BRA2:"Alisson",
  BRA3:"Bento",
  BRA4:"Marquinhos",
  BRA5:"Éder Militão",
  BRA6:"Gabriel Magalhães",
  BRA7:"Danilo",
  BRA8:"Wesley",
  BRA9:"Lucas Paquetá",
  BRA10:"Casemiro",
  BRA11:"Bruno Guimarães",
  BRA12:"Luiz Henrique",
  BRA13:"Team Photo",
  BRA14:"Vinícius Júnior 💎",
  BRA15:"Rodrygo",
  BRA16:"João Pedro",
  BRA17:"Matheus Cunha",
  BRA18:"Gabriel Martinelli",
  BRA19:"Raphinha",
  BRA20:"Estévão",
  // JPN,
  JPN1:"Emblem",
  JPN2:"Shuichi Gonda",
  JPN3:"Zion Suzuki",
  JPN4:"Ko Itakura",
  JPN5:"Hiroki Ito",
  JPN6:"Shogo Taniguchi",
  JPN7:"Miki Yamane",
  JPN8:"Yuto Nagatomo",
  JPN9:"Wataru Endo",
  JPN10:"Hidemasa Morita",
  JPN11:"Daichi Kamada",
  JPN12:"Junya Ito",
  JPN13:"Team Photo",
  JPN14:"Kaoru Mitoma",
  JPN15:"Ritsu Doan",
  JPN16:"Keito Nakamura",
  JPN17:"Takefusa Kubo 💎",
  JPN18:"Takumi Minamino",
  JPN19:"Koki Ogawa",
  JPN20:"Ayase Ueda",
  // CRC,
  CRC1:"Emblem",
  CRC2:"Keylor Navas",
  CRC3:"Kendall Waston",
  CRC4:"Francisco Calvo",
  CRC5:"Juan Pablo Vargas",
  CRC6:"Bryan Ruiz",
  CRC7:"Celso Borges",
  CRC8:"Yeltsin Tejeda",
  CRC9:"Randall Leal",
  CRC10:"Alvaro Zamora",
  CRC11:"Joel Campbell",
  CRC12:"Jewison Bennette",
  CRC13:"Team Photo",
  CRC14:"Brandon Aguilera",
  CRC15:"Carlos Martinez",
  CRC16:"Anthony Contreras",
  CRC17:"Johan Venegas",
  CRC18:"Andy Reyes",
  CRC19:"Manfred Ugalde",
  CRC20:"Jostin Leal",
  // FRA,
  FRA1:"Emblem",
  FRA2:"Mike Maignan",
  FRA3:"Theo Hernandez",
  FRA4:"William Saliba",
  FRA5:"Jules Kounde",
  FRA6:"Ibrahima Konate",
  FRA7:"Dayot Upamecano",
  FRA8:"Lucas Digne",
  FRA9:"Aurélien Tchouaméni",
  FRA10:"Eduardo Camavinga",
  FRA11:"Manu Kone",
  FRA12:"Adrien Rabiot",
  FRA13:"Team Photo",
  FRA14:"Michael Olise",
  FRA15:"Ousmane Dembele",
  FRA16:"Bradley Barcola",
  FRA17:"Désiré Doué",
  FRA18:"Kingsley Coman",
  FRA19:"Hugo Ekitike",
  FRA20:"Kylian Mbappé 💎",
  // BEL,
  BEL1:"Emblem",
  BEL2:"Thibaut Courtois",
  BEL3:"Arthur Theate",
  BEL4:"Timothy Castagne",
  BEL5:"Zeno Debast",
  BEL6:"Brandon Mechele",
  BEL7:"Maxim De Cuyper",
  BEL8:"Thomas Meunier",
  BEL9:"Youri Tielemans",
  BEL10:"Amadou Onana",
  BEL11:"Nicolas Raskin",
  BEL12:"Alexis Saelemaekers",
  BEL13:"Team Photo",
  BEL14:"Hans Vanaken",
  BEL15:"Kevin De Bruyne 💎",
  BEL16:"Jérémy Doku",
  BEL17:"Charles De Ketelaere",
  BEL18:"Leandro Trossard",
  BEL19:"Loïs Openda",
  BEL20:"Romelu Lukaku",
  // TUN,
  TUN1:"Emblem",
  TUN2:"Aymen Dahmen",
  TUN3:"Bechir Ben Said",
  TUN4:"Montassar Talbi",
  TUN5:"Yassine Meriah",
  TUN6:"Nader Ghandri",
  TUN7:"Ali Maaloul",
  TUN8:"Mohamed Drager",
  TUN9:"Ferjani Sassi",
  TUN10:"Aissa Laidouni",
  TUN11:"Ellyes Skhiri",
  TUN12:"Wahbi Khazri",
  TUN13:"Team Photo",
  TUN14:"Hannibal Mejbri",
  TUN15:"Elias Achouri",
  TUN16:"Seifeddine Jaziri",
  TUN17:"Issam Jebali",
  TUN18:"Youssef Msakni",
  TUN19:"Naim Sliti",
  TUN20:"Sayfallah Ltaief",
  // PAR,
  PAR1:"Emblem",
  PAR2:"Antony Silva",
  PAR3:"Gustavo Gomez",
  PAR4:"Omar Alderete",
  PAR5:"Junior Alonso",
  PAR6:"Ivan Piris",
  PAR7:"Santiago Arzamendia",
  PAR8:"Richard Sanchez",
  PAR9:"Mathias Villasanti",
  PAR10:"Miguel Almirón 💎",
  PAR11:"Andres Cubas",
  PAR12:"Gabriel Avalos",
  PAR13:"Team Photo",
  PAR14:"Angel Romero",
  PAR15:"Antonio Sanabria",
  PAR16:"Carlos Gonzalez",
  PAR17:"Julio Enciso",
  PAR18:"Ramon Sosa",
  PAR19:"Alejandro Romero",
  PAR20:"Juan Angel Villalba",
  // NED,
  NED1:"Emblem",
  NED2:"Bart Verbruggen",
  NED3:"Mark Flekken",
  NED4:"Virgil van Dijk 💎",
  NED5:"Matthijs de Ligt",
  NED6:"Stefan de Vrij",
  NED7:"Nathan Ake",
  NED8:"Denzel Dumfries",
  NED9:"Ryan Gravenberch",
  NED10:"Frenkie de Jong",
  NED11:"Tijjani Reijnders",
  NED12:"Teun Koopmeiners",
  NED13:"Team Photo",
  NED14:"Donyell Malen",
  NED15:"Xavi Simons",
  NED16:"Wout Weghorst",
  NED17:"Cody Gakpo",
  NED18:"Memphis Depay",
  NED19:"Brian Brobbey",
  NED20:"Steven Bergwijn",
  // SEN,
  SEN1:"Emblem",
  SEN2:"Edouard Mendy",
  SEN3:"Alfred Gomis",
  SEN4:"Kalidou Koulibaly",
  SEN5:"Abdou Diallo",
  SEN6:"Ismail Jakobs",
  SEN7:"Formose Mendy",
  SEN8:"Nampalys Mendy",
  SEN9:"Idrissa Gueye",
  SEN10:"Pape Matar Sarr",
  SEN11:"Nicolas Jackson",
  SEN12:"Lamine Camara",
  SEN13:"Team Photo",
  SEN14:"Krepin Diatta",
  SEN15:"Ismaila Sarr",
  SEN16:"Sadio Mané 💎",
  SEN17:"Habib Diallo",
  SEN18:"Boulaye Dia",
  SEN19:"Moussa Niakhate",
  SEN20:"Pathé Ciss",
  // SUI,
  SUI1:"Emblem",
  SUI2:"Yann Sommer",
  SUI3:"Gregor Kobel",
  SUI4:"Manuel Akanji",
  SUI5:"Fabian Schar",
  SUI6:"Nico Elvedi",
  SUI7:"Ricardo Rodriguez",
  SUI8:"Silvan Widmer",
  SUI9:"Granit Xhaka",
  SUI10:"Remo Freuler",
  SUI11:"Michel Aebischer",
  SUI12:"Ruben Vargas",
  SUI13:"Team Photo",
  SUI14:"Ardon Jashari",
  SUI15:"Dan Ndoye",
  SUI16:"Xherdan Shaqiri",
  SUI17:"Breel Embolo",
  SUI18:"Zeki Amdouni",
  SUI19:"Noah Okafor",
  SUI20:"Fabian Rieder",
  // KOR,
  KOR1:"Emblem",
  KOR2:"Hyeon-woo Jo",
  KOR3:"Seung-Gyu Kim",
  KOR4:"Min-jae Kim",
  KOR5:"Yu-min Cho",
  KOR6:"Young-woo Seol",
  KOR7:"Han-beom Lee",
  KOR8:"Tae-seok Lee",
  KOR9:"Myung-jae Lee",
  KOR10:"Jae-sung Lee",
  KOR11:"In-beom Hwang",
  KOR12:"Kang-in Lee",
  KOR13:"Team Photo",
  KOR14:"Seung-ho Paik",
  KOR15:"Jens Castrop",
  KOR16:"Dongg-yeong Lee",
  KOR17:"Gue-sung Cho",
  KOR18:"Heung-min Son 💎",
  KOR19:"Hee-chan Hwang",
  KOR20:"Hyeon-Gyu Oh",
  // NOR,
  NOR1:"Emblem",
  NOR2:"Orjan Nyland",
  NOR3:"Julian Ryerson",
  NOR4:"Kristoffer Ajer",
  NOR5:"Leo Skiri Ostigard",
  NOR6:"David Møller Wolfe",
  NOR7:"Birger Meling",
  NOR8:"Sander Berge",
  NOR9:"Martin Ødegaard 💎",
  NOR10:"Patrick Berg",
  NOR11:"Fredrik Aursnes",
  NOR12:"Mohamed Elyounoussi",
  NOR13:"Team Photo",
  NOR14:"Antonio Nusa",
  NOR15:"Alexander Sørloth",
  NOR16:"Oscar Bobb",
  NOR17:"Erling Haaland 💎",
  NOR18:"Ola Brynhildsen",
  NOR19:"Jørgen Strand Larsen",
  NOR20:"Thelo Aasgaard",
  // KSA,
  KSA1:"Emblem",
  KSA2:"Mohammed Al-Owais",
  KSA3:"Nawaf Al-Aqidi",
  KSA4:"Hassan Al-Tambakti",
  KSA5:"Ali Al-Bulaihi",
  KSA6:"Abdulelah Al-Amri",
  KSA7:"Saud Abdulhamid",
  KSA8:"Mohamed Kanno",
  KSA9:"Musab Al-Juwayr",
  KSA10:"Ali Al-Hassan",
  KSA11:"Sami Al-Najei",
  KSA12:"Saleh Al-Shehri",
  KSA13:"Team Photo",
  KSA14:"Firas Al-Buraikan",
  KSA15:"Nasser Al-Dawsari",
  KSA16:"Salem Al-Dawsari",
  KSA17:"Abdullah Radif",
  KSA18:"Ali Al-Dawsari",
  KSA19:"Haitham Asiri",
  KSA20:"Khaled Al-Ghannam",
  // QAT,
  QAT1:"Emblem",
  QAT2:"Meshaal Barsham",
  QAT3:"Bassam Al-Rawi",
  QAT4:"Tarek Salman",
  QAT5:"Abdelkarim Hassan",
  QAT6:"Pedro Miguel",
  QAT7:"Mohammed Waad",
  QAT8:"Karim Boudiaf",
  QAT9:"Assim Madibo",
  QAT10:"Abdulaziz Hatem",
  QAT11:"Akram Afif 💎",
  QAT12:"Hasan Al-Haydos",
  QAT13:"Team Photo",
  QAT14:"Ahmed Alaaeldin",
  QAT15:"Ismaeel Mohammad",
  QAT16:"Almoez Ali",
  QAT17:"Khalid Muneer",
  QAT18:"Yusuf Abdurisag",
  QAT19:"Mohammed Muntari",
  QAT20:"Naif Al-Hadhrami",
  // IRQ,
  IRQ1:"Emblem",
  IRQ2:"Jalal Hassan",
  IRQ3:"Hussein Ali",
  IRQ4:"Tarek Salman",
  IRQ5:"Akam Hashem",
  IRQ6:"Zaid Tahseen",
  IRQ7:"Zidane Iqbal",
  IRQ8:"Amir Al-Ammari",
  IRQ9:"Ibrahim Bayesh",
  IRQ10:"Ali Jasim",
  IRQ11:"Aimar Sher",
  IRQ12:"Mohanad Ali",
  IRQ13:"Team Photo",
  IRQ14:"Ahmed Yasin",
  IRQ15:"Ameen Al-Dabbagh",
  IRQ16:"Aymen Hussein",
  IRQ17:"Hammadi Ahmed",
  IRQ18:"Ali Faez",
  IRQ19:"Ahmed Alkhafaji",
  IRQ20:"Osama Rashid",
  // POL,
  POL16:"Robert Lewandowski 💎",
  // COL,
  COL1:"Emblem",
  COL2:"Camilo Vargas",
  COL3:"David Ospina",
  COL4:"Dávinson Sánchez",
  COL5:"Yerry Mina",
  COL6:"Daniel Munoz",
  COL7:"Johan Mojica",
  COL8:"Jhon Lucumí",
  COL9:"Santiago Arias",
  COL10:"Jefferson Lerma",
  COL11:"Kevin Castaño",
  COL12:"Richard Rios",
  COL13:"Team Photo",
  COL14:"James Rodriguez",
  COL15:"Juan Fernando Quintero",
  COL16:"Jorge Carrascal",
  COL17:"Jhon Arias",
  COL18:"Jhon Cordova",
  COL19:"Luis Suarez",
  COL20:"Luis Díaz 💎",
  // EGY,
  EGY1:"Emblem",
  EGY2:"Mohamed El Shenawy",
  EGY3:"Mohamed Hany",
  EGY4:"Mohamed Hamdy",
  EGY5:"Yasser Ibrahim",
  EGY6:"Khaled Sobhi",
  EGY7:"Ramy Rabia",
  EGY8:"Hossam Abdelmaguid",
  EGY9:"Ahmed Fatouh",
  EGY10:"Marwan Attia",
  EGY11:"Zizo",
  EGY12:"Hamdy Fathy",
  EGY13:"Team Photo",
  EGY14:"Mohamed Lasheen",
  EGY15:"Emam Ashour",
  EGY16:"Osama Faisal",
  EGY17:"Mohamed Salah 💎",
  EGY18:"Mostafa Mohamed",
  EGY19:"Trezeguet",
  EGY20:"Omar Marmoush",
  // JOR,
  JOR1:"Emblem",
  JOR2:"Yazeed Abulaila",
  JOR3:"Baher Madanat",
  JOR4:"Abdallah Nasib",
  JOR5:"Samer Issa",
  JOR6:"Ahmad Saleh",
  JOR7:"Baha Abdulrahman",
  JOR8:"Aws Al-Sari",
  JOR9:"Ihsan Haddad",
  JOR10:"Mahmoud Al-Mardi",
  JOR11:"Ali Olwan",
  JOR12:"Musa Al-Tamari",
  JOR13:"Team Photo",
  JOR14:"Nour Ali",
  JOR15:"Yazan Al-Naimat",
  JOR16:"Omar Al-Dameek",
  JOR17:"Ahmad Arida",
  JOR18:"Hamzah Aldrweesh",
  JOR19:"Rami Hamadeh",
  JOR20:"Zaid Al-Qatawneh",
  // SWE,
  SWE1:"Emblem",
  SWE2:"Robin Olsen",
  SWE3:"Samuel Brolin",
  SWE4:"Victor Lindelof",
  SWE5:"Isak Hien",
  SWE6:"Pontus Jansson",
  SWE7:"Emil Krafth",
  SWE8:"Mikael Lustig",
  SWE9:"Jens Cajuste",
  SWE10:"Dejan Kulusevski",
  SWE11:"Albin Ekdal",
  SWE12:"Emil Forsberg",
  SWE13:"Team Photo",
  SWE14:"Jesper Karlsson",
  SWE15:"Alexander Isak 💎",
  SWE16:"Viktor Gyökeres 💎",
  SWE17:"Anthony Elanga",
  SWE18:"Robin Quaison",
  SWE19:"Jordan Larsson",
  SWE20:"Mattias Svanberg",
  // AUT,
  AUT1:"Emblem",
  AUT2:"Alexander Schlager",
  AUT3:"Patrick Pentz",
  AUT4:"David Alaba",
  AUT5:"Kevin Danso",
  AUT6:"Philipp Lienhart",
  AUT7:"Stefan Bosch",
  AUT8:"Phillipp Mwene",
  AUT9:"Alexander Prass",
  AUT10:"Xavier Schlager",
  AUT11:"Marcel Sabitzer",
  AUT12:"Konrad Laimer",
  AUT13:"Team Photo",
  AUT14:"Florian Grillitsch",
  AUT15:"Nicolas Seiwald",
  AUT16:"Romano Schmid",
  AUT17:"Patrick Wimmer",
  AUT18:"Christoph Baumgartner",
  AUT19:"Michael Gregoritsch",
  AUT20:"Marko Arnautović",
  // BIH,
  BIH1:"Emblem",
  BIH2:"Nikola Vasilj",
  BIH3:"Amer Dedic",
  BIH4:"Sead Kolasinac",
  BIH5:"Tarik Muharemovic",
  BIH6:"Nihad Mujakic",
  BIH7:"Nikola Katic",
  BIH8:"Amir Hadziahmetovic",
  BIH9:"Benjamin Tahirovic",
  BIH10:"Armin Gigovic",
  BIH11:"Ivan Sunjic",
  BIH12:"Ivan Basic",
  BIH13:"Team Photo",
  BIH14:"Dzenis Burnic",
  BIH15:"Esmir Bajraktarevic",
  BIH16:"Amar Memic",
  BIH17:"Ermedin Demirovic",
  BIH18:"Edin Dzeko",
  BIH19:"Samed Bazdar",
  BIH20:"Haris Tabakovic",
  // UZB,
  UZB1:"Emblem",
  UZB2:"Utkir Yusupov",
  UZB3:"Farrukh Savfiev",
  UZB4:"Sherzod Nasrullaev",
  UZB5:"Umar Eshmurodov",
  UZB6:"Husniddin Aliqulov",
  UZB7:"Rustamjon Ashurmatov",
  UZB8:"Khojiakbar Alijonov",
  UZB9:"Abdukodir Khusanov",
  UZB10:"Odiljon Hamrobekov",
  UZB11:"Otabek Shukurov",
  UZB12:"Jamshid Iskanderov",
  UZB13:"Team Photo",
  UZB14:"Azizbek Turgunboev",
  UZB15:"Jasur Yaxshiboyev",
  UZB16:"Eldor Shomurodov",
  UZB17:"Bobur Abdullayev",
  UZB18:"Dilshod Yusupov",
  UZB19:"Jaloliddin Masharipov",
  UZB20:"Abduqodir Husanov",
  // HAI,
  HAI1:"Emblem",
  HAI2:"Josue Duverger",
  HAI3:"Jean-Ricner Bellegarde",
  HAI4:"Danley Jean-Jacques",
  HAI5:"Frantzdy Pierrot",
  HAI6:"Samuel Camille",
  HAI7:"Zachary Herivaux",
  HAI8:"Frantznel Exume",
  HAI9:"Steeven Saba",
  HAI10:"Chery Jeff Louis",
  HAI11:"Carnejy Antoine",
  HAI12:"Dady Preval",
  HAI13:"Team Photo",
  HAI14:"Banel Nicolas",
  HAI15:"Kervens Belfort",
  HAI16:"Mechack Jerome",
  HAI17:"Nairo Rodman",
  HAI18:"Ethan Etienne",
  HAI19:"Leo Boucheron",
  HAI20:"Stephane Abaul",
  // CPV,
  CPV1:"Emblem",
  CPV2:"Vozinha",
  CPV3:"Logan Costa",
  CPV4:"Pico",
  CPV5:"Diney",
  CPV6:"Steven Moreira",
  CPV7:"Wagner Pina",
  CPV8:"Joao Paulo",
  CPV9:"Yannick Semedo",
  CPV10:"Kevin Pina",
  CPV11:"Patrick Andrade",
  CPV12:"Jamiro Monteiro",
  CPV13:"Team Photo",
  CPV14:"Deroy Duarte",
  CPV15:"Garry Rodrigues",
  CPV16:"Jovane Cabral",
  CPV17:"Ryan Mendes",
  CPV18:"Dailon Livramento",
  CPV19:"Willy Semedo",
  CPV20:"Bebe",
  // CUW,
  CUW1:"Emblem",
  CUW2:"Eloy Room",
  CUW3:"Armando Obispo",
  CUW4:"Sherel Floranus",
  CUW5:"Jurien Gaari",
  CUW6:"Joshua Brenet",
  CUW7:"Roshon Van Eijma",
  CUW8:"Shurandy Sambo",
  CUW9:"Livano Comenencia",
  CUW10:"Godfried Roemeratoe",
  CUW11:"Juninho Bacuna",
  CUW12:"Leandro Bacuna",
  CUW13:"Team Photo",
  CUW14:"Tahith Chong",
  CUW15:"Kenji Gorre",
  CUW16:"Jearl Margaritha",
  CUW17:"Jurgen Locadia",
  CUW18:"Jeremy Antonisse",
  CUW19:"Gervane Kastaneer",
  CUW20:"Sontje Hansen",
  // COD,
  COD1:"Emblem",
  COD2:"Lionel Mpasi",
  COD3:"Aaron Wan-Bissaka",
  COD4:"Axel Tuanzebe",
  COD5:"Arthur Masuaku",
  COD6:"Chancel Mbemba",
  COD7:"Joris Kayembe",
  COD8:"Charles Pickel",
  COD9:"Ngal'ayel Mukau",
  COD10:"Edo Kayembe",
  COD11:"Samuel Moutoussamy",
  COD12:"Noah Sadiki",
  COD13:"Team Photo",
  COD14:"Théo Bongonda",
  COD15:"Meschak Elia",
  COD16:"Yoane Wissa",
  COD17:"Brian Cipenga",
  COD18:"Fiston Mayele",
  COD19:"Cédric Bakambu",
  COD20:"Nathanaël Mbuku",
  // IRN,
  IRN1:"Emblem",
  IRN2:"Alireza Beiranvand",
  IRN3:"Hossein Hosseini",
  IRN4:"Morteza Pouraliganji",
  IRN5:"Milad Mohammadi",
  IRN6:"Ramin Rezaeian",
  IRN7:"Sadegh Moharrami",
  IRN8:"Saeid Ezatolahi",
  IRN9:"Ahmad Noorollahi",
  IRN10:"Ali Gholizadeh",
  IRN11:"Alireza Jahanbakhsh",
  IRN12:"Mehdi Torabi",
  IRN13:"Team Photo",
  IRN14:"Karim Ansarifard",
  IRN15:"Saman Ghoddos",
  IRN16:"Sardar Azmoun",
  IRN17:"Mehdi Taremi",
  IRN18:"Ali Karimi",
  IRN19:"Shojae Khalilzadeh",
  IRN20:"Ehsan Hajsafi",
  // TUR,
  TUR1:"Emblem",
  TUR2:"Mert Gunok",
  TUR3:"Altay Bayindir",
  TUR4:"Merih Demiral",
  TUR5:"Caglar Soyuncu",
  TUR6:"Samet Akaydin",
  TUR7:"Zeki Celik",
  TUR8:"Ferdi Kadioglu",
  TUR9:"Hakan Çalhanoğlu 💎",
  TUR10:"Orkun Kokcu",
  TUR11:"Salih Ozcan",
  TUR12:"Yusuf Yazici",
  TUR13:"Team Photo",
  TUR14:"Baris Alper Yilmaz",
  TUR15:"Kenan Yildiz",
  TUR16:"Arda Güler 💎",
  TUR17:"Cenk Tosun",
  TUR18:"Cengiz Under",
  TUR19:"Yunus Akgun",
  TUR20:"Ogulcan Caglayan",
  // CZE,
  CZE1:"Emblem",
  CZE2:"Matej Kovar",
  CZE3:"Jindrich Stanek",
  CZE4:"Ladislav Krejci",
  CZE5:"Vladimir Coufal",
  CZE6:"Jaroslav Zeleny",
  CZE7:"Tomas Holes",
  CZE8:"David Zima",
  CZE9:"Michal Sadilek",
  CZE10:"Lukas Provod",
  CZE11:"Lukas Cerv",
  CZE12:"Tomas Soucek",
  CZE13:"Team Photo",
  CZE14:"Pavel Sulc",
  CZE15:"Matej Vydra",
  CZE16:"Vasil Kusej",
  CZE17:"Tomas Chory",
  CZE18:"Vacilav Cerny",
  CZE19:"Adam Hlozek",
  CZE20:"Patrik Schick"
};

const LEGENDS = new Set(["ARG18","ESP15","POR18","BRA15","FRA17","ENG9","ENG15","GER7","GER9","NED4","BEL11","USA16","CAN16","MEX18","URU15","CRO9","CRO7","MAR6","SEN15","JPN12","KOR18","KOR12","NOR17","NOR10","QAT11","KSA18","COL11","COL15","ECU10","ALG12","GHA14","EGY16","EGY11","POL16","SWE15","SWE16","SWE10","NGA15","NGA10","CIV8","PAR10","CRC2","IRN15","IRN11","SCO14","TUR8","TUR15","TUR14","CZE16","COD16","BIH8","UZB15","RSA11"]);

function getRarity(secId, num) {
  const key = secId + num;
  if (LEGENDS.has(key)) return "legendary";
  if (num === 1) return "special";
  if (secId === "FWC" && num >= 9) return "special";
  if (secId === "COC") return "coca";
  return "normal";
}

// ⚠️ Define aqui a tua password secreta de admin — não partilhes com ninguém!
const ADMIN_PASSWORD = "Amaezing.2026!";

// ── ESTILOS PARTILHADOS ──────────────────────────────
const s = {
  page: {background:C.bg, minHeight:"100vh", fontFamily:"system-ui,sans-serif", color:C.text, overflowX:"hidden"},
  card: {background:C.surf, border:`1px solid ${C.border2}`, borderRadius:14, padding:"1rem"},
  btn: (bg,color="#000") => ({background:bg,color,border:"none",borderRadius:10,padding:".8rem 1.2rem",fontWeight:700,fontSize:"1rem",cursor:"pointer",width:"100%",fontFamily:"inherit"}),
  btnSm: (bg,color=C.text) => ({background:bg,color,border:`1px solid ${C.border2}`,borderRadius:8,padding:".35rem .75rem",fontWeight:600,fontSize:".8rem",cursor:"pointer",fontFamily:"inherit"}),
  input: {background:C.surf2,border:`1px solid ${C.border2}`,borderRadius:10,color:C.text,fontSize:".95rem",padding:".75rem 1rem",width:"100%",fontFamily:"inherit",outline:"none"},
  label: {fontSize:".72rem",fontWeight:700,color:C.muted,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:".3rem"},
  topbar: {background:C.bg,borderBottom:`1px solid ${C.border}`,padding:".7rem 1rem",display:"flex",alignItems:"center",gap:".65rem",position:"sticky",top:0,zIndex:100},
};

// ════════════════════════════════════════════════════
// APP ROOT  — com Supabase Auth
// ════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen]           = useState("auth"); // auth | mode | grid | search | group | match | market | events
  const [authUser, setAuthUser]       = useState(null);   // Supabase auth user
  const [me, setMe]                   = useState(null);   // member profile
  const [members, setMembers]         = useState([]);
  const [market, setMarket]           = useState([]);
  const [events, setEvents]           = useState([]);
  const [gridMode, setGridMode]       = useState("have");
  const [matchTarget, setMatchTarget] = useState(null);
  const [toast, setToast]             = useState("");
  const [loading, setLoading]         = useState(true);
  const [isAdmin, setIsAdmin]         = useState(false);
  const pendingCount = events.filter(e=>e.status==="pendente").length;

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),2400); };
  const go = (sc) => { setScreen(sc); window.scrollTo(0,0); };
  const openGrid = (mode) => { setGridMode(mode); go("grid"); };
  const openMatch = (name) => { setMatchTarget(name); go("match"); };

  // ── Fetch helpers — cada um busca só o que precisa ─────────────
  const fetchMembers = useCallback(async () => {
    const { data } = await sb.from("members").select("id,name,local,mail,have,need,auth_id").order("created_at");
    if (data) setMembers(data.map(m=>({...m,have:m.have||{},need:m.need||{}})));
  }, []);

  const fetchMarket = useCallback(async () => {
    const { data } = await sb.from("market").select("*").order("created_at",{ascending:false});
    if (data) setMarket(data);
  }, []);

  const fetchEvents = useCallback(async () => {
    const { data } = await sb.from("events").select("*").order("created_at");
    if (data) setEvents(data.map(e=>({...e,rsvps:e.rsvps||[]})));
  }, []);

  // Mantido para compatibilidade (carregamento inicial)
  const fetchAll = useCallback(async () => {
    await Promise.all([fetchMembers(), fetchMarket(), fetchEvents()]);
  }, [fetchMembers, fetchMarket, fetchEvents]);

  // ── Check Supabase session on mount ─────────────────────────────
  useEffect(() => {
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setAuthUser(session.user);
        await loadMemberProfile(session.user);
      }
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      if (session) { setAuthUser(session.user); await loadMemberProfile(session.user); }
      else { setAuthUser(null); setMe(null); setIsAdmin(false); go("auth"); }
    });
    fetchAll();
    // Real-time: cada tabela actualiza só o seu estado
    const ch = sb.channel("realtime-all")
      .on("postgres_changes",{event:"*",schema:"public",table:"members"},({new:row,eventType}) => {
        if(eventType==="INSERT") setMembers(prev=>[...prev,{...row,have:row.have||{},need:row.need||{}}]);
        else if(eventType==="UPDATE") setMembers(prev=>prev.map(m=>m.id===row.id?{...row,have:row.have||{},need:row.need||{}}:m));
        else if(eventType==="DELETE") setMembers(prev=>prev.filter(m=>m.id!==row.id));
      })
      .on("postgres_changes",{event:"*",schema:"public",table:"market"},fetchMarket)
      .on("postgres_changes",{event:"*",schema:"public",table:"events"},fetchEvents)
      .subscribe();
    return () => { subscription.unsubscribe(); sb.removeChannel(ch); };
  }, [fetchAll, fetchMembers, fetchMarket, fetchEvents]);

  // ── Load member profile from DB ──────────────────────────────────
  const loadMemberProfile = async (user) => {
    const { data } = await sb.from("members").select("*").eq("auth_id", user.id).single();
    if (data) {
      setMe({...data, have:data.have||{}, need:data.need||{}});
      const savedAdmin = localStorage.getItem("wc26_admin");
      if (savedAdmin==="1") setIsAdmin(true);
      go("mode");
    } else {
      go("profile");
    }
    // Não faz fetchAll aqui — o real-time trata disso
  };

  // ── Auth helpers ─────────────────────────────────────────────────
  const signUp = async (email, password) => {
    setLoading(true);
    const { error } = await sb.auth.signUp({ email, password });
    setLoading(false);
    if (error) return error.message;
    return null;
  };

  const signIn = async (email, password) => {
    setLoading(true);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return error.message;
    return null;
  };

  const signOut = async () => {
    setIsAdmin(false);
    localStorage.removeItem("wc26_admin");
    await sb.auth.signOut();
  };

  // ── Save profile after first sign-up ────────────────────────────
  const saveProfile = async (profile) => {
    setLoading(true);
    const { data } = await sb.from("members")
      .insert({...profile, auth_id: authUser.id, have:{}, need:{}})
      .select().single();
    if (data) { setMe({...data,have:{},need:{}}); go("mode"); }
    setLoading(false);
  };

  // ── Stickers ─────────────────────────────────────────────────────
  const saveStickers = async (updated) => {
    setLoading(true);
    await sb.from("members").update({have:updated.have,need:updated.need}).eq("auth_id",authUser.id);
    setMe(updated); // actualiza só o utilizador local imediatamente
    setLoading(false);
    showToast("Guardado ✓");
    go("mode");
    // real-time actualiza os outros utilizadores automaticamente
  };

  // ── Market ───────────────────────────────────────────────────────
  const addMarket    = async (l) => { await sb.from("market").insert(l); };
  const deleteMarket = async (id) => { await sb.from("market").delete().eq("id",id); };

  // ── Events ───────────────────────────────────────────────────────
  const addEvent = async (ev) => {
    await sb.from("events").insert({...ev,status:"pendente",rsvps:[]});
    showToast("Proposta enviada! Aguarda aprovação ✓");
    go("mode");
  };
  const approveEvent = async (id) => { await sb.from("events").update({status:"aprovado"}).eq("id",id); showToast("Encontro aprovado! ✓"); };
  const rejectEvent  = async (id) => { await sb.from("events").delete().eq("id",id); showToast("Proposta rejeitada."); };
  const rsvpEvent    = async (id) => {
    const ev = events.find(e=>e.id===id); if(!ev||!me) return;
    const has = ev.rsvps.includes(me.name);
    const rsvps = has ? ev.rsvps.filter(r=>r!==me.name) : [...ev.rsvps,me.name];
    // Actualiza localmente para resposta imediata
    setEvents(prev=>prev.map(e=>e.id===id?{...e,rsvps}:e));
    await sb.from("events").update({rsvps}).eq("id",id);
  };

  if (loading) return (
    <div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1rem"}}>
      <div style={{fontSize:"2.5rem",animation:"spin 1s linear infinite"}}>⚽</div>
      <div style={{color:C.muted}}>A carregar…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={s.page}>
      {screen==="auth"    && <Auth onSignIn={signIn} onSignUp={signUp} showToast={showToast}/>}
      {screen==="profile" && <Profile onSave={saveProfile} showToast={showToast}/>}
      {screen==="mode"    && <Mode me={me} pendingCount={pendingCount} isAdmin={isAdmin}
        onAdminLogin={(pw)=>{ if(pw===ADMIN_PASSWORD){ setIsAdmin(true); localStorage.setItem("wc26_admin","1"); return true; } return false; }}
        onGo={(sc)=>{ if(sc==="grid-have") openGrid("have"); else if(sc==="grid-need") openGrid("need"); else go(sc); }}
        onLogout={signOut}/>}
      {screen==="grid"    && <Grid me={me} mode={gridMode} onBack={()=>go("mode")} onSave={saveStickers} showToast={showToast}/>}
      {screen==="search"  && <Search members={members} me={me} onBack={()=>go("mode")}/>}
      {screen==="group"   && <Group me={me} members={members} onBack={()=>go("mode")} onOpenMatch={openMatch}/>}
      {screen==="match"   && <MatchDetail me={me} members={members} target={matchTarget} onBack={()=>go("group")}/>}
      {screen==="market"  && <Market me={me} market={market} members={members} onBack={()=>go("mode")} onAdd={addMarket} onDelete={deleteMarket} showToast={showToast}/>}
      {screen==="events"  && <Events me={me} events={events} isAdmin={isAdmin} onBack={()=>go("mode")} onAdd={addEvent} onApprove={approveEvent} onReject={rejectEvent} onRsvp={rsvpEvent} showToast={showToast}/>}
      {toast && <Toast msg={toast}/>}
    </div>
  );
}
// ════════════════════════════════════════════════════
// AUTH — Login / Registo
// ════════════════════════════════════════════════════
function Auth({onSignIn, onSignUp, showToast}) {
  const [tab, setTab]         = useState("login"); // login | register
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if(!email.trim()||!email.includes("@")){showToast("Email inválido!");return}
    if(password.length<6){showToast("Password mínimo 6 caracteres!");return}
    setLoading(true);
    const err = tab==="login" ? await onSignIn(email,password) : await onSignUp(email,password);
    setLoading(false);
    if(err){
      if(err.includes("Invalid login")) showToast("Email ou password incorrectos.");
      else if(err.includes("already registered")) showToast("Este email já está registado. Faz login!");
      else showToast(err);
    } else if(tab==="register") {
      showToast("Conta criada! Completa o teu perfil.");
    }
  };

  const Tab = ({id,label}) => (
    <button onClick={()=>setTab(id)} style={{
      flex:1,padding:".65rem",border:"none",cursor:"pointer",fontFamily:"inherit",
      fontWeight:700,fontSize:".9rem",
      background:tab===id?C.surf3:C.surf2,
      color:tab===id?C.text:C.muted,
      borderBottom:tab===id?`2px solid ${C.green}`:"2px solid transparent",
    }}>{label}</button>
  );

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1.5rem",gap:"1.5rem",background:C.bg}}>
      <div style={{width:90,height:115,borderRadius:12,background:"linear-gradient(160deg,#0a3d1f,#1565c0)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4,boxShadow:"0 8px 40px #00000099"}}>
        <span style={{fontSize:"2.2rem"}}>⚽</span>
        <span style={{fontWeight:900,fontSize:".8rem",color:C.gold,letterSpacing:3}}>2026</span>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontWeight:900,fontSize:"2.5rem",lineHeight:.95}}>Trocas<br/><span style={{color:C.gold}}>Mundial</span><br/>2026</div>
        <p style={{color:C.muted,fontSize:".85rem",marginTop:".75rem"}}>Regista cromos, encontra matches e troca!</p>
      </div>
      <div style={{width:"100%",maxWidth:340,background:C.surf,borderRadius:16,overflow:"hidden",border:`1px solid ${C.border2}`}}>
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
          <Tab id="login"    label="Entrar"/>
          <Tab id="register" label="Criar conta"/>
        </div>
        <div style={{padding:"1.25rem",display:"flex",flexDirection:"column",gap:".85rem"}}>
          <div>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="o-teu@email.com"
              value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          <div>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="mínimo 6 caracteres"
              value={password} onChange={e=>setPassword(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          <button style={s.btn(loading?"#555":C.green)} onClick={submit} disabled={loading}>
            {loading?"A processar…":tab==="login"?"Entrar →":"Criar conta →"}
          </button>
          {tab==="login"&&<p style={{fontSize:".72rem",color:C.muted,textAlign:"center",lineHeight:1.5}}>
            Ainda não tens conta? Clica em "Criar conta" acima.
          </p>}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// PROFILE — Completar perfil após registo
// ════════════════════════════════════════════════════
function Profile({onSave, showToast}) {
  const [name,  setName]  = useState("");
  const [local, setLocal] = useState("");
  const [mail,  setMail]  = useState("sim");
  const [rgpd,  setRgpd]  = useState(false);
  const [loading,setLoading]=useState(false);

  const submit = async () => {
    if(!name.trim()) {showToast("Escreve o teu nome!");return}
    if(!local.trim()){showToast("Indica a tua localidade!");return}
    if(!rgpd)        {showToast("Aceita os termos RGPD para continuar.");return}
    setLoading(true);
    await onSave({name:name.trim(), local:local.trim(), mail});
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1.5rem",gap:"1.25rem",background:C.bg}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontWeight:900,fontSize:"1.6rem"}}>Completa o teu perfil</div>
        <p style={{color:C.muted,fontSize:".85rem",marginTop:".3rem"}}>Só precisamos de mais alguns dados</p>
      </div>
      <div style={{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:".85rem"}}>
        <div>
          <label style={s.label}>O teu nome</label>
          <input style={s.input} placeholder="ex: João Silva" value={name} onChange={e=>setName(e.target.value)} maxLength={30}/>
        </div>
        <div>
          <label style={s.label}>Localidade</label>
          <input style={s.input} placeholder="ex: Lisboa, Porto, Braga…" value={local} onChange={e=>setLocal(e.target.value)} maxLength={40}/>
        </div>
        <div>
          <label style={s.label}>Envio por correio?</label>
          <select style={s.input} value={mail} onChange={e=>setMail(e.target.value)}>
            <option value="sim">✅ Sim, aceito envio CTT</option>
            <option value="nao">❌ Só presencial</option>
          </select>
        </div>
        <label style={{display:"flex",alignItems:"flex-start",gap:".65rem",cursor:"pointer",padding:".8rem",background:C.surf2,borderRadius:10,border:`1px solid ${C.border2}`}}>
          <input type="checkbox" checked={rgpd} onChange={e=>setRgpd(e.target.checked)} style={{width:16,height:16,marginTop:2,flexShrink:0,accentColor:C.green}}/>
          <span style={{fontSize:".72rem",color:C.muted,lineHeight:1.55}}>
            Concordo que o meu nome e localidade sejam partilhados com os membros deste grupo para fins de organização de trocas. Os dados podem ser removidos a qualquer momento.{" "}
            <strong style={{color:C.text}}>RGPD · art. 6.º(1)(a)</strong>
          </span>
        </label>
        <button style={s.btn(loading?"#555":C.green)} onClick={submit} disabled={loading}>
          {loading?"A guardar…":"Entrar na app →"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// MODE (menu principal)
// ════════════════════════════════════════════════════
function Mode({me, onGo, pendingCount, isAdmin, onLogout, onAdminLogin}) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [adminPwErr, setAdminPwErr] = useState(false);

  const cards = [
    {icon:"✅",title:"Registar repetidos",desc:"Marca os cromos que tens a mais",sc:"grid-have"},
    {icon:"❌",title:"Registar em falta",desc:"Marca os cromos que precisas",sc:"grid-need"},
    {icon:"🔍",title:"Pesquisar cromo",desc:"Procura pelo nome, código ou raridade",sc:"search"},
    {icon:"🔄",title:"Matches no grupo",desc:"Vê quem tem o que precisas",sc:"group"},
    {icon:"💎",title:"Mercado de Raros",desc:"Propostas de troca para especiais e lendários",sc:"market"},
    {icon:"📅",title:"Encontros Presenciais",desc:"Propõe ou consulta encontros para trocar em mão",sc:"events",badge:pendingCount>0&&isAdmin?pendingCount:null},
  ];
  return (
    <div style={{minHeight:"100vh",background:C.bg,padding:"1.5rem"}}>
      <div style={{marginBottom:"1.25rem"}}>
        <div style={{fontWeight:900,fontSize:"1.7rem"}}>Olá, {me?.name.split(" ")[0]}! 👋</div>
        <div style={{color:C.muted,fontSize:".85rem",marginTop:".2rem"}}>📍 {me?.local} · {me?.mail==="sim"?"📬 Aceita envio":"🤝 Só presencial"}</div>
        {isAdmin
          ? <div style={{marginTop:".35rem",fontSize:".72rem",color:C.gold,fontWeight:700}}>⚙️ Modo Admin activo · <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setShowAdminLogin(false);}}>OK</span></div>
          : <button onClick={()=>setShowAdminLogin(v=>!v)} style={{marginTop:".35rem",background:"none",border:"none",color:C.muted,fontSize:".72rem",cursor:"pointer",padding:0,fontFamily:"inherit",textDecoration:"underline"}}>Entrar como admin</button>
        }
        {showAdminLogin && !isAdmin && (
          <div style={{marginTop:".5rem",display:"flex",gap:".5rem",alignItems:"center"}}>
            <input type="password" placeholder="Password de admin"
              style={{...s.input,fontSize:".8rem",padding:".45rem .75rem",flex:1}}
              value={adminPw} onChange={e=>setAdminPw(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"){ if(onAdminLogin(adminPw)){ setShowAdminLogin(false); setAdminPw(""); } else { setAdminPwErr(true); setTimeout(()=>setAdminPwErr(false),1500); } } }}
            />
            <button style={s.btn(C.green)} onClick={()=>{ if(onAdminLogin(adminPw)){ setShowAdminLogin(false); setAdminPw(""); } else { setAdminPwErr(true); setTimeout(()=>setAdminPwErr(false),1500); } }}>OK</button>
          </div>
        )}
        {adminPwErr && <div style={{fontSize:".72rem",color:C.red,marginTop:".25rem"}}>Password incorrecta</div>}
        <button onClick={onLogout} style={{marginTop:".35rem",background:"none",border:"none",color:C.muted,fontSize:".72rem",cursor:"pointer",padding:0,fontFamily:"inherit",textDecoration:"underline"}}>Sair / trocar de utilizador</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:".75rem"}}>
        {cards.map(c=>(
          <button key={c.sc} onClick={()=>onGo(c.sc)} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"1rem 1.1rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"1rem",textAlign:"left",color:C.text,width:"100%",fontFamily:"inherit"}}>
            <span style={{fontSize:"1.7rem",flexShrink:0}}>{c.icon}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:".5rem"}}>
                <span style={{fontWeight:700,fontSize:".95rem"}}>{c.title}</span>
                {c.badge && <span style={{background:C.red,color:"#fff",borderRadius:20,padding:".1rem .45rem",fontSize:".68rem",fontWeight:700}}>{c.badge} pendente{c.badge>1?"s":""}</span>}
              </div>
              <div style={{fontSize:".78rem",color:C.muted,marginTop:".15rem"}}>{c.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// GRID — registar cromos
// ════════════════════════════════════════════════════
function Grid({me, mode, onBack, onSave, showToast}) {
  const [data, setData] = useState(()=>({
    ...me,
    have: me.have ? JSON.parse(JSON.stringify(me.have)) : {},
    need: me.need ? JSON.parse(JSON.stringify(me.need)) : {},
  }));
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const isHave = mode==="have";

  const toggle = (secId, num) => {
    setData(prev => {
      const d = {...prev, have:{...prev.have}, need:{...prev.need}};
      if(!d.have[secId]) d.have[secId]={};
      if(!d.need[secId]) d.need[secId]={};
      d.have = {...d.have, [secId]:{...d.have[secId]}};
      d.need = {...d.need, [secId]:{...d.need[secId]}};
      if(isHave){
        d.have[secId][num] = d.have[secId][num] ? 0 : 1;
        if(d.have[secId][num]) d.need[secId][num]=0;
      } else {
        d.need[secId][num] = d.need[secId][num] ? 0 : 1;
        if(d.need[secId][num]) d.have[secId][num]=0;
      }
      return d;
    });
  };

  const toggleAll = (secId, val) => {
    const sec = SECTIONS.find(s=>s.id===secId);
    setData(prev=>{
      const d={...prev,have:{...prev.have,[secId]:{}},need:{...prev.need,[secId]:{}}};
      for(let i=1;i<=sec.count;i++){
        if(isHave) d.have[secId][i]=val?1:0;
        else d.need[secId][i]=val?1:0;
      }
      return d;
    });
  };

  const visibleSections = useMemo(()=>{
    const q = search.toLowerCase();
    return SECTIONS.filter(sec=>{
      if(filter==="RARE") return true;
      if(filter!=="ALL" && filter!==sec.id) return false;
      if(q) return sec.name.toLowerCase().includes(q)||sec.id.toLowerCase().includes(q)||
        Object.entries(PLAYERS).some(([k,v])=>k.startsWith(sec.id)&&v.toLowerCase().includes(q));
      return true;
    });
  },[filter,search]);

  const countHave = Object.values(data.have).reduce((a,o)=>a+Object.values(o).filter(Boolean).length,0);
  const countNeed = Object.values(data.need).reduce((a,o)=>a+Object.values(o).filter(Boolean).length,0);

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:"5rem"}}>
      {/* Topbar */}
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{flex:1,fontWeight:700,fontSize:".9rem"}}>{isHave?"✅ Registar repetidos":"❌ Registar em falta"}</div>
        <span style={{fontSize:".75rem",color:C.green,fontWeight:700}}>✅{countHave}</span>
        <span style={{fontSize:".75rem",color:C.red,fontWeight:700,marginLeft:4}}>❌{countNeed}</span>
      </div>

      {/* Search */}
      <div style={{padding:".6rem 1rem"}}>
        <input style={{...s.input,fontSize:".85rem"}} placeholder="🔍 Filtrar seleção…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      {/* Filter chips */}
      <div style={{display:"flex",gap:".4rem",overflowX:"auto",padding:".4rem 1rem .6rem",scrollbarWidth:"none"}}>
        {["ALL","RARE",...SECTIONS.map(s=>s.id)].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            background:filter===f?(f==="RARE"?C.rare:C.green):C.surf,
            color:filter===f?"#000":C.text,
            border:`1px solid ${C.border}`,borderRadius:20,
            padding:".25rem .8rem",fontSize:".75rem",fontWeight:filter===f?700:500,
            cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,fontFamily:"inherit"
          }}>
            {f==="ALL"?"Todas":f==="RARE"?"⭐ Raros":f}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:".85rem",padding:".4rem 1rem .6rem",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}>
        {[["#fff2",C.border,"Normal"],["#00c85318",C.green,"Tenho"],["#ff174418",C.red,"Falta"],["#ffd60015",C.gold,"⭐ Especial"],["#9c27b015","#CE93D8","💎 Lendário"]].map(([bg,bc,lbl])=>(
          <div key={lbl} style={{display:"flex",alignItems:"center",gap:".3rem",fontSize:".72rem",color:C.muted}}>
            <div style={{width:11,height:11,borderRadius:3,background:bg,border:`2px solid ${bc}`}}/>
            {lbl}
          </div>
        ))}
      </div>

      {/* Sections */}
      {visibleSections.map(sec=>{
        const haveCount=Object.values(data.have[sec.id]||{}).filter(Boolean).length;
        const pct=Math.round(haveCount/sec.count*100);
        const nums=[];
        for(let i=1;i<=sec.count;i++){
          const r=getRarity(sec.id,i);
          if(filter==="RARE"&&r==="normal") continue;
          nums.push(i);
        }
        if(!nums.length) return null;
        return (
          <div key={sec.id} style={{padding:".85rem 1rem .5rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:".6rem",marginBottom:".6rem"}}>
              <span style={{fontSize:"1.4rem"}}>{sec.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:".9rem"}}>{sec.name} <span style={{color:C.muted,fontWeight:400,fontSize:".75rem"}}>{sec.id}</span></div>
                <div style={{height:3,background:C.border,borderRadius:2,marginTop:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:C.green,borderRadius:2,transition:"width .3s"}}/>
                </div>
              </div>
              <button onClick={()=>toggleAll(sec.id,true)} style={s.btnSm(C.surf3)}>All</button>
              <button onClick={()=>toggleAll(sec.id,false)} style={s.btnSm(C.surf3)}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(52px,1fr))",gap:".35rem"}}>
              {nums.map(i=>{
                const r=getRarity(sec.id,i);
                const hasIt=(data.have[sec.id]||{})[i];
                const needIt=(data.need[sec.id]||{})[i];
                const isLeg=r==="legendary", isSp=r==="special"||r==="coca";
                let bg=C.surf, bc=C.border, numColor=C.muted;
                if(hasIt){bg="#00c85318";bc=C.green;numColor=C.green;}
                else if(needIt){bg="#ff174418";bc=C.red;numColor=C.red;}
                else if(isLeg){bg="#9c27b015";bc="#9c27b060";}
                else if(isSp){bg="#ffd60015";bc="#ffd60060";}
                const shortName=(PLAYERS[sec.id+i]||"").replace("💎","").replace("⭐","").trim().split(" ").slice(-1)[0];
                return (
                  <button key={i} onClick={()=>toggle(sec.id,i)} style={{
                    aspectRatio:"1",background:bg,border:`2px solid ${bc}`,borderRadius:8,
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                    cursor:"pointer",position:"relative",padding:2,fontFamily:"inherit"
                  }}>
                    {(isLeg||isSp||r==="coca")&&<span style={{position:"absolute",top:2,left:3,fontSize:".5rem"}}>{isLeg?"💎":r==="coca"?"🥤":"⭐"}</span>}
                    <span style={{fontSize:".55rem",color:C.muted,lineHeight:1}}>{sec.id}</span>
                    <span style={{fontSize:".72rem",fontWeight:700,color:numColor}}>{i}</span>
                    {shortName&&<span style={{fontSize:".42rem",color:C.muted,lineHeight:1,maxWidth:"100%",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",paddingInline:2}}>{shortName}</span>}
                    {hasIt&&<span style={{position:"absolute",top:1,right:3,fontSize:".5rem",color:C.green,fontWeight:700}}>✓</span>}
                    {needIt&&<span style={{position:"absolute",top:1,right:3,fontSize:".5rem",color:C.red,fontWeight:700}}>✕</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Save bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.bg,borderTop:`1px solid ${C.border}`,padding:".85rem 1rem",display:"flex",gap:".65rem",zIndex:200}}>
        <button style={{...s.btn(C.surf2,C.text),flex:1,border:`1px solid ${C.border2}`}} onClick={onBack}>Cancelar</button>
        <button style={{...s.btn(C.green),flex:2}} onClick={()=>onSave(data)}>Guardar ✓</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// SEARCH
// ════════════════════════════════════════════════════
function Search({members, me, onBack}) {
  const [q,setQ]=useState("");

  const results = useMemo(()=>{
    if(!q.trim()) return [];
    const t=q.toLowerCase();
    const out=[];
    SECTIONS.forEach(sec=>{
      for(let i=1;i<=sec.count;i++){
        const name=(PLAYERS[sec.id+i]||"").toLowerCase();
        const code=(sec.id+i).toLowerCase();
        const r=getRarity(sec.id,i);
        const rl=r==="legendary"?"lendário":r==="special"?"especial":r==="coca"?"coca-cola":"normal";
        if(name.includes(t)||code.includes(t)||sec.name.toLowerCase().includes(t)||rl.includes(t)){
          const hasIt=members.filter(m=>(m.have[sec.id]||{})[i]).map(m=>m.name);
          const needsIt=members.filter(m=>(m.need[sec.id]||{})[i]).map(m=>m.name);
          out.push({sec,i,r,name:PLAYERS[sec.id+i]||sec.id+i,hasIt,needsIt});
        }
      }
    });
    return out.slice(0,50);
  },[q,members]);

  const rLabel={normal:"Normal",special:"⭐ Especial",legendary:"💎 Lendário",coca:"🥤 Coca-Cola"};
  const rColor={normal:C.muted,special:C.gold,legendary:C.legend,coca:"#ff6b6b"};

  return (
    <div style={{background:C.bg,minHeight:"100vh"}}>
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{fontWeight:700,fontSize:".9rem",flex:1}}>🔍 Pesquisar cromo</div>
      </div>
      <div style={{padding:".75rem 1rem"}}>
        <input autoFocus style={s.input} placeholder="Nome, código (ex: POR18), seleção, raridade…" value={q} onChange={e=>setQ(e.target.value)}/>
      </div>
      {!q && <div style={{textAlign:"center",padding:"3rem 1.5rem",color:C.muted}}>
        <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>🔍</div>
        <div style={{fontWeight:700,color:C.text,marginBottom:".4rem"}}>Pesquisa qualquer cromo</div>
        <div style={{fontSize:".85rem",lineHeight:1.6}}>Ex: "Messi", "POR18", "especial", "Portugal"…<br/>Vês quem tem e quem precisa no grupo.</div>
      </div>}
      {results.map(({sec,i,r,name,hasIt,needsIt})=>(
        <div key={sec.id+i} style={{display:"flex",gap:".85rem",padding:".85rem 1rem",borderBottom:`1px solid ${C.border}`}}>
          <div style={{width:44,height:44,borderRadius:8,background:C.surf2,border:`1px solid ${C.border2}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:".58rem",color:C.muted}}>{sec.id}</span>
            <span style={{fontSize:".85rem",fontWeight:700}}>{i}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:".9rem"}}>{sec.flag} {name}</div>
            <div style={{display:"flex",alignItems:"center",gap:".4rem",marginTop:".2rem"}}>
              <span style={{fontSize:".7rem",fontWeight:700,color:rColor[r],background:rColor[r]+"20",borderRadius:6,padding:".12rem .4rem",border:`1px solid ${rColor[r]}40`}}>{rLabel[r]}</span>
            </div>
            {(hasIt.length||needsIt.length)?<div style={{display:"flex",gap:".3rem",flexWrap:"wrap",marginTop:".35rem"}}>
              {hasIt.map(n=><span key={n} style={{fontSize:".7rem",background:"#00c85312",color:C.green,borderRadius:20,padding:".15rem .5rem"}}>✅ {n}</span>)}
              {needsIt.map(n=><span key={n} style={{fontSize:".7rem",background:C.surf2,color:C.muted,borderRadius:20,padding:".15rem .5rem"}}>❌ {n}</span>)}
            </div>:<div style={{fontSize:".72rem",color:C.muted,marginTop:".3rem"}}>Ninguém marcou ainda</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════
// GROUP
// ════════════════════════════════════════════════════
function computeMatches(a,b){
  const give=[],get=[];
  SECTIONS.forEach(sec=>{
    for(let i=1;i<=sec.count;i++){
      if((a.have[sec.id]||{})[i]&&(b.need[sec.id]||{})[i]) give.push({code:sec.id+i,r:getRarity(sec.id,i)});
      if((b.have[sec.id]||{})[i]&&(a.need[sec.id]||{})[i]) get.push({code:sec.id+i,r:getRarity(sec.id,i)});
    }
  });
  return{give,get};
}

function Group({me, members, onBack, onOpenMatch}) {
  const [cityFilter, setCityFilter] = useState("ALL");
  const [mailFilter, setMailFilter] = useState("ALL"); // ALL | sim | nao
  const [matchOnly, setMatchOnly]   = useState(false);

  // All unique cities in the group
  const cities = useMemo(() => {
    const all = [...new Set(members.map(m => m.local).filter(Boolean))].sort();
    return all;
  }, [members]);

  const filtered = useMemo(() => {
    return members.filter(m => {
      if (cityFilter !== "ALL" && (m.local||"").toLowerCase() !== cityFilter.toLowerCase()) return false;
      if (mailFilter !== "ALL" && m.mail !== mailFilter) return false;
      if (matchOnly) {
        if (!me || m.name === me.name) return false;
        const {give,get} = computeMatches(me, m);
        if (give.length + get.length === 0) return false;
      }
      return true;
    });
  }, [members, cityFilter, mailFilter, matchOnly, me]);

  const FilterChip = ({label, active, onClick, color}) => (
    <button onClick={onClick} style={{
      background: active ? (color||C.green) : C.surf2,
      color: active ? "#000" : C.text,
      border: `1px solid ${active ? (color||C.green) : C.border2}`,
      borderRadius: 20, padding: ".28rem .85rem",
      fontSize: ".78rem", fontWeight: active ? 700 : 500,
      cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit",
    }}>{label}</button>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh"}}>
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{fontWeight:700,fontSize:".9rem",flex:1}}>🔄 Matches no grupo</div>
        <span style={{fontSize:".75rem",color:C.muted}}>{filtered.length}/{members.length}</span>
      </div>

      {/* ── FILTROS ── */}
      <div style={{padding:".75rem 1rem .5rem",display:"flex",flexDirection:"column",gap:".6rem",borderBottom:`1px solid ${C.border}`}}>

        {/* Só com matches */}
        <label style={{display:"flex",alignItems:"center",gap:".6rem",cursor:"pointer"}}>
          <div onClick={()=>setMatchOnly(v=>!v)} style={{
            width:40,height:22,borderRadius:11,
            background: matchOnly ? C.green : C.surf3,
            border:`1px solid ${matchOnly?C.green:C.border2}`,
            position:"relative",transition:"background .2s",cursor:"pointer",flexShrink:0,
          }}>
            <div style={{
              width:16,height:16,borderRadius:"50%",background:"#fff",
              position:"absolute",top:2,
              left: matchOnly ? 20 : 2,
              transition:"left .2s",
            }}/>
          </div>
          <span style={{fontSize:".82rem",fontWeight:600}}>Só membros com matches comigo</span>
        </label>

        {/* Cidade */}
        {cities.length > 1 && (
          <div>
            <div style={{fontSize:".7rem",color:C.muted,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:".35rem"}}>📍 Cidade</div>
            <div style={{display:"flex",gap:".4rem",overflowX:"auto",scrollbarWidth:"none"}}>
              <FilterChip label="Todas" active={cityFilter==="ALL"} onClick={()=>setCityFilter("ALL")}/>
              {cities.map(c=>(
                <FilterChip key={c} label={c} active={cityFilter===c} onClick={()=>setCityFilter(cityFilter===c?"ALL":c)}/>
              ))}
            </div>
          </div>
        )}

        {/* Modo de troca */}
        <div>
          <div style={{fontSize:".7rem",color:C.muted,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:".35rem"}}>📦 Modo de troca</div>
          <div style={{display:"flex",gap:".4rem"}}>
            <FilterChip label="Todos" active={mailFilter==="ALL"} onClick={()=>setMailFilter("ALL")}/>
            <FilterChip label="📬 Aceita envio" active={mailFilter==="sim"} onClick={()=>setMailFilter(mailFilter==="sim"?"ALL":"sim")}/>
            <FilterChip label="🤝 Só presencial" active={mailFilter==="nao"} onClick={()=>setMailFilter(mailFilter==="nao"?"ALL":"nao")} color={C.rare}/>
          </div>
        </div>
      </div>

      {/* ── RESULTADOS ── */}
      {filtered.length === 0 && (
        <div style={{textAlign:"center",padding:"3rem 1.5rem",color:C.muted}}>
          <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>🔍</div>
          <div style={{fontWeight:700,color:C.text,marginBottom:".4rem"}}>Sem resultados</div>
          <div style={{fontSize:".85rem"}}>Tenta ajustar os filtros.</div>
        </div>
      )}

      <div style={{padding:".75rem"}}>
        {filtered.map(m=>{
          const isSelf=me&&m.name===me.name;
          const matches=me&&!isSelf?computeMatches(me,m):{give:[],get:[]};
          const total=matches.give.length+matches.get.length;
          const h=Object.values(m.have).reduce((a,o)=>a+Object.values(o).filter(Boolean).length,0);
          const n=Object.values(m.need).reduce((a,o)=>a+Object.values(o).filter(Boolean).length,0);
          return (
            <div key={m.name} onClick={()=>!isSelf&&onOpenMatch(m.name)}
              style={{...s.card,marginBottom:".75rem",cursor:isSelf?"default":"pointer",border:total>0?`1px solid ${C.gold}30`:s.card.border}}>
              <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:".5rem"}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#1565c0,#00c853)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:".95rem",flexShrink:0}}>
                  {m.name[0].toUpperCase()}
                </div>
                <div style={{fontWeight:700,flex:1}}>{m.name}{isSelf?" (tu)":""}</div>
                {total>0&&!isSelf&&<span style={{background:C.gold,color:"#000",borderRadius:20,padding:".18rem .65rem",fontSize:".72rem",fontWeight:700}}>🔄 {total}</span>}
              </div>
              <div style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>
                {[["Repet.",h],["Falta",n]].map(([l,v])=>(
                  <span key={l} style={{fontSize:".72rem",color:C.muted,background:C.surf2,borderRadius:20,padding:".18rem .55rem"}}>{l}: <strong style={{color:C.text}}>{v}</strong></span>
                ))}
                {m.local&&<span style={{fontSize:".72rem",color:C.muted,background:C.surf2,borderRadius:20,padding:".18rem .55rem"}}>📍 <strong style={{color:C.text}}>{m.local}</strong></span>}
                <span style={{fontSize:".72rem",color:C.muted,background:C.surf2,borderRadius:20,padding:".18rem .55rem"}}>{m.mail==="sim"?"📬 Envio":"🤝 Presencial"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// MATCH DETAIL
// ════════════════════════════════════════════════════
function MatchDetail({me, members, target, onBack}) {
  const member = members.find(m=>m.name===target);
  const matches = me&&member ? computeMatches(me,member) : {give:[],get:[]};
  const total = matches.give.length+matches.get.length;
  const rColor={normal:C.muted,special:C.gold,legendary:C.legend,coca:"#ff6b6b"};

  const Pill=({item,cls})=>{
    const isRare=item.r!=="normal";
    return <span style={{borderRadius:6,padding:".22rem .55rem",fontSize:".78rem",fontWeight:700,
      border:`1px solid ${cls==="give"?C.green+"55":C.red+"55"}`,
      color:isRare?rColor[item.r]:cls==="give"?C.green:C.red,
      background:cls==="give"?"#00c85310":"#ff174410"}}>
      {isRare?(item.r==="legendary"?"💎":"⭐"):""}{item.code}
    </span>;
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh"}}>
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{fontWeight:700,flex:1}}>Tu ↔ {target}</div>
      </div>

      {total===0?<div style={{textAlign:"center",padding:"3rem 1.5rem",color:C.muted}}>
        <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>😕</div>
        <div style={{fontWeight:700,color:C.text,marginBottom:".4rem"}}>Sem matches ainda</div>
        <div style={{fontSize:".85rem"}}>Nenhum cromo complementar com {target} de momento.</div>
      </div>:<>
        <div style={{background:"linear-gradient(135deg,#00c85312,#1565c012)",border:`1px solid #00c85330`,borderRadius:14,margin:"1rem",padding:"1.2rem",textAlign:"center"}}>
          <div style={{fontWeight:900,fontSize:"2.8rem",color:C.gold,lineHeight:1}}>{total}</div>
          <div style={{fontSize:".82rem",color:C.muted,marginTop:".25rem"}}>{matches.give.length} que tu dás · {matches.get.length} que recebes</div>
        </div>

        {matches.give.length>0&&<div style={{margin:"0 1rem 1.25rem"}}>
          <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:C.muted,marginBottom:".6rem",paddingBottom:".35rem",borderBottom:`1px solid ${C.border}`}}>✅ Tu dás a {target} ({matches.give.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:".35rem"}}>{matches.give.map(x=><Pill key={x.code} item={x} cls="give"/>)}</div>
        </div>}

        {matches.get.length>0&&<div style={{margin:"0 1rem 1.25rem"}}>
          <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:C.muted,marginBottom:".6rem",paddingBottom:".35rem",borderBottom:`1px solid ${C.border}`}}>❌ Recebes de {target} ({matches.get.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:".35rem"}}>{matches.get.map(x=><Pill key={x.code} item={x} cls="get"/>)}</div>
        </div>}

        {member&&<div style={{margin:"0 1rem 1.25rem"}}>
          <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:C.muted,marginBottom:".6rem",paddingBottom:".35rem",borderBottom:`1px solid ${C.border}`}}>📦 Contacto</div>
          <p style={{fontSize:".85rem",color:C.muted,lineHeight:1.6}}>
            {target} {member.mail==="sim"?<strong style={{color:C.text}}>aceita envio CTT 📬</strong>:<><strong style={{color:C.text}}>só presencial 🤝</strong></>}.
            {member.local&&<> Está em <strong style={{color:C.text}}>{member.local}</strong>.</>}
            {" "}Envia mensagem no WhatsApp para combinar!
          </p>
        </div>}

        {[...matches.give,...matches.get].some(x=>x.r!=="normal")&&<div style={{margin:"0 1rem 1.25rem",background:"#ffd60010",border:`1px solid #ffd60030`,borderRadius:12,padding:"1rem"}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:C.gold,marginBottom:".35rem"}}>💎 Cromos raros envolvidos</div>
          <p style={{fontSize:".82rem",color:C.muted,lineHeight:1.5}}>Esta troca tem especiais ou lendários. Usa o <strong style={{color:C.text}}>Mercado de Raros</strong> para publicar condições específicas.</p>
        </div>}
      </>}
    </div>
  );
}

// ════════════════════════════════════════════════════
// MARKET — Mercado de Raros (com pesquisa de matches)
// ════════════════════════════════════════════════════
function Market({me, market, members, onBack, onAdd, onDelete, showToast}) {
  const [tab, setTab]         = useState("mercado"); // mercado | pesquisa
  const [code, setCode]       = useState("");
  const [want, setWant]       = useState("");
  const [rarity, setRarity]   = useState("special");
  const [reply, setReply]     = useState(null);
  const [replyText, setReplyText] = useState("");
  const [searchQ, setSearchQ] = useState("");

  const rLabel = {normal:"Normal",special:"⭐ Especial",legendary:"💎 Lendário",coca:"🥤 Coca-Cola"};
  const rColor = {special:C.gold,legendary:C.legend,coca:"#ff6b6b"};

  const submit = () => {
    if(!code.trim()||!want.trim()){showToast("Preenche o código e o que pedes!");return}
    const c = code.trim().toUpperCase();
    if(!SECTIONS.some(s=>c.startsWith(s.id))){showToast("Código inválido — ex: ARG18, ESP15");return}
    onAdd({id:Date.now(),code:c,player:PLAYERS[c]||"",rarity,by:me.name,want});
    setCode("");setWant("");
    showToast("Proposta publicada! ✓");
  };

  // ── Pesquisa: quem TEM o cromo que pesquiso (e eu preciso), quem PRECISA do que tenho ──
  const searchResults = useMemo(()=>{
    const q = searchQ.trim().toUpperCase();
    if(!q) return null;
    // Find matching stickers
    const matches = [];
    SECTIONS.forEach(sec=>{
      for(let i=1;i<=sec.count;i++){
        const code = sec.id+i;
        const name = (PLAYERS[code]||"").toUpperCase();
        if(!code.includes(q) && !name.includes(q.toLowerCase().toUpperCase()) && !sec.name.toUpperCase().includes(q)) continue;
        const r = getRarity(sec.id,i);
        const iNeedIt  = me && (me.need[sec.id]||{})[i];
        const iHaveIt  = me && (me.have[sec.id]||{})[i];
        const whoHasIt = members.filter(m=>m.name!==me?.name&&(m.have[sec.id]||{})[i]).map(m=>({name:m.name,email:m.email||"",mail:m.mail}));
        const whoNeedsIt = members.filter(m=>m.name!==me?.name&&(m.need[sec.id]||{})[i]).map(m=>({name:m.name,email:m.email||"",mail:m.mail}));
        matches.push({code,sec,i,r,name:PLAYERS[code]||code,iNeedIt,iHaveIt,whoHasIt,whoNeedsIt});
      }
    });
    return matches.slice(0,30);
  },[searchQ,members,me]);

  const Tab = ({id,label}) => (
    <button onClick={()=>setTab(id)} style={{
      flex:1,padding:".6rem",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:".82rem",
      background:tab===id?C.surf3:C.surf2,color:tab===id?C.text:C.muted,
      borderBottom:tab===id?`2px solid ${C.rare}`:"2px solid transparent",transition:"all .15s",
    }}>{label}</button>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:"2rem"}}>
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{fontWeight:700,flex:1}}>💎 Mercado de Raros</div>
      </div>

      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        <Tab id="mercado"  label="💎 Propostas"/>
        <Tab id="pesquisa" label="🔍 Pesquisar match"/>
      </div>

      {/* ══ TAB: MERCADO ══ */}
      {tab==="mercado" && <>
        {/* New listing form */}
        <div style={{...s.card,margin:"1rem",display:"flex",flexDirection:"column",gap:".85rem"}}>
          <div style={{fontWeight:700}}>➕ Nova proposta</div>
          <div>
            <label style={s.label}>Cromo que ofereces (código)</label>
            <input style={s.input} placeholder="ex: ARG18" value={code}
              onChange={e=>setCode(e.target.value.toUpperCase())}/>
            {PLAYERS[code.toUpperCase()]&&<div style={{fontSize:".75rem",color:C.gold,marginTop:".3rem",fontWeight:600}}>
              → {PLAYERS[code.toUpperCase()]} ({getRarity(code.replace(/\d+/g,""),parseInt(code.replace(/\D/g,""))) !== "normal" ? "⭐ raro" : "normal"})
            </div>}
          </div>
          <div>
            <label style={s.label}>O que pedes em troca</label>
            <textarea style={{...s.input,minHeight:70,resize:"vertical"}}
              placeholder="ex: Troco por ESP15 (Yamal) OU por 4 cromos normais à minha escolha"
              value={want} onChange={e=>setWant(e.target.value)}/>
          </div>
          <div>
            <label style={s.label}>Raridade</label>
            <select style={s.input} value={rarity} onChange={e=>setRarity(e.target.value)}>
              <option value="special">⭐ Especial (foil/brilhante)</option>
              <option value="legendary">💎 Lendário (Messi, CR7…)</option>
              <option value="coca">🥤 Coca-Cola exclusivo</option>
            </select>
          </div>
          <button style={s.btn("linear-gradient(135deg,#FF6D00,#ff9800)")} onClick={submit}>Publicar proposta</button>
        </div>

        {!market.length&&<div style={{textAlign:"center",padding:"2rem",color:C.muted}}>
          <div style={{fontSize:"2rem",marginBottom:".5rem"}}>💎</div>
          <div>Sem propostas ainda. Sê o primeiro!</div>
        </div>}

        {market.map(l=>(
          <div key={l.id} style={{...s.card,margin:"0 1rem .75rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:".75rem"}}>
              <div style={{width:48,height:48,borderRadius:10,background:"linear-gradient(135deg,#ffd60020,#ff980020)",border:`2px solid #ffd60060`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:".58rem",fontWeight:700,color:C.muted}}>{l.code.replace(/\d+/g,"")}</span>
                <span style={{fontSize:".85rem",fontWeight:700}}>{l.code.replace(/[A-Z]+/g,"")}</span>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:".9rem"}}>{l.code} {l.player&&`· ${l.player}`}</div>
                <span style={{fontSize:".7rem",fontWeight:700,color:rColor[l.rarity]||C.gold,background:(rColor[l.rarity]||C.gold)+"20",borderRadius:6,padding:".12rem .4rem",border:`1px solid ${(rColor[l.rarity]||C.gold)}40`}}>{rLabel[l.rarity]}</span>
              </div>
            </div>
            <div style={{fontSize:".75rem",color:C.muted,marginBottom:".35rem"}}>Proposta de <strong style={{color:C.text}}>{l.by}</strong></div>
            <div style={{fontSize:".9rem",lineHeight:1.5,marginBottom:".85rem"}}>{l.want}</div>
            {reply===l.id?(
              <div style={{background:C.surf2,borderRadius:10,padding:".85rem",marginBottom:".75rem"}}>
                <div style={{fontWeight:700,fontSize:".85rem",marginBottom:".5rem"}}>A tua resposta a {l.by}</div>
                <textarea style={{...s.input,minHeight:65,marginBottom:".5rem"}}
                  placeholder="ex: Aceito! Tenho o que precisas…"
                  value={replyText} onChange={e=>setReplyText(e.target.value)}/>
                <div style={{display:"flex",gap:".5rem"}}>
                  <button style={{...s.btn(C.surf3,C.text),flex:1,border:`1px solid ${C.border2}`}} onClick={()=>setReply(null)}>Cancelar</button>
                  <button style={{...s.btn(C.green),flex:2}} onClick={()=>{showToast(`Proposta enviada a ${l.by}! 🤝`);setReply(null);setReplyText("");}}>Enviar 🤝</button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",gap:".5rem"}}>
                {l.by!==me?.name&&<button style={{...s.btn(C.green),flex:2}} onClick={()=>setReply(l.id)}>💬 Responder</button>}
                {l.by===me?.name&&<button style={{...s.btn(C.surf2,C.text),flex:1,border:`1px solid ${C.border2}`}} onClick={()=>onDelete(l.id)}>🗑 Remover</button>}
              </div>
            )}
          </div>
        ))}
      </>}

      {/* ══ TAB: PESQUISA DE MATCHES ══ */}
      {tab==="pesquisa" && (
        <div style={{paddingBottom:"1rem"}}>
          <div style={{padding:".85rem 1rem .5rem"}}>
            <input style={s.input} autoFocus
              placeholder="🔍 Código (ex: ARG18), nome (ex: Messi) ou seleção (ex: Portugal)…"
              value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
            <div style={{fontSize:".72rem",color:C.muted,marginTop:".4rem",lineHeight:1.5}}>
              Vê quem tem o cromo que procuras e quem precisa do que tens — perfeito para matches de raros.
            </div>
          </div>

          {!searchQ && <div style={{textAlign:"center",padding:"2.5rem 1rem",color:C.muted}}>
            <div style={{fontSize:"2.5rem",marginBottom:".6rem"}}>🔍</div>
            <div style={{fontWeight:700,color:C.text,marginBottom:".35rem"}}>Pesquisa um cromo raro</div>
            <div style={{fontSize:".83rem",lineHeight:1.6}}>Ex: "ARG18" para o Messi, "ESP15" para o Yamal,<br/>"FWC9" para os especiais do Museu FIFA</div>
          </div>}

          {searchResults && searchResults.length===0 && searchQ && (
            <div style={{textAlign:"center",padding:"2rem",color:C.muted}}>
              <div style={{fontSize:"1.5rem",marginBottom:".5rem"}}>😕</div>
              <div>Sem resultados para "{searchQ}"</div>
            </div>
          )}

          {searchResults && searchResults.map(({code,sec,i,r,name,iNeedIt,iHaveIt,whoHasIt,whoNeedsIt})=>{
            const rLabel2={normal:"Normal",special:"⭐ Especial",legendary:"💎 Lendário",coca:"🥤 Coca-Cola"};
            const rCol={special:C.gold,legendary:C.legend,coca:"#ff6b6b",normal:C.muted}[r];
            const perfectMatch = whoHasIt.filter(m=>me&&(me.need[sec.id]||{})[i]).length > 0
                               || whoNeedsIt.filter(m=>me&&(me.have[sec.id]||{})[i]).length > 0;
            return (
              <div key={code} style={{...s.card,margin:"0 1rem .75rem",border:`1px solid ${perfectMatch?"#00c85340":C.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:".65rem"}}>
                  <div style={{width:44,height:44,borderRadius:8,background:C.surf2,border:`2px solid ${rCol}60`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:".55rem",color:C.muted}}>{sec.id}</span>
                    <span style={{fontSize:".82rem",fontWeight:700}}>{i}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:".9rem"}}>{sec.flag} {name}</div>
                    <span style={{fontSize:".7rem",fontWeight:700,color:rCol,background:rCol+"20",borderRadius:6,padding:".12rem .4rem",border:`1px solid ${rCol}40`}}>{rLabel2[r]}</span>
                    {perfectMatch && <span style={{fontSize:".7rem",fontWeight:700,color:C.green,background:"#00c85318",borderRadius:6,padding:".12rem .4rem",border:`1px solid #00c85340`,marginLeft:".35rem"}}>✓ Match perfeito!</span>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:".2rem"}}>
                    {iNeedIt&&<span style={{fontSize:".68rem",color:C.red,fontWeight:700,background:"#ff174415",borderRadius:20,padding:".1rem .45rem"}}>❌ Precisas</span>}
                    {iHaveIt&&<span style={{fontSize:".68rem",color:C.green,fontWeight:700,background:"#00c85315",borderRadius:20,padding:".1rem .45rem"}}>✅ Tens</span>}
                  </div>
                </div>

                {whoHasIt.length>0&&(
                  <div style={{marginBottom:".5rem"}}>
                    <div style={{fontSize:".7rem",color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:".3rem"}}>Têm repetido:</div>
                    <div style={{display:"flex",gap:".3rem",flexWrap:"wrap"}}>
                      {whoHasIt.map(m=>(
                        <span key={m.name} style={{fontSize:".75rem",background:"#00c85312",color:C.green,borderRadius:20,padding:".2rem .6rem",border:"1px solid #00c85330",display:"flex",alignItems:"center",gap:".3rem"}}>
                          ✅ {m.name}
                          {m.mail==="nao"&&<span style={{fontSize:".62rem",color:C.muted}}>🤝</span>}
                          {m.mail==="sim"&&<span style={{fontSize:".62rem",color:C.muted}}>📬</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {whoNeedsIt.length>0&&(
                  <div style={{marginBottom:".5rem"}}>
                    <div style={{fontSize:".7rem",color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:".3rem"}}>Precisam:</div>
                    <div style={{display:"flex",gap:".3rem",flexWrap:"wrap"}}>
                      {whoNeedsIt.map(m=>(
                        <span key={m.name} style={{fontSize:".75rem",background:"#ff174412",color:C.red,borderRadius:20,padding:".2rem .6rem",border:"1px solid #ff174330"}}>
                          ❌ {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!whoHasIt.length&&!whoNeedsIt.length&&(
                  <div style={{fontSize:".78rem",color:C.muted,fontStyle:"italic"}}>Ninguém no grupo marcou este cromo ainda.</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════
// EVENTS — Encontros Presenciais
// ════════════════════════════════════════════════════
function Events({me, events, isAdmin, onBack, onAdd, onApprove, onReject, onRsvp, showToast}) {
  const [tab, setTab] = useState("lista"); // lista | propor | admin
  const [form, setForm] = useState({title:"",local:"",morada:"",date:"",time:"",desc:""});

  const approved = events.filter(e=>e.status==="aprovado");
  const pending  = events.filter(e=>e.status==="pendente");

  const fmt = (d,t) => {
    if(!d) return "";
    const [y,m,day] = d.split("-");
    return `${day}/${m}/${y}${t?" às "+t:""}`;
  };

  const submit = () => {
    if(!form.title.trim()||!form.local.trim()||!form.date){
      showToast("Preenche título, localidade e data!"); return;
    }
    onAdd({...form, by:me.name});
    setForm({title:"",local:"",morada:"",date:"",time:"",desc:""});
    setTab("lista");
  };

  const Tab = ({id,label}) => (
    <button onClick={()=>setTab(id)} style={{
      flex:1,padding:".6rem",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:".82rem",
      background:tab===id?C.surf3:C.surf2,
      color:tab===id?C.text:C.muted,
      borderBottom:tab===id?`2px solid ${C.green}`:"2px solid transparent",
      transition:"all .15s",
    }}>{label}</button>
  );

  const EventCard = ({ev}) => {
    const going = me && ev.rsvps.includes(me.name);
    const isOwn = me && ev.by === me.name;
    const isPast = ev.date && new Date(ev.date) < new Date();

    return (
      <div style={{...s.card, marginBottom:".75rem", border:`1px solid ${ev.status==="pendente"?"#ffd60030":s.card.border}`}}>
        {/* Status badge */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:".6rem"}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:".95rem",marginBottom:".2rem"}}>{ev.title}</div>
            <div style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>
              <span style={{fontSize:".7rem",background:ev.status==="aprovado"?"#00c85318":C.surf3,color:ev.status==="aprovado"?C.green:C.gold,border:`1px solid ${ev.status==="aprovado"?"#00c85340":"#ffd60040"}`,borderRadius:20,padding:".15rem .55rem",fontWeight:700}}>
                {ev.status==="aprovado"?"✅ Confirmado":"⏳ Aguarda aprovação"}
              </span>
              {isPast && <span style={{fontSize:".7rem",background:C.surf2,color:C.muted,borderRadius:20,padding:".15rem .55rem"}}>Já passou</span>}
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{display:"flex",flexDirection:"column",gap:".35rem",marginBottom:".75rem"}}>
          <div style={{fontSize:".82rem",color:C.muted}}>📅 <strong style={{color:C.text}}>{fmt(ev.date,ev.time)}</strong></div>
          <div style={{fontSize:".82rem",color:C.muted}}>📍 <strong style={{color:C.text}}>{ev.local}</strong>{ev.morada&&` · ${ev.morada}`}</div>
          {ev.desc && <div style={{fontSize:".82rem",color:C.muted,fontStyle:"italic",lineHeight:1.5}}>"{ev.desc}"</div>}
          <div style={{fontSize:".75rem",color:C.muted}}>Proposto por <strong style={{color:C.text}}>{ev.by}</strong></div>
        </div>

        {/* RSVPs */}
        {ev.status==="aprovado" && (
          <div style={{marginBottom:".75rem"}}>
            <div style={{fontSize:".72rem",color:C.muted,fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",marginBottom:".4rem"}}>
              👥 Vão comparecer ({ev.rsvps.length})
            </div>
            {ev.rsvps.length>0
              ? <div style={{display:"flex",gap:".3rem",flexWrap:"wrap"}}>
                  {ev.rsvps.map(r=><span key={r} style={{fontSize:".72rem",background:r===me?.name?"#00c85318":C.surf2,color:r===me?.name?C.green:C.muted,borderRadius:20,padding:".18rem .55rem",border:r===me?.name?`1px solid #00c85340`:"none"}}>{r===me?.name?"✓ Tu":r}</span>)}
                </div>
              : <div style={{fontSize:".75rem",color:C.muted}}>Ninguém confirmou ainda. Sê o primeiro!</div>
            }
          </div>
        )}

        {/* Actions */}
        {ev.status==="aprovado" && me && !isOwn && !isPast && (
          <button onClick={()=>onRsvp(ev.id)} style={s.btn(going?"#00c85330":C.green, going?"#fff":"#000")}>
            {going ? "✓ Vou comparecer — Cancelar" : "✋ Confirmar presença"}
          </button>
        )}
        {isAdmin && ev.status==="pendente" && (
          <div style={{display:"flex",gap:".5rem"}}>
            <button onClick={()=>onReject(ev.id)} style={{...s.btn(C.surf2,C.text),flex:1,border:`1px solid ${C.border2}`}}>✕ Rejeitar</button>
            <button onClick={()=>onApprove(ev.id)} style={{...s.btn(C.green),flex:2}}>✅ Aprovar</button>
          </div>
        )}
        {!isAdmin && ev.status==="pendente" && isOwn && (
          <div style={{fontSize:".78rem",color:C.muted,padding:".5rem .75rem",background:C.surf2,borderRadius:8,textAlign:"center"}}>
            ⏳ A tua proposta está a aguardar validação pelos admins
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:"2rem"}}>
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{fontWeight:700,flex:1}}>📅 Encontros Presenciais</div>
        {pending.length>0&&isAdmin&&<span style={{background:C.red,color:"#fff",borderRadius:20,padding:".18rem .6rem",fontSize:".72rem",fontWeight:700}}>{pending.length} pendente{pending.length>1?"s":""}</span>}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        <Tab id="lista" label={`📋 Encontros (${approved.length})`}/>
        <Tab id="propor" label="➕ Propor"/>
        <Tab id="lojas"  label="🏪 Lojas"/>
        {isAdmin && <Tab id="admin" label={`⚙️${pending.length>0?" ("+pending.length+")":""}`}/>}
      </div>

      {/* ── LISTA ── */}
      {tab==="lista" && (
        <div style={{padding:".85rem"}}>
          {approved.length===0
            ? <div style={{textAlign:"center",padding:"3rem 1rem",color:C.muted}}>
                <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>📅</div>
                <div style={{fontWeight:700,color:C.text,marginBottom:".4rem"}}>Nenhum encontro confirmado</div>
                <div style={{fontSize:".85rem"}}>Propõe um encontro no teu grupo!</div>
              </div>
            : approved.map(ev=><EventCard key={ev.id} ev={ev}/>)
          }
        </div>
      )}

      {/* ── PROPOR ── */}
      {tab==="propor" && (
        <div style={{padding:".85rem",display:"flex",flexDirection:"column",gap:".85rem"}}>
          <div style={{...s.card,background:"#ffd60010",border:`1px solid #ffd60030`}}>
            <div style={{fontSize:".8rem",color:C.gold,fontWeight:700,marginBottom:".3rem"}}>ℹ️ Como funciona</div>
            <div style={{fontSize:".78rem",color:C.muted,lineHeight:1.6}}>A tua proposta é enviada aos admins para aprovação. Depois de aprovada, todos os membros podem confirmar presença.</div>
          </div>
          {[
            ["Título do encontro","text","title","ex: Troca de Cromos — Lisboa"],
            ["Cidade","text","local","ex: Lisboa"],
            ["Morada / ponto de encontro","text","morada","ex: Jardim do Príncipe Real"],
            ["Data","date","date",""],
            ["Hora","time","time",""],
          ].map(([lbl,type,key,ph])=>(
            <div key={key}>
              <label style={s.label}>{lbl}</label>
              <input type={type} style={s.input} placeholder={ph} value={form[key]}
                onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>
            </div>
          ))}
          <div>
            <label style={s.label}>Descrição (opcional)</label>
            <textarea style={{...s.input,minHeight:75,resize:"vertical"}}
              placeholder="ex: Tragam os vossos repetidos. Especiais bem-vindos!"
              value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/>
          </div>
          <button style={s.btn(C.green)} onClick={submit}>Enviar proposta →</button>
        </div>
      )}


      {/* ── LOJAS NACIONAIS ── */}
      {tab==="lojas" && (
        <div style={{padding:".85rem",display:"flex",flexDirection:"column",gap:".85rem"}}>
          <div style={{...s.card,background:"#1565c020",border:`1px solid #1565c040`}}>
            <div style={{fontSize:".8rem",color:"#90caf9",fontWeight:700,marginBottom:".3rem"}}>ℹ️ Pontos de venda e troca</div>
            <div style={{fontSize:".78rem",color:C.muted,lineHeight:1.6}}>Lista de locais onde podes comprar saquetas e encontrar outros colecionadores em Portugal. Atualizada manualmente — sugere um local ao admin!</div>
          </div>

          {[
            {cidade:"Lisboa",nome:"Livraria Bertrand Chiado",morada:"R. Garrett 73",tipo:"venda",nota:"Stock habitual de saquetas e álbuns"},
            {cidade:"Lisboa",nome:"Tabacaria Rossio",morada:"Praça Dom Pedro IV",tipo:"venda",nota:"Abre cedo, bom stock ao início"},
            {cidade:"Lisboa",nome:"Jardim do Príncipe Real",morada:"Praça do Príncipe Real",tipo:"troca",nota:"Encontro informal às Sábados de manhã"},
            {cidade:"Porto",nome:"Livraria Lello",morada:"R. das Carmelitas 144",tipo:"venda",nota:"Álbuns e saquetas disponíveis"},
            {cidade:"Porto",nome:"Mercado do Bolhão",morada:"R. Formosa",tipo:"troca",nota:"Ponto de encontro informal Domingos 10h"},
            {cidade:"Porto",nome:"Tabacaria Aliados",morada:"Av. dos Aliados",tipo:"venda",nota:"Bom stock de saquetas"},
            {cidade:"Braga",nome:"Fnac Braga",morada:"Braga Parque",tipo:"venda",nota:"Álbuns e packs disponíveis"},
            {cidade:"Coimbra",nome:"Livraria Almedina",morada:"R. Ferreira Borges",tipo:"venda",nota:"Stock de álbuns"},
            {cidade:"Faro",nome:"Forum Algarve",morada:"Sítio das Figuras",tipo:"venda",nota:"Tabacaria interior do centro comercial"},
            {cidade:"Setúbal",nome:"Tabacaria Central",morada:"Praça de Bocage",tipo:"venda",nota:"Saquetas avulsas e álbuns"},
            {cidade:"Nacional",nome:"Panini Portugal (online)",morada:"panini.pt",tipo:"online",nota:"Loja oficial — álbuns, saquetas e packs especiais"},
            {cidade:"Nacional",nome:"Fnac.pt",morada:"fnac.pt",tipo:"online",nota:"Packs, álbuns e boxes disponíveis online"},
          ].map((l,idx)=>(
            <div key={idx} style={{...s.card,display:"flex",gap:".85rem",alignItems:"flex-start"}}>
              <div style={{width:40,height:40,borderRadius:10,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",
                background:l.tipo==="venda"?"#1565c020":l.tipo==="troca"?"#00c85320":"#9c27b020"}}>
                {l.tipo==="venda"?"🏪":l.tipo==="troca"?"🔄":"🌐"}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:".45rem",flexWrap:"wrap",marginBottom:".2rem"}}>
                  <span style={{fontWeight:700,fontSize:".88rem"}}>{l.nome}</span>
                  <span style={{fontSize:".68rem",fontWeight:700,
                    color:l.tipo==="venda"?"#90caf9":l.tipo==="troca"?C.green:C.legend,
                    background:l.tipo==="venda"?"#1565c025":l.tipo==="troca"?"#00c85320":"#9c27b025",
                    borderRadius:20,padding:".1rem .45rem"}}>
                    {l.tipo==="venda"?"🏪 Venda":l.tipo==="troca"?"🔄 Troca":"🌐 Online"}
                  </span>
                </div>
                <div style={{fontSize:".78rem",color:C.muted}}>📍 {l.cidade} · {l.morada}</div>
                {l.nota&&<div style={{fontSize:".75rem",color:C.muted,marginTop:".2rem",fontStyle:"italic"}}>{l.nota}</div>}
              </div>
            </div>
          ))}

          <div style={{...s.card,background:C.surf2,textAlign:"center"}}>
            <div style={{fontSize:".82rem",color:C.muted,lineHeight:1.6}}>Conheces um local que não está aqui?<br/>
              <strong style={{color:C.text}}>Fala com o admin do grupo para o adicionar!</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── ADMIN ── */}
      {tab==="admin" && isAdmin && (
        <div style={{padding:".85rem"}}>
          <div style={{fontSize:".78rem",color:C.muted,marginBottom:".85rem",lineHeight:1.5}}>
            As propostas abaixo aguardam a tua validação. Aprova para tornarem visíveis a todo o grupo, ou rejeita para as remover.
          </div>
          {pending.length===0
            ? <div style={{textAlign:"center",padding:"2rem",color:C.muted}}>
                <div style={{fontSize:"2rem",marginBottom:".5rem"}}>✅</div>
                <div>Sem propostas pendentes.</div>
              </div>
            : pending.map(ev=><EventCard key={ev.id} ev={ev}/>)
          }
        </div>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════════
function Toast({msg}) {
  return <div style={{position:"fixed",bottom:"5rem",left:"50%",transform:"translateX(-50%)",background:C.surf2,border:`1px solid ${C.border2}`,borderRadius:30,padding:".55rem 1.2rem",fontSize:".82rem",fontWeight:600,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px #00000060",pointerEvents:"none"}}>
    {msg}
  </div>;
}
