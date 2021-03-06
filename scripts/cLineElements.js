function LineClass(elementName, elementID, elementStorageName, RemoveCallBack) {
	//global parameters (the same for every MainElement)
	this.ZoneTitleTerm = "";
	this.AddElementTerm = "";
	this.elementName = elementName;
	this.elementID = folderize(elementID).toLowerCase();
	this.elementStorageName = elementStorageName;
	this.NameListValues;
	this.AllData;
	this.needSideList = false;
	this.needCoordinates = false;
	this.needAngleList = false;
	this.needOpenedCheckbox = false;

	//Custom Inputs
	this.needCustomInput = [];			//will include array [Used (true/false),using Add Button (true/false)]
	for (i = 0; i < MAX_CustomInputs; i++) {
		this.needCustomInput[i] = [false, false];
	}

	this.needArchetypeList = false;
	this.needClassList = false;
	this.UsesMainCommonImages = false;
	this.MainCommonImageContainer = "";
	this.TokenCommonImageContainer = "";
	this.RelicCommonImageContainer = "";
	this.needAddTokenButton = false;
	this.needAddRelicButton = false;
	this.needAddAuraButton = false;
	this.needRemoveButton = false;

	this.MainCardsPath = "";
	this.MainMapTokensPath = "";
	this.UsesExpansionPath = false;
	this.DisplayExpansionNameInSelect = false;
	this.UseExpantionFilter = false;

	this.CallBackOnRemove = RemoveCallBack;		// -> should have a value if needRemoveButton = true

	//specific parameters (could be different from line to line for the same MainElement)
	this.XYBase = "1x1";						// -> should have a value if needCoordinates = true

	//MapData
	this.mapData = {};
	this.mapData.Layer = "map";		//map / figures / ...
	this.mapData.zIndex = "NA";		//using string type
	for (i = 0; i < MAX_CustomInputs; i++) {
		this.mapData['DisplayCI' + i] = false;
		this.mapData['SpecificClassZeroCI' + i] = '';
	}

	this.CardsPath = function (ExtensionPath) {
		var FullPath = "";
		if (this.UsesExpansionPath == true) {
			//if used add Enpantion Path provided
			FullPath = FullPath + ExtensionPath;
		}
		//add main Path
		FullPath = FullPath + this.MainCardsPath + "/";
		return FullPath;
	};
	this.MapTokensPath = function (ExtensionPath) {
		var FullPath = "";
		if (this.UsesExpansionPath == true) {
			//if used add Enpantion Path provided
			FullPath = FullPath + ExtensionPath;
		}
		//add main Path
		FullPath = FullPath + this.MainMapTokensPath + "/";
		return FullPath;
	};

	this.AddOneEmptyLine = function () {
		var lineHTML = $('<div>');
		lineHTML.addClass('select-row');

		if (this.UsesMainCommonImages == true) {
			lineHTML.append('<div class="Row-cards"></div>');
		}
		if (this.needAddRelicButton == true && this.RelicCommonImageContainer == "") {
			lineHTML.append('<div class="Row-relicscards"></div>');
		}
		if (this.needAddTokenButton == true && this.TokenCommonImageContainer == "") {
			lineHTML.append('<div class="Row-tokenscards"></div>');
		}
		lineHTML.append('<div style="clear:both"></div>');

		var AdditionalCallBacks = "";		//Mainly for Images Updates
		if (this.needRemoveButton == true) {
			if (this.needAddTokenButton == true && this.TokenCommonImageContainer != "") {
				AdditionalCallBacks = AdditionalCallBacks + "Update_TokenImages(this.parentElement);";
			}
			if (this.needAddRelicButton == true && this.RelicCommonImageContainer != "") {
				AdditionalCallBacks = AdditionalCallBacks + "Update_RelicImages(this.parentElement);";
			}
		}

		lineHTML.append(this.Create_InnerMainElementList(this.elementName, this.elementID, this.NameListValues, this.needRemoveButton, AdditionalCallBacks, RemoveCallBack));

		if (this.needSideList == true) {
			lineHTML.append(Create_SideList());
		}
		if (this.needCoordinates == true) {
			lineHTML.append(Create_CoordinatesSystem(this.XYBase));
		}
		if (this.needOpenedCheckbox == true) {
			lineHTML.append(Create_OpenCheckbox());
		}
		if (this.needAngleList == true) {
			lineHTML.append(Create_AngleList());
		}
		for (i = 0; i < MAX_CustomInputs; i++) {
			if (this.needCustomInput[i][0] == true) {
				if (this.needCustomInput[i][1] == true) {
					lineHTML.append(Create_CustomInputButton(i));
				}
				else {
					lineHTML.append(Create_CustomInput(i));
				}
			}
		}
		if (this.needArchetypeList == true) {
		}
		if (this.needClassList == true) {
		}
		if (this.needAddTokenButton == true) {
			lineHTML.append(Create_TokenButton(this.TokenCommonImageContainer));
		}
		if (this.needAddRelicButton == true) {
			lineHTML.append(Create_RelicButton(this.RelicCommonImageContainer));
		}
		if (this.needAddAuraButton == true) {
			lineHTML.append(Create_AuraButton());
		}
		return lineHTML;
	};
	this.Set_MainElement = function (RowElement, NewValue) {
		this.Set_InnerMainElement(RowElement, this.elementID, NewValue);
		if (this.needCoordinates == true) {
			Update_XY(RowElement, this.XYBase)
		}
	};
	this.UnSet_MainElement = function (RowElement) {
		this.UnSet_InnerMainElement(RowElement, this.elementName, this.elementID);
		if (this.needCoordinates == true) {
			UnSet_X(RowElement);
			UnSet_Y(RowElement);
		}
	};
	this.AddOneLineWithData = function (NewData) {
		var lineHTMLwithData = this.AddOneEmptyLine();

		this.Set_InnerMainElement(lineHTMLwithData, this.elementID, NewData.id);
		if (this.needSideList == true) {
			Set_Side(lineHTMLwithData, NewData.side);
		}
		if (this.needCoordinates == true) {
			Update_XY(lineHTMLwithData, this.XYBase)
			Set_Coordinates(lineHTMLwithData, NewData);
		}
		if (this.needOpenedCheckbox == true) {
			Set_OpenCheckbox(lineHTMLwithData, NewData.opened);
		}
		if (this.needAngleList == true) {
			Set_Angle(lineHTMLwithData, NewData.angle);
		}
		for (i = 0; i < MAX_CustomInputs; i++) {
			if (this.needCustomInput[i][0] == true) {
				if (NewData.ci != undefined && NewData.ci.length > i && NewData.ci[i] != undefined) {
					Set_CustomInput(i, this.needCustomInput[i][1], lineHTMLwithData, NewData.ci[i]);
				}
			}
		}
		if (this.needArchetypeList == true) {
		}
		if (this.needClassList == true) {
		}
		if (this.needAddTokenButton == true) {
			Set_Tokens(lineHTMLwithData, NewData.conditions);
		}
		if (this.needAddRelicButton == true) {
			Set_Relics(lineHTMLwithData, NewData.relics);
		}
		if (this.needAddAuraButton == true) {
			//for compatibility with old versions
			if (NewData.auras != undefined) {
				Set_Auras(lineHTMLwithData, NewData.auras);
			}
		}
		if (this.needRemoveButton == true) {
		}
		return lineHTMLwithData;
	};
	this.GetOneLineData = function (RowElement) {
		var LineData = {};

		LineData.id = this.Get_InnerMainElement(RowElement);
		if (this.needSideList == true) {
			LineData.side = Get_Side(RowElement);
		}
		if (this.needCoordinates == true) {
			var Coordinates = Get_Coordinates(RowElement);
			LineData.direction = Coordinates.direction;
			LineData.x = Coordinates.x;
			LineData.y = Coordinates.y;
		}
		if (this.needOpenedCheckbox == true) {
			LineData.opened = Get_OpenCheckbox(RowElement);
		}
		if (this.needAngleList == true) {
			LineData.angle = Get_Angle(RowElement);
		}
		LineData.ci = [];
		for (i = 0; i < MAX_CustomInputs; i++) {
			if (this.needCustomInput[i][0] == true) {
				LineData.ci[i] = Get_CustomInput(i, RowElement);
			}
		}
		if (this.needArchetypeList == true) {
		}
		if (this.needClassList == true) {
		}
		if (this.needAddTokenButton == true) {
			LineData.conditions = Get_Tokens(RowElement);
		}
		if (this.needAddRelicButton == true) {
			LineData.relics = Get_Relics(RowElement);
		}
		if (this.needAddAuraButton == true) {
			LineData.auras = Get_Auras(RowElement);
		}
		if (this.needRemoveButton == true) {
		}
		//if (this.UsesExpansionPath == true) {
		//	LineData.expansion = 
		//}
		return LineData;
	};

	// Main Element
	this.Create_InnerMainElementList = function (elementTitle, elementID, MainElementListValues, needRemoveButton, AdditionalCallBacks, RemoveCallBack) {
		var html = createInputSelect('Select ' + elementTitle, elementID + '-title', 'select-' + elementID);

		if (needRemoveButton == true) {
			var removeButton = $('<a class="boxclose" id="boxclose" onclick="RemoveOneRow(this);' + AdditionalCallBacks + RemoveCallBack + '"></a>');
			html.find('.btn').prepend(removeButton);
		}

		html.find('ul').append(MainElementListValues);
		html.append($('<input type="hidden" name="MainElement-Value" class="MainElement-Value" value=""/>'));
		html.append($('<input type="hidden" name="MainElement-ID" class="MainElement-ID" value="' + elementID + '"/>'));
		return html;
	}

	this.Get_InnerMainElement = function (RowElement) {
		return RowElement.find('.MainElement-Value').val();
	}

	this.Set_InnerMainElement = function (RowElement, elementID, NewValue) {
		if (NewValue == 0) {
			return false;
		}

		var NewTitle = "";
		if (this.elementID == "monsters") {
			var MonsterBaseID = recoverMonsterBaseName(NewValue);
			var MonsterSuffit = NewValue.replace(MonsterBaseID, '');
			NewTitle = this.AllData[MonsterBaseID].title + ' ' + MonsterSuffit;
		}
		else {
			NewTitle = this.AllData[NewValue].title + ' ';
		}

		RowElement.find('.' + elementID + '-title').html(NewTitle);
		RowElement.find('.MainElement-Value').attr('value', NewValue);
	}

	this.UnSet_InnerMainElement = function (RowElement, elementTitle, elementID) {
		RowElement.find('.' + elementID + '-title').html('Select ' + elementTitle);
		RowElement.find('.MainElement-Value').attr('value', '');
	}
}


