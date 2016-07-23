var player;
var enemy;
var comboStatus = [];
var isCombo = false;
var total_playerhealth;
var total_enemyhealth;
var atk;
var page;
var turn = true;



function SetCharacter(name, health, atk, playable) {
	var character = {
		name: name,
		health: health,
		atk: atk,
		playable: playable,
		combo: {
			basic: ['P'],
			special: ['down', 'right', 'P']
		}
	}

	return character;
}

function checkForArrows(e) {
	switch (e) {
		case 40:
			return 'down';
		case 39:
			return 'right';
		default:
			console.log("Not an arrow");
			return String.fromCharCode(e);
	}
}

function comboCheck(character, key) {
	if (!isCombo) {
		if (key == character.combo.special[0]) {
			comboStatus.push(key);
			isCombo = true;
			console.log("First combo");
		} else if (key == character.combo.basic) {
			console.log("Just regular hit");
			changeCharacterAnimation("player", player.name, "basic");
			window.setTimeout(function() {changeCharacterAnimation("player", player.name, "idle")}, 2500);
			return character.atk;
		} else {
			console.log("Wrong key");
		}
	} else {
		if (key == character.combo.special[1] && comboStatus.indexOf(key) == -1) {
			comboStatus.push(key);
			console.log("Second Combo");
		} else if (key == character.combo.special[2] && comboStatus[1] == character.combo.special[1] && comboStatus.indexOf(key) == -1) {
			comboStatus = [];
			isCombo = false;
			changeCharacterAnimation("player", player.name, "special");
			
			if (player.name == "chunli")
				window.setTimeout(function() {changeCharacterAnimation("player", player.name, "idle")}, 3000);
			else
				window.setTimeout(function() {changeCharacterAnimation("player", player.name, "idle")}, 1200);
			console.log("Combo Complete");
			if (player.name == "ryu")
				$("audio")[2].play();
			else
				$("audio")[3].play();
			return character.atk + 10;
		} else {
			if(key == character.combo.basic) {
				console.log("Combo fail.");
				comboStatus = [];
				isCombo = false;
				return character.atk;
			} else {
				console.log("Combo fail.");
				comboStatus = [];
				isCombo = false;
			}
		}
	}	
}

function setHealth(who, attack, health) {
	var healthLoss = (((health - attack) / window["total_" + who + "health"]* 100) + "%");
	$("." + who + ".healthloss").css("width", healthLoss);
	window[who].health -= attack;
	console.log(healthLoss);
	console.log(window[who].health);
}

var ryu = new SetCharacter("ryu", 100, 12, true);
var chunli = new SetCharacter("chunli", 100, 12, true);
var bison = new SetCharacter("bison", 220, 30, false);
var sagat = new SetCharacter("sagat", 180, 20, false);
var vega = new SetCharacter("vega", 150, 15, false);
var blanka = new SetCharacter("blanka", 100, 10, false);




$(document).on("keydown", function(e) {
	//if(page == ".fight") {
		if(turn) {
			var letter = checkForArrows(e.keyCode);
			var attack = comboCheck(player, letter);

			if (!isNaN(attack)) {
				turn = false;
				setHealth("enemy", attack, enemy.health);
				if (enemy.health <= 0) {
					window.setTimeout(function() {changeCharacterAnimation("player", player.name, "win")}, 2000);
					//You Win
					$(".enemyselectable[data-enemy='" + enemy.name + "']").addClass("defeated");
					if($(".enemyselectable").length !== $(".defeated").length) {
						$(".outcome").text("You Win!");
						$(".choose").text("Choose Another Enemy");
						$(".choose").show();
						$(".choose").on("click", function() {
							$("audio")[4].pause();
							turn = true;
							player.health = total_playerhealth;
							setHealth("player", 0, total_playerhealth);
							player.atk += 10;
							$(".outcome").text("");
							$(".enemyselect").show();
							$(".notselected").slideDown(300);
							$(".enemyselectable").removeClass("selected notselected");
							$(".choose").hide();
						});
					} else {
						$(".outcome").text("GAME WON!");
					}
				} else {
					window.setTimeout(function() {enemyAttack()}, 2000);
				}
			}
		}
		
	//}
});

