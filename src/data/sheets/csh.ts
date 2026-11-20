// csh / tcsh: the C shell family (still common on BSD and in older Unix setups).
export default `
## C Shell Basics
set :: Set a shell variable (local to this shell) :: set name = value
  set name = Ada :: Spaces around = are allowed
  echo $name :: Read it
  set colors = (red green blue) :: A list (1-based: $colors[1])
setenv :: Set an environment variable (no = sign) :: setenv NAME value
  setenv EDITOR vim :: Like export EDITOR=vim
  setenv PATH $HOME/bin:$PATH :: Add a folder to PATH
unset / unsetenv :: Remove shell or environment variables :: unset name; unsetenv NAME
  unsetenv API_KEY :: Remove an environment variable
path variable :: PATH as a list :: set path = (dir $path)
  set path = ($HOME/bin $path) :: Add a folder first
  echo $path :: Folders separated by spaces
@ :: Integer arithmetic :: @ var = expression
  @ count = 0 :: Set to 0
  @ count++ :: Increment
  @ total = $a + $b :: Add (spaces around operators!)
.cshrc / .tcshrc :: Your csh/tcsh settings :: ~/.cshrc ~/.tcshrc
  echo 'alias ll ls -la' >> ~/.tcshrc :: Add an alias permanently
  source ~/.tcshrc :: Reload settings
.login :: Settings for login shells :: ~/.login
  setenv LANG en_US.UTF-8 :: (common line) Login environment
prompt :: Customise the prompt :: set prompt = '...'
  set prompt = '%n@%m:%~%# ' :: tcsh: user@host:folder%
  set prompt = "\`hostname\`% " :: csh: host name prompt
alias :: Create a shortcut (args with \\!*) :: alias name 'command'
  alias ll 'ls -la' :: Define (no = sign)
  alias cdl 'cd \\!*; ls' :: \\!* means all arguments
  unalias ll :: Remove
status variable :: Exit status of the last command :: $status
  echo $status :: 0 means success (like $? in bash)
special variables :: Useful built-in variables :: $argv $#argv $$ $cwd $user $home
  echo $cwd :: Current folder
  echo $#argv :: Number of script arguments
variable modifiers :: Edit a variable's value :: $var:h $var:t $var:r $var:e
  set f = /tmp/photo.jpg; echo $f:t :: photo.jpg (tail)
  echo $f:h :: /tmp (head)
  echo $f:r :: /tmp/photo (remove extension)
  echo $f:e :: jpg (extension)
$?var :: Is a variable set? :: $?name
  if ($?EDITOR) echo $EDITOR :: 1 if set, 0 if not
command substitution :: Use output as text (backticks) :: \`command\`
  set today = \`date +%F\` :: Save output in a variable
  echo "Files: \`ls | wc -l\`" :: Inline

## C Shell Control Flow
if :: Run code conditionally :: if (expr) then ... else if (expr) then ... else ... endif
  if (-e config.yml) then :: Does the file exist? (close with endif)
  if ($count > 5) echo big :: One-line form
file tests :: Check files inside ( ) :: -e -f -d -r -w -x -z
  if (-d $home/bin) echo yes :: Is it a folder?
  if (! -e lock) echo free :: Negation with !
string tests :: Compare strings :: == != =~ !~
  if ("$name" == "Ada") echo hi :: Equal
  if ($file =~ *.txt) echo text :: Pattern match
foreach :: Loop over a list :: foreach var (list) ... end
  foreach f (*.png) :: Each PNG (body on the next lines, then end)
  foreach i (\`seq 5\`) :: Count 1 to 5
while :: Loop while an expression is true :: while (expr) ... end
  while ($n < 10) :: Body on following lines; close with end
switch :: Match a value against patterns :: switch (str) case pat: ... breaksw endsw
  switch ($1) :: Then: case start: ... breaksw / default: ... endsw
goto :: Jump to a label in a script :: goto label
  goto done :: Jump to a line "done:"
onintr :: Handle Ctrl+C in scripts :: onintr label
  onintr cleanup :: Jump to cleanup: on interrupt
exit :: Leave the script :: exit [status]
  exit 1 :: Exit with an error code

## Redirection & Jobs (csh)
redirect output :: csh redirects stdout and stderr together with >& :: > >> >& >>&
  ls > list.txt :: Output to a file
  make >& build.log :: Output and errors to a file
  (cmd > out.txt) >& err.txt :: Separate output and errors
noclobber :: Refuse to overwrite files with > :: set noclobber
  set noclobber :: Protect files
  echo hi >! file.txt :: Force overwrite once
pipe errors :: Pipe output and errors together :: cmd |& cmd2
  make |& less :: Page through output and errors
jobs :: List background jobs :: jobs [-l]
  jobs -l :: With PIDs
fg / bg :: Move jobs between foreground and background :: fg %n; bg %n
  fg %1 :: Bring job 1 back
history :: Show command history :: history [n]
  history 20 :: The last 20 commands
  !! :: Repeat the last command
  !vi :: Re-run the last command starting with vi
rehash :: Re-scan PATH for new programs :: rehash
  rehash :: Run after installing a program so csh finds it
which (builtin) :: Find a command in tcsh :: which command
  which python3 :: Path, alias or builtin
source :: Run a file in the current shell :: source file
  source ~/.cshrc :: Reload settings
repeat :: Run a command several times :: repeat count command
  repeat 3 echo hello :: Prints hello 3 times
time :: Time a command :: time command
  time make :: tcsh prints CPU and elapsed time
limit :: Show or set resource limits :: limit [resource [max]]
  limit coredumpsize 0 :: No core dump files
complete :: tcsh programmable completion :: complete cmd 'pattern'
  complete cd 'p/1/d/' :: Complete only folders for cd
bindkey :: tcsh key bindings :: bindkey [-v|-e] [key command]
  bindkey -v :: Vi editing mode
`;
