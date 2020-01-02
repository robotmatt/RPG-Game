$(document).ready(function () {

    // Variable: list of characters in the game
    const characters = [{
        name: "Obi Wan",
        image: "./assets/img/obi_wan.png",
        healthPoints: 120,
        attackPower: 8,
        counterAttackPower: 7
    },
    {
        name: "Luke Skywalker",
        image: "./assets/img/luke_skywalker.png",
        healthPoints: 100,
        attackPower: 10,
        counterAttackPower: 5
    },
    {
        name: "Darth Sidious",
        image: "./assets/img/darth_sidious.png",
        healthPoints: 150,
        attackPower: 6,
        counterAttackPower: 30
    },
    {
        name: "Darth Maul",
        image: "./assets/img/darth_maul.png",
        healthPoints: 180,
        attackPower: 4,
        counterAttackPower: 25
    },
    ];

    // Function: renders a character on the page
    // index: index of the character in the character array
    // hp: current hp of the character
    // divClass: class of the new div to create
    function renderCharacter(index, hp, divClass) {
        //create a new div to hold the character
        var newChar = $("<div>").text(characters[index].name).attr({
            "char-index": index,
            "class": divClass + " character",
            "id": "char" + index
        });
        //add the image to the div
        newChar.append($("<img>").attr({
            "class": "char-image",
            "src": characters[index].image,
            "height": "100px",
            "width": "100px"
        }));
        //add the hp text
        newChar.append($("<div>").text(hp).attr({
            "class": "hp-label"
        }));
        return newChar;
    }

    // Function: remove a character from the game and screen
    // index: index of character to remove
    function removeCharacter(index) {
        $('#char' + index).remove();
    }

    // Variable: Attributes for the current game, will reset when startGame() is called
    let game = {
        myCharacterIndex: -1,
        myDefenderIndex: -1,
        attackerHP: 0,
        defenderHP: 0,
        attackNumber: 0,
        winCount: 0,

        checkWin: function () {
            // If both attackerHP and defenderHP are <= 0, then somebody won or lost!
            if (this.attackerHP <= 0 || this.defenderHP <= 0) {
                if (this.attackerHP > this
                    .defenderHP) { // You win the attack, on to the next character

                    // increment the win count
                    this.winCount++;

                    //remove the defender from the page and remove the text
                    $("#result").text("You have defeated " + characters[this.myDefenderIndex]
                        .name + "! You can choose to fight another enemy.");
                    $(".defender-char").remove();
                    $("#attacker-text").text("");
                    $("#defender-text").text("");

                    if (this.winCount == 3) {
                        $("#result").text("You win the game! Congrats! Click to replay! ")
                            .append($(
                                "<button>").attr({
                                    "class": "reload"
                                }).html("Refresh Page"));
                        return false;
                    } else {
                        //set defenderindex to -1 to reset the defenders
                        this.myDefenderIndex = -1;
                        this.attackerHP = characters[this.myCharacterIndex].healthPoints;
                        return true;
                    }


                } else { // You lose the game, so sorry :(
                    // Remove the attack text

                    $("#attacker-text").text("");
                    $("#defender-text").text("");

                    // Add the result text and button to enable page refresh
                    $("#result").text("You lose the game, click to replay!").append($(
                        "<button>").attr({
                            "class": "reload"
                        }).html("Refresh Page"));

                    return true;
                }
            }
        },

        // Function: main attack 
        doAttack: function () {
            // If attackerHP and defenderHP are 0, then it's a brand new game.
            // return null since it's invalid
            if (this.attackerHP == 0 && this.defenderHP == 0) {
                return null;
            }
            // Check for a win condition. Shouldn't ever hit this but just in case!
            if (this.checkWin()) {
                return false;
            } else { // Otherwise do the attack!
                this.attackNumber++;
                console.log(this);

                // Attack!
                var attackValue = characters[this.myCharacterIndex].attackPower * this
                    .attackNumber;
                var defendValue = characters[this.myDefenderIndex].counterAttackPower;
                this.attackerHP -= characters[this.myDefenderIndex].counterAttackPower;
                console.log(this.attackerHP);

                //defender hp
                this.defenderHP -= characters[this.myCharacterIndex].attackPower * this
                    .attackNumber;
                console.log(this.defenderHP);

                // Print out the attack and defend text
                var attackText = "You attacked " + characters[this.myDefenderIndex]
                    .name +
                    " for " +
                    attackValue + " damage.";
                var defendText = characters[this.myDefenderIndex].name +
                    " attacked you for " +
                    defendValue + " damage.";
                $("#attacker-text").text(attackText);
                $("#defender-text").text(defendText);

                // Redisplay the characters with new HP values
                $("#char" + this.myDefenderIndex + ".defender-char").remove();
                $("#defender-section").append(renderCharacter(this.myDefenderIndex, this
                    .defenderHP, "defender-char"));
                $("#char" + this.myCharacterIndex + ".selected-char").remove();
                $("#your-character").append(renderCharacter(this.myCharacterIndex, this
                    .attackerHP, "selected-char"));

                // Check win again after the attack
                this.checkWin();
            }
        }
    };

    //Function: start a new game
    function startGame() {
        // Reset the game variable
        game.myCharacterIndex = -1;
        game.myDefenderIndex = -1;
        game.attackerHP = 0;
        game.defenderHP = 0;
        game.attackNumber = 0;
        game.winCount = 0;

        // Display the characters on the page
        characters.forEach(function (character, index) {
            $("#characters").append(renderCharacter(index, characters[index]
                .healthPoints,
                "select-char"));
        });
    };

    // Bind on click for selecting the character you want to play
    $(document).on("click", ".select-char", function () {
        game.myCharacterIndex = $(this).attr("char-index");
        characters.forEach(function (character, index) {
            if (index == game.myCharacterIndex) {
                $("#your-character").append(renderCharacter(index, characters[index]
                    .healthPoints, "selected-char"));
            } else {
                $("#enemies-available").append(renderCharacter(index, characters[
                    index]
                    .healthPoints, "enemy-char"));
            }

        });

        game.attackerHP = characters[game.myCharacterIndex].healthPoints;
        $(".select-char").remove();
    });

    // Bind on click for selecting the character you want to attack
    $(document).on("click", ".enemy-char", function () {
        if (game.myDefenderIndex == -1) {
            //make sure result text is blank
            $("#result").text("");

            game.myDefenderIndex = $(this).attr("char-index");
            $("#defender-section").append(renderCharacter(game.myDefenderIndex, characters[
                game
                    .myDefenderIndex].healthPoints,
                "defender-char"));
            $(this).remove();

            //set HP
            game.defenderHP = characters[game.myDefenderIndex].healthPoints;
        }

    });

    // Bind on click to the attack button
    $("#attack").on("click", function () {
        if (game.myDefenderIndex != -1 && game.myCharacterIndex != -1 && game.winCount < 3) {
            game.doAttack();
        } else if (game.myCharacterIndex != -1) {
            //select a new character
        } else if (game.myDefenderIndex != -1) {
            //select a defender
        }
    });

    // Bind reload click to reload the webpage and start a new game
    $(document).on("click", ".reload", function () {
        location.reload(true);
    });

    // Start the game!
    startGame();
});