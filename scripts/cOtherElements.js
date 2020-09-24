//Level Button Element
function Create_LevelButton()
{
	/*
	var DisplayLevel = "II";
	if (CurrentLevel == "I")
	{
		DisplayLevel = "I";
	}
	*/

	var html;
	html = $('<div>').addClass('SelectLevel');
	html.append('<input type="image" src="' + ImagePathRoot + ImagePathLevelImage + 'Level' + CurrentLevel + '.png" class="ImgLevel" onclick="SwitchLevel();" />');
	return html;
}

function Fill_LevelButton()
{
	var LevelImg = $('.ImgLevel');
	var LevelImgSrc = LevelImg.attr('src');
	LevelImgSrc = ImagePathRoot + ImagePathLevelImage + 'Level' + CurrentLevel + ".png";
	LevelImg.attr('src', LevelImgSrc);
}

function SwitchLevel()
{
	var SwitcToLevel = CurrentLevel + 1;
	if (SwitcToLevel == 8)
	{
		SwitcToLevel= 0
	}
	/*
	if (CurrentLevel == "I")
	{
		SwitcToLevel = "II";
	}
	*/

	var LevelImg = $('.ImgLevel');
	var LevelImgSrc = LevelImg.attr('src');
	LevelImgSrc = LevelImgSrc.replace('Level' + CurrentLevel, 'Level' + SwitcToLevel)
	LevelImg.attr('src', LevelImgSrc);

	//new current Level
	CurrentLevel = SwitcToLevel;

	UpdateWindow_OLFigures();
	UpdateWindow_MapDesign();
}

function updateLevel(NewLevel) {
	CurrentLevel = NewLevel;
	Fill_LevelButton();
	//Data Linked
	UpdateWindow_OLFigures();
}

//expansions
function Create_ExpansionList()
{
	var html;
	html = $('<div>').addClass('expansions');
	var container = $('<div>').addClass('expansions-container');
	container.append('<h1>Expansion Filters</h1>');
	html.append(container);
	for (var expansionGroup in EXPANSION_GROUPS) {
		if (EXPANSION_GROUPS[expansionGroup] == undefined) continue;
		var GroupHTML = $('<div>').addClass('expansions-group');
		GroupHTML.append("<b>"+expansionGroup+"</b>");

		var expansionList = EXPANSION_GROUPS[expansionGroup];
		for (var i = 0; i < expansionList.length; i++) {
			var expansionObject = $('<div>').addClass('checkbox');
			var expansionInput = $('<input type="checkbox" class="Expansions-Value" name="' + expansionList[i].id + '" onClick="Set_Expansion(this, \'' + expansionList[i].id + '\');" />');
			expansionInput.prop('checked', true);
			expansionObject.append($('<label> ' + expansionList[i].title + '</label>').prepend(expansionInput));
			GroupHTML.append(expansionObject);
		}
		html.append(GroupHTML);
	}
	return html;
}

function Set_Expansion(element, value) {
	//should update all expansions : on many windows
	var NewValue;
	if ($(element).length == 1 && $(element).hasClass('Expansions-Value')) {
		//recover new value
		NewValue = $(element).prop('checked');
	}
	else {
		//from FillZone new value is true
		NewValue = true;
	}
	//check all others checkboxes with same value
	$('[name="' + value + '"]').prop('checked', NewValue);

	if ($(element).length == 1 && $(element).hasClass('Expansions-Value')) {
		//updatte config for later updating filtered lists
		GetZone_Expansions(config);
	}

	//Data Linked
	// the update should redraw the lists : ul / dropdown-menu
	updateMonstersVisibility();
	UpdateAllSelectcLists("tiles");
	UpdateAllSelectcLists("hero");
	UpdateAllSelectcLists("monsters");
	UpdateAllSelectcLists("lieutenants");
	UpdateAllSelectcLists("familiars");
	UpdateAllSelectcLists("villagers");
}

function GetZone_Expansions(DataToUpdate) {
	var result = {};
	var SelectedExpansions = $('.Expansions-Value:checkbox:checked')
	for (var i = 0; i < SelectedExpansions.length; i++) {
		var checkedExpansion = $(SelectedExpansions[i]).attr('name');
		result[checkedExpansion] = checkedExpansion;
	}
	DataToUpdate.expansions = result;
	return DataToUpdate;
}

function FillZone_Expansions(NewData, FromPreFilledMaps) {
	ResetZone_Expansions(FromPreFilledMaps);
	if (NewData.expansions != undefined) {
		for (var oneExpansion in NewData.expansions) {
			Set_Expansion($('.expansions'), oneExpansion);
		}
	}
}

function ResetZone_Expansions(FromPreFilledMaps) {
	$('.Expansions-Value').prop('checked',false);
}

