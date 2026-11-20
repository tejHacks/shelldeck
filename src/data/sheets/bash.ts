// Bash: builtins, syntax, expansions and keyboard shortcuts.
export default `
## Variables & Environment
variables :: Create and read variables (no spaces around =) :: name=value; echo "$name"
  name='Ada' :: Set a variable
  echo "Hello, $name" :: Use it (always quote!)
  echo "\${name}_backup" :: Braces separate the name from text
export :: Make a variable visible to child programs :: export NAME=value
  export EDITOR=vim :: Programs you start will see EDITOR
  export PATH="$HOME/bin:$PATH" :: Add a folder to PATH
unset :: Delete a variable or function :: unset [-f] name
  unset API_KEY :: Remove a variable
readonly :: Make a variable constant :: readonly NAME=value
  readonly VERSION=1.2 :: Can't be changed afterwards
declare :: Declare variables with attributes :: declare [-i -a -A -r -x -l -u] name
  declare -i count=0 :: An integer variable
  declare -A colors=([apple]=red) :: An associative array
  declare -l lower='HELLO' :: Stored as lowercase
local :: A variable that exists only inside a function :: local name=value
  f() { local tmp=1; } :: tmp disappears after f returns
special variables :: Built-in values set by the shell :: $? $$ $! $0 $# $@ $_
  echo $? :: Exit status of the last command (0 = success)
  echo $$ :: PID of this shell
  echo $! :: PID of the last background job
.bashrc :: Your interactive shell settings :: ~/.bashrc
  echo "alias ll='ls -la'" >> ~/.bashrc :: Add an alias permanently
  source ~/.bashrc :: Reload it now
.bash_profile :: Settings for login shells :: ~/.bash_profile
  [ -f ~/.bashrc ] && . ~/.bashrc :: (common line) Load .bashrc from login shells
PS1 :: Customise your prompt :: PS1='...'
  PS1='\\u@\\h:\\w\\$ ' :: user@host:folder$
  PS1='\\[\\e[32m\\]\\w\\[\\e[0m\\] $ ' :: Green folder name

## Quoting & Expansion
quotes :: Single quotes are literal, double quotes expand :: 'text' vs "text"
  echo '$HOME' :: Prints: $HOME
  echo "$HOME" :: Prints: /home/you
  echo $'tab:\\there' :: ANSI-C quoting: \\t becomes a tab
command substitution :: Use a command's output as text :: $(command)
  today=$(date +%F) :: Save output in a variable
  echo "Files: $(ls | wc -l)" :: Inline in a string
arithmetic :: Integer maths :: $(( expression ))
  echo $(( 7 * 6 )) :: 42
  (( count++ )) :: Increment a variable
  (( x > 5 )) && echo big :: Arithmetic test
brace expansion :: Generate lists of words :: {a,b,c} {1..10}
  mkdir -p app/{src,test,docs} :: Three folders at once
  echo {1..5} :: 1 2 3 4 5
  cp config.yml{,.bak} :: Quick backup: config.yml.bak
globbing :: Match file names with wildcards :: * ? [abc] **
  ls *.jpg :: Every .jpg here
  ls file?.txt :: file1.txt, fileA.txt...
  shopt -s globstar; ls **/*.ts :: Recursive match
default values :: Fallbacks for empty variables :: \${var:-default} \${var:=default}
  echo "\${PORT:-3000}" :: Use 3000 if PORT is empty
  : "\${NAME:?NAME is required}" :: Exit with an error if NAME is empty
string slicing :: Substrings and length :: \${var:offset:length} \${#var}
  s='hello world'; echo "\${s:0:5}" :: hello
  echo "\${#s}" :: 11 (length)
string replace :: Replace text inside a variable :: \${var/old/new} \${var//old/new}
  f='photo.jpeg'; echo "\${f/jpeg/jpg}" :: photo.jpg
  echo "\${PATH//:/ }" :: Replace every : with a space
trim prefix/suffix :: Remove patterns from either end :: \${var#pat} \${var%pat}
  f='/path/to/file.tar.gz'; echo "\${f##*/}" :: file.tar.gz (like basename)
  echo "\${f%.gz}" :: /path/to/file.tar
  echo "\${f%%.*}" :: /path/to/file
case conversion :: Upper or lower case :: \${var^^} \${var,,}
  n='ada'; echo "\${n^}" :: Ada
  echo "\${n^^}" :: ADA
process substitution :: Use a command's output as a file :: <(command)
  diff <(ls dir1) <(ls dir2) :: Compare two listings
here document :: Feed several lines to a command :: command <<EOF ... EOF
  cat <<EOF > config.txt :: Write a multi-line file (end with a line: EOF)
here string :: Feed one string to a command :: command <<< "text"
  grep -c a <<< "banana" :: Count lines matching a

## Redirection & Pipes
redirect output :: Send output to a file :: > >> 2> &> 2>&1
  ls > list.txt :: Overwrite a file
  echo more >> list.txt :: Append
  cmd 2> errors.log :: Only errors to a file
  cmd > all.log 2>&1 :: Output and errors together
  cmd &> /dev/null :: Silence everything
redirect input :: Read input from a file :: command < file
  wc -l < data.csv :: Count lines (no file name printed)
pipes :: Send one command's output into another :: cmd1 | cmd2
  cat log | grep ERROR | wc -l :: Count errors
  ps aux | sort -k4 -rn | head :: Top memory users
set -o pipefail :: Fail a pipeline if any part fails :: set -o pipefail
  set -euo pipefail :: Safe mode for scripts
tee :: Split output to a file and the next command :: cmd | tee file | cmd2
  ./build.sh | tee build.log :: Save and see output

## Control Flow
if :: Run code conditionally :: if cmd; then ...; elif cmd; then ...; else ...; fi
  if [[ -f config.yml ]]; then echo found; fi :: Does the file exist?
  if grep -q root /etc/passwd; then echo yes; fi :: Use any command as the test
[[ ]] :: Modern test expression :: [[ expression ]]
  [[ $name == A* ]] :: Pattern match
  [[ $email =~ ^[^@]+@[^@]+$ ]] :: Regex match
  [[ -z $var ]] :: Is it empty?
  [[ $a -lt 10 && -n $b ]] :: Combine tests
test / [ :: POSIX test command :: [ expression ]
  [ -d /tmp ] && echo dir :: Is it a folder?
  [ "$a" = "$b" ] :: Strings equal (quote them!)
file tests :: Check files :: -e -f -d -r -w -x -s -L
  [[ -x deploy.sh ]] :: Is it executable?
  [[ -s log.txt ]] :: Exists and not empty
  [[ a.txt -nt b.txt ]] :: Is a.txt newer than b.txt?
case :: Match a value against patterns :: case $x in pat) ...;; esac
  case $1 in start) run;; stop) halt;; *) echo usage;; esac :: Handle arguments
for :: Loop over a list :: for x in list; do ...; done
  for f in *.png; do echo "$f"; done :: Each PNG file
  for i in {1..5}; do echo $i; done :: Count 1 to 5
  for ((i=0; i<10; i++)); do echo $i; done :: C-style loop
while :: Loop while a command succeeds :: while cmd; do ...; done
  while read -r line; do echo "$line"; done < file :: Read a file line by line
  while true; do date; sleep 1; done :: Forever (Ctrl+C to stop)
until :: Loop until a command succeeds :: until cmd; do ...; done
  until ping -c1 server &>/dev/null; do sleep 2; done :: Wait for a server
break / continue :: Leave or skip a loop iteration :: break [n]; continue [n]
  for f in *; do [[ -d $f ]] && continue; echo "$f"; done :: Skip folders
select :: Simple numbered menu :: select x in list; do ...; done
  select c in red green blue; do echo "$c"; break; done :: Pick a colour
&& and || :: Run the next command on success or failure :: cmd1 && cmd2 || cmd3
  mkdir out && cd out :: cd only if mkdir worked
  ping -c1 host || echo 'down' :: Message on failure

## Functions & Scripts
functions :: Group commands under a name :: name() { ...; }
  greet() { echo "Hi, $1"; } :: Define
  greet Ada :: Call with an argument
script arguments :: Read arguments in a script :: $1 $2 "$@" $#
  echo "First: $1, count: $#" :: Positional arguments
  for arg in "$@"; do echo "$arg"; done :: Every argument, safely
shift :: Drop the first argument :: shift [n]
  while (( $# )); do echo "$1"; shift; done :: Process arguments one by one
return :: Exit a function with a status :: return [n]
  is_root() { [[ $EUID -eq 0 ]]; } :: Returns the test's status
exit :: Exit the script :: exit [n]
  exit 1 :: Exit with an error code
shebang :: First line that picks the interpreter :: #!/usr/bin/env bash
  #!/usr/bin/env bash :: Portable bash shebang
set :: Change shell options :: set [-euxo pipefail]
  set -x :: Print each command before running it (debugging)
  set -e :: Stop on the first error
shopt :: Bash-specific options :: shopt [-s|-u] option
  shopt -s globstar nullglob :: ** recursion, empty globs vanish
getopts :: Parse short options in scripts :: getopts 'ab:' opt
  while getopts 'vf:' o; do case $o in v) v=1;; f) file=$OPTARG;; esac; done :: -v and -f file
trap :: Run code on signals or exit :: trap 'commands' SIGNAL...
  trap 'rm -f "$tmp"' EXIT :: Clean up when the script ends
  trap 'echo interrupted' INT :: Catch Ctrl+C
source :: Run a file in the current shell :: source file | . file
  source .env :: Load variables into this shell
read :: Read a line of input :: read [-p prompt] [-s] [-r] var
  read -rp 'Name: ' name :: Ask a question
  read -rsp 'Password: ' pw :: Hidden input
mapfile :: Read lines into an array :: mapfile -t arr < file
  mapfile -t lines < todo.txt :: One array item per line
arrays :: Indexed arrays :: arr=(a b c); \${arr[i]}
  fruits=(apple banana) :: Create
  fruits+=(cherry) :: Append
  echo "\${fruits[@]}" :: All items
  echo "\${#fruits[@]}" :: Length
associative arrays :: Key/value maps (Bash 4+) :: declare -A map
  declare -A age=([ada]=36 [alan]=41) :: Create
  echo "\${age[ada]}" :: Look up
  for k in "\${!age[@]}"; do echo "$k"; done :: Every key

## Jobs & History
jobs :: List background jobs :: jobs [-l]
  jobs -l :: Jobs with PIDs
bg :: Resume a stopped job in the background :: bg [%n]
  bg %1 :: Continue job 1 in the background
fg :: Bring a job to the foreground :: fg [%n]
  fg %2 :: Bring job 2 back
& :: Run a command in the background :: command &
  sleep 60 & :: Get your prompt back immediately
wait :: Wait for background jobs to finish :: wait [pid]
  cmd1 & cmd2 & wait :: Run two at once, wait for both
disown :: Detach a job from the shell :: disown [%n]
  disown -h %1 :: Keep job 1 running after logout
history :: Show command history :: history [n]
  history 20 :: The last 20 commands
  history | grep ssh :: Find an old command
history expansion :: Reuse previous commands :: !! !$ !n !string
  sudo !! :: Last command with sudo
  vim !$ :: Last argument of the previous command
  !42 :: Run command 42 from history
alias :: Create a shortcut command :: alias name='command'
  alias ll='ls -lah' :: Define
  unalias ll :: Remove
  \\ls :: Bypass an alias once
type :: Show what a name is (alias, builtin, file) :: type [-a] name
  type ll :: ll is aliased to ...
  type -a echo :: Every echo: builtin and file
hash :: Remember or forget command paths :: hash [-r]
  hash -r :: Forget remembered paths after installing something
command :: Run a command, ignoring functions and aliases :: command [-v] name
  command -v docker >/dev/null || echo 'install docker' :: Is a program installed?
builtin :: Run a shell builtin :: builtin name args
  cd() { builtin cd "$@" && ls; } :: Wrap cd to list after moving
exec :: Replace the shell with a command :: exec command
  exec zsh :: Switch to zsh without nesting shells
  exec > log.txt 2>&1 :: Send the rest of a script's output to a file
time :: Time a command or pipeline :: time command
  time (sleep 1; ls) :: Time several commands

## Keyboard Shortcuts
Ctrl+R :: Search your history as you type :: Ctrl+R
  Ctrl+R ssh :: Find the last ssh command; Ctrl+R again for older ones
Ctrl+A / Ctrl+E :: Jump to start or end of the line :: Ctrl+A, Ctrl+E
  Ctrl+A :: Start of line
Ctrl+U / Ctrl+K :: Delete to start or end of the line :: Ctrl+U, Ctrl+K
  Ctrl+U :: Clear what you typed before the cursor
Ctrl+W :: Delete the word before the cursor :: Ctrl+W
  Ctrl+W :: Remove one word
Ctrl+C :: Stop the running command :: Ctrl+C
  Ctrl+C :: Interrupt (SIGINT)
Ctrl+Z :: Pause the running command :: Ctrl+Z
  Ctrl+Z then bg :: Pause, then continue in the background
Ctrl+D :: End of input or exit the shell :: Ctrl+D
  Ctrl+D :: Log out of an empty prompt
Alt+. :: Insert the last argument of the previous command :: Alt+.
  Alt+. :: Press again for older arguments
Tab :: Complete commands, files and options :: Tab, Tab Tab
  cd Doc<Tab> :: Completes to Documents/
`;