function RemoveOneRow(element) {
	$(element).parents('.select-row').remove();
}

function UpdateLineLists(element) {
	$(element).parents('.select-row').remove();
}









// Side Element
function Create_SideList() {
	var html = createInputSelect('Select side', 'Side-Title', 'select-side');
	html.find('ul').append(addOption('Clear', '', 'UnSet_Side(this,\'\');'));
	html.find('ul').append(addOption('A' + ' ', '', 'Set_Side(this, \'' + 'A' + '\');'));
	html.find('ul').append(addOption('B' + ' ', '', 'Set_Side(this, \'' + 'B' + '\');'));
	html.append($('<input type="hidden" name="Side-Value" class="Side-Value" value=""/>'));
	return html;
}

function Set_Side(element, value) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Side-Title').html(value + ' ');
	container.find('.Side-Value').attr('value', value);
}

function Get_Side(RowElement) {
	return RowElement.find('.Side-Value').val();
}

function UnSet_Side(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Side-Title').html('Select side ');
	container.find('.Side-Value').attr('value', '');
}

// Coordinates
// Has it's own File -> cCoordinatesElements.js


// Open Check Box
function Create_OpenCheckbox(elementTitle) {
	var html = $('<div>').addClass('checkbox').addClass('door-opened');
	var checkboxContent = $('<label>');
	checkboxContent.append($('<input>').attr('type', 'checkbox').attr('name', 'opened'));
	checkboxContent.append('opened');
	html.append(checkboxContent);
	return html;
}

