function InitializeWindowFor_OLFigures() {
	var html = $('#monsters');

	html.append(Create_LevelButton());

	//monsters zone
	html.append(CreateZone("monsters"));
	//bosses zone
	html.append(CreateZone("lieutenants"));

	//expansions
//	html.append(Create_ExpansionList());
}

function UpdateWindow_OLFigures() {
	//after Level Set

	//Update_MonsterImages(RowElement);
	Update_MonsterImages();

	var LieutenantsList = $('.lieutenants-container .select-row');
	for (var i = 0; i < LieutenantsList.length; i++) {
		var container = $(LieutenantsList[i]);
		Update_LieutenantImages(container);
	}
}

function GetWindow_OLFigures(DataToUpdate) {
	DataToUpdate = GetZone("monsters", DataToUpdate);
	DataToUpdate = GetZone("lieutenants", DataToUpdate);
//	DataToUpdate = GetZone_Expansions(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_OLFigures(NewData, FromPreFilledMaps) {
	//Fill_LevelButton(); -> Common not Filled Here
	FillZone("monsters", NewData, FromPreFilledMaps);
	FillZone("lieutenants", NewData, FromPreFilledMaps);
//	FillZone_Expansions(NewData, FromPreFilledMaps);
}

function ResetWindow_OLFigures(FromPreFilledMaps) {
	ResetZone("monsters", FromPreFilledMaps);
	ResetZone("lieutenants", FromPreFilledMaps);
//	ResetZone_Expansions(FromPreFilledMaps);
}

//monsters zone
// if empty : full generic zone using Main Elements common functions

function monsters_Pre_CreateZone(html) {
	var ElementName = "monsters";
	var ElementLine = window[ElementName + "Line"];

	var container = html.find("." + ElementName + "-container");

	container.append('<div class="' + ElementName + '-cards"></div>');
	container.append('<div class="' + ElementName + '-relicscards"></div>');
	container.append('<div class="' + ElementName + '-tokenscards"></div>');
	ElementLine.RelicCommonImageContainer = ElementName + "-relicscards";
	ElementLine.TokenCommonImageContainer = ElementName + "-tokenscards";
	return html;
}

function monsters_Post_FillZone(NewData, FromPreFilledMaps) {
	if (NewData.monsters != undefined) {
		Update_MonsterImages();
	}
}

