var MAPVERSION = "1.2.0";
var MAPGAME = "GloomHaven";

var mapWidth = 40;
var mapHeight = 50;

var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var HCellSize = 90;
var VCellSize = 78;
var cellType = "HEX"; // SQUARE - HEX

var defaultConfig = 'e30=';

var ImagePathRoot = "images/";

//Custom Inputs
var MAX_CustomInputs = 5
var CustomInput_SetTexts = [MAX_CustomInputs - 1];
CustomInput_SetTexts[0] = 'Set HP';
CustomInput_SetTexts[1] = 'Set Init';
CustomInput_SetTexts[2] = 'Set Seq nb';	//BEWARE :  2 & 3 should be exclusive here as they are on the same space !
CustomInput_SetTexts[3] = 'Set Coins';
CustomInput_SetTexts[4] = 'Set XP';


function UpdateOrder(ObjectArray, newOrderBasedField) {
	var tempArray;
	tempArray = Object.entries(ObjectArray).sort(dynamicSort(newOrderBasedField));

	for (var i = 0; i < tempArray.length; i++) {
		ObjectArray[tempArray[i][1].id].order = i
	}

	return ObjectArray;
}

function FromRAWToLIST(RAWArray, NextOrder) {
	var LISTArray = {};
	if (NextOrder == undefined) {
		NextOrder = 0;
	}
	for (var i = 0; i < RAWArray.length; i++) {
		var innerObject = {};
		innerObject.id = RAWArray[i][0];
		innerObject.title = RAWArray[i][1];
		innerObject.width = RAWArray[i][2];
		innerObject.height = RAWArray[i][3];
		innerObject.left = RAWArray[i][4];
		innerObject.top = RAWArray[i][5];
		innerObject.expansion = RAWArray[i][6];
		//add a default sorting field
		innerObject.order = i + NextOrder;
		LISTArray[RAWArray[i][0]] = innerObject;
	}
	return LISTArray;
}

// opacity class = "CSS"
// or ' opened' / ' closed'suffix = "OC"
var OpenedClosedType = "OC"

//expansions 
//usning shortname instead of if in the elments arrays
var bg = 1, jotl = 2, fh = 3; fc = 4;

//id, name, group, path
// Group 'Games', 'Expansions', 'Fan Content'
var EXPANSIONS_RAW = [
	[1, 'Base Game', 'Games', 'bg'],
	[2, 'Jaws of the Lion', 'Games', 'jotl'],
	[3, 'Frosthaven', 'Games', 'fh'],
	[4, 'Forgotten Circles', 'Expansions', 'fc']
];

var selectedExpansions = {};
var EXPANSIONS_LIST = {};
var EXPANSION_GROUPS = {};
for (var i = 0; i < EXPANSIONS_RAW.length; i++) {
	var innerObject = {};
	innerObject.id = EXPANSIONS_RAW[i][0];
	innerObject.title = EXPANSIONS_RAW[i][1];
	innerObject.group = EXPANSIONS_RAW[i][2];
	innerObject.fullPath = '_expansion/' + EXPANSIONS_RAW[i][3] + '/';
	EXPANSIONS_LIST[EXPANSIONS_RAW[i][0]] = innerObject;

	selectedExpansions[EXPANSIONS_RAW[i][0]] = EXPANSIONS_RAW[i][0];

	if (EXPANSION_GROUPS[EXPANSIONS_RAW[i][2]] == undefined) {
		EXPANSION_GROUPS[EXPANSIONS_RAW[i][2]] = [];
	}
	EXPANSION_GROUPS[EXPANSIONS_RAW[i][2]].push(innerObject);
}

function GetExpansionPath(expansionID) {
	return EXPANSIONS_LIST[expansionID].fullPath
}

var ImagePathLevelImage = "_common/level_cards/";
var ImagePathLevelFigureToken = "_common/level_cards/";

var CurrentLevel = 0; // values 0 to 7
var ALL_LEVELS = 'Lvl0 Lvl1 Lvl2 Lvl3 Lvl4 Lvl5 Lvl6 Lvl7'
var ImagePathLevel = "";

// ------------------------------------------------------

//name,cols width, row height, width delta, height delta, expansion
MAP_TILES_RAW = [
	[1, 'a1', 2, 5, 68, 39, bg],
	[2, 'a2', 2, 5, 68, 39, bg],
	[3, 'a3', 2, 5, 68, 39, bg],
	[4, 'a4', 2, 5, 68, 39, bg],
	[5, 'b1', 4, 4, 68, 78, bg],
	[6, 'b2', 4, 4, 68, 78, bg],
	[7, 'b3', 4, 4, 68, 78, bg],
	[8, 'b4', 4, 4, 68, 78, bg],
	[9, 'c1', 4, 4, 68, 117, bg],
	[10, 'c2', 4, 4, 68, 117, bg],
	[11, 'd1', 5, 5, 68, 156, bg],
	[12, 'd2', 5, 5, 68, 156, bg],
	[13, 'e1', 5, 5, 68, 78, bg],
	[14, 'f1', 9, 3, 68, 39, bg],
	[15, 'g1', 8, 3, 68, 39, bg],
	[16, 'g2', 8, 3, 68, 39, bg],
	[17, 'h1', 7, 7, 68, 234, bg],
	[18, 'h2', 7, 7, 68, 234, bg],
	[19, 'h3', 7, 7, 68, 234, bg],
	[20, 'i1', 5, 6, 68, 39, bg],
	[21, 'i2', 5, 6, 68, 39, bg],
	[22, 'j1', 7, 9, 68, 39, bg],
	[23, 'j2', 7, 9, 68, 39, bg],
	[24, 'k1', 6, 8, 68, 117, bg],
	[25, 'k2', 6, 8, 68, 117, bg],
	[26, 'l1', 7, 5, 68, 39, bg],
	[27, 'l2', 7, 5, 68, 39, bg],
	[28, 'l3', 7, 5, 68, 39, bg],
	[29, 'm1', 7, 6, 68, 117, bg],
	[30, 'n1', 7, 8, 68, 39, bg],
	[31, '01', 11, 7, 68, 39, jotl],
];
MAP_TILES_LIST = FromRAWToLIST(MAP_TILES_RAW);

