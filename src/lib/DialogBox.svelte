<script>
    import { gamePaused, showDialog, selectedEffect } from './stores';
  
    let effects = ['Weather', 'Poke', 'Bored', 'Dog', 'Joke', 'NASA', 'Rick', 'Robohash'];
  
    function selectEffect(event) {
      const effect = event.target.value;
      if (effect !== "Select an effect") {
        showDialog.set(false);
        gamePaused.set(false);
        selectedEffect.set(effect);
      }
    }
  </script>
  
  {#if $showDialog}
    <div class="dialog-container">
      <div class="dialog">
        <h2>Select the API to trigger through Chainlink function</h2>
        <p>You got rewarded to enter Chainlink activation zone!</p>
        <select on:change={selectEffect}>
          <option>Select an effect</option>
          {#each effects as effect}
            <option>{effect}</option>
          {/each}
        </select>
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
      width: 400px;
      padding: 20px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .dialog h2 {
      margin: 0 0 20px;
    }
    .dialog p {
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
    }
    .dialog select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  </style>
  