function Get_OpenCheckbox(RowElement) {
	return RowElement.find('[name="opened"]').prop('checked');
}

function Set_OpenCheckbox(RowElement, value) {
	RowElement.find('[name="opened"]').prop('checked', value);
}

// Angle Element
function Create_AngleList(elementTitle) {
	var html = createInputSelect('Select angle', 'Angle-Title', 'select-angle');
	html.find('ul').append(addOption('Clear', '', 'UnSet_Angle(this,\'\');'));
	for (var i = 0; i < ANGLES_LIST.length; i++) {
		html.find('ul').append(addOption(ANGLES_LIST[i] + ' ', '', 'Set_Angle(this, \'' + ANGLES_LIST[i] + '\');'));
	}
	html.append($('<input type="hidden" name="Angle-Value" class="Angle-Value" value=""/>'));
	return html;
}

function Set_Angle(element, value) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Angle-Title').html(value + ' ');
	container.find('.Angle-Value').attr('value', value);
}

function UnSet_Angle(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Angle-Title').html('Select angle ');
	container.find('.Angle-Value').attr('value', '');
}

function Get_Angle(RowElement) {
	return RowElement.find('.Angle-Value').val();
}


// Custom Input x -> cf constants for definition
function Create_CustomInputButton(nb) {
	var html = $('<div>');
	html.addClass('ci' + nb + '-container');
	html.addClass('btn-group');
	html.append($('<button type="button" class="btn btn-warning CI' + nb + 'Button" aria-expanded="false" onclick="Add_CustomInput(' + nb + ',this);">' + CustomInput_ButtonTexts[nb] + '</button>'));
	return html;
}