ANGLES_LIST = [
	[0],
	[60],
	[120],
	[180],
	[240],
	[300]
];


OVERLAYTILES_RAW = [
	[1, 'corridor earth 1h', 1, 1, 45, 39, bg],
	[2, 'corridor earth 2h', 1, 1, 45, 39, bg],
	[3, 'corridor man made stone 1h', 1, 1, 45, 39, bg],
	[4, 'corridor man made stone 2h', 1, 1, 45, 39, bg],
	[5, 'corridor natural stone 1h', 1, 1, 45, 39, bg],
	[6, 'corridor natural stone 2h', 1, 1, 45, 39, bg],
	[7, 'corridor wood 1h', 1, 1, 45, 39, bg],
	[8, 'corridor wood 2h', 1, 1, 45, 39, bg],
	[9, 'dark corridor 2h', 1, 1, 45, 39, bg],
	[10, 'pressure plate', 1, 1, 45, 39, bg],
	[11, 'hot coals', 1, 1, 45, 39, bg],
	[12, 'hot coals 2h', 1, 1, 45, 39, bg],
	[13, 'hot coals 3h', 1, 1, 45, 39, bg],
	[14, 'log 2h', 1, 1, 45, 39, bg],
	[15, 'rubble', 1, 1, 45, 39, bg],
	[16, 'stairs', 1, 1, 45, 39, bg],
	[17, 'thorns', 1, 1, 45, 39, bg],
	[18, 'water', 1, 1, 45, 39, bg],
	[19, 'water 2h', 1, 1, 45, 39, bg],
	[20, 'water 3h', 1, 1, 45, 39, bg]
];
OVERLAYTILES_LIST = FromRAWToLIST(OVERLAYTILES_RAW);

DOORS_RAW = [
	[1, 'Stone Door H', 1, 1, 45, 39, bg],
	[2, 'Stone Door V', 1, 1, 45, 39, bg],
	[3, 'Wooden Door H', 1, 1, 45, 39, bg],
	[4, 'Wooden Door V', 1, 1, 45, 39, bg],
	[5, 'Dark Fog', 1, 1, 45, 39, bg],
	[6, 'Light Fog', 1, 1, 45, 39, bg]
];
DOORS_LIST = FromRAWToLIST(DOORS_RAW);

// -----------------------------------------------

MOVABLE_TOKENS1_RAW = [
	[1, 'Coin1', 1, 1, 45, 39, bg],
	[2, 'Coin5', 1, 1, 45, 39, bg]
];
TMP_LIST1 = FromRAWToLIST(MOVABLE_TOKENS1_RAW);
var TempObject = {};
TempObject.id = 3;
TempObject.title = "$SEPARATOR$";
TempObject.expansion = bg;
TempObject.order = 2;
TMP_LIST1[TempObject.id] = TempObject;

MOVABLE_TOKENS2_RAW = [
	[4, 'Altar', 1, 1, 45, 39, bg],
	[5, 'Barrel', 1, 1, 45, 39, bg],
	[6, 'Bear Trap', 1, 1, 45, 39, bg],
	[7, 'Bookcase', 1, 1, 45, 39, bg],
	[8, 'Boulder 1H', 1, 1, 45, 39, bg],
	[9, 'Boulder 2H', 1, 1, 45, 39, bg],
	[10, 'Boulder 3H', 1, 1, 45, 39, bg],
	[11, 'Bush', 1, 1, 45, 39, bg],
	[12, 'Cabinet', 1, 1, 45, 39, bg],
	[13, 'Crate', 1, 1, 45, 39, bg],
	[14, 'Crystal', 1, 1, 45, 39, bg],
	[15, 'Dark Pit 2H', 1, 1, 45, 39, bg],
	[16, 'Fountain', 1, 1, 45, 39, bg],
	[17, 'Nest', 1, 1, 45, 39, bg],
	[18, 'Poison Gas Trap', 1, 1, 45, 39, bg],
	[19, 'Rift', 1, 1, 45, 39, bg],
	[20, 'Rock Column', 1, 1, 45, 39, bg],
	[21, 'Sarcophagus 2H', 1, 1, 45, 39, bg],
	[22, 'Shelf 2H', 1, 1, 45, 39, bg],
	[23, 'Spike Trap', 1, 1, 45, 39, bg],
	[24, 'Stalagmites', 1, 1, 45, 39, bg],
	[25, 'Stone Pillar', 1, 1, 45, 39, bg],
	[26, 'Stump', 1, 1, 45, 39, bg],
	[27, 'Table 2H', 1, 1, 45, 39, bg],
	[28, 'Totem', 1, 1, 45, 39, bg],
	[29, 'Treasure Tile', 1, 1, 45, 39, bg],
	[30, 'Tree 3H', 1, 1, 45, 39, bg],
	[31, 'Wall Section 2H', 1, 1, 45, 39, bg]
];
TMP_LIST2 = FromRAWToLIST(MOVABLE_TOKENS2_RAW, 3);
MOVABLE_TOKENS_LIST = Object.assign(TMP_LIST1, TMP_LIST2);

