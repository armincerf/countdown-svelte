<script lang="ts">
  import { dev } from "$app/env";
import { lookupWord } from "../helpers";
  import { boardWord, board } from "../stores/board";

  let word = "";
  let answers: string[] = [];
  
  const checkWord = async () => {
    if (word.length < 3) {
      answers = ["Word must be at least 3 letters long"];
    } else {
      // check if word is an anagram of board
      const isSubanagram = () => {
        const wordLetters = word.toUpperCase().split("");
        const wordLetterCounts = wordLetters.reduce((acc, letter) => {
          acc[letter] = (acc[letter] || 0) + 1;
          return acc;
        }, {} as { [letter: string]: number });
        const boardLetterCounts = $board.reduce((acc, letter) => {
          acc[letter] = (acc[letter] || 0) + 1;
          return acc;
        }, {} as { [letter: string]: number });
        console.log(wordLetterCounts, boardLetterCounts);

        return Object.keys(wordLetterCounts).every((letter) => {
          return boardLetterCounts[letter] >= wordLetterCounts[letter];
        });
      };

      console.log(
        `${word} is ${
          isSubanagram() ? "" : "not "
        }a subanagram of ${$boardWord}`
      );

      if (isSubanagram()) {
        const results: string[] = await lookupWord(word);
        // return first result if word is in it
        const result = results.find((result) => result === word);
        if (result) {
          answers = [
            `Well done! '${word}' is in the dictionary and will earn you ${word.length} points!`,
          ];
        } else {
          answers = ["sorry, thats not in the dictionary"];
        }
      } else {
        answers = [`${word.toUpperCase()} is not an anagram of ${$boardWord}`];
      }
    }
  };
  const showAnswers = async () => {
    answers = await lookupWord($boardWord);
  };
</script>

<div>
  <input type="text" class="input" bind:value={word} />
  <button on:click={checkWord} class="btnPrimary">Check Word</button>
</div>
<button class="btnPrimary" on:click={showAnswers}> Show Answers </button>

<div class="answers">
  {#each answers as answer}
    <p>
      {answer}
    </p>
  {/each}
</div>
{#if dev}
  {JSON.stringify({ answers, word }, null, 4)}
{/if}
