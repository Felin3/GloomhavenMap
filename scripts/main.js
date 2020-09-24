function addOption(title, optionClass, functionCallback, additionalAttribute, attributeValue) {
	if (title == "$SEPARATOR$" || title == "$SEPARATOR$ ") {
		return '<li role="separator" class="divider"></li>';
	}
	else {
		return '<li class="' + optionClass + '"' + (additionalAttribute != undefined ? ' ' + additionalAttribute + '="' + attributeValue + '"' : '') + '><a onclick="' + functionCallback + '">' + title + '</a></li>';
	}
}

function addTextareaWithLabel(labelText, link) {
	var html;
	html = '<label for="' + link + '">' + labelText + '</label>'
	html += '<textarea class="form-control" rows="5" id="' + link + '"></textarea>'
	return html;
}

function recoverMonsterBaseName(MonsterFullName) {
	var MonsterBaseName = MonsterFullName.replace(MasterSuffix, '').replace(MinionSuffix, '')
	return MonsterBaseName;
}
function removeMonsterMinionSuffix(MonsterFullName) {
	var MonsterName = MonsterFullName.replace(MinionSuffix, '')
	return MonsterName;
}


//function addConditions(conditions, container) {
//	for (var condition in conditions) {
//		if (condition == undefined || condition == '' || !CONDITIONS[condition].hasConditionCard) continue;
//		var conditionImage = $('<img>');
//		conditionImage.attr('src', ImagePathRoot + ImagePathConditionImage + urlize(condition) + '.png').addClass('condition');
//		container.append(conditionImage);
//	}
//}

//function getConditions(container) {
//	var conditions = $(container).find('[name="condition-title"]');
//	var conditionsObject = {};
//	for (var i = 0; i < conditions.length; i++) {
//		var condition = $(conditions[i]).val();
//		if (conditionsObject[condition] == undefined) {
//			conditionsObject[condition] = 1;
//		} else {
//			conditionsObject[condition] += 1;
//		}
//	}
//	return conditionsObject;
//}

function getAlphabetChar(number) {
	var result = '';
	if (number >= 26) {
		result += ALPHABET.charAt(Math.floor(number / 26) - 1);
	}
	return result += ALPHABET.charAt(number % 26);
}

function recoverConfig(Base64Data) {
	var dataTemp = JSON.parse(Base64.decode(Base64Data));
	dataTemp = RetroCompatibility(dataTemp);

	return dataTemp;
}