// -----------------------------------------------

var ImagePathConditionImage = "_common/conditions_tokens/";
var ImagePathConditionFigureToken = "_common/conditions_tokens/";
CONDITIONS_INITIAL = [
	[1, 'Bless', true, false],
	[2, 'Curse', true, false],
	[3, 'Disarm', true, false],
	[4, 'Immobilize', true, false],
	[5, 'Invisible', true, false],
	[6, 'Muddle', true, false],
	[7, 'Poison', true, false],
	[8, 'Regenerate', true, false],
	[9, 'Strengthen', true, false],
	[10, 'Stun', true, false],
	[11, 'Wound', true, false],
	[12, 'Angry Face', true, false],
	[13, 'Aeromancer', true, false],
];

var CONDITIONS = {};
var CONDITIONS_LIST = [];

for (var i = 0; i < CONDITIONS_INITIAL.length; i++) {
	CONDITIONS_LIST.push(CONDITIONS_INITIAL[i][1]);
	CONDITIONS[CONDITIONS_INITIAL[i][1]] = { 'hasConditionCard': CONDITIONS_INITIAL[i][2], 'canApplyMultipleTimes': CONDITIONS_INITIAL[i][3] };
}

// -----------------------------------------------

var MasterSuffix = ' elite' //' master';
var MinionSuffix = ' normal' //' minion';

var dummy = 'dummy';

var MONSTERS_RAW = [
	[1, 'Ancient Artillery', 1, 1, 41, 35, bg, false, [dummy], false],
	[2, 'Bandit Archer', 1, 1, 41, 35, bg, false, [dummy], false],
	[3, 'Bandit Guard', 1, 1, 41, 35, bg, false, [dummy], false],
	[4, 'Black Imp', 1, 1, 41, 35, bg, false, [dummy], false],
	[5, 'Cave Bear', 1, 1, 41, 35, bg, false, [dummy], false],
	[6, 'City Archer', 1, 1, 41, 35, bg, false, [dummy], false],
	[7, 'City Guard', 1, 1, 41, 35, bg, false, [dummy], false],
	[8, 'Cultist', 1, 1, 41, 35, bg, false, [dummy], false],
	[9, 'Deep Terror', 1, 1, 41, 35, bg, false, [dummy], false],
	[10, 'Earth Demon', 1, 1, 41, 35, bg, false, [dummy], false],
	[11, 'Flame Demon', 1, 1, 41, 35, bg, false, [dummy], false],
	[12, 'Forest Imp', 1, 1, 41, 35, bg, false, [dummy], false],
	[13, 'Frost Demon', 1, 1, 41, 35, bg, false, [dummy], false],
	[14, 'Giant Viper', 1, 1, 41, 35, bg, false, [dummy], false],
	[15, 'Harrower Infester', 1, 1, 41, 35, bg, false, [dummy], false],
	[16, 'Hound', 1, 1, 41, 35, bg, false, [dummy], false],
	[17, 'Inox Archer', 1, 1, 41, 35, bg, false, [dummy], false],
	[18, 'Inox Bodyguard', 1, 1, 41, 35, bg, false, [dummy], false],
	[19, 'Inox Guard', 1, 1, 41, 35, bg, false, [dummy], false],
	[20, 'Inox Shaman', 1, 1, 41, 35, bg, false, [dummy], false],
	[21, 'Living Bones', 1, 1, 41, 35, bg, false, [dummy], false],
	[22, 'Living Corpse', 1, 1, 41, 35, bg, false, [dummy], false],
	[23, 'Living Spirit', 1, 1, 41, 35, bg, false, [dummy], false],
	[24, 'Lurker', 1, 1, 41, 35, bg, false, [dummy], false],
	[25, 'Night Demon', 1, 1, 41, 35, bg, false, [dummy], false],
	[26, 'Ooze', 1, 1, 41, 35, bg, false, [dummy], false],
	[27, 'Rending Drake', 1, 1, 41, 35, bg, false, [dummy], false],
	[28, 'Savvas Icestorm', 1, 1, 41, 35, bg, false, [dummy], false],
	[29, 'Savvas Lavaflow', 1, 1, 41, 35, bg, false, [dummy], false],
	[30, 'Spitting Drake', 1, 1, 41, 35, bg, false, [dummy], false],
	[31, 'Stone Golem', 1, 1, 41, 35, bg, false, [dummy], false],
	[32, 'Sun Demon', 1, 1, 41, 35, bg, false, [dummy], false],
	[33, 'Vermling Scout', 1, 1, 41, 35, bg, false, [dummy], false],
	[34, 'Vermling Shaman', 1, 1, 41, 35, bg, false, [dummy], false],
	[35, 'Wind Demon', 1, 1, 41, 35, bg, false, [dummy], false],
	[36, 'Black Sludge', 1, 1, 41, 35, jotl, false, [dummy], false],
	[37, 'Aesther Ashblade', 1, 1, 41, 35, bg, false, [dummy], false],
	[38, 'Aesther Scout', 1, 1, 41, 35, bg, false, [dummy], false],
	[39, 'Valrath Savage', 1, 1, 41, 35, bg, false, [dummy], false],
	[40, 'Valrath Tracker', 1, 1, 41, 35, bg, false, [dummy], false],
];