function Add_CustomInput(nb, ButtonElement) {
	var CustomInputText = $('<input type="text" name="CI' + nb + '-Value" class="form-control CI' + nb + '-Value" placeholder="' + CustomInput_SetTexts[nb] + '" value=""/>');
	var removeButton = $('<a class="boxcloseinput CI' + nb + '-remove" id="boxcloseinput" onclick="Remove_CustomInput(' + nb + ',this)"></a>');

	var buttonObject = $(ButtonElement);
	buttonObject.before(CustomInputText);
	buttonObject.before(removeButton);
	buttonObject.hide();
	return CustomInputText;
}

function Remove_CustomInput(nb, element) {
	var container = $(element).parents('.select-row');
	var CustomInputText = $(container).find('.CI' + nb + '-Value');
	CustomInputText.remove();
	var removeButton = $(container).find('.CI' + nb + '-remove');
	removeButton.remove();
	var buttonObject = $(container).find('.CI' + nb + 'Button');
	buttonObject.show();
}

function Create_CustomInput(nb, elementTitle) {
	var html = $('<input type="text" name="CI' + nb + '-Value" class="form-control CI' + nb + '-Value" placeholder="' + CustomInput_SetTexts[nb] + '" value=""/>');
	return html;
}

function Set_CustomInput(nb, UsingButton, element, value) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	if (UsingButton == true) {
		var Button = $(container.find('.CI' + nb + 'Button'))
		CustomInputText = Add_CustomInput(nb, $(Button))
		CustomInputText.attr('value', value);
	}
	else {
		container.find('.CI' + nb + '-Value').attr('value', value);
	}
}

function UnSet_CustomInput(nb, element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.CI' + nb + '-Value').attr('value', '');
}

