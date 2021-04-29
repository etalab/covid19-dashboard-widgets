export const getData = async function (store) {

	const dataRequest = await fetch("https://raw.githubusercontent.com/geoffreyaldebert/covidbackend/master/global_new.json")
	const data = await dataRequest.json()
	store.commit("initData",data)
	store.commit("endImport",true)

	return true
}