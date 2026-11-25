on run argv
  if (count of argv) is less than 2 then error "Expected input and output paths."

  set inputPath to item 1 of argv
  set outputPath to item 2 of argv
  set inputFile to POSIX file inputPath
  set outputFile to POSIX file outputPath

  with timeout of 900 seconds
    tell application "Keynote"
      activate
      open inputFile

      repeat 120 times
        try
          if (count of documents) > 0 then exit repeat
        end try
        delay 0.5
      end repeat

      delay 6
      save front document in outputFile
      delay 3
      close front document saving no
    end tell
  end timeout
end run
