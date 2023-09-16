<script>
    import { showDialog, selectedEffect, loadingDialog, showBigDialog } from './stores';
    import { fade } from 'svelte/transition';

    let effects = ['Weather', 'Pokemon', 'Bored', 'Dog', 'Joke', 'NASA', 'Rick & Morty', 'Robohash'];
    let gifUrl = '';
    let displayText = '';

    function selectEffect(event) {
      const effect = event.target.value;
      console.log("selectEffect called")
      if (effect !== "Select an effect") {
        selectedEffect.set(effect);
        loadingDialog.set(true);
        // Decide which GIF and text to display based on the selected effect
        switch(effect) {
          case 'Pokemon':
            gifUrl = '/pokemon.gif'; // Replace with your GIF's path
            displayText = 'Choosing your Pokemon using Chainlink Functions';
            showBigDialog.set(true);
            break;
          case 'Weather':
            gifUrl = '/map1.gif'; // Replace with your GIF's path
            displayText = 'Getting temperature of a random location coordinates for you!';
            showBigDialog.set(true);
            break;     
          case 'Bored':
            gifUrl = '/bored.gif'; // Replace with your GIF's path
            displayText = 'Calling Bored API through Chainlink Functions!';
            showBigDialog.set(true);
            break;       
          case 'Dog':
            gifUrl = '/dog.gif'; // Replace with your GIF's path
            displayText = 'Calling Dog API through Chainlink Functions!';
            showBigDialog.set(true);
            break;    
          case 'Joke':
            gifUrl = '/joke.gif'; // Replace with your GIF's path
            displayText = 'Calling Joke API through Chainlink Functions!';
            showBigDialog.set(true);
            break;  
          case 'NASA':
            gifUrl = '/nasa.gif'; // Replace with your GIF's path
            displayText = 'Calling NASA space API through Chainlink Functions!';
            showBigDialog.set(true);
            break;  
          case 'Rick & Morty':
            gifUrl = '/rick.gif'; // Replace with your GIF's path
            displayText = 'Calling Rick & Morty API through Chainlink Functions!';
            showBigDialog.set(true);
            break;  
          case 'Robohash':
            gifUrl = '/robohash.gif'; // Replace with your GIF's path
            displayText = 'Calling Robohash API through Chainlink Functions!';
            showBigDialog.set(true);
            break; 
          default:
            gifUrl = '';
            displayText = '';
        }

      } else {
        loadingDialog.set(false);
      }
    }
  </script>
  
  {#if $showDialog}
    <div class="dialog-container" transition:fade>
      <div class="dialog">
        <div class="dialog-box">
        <h2>Activate your Special Power</h2>
        <p>You can activate a special power using the Chainlink Functions API whenever you enter the Functions Activation Zone.</p>
        <select on:change={selectEffect}>
          <option selected>Choose a special power</option>
          {#each effects as effect}
            <option>{effect}</option>
          {/each}
        </select>
      </div>
        {#if $loadingDialog}
        {#if !$showBigDialog}

        <div class="loading-overlay">
          <div class="loading-text">
              Calling API through Chainlink Functions<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span>
          </div>
          </div>
          {/if}
        {/if}
        {#if $showBigDialog}
        <div class="big-dialog-container" transition:fade>
            <div class="big-dialog">
                <img src={gifUrl} alt="Loading GIF" class="big-loading-gif">
                <div class="big-loading-text">
                  <div class="big-loading-text-content">
                    {displayText}
                    <span class="dot dot1">.</span>
                    <span class="dot dot2">.</span>
                    <span class="dot dot3">.</span>
                </div>
              </div>
            </div>
        </div>
    {/if}
    </div>
    </div>
  {/if}
  
  <style>
    .dialog-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .dialog {
    position: relative; /* so that the overlay positions relative to this element */
  }

  .dialog-box {
    width: 640px;
    padding: 40px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 0;
  }
    .dialog h2 {
      margin: 0 0 20px;
      font-family: 'Circular'; /* Playful font */
      text-align: center;
      font-size: 1.6em;
    }
    .dialog p {
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
      font-family: 'Circular-Light'; /* Playful font */
      text-align: center;
    }
    .dialog select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .loading-text {
      flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Montserrat'; /* Playful font */
  }
  .dot {
  animation-name: bounce !important;
  animation-duration: 1.5s !important;
  animation-iteration-count: infinite !important;
  font-size: 50px;

  margin-top: -22px;
    margin-left: 2px;

}
  .dot1 {
    animation-delay: 0.5s;
    font-size: 50px;
  }
  .dot2 {
    animation-delay: 0.75s;
    font-size: 50px;
  }
  .dot3 {
    animation-delay: 1s;
    font-size: 50px;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1; /* so it appears on top of the dialog content */
    flex-direction: column; /* this stacks gif and text vertically */
  }

  .loading-gif {
    width: 200px; /* increased size of the gif */
    height: auto;
    margin-bottom: 10px; /* added space between gif and text */
    -webkit-mask-image: radial-gradient(transparent 0%, transparent 10%, white 10%, white 90%, transparent 90%, transparent 100%);
    -moz-mask-image: radial-gradient(transparent 0%, transparent 10%, white 10%, white 90%, transparent 90%, transparent 100%);
    mask-image: radial-gradient(transparent 0%, transparent 10%, white 10%, white 90%, transparent 90%, transparent 100%);
    margin-top: 20px;
}

.big-dialog-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);  /* more transparent background */
}


.big-dialog {
    width: 500px;  /* bigger than your other dialog */
    padding: 20px;
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);  /* stronger shadow for emphasis */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.big-loading-gif {
    width: 300px;  /* bigger GIF for emphasis */
    height: auto;
    margin-bottom: 20px;
    border-radius: 15px;
}

.big-loading-text {
    text-align: center;
    font-size: 18px;
    color: #333;
    font-family: 'Montserrat';
    display: flex;
    justify-content: center; /* Center content horizontally */
    align-items: center;     /* Center content vertically */
}

.big-loading-text-content {
    display: flex;
    align-items: center;     /* Ensure dots and text are vertically aligned */
}


  </style>
  