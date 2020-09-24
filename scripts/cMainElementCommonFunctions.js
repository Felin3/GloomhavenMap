//functions to manage generic elements

//var tileLine = new LineClass('tile', 'tile', 'tiles', '');



function CreateZone(ElementName) {
	var ElementLine = window[ElementName + "Line"];
	var html = $('<div>');
	var container = $('<div>').addClass(ElementName + '-container');
	container.append('<h1>' + ElementLine.ZoneTitleTerm + '</h1>');
	html.append(container);

	if (eval("typeof " + ElementName + "_Pre_CreateZone === 'function'")) {
		html = window[ElementName + "_Pre_CreateZone"](html);
	}

	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine(\'' + ElementName + '\');">' + ElementLine.AddElementTerm + '</button>');
	//initialize LineClass
	ElementLine.NameListValues = CreateListValues(ElementName);

	if (eval("typeof " + ElementName + "_Post_CreateZone === 'function'")) {
		html = window[ElementName + "_Post_CreateZone"](html);
	}
	return html;
}

function GetZone(ElementName, DataToUpdate) {
	var ElementLine = window[ElementName + "Line"];
	var result = [];

	if (eval("typeof " + ElementName + "_Pre_GetZone === 'function'")) {
		result = window[ElementName + "_Pre_GetZone"](result);
	}

	var ElementRows = $('.' + ElementName + '-container .select-row');
	for (var i = 0; i < ElementRows.length; i++) {
		var container = $(ElementRows[i]);
		var OneElement = {};
		OneElement = ElementLine.GetOneLineData(container);
		result.push(OneElement);
	}

	if (eval("typeof " + ElementName + "_Post_GetZone === 'function'")) {
		result = window[ElementName + "_Post_GetZone"](result);
	}

	DataToUpdate[ElementName] = result;
	return DataToUpdate;
}

function FillZone(ElementName, NewData, FromPreFilledMaps) {
	var ElementLine = window[ElementName + "Line"];
	ResetZone(ElementName, FromPreFilledMaps);

	if (eval("typeof " + ElementName + "_Pre_FillZone === 'function'")) {
		window[ElementName + "_Pre_FillZone"](NewData, FromPreFilledMaps);
	}

	if (NewData[ElementName] != undefined) {
		if (ElementLine.UseExpantionFilter == true) {
			//update value if needed
			ElementLine.NameListValues = CreateListValues(ElementName);
		}

		for (var i = 0; i < NewData[ElementName].length; i++) {
			var XYBase = "1x1"
			if (cellType == "SQUARE") {
				var SingleID;
				SingleID = NewData[ElementName][i].id;
				if (ElementLine.elementName == "monster") {
					SingleID = recoverMonsterBaseName(SingleID);
				}
				XYBase = ElementLine.AllData[SingleID].width + 'x' + ElementLine.AllData[SingleID].height;
			}
			ElementLine.XYBase = XYBase;
			var html = ElementLine.AddOneLineWithData(NewData[ElementName][i]);
			$('.' + ElementName + '-container').append(html);
		}
	}

	if (eval("typeof " + ElementName + "_Post_FillZone === 'function'")) {
		window[ElementName + "_Post_FillZone"](NewData, FromPreFilledMaps);
	}
}

function ResetZone(ElementName, FromPreFilledMaps) {
	var ElementLine = window[ElementName + "Line"];

	if (eval("typeof " + ElementName + "_Pre_ResetZone === 'function'")) {
		 window[ElementName + "_Pre_ResetZone"](FromPreFilledMaps);
	}

	$('.' + ElementName + '-container .select-row').remove();

	if (eval("typeof " + ElementName + "_Post_ResetZone === 'function'")) {
		window[ElementName + "_Post_ResetZone"](FromPreFilledMaps);
	}
}

function AddLine(ElementName) {
	var ElementLine = window[ElementName + "Line"];

	var XYBase = "1x1"
	if (cellType == "SQUARE") {
		var SingleID;
		SingleID = NewData[ElementName][i].id;
		if (ElementLine.elementName == "monster") {
			SingleID = recoverMonsterBaseName(SingleID);
		}
		XYBase = ElementLine.AllData[SingleID].width + 'x' + ElementLine.AllData[SingleID].height;
	}
	ElementLine.XYBase = XYBase;
	var html = ElementLine.AddOneEmptyLine();

	if (eval("typeof " + ElementName + "_Pre_AddLine === 'function'")) {
		html = window[ElementName + "_Pre_AddLine"](html);
	}

	$('.' + ElementName + '-container').append(html);

	if (eval("typeof " + ElementName + "_Post_AddLine === 'function'")) {
		html = window[ElementName + "_Post_AddLine"](html);
	}
	return html;
}