function RetroCompatibility(OldConfig) {
	//update Recovered config based on Version
	var AndOlder = false
	var NewConfig = OldConfig

	if (Object.keys(OldConfig).length == 0)
	{
		//empty config
		//just add heroes to have a start
		NewConfig.heroes = [];
		for (var i = 1; i <= MAX_Heroes; i++) {
			var OneHero = {};
			OneHero.id = 0;
			NewConfig.heroes[i - 1] = OneHero;
		}
		return NewConfig;
	}

	//initialize values if needed
	if (NewConfig.CurrentLevel == undefined) {
		NewConfig.CurrentLevel = 0;
	}
	if (NewConfig.CurrentLevel == "I" || NewConfig.CurrentLevel == "II") {
		NewConfig.CurrentLevel = 0;
	}

	// previous to 1.0.0
	if (NewConfig.mapVersion == undefined) {
		//change monsters data
		// FROM "title":"Wraith","master":true TO "title":"Wraith master"
		// AND FROM "title":"Wraith","master":false TO "title":"Wraith minion"
		if (NewConfig.monsters != undefined) {
			for (var i = 0; NewConfig.monsters != undefined && i < NewConfig.monsters.length; i++) {
				if (NewConfig.monsters[i].master) {
					NewConfig.monsters[i].title = NewConfig.monsters[i].title + MaserSuffix;
				}
				else {
					NewConfig.monsters[i].title = NewConfig.monsters[i].title + MinionSuffixMinionSuffix;
				}
				//				if (monster.vertical) folder += 'vertical/';
				//				if (monster.direction == "V") folder += 'vertical/';

			}
		}

		//change Doors Direction
		// FROM "vertical":true TO "direction":"V"
		// FROM "vertical":false TO "direction":"H"
		if (NewConfig.doors != undefined) {
			for (var i = 0; NewConfig.doors != undefined && i < NewConfig.doors.length; i++) {
				if (NewConfig.doors[i].vertical) {
					NewConfig.doors[i].direction = "V";
				}
				else {
					NewConfig.doors[i].direction = "H";
				}
			}
		}

		//change Level
		// FROM "actOne":true TO "CurrentLevel":"I"
		// FROM "actOne":false TO "CurrentLevel":"II"
		//if (NewConfig.actOne != undefined) {
		//	if (NewConfig.actOne) {
		//		NewConfig.CurrentLevel = "I";
		//	}
		//	else {
		//		NewConfig.CurrentLevel = "II";
		//	}
		//}



		AndOlder = true;
	}

	// previous to 1.1.0
	if (NewConfig.mapVersion == "1.0.0" || AndOlder == true) {
		//heroes in a list (heroes1, heroes2, ... -> heroes[])
		NewConfig.heroes = [];
		for (var i = 1; i <= MAX_Heroes; i++) {
			NewConfig.heroes[i - 1] = NewConfig['hero' + i.toString()];
			delete NewConfig['hero' + i.toString()];
		}

		//replace titles by ids
		for (var i = 0; NewConfig.tiles != undefined && i < NewConfig.tiles.length; i++) {
			NewConfig.tiles[i].id = FromTitleToID(tilesLine.AllData, NewConfig.tiles[i].title);
		}
		for (var i = 0; NewConfig.overlaytiles != undefined && i < NewConfig.overlaytiles.length; i++) {
			NewConfig.overlaytiles[i].id = FromTitleToID(overlaytilesLine.AllData, NewConfig.overlaytiles[i].title);
		}
		for (var i = 0; NewConfig.doors != undefined && i < NewConfig.doors.length; i++) {
			NewConfig.doors[i].id = FromTitleToID(doorsLine.AllData, NewConfig.doors[i].title);
		}
		for (var i = 0; NewConfig.maptokens != undefined && i < NewConfig.maptokens.length; i++) {
			NewConfig.maptokens[i].id = FromTitleToID(maptokensLine.AllData, NewConfig.maptokens[i].title);
		}
		for (var i = 0; NewConfig.familiars != undefined && i < NewConfig.familiars.length; i++) {
			NewConfig.familiars[i].id = FromTitleToID(familiarsLine.AllData, NewConfig.familiars[i].title);
		}
		for (var i = 0; NewConfig.villagers != undefined && i < NewConfig.villagers.length; i++) {
			NewConfig.villagers[i].id = FromTitleToID(villagersLine.AllData, NewConfig.villagers[i].title);
		}
		for (var i = 0; NewConfig.monsters != undefined && i < NewConfig.monsters.length; i++) {
			var MonsterBaseName = recoverMonsterBaseName(NewConfig.monsters[i].title);
			var MonsterSuffit = NewConfig.monsters[i].title.replace(MonsterBaseName, '');
			NewConfig.monsters[i].id = FromTitleToID(monstersLine.AllData, MonsterBaseName) + MonsterSuffit;
		}
		for (var i = 0; NewConfig.lieutenants != undefined && i < NewConfig.lieutenants.length; i++) {
			NewConfig.lieutenants[i].id = FromTitleToID(lieutenantsLine.AllData, NewConfig.lieutenants[i].title);
		}
		for (var i = 0; NewConfig.heroes != undefined && i < NewConfig.heroes.length; i++) {
			NewConfig.heroes[i].id = FromTitleToID(heroLine.AllData, NewConfig.heroes[i].title);
		}

		AndOlder = true;
	}

	// previous to 1.2.0
	if (NewConfig.mapVersion == "1.1.0" || AndOlder == true) {
		//replace expansions by ids
		for (var i = 0; NewConfig.expansions != undefined && i < NewConfig.expansions.length; i++) {
			NewConfig.expansions[i].id = FromTitleToID(tilesLine.AllData, NewConfig.tiles[i].title);
			u
		}
		AndOlder = true;
	}
	return NewConfig;
}