function Get_CustomInput(nb, RowElement) {
	return RowElement.find('.CI' + nb + '-Value').val();
}

// Archetype Element

// Class Element

// Token Element
function Create_TokenButton(TokenImageContainer) {
	var html = $('<div>');
	html.addClass('tokens-container');
	html.addClass('btn-group');
	html.append('<input type="hidden" name="TokenImageContainer" value="' + TokenImageContainer + '"/>');
	html.append($('<button type="button" class="btn btn-warning TokenButton" aria-expanded="false" onclick="Add_OneEmptyToken(this);">Add token</button>'));
	return html;
}

function Add_OneEmptyToken(ButtonElement) {
	var condition = $(createInputSelect('Select token', 'Token-Title', 'select-token')).attr('id', conditionNumber.toString());

	var removeButton = $('<a class="boxclose" id="boxclose" onclick="Remove_OneToken(this)"></a>');
	condition.find('.btn').prepend(removeButton);


	condition.find('ul').append(Create_TokenList());
	var buttonObject = $(ButtonElement);
	buttonObject.before(condition);
	buttonObject.before('<input type="hidden" name="Token-Value" class="Token-Value Token' + conditionNumber.toString() + '" value=""/>');
	conditionNumber += 1;
	return condition;
}

function Create_TokenList() {
	var html = ""; //addOption('Remove token', '', 'Remove_OneToken(this);');
	var switched = CONDITIONS[CONDITIONS_LIST[0]].hasConditionCard;
	for (var i = 0; i < CONDITIONS_LIST.length; i++) {
		if (switched != CONDITIONS[CONDITIONS_LIST[i]].hasConditionCard) {
			switched = CONDITIONS[CONDITIONS_LIST[i]].hasConditionCard;
			html += '<li role="separator" class="divider"></li>';
		}
		html += addOption(CONDITIONS_LIST[i] + ' ', '', 'Set_Token(this, \'' + CONDITIONS_LIST[i] + '\')');
	}
	return html;
}

function Remove_OneToken(element) {
	var container = $(element).parents('.select-row');
	var conditionSelect = $(element).parents('.select-token');
	var id = conditionSelect.attr('id');
	conditionSelect.remove();
	$('.Token' + id).remove();
	Update_TokenImages(container);
	//if (container.parents('#monsters').length > 0) {
	//	adjustMonsterList();
	//} else {
	//	container.find('.conditions-container').html('');
	//	addConditions(getConditions(container), conditionsContainer);
	//}
}

function Set_Token(element, value) {
	var TokenContainer;
	if ($(element).hasClass('select-token')) {
		TokenContainer = element
	}
	else {
		TokenContainer = $(element).parents('.select-token');
	}
	var id = TokenContainer.attr('id');
	$(TokenContainer).parents('.tokens-container').find('.Token' + id).attr('value', value);
	TokenContainer.find('.Token-Title').html(value + ' ');
	//Add_TokenImage($(TokenContainer).parents('.select-row'), value);
	Update_TokenImages($(TokenContainer).parents('.select-row'));
	//if (container.parents('#monsters').length > 0) {
	//	adjustMonsterList();
	//} else {
	//	container.find('.conditions-container').html('');
	//	addConditions(getConditions(container), conditionsContainer);
	//}
}

function Set_Tokens(RowElement, ConfigData) {
	var Button = $(RowElement.find('.TokenButton'))
	for (var OneToken in ConfigData) {
		var NbSameToken = 1;
		if (CONDITIONS[OneToken].canApplyMultipleTimes && ConfigData[OneToken] != undefined) {
			NbSameToken = ConfigData[OneToken];
		}
		for (var i = 0; i < NbSameToken; i++) {
			OneTokenItem = Add_OneEmptyToken(Button);
			Set_Token(OneTokenItem, OneToken);
		}
	}
	Update_TokenImages(RowElement);
}