function CreateListValues(ElementName) {
	var ElementLine = window[ElementName + "Line"];
	var html = "";

	if (eval("typeof " + ElementName + "_Pre_CreateListValues === 'function'")) {
		html = window[ElementName + "_Pre_CreateListValues"](html);
	}

	html += addOption('Clear', '', 'UnSet("' + ElementName + '", this);');
	var DataToDisplay;
	if (ElementLine.UseExpantionFilter == true) {
		DataToDisplay = filterByExpansion(ElementLine.AllData);
	}
	else {
		DataToDisplay = ElementLine.AllData;
	}

	Object.entries(DataToDisplay).sort(dynamicSort("order")).forEach(item => {
		html += addOption(item[1].title + ' ', '', 'Set(\'' + ElementName + '\', this, \'' + item[0] + '\')');
	});

	if (eval("typeof " + ElementName + "_Post_CreateListValues === 'function'")) {
		html = window[ElementName + "_Post_CreateListValues"](html);
	}
	return html;
}

function Set(ElementName, element, value) {
	var ElementLine = window[ElementName + "Line"];

	if (eval("typeof " + ElementName + "_Pre_Set === 'function'")) {
		window[ElementName + "_Pre_Set"](element, value);
	}

	var XYBase = "1x1"
	if (cellType == "SQUARE") {
		var SingleID;
		SingleID = NewData[ElementName][i].id;
		if (ElementLine.elementName == "monster") {
			SingleID = recoverMonsterBaseName(SingleID);
		}
		XYBase = ElementLine.AllData[SingleID].width + 'x' + ElementLine.AllData[SingleID].height;
	}
	ElementLine.XYBase = XYBase;
	var container = $(element).parents('.select-row');
	ElementLine.Set_MainElement(container, value);

	if (eval("typeof " + ElementName + "_Post_Set === 'function'")) {
		window[ElementName + "_Post_Set"](element, value);
	}
}

function UnSet(ElementName, element) {
	var ElementLine = window[ElementName + "Line"];

	if (eval("typeof " + ElementName + "_Pre_UnSet === 'function'")) {
		window[ElementName + "_Pre_UnSet"](element);
	}

	var container = $(element).parents('.select-row');
	ElementLine.UnSet_MainElement(container);

	if (eval("typeof " + ElementName + "_Post_UnSet === 'function'")) {
		window[ElementName + "_Post_UnSet"](element);
	}
}

function UpdateAllSelectcLists(ElementName) {
	var ElementLine = window[ElementName + "Line"];

	if (eval("typeof " + ElementName + "_Pre_UpdateAllSelectcLists === 'function'")) {
		window[ElementName + "_Pre_UpdateAllSelectcLists"]();
	}

	if (ElementLine.UseExpantionFilter == true) {
		//update value if needed
		ElementLine.NameListValues = CreateListValues(ElementName);
	}

	var AllSelects = $(".btn-group.select-" + ElementLine.elementID);
	for (var i = 0; i < AllSelects.length; i++) {
		var AllLI = $(AllSelects[i]).find("li");
		AllLI.remove();
		var UlElement = $(AllSelects[i]).find("ul");
		UlElement.append(ElementLine.NameListValues)
	}


	//html += addOption('Clear', '', 'UnSet("' + ElementName + '", this);');
	//var DataToDisplay;
	//if (ElementLine.UseExpantionFilter == true) {
	//	DataToDisplay = filterByExpansion(ElementLine.AllData);
	//}
	//else {
	//	DataToDisplay = ElementLine.AllData;
	//}
	//Object.keys(DataToDisplay).forEach(item => {
	//	html += addOption(DataToDisplay[item].title + ' ', '', 'Set(\'' + ElementName + '\', this, \'' + item + '\')');
	//});

	//if (eval("typeof " + ElementName + "_Post_UpdateAllSelectcLists === 'function'")) {
	//	window[ElementName + "_Post_UpdateAllSelectcLists"]();
	//}
	//return html;
}