function FromTitleToID(LIST, TitleValue) {
	var NewIDValue = 0;
	Object.keys(LIST).forEach(item => {
		if (LIST[item].title == TitleValue) {
			NewIDValue = item;
		}
	});
	return NewIDValue;
}


function rebuildMap(element, mapNb) {
	var mapConfig = recoverConfig(MAP_HASES_LIST[mapNb][3]);



	config.tiles = mapConfig.tiles;
	config.doors = mapConfig.doors;
	config.xs = mapConfig.xs;
	config.monsters = mapConfig.monsters;
	config.lieutenants = mapConfig.lieutenants;
	config.villagers = mapConfig.villagers;
	config.CurrentLevel = mapConfig.CurrentLevel;
	config.questObjectives = mapConfig.questObjectives;
	config.monsterTraits = mapConfig.monsterTraits;


	updateLevel(config.CurrentLevel);
	FillWindow_QuestObjectives(config, true);
	FillWindow_MapDesign(config, true);
	FillWindow_MapTokens(config, true);
	FillWindow_OLFigures(config, true);
	FillWindow_Familiars(config, true);

	//multi zones
	FillZone_Expansions(config, true);

	switchToMap();
	UnSet_Campaign(element);
}

function clearHeroesConditions() {
	$('.select-condition').remove();
	$('[name="condition-title"]').remove();
}

function createInputSelect(title, titleClass, additionalClass) {
	var select = $('<div>').addClass('btn-group').addClass(additionalClass);
	var button = $('<button>').attr('type', 'button').addClass('btn btn-default dropdown-toggle').attr('data-toggle', 'dropdown').attr('aria-expanded', 'false');
	button.append($('<span>' + title + ' </span>').addClass(titleClass)).append($('<span>').addClass('caret'));
	select.append(button).append($('<ul>').addClass('dropdown-menu').attr('role', 'menu'));
	return select;
}

function filterByExpansion(CurrentList) {
	var NewFilteredList = {};
	Object.entries(CurrentList).forEach(OneItem => {
		for (var oneExpansion in config.expansions) {
			if (OneItem[1].expansion == oneExpansion) {
				NewFilteredList[OneItem[1].id] = OneItem[1];
				break;
			}
		}
	});
	return NewFilteredList; 
}

function populate() {
	collectData();
	updateConfig();
	constructMapFromConfig();
}

function constructMapFromConfig() {
	var mapContainer = $('#map');
	var map = mapContainer.find('.map');
	var figures = mapContainer.find('.figures');
	map.html('');
	figures.html('');
	mapObjects = [];

	AddArrayObjectsOnMap(config.tiles, tilesLine, map);
	AddArrayObjectsOnMap(config.overlaytiles, overlaytilesLine, map);
	AddArrayObjectsOnMap(config.doors, doorsLine, map);
	AddArrayObjectsOnMap(config.maptokens, maptokensLine, map);
	AddArrayObjectsOnMap(config.familiars, familiarsLine, figures);
	AddArrayObjectsOnMap(config.villagers, villagersLine, figures);
	AddArrayObjectsOnMap(config.monsters, monstersLine, figures);
	////AddArrayObjectsOnMap(config.allies, 'images/allies_tokens/', allyLine, figures);
	AddArrayObjectsOnMap(config.lieutenants, lieutenantsLine, figures);
	////AddArrayObjectsOnMap(config.agents, 'images/monster_tokens/', agentLine, figures);



	AddArrayObjectsOnMap(config.heroes, heroLine, figures);
	//for (var i = 1; i <= MAX_Heroes; i++) {
	//	AddObjectsOnMap(config['hero' + i], heroLine, figures)
	//}


	adjustOverlappingImages();

	setShortLink();
}