function monsters_Post_CreateListValues(html) {
	//ignore base function use this instead
	var ElementName = "monsters";
	var ElementLine = window[ElementName + "Line"];

	var html = "";
	html += addOption('Clear', '', 'UnSet("' + ElementName + '", this);');

	var DataToDisplay;
	if (ElementLine.UseExpantionFilter == true) {
		DataToDisplay = filterByExpansion(ElementLine.AllData);
	}
	else {
		DataToDisplay = ElementLine.AllData;
	}
	Object.entries(DataToDisplay).sort(dynamicSort("order")).forEach(OneItem => {
		var monsterClass = folderize(OneItem[1].expansion);
		//for (var j = 0; j < OneItem[1].traits.length; j++) {
		//	monsterClass += ' ';
		//	monsterClass += urlize(OneItem[1].traits[j]);
		//}
		var monsterID = OneItem[0];
		var monsterTitle = OneItem[1].title;
		var monsterVisible = true; //(monsterTraits[OneItem[1].traits[0]] != undefined || monsterTraits[OneItem[1].traits[1]] != undefined) && selectedExpansions[OneItem[1].expansion] != undefined;
		var option = $(addOption(monsterTitle + MasterSuffix, monsterClass, 'Set(\'' + ElementName + '\', this, \'' + monsterID + MasterSuffix + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
		option = $(addOption(monsterTitle + MinionSuffix, monsterClass, 'Set(\'' + ElementName + '\', this, \'' + monsterID + MinionSuffix + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
	});

	return html;
}

function monsters_Post_Set(element, value) {
	var ElementName = "monsters";
	var ElementLine = window[ElementName + "Line"];

	var monsterHp;
	var OneMonsterValue = recoverMonsterBaseName(value);
	if (value.indexOf(MasterSuffix) > -1) {
		if (CurrentLevel == "I") {
			monsterHp = ElementLine.AllData[OneMonsterValue].masterHpActI;
		} else {
			monsterHp = ElementLine.AllData[OneMonsterValue].masterHpActII;
		}
	} else {
		if (CurrentLevel == "I") {
			monsterHp = ElementLine.AllData[OneMonsterValue].minionHpActI;
		} else {
			monsterHp = ElementLine.AllData[OneMonsterValue].minionHpActII;
		}
	}

	var container = $(element).parents('.select-row');
	Set_CustomInput(0, false, container, monsterHp);
	Update_MonsterImages(container);
}

function monsters_Post_UnSet(element) {
	var container = $(element).parents('.select-row');
	Update_MonsterImages(container);
}


function RemoveLine_Monster(Button) {
	Update_MonsterImages();
}

function Update_MonsterImages(RowElement) {
	var ElementName = "monsters";
	var ElementLine = window[ElementName + "Line"];

	var MonsterImageContainer = $('.monsters-cards');
	var MonsterList = $('.monsters-container').find('.MainElement-Value');
	Reset_MonsterImages(RowElement);
	var LevelAddition = '_' + CurrentLevel;
	for (var i = 0; i < MonsterList.length; i++) {
		var OneMonsterValue = recoverMonsterBaseName($(MonsterList[i]).attr('value'));
		if (OneMonsterValue == undefined || OneMonsterValue == '') continue;
		if (MonsterImageContainer.find('.' + urlize(OneMonsterValue)).length == 0)
		{
			var MonsterImage = $('<img>');
			var ImageCardPath = ImagePathRoot + monstersLine.CardsPath(GetExpansionPath(monstersLine.AllData[OneMonsterValue].expansion));
			MonsterImage.attr('src', ImageCardPath + urlize(monstersLine.AllData[OneMonsterValue].title) + LevelAddition + '.png').addClass('monster').addClass(urlize(OneMonsterValue));
			MonsterImageContainer.append(MonsterImage);
			if (monstersLine.AllData[OneMonsterValue].hasBack) {
				var monsterCardBack = $('<img>');
				monsterCardBack.attr('src', ImageCardPath + urlize(monstersLine.AllData[OneMonsterValue].title) + '_back' + LevelAddition + '.png');
				MonsterImageContainer.append(monsterCardBack);
			}
		}
	}
}

function Reset_MonsterImages(RowElement) {
	var MonsterImageContainer = $('.monsters-cards');
	MonsterImageContainer.find('img').remove()
}

//lieutenants zone
// if empty : full generic zone using Main Elements common functions

function lieutenants_Post_FillZone(NewData, FromPreFilledMaps) {
	if (NewData.lieutenants != undefined) {
		Update_LieutenantImages($('.lieutenants-container'));
	}
}

function lieutenants_Post_Set(element, value) {
	var container = $(element).parents('.select-row');
	Update_LieutenantImages(container);
}

function lieutenants_Post_UnSet(element) {
	var container = $(element).parents('.select-row');
	Update_LieutenantImages(container);
}


function RemoveLine_Lieutenant(Button) {
}

function Update_LieutenantImages(RowElement) {
	var ElementName = "lieutenants";
	var ElementLine = window[ElementName + "Line"];

	var LieutenantImageContainer = RowElement.find('.Row-cards');
	Reset_LieutenantImages(RowElement);
	var LevelAddition = '_' + CurrentLevel;

	var OneLieutenantValue = RowElement.find('.MainElement-Value').val();
	if (OneLieutenantValue == undefined || OneLieutenantValue == '') return;

	if (LieutenantImageContainer.find('.' + urlize(OneLieutenantValue)).length == 0)
	{
		var LieutenantImage = $('<img>');
		var ImageCardPath = ImagePathRoot + ElementLine.CardsPath(GetExpansionPath(ElementLine.AllData[OneLieutenantValue].expansion));
		LieutenantImage.attr('src', ImageCardPath + urlize(ElementLine.AllData[OneLieutenantValue].title) + LevelAddition + '.png').addClass('lieutenant').addClass(urlize(ElementLine.AllData[OneLieutenantValue].title));
		LieutenantImageContainer.append(LieutenantImage);
		if (ElementLine.AllData[OneLieutenantValue].hasBack) {
			var LieutenantCardBack = $('<img>');
			LieutenantCardBack.attr('src', ImageCardPath + urlize(ElementLine.AllData[OneLieutenantValue].title) + LevelAddition + '_back' + '.png');
			LieutenantImageContainer.append(LieutenantCardBack);
		}
	}
}

function Reset_LieutenantImages(RowElement) {
	var LieutenantImageContainer = RowElement.find('.Row-cards');
	LieutenantImageContainer.find('img').remove();
}

















function updateMonstersVisibility() {
	monsterTraits = {};
	selectedExpansions = {};
	var traitInputs = $('.monster-traits input');
	var expansionInputs = $('.expansions input');
	for (var i = 0; i < traitInputs.length; i++) {
		if ($(traitInputs[i]).prop('checked')) {
			var checkedTrait = $(traitInputs[i]).attr('name');
			monsterTraits[checkedTrait] = checkedTrait;
		}
	}
	for (var i = 0; i < expansionInputs.length; i++) {
		if ($(expansionInputs[i]).prop('checked')) {
			var selectedExpansion = $(expansionInputs[i]).attr('name');
			selectedExpansions[selectedExpansion] = selectedExpansion;
		}
	}
	$('.monster-container .select-monsters li').css('display', 'none');
	for (var monsterTrait in monsterTraits) {
		for (var selectedExpansion in selectedExpansions) {
			if (monsterTraits[monsterTrait] == undefined || selectedExpansions[selectedExpansion] == undefined) continue;
			$('.monster-container .' + monsterTrait + '.' + selectedExpansion).css('display', 'block');
		}
	}
}



//function adjustMonsterList() {
//	monsterList = [];
//	var monsters = $('[name="monster-title"]');
//	var monsterCardsContainer = $('#monsters-cards');
//	monsterCardsContainer.html('');
//	for (var i = 0; i < monsters.length; i++) {
//		var title = $(monsters[i]).val();
//		var inSet = false; //there is not Set in old browsers - thats why such a poor code is used
//		for (var j = 0; j < monsterList.length && !inSet; j++) {
//			if (monsterList[j] == title) {
//				inSet = true;
//			}
//		}
//		if (!inSet) {
//			monsterList.push(title);
//		}
//	}
//	var LevelAddition = '_' + CurrentLevel;
//	for (var i = 0; i < monsterList.length; i++) {
//		var monster = monsterList[i];
//		if (monster == '') continue;
//		var monsterCard = $('<img>');
//		var ImageCardPath = ImagePathRoot + monstersLine.CardsPath(GetExpansionPath(monstersLine.AllData[OneMonsterValue].expansion));
//		monsterCard.attr('src', ImageCardPath + urlize(monster) + LevelAddition + '.png');
//		monsterCardsContainer.append(monsterCard);
//		if (MONSTERS[monster].hasBack) {
//			var monsterCardBack = $('<img>');
//			monsterCardBack.attr('src', ImageCardPath + urlize(monster) + '_back' + LevelAddition + '.png');
//			monsterCardsContainer.append(monsterCardBack);
//		}
//	}
//	addConditions(getConditions($('#monsters')), monsterCardsContainer);
//}
