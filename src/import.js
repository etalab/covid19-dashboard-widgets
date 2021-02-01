export const getData = async function (store) {

	const dataRequest = await fetch("data/structure-cible.json")
	const data = await dataRequest.json()
	store.commit('initStructure',data)

	const nationalDataRequest = await fetch("data/par_territoire/territoire-national-global-light.json")
	const nationalData = await nationalDataRequest.json()
	store.commit("setTerritoireData",{level:"national",data:nationalData})

	const regionalDataRequest = await fetch("data/par_territoire/territoire-regional-global-light.json")
	const regionalData = await regionalDataRequest.json()
	store.commit("setTerritoireData",{level:"regional",data:regionalData})

	const departementalDataRequest = await fetch("data/par_territoire/territoire-departemental-global-light.json")
	const departementalData = await departementalDataRequest.json()
	store.commit("setTerritoireData",{level:"departemental",data:departementalData})

	store.commit("endImport",true)

	return true
}