function Reset_TokenImages(RowElement) {
	var TokenImageContainer;
	var ContainerName = RowElement.find('input[name="TokenImageContainer"]').val();
	if (ContainerName == "") {
		TokenImageContainer = $(RowElement.find('.Row-tokenscards'));
	}
	else {
		TokenImageContainer = $('.' + ContainerName);
	}
	TokenImageContainer.find('img').remove()
}

function Update_TokenImages(RowElement) {
	var TokenImageContainer;
	RowElement = $(RowElement);
	var ContainerName = RowElement.find('input[name="TokenImageContainer"]').val();
	var TokenList;
	if (ContainerName == "") {
		TokenImageContainer = $(RowElement.find('.Row-tokenscards'));
		TokenList = RowElement.find('.Token-Value');
	}
	else {
		TokenImageContainer = $('.' + ContainerName);
		TokenList = $('.' + RowElement.find('.MainElement-ID').val() + '-container').find('.Token-Value');
	}
	Reset_TokenImages(RowElement);
	for (var i = 0; i < TokenList.length; i++) {
		var OneTokenValue = $(TokenList[i]).attr('value');
		Add_TokenImage(TokenImageContainer, OneTokenValue);
	}
}

function Add_TokenImage(TokenImageContainer, NewValue) {
	//var TokenImageContainer;
	//var ContainerName = RowElement.find('input[name="TokenImageContainer"]').val();
	//if (ContainerName == "") {
	//	TokenImageContainer = $(RowElement.find('.Row-tokenscards'));
	//}
	//else {
	//	TokenImageContainer = $('.'+ContainerName);
	//}
	if (NewValue != undefined && NewValue != '' && CONDITIONS[NewValue].hasConditionCard) {
		if (TokenImageContainer.find('.' + urlize('c' + NewValue)).length == 0) {
			var TokenImage = $('<img>');
			TokenImage.attr('src', ImagePathRoot + ImagePathConditionImage + urlize(NewValue) + '.png').addClass('condition').addClass(urlize('c' + NewValue));
			TokenImageContainer.append(TokenImage);
		}
	}
}

function Get_Tokens(RowElement) {
	var conditions = $(RowElement).find('.Token-Value');
	var conditionsObject = {};
	for (var i = 0; i < conditions.length; i++) {
		var condition = $(conditions[i]).val();
		if (conditionsObject[condition] == undefined) {
			conditionsObject[condition] = 1;
		} else {
			conditionsObject[condition] += 1;
		}
	}
	return conditionsObject;
}

// Relic Element
function Create_RelicButton(RelicImageContainer) {
	var html = $('<div>');
	html.addClass('relics-container');
	html.addClass('btn-group');
	html.append('<input type="hidden" name="RelicImageContainer" value="' + RelicImageContainer + '"/>');
	html.append($('<button type="button" class="btn btn-info RelicButton" aria-expanded="false" onclick="Add_OneEmptyRelic(this);">Add relic</button>'));
	return html;
}

function Add_OneEmptyRelic(ButtonElement) {
	var relic = $(createInputSelect('Select relic', 'Relic-Title', 'select-relic')).attr('id', relicNumber.toString());

	var removeButton = $('<a class="boxclose" id="boxclose" onclick="Remove_OneRelic(this)"></a>');
	relic.find('.btn').prepend(removeButton);

	relic.find('ul').append(Create_RelicList());
	var buttonObject = $(ButtonElement);
	buttonObject.before(relic);
	buttonObject.before('<input type="hidden" name="Relic-Value" class="Relic-Value Relic' + relicNumber.toString() + '" value=""/>');
	relicNumber += 1;
	return relic;
}

function Create_RelicList() {
	var html = ""; //addOption('Remove relic', '', 'Remove_OneRelic(this);');
	for (var i = 0; i < OVERLORD_RELICS_LIST.length; i++) {
		html += addOption(OVERLORD_RELICS_LIST[i] + ' ', '', 'Set_Relic(this, \'' + OVERLORD_RELICS_LIST[i] + '\')');
	}
	return html;
}

