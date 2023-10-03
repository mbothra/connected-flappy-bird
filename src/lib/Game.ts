import { shouldChangePipe, season, gamePaused, showDialog, selectedEffect, loadingDialog, showBigDialog, showContractDialog, saveScoreButton } from './stores';
// import functionCall from './function-call';
import "@fontsource/montserrat"; // Defaults to weight 400
import "@fontsource/montserrat/400.css"; // Specify weight
import "@fontsource/montserrat/400-italic.css"; // Specify weight and style
import { ethers } from 'ethers';
import ABI from './abi.json';  // Replace with your ABI path
import ScoreABI from './score_abi.json';  // Replace with your ABI path
import '@chainlink/design-system/global-styles.css';

// test
enum APIType {
    Weather = 0,
    Poke=1,
    Bored=2,
    Dog=3,
    Joke=4,
    NASA=5,
    Rick=6,
    Robohash=7,
}

export interface Frame {
    firstPipe: PipePair;
    secondPipe: PipePair;
    gameOver: boolean;
    gameStarted: boolean;
    width: number;
    height: number;
    score: number;
    functionScore: number;
    ground: Ground;
    bird: Bird;
    background: string; // Add this line
    infoMessage: string; // Initialize with empty string
}

export interface Web3Account {
    signer: ethers.Signer;
    provider: ethers.providers.Web3Provider;
    chainId: number;
    account: string;
}

export interface PipePair {
    topPipe: Pipe;
    bottomPipe: Pipe;
    show: boolean;
    left: number;
    width: number;
    apiCallZone: ApiCallZone;
}

export interface Pipe {
    top: number;
    height: number;
}

export interface Ground {
    height: number;
}

export interface Bird {
    top: number;
    left: number;
    size: number;
    img: string;
    imgN: number;
    thoughtText: string;
}

export interface ApiCallZone {
    left: number;
    width: number;
    top: number;
    height: number;
    show: boolean;
    effect: string; // Define effects like "weather", "financial", etc.
    leftAdjustment: number,
    topAdjustment: number,
    widthAdjustment: number,
    apiCallZoneHeight: number,
}
  
const infuraRpcUrl = 'HTTPS://api.avax-test.network/ext/bc/C/rpc'; // Replace with your Infura RPC URL
const provider = new ethers.providers.JsonRpcProvider(infuraRpcUrl);
const yourPrivateKey = 'f11ffe0c2a41fb52c9112793ce2fbad6ce48eaeca11b493421a26f7c234ec6fe'; // Replace with your private key
const signer = new ethers.Wallet(yourPrivateKey, provider);

async function getWeb3Account() {
    const account = await signer.getAddress();
    const chainId = (await provider.getNetwork()).chainId;
    return {
        signer: signer,
        provider: provider,
        chainId: chainId,
        account: account
    };
}

const hexToString = (hex: string): string => {
    hex = hex.slice(2); // remove the first two characters
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        const hexValue = hex.substr(i, 2);
        const decimalValue = parseInt(hexValue, 16);
        str += String.fromCharCode(decimalValue);
    }
    return str;
    };

export async function pushScore(playerName: string, score: number, functionScore: number) {
    showContractDialog.set(true)
    const { signer, provider, chainId, account } = await getWeb3Account();
    // const contractAddress = "0x4201DBeBb6A00af00bDDb511aA628bDf8096b8B4"; // replace with your contract address
    const contractAddress = "0xb399Bd7E068170be488A1321b4EC7361293D95ad"; // replace with your contract address

    const contract = new ethers.Contract(contractAddress, ScoreABI, provider);
    const contractWithSigner = contract.connect(signer);
    try {
        // Replace this with the actual method from your smart contract
        const result = await contractWithSigner.storeAndMint(playerName, score, functionScore);
        await result.wait();  
        showContractDialog.set(false)
        saveScoreButton.set(false)
    } catch (error) {
        console.error("Error calling API:", error);
        showContractDialog.set(false)
        saveScoreButton.set(false)
    }
}
          
