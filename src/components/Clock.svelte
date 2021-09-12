<script lang="ts">
  import { drawClock } from "../helpers";
  import { onMount } from "svelte";
  import { time } from "../stores/countdown-timer";
  let canvas: HTMLCanvasElement;
  let width = 250;
  let pixelRatio = 2;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    let frame = requestAnimationFrame(loop);
    let scaled = false;
    pixelRatio = window.devicePixelRatio;
    function loop() {
      frame = requestAnimationFrame(loop);
      drawClock(ctx, $time, width);
      !scaled && ctx.scale(pixelRatio, pixelRatio);
      scaled = true;
    }
    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<div class="flex justify-center">
  <canvas
    style="width: {width}px; height: {width}px;"
    bind:this={canvas}
    width={width * pixelRatio}
    height={width * pixelRatio}
  />
</div>
<label
  for="clock"
  class="timer inline-block border-2 border-black bg-gray-300 px-4 m-4 font-mono"
>
  {Math.ceil($time)}
</label>