function getMonsterTraits(i) {
	var traitsArray = MONSTERS_RAW[i][8];
	var result = [];
	for (var j = 0; j < traitsArray.length; j++) {
		result.push(urlize(traitsArray[j]));
	}
	return result;
}

MONSTERS_LIST = FromRAWToLIST(MONSTERS_RAW);
//add missing specific fields
for (var i = 0; i < MONSTERS_RAW.length; i++) {
	OneItem = MONSTERS_LIST[MONSTERS_RAW[i][0]];
	OneItem.ranged = MONSTERS_RAW[i][7];
	OneItem.traits = getMonsterTraits(i);
	OneItem.hasBack = MONSTERS_RAW[i][9];
}
//sort
MONSTERS_LIST = UpdateOrder(MONSTERS_LIST, "title");

var LIEUTENANTS_RAW = [
	[1, 'Bandit Commander', 1, 1, 41, 35, bg, false],
	[2, 'Captain of the Guard', 1, 1, 41, 35, bg, false],
	[3, 'Dark Rider', 1, 1, 41, 35, bg, false],
	[4, 'Elder Drake', 1, 1, 41, 35, bg, false],
	[5, 'Inox Bodyguard', 1, 1, 41, 35, bg, false],
	[6, 'Jekserah', 1, 1, 41, 35, bg, false],
	[7, 'Merciless Overseer', 1, 1, 41, 35, bg, false],
	[8, 'Prime Demon', 1, 1, 41, 35, bg, false],
	[9, 'The Betrayer', 1, 1, 41, 35, bg, false],
	[10, 'The Colorless', 1, 1, 41, 35, bg, false],
	[11, 'The Gloom', 1, 1, 41, 35, bg, false],
	[12, 'The Sightless Eye', 1, 1, 41, 35, bg, false],
	[13, 'Winged Horror', 1, 1, 41, 35, bg, false],
	[14, 'Human Commander', 1, 1, 41, 35, bg, false],
	[15, 'Manifestation of Corruption', 1, 1, 41, 35, bg, false],
	[16, 'Valrath Commander', 1, 1, 41, 35, bg, false],
];

LIEUTENANTS_LIST = FromRAWToLIST(LIEUTENANTS_RAW);
//add missing specific fields
for (var i = 0; i < LIEUTENANTS_RAW.length; i++) {
	OneItem = LIEUTENANTS_LIST[LIEUTENANTS_RAW[i][0]];
	OneItem.hasBack = LIEUTENANTS_RAW[i][7];
}

// ------------------------------------------------------

var MAX_Heroes = 4

var HEROES_RAW = [
	[1, 'Brute', 1, 1, 41, 35, bg, , , dummy],
	[2, 'Cragheart', 1, 1, 41, 35, bg, , , dummy],
	[3, 'Mindthief', 1, 1, 41, 35, bg, , , dummy],
	[4, 'Scoundrel', 1, 1, 41, 35, bg, , , dummy],
	[5, 'Spellweaver', 1, 1, 41, 35, bg, , , dummy],
	[6, 'Tinkerer', 1, 1, 41, 35, bg, , , dummy],
	[7, 'Angry Face', 1, 1, 41, 35, bg, , , dummy],
	//[8, 'Bladeswarm',1,1,41,35,bg,,,dummy],
	[9, 'Circles', 1, 1, 41, 35, bg, , , dummy],
	[10, 'Cthulhu', 1, 1, 41, 35, bg, , , dummy],
	[11, 'Lightning', 1, 1, 41, 35, bg, , , dummy],
	[12, 'Moon', 1, 1, 41, 35, bg, , , dummy],
	[13, 'Musical Note', 1, 1, 41, 35, bg, , , dummy],
	[14, 'Three Spears', 1, 1, 41, 35, bg, , , dummy],
	[15, 'Triangle', 1, 1, 41, 35, bg, , , dummy],
	[16, 'Saw', 1, 1, 41, 35, bg, , , dummy],
	[17, 'Sun', 1, 1, 41, 35, bg, , , dummy],
	[18, 'Two Mini', 1, 1, 41, 35, bg, , , dummy],
	[19, 'Voidwarden', 1, 1, 41, 35, bg, , , dummy],
	[20, 'Demolitionist', 1, 1, 41, 35, bg, , , dummy],
	[21, 'Red Guard', 1, 1, 41, 35, bg, , , dummy],
	[22, 'Hatchet', 1, 1, 41, 35, bg, , , dummy],
	[23, 'Aeromancer', 1, 1, 41, 35, bg, , , dummy],
	[24, 'Diviner', 1, 1, 41, 35, bg, , , dummy],
];

