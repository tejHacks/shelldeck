// fish: the friendly interactive shell. Different syntax from bash/zsh.
export default `
## Fish Basics
set :: Create or change variables (no = sign) :: set [-g -l -x -U -e] name value
  set name Ada :: Set a variable
  echo $name :: Read it
  set -e name :: Erase it
set -x :: Export a variable to child programs :: set -gx NAME value
  set -gx EDITOR vim :: Like export EDITOR=vim
universal variables :: Variables saved across all sessions :: set -U name value
  set -U fish_greeting '' :: Turn off the welcome message forever
fish_add_path :: Add folders to PATH (saved for you) :: fish_add_path dir
  fish_add_path ~/.local/bin :: Add a folder to PATH permanently
config.fish :: Your fish settings file :: ~/.config/fish/config.fish
  vim ~/.config/fish/config.fish :: Edit settings
  source ~/.config/fish/config.fish :: Reload settings
fish_config :: Change colours and prompt in a browser :: fish_config
  fish_config :: Opens a web page with themes and prompts
  fish_config theme choose Dracula :: Pick a theme from the terminal
command substitution :: Use output as text: (cmd) or $(cmd) :: set x (command)
  set today (date +%F) :: Save output in a variable
  echo "Files: "(count *) :: Inline count of files
string :: Built-in string toolbox :: string [length|upper|replace|split|match|trim] ...
  string upper hello :: HELLO
  string replace -a ' ' _ 'my file' :: my_file
  string split , 'a,b,c' :: a b c, one per line
  string match -r '\\d+' 'v12' :: 12
math :: Calculate (with decimals) :: math expression
  math 10 / 3 :: 3.333333
  math '2 ^ 10' :: 1024
  set n (math $n + 1) :: Increment
count :: Count arguments or lines :: count items...
  count *.txt :: How many .txt files
  count $PATH :: How many PATH entries
status :: Information about the shell :: status [is-interactive|current-filename]
  echo $status :: Exit status of the last command (like $?)
  status is-interactive; and echo yes :: Are we in an interactive shell?
lists :: Every variable is a list (1-based) :: set l a b c; $l[1]
  set colors red green blue :: A list
  echo $colors[1] :: red
  echo $colors[-1] :: blue
  echo $colors[2..3] :: green blue
contains :: Is an item in a list? :: contains item $list
  contains ~/bin $PATH; or fish_add_path ~/bin :: Add only if missing

## Fish Control Flow
if :: Run code conditionally :: if cond; ...; else if cond; ...; else; ...; end
  if test -f config.yml; echo found; end :: Does the file exist?
  if command -q git; echo 'git installed'; end :: Is a program installed?
test :: Compare values and check files :: test expression
  test $count -gt 5 :: Number comparison
  test -d ~/Downloads :: Is it a folder?
  test "$a" = "$b" :: String equality
and / or / not :: Combine commands :: cmd; and cmd2; or cmd3
  mkdir out; and cd out :: cd only if mkdir worked
  not test -e lock; and echo free :: Negate a test
  make && make install :: && and || also work in fish 3+
switch :: Match against patterns :: switch $x; case pat; ...; end
  switch $argv[1]; case start; run; case stop; halt; case '*'; echo usage; end :: Handle arguments
for :: Loop over a list :: for x in list; ...; end
  for f in *.png; echo $f; end :: Each PNG file
  for i in (seq 5); echo $i; end :: Count 1 to 5
while :: Loop while a condition is true :: while cond; ...; end
  while read -l line; echo $line; end < file.txt :: Read a file line by line
  while true; date; sleep 1; end :: Forever (Ctrl+C stops)
begin / end :: Group commands into a block :: begin; ...; end
  begin; echo a; echo b; end > out.txt :: Redirect a whole block

## Fish Functions
function :: Define a function :: function name; ...; end
  function greet; echo "Hi, $argv[1]"; end :: Define
  greet Ada :: Call it
argv :: A function's or script's arguments :: $argv $argv[1]
  function show; for a in $argv; echo $a; end; end :: Every argument
  count $argv :: How many arguments
funcsave :: Save a function permanently :: funcsave name
  funcsave greet :: Saved to ~/.config/fish/functions/greet.fish
funced :: Edit a function interactively :: funced name
  funced greet :: Edit, then funcsave greet
functions :: List or show functions :: functions [-n] [name]
  functions greet :: Show a function's code
  functions -e greet :: Erase a function
argparse :: Parse --options in functions :: argparse 'h/help' 'n/name=' -- $argv
  argparse 'v/verbose' -- $argv; and set -q _flag_verbose; and echo loud :: Read a --verbose flag
alias :: Shortcut (creates a function) :: alias name='command'
  alias ll 'ls -lah' :: Define
  alias --save ll 'ls -lah' :: Define and save permanently
abbr :: Abbreviations that expand as you type :: abbr -a short long
  abbr -a gco git checkout :: Type gco + space, it becomes git checkout
  abbr --list :: All abbreviations
fish_prompt :: The function that draws your prompt :: function fish_prompt; ...; end
  function fish_prompt; echo (prompt_pwd) '> '; end :: Minimal prompt
event handlers :: Run functions on events :: function f --on-variable PWD
  function on_cd --on-variable PWD; ls; end :: List files after every cd

## Fish Interactive Features
autosuggestions :: Grey suggestions from history :: Right arrow or Ctrl+F
  → :: Accept the whole suggestion
  Alt+→ :: Accept one word
history :: Search and manage history :: history [search|delete|merge]
  history search --contains ssh :: Find old commands
  history delete --prefix 'mysql -p' :: Remove commands containing passwords
  history merge :: Load history from other sessions
Up-arrow search :: Type part of a command, then press Up :: text + ↑
  ssh ↑ :: Cycle through earlier ssh commands
prevd / nextd :: Move through folder history :: prevd, nextd, cdh
  cdh :: Pick a recent folder from a menu
  Alt+← :: Previous folder
fish_vi_key_bindings :: Vi-style editing :: fish_vi_key_bindings
  fish_vi_key_bindings :: Switch to vi mode
  fish_default_key_bindings :: Back to Emacs mode
help :: Open fish documentation :: help [topic]
  help string :: Docs for the string command
type :: Show what a name is :: type [-a] name
  type ll :: Shows the function behind an alias
bash scripts :: Run bash code from fish :: bash script.sh
  bash -c 'source env.sh && env' :: Use a bash-only file
  exec bash :: Switch to bash for a while
`;
