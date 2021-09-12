import trie from "trie-prefix-tree";
import type { RequestHandler } from "@sveltejs/kit";

let trieCache = new Map<string, trie>();

async function getWordTrie(
  dictionaryUrl: string | undefined,
  _maxLength = 9
): Promise<trie | undefined> {
  console.log(`Getting word trie from ${dictionaryUrl}`);

  if (dictionaryUrl && trieCache.get(dictionaryUrl)) {
    console.log(`Cache hit for ${dictionaryUrl}`);
    return trieCache.get(dictionaryUrl);
  }
  const regex = new RegExp(`\\d*\\W\\.*`, "gm");
  if (!dictionaryUrl) return;
  return fetch(dictionaryUrl)
    .then((response) => response.text())
    .then((words) => words.split("\n"))
    .then((words) =>
      words.filter((word) => !regex.test(word) && word.length > 2)
    )
    .then((words) => words.map((word) => word.toLowerCase()))
    .then((words) => {
      console.log(`Building trie for ${dictionaryUrl}`);

      const myTrie = trie(words);
      trieCache.set(dictionaryUrl, myTrie);
      console.log("trie built");

      return myTrie;
    });
}

type UrlType = {
  [url: string]: string;
};
type trie = {
  getSubAnagrams(word: string): string[];
};
const makeTrie = async (query: URLSearchParams): Promise<trie | undefined> => {
  const custom = query.get("custom");
  const dictionary = query.get("dictionary");
  const defaultUrl =
    "https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt";
  const urls: UrlType = {
    scrabble: defaultUrl,
    massive:
      "https://raw.githubusercontent.com/dwyl/english-words/master/words.txt",
    custom: custom?.toString(),
  };

  const url = urls[dictionary?.toString()] || defaultUrl;
  const myTrie = await getWordTrie(url?.toString());
  return myTrie;
};

const getAnagrams = (input: string, myTrie: trie): string[] => {
  console.log(`Getting anagrams for ${input}`);

  const anagrams = myTrie
    .getSubAnagrams(input)
    .sort((a, b) => b.length - a.length);

  console.log(`${anagrams.length} anagrams found`);
  return anagrams.slice(0, 10);
};

export const get: RequestHandler = async ({ params, query }) => {
  const startTime = Date.now();
  const input = params.word.slice(0, 20);
  const myTrie: trie = (await makeTrie(query)) || trie([]);
  if (!input) {
    return {
      status: 400,
      body: {
        message: "Please provide an input query parameter",
        data: ["input", input, "time", Date.now() - startTime],
      },
    };
  } else {
    console.log(`${input} took ${Date.now() - startTime}ms`);
    return {
      headers: {
        "cache-control": "public, max-age=604800, immutable",
      },
      body: getAnagrams(input.toString().toLowerCase(), myTrie),
    };
  }
};
