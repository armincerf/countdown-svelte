<script lang="ts">
  import {
    timer,
    time,
    isRunning,
    isComplete,
    GAME_TIME,
  } from "../stores/countdown-timer";

  import { dev } from "$app/env";
  import Answers from "./Answers.svelte";
  import {
    board,
    LETTERS_COUNT,
    addLetter,
    boardCount,
    boardFull,
    boardConsonantCount,
    boardVowelCount,
    resetBoard,
  } from "../stores/board";
  let types = [
    {
      name: "Vowel",
      vowel: true,
    },
    {
      name: "Consonant",
      vowel: false,
    },
  ];

  const reset = () => {
    timer.reset();
    resetBoard();
  };
  const randomFill = () => {
    Array(LETTERS_COUNT)
      .fill(null)
      .forEach((_, i) => {
        setTimeout(() => {
          addLetter(!!Math.round(Math.random()));
        }, i * 100);
      });
  };
  $: limitReached = (isVowel: boolean) => {
    const maxAllowed =
      LETTERS_COUNT -
      (isVowel ? Math.floor(LETTERS_COUNT / 2) : Math.floor(LETTERS_COUNT / 3));
    const currentCount = isVowel ? $boardVowelCount : $boardConsonantCount;
    return currentCount === maxAllowed;
  };
</script>

<div class="letter-buttons">
  <div class="flex-1">
    <div class="inline-flex">
      <span class="relative z-0 inline-flex rounded-md">
        {#each types as type}
          <button
            on:click={() => addLetter(type.vowel)}
            class={type.vowel ? "groupedBtnL" : "groupedBtn"}
            disabled={!!$boardFull || limitReached(type.vowel)}
            title={$boardFull}
          >
            {type.name}
          </button>
        {/each}
        <button
          class="groupedBtnR"
          disabled={!!$boardFull}
          on:click={randomFill}
        >
          Random Fill
        </button>
      </span>
    </div>
  </div>
</div>

<div class="flex flex-col items-center">
  {#if $boardCount > 0}
    <button class="btnDanger" on:click={reset}>Reset</button>
  {/if}
  {#if $boardFull}
    {#if $isComplete}
      <Answers />
    {:else if !$isRunning}
      <button class="btnPrimary" on:click={() => timer.start()}>
        {$time < GAME_TIME ? "Resume" : "Start"}
      </button>
    {:else}
      <button class="btn" on:click={() => timer.pause()}> Pause </button>
    {/if}
  {/if}
  {#if dev}
    {JSON.stringify(
      {
        board: $board,
        isRunning: $isRunning,
        time: $time,
        boardConsonantCount: $boardConsonantCount,
        boardVowelCount: $boardVowelCount,
        boardFull: $boardFull,
      },
      null,
      4
    )}
  {/if}
</div>