function getConditionsArrayFromObjectOrArray(conditions) {
	var result = [];
	if (conditions.length == undefined) {
		for (var condition in conditions) {
			if (condition == undefined || condition == "") continue;
			for (var i = 0; i < conditions[condition] && (i == 0 || !CONDITIONS[condition].hasConditionCard); i++) {
				result.push(condition);
			}
		}
	} else {
		result = conditions;
	}
	return result;
}

//function adjustOverlappingImages() {
//	for (var coordinate in mapObjects) {
//		var tileObjects = mapObjects[coordinate];
//		if (tileObjects == undefined || tileObjects.length == undefined || tileObjects.length <= 1) {
//			continue;
//		}
//		tileObjects.sort(function (a, b) {
//			return a.priority - b.priority;
//		});
//		for (var i = 0; i < tileObjects.length; i++) {
//			var offset = 10 * (tileObjects.length - i - 1);
//			var leftString = tileObjects[i].object.css('left');
//			tileObjects[i].object.css('left', (parseInt(leftString.substring(0, leftString.length - 2)) + offset).toString() + "px");
//			var topString = tileObjects[i].object.css('top');
//			tileObjects[i].object.css('top', (parseInt(topString.substring(0, topString.length - 2)) + offset).toString() + "px");
//		}
//	}
//}

function constructSettingsFromConfig() {
	updateLevel(config.CurrentLevel);
	FillWindow_QuestObjectives(config, false);
	FillWindow_MapDesign(config, false);
	FillWindow_MapTokens(config, false);
	FillWindow_OLFigures(config, false);
	FillWindow_Heroes(config, false);
	FillWindow_Familiars(config, false);

	//multi zones
	FillZone_Expansions(config, false);
	constructMapSize();
}

function constructMapSize() {
	if (config.mapWidth != undefined) {
		mapWidth = config.mapWidth;
	}
	if (config.mapHeight != undefined) {
		mapHeight = config.mapHeight;
	}
}

function updateConfig() {
	window.location.hash = Base64.encode(JSON.stringify(config));
}

function collectData() {
	config.mapVersion = MAPVERSION;
	config.mapGame = MAPGAME;
	config.CurrentLevel = CurrentLevel;
	//	config.expansions = selectedExpansions;
	config = GetWindow_QuestObjectives(config);
	config = GetWindow_MapDesign(config);
	config = GetWindow_MapTokens(config);
	config = GetWindow_OLFigures(config);
	config = GetWindow_Heroes(config);
	config = GetWindow_Familiars(config);

	//multi zones
	config = GetZone_Expansions(config);

	config.mapWidth = mapWidth;
	config.mapHeight = mapHeight;
}

function drawGrid() {
	for (var i = 0; i < mapWidth; i++) {
		var element = $('<div>');
		element.html(getAlphabetChar(i));
		element.css({
			'position': 'absolute',
			'left': (Math.floor((1 + i) * HCellSize * 3 / 4)).toString() + 'px',
			'top': '-' + VCellSize + 'px'
		});
		$('.grid').append(element);
	}
	for (var i = 0; i <= mapHeight; i++) {
		var element = $('<div>');
		element.html(i.toString());
		element.css({
			'position': 'absolute',
			'left': '-10px',
			'top': Math.floor(((i * VCellSize) + (VCellSize / 4))).toString() + 'px'
		});
		$('.grid').append(element);
	}
}

function setShortLink() {
	var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		string = '',
		charCnt = 20,
		uri;
	for (var i = 0; i < charCnt; i += 1) {
		string += characters[Math.floor(Math.random() * characters.length)];
	}
	uri = 'https://tinyurl.com/create.php?source=indexpage&url=' + encodeURIComponent(location.href) + '&alias=' + string;
	$('body').append('<img src="' + uri + '" style="height: 1px; width: 1px; position: absolute; z-index: -999; opacity: 0;" />');
	var tinyUrl = $('#tinyUrl');
	tinyUrl.html('Tiny link: https://tinyurl.com/' + string);
	tinyUrl.attr('href', 'https://tinyurl.com/' + string);
}

