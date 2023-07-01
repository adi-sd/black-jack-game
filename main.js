//Card variables
let suits = ["Hearts", "Clubs", "Spades", "Diamonds"];

let values = ["Ace" , "King", "Queen", "Jack", "Ten",
                "Nine", "Eight",  "Seven", "Six",
                "Five", "Four", "Three", "Two"];

let d_win = 0;
let p_win = 0;
let scoreCardString = "| Dealer : 0 | Player : 0 |";

//DOM variables                
let textArea = document.getElementById("text-area");
let newGameButton = document.getElementById("new-game-button");
let hitButton = document.getElementById("hit-button");
let stayButton = document.getElementById("stay-button");

let dealerCard = document.getElementById("dealer-card");
let playerCard = document.getElementById("player-card");

let dealerSpace = document.getElementById("dealer-space");
let playerSpace = document.getElementById("player-space");

let dScore = document.getElementById("d-score");
let pScore = document.getElementById("p-score");

let winMsg = document.getElementById("win-msg");
let hrLine = document.getElementById("hr-line");

let scoreCard = document.getElementById("score-card");
let resetButton = document.getElementById("reset-button")

//Game variables
let gameStarted = false,
    gameOver = false,
    gameTied = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
dealerCard.style.display = 'none';
playerCard.style.display = 'none';
hrLine.style.display = 'none';
showStatus();

//Onclick buttons operations...

resetButton.addEventListener('click', function()
{
    p_win = 0;
    d_win = 0;

    scoreCardString = "| Dealer : 0 | Player : 0 |";
    scoreCard.innerText = scoreCardString;

    startNewGame();
    
});

function startNewGame() 
{
    console.clear();
    console.log("INFO : Inside StartNewGame() function");

    dealerCard.style.display = 'block';
    playerCard.style.display = 'block';

    scoreCardString = "| Dealer : "+d_win+" | Player : "+p_win+" |";
    scoreCard.innerText = scoreCardString;

    gameStarted = true;
    gameOver = false;
    playerWon = false;
    
    deck = createDeck();
    shuffleDeck(deck);
    
    dealerCards = [ getNextCard(),  getNextCard()];


    playerCards = [ getNextCard(),  getNextCard()];
  
    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    hrLine.style.display = 'none';
    winMsg.style.display = 'none';
    showStatus();
}

newGameButton.addEventListener('click', startNewGame);

hitButton.addEventListener('click', function() 
{
    console.log("INFO : Inside hitButton Action Listener...");

    playerCards.push(getNextCard());
    checkForEndGame();
    showStatus();
});

stayButton.addEventListener('click', function() 
{
    console.log("INFO : Inside stayButton Action Listener...");

    gameOver = true;
    checkForEndGame();
    showStatus();
});

//Setting up the game...

function createDeck()
{
    console.log("INFO : Inside createDeck() function");

    let deck = [];
    for(let suitIdx = 0; suitIdx < suits.length; suitIdx++)
    {
        for(let valueIdx = 0; valueIdx < values.length; valueIdx++)
        {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            }
            deck.push( card );
        }
    }
    return deck;
}

function shuffleDeck(deck)
{
    console.log("INFO : Inside shuffleDeck() function");

    for(let i = 0; i < deck.length; i++)
    {
        let swapIdx = Math.trunc(Math.random() * deck.length);
        let temp = deck[swapIdx];
        deck[swapIdx] = deck[i];
        deck[i] = temp;
    }
}

function getCardString(card)
{
    console.log("INFO : Inside getCardString() function");

    //console.log("(@@@) "+ getCardImgPath(card));

    return card.value + " of " + card.suit;
}



//Game calculation functions...

function getScore(cardArray)
{
    console.log("INFO : Inside getScore() function");

    let score = 0;
    let hasAce = false;
    for(let i = 0; i < cardArray.length; i++)
    {
        let card = cardArray[i];
        score += getCardNumericValue(card);
        if(card.value === "Ace")
        {
            hasAce = true;
        }
    }
    if(hasAce && score + 10 <= 21)
    {
        return score + 10;
    }
    return score;
}

function getCardNumericValue(card)
{
    console.log("INFO : Inside getCardNumericValue() function");

    switch(card.value)
    {
        case "Ace":
            return 1;
        case "Two":
            return 2;
        case "Three":
            return 3;
        case "Four":
            return 4;
        case "Five":
            return 5;
        case "Six":
            return 6;
        case "Seven":
            return 7;
        case "Eight":
            return 8;
        case "Nine":
            return 9;
        default :
            return 10;
    }
}

