function InitializeWindowFor_MapDesign() {
	var html = $('#map-controls');

	//Level Button
//	html.append(Create_LevelButton());

	//tiles zone
	html.append(CreateZone("tiles"));
	//OverlayTiles zone
	html.append(CreateZone("overlaytiles"));
	//doors zone
	html.append(CreateZone("doors"));
}

function UpdateWindow_MapDesign() {
	//after Level Set
//	Update_EncounterList('', CurrentLevel);
}


function GetWindow_MapDesign(DataToUpdate) {
	DataToUpdate = GetZone("tiles", DataToUpdate);
	DataToUpdate = GetZone("overlaytiles", DataToUpdate);
	DataToUpdate = GetZone("doors", DataToUpdate);
	return DataToUpdate;
}

function FillWindow_MapDesign(NewData, FromPreFilledMaps) {
	//Fill_LevelButton(); -> Common not Filled Here
	FillZone("tiles", NewData, FromPreFilledMaps);
	FillZone("overlaytiles", NewData, FromPreFilledMaps);
	FillZone("doors", NewData, FromPreFilledMaps);
}

function ResetWindow_MapDesign(FromPreFilledMaps) {
	ResetZone("tiles", FromPreFilledMaps);
	ResetZone("overlaytiles", FromPreFilledMaps);
	ResetZone("doors", FromPreFilledMaps);
}


//tiles zone
// if empty : full generic zone using Main Elements common functions

//doors zone
// if empty : full generic zone using Main Elements common functions

//overlaytiles zone
// if empty : full generic zone using Main Elements common functions
