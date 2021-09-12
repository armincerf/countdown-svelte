<script lang="ts">
  import { board } from "../stores/board";
</script>

<div class="board">
  <div class="tiles">
    <div class="tileBorder">
      {#each $board as letter}
        <div class={`letter ${letter?.length && "hover"} tile`}>
          <div class="flipper">
            <div class="front" />
            <div class="back">{letter}</div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
