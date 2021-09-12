<script>
  import Controls from "../components/Controls.svelte";
  import Board from "../components/Board.svelte";
</script>

<div class="container mx-auto max-w-md flex-col justify-center">
  <h1 class="text-4xl font-semibold py-4">Countdown</h1>
  <div class="w-full items-center">
    <Board />
    <Controls />
  </div>
</div>
