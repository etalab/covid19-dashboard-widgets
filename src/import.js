export const getData = async function (store) {

	const dataRequest = await fetch("https://widgets.barometre-resultats.data.gouv.fr/data/structure-cible.json")
	const data = await dataRequest.json()
	store.commit('initStructure',data)

	const nationalDataRequest = await fetch("https://widgets.barometre-resultats.data.gouv.fr/data/par_territoire/territoire-national-global-light.json")
	const nationalData = await nationalDataRequest.json()
	store.commit("setTerritoireData",{level:"national",data:nationalData})

	const regionalDataRequest = await fetch("https://widgets.barometre-resultats.data.gouv.fr/data/par_territoire/territoire-regional-global-light.json")
	const regionalData = await regionalDataRequest.json()
	store.commit("setTerritoireData",{level:"regional",data:regionalData})

	const departementalDataRequest = await fetch("https://widgets.barometre-resultats.data.gouv.fr/data/par_territoire/territoire-departemental-global-light.json")
	const departementalData = await departementalDataRequest.json()
	store.commit("setTerritoireData",{level:"departemental",data:departementalData})

	store.commit("endImport",true)

	console.log("test update from Git")

	return true
}