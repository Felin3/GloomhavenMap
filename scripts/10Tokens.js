function InitializeWindowFor_MapTokens() {
	var html = $('#map-tokens');

	//OverlayTiles zone
	html.append(CreateZone("maptokens"));

}

function UpdateWindow_MapTokens() {
	//after Level Set
//	Update_EncounterList('', CurrentLevel);
}


function GetWindow_MapTokens(DataToUpdate) {
	DataToUpdate = GetZone("maptokens", DataToUpdate);
	return DataToUpdate;
}

function FillWindow_MapTokens(NewData, FromPreFilledMaps) {
	//Fill_LevelButton(); -> Common not Filled Here
	FillZone("maptokens", NewData, FromPreFilledMaps);
}

function ResetWindow_MapTokens(FromPreFilledMaps) {
	ResetZone("maptokens", FromPreFilledMaps);
}


//Movable Map Tokens zone
// if empty : full generic zone using Main Elements common functions