function enemyAttack() {
	changeCharacterAnimation("enemy", enemy.name, "basic");
	setHealth("player", enemy.atk, player.health);
	switch(enemy.name) {
		case 'sagat':
			window.setTimeout(function() {changeCharacterAnimation("enemy", enemy.name, "idle")}, 1000);
			break;
		case 'bison':
			window.setTimeout(function() {changeCharacterAnimation("enemy", enemy.name, "idle")}, 1000);
			break;
		case 'vega':
			window.setTimeout(function() {changeCharacterAnimation("enemy", enemy.name, "idle")}, 2000);
			break;
		case 'blanka':
			window.setTimeout(function() {changeCharacterAnimation("enemy", enemy.name, "idle")}, 2000);
			break;
	}
	if (player.health > 0) {
		turn = true;
	} else {
		if (enemy.name == 'vega')
			window.setTimeout(function() {changeCharacterAnimation("enemy", enemy.name, "win")}, 2000);
		else
			window.setTimeout(function() {changeCharacterAnimation("enemy", enemy.name, "win")}, 1000);
		//You Lose
		$(".outcome").text("You Lose!");
		$(".play").text("Play again");
		$(".play").show();
		$(".play").on("click", function() {
			$("audio")[4].pause();
			turn = true;
			$(".outcome").text("");
			player.health = total_playerhealth;
			enemy.health = total_enemyhealth;
			player.atk = atk;
			$(".playerselect").show();
			$(".enemyselect").show();
			$(".notselected").slideDown(300);
			$(".enemyselectable").removeClass("selected notselected defeated");
			$(".playerselectable").removeClass("selected notselected");
			$(".play").hide();
		});
	}

}

$(".play").hide();
$(".choose").hide();

$(".start").on("click", function() {

		if($(this).data('start')) {
			$(this).addClass("selected");
			page = ".title";
			selectedAnimation();
		}
});

$(".playerselectable").on("click", function() {
	if($(this).data('player')) {
		$("audio")[1].play();
		$(".playerselectable").addClass("notselected");
		$(this).removeClass("notselected");
		$(this).addClass("selected");
		player = window[$(this).data('player')];
		total_playerhealth = player.health;
		atk = player.atk;
		setHealth("player", 0, total_playerhealth);
		page = ".playerselect";
		selectedAnimation();
	}
});

		
$(".enemyselectable").on("click", function() {
	if (!$(this).hasClass("defeated")){
		if($(this).data('enemy')) {
			$("audio")[1].play();
			$(".enemyselectable").addClass("notselected");
			$(this).removeClass("notselected");
			$(this).addClass("selected");
			enemy = window[$(this).data('enemy')];
			total_enemyhealth = enemy.health;
			setHealth("enemy", 0, total_enemyhealth);
			changeCharacterAnimation("player", player.name, "idle");
			changeCharacterAnimation("enemy", enemy.name, "idle");
			page = ".enemyselect";
			selectedAnimation();
		}
	}
});
		

function selectedAnimation () {

		$(".selected").animate({
			opacity: "toggle",
			}, 65)
			.animate({
			opacity: "toggle",
			}, 65)
			.animate({
			opacity: "toggle",
			}, 65)
			.animate({
			opacity: "toggle",
			}, 65)
			.delay(1000)
			.queue(function() {
				$(page).fadeOut(300, function() {
					if(page == ".enemyselect") {
						$("audio")[4].play();
					}
					$(page).hide();
				})
				$(".selected").dequeue();
			});

		$(".notselected").animate({
			height: "toggle",
		}, 700);
}

function changeCharacterAnimation (who, character, action) {
	var anim = "assets/images/" + character + "/" + character + "-" + action + ".gif";
	$("." + who + ".holder>img").attr("src", anim);
}