function Remove_OneRelic(element) {
	var container = $(element).parents('.select-row');
	var relicSelect = $(element).parents('.select-relic');
	var id = relicSelect.attr('id');
	relicSelect.remove();
	$('.Relic' + id).remove();
	Update_RelicImages(container);
}

function Set_Relic(element, value) {
	var RelicContainer;
	if ($(element).hasClass('select-relic')) {
		RelicContainer = element
	}
	else {
		RelicContainer = $(element).parents('.select-relic');
	}
	var id = RelicContainer.attr('id');
	$(RelicContainer).parents('.relics-container').find('.Relic' + id).attr('value', value);
	RelicContainer.find('.Relic-Title').html(value + ' ');
	//Add_RelicImage($(RelicContainer).parents('.select-row'), value);
	Update_RelicImages($(RelicContainer).parents('.select-row'));
}

function Set_Relics(RowElement, ConfigData) {
	var Button = $(RowElement.find('.RelicButton'))
	for (var OneRelic in ConfigData) {
		OneRelicItem = Add_OneEmptyRelic(Button);
		Set_Relic(OneRelicItem, OneRelic);
	}
	Update_RelicImages(RowElement);
}

function Reset_RelicImages(RowElement) {
	var RelicImageContainer = $('.' + ContainerName);
	var ContainerName = RowElement.find('input[name="RelicImageContainer"]').val();
	if (ContainerName == "") {
		RelicImageContainer = $(RowElement.find('.Row-relicscards'));
	}
	else {
		RelicImageContainer = $('.' + ContainerName);
	}
	RelicImageContainer.find('img').remove()
}

function Add_RelicImage(RowElement, NewValue) {
	var RelicImageContainer;
	var ContainerName = RowElement.find('input[name="RelicImageContainer"]').val();
	if (ContainerName == "") {
		RelicImageContainer = $(RowElement.find('.Row-relicscards'));
	}
	else {
		RelicImageContainer = $('.' + ContainerName);
	}
	if (NewValue != undefined && NewValue != '') {
		if (RelicImageContainer.find('.' + urlize(NewValue)).length == 0) {
			var RelicImage = $('<img>');
			RelicImage.attr('src', 'images/items_cards/relic/overlord/' + urlize(NewValue) + '.png').addClass('relic').addClass(urlize(NewValue));
			RelicImageContainer.append(RelicImage);
		}
	}
}

function Update_RelicImages(RowElement) {
	var RelicImageContainer;
	RowElement = $(RowElement);
	var ContainerName = RowElement.find('input[name="RelicImageContainer"]').val();
	var RelicList;
	if (ContainerName == "") {
		RelicImageContainer = $(RowElement.find('.Row-relicscards'));
		RelicList = RowElement.find('.Relic-Value');
	}
	else {
		RelicImageContainer = $('.' + ContainerName);
		RelicList = $('.' + RowElement.find('.MainElement-ID').val() + '-container').find('.Relic-Value');
	}
	Reset_RelicImages(RowElement);
	for (var i = 0; i < RelicList.length; i++) {
		var OneRelicValue = $(RelicList[i]).attr('value');
		Add_RelicImage(RowElement, OneRelicValue);
	}
}

function Get_Relics(RowElement) {
	var relics = $(RowElement).find('.Relic-Value');
	var relicsObject = {};
	for (var i = 0; i < relics.length; i++) {
		var relic = $(relics[i]).val();
		if (relicsObject[relic] == undefined) {
			relicsObject[relic] = 1;
		} else {
			relicsObject[relic] += 1;
		}
	}
	return relicsObject;
}

// Aura Element
function Create_AuraButton(elementTitle) {
	var html = $('<div>');
	html.addClass('auras-container');
	html.addClass('btn-group');
	html.append($('<button type="button" class="btn btn-success AuraButton" aria-expanded="false" onclick="Add_OneEmptyAura(this);">Add aura</button>'));
	return html;
}

