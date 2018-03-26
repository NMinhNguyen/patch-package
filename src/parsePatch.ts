      start: Number(match[1]),
      start: Number(match[4]),
export function parsePatch(patchFileContents: string): ParsedPatchFile {
  const patchFileLines = patchFileContents.split(/\r?\n/)
  const result: ParsedPatchFile = []

  let i = 0
  while (i < patchFileLines.length) {
    const line = patchFileLines[i++]
    if (!line.startsWith("---") && !line.startsWith("rename from")) {
      continue
    if (line.startsWith("rename from")) {
      const fromPath = line.slice("rename from ".length)
      const toPath = patchFileLines[i++].slice("rename to ".length).trim()
      result.push({ type: "rename", fromPath, toPath })
      continue
    const startPath = line.slice("--- ".length)
    const endPath = patchFileLines[i++].trim().slice("--- ".length)
      const deletion: FileDeletion = {
        lines: [],
      }
      result.push(deletion)
      // ignore hunk header
      parseHunkHeaderLine(patchFileLines[i++])
      // ignore all -lines
      // TODO: perform integrity check on hunk header
      while (i < patchFileLines.length && patchFileLines[i].startsWith("-")) {
        deletion.lines.push(patchFileLines[i].slice(1))
        i++
      }
      const { patched: { length } } = parseHunkHeaderLine(patchFileLines[i++])
      const fileLines = []
      while (i < patchFileLines.length && patchFileLines[i].startsWith("+")) {
        fileLines.push(patchFileLines[i++].slice(1))
      }
      if (fileLines.length !== length) {
        console.warn(
          "hunk length mismatch :( expected",
          length,
          "got",
          fileLines.length,
        )
      }
      result.push({
        lines: fileLines,
      // iterate over hunks
      result.push(filePatch)
      while (i < patchFileLines.length && patchFileLines[i].startsWith("@@")) {
        filePatch.parts.push(parseHunkHeaderLine(patchFileLines[i++]))
        while (
          i < patchFileLines.length &&
          patchFileLines[i].match(/^(\+|-| |\\).*/)
        ) {
          // skip intitial comments
          while (
            i < patchFileLines.length &&
            patchFileLines[i].startsWith("\\")
          ) {
            i++
          }
          // collect patch part blocks
          for (const type of ["context", "deletion", "insertion"] as Array<
            PatchMutationPart["type"]
          >) {
            const lines = []
            while (
              i < patchFileLines.length &&
              patchFileLines[i].startsWith(
                { context: " ", deletion: "-", insertion: "+" }[type],
              )
            ) {
              lines.push(patchFileLines[i++].slice(1))
            }
            if (lines.length > 0) {
              let noNewlineAtEndOfFile = false
              if (
                i < patchFileLines.length &&
                patchFileLines[i].startsWith("\\ No newline at end of file")
              ) {
                noNewlineAtEndOfFile = true
                i++
              }
              filePatch.parts.push({
                type,
                lines,
                noNewlineAtEndOfFile,
              } as PatchMutationPart)
            }
          }
  return result