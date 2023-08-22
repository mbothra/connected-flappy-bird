<script>
    import { showDialog, selectedEffect, loadingDialog } from './stores';
  
    let effects = ['Weather', 'Poke', 'Bored', 'Dog', 'Joke', 'NASA', 'Rick', 'Robohash'];
  
    function selectEffect(event) {
      const effect = event.target.value;
      console.log("selectEffect called")
      if (effect !== "Select an effect") {
        selectedEffect.set(effect);
        loadingDialog.set(true);
      } else {
        loadingDialog.set(false);
      }
    }
  </script>
  
  {#if $showDialog}
    <div class="dialog-container">
      <div class="dialog">
        <div class="dialog-box">
        <h2>You got rewarded to enter Chainlink activation zone!</h2>
        <p>Select the API to trigger through Chainlink function</p>
        <select on:change={selectEffect}>
          <option selected>Select an effect</option>
          {#each effects as effect}
            <option>{effect}</option>
          {/each}
        </select>
      </div>
        {#if $loadingDialog}
        <div class="loading-overlay">
          <div class="loading-text">
            Calling API through Chainlink Functions<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span>
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
    width: 400px;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 0;
  }
    .dialog h2 {
      margin: 0 0 20px;
      font-family: 'Montserrat'; /* Playful font */
    }
    .dialog p {
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
      font-family: 'Montserrat'; /* Playful font */
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
    animation-name: bounce;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
  }
  .dot1 {
    animation-delay: 0.5s;
  }
  .dot2 {
    animation-delay: 0.75s;
  }
  .dot3 {
    animation-delay: 1s;
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
  }

  </style>
  