function Add_OneEmptyAura(ButtonElement, DefaultColor) {
	var buttonObject = $(ButtonElement);

	var aura = $('<div>').addClass('aura').addClass('btn-group').attr('id', auraNumber.toString());

	if (DefaultColor == undefined) {
		DefaultColor = "";
	}
	var SpectrumInput = $('<input type="text" id="full' + auraNumber.toString() + '" value="' + DefaultColor + '" />');
	aura.append(SpectrumInput);

	buttonObject.before(aura);
	buttonObject.before('<input type="hidden" name="Aura-Value" class="Aura-Value Aura' + auraNumber.toString() + '" value=""/>');

	InitializeSpectrum(SpectrumInput, auraNumber.toString());
	CustomizeSpectrum(SpectrumInput, auraNumber.toString());

	auraNumber += 1;
	return aura;
}

function Create_AuraList() {
	var html = ""; //addOption('Remove aura', '', 'Remove_OneAura(this);');
	for (var i = 0; i < 15; i++) {
		html += addOption(i + ' ', '', 'Set_Aura(this, \'' + i + '\')');
	}
	return html;
}

function CustomizeSpectrum(StartElement, elementNb) {
	var removeButton = $('<a class="boxclose" id="boxclose" onclick="Remove_OneAura(this)"></a>');
	StartElement.parent().find(".sp-replacer.full" + elementNb + "-spectrum").addClass('btn').addClass('btn-default');
	StartElement.parent().find(".sp-replacer.full" + elementNb + "-spectrum").prepend(removeButton);

	var aura = $(createInputSelect('Select aura radius', 'Aura-Title NoSTOP', 'select-aura')).attr('id', elementNb);
	aura.find('ul').append(Create_AuraList());
	aura.find('ul').find('a').addClass('NoSTOP');
	aura.find('button').addClass('NoSTOP');
	var RadiusZone = $('<div>');
	RadiusZone.append(aura);
	StartElement.parent().find(".sp-container.full" + elementNb + "-spectrum").find(".sp-palette-container").prepend(RadiusZone);
}

function Remove_OneAura(element) {
	var oneAuraZone = $(element).parents('.aura');
	var id = oneAuraZone.attr('id');
	oneAuraZone.remove();
	$('.Aura' + id).remove();
}


function Set_Aura(element, value) {
	var container;
	if ($(element).hasClass('select-aura')) {
		container = element
	}
	else {
		if ($(element).is('.aura.btn-group')) {
			container = element
		}
		else {
			container = $(element).parents('.aura.btn-group');
		}
	}
	var id = container.attr('id');
	$(container).parents('.auras-container').find('.Aura' + id).attr('value', value);
	container.find('.Aura-Title').html(value + ' ');
	//for display on color selector
	var Preview = $(container).parents('.auras-container').find('.sp-replacer.full' + id + '-spectrum').find('.sp-preview-inner');
	Preview.html(value);
}

function Set_Auras(RowElement, ConfigData) {
	var Button = $(RowElement.find('.AuraButton'))
	for (var i = 0; i < ConfigData.length; i++) {
		var OneAura = ConfigData[i]
		OneAuraItem = Add_OneEmptyAura(Button, OneAura.color);
		Set_Aura(OneAuraItem, OneAura.radius);
	}
}

function UnSet_Aura(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Angle-Title').html('Select angle ');
	container.find('.Angle-Value').attr('value', '');
}

function Get_Auras(RowElement) {
	var aurasValues = $(RowElement).find('.Aura-Value');
	var aurasColors = $(RowElement).find('.sp-preview-inner');
	var result = [];
	for (var i = 0; i < aurasValues.length; i++) {
		var oneAura = {};
		oneAura.radius = $(aurasValues[i]).val();
		oneAura.color = $(aurasColors[i]).css('background-color');
		result.push(oneAura);
	}
	return result;
}

//    color: black;
//    background: rgba(255, 0, 0, .2);