HEROES_LIST = FromRAWToLIST(HEROES_RAW);
//add missing specific fields
for (var i = 0; i < HEROES_RAW.length; i++) {
	OneItem = HEROES_LIST[HEROES_RAW[i][0]];
	OneItem.hp = HEROES_RAW[i][7];
	OneItem.stamina = HEROES_RAW[i][8];
	OneItem.archetype = HEROES_RAW[i][9];
}
//sort
HEROES_LIST = UpdateOrder(HEROES_LIST, "title");

// ------------------------------------------------------

VILLAGERS_RAW = [
	[1, 'Air', 1, 1, 41, 35, bg, true],
	[2, 'Dark', 1, 1, 41, 35, bg, false],
	[3, 'Earth', 1, 1, 41, 35, bg, false],
	[4, 'Fire', 1, 1, 41, 35, bg, false],
	[5, 'Ice', 1, 1, 41, 35, bg, false],
	[6, 'Light', 1, 1, 41, 35, bg, false],
	[7, 'Giant Rat', 1, 1, 41, 35, bg, false],
	[8, 'Mystic Ally', 1, 1, 41, 35, bg, false],
	[9, 'Rat Swarm', 1, 1, 41, 35, bg, false],
	[10, 'Void Eater', 1, 1, 41, 35, bg, false],
	[11, 'Bat Swarm', 1, 1, 41, 35, bg, false],
	[12, 'Rock Colossus', 1, 1, 41, 35, bg, false],
	[13, 'Black Unicorn', 1, 1, 41, 35, bg, false],
	[14, 'Iron Beast', 1, 1, 41, 35, bg, false],
	[15, 'Nail Spheres', 1, 1, 41, 35, bg, false],
	[16, 'Healing Sprite', 1, 1, 41, 35, bg, false],
	[17, 'Thorn Shooter', 1, 1, 41, 35, bg, false],
	[18, 'Lava Golem', 1, 1, 41, 35, bg, false],
	[19, 'Shadow Wolf', 1, 1, 41, 35, bg, false],
	[20, 'Slime Spirit', 1, 1, 41, 35, bg, false],
	[21, 'Skeleton', 1, 1, 41, 35, bg, false],
	[22, 'Jade Falcon', 1, 1, 41, 35, bg, false],
	[23, 'Warrior Spirit', 1, 1, 41, 35, bg, false],
	[24, 'Orchid', 1, 1, 41, 35, bg, false],
	[25, 'Redthorn', 1, 1, 41, 35, bg, false],
	[26, 'Burning Avatar', 1, 1, 41, 35, bg, false],
	[27, 'Bear', 1, 1, 41, 35, bg, false],
	[28, 'Giant Toad', 1, 1, 41, 35, bg, false],
	[29, 'Zephyr', 1, 1, 41, 35, bg, false],
	[30, 'Swamp Alligator', 1, 1, 41, 35, bg, false],
];

VILLAGERS_LIST = FromRAWToLIST(VILLAGERS_RAW);
//add missing specific fields
for (var i = 0; i < VILLAGERS_RAW.length; i++) {
	OneItem = VILLAGERS_LIST[VILLAGERS_RAW[i][0]];
	OneItem.hasBack = VILLAGERS_RAW[i][7];
}

// ------------------------------------------------------

FAMILIARS_RAW = [
	[1, 'Blue1', 1, 1, 35, 35, bg, false],
	[2, 'Blue2', 1, 1, 35, 35, bg, false],
	[3, 'Blue3', 1, 1, 35, 35, bg, false],
	[4, 'Blue4', 1, 1, 35, 35, bg, false],
	[5, 'Green1', 1, 1, 35, 35, bg, false],
	[6, 'Green2', 1, 1, 35, 35, bg, false],
	[7, 'Green3', 1, 1, 35, 35, bg, false],
	[8, 'Green4', 1, 1, 35, 35, bg, false],
	[9, 'Grey1', 1, 1, 35, 35, bg, false],
	[10, 'Grey2', 1, 1, 35, 35, bg, false],
	[11, 'Grey3', 1, 1, 35, 35, bg, false],
	[12, 'Magenta1', 1, 1, 35, 35, bg, false],
	[13, 'Magenta2', 1, 1, 35, 35, bg, false],
	[14, 'Magenta3', 1, 1, 35, 35, bg, false],
	[15, 'Magenta4', 1, 1, 35, 35, bg, false],
	[16, 'Orange1', 1, 1, 35, 35, bg, false],
	[17, 'Orange2', 1, 1, 35, 35, bg, false],
	[18, 'Orange3', 1, 1, 35, 35, bg, false],
	[19, 'Orange4', 1, 1, 35, 35, bg, false],
	[20, 'Purple1', 1, 1, 35, 35, bg, false],
	[21, 'Purple2', 1, 1, 35, 35, bg, false],
	[22, 'Purple3', 1, 1, 35, 35, bg, false],
	[23, 'Purple4', 1, 1, 35, 35, bg, false],
	[24, 'Red1', 1, 1, 35, 35, bg, false],
	[25, 'Red2', 1, 1, 35, 35, bg, false],
	[26, 'Red3', 1, 1, 35, 35, bg, false],
	[27, 'Red4', 1, 1, 35, 35, bg, false]
];

