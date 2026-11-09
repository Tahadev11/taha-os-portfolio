
"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

import type { Profile } from "@/types/portfolio";
import { navigation, type Section } from "@/types/sections";

interface TerminalProps {
  profile: Profile | null;
  onNavigate: (section: Section) => void;
}

type TerminalLine = {
  type: "command" | "output";
  text: string;
};

const terminalCommands = [
  "help",
  "home",
  "about",
  "projects",
  "skills",
  "experience",
  "education",
  "resume",
  "certificates",
  "contact",
  "open",
  "show",
  "whoami",
  "pwd",
  "ls",
  "clear",
];

const commandHelp = [
  "Available commands:",
  "  help          Show available commands",
  "  home          Open homepage",
  "  about         About me",
  "  projects      Explore my projects",
  "  skills        View my technical skills",
  "  experience    View training and experience",
  "  education     View education",
  "  resume        View my resume",
  "  certificates  View my certificates",
  "  contact       Contact information",
  "  open <page>   Open a portfolio section",
  "  show <page>   Show a portfolio section",
  "  whoami        Display developer information",
  "  pwd           Show current directory",
  "  ls            List available sections",
  "  clear         Clear terminal history",
];

export default function Terminal({
  profile,
  onNavigate,
}: TerminalProps) {
  const [command, setCommand] = useState("");

  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const [historyIndex, setHistoryIndex] = useState(-1);

  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { type: "output", text: "TAHA OS [Version 1.0.0]" },
    {
      type: "output",
      text: "Personal developer environment initialized.",
    },
    {
      type: "output",
      text: 'Type "help" to see available commands.',
    },
  ]);

  const terminalOutputRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the latest terminal output
  useEffect(() => {
    const terminal = terminalOutputRef.current;

    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  }, [terminalHistory]);

  // Execute terminal commands
  function runCommand(rawCommand: string) {
    const value = rawCommand.trim().toLowerCase();

    if (!value) return;

    setCommandHistory((previous) => {
      if (previous[previous.length - 1] === rawCommand.trim()) {
        return previous;
      }

      return [...previous, rawCommand.trim()];
    });

    setHistoryIndex(-1);

    const parts = value.split(/\s+/);
    const action = parts[0];
    const target = parts[1];

    if (value === "clear") {
      setTerminalHistory([]);
      setCommand("");
      return;
    }

    let output: string[] = [];

    if (value === "help") {
      output = commandHelp;
    } else if (value === "whoami") {
      output = [
        `Name: ${profile?.fullName || "Taha Siddique"}`,
        `Role: ${profile?.professionalTitle || "Software Engineer"}`,
        `Location: ${profile?.location || "Pakistan"}`,
        `Email: ${profile?.email || "Not provided"}`,
      ];
    } else if (value === "pwd") {
      output = ["/home/taha/portfolio"];
    } else if (value === "ls") {
      output = navigation
        .filter((item) => item.section !== "home")
        .map((item) => `${item.command}/`);
    } else {
      const sectionName =
        action === "open" || action === "show"
          ? target
          : action;

      const matchingSection = navigation.find(
        (item) => item.command === sectionName
      );

      if (matchingSection) {
        onNavigate(matchingSection.section);

        output = [
          `Opening ${matchingSection.label}...`,
          "Navigation successful.",
        ];
      } else {
        output = [
          `Command not found: ${value}`,
          'Type "help" to see the available commands.',
        ];
      }
    }

    setTerminalHistory((previous) => [
      ...previous,
      {
        type: "command",
        text: `taha@portfolio:~$ ${rawCommand}`,
      },
      ...output.map((text) => ({
        type: "output" as const,
        text,
      })),
    ]);

    setCommand("");
  }

  // Handle command submission
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runCommand(command);
  }

  // Handle command history and Tab autocomplete
  function handleCommandKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (commandHistory.length === 0) return;

      const nextIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);

      setHistoryIndex(nextIndex);
      setCommand(commandHistory[nextIndex]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      if (historyIndex === -1) return;

      const nextIndex = historyIndex + 1;

      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setCommand("");
      } else {
        setHistoryIndex(nextIndex);
        setCommand(commandHistory[nextIndex]);
      }
    } else if (event.key === "Tab") {
      event.preventDefault();

      const currentValue = event.currentTarget.value;
      const parts = currentValue.split(/\s+/);

      const lastPart = parts[parts.length - 1].toLowerCase();

      let availableCommands = terminalCommands;

      if (
        parts.length > 1 &&
        ["open", "show"].includes(parts[0].toLowerCase())
      ) {
        availableCommands = navigation.map(
          (item) => item.command
        );
      }

      const matches = availableCommands.filter((item) =>
        item.startsWith(lastPart)
      );

      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];

        setCommand(
          parts.join(" ") + (parts.length === 1 ? " " : "")
        );
      }
    }
  }

  return (
    <section className="terminal-window">
      <div className="terminal-titlebar">
        <div className="window-controls">
          <span className="window-dot dot-red" />
          <span className="window-dot dot-yellow" />
          <span className="window-dot dot-green" />
        </div>

        <div className="terminal-title">
          terminal — taha@portfolio
        </div>

        <div className="terminal-language">SHELL</div>
      </div>

      <div className="terminal-body">
        <div
          className="terminal-output"
          aria-live="polite"
          ref={terminalOutputRef}
        >
          {terminalHistory.map((line, index) => (
            <div
              key={`${index}-${line.text}`}
              className={
                line.type === "command"
                  ? "terminal-line command-line"
                  : "terminal-line output-line"
              }
            >
              {line.text}
            </div>
          ))}
        </div>

        <form
          className="terminal-input-row"
          onSubmit={handleSubmit}
        >
          <label htmlFor="terminal-command">
            <span className="prompt-user">taha@portfolio</span>
            <span className="prompt-path">:~$</span>
          </label>

          <input
            id="terminal-command"
            value={command}
            onChange={(event) => {
              setCommand(event.target.value);
              setHistoryIndex(-1);
            }}
            onKeyDown={handleCommandKeyDown}
            placeholder="Type a command..."
            autoComplete="off"
            spellCheck={false}
          />

          <button type="submit" aria-label="Run command">
            ↵
          </button>
        </form>
      </div>
    </section>
  );
}
