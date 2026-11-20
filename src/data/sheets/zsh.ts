// Zsh: what's different from bash, plus its power features.
export default `
## Zsh Setup
.zshrc :: Your interactive zsh settings :: ~/.zshrc
  echo 'alias gs="git status"' >> ~/.zshrc :: Add an alias permanently
  source ~/.zshrc :: Reload settings
.zprofile / .zshenv :: Login and always-loaded settings :: ~/.zprofile ~/.zshenv
  echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zprofile :: PATH for login shells
setopt :: Turn zsh options on :: setopt OPTION...
  setopt autocd :: Type a folder name to cd into it
  setopt correct :: Offer to fix typos in commands
  setopt hist_ignore_all_dups share_history :: Better shared history
unsetopt :: Turn zsh options off :: unsetopt OPTION
  unsetopt beep :: No terminal beep
compinit :: Enable the completion system :: autoload -Uz compinit && compinit
  autoload -Uz compinit && compinit :: Tab-complete options for most commands
zstyle :: Configure completion style :: zstyle pattern style value
  zstyle ':completion:*' menu select :: Arrow-key menu for completions
  zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}' :: Case-insensitive completion
PROMPT :: Customise the prompt :: PROMPT='...'
  PROMPT='%n@%m %~ %# ' :: user@host folder %
  PROMPT='%F{cyan}%~%f %# ' :: Cyan folder name
RPROMPT :: A prompt on the right side :: RPROMPT='...'
  RPROMPT='%*' :: Show the time on the right
vcs_info :: Show the git branch in the prompt :: autoload -Uz vcs_info
  precmd() { vcs_info }; setopt prompt_subst; PROMPT='%~ \${vcs_info_msg_0_} %# ' :: Branch in your prompt
oh-my-zsh :: Popular zsh configuration framework :: sh -c "$(curl -fsSL https://install.ohmyz.sh)"
  plugins=(git z docker) :: (in .zshrc) Enable plugins
  omz update :: Update oh-my-zsh
zsh-autosuggestions :: Grey suggestions from your history :: source .../zsh-autosuggestions.zsh
  bindkey '^ ' autosuggest-accept :: Ctrl+Space accepts a suggestion
bindkey :: Bind keys to editor actions :: bindkey [-v|-e] key widget
  bindkey -v :: Vi editing mode
  bindkey '^R' history-incremental-search-backward :: Ctrl+R history search
autoload :: Load a function only when it is first used :: autoload -Uz name
  autoload -Uz zmv :: Load the zmv renamer
zmodload :: Load a zsh module :: zmodload zsh/module
  zmodload zsh/datetime; echo $EPOCHSECONDS :: Current Unix time

## Zsh Globbing
recursive glob :: ** matches any depth (always on in zsh) :: **/*.ext
  ls **/*.ts :: Every .ts file below here
  rm -- **/.DS_Store :: Delete every .DS_Store
glob qualifiers :: Filter matches by type, size, time :: pattern(qualifiers)
  ls *(.) :: Only regular files
  ls *(/) :: Only folders
  ls **/*(.Lm+100) :: Files over 100 MB
  ls *(.mh-1) :: Files changed in the last hour
  ls *(om[1,5]) :: The 5 newest files
  rm *(.N) :: N: no error if nothing matches
extended glob :: More pattern operators :: setopt extendedglob
  ls ^*.log :: Everything except .log files
  ls *.(jpg|png) :: jpg or png
  ls (#i)readme* :: Case-insensitive match
zmv :: Rename many files with patterns :: zmv 'pattern' 'replacement'
  zmv '(*).jpeg' '$1.jpg' :: .jpeg to .jpg
  zmv -n '(*) (*)' '$1_$2' :: Preview: replace spaces with underscores

## Zsh Variables & Arrays
arrays (1-based) :: Zsh arrays start at 1, not 0 :: arr=(a b c); $arr[1]
  arr=(red green blue); echo $arr[1] :: red (bash would need \${arr[0]})
  echo $#arr :: 3 (length)
  echo $arr[-1] :: blue (last item)
no word splitting :: Unquoted variables don't split on spaces :: echo $var
  f='my file.txt'; rm $f :: Safe in zsh (in bash you need "$f")
  echo \${=list} :: Force splitting when you want it
parameter flags :: Transform values :: \${(flags)var}
  echo \${(U)name} :: UPPERCASE
  echo \${(j:,:)arr} :: Join an array with commas
  echo \${(s:/:)PATH} :: Split on /
  echo \${(o)arr} :: Sort an array
associative arrays :: Key/value maps :: typeset -A map
  typeset -A port=(web 80 ssh 22) :: Create
  echo $port[ssh] :: 22
  echo \${(k)port} :: All keys
typeset :: Declare variables with attributes :: typeset [-i -a -A -U -r] name
  typeset -U path :: Remove duplicates from PATH automatically
path array :: PATH as an array :: path+=(dir)
  path+=(~/bin) :: Add ~/bin to PATH
  print -l $path :: One PATH entry per line
print :: Zsh's richer echo :: print [-l -n -P] text
  print -l a b c :: One item per line
  print -P '%F{green}done%f' :: Prompt-style colours
float maths :: Arithmetic with decimals :: $(( 10.0 / 3 ))
  echo $(( 10.0 / 3 )) :: 3.3333333333 (bash only does integers)

## Zsh Shortcuts & Tricks
directory stack :: Jump between recent folders :: cd -<Tab>, dirs -v
  setopt autopushd; cd -2 :: Go to the second most recent folder
named directories :: Short names for folders :: hash -d name=path
  hash -d proj=~/Developer/projects; cd ~proj :: Jump with ~proj
global aliases :: Aliases that work anywhere in a line :: alias -g NAME='...'
  alias -g G='| grep' :: ps aux G node
suffix aliases :: Open files by extension :: alias -s ext=program
  alias -s md=code :: Type notes.md to open it in VS Code
r :: Repeat the last command :: r [old=new]
  r :: Run the previous command again
  r 8080=9090 :: Re-run with 8080 replaced by 9090
take :: (oh-my-zsh) Make a folder and cd into it :: take dir
  take projects/new-app :: mkdir -p and cd in one step
fc :: Edit and re-run history in your editor :: fc [-l]
  fc :: Edit the last command in $EDITOR
  fc -l -10 :: The last 10 commands
history :: Show history (zsh flags) :: history [-i] [start]
  history -i 1 :: Whole history with timestamps
  history -20 :: The last 20 commands
precmd / preexec :: Hooks before the prompt and before a command :: precmd() { ... }
  preexec() { echo "running: $1" } :: Print each command before it runs
`;
