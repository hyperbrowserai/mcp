/**
 * LLMs.txt Parser
 *
 * A parser for llms.txt files that store Markdown-style links and sections.
 * Format example:
 *
 * # Main Heading
 *
 * ## Sub Heading
 *
 * - [Link Title](https://example.com/url): Optional description
 * - [Another Link](https://example.com/another): More description
 */

// Define the link entry interface
export interface LinkEntry {
  title: string;
  url: string;
  description?: string;
}

// Define the section interface
export interface Section {
  title: string;
  level: number; // 1 for #, 2 for ##, etc.
  links: LinkEntry[];
  subsections: Section[];
}

// Define the document interface
export interface LLMsDocument {
  sections: Section[];
  allLinks: LinkEntry[];
}

/**
 * Parse a llms.txt file content into structured sections and links
 *
 * @param content The content of the llms.txt file
 * @returns A structured document with sections and links
 */
export function parseLLMsFile(content: string): LLMsDocument {
  const lines = content.split("\n");
  const rootSections: Section[] = [];
  const allLinks: LinkEntry[] = [];

  // Keep track of the current section hierarchy
  const sectionStack: Section[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "") {
      continue; // Skip empty lines
    }

    // Check if line is a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      const newSection: Section = {
        title,
        level,
        links: [],
        subsections: [],
      };

      // Pop sections from stack until we find a parent with lower level
      while (
        sectionStack.length > 0 &&
        sectionStack[sectionStack.length - 1].level >= level
      ) {
        sectionStack.pop();
      }

      if (sectionStack.length === 0) {
        // This is a top-level section
        rootSections.push(newSection);
      } else {
        // Add as subsection to the current parent
        sectionStack[sectionStack.length - 1].subsections.push(newSection);
      }

      // Push new section to stack
      sectionStack.push(newSection);
      continue;
    }

    // Check if line is a link entry
    const linkMatch = line.match(
      /^-\s+\[([^\]]+)\]\(([^)]+)\)(?:\s*:\s*(.+))?$/
    );
    if (linkMatch) {
      const title = linkMatch[1].trim();
      const url = linkMatch[2].trim();
      const description = linkMatch[3]?.trim();

      const linkEntry: LinkEntry = {
        title,
        url,
        ...(description ? { description } : {}),
      };

      // Add to current section if available, otherwise to root
      if (sectionStack.length > 0) {
        sectionStack[sectionStack.length - 1].links.push(linkEntry);
      }

      // Also add to the flat list of all links
      allLinks.push(linkEntry);
      continue;
    }
  }

  return {
    sections: rootSections,
    allLinks,
  };
}
