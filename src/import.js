export const getData = async function (store) {

	var dep = [
		{
		"value": "01",
		"label": "Ain",
		"region": "Rhône-Alpes"
		},
		{
		"value": "02",
		"label": "Aisne",
		"region": "Picardie"
		},
		{
		"value": "03",
		"label": "Allier",
		"region": "Auvergne"
		},
		{
		"value": "04",
		"label": "Alpes de Haute-Provence",
		"region": "Provence-Alpes-Côte d'Azur"
		},
		{
		"value": "05",
		"label": "Hautes-Alpes",
		"region": "Provence-Alpes-Côte d'Azur"
		},
		{
		"value": "06",
		"label": "Alpes-Maritimes",
		"region": "Provence-Alpes-Côte d'Azur"
		},
		{
		"value": "07",
		"label": "Ardêche",
		"region": "Rhône-Alpes"
		},
		{
		"value": "08",
		"label": "Ardennes",
		"region": "Champagne-Ardenne"
		},
		{
		"value": "09",
		"label": "Ariège",
		"region": "Midi-Pyrénées"
		},
		{
		"value": "10",
		"label": "Aube",
		"region": "Champagne-Ardenne"
		},
		{
		"value": "11",
		"label": "Aude",
		"region": "Languedoc-Roussillon"
		},
		{
		"value": "12",
		"label": "Aveyron",
		"region": "Midi-Pyrénées"
		},
		{
		"value": "13",
		"label": "Bouches-du-Rhône",
		"region": "Provence-Alpes-Côte d'Azur"
		},
		{
		"value": "14",
		"label": "Calvados",
		"region": "Basse-Normandie"
		},
		{
		"value": "15",
		"label": "Cantal",
		"region": "Auvergne"
		},
		{
		"value": "16",
		"label": "Charente",
		"region": "Poitou-Charentes"
		},
		{
		"value": "17",
		"label": "Charente-Maritime",
		"region": "Poitou-Charentes"
		},
		{
		"value": "18",
		"label": "Cher",
		"region": "Centre"
		},
		{
		"value": "19",
		"label": "Corrèze",
		"region": "Limousin"
		},
		{
		"value": "2A",
		"label": "Corse-du-Sud",
		"region": "Corse"
		},
		{
		"value": "2B",
		"label": "Haute-Corse",
		"region": "Corse"
		},
		{
		"value": "21",
		"label": "Côte-d'Or",
		"region": "Bourgogne"
		},
		{
		"value": "22",
		"label": "Côtes d'Armor",
		"region": "Bretagne"
		},
		{
		"value": "23",
		"label": "Creuse",
		"region": "Limousin"
		},
		{
		"value": "24",
		"label": "Dordogne",
		"region": "Aquitaine"
		},
		{
		"value": "25",
		"label": "Doubs",
		"region": "Franche-Comté"
		},
		{
		"value": "26",
		"label": "Drôme",
		"region": "Rhône-Alpes"
		},
		{
		"value": "27",
		"label": "Eure",
		"region": "Haute-Normandie"
		},
		{
		"value": "28",
		"label": "Eure-et-Loir",
		"region": "Centre"
		},
		{
		"value": "29",
		"label": "Finistère",
		"region": "Bretagne"
		},
		{
		"value": "30",
		"label": "Gard",
		"region": "Languedoc-Roussillon"
		},
		{
		"value": "31",
		"label": "Haute-Garonne",
		"region": "Midi-Pyrénées"
		},
		{
		"value": "32",
		"label": "Gers",
		"region": "Midi-Pyrénées"
		},
		{
		"value": "33",
		"label": "Gironde",
		"region": "Aquitaine"
		},
		{
		"value": "34",
		"label": "Hérault",
		"region": "Languedoc-Roussillon"
		},
		{
		"value": "35",
		"label": "Île-et-Vilaine",
		"region": "Bretagne"
		},
		{
		"value": "36",
		"label": "Indre",
		"region": "Centre"
		},
		{
		"value": "37",
		"label": "Indre-et-Loire",
		"region": "Centre"
		},
		{
		"value": "38",
		"label": "Isère",
		"region": "Rhône-Alpes"
		},
		{
		"value": "39",
		"label": "Jura",
		"region": "Franche-Comté"
		},
		{
		"value": "40",
		"label": "Landes",
		"region": "Aquitaine"
		},
		{
		"value": "41",
		"label": "Loir-et-Cher",
		"region": "Centre"
		},
		{
		"value": "42",
		"label": "Loire",
		"region": "Rhône-Alpes"
		},
		{
		"value": "43",
		"label": "Haute-Loire",
		"region": "Auvergne"
		},
		{
		"value": "44",
		"label": "Loire-Atlantique",
		"region": "Pays de la Loire"
		},
		{
		"value": "45",
		"label": "Loiret",
		"region": "Centre"
		},
		{
		"value": "46",
		"label": "Lot",
		"region": "Midi-Pyrénées"
		},
		{
		"value": "47",
		"label": "Lot-et-Garonne",
		"region": "Aquitaine"
		},
		{
		"value": "48",
		"label": "Lozère",
		"region": "Languedoc-Roussillon"
		},
		{
		"value": "49",
		"label": "Maine-et-Loire",
		"region": "Pays de la Loire"
		},
		{
		"value": "50",
		"label": "Manche",
		"region": "Basse-Normandie"
		},
		{
		"value": "51",
		"label": "Marne",
		"region": "Champagne-Ardenne"
		},
		{
		"value": "52",
		"label": "Haute-Marne",
		"region": "Champagne-Ardenne"
		},
		{
		"value": "53",
		"label": "Mayenne",
		"region": "Pays de la Loire"
		},
		{
		"value": "54",
		"label": "Meurthe-et-Moselle",
		"region": "Lorraine"
		},
		{
		"value": "55",
		"label": "Meuse",
		"region": "Lorraine"
		},
		{
		"value": "56",
		"label": "Morbihan",
		"region": "Bretagne"
		},
		{
		"value": "57",
		"label": "Moselle",
		"region": "Lorraine"
		},
		{
		"value": "58",
		"label": "Nièvre",
		"region": "Bourgogne"
		},
		{
		"value": "59",
		"label": "Nord",
		"region": "Nord-Pas-de-Calais"
		},
		{
		"value": "60",
		"label": "Oise",
		"region": "Picardie"
		},
		{
		"value": "61",
		"label": "Orne",
		"region": "Basse-Normandie"
		},
		{
		"value": "62",
		"label": "Pas-de-Calais",
		"region": "Nord-Pas-de-Calais"
		},
		{
		"value": "63",
		"label": "Puy-de-Dôme",
		"region": "Auvergne"
		},
		{
		"value": "64",
		"label": "Pyrénées-Atlantiques",
		"region": "Aquitaine"
		},
		{
		"value": "65",
		"label": "Hautes-Pyrénées",
		"region": "Midi-Pyrénées"
		},
		{
		"value": "66",
		"label": "Pyrénées-Orientales",
		"region": "Languedoc-Roussillon"
		},
		{
		"value": "67",
		"label": "Bas-Rhin",
		"region": "Alsace"
		},
		{
		"value": "68",
		"label": "Haut-Rhin",
		"region": "Alsace"
		},
		{
		"value": "69",
		"label": "Rhône",
		"region": "Rhône-Alpes"
		},
		{
		"value": "70",
		"label": "Haute-Saône",
		"region": "Franche-Comté"
		},
		{
		"value": "71",
		"label": "Saône-et-Loire",
		"region": "Bourgogne"
		},
		{
		"value": "72",
		"label": "Sarthe",
		"region": "Pays de la Loire"
		},
		{
		"value": "73",
		"label": "Savoie",
		"region": "Rhône-Alpes"
		},
		{
		"value": "74",
		"label": "Haute-Savoie",
		"region": "Rhône-Alpes"
		},
		{
		"value": "75",
		"label": "Paris",
		"region": "Île-de-France"
		},
		{
		"value": "76",
		"label": "Seine-Maritime",
		"region": "Haute-Normandie"
		},
		{
		"value": "77",
		"label": "Seine-et-Marne",
		"region": "Île-de-France"
		},
		{
		"value": "78",
		"label": "Yvelines",
		"region": "Île-de-France"
		},
		{
		"value": "79",
		"label": "Deux-Sèvres",
		"region": "Poitou-Charentes"
		},
		{
		"value": "80",
		"label": "Somme",
		"region": "Picardie"
		},
		{
		"value": "81",
		"label": "Tarn",
		"region": "Midi-Pyrénées"
		},
		{
		"value": "82",
		"label": "Tarn-et-Garonne",
		"region": "Midi-Pyrénées"
		},
		{
		"value": "83",
		"label": "Var",
		"region": "Provence-Alpes-Côte d'Azur"
		},
		{
		"value": "84",
		"label": "Vaucluse",
		"region": "Provence-Alpes-Côte d'Azur"
		},
		{
		"value": "85",
		"label": "Vendée",
		"region": "Pays de la Loire"
		},
		{
		"value": "86",
		"label": "Vienne",
		"region": "Poitou-Charentes"
		},
		{
		"value": "87",
		"label": "Haute-Vienne",
		"region": "Limousin"
		},
		{
		"value": "88",
		"label": "Vosges",
		"region": "Lorraine"
		},
		{
		"value": "89",
		"label": "Yonne",
		"region": "Bourgogne"
		},
		{
		"value": "90",
		"label": "Territoire-de-Belfort",
		"region": "Franche-Comté"
		},
		{
		"value": "91",
		"label": "Essonne",
		"region": "Île-de-France"
		},
		{
		"value": "92",
		"label": "Hauts-de-Seine",
		"region": "Île-de-France"
		},
		{
		"value": "93",
		"label": "Seine-Saint-Denis",
		"region": "Île-de-France"
		},
		{
		"value": "94",
		"label": "Val-de-Marne",
		"region": "Île-de-France"
		},
		{
		"value": "95",
		"label": "Val-d'Oise",
		"region": "Île-de-France"
		},
		{
		"value": "971",
		"label": "Guadeloupe",
		"region": "Outre-Mer"
		},
		{
		"value": "972",
		"label": "Martinique",
		"region": "Outre-Mer"
		},
		{
		"value": "973",
		"label": "Guyane française",
		"region": "Outre-Mer"
		},
		{
		"value": "974",
		"label": "Réunion",
		"region": "Outre-Mer"
		},
		{
		"value": "976",
		"label": "Mayotte",
		"region": "Outre-Mer"
		}
	]

	var reg = [
		{
		"value" : "84",
		"label" : "Auvergne-Rhône-Alpes"
		},
		{
		"value" : "32",
		"label" : "Hauts-de-France"
		},
		{
		"value" : "93",
		"label" : "Provence-Alpes-Côte d'Azur"
		},
		{
		"value" : "44",
		"label" : "Grand Est"
		},
		{
		"value" : "76",
		"label" : "Occitanie"
		},
		{
		"value" : "28",
		"label" : "Normandie"
		},
		{
		"value" : "75",
		"label" : "Nouvelle-Aquitaine"
		},
		{
		"value" : "24",
		"label" : "Centre-Val de Loire"
		},
		{
		"value" : "27",
		"label" : "Bourgogne-Franche-Comté"
		},
		{
		"value" : "53",
		"label" : "Bretagne"
		},
		{
		"value" : "94",
		"label" : "Corse"
		},
		{
		"value" : "52",
		"label" : "Pays de la Loire"
		},
		{
		"value" : "11",
		"label" : "Île-de-France"
		},
		{
		"value" : "01",
		"label" : "Guadeloupe"
		},
		{
		"value" : "02",
		"label" : "Martinique"
		},
		{
		"value" : "03",
		"label" : "Guyane"
		},
		{
		"value" : "04",
		"label" : "La Réunion"
		},
		{
		"value" : "06",
		"label" : "Mayotte"
		}
	]

	store.commit("initDep",dep)
	store.commit("initReg",reg)

	return true
}