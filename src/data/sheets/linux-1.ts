// Linux commands, part 1: files, text, search.
// Format: "## Category", then "name :: summary :: syntax" (add " :: !" for dangerous commands),
// then indented examples "command :: what it does".
export default `
## Files & Folders
ls :: List the files in a folder :: ls [options] [path...]
  ls -la :: All files (including hidden) in long format
  ls -lhS :: Long format, human sizes, biggest first
  ls -lt | head :: The 10 most recently changed files
cd :: Change the current folder :: cd [path]
  cd ~/projects :: Go to a folder inside your home
  cd .. :: Go up one level
  cd - :: Go back to the previous folder
pwd :: Print the current folder's full path :: pwd [-P]
  pwd :: Show where you are
  pwd -P :: Show the real path, with symlinks resolved
mkdir :: Create folders :: mkdir [-p] [-m mode] dir...
  mkdir notes :: Create one folder
  mkdir -p src/app/screens :: Create nested folders in one go
  mkdir -m 700 secrets :: Create a folder only you can open
rmdir :: Remove empty folders :: rmdir [-p] dir...
  rmdir old :: Remove an empty folder
  rmdir -p a/b/c :: Remove c, then b, then a if each is empty
rm :: Remove files or folders (no undo!) :: rm [-rfi] path... :: !
  rm notes.txt :: Delete a file
  rm -i *.log :: Ask before deleting each file
  rm -rf build/ :: Delete a folder and everything in it, without asking
cp :: Copy files and folders :: cp [options] source... dest
  cp a.txt b.txt :: Copy a file
  cp -r src/ backup/ :: Copy a folder recursively
  cp -av photos/ /mnt/usb/ :: Keep permissions and times, show each file
mv :: Move or rename files :: mv [options] source... dest
  mv old.txt new.txt :: Rename a file
  mv *.jpg ~/Pictures/ :: Move all JPGs into a folder
  mv -n a.txt dir/ :: Never overwrite an existing file
touch :: Create an empty file or update its time :: touch [-d date] file...
  touch index.html :: Create an empty file
  touch -d '2 days ago' old.log :: Set a file's time in the past
ln :: Create links between files :: ln [-s] target link_name
  ln -s /opt/app/bin/app ~/bin/app :: Create a symbolic link
  ln file.txt hardlink.txt :: Create a hard link
  ln -sf new-target link :: Replace an existing symlink
stat :: Show detailed file information :: stat [-c format] file
  stat notes.txt :: Size, permissions, owner and times
  stat -c '%s %n' *.zip :: Print the size and name of each zip
file :: Guess a file's type from its contents :: file [options] file...
  file photo :: Find out what kind of file it is
  file -i data.bin :: Show the MIME type
tree :: Show a folder as a tree :: tree [-L level] [-a] [dir]
  tree -L 2 :: Two levels deep
  tree -a -I node_modules :: Include hidden files, skip node_modules
basename :: Strip the folder (and suffix) from a path :: basename path [suffix]
  basename /var/log/syslog :: Prints: syslog
  basename report.pdf .pdf :: Prints: report
dirname :: Strip the last part of a path :: dirname path
  dirname /var/log/syslog :: Prints: /var/log
realpath :: Print the full, resolved path :: realpath [options] path
  realpath ../notes.txt :: Absolute path with .. resolved
  realpath --relative-to=/home ~/code :: A path relative to another folder
readlink :: Show where a symlink points :: readlink [-f] link
  readlink /usr/bin/python3 :: The link's direct target
  readlink -f /usr/bin/python3 :: Follow every link to the final file
mktemp :: Create a unique temporary file or folder :: mktemp [-d] [template]
  tmp=$(mktemp) :: Create a temp file and keep its name
  mktemp -d :: Create a temp folder
shred :: Overwrite a file so it can't be recovered :: shred [-u] [-n N] file :: !
  shred -u secret.txt :: Overwrite, then delete
  shred -n 5 -z disk.img :: 5 random passes, then zeros
truncate :: Shrink or grow a file to a size :: truncate -s size file
  truncate -s 0 app.log :: Empty a file without deleting it
  truncate -s 1G big.img :: Create a 1 GB sparse file
split :: Split a file into pieces :: split [-b size | -l lines] file [prefix]
  split -b 100M video.mp4 part_ :: Pieces of 100 MB
  split -l 1000 data.csv chunk_ :: Pieces of 1000 lines
  cat part_* > video.mp4 :: Join the pieces back together
dd :: Copy raw data block by block :: dd if=in of=out [bs=] [count=] :: !
  dd if=/dev/zero of=test.img bs=1M count=100 :: Create a 100 MB file of zeros
  sudo dd if=os.iso of=/dev/sdX bs=4M status=progress :: Write an ISO to a USB stick (check sdX!)
install :: Copy files and set permissions in one step :: install [-m mode] [-d] src dest
  install -m 755 app /usr/local/bin/ :: Copy and make executable
  install -d -m 700 ~/.secrets :: Create a folder with permissions
rename :: Rename many files with a pattern :: rename 's/old/new/' files
  rename 's/\\.jpeg$/.jpg/' *.jpeg :: Change .jpeg to .jpg
  rename 'y/A-Z/a-z/' * :: Make file names lowercase
chattr :: Change special file attributes (ext4) :: chattr [+-]attr file
  sudo chattr +i config.yml :: Make a file impossible to change or delete
  sudo chattr -i config.yml :: Remove that protection
lsattr :: List special file attributes :: lsattr [file]
  lsattr config.yml :: Shows i if the file is immutable
sync :: Write cached data to disk now :: sync
  sync :: Flush writes before unplugging a drive
du -sh :: Quick size of a file or folder :: du -sh path
  du -sh * :: Size of everything here
  du -sh * | sort -h :: Sorted from smallest to largest

## Viewing & Editing Text
cat :: Print or join files :: cat [-n] file...
  cat notes.txt :: Print a file
  cat a.txt b.txt > both.txt :: Join two files
  cat -n script.sh :: Print with line numbers
tac :: Print a file backwards (last line first) :: tac file
  tac app.log | head :: The newest log lines first
less :: Page through text (q to quit) :: less [options] file
  less +F app.log :: Follow a growing file (Ctrl+C, then F to resume)
  less -N -S data.csv :: Line numbers, no line wrapping
more :: Simple pager :: more file
  more README :: Page through a file with the space bar
head :: Print the first lines :: head [-n N | -c N] file
  head -n 20 data.csv :: First 20 lines
  head -c 100 file.bin :: First 100 bytes
tail :: Print the last lines :: tail [-n N] [-f] file
  tail -n 50 app.log :: Last 50 lines
  tail -f /var/log/syslog :: Follow new lines as they arrive
  tail -n +2 data.csv :: Everything except the first line
nl :: Number the lines of a file :: nl [options] file
  nl -ba script.sh :: Number every line, including blank ones
wc :: Count lines, words and bytes :: wc [-lwc] file...
  wc -l *.ts :: Lines in each TypeScript file
  ls | wc -l :: How many files are in this folder
sort :: Sort lines :: sort [-n -r -k -u -h] file
  sort names.txt :: Alphabetical order
  sort -n -r scores.txt :: Numbers, largest first
  sort -t, -k3 -n data.csv :: Sort a CSV by its 3rd column
  sort -u emails.txt :: Sort and remove duplicates
uniq :: Remove or count repeated adjacent lines :: uniq [-c -d -u] file
  sort words.txt | uniq -c | sort -rn :: Count how often each word appears
  sort ids.txt | uniq -d :: Show only duplicated lines
cut :: Pick columns from each line :: cut -d delim -f fields | -c chars file
  cut -d, -f1,3 data.csv :: Columns 1 and 3 of a CSV
  cut -d: -f1 /etc/passwd :: All user names
  cut -c1-10 file.txt :: The first 10 characters of each line
paste :: Join files side by side :: paste [-d delim] [-s] file...
  paste names.txt ages.txt :: Two files as two columns
  paste -sd, list.txt :: Join all lines with commas
join :: Join two sorted files on a common field :: join [-t c] [-1 F] [-2 F] f1 f2
  join -t, users.csv orders.csv :: Join CSVs on their first column
tr :: Translate or delete characters :: tr [-d -s] set1 [set2]
  tr a-z A-Z < file :: Make text uppercase
  tr -d '\\r' < win.txt > unix.txt :: Remove Windows line endings
  tr -s ' ' :: Squeeze repeated spaces into one
sed :: Stream editor: find, replace, delete lines :: sed [-i] [-E] 'script' file
  sed 's/cat/dog/g' file :: Replace every cat with dog
  sed -i.bak 's/http:/https:/g' *.html :: Edit files in place, keep backups
  sed -n '10,20p' file :: Print lines 10 to 20
  sed '/^#/d' config :: Delete comment lines
awk :: Pattern-scanning and processing language :: awk [-F sep] 'program' file
  awk '{print $1}' access.log :: First column of each line
  awk -F, '$3 > 100 {print $1}' data.csv :: Names where column 3 is over 100
  awk '{sum += $2} END {print sum}' file :: Sum the second column
grep :: Search text for a pattern :: grep [options] pattern [file...]
  grep -rn 'TODO' src/ :: Find TODO in every file, with line numbers
  grep -i error app.log :: Case-insensitive search
  grep -v '^#' config :: Lines that do NOT match
  grep -E 'cat|dog' file :: Extended regex: cat or dog
  grep -c 404 access.log :: Count matching lines
  grep -o '[0-9]\\+' file :: Print only the matching parts
zgrep :: grep inside gzip files :: zgrep pattern file.gz
  zgrep 'ERROR' /var/log/syslog.*.gz :: Search old compressed logs
fold :: Wrap long lines :: fold [-w width] [-s] file
  fold -w 80 -s essay.txt :: Wrap at 80 columns on spaces
fmt :: Reformat paragraphs :: fmt [-w width] file
  fmt -w 72 notes.txt :: Re-wrap paragraphs to 72 columns
column :: Format input into aligned columns :: column [-t] [-s sep]
  column -t -s, data.csv :: Show a CSV as an aligned table
  mount | column -t :: Make command output readable
rev :: Reverse each line's characters :: rev [file]
  echo hello | rev :: Prints: olleh
expand :: Convert tabs to spaces :: expand [-t N] file
  expand -t 4 code.py :: Tabs become 4 spaces
comm :: Compare two sorted files line by line :: comm [-123] f1 f2
  comm -12 a.txt b.txt :: Lines in both files
  comm -23 a.txt b.txt :: Lines only in a.txt
diff :: Show differences between files :: diff [-u] [-r] a b
  diff -u old.txt new.txt :: Unified diff (like git)
  diff -r dirA dirB :: Compare two folders
  diff <(sort a) <(sort b) :: Compare sorted versions
cmp :: Compare two files byte by byte :: cmp a b
  cmp a.bin b.bin :: Report the first difference
patch :: Apply a diff to files :: patch [-p N] < file.patch
  patch -p1 < fix.patch :: Apply a patch made with git diff
  patch -R -p1 < fix.patch :: Undo a patch
tee :: Write output to a file and the screen :: tee [-a] file
  make 2>&1 | tee build.log :: Watch the output and save it
  echo 'line' | sudo tee -a /etc/hosts :: Append to a root-owned file
xargs :: Build commands from input :: xargs [-n N] [-I {}] [-P N] command
  find . -name '*.tmp' | xargs rm :: Delete every file found
  cat urls.txt | xargs -n1 -P4 curl -O :: Download 4 at a time
  ls *.png | xargs -I {} convert {} {}.jpg :: Use the item in the middle of a command
echo :: Print text :: echo [-n -e] text
  echo "Hello, $USER" :: Print with a variable
  echo -n 'no newline' :: Don't add a newline at the end
  echo -e 'a\\tb' :: Interpret \\t and \\n
printf :: Print formatted text :: printf format [args...]
  printf '%-10s %5d\\n' apples 3 :: Padded columns
  printf '%.2f\\n' 3.14159 :: Two decimal places
strings :: Print readable text inside binary files :: strings [-n N] file
  strings app.bin | grep http :: Find URLs in a binary
od :: Dump a file in octal, hex or characters :: od [-c -x -A] file
  od -c file.txt :: Show every character, including \\n and \\t
xxd :: Hex dump (and reverse) :: xxd [-r] file
  xxd image.png | head :: First bytes in hex
  xxd -r dump.hex > file.bin :: Turn a hex dump back into a file
hexdump :: Display a file in hex :: hexdump -C file
  hexdump -C file.bin | head :: Hex and ASCII side by side
iconv :: Convert text between encodings :: iconv -f from -t to file
  iconv -f latin1 -t utf-8 old.txt > new.txt :: Latin-1 to UTF-8
dos2unix :: Convert Windows line endings :: dos2unix file
  dos2unix script.sh :: Fix "bad interpreter: ^M" errors
base64 :: Encode or decode Base64 :: base64 [-d] [file]
  echo -n 'user:pass' | base64 :: Encode text
  echo dXNlcjpwYXNz | base64 -d :: Decode text
md5sum :: Compute MD5 checksums :: md5sum [-c] file
  md5sum file.iso :: Print the checksum
sha256sum :: Compute or check SHA-256 checksums :: sha256sum [-c] file
  sha256sum ubuntu.iso :: Print the checksum
  sha256sum -c SHA256SUMS :: Verify downloads against a list
shuf :: Shuffle lines or pick random ones :: shuf [-n N] [-i lo-hi] [file]
  shuf -n 1 names.txt :: Pick a random line
  shuf -i 1-100 -n 5 :: 5 random numbers from 1 to 100
seq :: Print a sequence of numbers :: seq [first [step]] last
  seq 1 10 :: 1 to 10
  seq -w 1 3 12 :: 01 04 07 10, padded with zeros
yes :: Repeat a line forever :: yes [text]
  yes | sudo apt install pkg :: Answer yes to every prompt
envsubst :: Replace $VARS in text with their values :: envsubst < template
  envsubst < nginx.conf.tpl > nginx.conf :: Fill a config template
jq :: Query and reshape JSON :: jq 'filter' [file]
  curl -s api/users | jq '.[0].name' :: First user's name
  jq -r '.items[] | .id' data.json :: Every id, as raw text
  jq '.version = "2.0"' package.json :: Change a field
nano :: Simple terminal text editor :: nano [+line] file
  nano ~/.bashrc :: Edit a file (Ctrl+O saves, Ctrl+X exits)
vim :: Powerful modal text editor :: vim [+line] file
  vim +42 app.py :: Open at line 42 (:wq saves and quits, :q! quits)
  vimdiff a.txt b.txt :: Compare files side by side

## Finding Things
find :: Search for files by name, type, size, time... :: find [path] [tests] [actions]
  find . -name '*.log' :: Files ending in .log, here and below
  find . -type d -name node_modules -prune :: Find node_modules folders
  find / -size +500M 2>/dev/null :: Files bigger than 500 MB
  find . -mtime -1 :: Changed in the last 24 hours
  find . -name '*.tmp' -delete :: Find and delete
  find . -type f -exec chmod 644 {} + :: Run a command on every match
locate :: Find files by name using a fast index :: locate [-i] pattern
  locate nginx.conf :: Instant search by name
  locate -i readme :: Case-insensitive
updatedb :: Refresh the locate index :: sudo updatedb
  sudo updatedb :: Index new files so locate can find them
which :: Show which program a command runs :: which [-a] command
  which python3 :: Full path of python3
  which -a node :: Every node on your PATH
whereis :: Find a command's binary, source and manual :: whereis command
  whereis git :: Binary and man page locations
rg :: ripgrep: very fast recursive search :: rg [options] pattern [path]
  rg 'useState' src/ :: Search code, skipping .gitignore'd files
  rg -i -t py 'import' :: Only Python files, ignore case
  rg -l TODO :: Only print matching file names
fd :: Fast, friendly alternative to find :: fd [pattern] [path]
  fd '\\.tsx$' :: Find files by regex
  fd -e jpg -x convert {} {.}.png :: Run a command on each result
fzf :: Interactive fuzzy finder :: command | fzf
  vim $(fzf) :: Pick a file to edit, fuzzily
  history | fzf :: Search your command history
apropos :: Search manual page descriptions :: apropos keyword
  apropos compress :: Commands related to compression
whatis :: One-line description of a command :: whatis command
  whatis tar :: What does tar do?
`;