export class GameController {
    private frame: Frame;

    private velocity = 0;

    constructor(
        public readonly height = 970,
        public readonly width = 1710,
        public pipeWidth = 100,
        public pipeGap = 500,
        public readonly minTopForTopPipe = 70,
        public readonly maxTopForTopPipe = 350,
        public readonly generateNewPipePercent = 0.6,
        public speed = 14,
        public readonly groundHeight = 20,
        public readonly birdX = 40,
        public readonly birdSize = 100,
        public readonly gravity = 1.7,
        public jumpVelocity = 15,
        public slowVelocityBy = 0.6
    ) { }
    public newGame() {
        this.pipeWidth = this.defaultValues.pipeWidth;
        this.pipeGap = this.defaultValues.pipeGap;
        this.speed = this.defaultValues.speed;
        this.jumpVelocity = this.defaultValues.jumpVelocity;
        this.slowVelocityBy = this.defaultValues.slowVelocityBy;
    
        let firstPipe = this.createPipe(true);
        let secondPipe = this.createPipe(false);

        this.frame = {
            firstPipe,
            secondPipe,
            gameOver: false,
            gameStarted: false,
            width: this.width,
            height: this.height,
            score: 0,
            functionScore: 0,
            ground: {
                height: this.groundHeight,
            },
            bird: {
                left: this.birdX,
                top: this.height / 2 - this.birdSize / 2,
                size: this.birdSize,
                img: "Wizard.png",
                imgN: 0,
                thoughtText: ""
            },
            background: "default.png", // Initialize with a default image or color
            infoMessage: "" // Initialize with empty string
        };
        return this.frame;
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    private readonly defaultValues = {
        pipeWidth: 100,
        pipeGap: 500,
        speed: 14,
        jumpVelocity: 15,
        slowVelocityBy: 0.6
    };

    private async callAPI(apiType: APIType) {
        const { signer, provider, chainId, account } = await getWeb3Account();

        const contractAddress = "0x6e579b283e573E0758a08D8b116e71f7bAeDa35A"; // replace with your contract address
        const contract = new ethers.Contract(contractAddress, ABI, provider);
        const contractWithSigner = contract.connect(signer);
        try {
            // Replace this with the actual method from your smart contract
            const result = await contractWithSigner.getEnumValue(apiType);
            const ret = hexToString(result);
            return ret
        } catch (error) {
            console.error("Error calling API:", error);
        }
    }


    private async handleEffect(effect: string) {
        // this.frame.infoMessage = "Triggering Chainlink Functions: Calling weather API"
        // await this.delay(1000);  // Wait for 1 second (1000 milliseconds)
        this.frame.infoMessage = "Submitting Transaction to Functions consumer contract."
        await this.delay(500);  // Wait for 1 second (1000 milliseconds)
        this.frame.infoMessage = "Submitting Transaction to Functions consumer contract.."
        await this.delay(500);  // Wait for 1 second (1000 milliseconds)
        this.frame.infoMessage = "Submitting Transaction to Functions consumer contract..."
        await this.delay(500);  // Wait for 1 second (1000 milliseconds)
        // this.frame.infoMessage = "Transaction Confirmed and Response returned to Client Contract.."
        // await this.delay(500);  // Wait for 1 second (1000 milliseconds)

        let temp;
        switch (effect) {
            case 'Weather':
              temp = await this.callAPI(APIType.Weather);
              this.handleWeather(temp)
              break;
            case 'Pokemon':
              temp = await this.callAPI(APIType.Poke);
              this.handlePokemon(temp);
              break;
            case 'Bored':
              temp = await this.callAPI(APIType.Bored);
              this.handleBored(temp)
              break;
            case 'Dog':
              temp = await this.callAPI(APIType.Dog);
              this.handleDog(temp)
              break;
            case 'Joke':
              temp = await this.callAPI(APIType.Joke);
              this.handleJoke(temp)
              break;
            case 'NASA':
              temp = await this.callAPI(APIType.NASA);
              this.handleNASA(temp)
              break;
            case 'Rick & Morty':
              temp = await this.callAPI(APIType.Rick);
              this.handleRick(temp)
              break;
            case 'Robohash':
                temp = await this.callAPI(APIType.Robohash);
                this.handleRobohash(temp)
            // ... Handle other cases
                break;
          }
        await this.delay(1000);  // Wait for 1 second (1000 milliseconds)
        this.frame.infoMessage = ""
        loadingDialog.set(false)
        showDialog.set(false);
        gamePaused.set(false);    
        selectedEffect.set(null);
        showBigDialog.set(false);
      }
      
    private handleWeather(temperature: string | undefined) {
        // Define a list of backgrounds for each weather
        let currentWeather: string;
        if (typeof temperature === 'undefined') {
            console.error('Temperature is undefined');
            return;
        }    
        const temp = parseFloat(temperature);
        if (temp < 273.15) { // Below 0°C
            currentWeather = 'winter';
        } else if (temp >= 273.15 && temp < 283.15) { // 0°C to 10°C
            currentWeather = 'spring';
        } else if (temp >= 283.15 && temp < 293.15) { // 10°C to 20°C
            currentWeather = 'autumn';
        } else { // Above 20°C
            currentWeather = 'summer';
        }
        if (this.frame.background.includes(currentWeather)){
            currentWeather = 'surprise'
        }

        if(currentWeather == 'autumn' ) {
            this.frame.background = `${currentWeather}.webp`;
        } else if(currentWeather == 'summer'){
            this.frame.background = `${currentWeather}.jpeg`;
        } else {
            this.frame.background = `${currentWeather}.png`;
        }
        if(currentWeather != 'surprise') {
            this.frame.bird.img = `${currentWeather}_up.png`;
        }
        season.set(currentWeather)
    }

    private handleRobohash(url: string | undefined) {
        if (url !== undefined) {
            this.frame.bird.img = url;
          } else {
            // Handle the case where the API call failed or returned an undefined result
          }
    }
    

    private handlePokemon(id: string | undefined) {
        if (id !== undefined) {
            this.frame.bird.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;;
          } else {
            // Handle the case where the API call failed or returned an undefined result
          }
    }

    private handleRick(url: string | undefined) {
        if (url !== undefined ) {
            this.frame.bird.thoughtText = url;
        } else {
        }        
    }

    private handleNASA(url: string | undefined) {
        if (url !== undefined) {
            this.frame.background = url;
          } else {
            // Handle the case where the API call failed or returned an undefined result
          }
    }

    private handleJoke(url: string | undefined) {
        if (url !== undefined && url !== "") {
            this.frame.bird.thoughtText = url;
        } else {
            this.frame.bird.thoughtText = 'Orion’s Belt is a huge waist of space.';
        }        
    }

    private handleDog(url: string | undefined) {
        if (url !== undefined) {
            this.frame.bird.thoughtText = url;
          } else {
            // Handle the case where the API call failed or returned an undefined result
          }
    }

    private handleBored(url: string | undefined) {
        if (url !== undefined) {
            this.frame.bird.thoughtText = url;
          } else {
            // Handle the case where the API call failed or returned an undefined result
          }
    }

    private createApiCallZone(effect: string, top: number, bottom: number, showPipe: boolean, score: number): ApiCallZone {
        let show = false;
        if ([3,6,9].includes(score)) { // 50% chance
            show = true;
        }
    
        const leftAdjustment = Math.floor(Math.random() * 101) + 350;
        const topAdjustment = Math.floor(Math.random() * 151) - 50; // will give a value between -50 and 100
        const widthAdjustment = Math.floor(Math.random() * 101) + 200;
        const apiCallZoneHeight = Math.floor(Math.random() * 101) + 300;
    
        return {
            left: this.width - this.pipeWidth - leftAdjustment - 400,
            width: this.pipeWidth + widthAdjustment + 200, // Incremented width
            top: top + topAdjustment + 50, // Increment or decrement top
            height: apiCallZoneHeight, // Random height between 300-400
            show: showPipe && show,
            leftAdjustment,
            topAdjustment,
            widthAdjustment,
            apiCallZoneHeight,
            effect,
        };
    }   
    

    private async hasEnteredApiCallZone() {
        for (const pipe of [this.frame.firstPipe, this.frame.secondPipe]) {
            if (pipe.apiCallZone?.show) {
                // Calculate the distance from the bird to the API call zone
                const distanceToZone = pipe.apiCallZone.left - (this.frame.bird.left + this.birdSize);

                // Calculate the time it will take for the bird to reach the API call zone
                const timeToZone = distanceToZone / this.speed;

                if (
                    this.frame.bird.left + this.birdSize >= pipe.apiCallZone.left &&
                    this.frame.bird.left <= pipe.apiCallZone.left + pipe.apiCallZone.width &&
                    this.frame.bird.top + this.birdSize >= pipe.apiCallZone.top &&
                    this.frame.bird.top <= pipe.apiCallZone.top + pipe.apiCallZone.height
                ) {
                    this.frame.functionScore += 1;
                    gamePaused.set(true);
                    showDialog.set(true);
                    // Declare a variable to hold the unsubscribe function
                    let unsubscribe: (() => void) | null = null;
                    let effectSelected = false; // Add this flag to track whether the effect has been selected

                    // Define your callback function
                    const callback = (effect: string | null) => {
                        if (effect !== null && !effectSelected) {
                            effectSelected = true; // Set the flag to true when the effect is selected
                            this.handleEffect(effect);

                            // Hide the zone after entering it
                            pipe.apiCallZone.show = false;
                            if (unsubscribe) {
                            unsubscribe();
                            }
                        }
                    };

                    // Now, subscribe and assign the unsubscribe function to the variable
                    unsubscribe = selectedEffect.subscribe(callback);

                }
            } 
        }
    }
    

    private randomYForTopPipe(): number {
        return (
            this.minTopForTopPipe +
            (this.maxTopForTopPipe - this.minTopForTopPipe) * Math.random()
        );
    }
    
    private getPipeGap(score: number): number {
        const maxWidth = this.pipeGap;   // the original width of the pipe
        const minWidth = maxWidth * 0.5;  // 50% of the original width, or choose any value you find challenging
        const reductionFactor = 0.0001;    // this will reduce width by 0.5% for every point increase in score
    
        const adjustedWidth = maxWidth - (score * reductionFactor * maxWidth);
    
        // Ensure the width doesn't get below the minimum width
        return Math.max(minWidth, adjustedWidth);
    }

    private createPipe(show: boolean): PipePair {
        const height = this.randomYForTopPipe();
        this.pipeGap = this.frame ? this.getPipeGap(this.frame.score) : this.getPipeGap(0);
        let apiCallZone = this.frame ? this.createApiCallZone("Weather", height, this.pipeGap, show, this.frame.score): this.createApiCallZone("Weather", height, this.pipeGap, show, 0);
        return {
            topPipe: {
                top: 0,
                height,
            },
            bottomPipe: {
                top: height + this.pipeGap,
                height: this.height,
            },
            left: this.width - this.pipeWidth,
            width: this.pipeWidth,
            show,
            apiCallZone: apiCallZone,
        };
    }

    private movePipe(pipe: PipePair, otherPipe: PipePair) {
        if (pipe.show && pipe.left <= this.pipeWidth * -1) {
            pipe.show = false;
            return pipe;
        }

        if (pipe.show) {
            pipe.left -= this.speed;
            if (pipe.apiCallZone.show) {
                pipe.apiCallZone.left -= this.speed
            }
        }

        if (
            otherPipe.left < this.width * (1 - this.generateNewPipePercent) &&
            otherPipe.show &&
            !pipe.show
        ) {
            return this.createPipe(true);
        }

        return pipe;
    }

    private getUpdatedSpeed(score: number) {
        // const incrementJump = 0.0005 * score; // adjust this value as per your needs
        // this.jumpVelocity = this.jumpVelocity - incrementJump;

        // const decrementSlowVelocity = 0.001 * score; // adjust this value as per your needs
        // this.slowVelocityBy = this.slowVelocityBy + decrementSlowVelocity;

        // const incrementSpeed = 0.1 * score; // adjust this value as per your needs
        // this.speed = this.speed + incrementSpeed;    

    }
    
    public nextFrame() {
        if (this.frame.gameOver || !this.frame.gameStarted) {
            return this.frame;
        }
        
        this.frame.firstPipe = this.movePipe(
            this.frame.firstPipe,
            this.frame.secondPipe
        );
        this.frame.secondPipe = this.movePipe(
            this.frame.secondPipe,
            this.frame.firstPipe
        );
        this.hasEnteredApiCallZone();

        if (this.hasCollidedWithPipe()) {
            this.frame.gameOver = true;
            return this.frame;
        }

        if (
            this.frame.bird.top >=
            this.height - this.groundHeight - this.birdSize - 80) {
            this.frame.bird.top = this.height - this.groundHeight - this.birdSize;
            this.frame.gameOver = true;
            return this.frame;
        }

        //Gravity
        if (this.velocity > 0) {
            this.velocity -= this.slowVelocityBy;
        }
        this.frame.bird.top += Math.pow(this.gravity, 2) - this.velocity;


        const pipePassedLeftBound = this.frame.firstPipe.left + this.pipeWidth-13.9;
        const pipePassedRightBound = this.frame.firstPipe.left + this.pipeWidth;
        const pipePassCheckValue = this.birdX - this.speed;
        
        // Add score
        if ((pipePassCheckValue >= pipePassedLeftBound && pipePassCheckValue <= pipePassedRightBound)) {
            this.frame.score += 1;
            this.getUpdatedSpeed(this.frame.score);
        }
    
        const secondPipePassedLeftBound = this.frame.secondPipe.left + this.pipeWidth-6.9;
        const secondPipePassedRightBound = this.frame.secondPipe.left + this.pipeWidth;
        
        // Check for the second pipe
        if ((pipePassCheckValue >= secondPipePassedLeftBound && pipePassCheckValue <= secondPipePassedRightBound)) {
            this.frame.score += 1;
            this.getUpdatedSpeed(this.frame.score);
        }
    
    
        return this.frame;
    }

    public jump() {
        if (this.velocity <= 0) {
            this.velocity += this.jumpVelocity;
        }
    }

    private checkPipe(left: number) {
        return (
            left <= this.birdX + this.birdSize && left + this.pipeWidth >= this.birdX
        )
    }

    private hasCollidedWithPipe() {
        if (
            this.frame.firstPipe.show &&
            this.checkPipe(this.frame.firstPipe.left)
        ) {
            return !(
                this.frame.bird.top > this.frame.firstPipe.topPipe.height &&
                this.frame.bird.top + (this.birdSize-13) <
                this.frame.firstPipe.bottomPipe.top
            );
        }

        if (
            this.frame.secondPipe.show &&
            this.checkPipe(this.frame.secondPipe.left)
        ) {
            return !(
                this.frame.bird.top > this.frame.secondPipe.topPipe.height &&
                this.frame.bird.top + this.birdSize <
                this.frame.secondPipe.bottomPipe.top
            );
        }

        return false;
    }

    public start(height, width) {
        this.newGame();
        saveScoreButton.set(true)
        this.frame.gameOver = false;
        this.frame.gameStarted = true;
        this.frame.height = height;
        this.frame.width = width;
        return this.frame;
    }

}
