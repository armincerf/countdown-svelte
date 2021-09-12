import { lookupWord } from "../helpers";
import { derived, writable } from "svelte/store";

export const LETTERS_COUNT = 9;
let vowels = [
  ..."A".repeat(15),
  ..."E".repeat(21),
  ..."I".repeat(13),
  ..."O".repeat(13),
  ..."U".repeat(5),
];
let consonants = [
  ..."B".repeat(2),
  ..."C".repeat(3),
  ..."D".repeat(6),
  ..."F".repeat(2),
  ..."G".repeat(3),
  ..."H".repeat(2),
  ..."J".repeat(1),
  ..."K".repeat(1),
  ..."L".repeat(5),
  ..."M".repeat(4),
  ..."N".repeat(8),
  ..."P".repeat(4),
  ..."Q".repeat(1),
  ..."R".repeat(9),
  ..."S".repeat(9),
  ..."T".repeat(9),
  ..."V".repeat(1),
  ..."W".repeat(1),
  ..."X".repeat(1),
  ..."Y".repeat(1),
  ..."Z".repeat(1),
];
const isVowel = (letter: any) => ["A", "E", "I", "O", "U"].includes(letter);
const isConsonant = (letter: any) =>
  [
    "B",
    "C",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ].includes(letter);

const isLetter = (letter: any) => isVowel(letter) || isConsonant(letter);

const hasNoLetters = (isVowel: boolean) => {
  return isVowel ? !vowels.length : !consonants.length;
};

export function getLetter(letters: string[]): string {
  letters.sort(() => 0.5 - Math.random());
  return letters.pop() || "A";
}

const INITIAL_BOARD = Array(LETTERS_COUNT).fill("");

export const board = writable(INITIAL_BOARD);

export const resetBoard = () => {
  board.set(INITIAL_BOARD);
};

export const addLetter = (isVowel: boolean) => {
  const letters = isVowel ? vowels : consonants;
  board.update((board) => {
    const length = board.length;
    const filteredBoard = board.filter((letter) => isLetter(letter));
    const realLength = filteredBoard.length;
    const newBoard = [
      ...filteredBoard,
      getLetter(letters),
      ...Array(length - realLength - 1).fill(""),
    ];
    if (realLength + 1 === LETTERS_COUNT) {
      lookupWord(newBoard.join(""));
    }
    return newBoard;
  });
};

export const boardCount = derived(
  board,
  ($board) => $board.filter(isLetter).length
);

export const boardFull = derived(boardCount, ($count) =>
  $count === LETTERS_COUNT
    ? "Board Full"
    : hasNoLetters(true)
    ? "No Vowels Left"
    : hasNoLetters(false)
    ? "No Consonants Left"
    : null
);

export const boardConsonantCount = derived(
  board,
  ($board) => $board.filter(isConsonant).length
);

export const boardVowelCount = derived(
  board,
  ($board) => $board.filter(isVowel).length
);

export const boardWord = derived(board, ($board) =>
  $board.join("").toUpperCase()
);