//Actual game function...

function getNextCard()
{
    console.log("INFO : Inside getNextCard() function");

    return deck.shift();
}


function updateScores()
{
    console.log("INFO : Inside updateScores() function");

    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);

    console.log("(@) DealerScore : " + dealerScore +
                    " | PlayerScore : " + playerScore );
}

function checkForEndGame()
{
    console.log("INFO : Inside checkForEndGame() function");

    updateScores();

    if(gameOver)
    {
        while(dealerScore < playerScore
        && playerScore <= 21
        && dealerScore <= 21)
        {
            dealerCards.push(getNextCard());
            //dealerCardsImg.push(getNextCardImg(dealerCards[dealerCards.lastIndexOf]));
            updateScores();
        }
    }

    if(playerScore > 21)
    {
        playerWon = false;
        gameOver = true;
    }
    else if (dealerScore > 21)
    {
        playerWon = true;
        gameOver = true;
    }
    else if (gameOver)
    {
        if(playerScore > dealerScore)
        {
            playerWon = true;
            gameTied = false;
        }
        else if(playerScore < dealerScore)
        {
            playerWon = false;
            gameTied = false;
        }
        else
        {
            gameTied = true;
        }
        
    }
}

function showStatus()
{
    console.log("INFO : Inside showStatus() function");

    if(!gameStarted)
    {
        textArea.innerText = "Welcome to Blackjack!\n";
        return;
    }

    let dealerCardString = "";
    let dealerCardsImg = [];
    while(dealerSpace.firstChild)
    {
        dealerSpace.removeChild(dealerSpace.firstChild);
    }
    for(let i = 0; i < dealerCards.length; i++)
    {
        dealerCardString += getCardString(dealerCards[i]) + "\n";
        dealerCardsImg.push(getImgDOM(dealerCards[i]));
    }

    for(let i = 0; i < dealerCardsImg.length; i++)
    {
        console.log(dealerCardsImg[i].src);
    }

    let playerCardString = "";
    let playerCardsImg = [];
    while(playerSpace.firstChild)
    {
        playerSpace.removeChild(playerSpace.firstChild);
    }
    for(let i = 0; i < playerCards.length; i++)
    {
        playerCardString += getCardString(playerCards[i]) + "\n";
        playerCardsImg.push(getImgDOM(playerCards[i]));
    }

    for(let i = 0; i < playerCardsImg.length; i++)
    {
        console.log(playerCardsImg[i].src);
    }

    updateScores();

    dScore.innerText = 
        "Dealer - (Score: "+ dealerScore + ")\n";

    for(let i = 0; i < dealerCardsImg.length; i++)
    {
        dealerSpace.appendChild(dealerCardsImg[i]);
    }

    pScore.innerText =
        "Player - (Score: "+ playerScore + ")\n";

    for(let i = 0; i < playerCardsImg.length; i++)
    {
        playerSpace.appendChild(playerCardsImg[i]);
    }

    if(gameOver)
    {
        hrLine.style.display = "block";
        winMsg.style.display = "block";
        if(playerWon && !gameTied)
        {
            winMsg.innerText = "YOU WIN!";
            p_win++;
        }
        else if(!playerWon && !gameTied)
        {
            winMsg.innerText = "DEALER WON!";
            d_win++;
        }
        else if(gameTied)
        {
            winMsg.innerText = "GAME TIED!";
        }

        newGameButton.style.display = "inline";
        hitButton.style.display = "none";
        stayButton.style.display = "none";
    }

}

//___________________________________________________________________

function getCardImgPath(card)
{
    console.log("INFO : Inside getCardImgPath() function");

    let num = "0";
    let s = (card.suit).substring(0,1);
    //let path = "C:\\Users\\adityad\\VisualStudio\\blackjack\\PNG\\";
    let path = "PNG/";
    if(card.value !== "Ace" && card.value !== "King" &&
        card.value !== "Queen" && card.value !== "Jack")
    {
        num = getCardNumericValue(card);
    }
    else
    {
        num = (card.value).substring(0,1);
    }

    path = path + num + s + ".png";
    return path;
}

function getImgDOM(card)
{
    console.log("INFO : Inside getImgDOM() function");

    image = document.createElement("img");
    image.src = getCardImgPath(card);
    image.width = 104;
    image.height =153;
    image.hspace = 10;
    image.vspace = 10;
    return image;
}

function getNextCardImg()
{
    console.log("INFO : Inside getNextCard() function");
    return getImgDOM(deck.shift());
}