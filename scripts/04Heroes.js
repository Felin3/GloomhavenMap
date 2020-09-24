function InitializeWindowFor_Heroes() {
	for (var i = 1; i <= MAX_Heroes; i++) {
		//here heroes are split between many windows (1 per window)
		InitializeWindowFor_OneHero(i);
	}
}

function UpdateWindow_Heroes() {
	//after Act Set
	//Update_MonsterImages(RowElement);
	//Update_MonsterImages();
}

function GetWindow_Heroes(DataToUpdate) {
	DataToUpdate = GetZone_Heroes(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_Heroes(NewData, FromPreFilledMaps) {
	//Fill_ActButton(); -> Common not Filled Here
	FillZone_Heroes(NewData, FromPreFilledMaps);
}

function ResetWindow_Heroes(FromPreFilledMaps) {
	for (var i = 1; i <= MAX_Heroes; i++) {
		ResetWindow_OneHero(i, FromPreFilledMaps);
	}
}

//one Hero
function InitializeWindowFor_OneHero(HeroNumber) {
	//one hero per window
	var html = $('#hero' + HeroNumber.toString());

	//one Hero zone
	html.append(CreateZone_Heroes(HeroNumber));
}

function ResetWindow_OneHero(HeroNumber, FromPreFilledMaps) {
	ResetZone_Heroes(HeroNumber, FromPreFilledMaps);
}

//Hero zone
function CreateZone_Heroes(HeroNumber) {
	var html = $('<div>');
	//using two classes ??!!
	//the second one used only for conditions
	html.addClass('heroes-container').addClass('hero' + HeroNumber.toString() + '-container');
	//initialize LineClass
	heroLine.NameListValues = Create_HeroListValues();
	//not the best thing to do 
	// using specific Element ID and
	// using common image container for specific hero .. but using number
	heroLine.elementID = "hero" + HeroNumber.toString()

	heroLine.TokenCommonImageContainer = "hero" + HeroNumber.toString() + "-conditions-container";
	html.append(AddLine_Hero());

	//add specific Zones
	html.append($('<div>').addClass('hero' + HeroNumber.toString() + '-conditions-container').addClass('conditions-container'));
	html.append(CreateZone_HeroIamge())

	//Items
//	html.append('<div style="clear:both"></div>');
//	html.append(CreateZone_HeroItems())
	//sacks
	//skills

	return html;
}

function GetZone_Heroes(DataToUpdate) {
	var result = [];
	var heroes = $('.heroes-container .select-row');
	for (var i = 0; i < heroes.length; i++) {
		var container = $(heroes[i]);
		var hero = {};
		hero = heroLine.GetOneLineData(container);
		//add specific Zones
		//GetZone_HeroSkills(container, hero);
		result.push(hero);
	}
	DataToUpdate.heroes = result;
	return DataToUpdate;
}

function FillZone_Heroes(NewData, FromPreFilledMaps) {
	ResetZone_Heroes(FromPreFilledMaps);
	if (NewData.heroes != undefined) {
		for (var i = 0; i < NewData.heroes.length; i++) {
			heroLine.XYBase = "1x1";
			//not the best thing to do 
			// using specific Element ID and
			// using common image container for specific hero .. but using number
			heroLine.elementID = "hero" + (i + 1).toString()
			heroLine.TokenCommonImageContainer = "hero" + (i + 1).toString() + "-conditions-container";

			var html = heroLine.AddOneLineWithData(NewData.heroes[i]);
			//add specific Zones

			////add zone for hero skill + insert skill images container
			//var HeroImageContainer = $('<div>').addClass('hero-skills-images-container');
			//html.find('.Row-cards').after(HeroImageContainer);
			//var SkillZone = CreateZone_HeroSkills(NewData.heroes[i].title);
			//html.append(SkillZone);
			//FillZone_HeroSkills(html, NewData.heroes[i], FromPreFilledMaps);

			//Update_HeroImages(html);
			$('#hero' + (i + 1).toString() + ' .heroes-container').prepend(html);
			Update_HeroImages($('#hero' + (i + 1).toString() + ' .heroes-container'));
			Update_TokenImages(html);
		}
	}
}

function ResetZone_Heroes(FromPreFilledMaps) {
	$('.heroes-container .select-row').remove();
}

function AddLine_Hero() {
	heroLine.XYBase = "1x1";
	var html = heroLine.AddOneEmptyLine();
	$('.heroes-container').append(html);
	return html;
}

function Create_HeroListValues() {
	var html = addOption('Clear', '', 'UnSet_Hero(this);');

	Object.entries(HEROES_LIST).sort(dynamicSort("order")).forEach(item => {
		var additionalText = ''
		if (heroLine.DisplayExpansionNameInSelect == true) {
			additionalText = '- ' + EXPANSIONS_LIST[item[1].expansion].title;
		}
		html += addOption(item[1].title + ' ' + additionalText, '', 'Set_Hero(this, \'' + item[0] + '\')');
	});
	return html;
}

function Set_Hero(element, value) {
	heroLine.XYBase = "1x1";
	var container = $(element).parents('.select-row');
	//update hero line because it has last value whichis not always good
	var OneHeroValue = container.find('.MainElement-ID').val();
	heroLine.elementID = OneHeroValue
	heroLine.Set_MainElement(container, value);

	Update_HeroImages($('#' + OneHeroValue + ' .heroes-container'));

//add zone for hero skill + insert skill images container
//	var HeroImageContainer = $('<div>').addClass('hero-skills-images-container');
//	container.find('.Row-cards').after(HeroImageContainer);
//	var SkillZone = CreateZone_HeroSkills(value);
//	container.append(SkillZone);
}

function UnSet_Hero(element) {
	var container = $(element).parents('.select-row');
	heroLine.UnSet_MainElement(container);
	Update_HeroImages(container);
}

//Hero Image is just for display : no need to Get / Fill
function CreateZone_HeroIamge() {
	var html = $('<div>').addClass('hero-image-container');

	var heroImage = $('<img>');
	heroImage.attr('src', '').attr('onclick', "$(this).parent().toggleClass('feat-used')");
	html.append(heroImage);

//	var heroImageFeat = $('<div>').addClass('hero-image-feat');
//	html.append(heroImageFeat);

	return html;
}

function Update_HeroImages(RowElement) {
	var HeroImage = RowElement.find('.hero-image-container img');
	var HeroTokenPath = 'images/StaticSite/mHeroNotSet.png';
	//Reset_HeroImages(RowElement);

	var OneHeroValue = RowElement.find('.MainElement-Value').val();
	if (OneHeroValue != undefined && OneHeroValue != '') {
		if (HeroImage != undefined) {
			HeroImage.attr('src', ImagePathRoot + heroLine.CardsPath(GetExpansionPath(heroLine.AllData[OneHeroValue].expansion)) + urlize(heroLine.AllData[OneHeroValue].title) + '.png');
			HeroTokenPath = ImagePathRoot + heroLine.MapTokensPath(GetExpansionPath(heroLine.AllData[OneHeroValue].expansion)) + urlize(heroLine.AllData[OneHeroValue].title) + '.png';
		}
	}
	else {
	}

	//update menu icon
	var heroId = RowElement.parent().attr('id');
	var heroImage = $('<img>');
	heroImage.attr('src', HeroTokenPath);
	var heroMenuIcon = $('[href="#' + heroId + '"]');
	heroMenuIcon.html('');
	heroMenuIcon.append(heroImage);


	//if (HeroImageContainer.find('.' + urlize(OneHeroValue)).length == 0) {
	//	var HeroImage = $('<img>');
	//	HeroImage.attr('src', 'images/heroes_cards/' + urlize(OneHeroValue) + '.png');
	//	HeroImageContainer.append(HeroImage);
	//}
}

function Reset_HeroImages(RowElement) {
	var HeroImageContainer = RowElement.find('.Row-cards');
	HeroImageContainer.find('img').remove();

	//update menu icon
	var HeroTokenPath = 'images/StaticSite/mHeroNotSet.png';
	var heroId = RowElement.parent().attr('id');
	var heroImage = $('<img>');
	heroImage.attr('src', HeroTokenPath);
	var heroMenuIcon = $('[href="#' + heroId + '"]');
	heroMenuIcon.html('');
	heroMenuIcon.append(heroImage);
}