function switchToMap() {
	//	$('[href="#map"]').tab('show');
	$('[href="#map"]').click();
}

function clearAdditionalElements() {
	ResetWindow_MapDesign();
	ResetWindow_MapTokens();
	ResetWindow_OLFigures();
	ResetWindow_Heroes();

//	clearHeroesSackAndSearchItems();
//	clearHeroesConditions();

	ResetWindow_Familiars();
}

function updateMapSize() {
	mapWidth = $('[name="map-width"]').val();
	mapHeight = $('[name="map-height"]').val();
}

function setMapSizeFromConfig() {
	$('[name="map-width"]').val(mapWidth);
	$('[name="map-height"]').val(mapHeight);
}

function toggleMapControls() {
	$('.map-transformation div').toggle();
}

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	var target = $(ev.target);
	dropToken(target, data);
}

function dropToken(target, data) {
	var container = target.parents('.select-row');
	var dataWithoutHeroNumber = data.substring(0, data.length - 1);
	target.after($('#' + data));
	container.find('.imagescontainer img').removeClass('has' + dataWithoutHeroNumber);
	target.addClass('has' + dataWithoutHeroNumber);
}


function LoadOneSubScripts(scriptFile) {
	$.getScript(scriptFile);
	var script = document.createElement("script");
	script.src = scriptFile;
	document.head.appendChild(script);
}
function LoadSubScripts() {
	LoadOneSubScripts("scripts/00MapControls.js");
	LoadOneSubScripts("scripts/01QuestObjectives.js");
	LoadOneSubScripts("scripts/02MapDesign.js");
	LoadOneSubScripts("scripts/10Tokens.js");
	LoadOneSubScripts("scripts/03OLFigures.js");
	LoadOneSubScripts("scripts/04Heroes.js");
	LoadOneSubScripts("scripts/08Familiers.js");
}



function InitializeAllWindows() {
	Initialize_MapControls();

	InitializeWindowFor_QuestObjectives();
	InitializeWindowFor_MapDesign();
	InitializeWindowFor_OLFigures();
	InitializeWindowFor_Heroes();
	InitializeWindowFor_MapTokens();
	InitializeWindowFor_Familiars();

	//Add expansion filters to all wanted Windows
	var expansionZoneHTML;
	expansionZoneHTML = Create_ExpansionList();

	var TempZoneToAdd;

	TempZoneToAdd = $('#map-controls');
	TempZoneToAdd.append(expansionZoneHTML.clone());

	TempZoneToAdd = $('#monsters');
	TempZoneToAdd.append(expansionZoneHTML.clone());

	for (var i = 1; i <= MAX_Heroes; i++) {
		//here heroes are split between many windows (1 per window)
		TempZoneToAdd = $('#hero' + i.toString());
		TempZoneToAdd.append(expansionZoneHTML.clone());
	}

	TempZoneToAdd = $('#familiars');
	TempZoneToAdd.append(expansionZoneHTML.clone());

}

$(function () {
	//	LoadSubScripts();

	InitializeAllWindows();


	// recover data / config
	if (window.location.hash != "") {
		//From URL
		config = recoverConfig(window.location.hash);
	} else {
		//From default config
		config = recoverConfig(defaultConfig);
	}
	constructSettingsFromConfig();
	constructMapFromConfig();
	drawGrid();
	setMapSizeFromConfig();

	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	$('.tab-pane').append($('<div class="close" onclick="switchToMap();">x</div>'));
	$('#map').click(function () {
		switchToMap();
	});
	$(document).keyup(function (e) {
		if (e.keyCode == 27) { // esc keycode
			switchToMap();
		}
	});
});

