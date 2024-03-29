// @ts-nocheck
// TODO: remove ^^ (WIP)

import { useState } from "react";

import GitHubCorners from "@uiw/react-github-corners/src/index.tsx";

import "milligram";
import "./App.css";

// TODO: move to config?
const SOURCE_LINK = "https://github.com/bm9k/";
const AUTHOR_LINK = "https://bm9k.github.io/link-organiser/";

function useLocalStorage(key, initialValue) {
  const [value, setStateValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value) => {
    setStateValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, setValue];
}

function fisherYates(array, rng) {
  if (!rng) {
    rng = Math.random;
  }
  var count = array.length,
    randomnumber,
    temp;
  while (count) {
    randomnumber = (rng() * count--) | 0;
    temp = array[count];
    array[count] = array[randomnumber];
    array[randomnumber] = temp;
  }
}

function stableUnique(array) {
  const seen = new Set();
  const result = [];
  for (const value of array) {
    if (seen.has(value)) {
      continue;
    }

    seen.add(value);
    result.push(value);
  }

  return result;
}

function sfc32(a, b, c, d) {
  return function () {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    var t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function createRng(seed) {
  const [a, b, c] = [
    3141592653, // pi
    2718281828, // e
    1414213562, // sqrt(2)
  ];

  return sfc32(a, b, c, seed);
}

export default function App() {
  // 1 is used to indicate no shuffling, since it can never be
  // generated by Math.random() -> [0, 1)
  const impossibleSeed = 1;

  const [seed, setSeed] = useLocalStorage("seed", impossibleSeed);
  const [lines, setLines] = useLocalStorage("lines", "");
  const [anon, setAnon] = useLocalStorage("anonymous", false);
  const [unique, setUnique] = useLocalStorage("unique", false);

  let links = lines.split("\n").filter((line) => line.trim());

  if (unique) {
    links = stableUnique(links);
  }

  const intSeed = seed === impossibleSeed ? null : (seed * (2 << 29)) | 0;

  if (intSeed !== null) {
    const rng = createRng(intSeed);
    fisherYates(links, rng);
  }

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="button-group">
            <button className="button" onClick={() => setSeed(Math.random())}>
              Shuffle
            </button>
            <button
              className="button button-outline"
              onClick={() => setSeed(impossibleSeed)}
            >
              Reset
            </button>
            <span>
              <input
                type="checkbox"
                checked={anon}
                onChange={(e) => setAnon(e.target.checked)}
              />
              <label className="label-inline">Anonymous</label>
            </span>
            <span>
              <input
                type="checkbox"
                checked={unique}
                onChange={(e) => setUnique(e.target.checked)}
              />
              <label className="label-inline">Unique</label>
            </span>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <h3>Output</h3>
            {links.length === 0 ? (
              <p>
                <em>add some links to get started</em>
              </p>
            ) : (
              <ol>
                {links.map((link, i) => {
                  const text = anon ? `link ${i + 1}` : link;
                  return (
                    <li key={`${i},${link}`}>
                      <a href={link} target="_external">
                        {text}
                      </a>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>
        <div className="row">
          <div className="column">
            <h3>Input</h3>
            <textarea
              rows="10"
              style={{ width: "100%" }}
              onChange={(e) => setLines(e.target.value) && setSeed(1)}
              value={lines}
              placeholder="one link per line..."
            ></textarea>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <footer>
              <p>
                Seed:{" "}
                {intSeed === null ? (
                  "none"
                ) : (
                  <>
                    0 {"≤"} {intSeed} {"<"} 2<sup>29</sup>
                  </>
                )}
              </p>
              <p>
                By <a href={AUTHOR_LINK}>Ben Martin</a>
              </p>
              <p>
                <a href={SOURCE_LINK}>Source on Github</a>
              </p>
            </footer>
          </div>
        </div>
        <div className="row" id="icon">
          <div className="column">🐺</div>
        </div>
      </div>
      <GitHubCorners
        position="right"
        href={SOURCE_LINK}
        bgColor="rgb(85, 172, 238)"
      />
    </div>
  );
}