FAMILIARS_LIST = FromRAWToLIST(FAMILIARS_RAW);
//add missing specific fields
for (var i = 0; i < FAMILIARS_RAW.length; i++) {
	OneItem = FAMILIARS_LIST[FAMILIARS_RAW[i][0]];
	OneItem.hasBack = FAMILIARS_RAW[i][7];
}


// ------------------------------------------------------


var mapObjects = [];
var monsterList = [];


//Initialize Global Data (Mainly LineClass)

//ElementName = "tiles"					Element iD = Eelement storage


var tilesLine = new LineClass('tile', 'tiles', 'tiles', '');
tilesLine.needSideList = true;
tilesLine.needCoordinates = true;
tilesLine.XYBase = '1x1';		//DefaultValue
tilesLine.needAngleList = true;
tilesLine.needRemoveButton = true;
tilesLine.UsesExpansionPath = true;
tilesLine.UseExpantionFilter = true;
tilesLine.MainCardsPath = "";
tilesLine.MainMapTokensPath = "map_tiles";
tilesLine.AllData = MAP_TILES_LIST;		//always formated the same way : name, width, height, left, top
tilesLine.ZoneTitleTerm = "Map tiles";
tilesLine.AddElementTerm = "Add map tile";

var overlaytilesLine = new LineClass('Overlay Tile', 'overlaytiles', 'overlaytiles', '');
overlaytilesLine.needCoordinates = true;
overlaytilesLine.XYBase = '1x1';		//DefaultValue
overlaytilesLine.needAngleList = true;
overlaytilesLine.needRemoveButton = true;
overlaytilesLine.UsesExpansionPath = true;
overlaytilesLine.MainCardsPath = "";
overlaytilesLine.MainMapTokensPath = "overlay-tiles";
overlaytilesLine.AllData = OVERLAYTILES_LIST;
overlaytilesLine.ZoneTitleTerm = "Overlay Tiles";
overlaytilesLine.AddElementTerm = "Add Overlay Tiles";

var doorsLine = new LineClass('door', 'doors', 'doors', '');
doorsLine.needCoordinates = true;
doorsLine.XYBase = '1x1';		//DefaultValue
doorsLine.needAngleList = true;
doorsLine.needOpenedCheckbox = true;
doorsLine.needRemoveButton = true;
doorsLine.UsesExpansionPath = true;
doorsLine.MainCardsPath = "";
doorsLine.MainMapTokensPath = "overlay-doors";
doorsLine.AllData = DOORS_LIST;
doorsLine.ZoneTitleTerm = "Doors";
doorsLine.AddElementTerm = "Add door";

var maptokensLine = new LineClass('Map Token', 'maptokens', 'maptokens', '');
maptokensLine.needCoordinates = true;
maptokensLine.XYBase = '1x1';		//DefaultValue
maptokensLine.needAngleList = true;
maptokensLine.needRemoveButton = true;
maptokensLine.UsesExpansionPath = true;
maptokensLine.MainCardsPath = "";
maptokensLine.MainMapTokensPath = "overlay-tokens";
maptokensLine.mapData.Layer = "figures";
maptokensLine.mapData.zIndex = 0;
maptokensLine.mapData.DisplayCI0 = true;
maptokensLine.AllData = MOVABLE_TOKENS_LIST;
maptokensLine.ZoneTitleTerm = "Movable Map Tokens";
maptokensLine.AddElementTerm = "Add Map Token";

var monstersLine = new LineClass('monster', 'monsters', 'monsters', 'RemoveLine_Monster(this);');
monstersLine.needCoordinates = true;
monstersLine.XYBase = '1x1';		//DefaultValue
monstersLine.needCustomInput[0][0] = true;
monstersLine.needCustomInput[1][0] = true;
monstersLine.needCustomInput[2][0] = true;
monstersLine.needAddTokenButton = true;
//monstersLine.needAddRelicButton = true;
//monstersLine.needAddAuraButton = true;
monstersLine.needRemoveButton = true;
monstersLine.UsesExpansionPath = true;
monstersLine.UseExpantionFilter = true;
monstersLine.MainCardsPath = "monster-stat-cards";
monstersLine.MainMapTokensPath = "monster-tokens";
monstersLine.mapData.Layer = "figures";
monstersLine.mapData.zIndex = 2;
monstersLine.mapData.DisplayCI0 = true;
monstersLine.mapData.DisplayCI1 = true;
monstersLine.mapData.DisplayCI2 = true;
monstersLine.AllData = MONSTERS_LIST;
monstersLine.ZoneTitleTerm = "Monsters";
monstersLine.AddElementTerm = "Add monster";


