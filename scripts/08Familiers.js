function InitializeWindowFor_Familiars() {
	var html = $('#familiars');

	//familiars zone
	html.append(CreateZone("familiars"));


	//villagers zone
	html.append(CreateZone("villagers"));
}

function UpdateWindow_Familiars() {
	//after Act Set
	//Update_MonsterImages(RowElement);
	//Update_MonsterImages();
}

function GetWindow_Familiars(DataToUpdate) {
	DataToUpdate = GetZone("familiars", DataToUpdate);
	DataToUpdate = GetZone("villagers", DataToUpdate);
	return DataToUpdate;
}

function FillWindow_Familiars(NewData, FromPreFilledMaps) {
	//Fill_ActButton(); -> Common not Filled Here
	FillZone("familiars", NewData, FromPreFilledMaps);
	FillZone("villagers", NewData, FromPreFilledMaps);
}

function ResetWindow_Familiars(FromPreFilledMaps) {
	ResetZone("familiars", FromPreFilledMaps);
	ResetZone("villagers", FromPreFilledMaps);
}

//Familiars zone
// if empty : full generic zone using Main Elements common functions

//Villagers zone
// if empty : full generic zone using Main Elements common functions