var lieutenantsLine = new LineClass('boss', 'lieutenants', 'lieutenants', 'RemoveLine_Lieutenant(this);');
lieutenantsLine.needCoordinates = true;
lieutenantsLine.XYBase = '1x1';		//DefaultValue
lieutenantsLine.needCustomInput[0][0] = true;
lieutenantsLine.needCustomInput[1][0] = true;
lieutenantsLine.needAddTokenButton = true;
//lieutenantsLine.needAddRelicButton = true;
//lieutenantsLine.needAddAuraButton = true;
lieutenantsLine.needRemoveButton = true;
lieutenantsLine.UsesMainCommonImages = true;
lieutenantsLine.UsesExpansionPath = true;
lieutenantsLine.UseExpantionFilter = true;
lieutenantsLine.MainCardsPath = "monsterboss-stat-cards";
lieutenantsLine.MainMapTokensPath = "monsterboss-tokens";
lieutenantsLine.mapData.Layer = "figures";
lieutenantsLine.mapData.zIndex = 2;
lieutenantsLine.mapData.DisplayCI0 = true;
lieutenantsLine.mapData.DisplayCI1 = true;
lieutenantsLine.mapData.DisplayCI2 = true;
lieutenantsLine.AllData = LIEUTENANTS_LIST;
lieutenantsLine.ZoneTitleTerm = "Bosses";
lieutenantsLine.AddElementTerm = "Add boss";


var familiarsLine = new LineClass('summon', 'familiars', 'familiars', '');
familiarsLine.needCoordinates = true;
familiarsLine.XYBase = '1x1';		//DefaultValue
familiarsLine.needCustomInput[0][0] = true;
familiarsLine.needCustomInput[1][0] = true;
familiarsLine.needCustomInput[2][0] = true;
familiarsLine.needAddTokenButton = true;
familiarsLine.needRemoveButton = true;
familiarsLine.UsesExpansionPath = true;
familiarsLine.UseExpantionFilter = true;
familiarsLine.MainCardsPath = "";
familiarsLine.MainMapTokensPath = "familiars_tokens";
familiarsLine.mapData.Layer = "figures";
familiarsLine.mapData.zIndex = 1;
familiarsLine.mapData.DisplayCI0 = true;
familiarsLine.mapData.DisplayCI1 = true;
familiarsLine.mapData.DisplayCI2 = true;
familiarsLine.AllData = FAMILIARS_LIST;
familiarsLine.ZoneTitleTerm = "Summons";
familiarsLine.AddElementTerm = "Add Summons";


var villagersLine = new LineClass('custom summon', 'villagers', 'villagers', '');
villagersLine.needCoordinates = true;
villagersLine.XYBase = '1x1';		//DefaultValue
villagersLine.needCustomInput[0][0] = true;
villagersLine.needCustomInput[1][0] = true;
villagersLine.needCustomInput[2][0] = true;
villagersLine.needAddTokenButton = true;
villagersLine.needRemoveButton = true;
villagersLine.UsesExpansionPath = true;
villagersLine.UseExpantionFilter = true;
villagersLine.MainCardsPath = "";
villagersLine.MainMapTokensPath = "familiars_tokens";
villagersLine.mapData.Layer = "figures";
villagersLine.mapData.zIndex = 1;
villagersLine.mapData.DisplayCI0 = true;
villagersLine.mapData.DisplayCI1 = true;
villagersLine.mapData.DisplayCI2 = true;
villagersLine.AllData = VILLAGERS_LIST;
villagersLine.ZoneTitleTerm = "Custom Summons";
villagersLine.AddElementTerm = "Add Custom Summons";



var heroLine = new LineClass('hero', 'hero', 'heroes', 'RemoveLine_Hero(this);');
heroLine.needCoordinates = true;
heroLine.XYBase = '1x1';		//DefaultValue
heroLine.needCustomInput[0][0] = true;
heroLine.needCustomInput[1][0] = true;
heroLine.needCustomInput[3][0] = true;
heroLine.needCustomInput[4][0] = true;
heroLine.needAddTokenButton = true;
heroLine.needAddAuraButton = false;
heroLine.needRemoveButton = false;
heroLine.UsesExpansionPath = true;
heroLine.UseExpantionFilter = true;
heroLine.DisplayExpansionNameInSelect = true;
heroLine.MainCardsPath = "heroes_cards";
heroLine.MainMapTokensPath = "heroes_tokens";
heroLine.mapData.Layer = "figures";
heroLine.mapData.zIndex = 3;
heroLine.mapData.DisplayCI0 = true;
heroLine.mapData.SpecificClassZeroCI0 = 'secondary';
heroLine.mapData.DisplayCI1 = true;
heroLine.mapData.DisplayCI3 = true;
heroLine.mapData.DisplayCI4 = true;
heroLine.AllData = HEROES_LIST;





var ELEMENTS_LIST = [tilesLine.elementID
	, overlaytilesLine.elementID
	, doorsLine.elementID
	, maptokensLine.elementID
	, monstersLine.elementID
	, lieutenantsLine.elementID
	, familiarsLine.elementID
	, villagersLine.elementID
	, heroLine.elementID];






var SHOWING_CLASSES = [];
SHOWING_CLASSES[1] = 'showOneCell';
SHOWING_CLASSES[2] = 'showTwoCells';
SHOWING_CLASSES[3] = 'showThreeCells';

var conditionNumber = 1;
var auraNumber = 1;

var monsterNumber = 1;

var config = {};


var MAP_HASES_LIST = [
	['TSR', 'First Blood', 'I', "eyJ0aWxlcyI6W3sidGl0bGUiOiI4Iiwic2lkZSI6IkEiLCJ4IjoiNiIsInkiOiIwIiwiYW5nbGUiOiIxODAifSx7InRpdGxlIjoiRW5kIiwic2lkZSI6IkEiLCJ4IjoiNSIsInkiOiIxIiwiYW5nbGUiOiI5MCJ9LHsidGl0bGUiOiIxNiIsInNpZGUiOiJBIiwieCI6IjYiLCJ5IjoiNCIsImFuZ2xlIjoiMCJ9LHsidGl0bGUiOiIxMiIsInNpZGUiOiJBIiwieCI6IjEiLCJ5IjoiMyIsImFuZ2xlIjoiMjcwIn0seyJ0aXRsZSI6IkV4aXQiLCJzaWRlIjoiQSIsIngiOiIyIiwieSI6IjEiLCJhbmdsZSI6IjkwIn0seyJ0aXRsZSI6IjI2Iiwic2lkZSI6IkEiLCJ4IjoiMTAiLCJ5IjoiNCIsImFuZ2xlIjoiMjcwIn0seyJ0aXRsZSI6IjkiLCJzaWRlIjoiQSIsIngiOiI2IiwieSI6IjgiLCJhbmdsZSI6IjAifSx7InRpdGxlIjoiRW5kIiwic2lkZSI6IkEiLCJ4IjoiNSIsInkiOiI5IiwiYW5nbGUiOiI5MCJ9LHsidGl0bGUiOiJFbnRyYW5jZSIsInNpZGUiOiJBIiwieCI6IjEwIiwieSI6IjkiLCJhbmdsZSI6IjE4MCJ9LHsidGl0bGUiOiJFbmQiLCJzaWRlIjoiQSIsIngiOiIxMyIsInkiOiI1IiwiYW5nbGUiOiIyNzAifV0sImRvb3JzIjpbXSwieHMiOltdLCJvYmplY3RpdmVzIjpbeyJ0aXRsZSI6IlNlYXJjaCIsIngiOiIxIiwieSI6IjcifSx7InRpdGxlIjoiU2VhcmNoIiwieCI6IjUiLCJ5IjoiOSJ9LHsidGl0bGUiOiJTZWFyY2giLCJ4IjoiMTMiLCJ5IjoiNSJ9LHsidGl0bGUiOiJTZWFyY2giLCJ4IjoiNSIsInkiOiIxIn1dLCJtb25zdGVycyI6W3sidGl0bGUiOiJFdHRpbiIsIm1hc3RlciI6dHJ1ZSwieCI6IjciLCJ5IjoiMSIsInZlcnRpY2FsIjpmYWxzZSwiaHAiOiIxNiIsImNvbmRpdGlvbnMiOltdfSx7InRpdGxlIjoiRXR0aW4iLCJtYXN0ZXIiOmZhbHNlLCJ4IjoiNyIsInkiOiIxIiwidmVydGljYWwiOmZhbHNlLCJocCI6IjUiLCJjb25kaXRpb25zIjpbXX0seyJ0aXRsZSI6IkdvYmxpbiBBcmNoZXIiLCJtYXN0ZXIiOnRydWUsIngiOiIxMSIsInkiOiI1IiwidmVydGljYWwiOmZhbHNlLCJocCI6IjQiLCJjb25kaXRpb25zIjpbXX0seyJ0aXRsZSI6IkdvYmxpbiBBcmNoZXIiLCJtYXN0ZXIiOmZhbHNlLCJ4IjoiMTEiLCJ5IjoiNSIsInZlcnRpY2FsIjpmYWxzZSwiaHAiOiIyIiwiY29uZGl0aW9ucyI6W119LHsidGl0bGUiOiJHb2JsaW4gQXJjaGVyIiwibWFzdGVyIjpmYWxzZSwieCI6IjExIiwieSI6IjUiLCJ2ZXJ0aWNhbCI6ZmFsc2UsImhwIjoiMiIsImNvbmRpdGlvbnMiOltdfSx7InRpdGxlIjoiR29ibGluIEFyY2hlciIsIm1hc3RlciI6ZmFsc2UsIngiOiIxMSIsInkiOiI1IiwidmVydGljYWwiOmZhbHNlLCJocCI6IjIiLCJjb25kaXRpb25zIjpbXX0seyJ0aXRsZSI6IkdvYmxpbiBBcmNoZXIiLCJtYXN0ZXIiOmZhbHNlLCJ4IjoiMTEiLCJ5IjoiNSIsInZlcnRpY2FsIjpmYWxzZSwiaHAiOiIyIiwiY29uZGl0aW9ucyI6W119XSwibGlldXRlbmFudHMiOltdLCJhY3RPbmUiOnRydWV9"],
	['HM', 'VoD - Visions of Dawn *NOT AVAILABLE YET**', 'II', ""],
];




