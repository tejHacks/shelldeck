// Linux commands, part 3: network, packages, services, git, docker, terminal tools.
export default `
## Networking
ping :: Check if a host is reachable :: ping [-c N] host
  ping -c 4 google.com :: Send 4 pings, then stop
curl :: Transfer data with URLs (HTTP and more) :: curl [options] url
  curl -I https://example.com :: Only the response headers
  curl -O https://site.com/file.zip :: Download, keep the file name
  curl -X POST -H 'Content-Type: application/json' -d '{"a":1}' api/items :: POST JSON
  curl -sL https://get.tool.sh | bash :: Follow redirects (read scripts before piping to bash!)
wget :: Download files :: wget [-c] [-O file] url
  wget -c https://site.com/big.iso :: Resume a broken download
  wget -r -np -k https://site.com/docs/ :: Mirror part of a site
ssh :: Log in to another machine securely :: ssh [-p port] [-i key] user@host [command]
  ssh user@server :: Open a remote shell
  ssh -p 2222 user@server :: Use a different port
  ssh user@server 'df -h' :: Run one command remotely
  ssh -L 8080:localhost:80 user@server :: Forward a local port through SSH
scp :: Copy files over SSH :: scp [-r] [-P port] source dest
  scp file.txt user@server:/tmp/ :: Upload
  scp -r user@server:~/logs ./ :: Download a folder
sftp :: Interactive file transfer over SSH :: sftp user@host
  sftp user@server :: Then use ls, get, put, exit
rsync :: Sync files efficiently (local or SSH) :: rsync [-avz] [--delete] src dest
  rsync -avz site/ user@server:/var/www/ :: Upload only what changed
  rsync -av --delete src/ backup/ :: Mirror, deleting removed files
  rsync -avP big.iso server: :: Show progress, resume partial files
ssh-keygen :: Create SSH keys :: ssh-keygen [-t type] [-C comment]
  ssh-keygen -t ed25519 -C 'laptop' :: Create a modern key pair
  ssh-keygen -R server :: Forget a host's old key
ssh-copy-id :: Install your public key on a server :: ssh-copy-id user@host
  ssh-copy-id user@server :: Log in without a password afterwards
ssh-agent :: Hold your keys in memory :: eval "$(ssh-agent)"
  eval "$(ssh-agent -s)" :: Start the agent
ssh-add :: Add a key to the agent :: ssh-add [key]
  ssh-add ~/.ssh/id_ed25519 :: Type the passphrase once
ip :: Show and change network settings :: ip [addr|link|route] ...
  ip a :: Addresses on every interface
  ip route :: Routing table and default gateway
  sudo ip link set eth0 down :: Turn an interface off
ifconfig :: Old tool to show interfaces :: ifconfig [iface]
  ifconfig :: Interfaces and addresses (use ip on new systems)
ss :: Show network sockets :: ss [-tulpn]
  ss -tulpn :: Listening ports and the programs using them
  ss -s :: Socket summary
netstat :: Old tool for connections and ports :: netstat [-tulpn]
  netstat -tulpn :: Listening ports (use ss on new systems)
dig :: Query DNS :: dig [@server] name [type]
  dig example.com :: The A record
  dig +short MX gmail.com :: Mail servers, short output
  dig @1.1.1.1 example.com :: Ask a specific DNS server
nslookup :: Simple DNS lookup :: nslookup name [server]
  nslookup example.com :: IP of a name
host :: Quick DNS lookup :: host name
  host 8.8.8.8 :: Reverse lookup
traceroute :: Show the route packets take :: traceroute host
  traceroute google.com :: Each hop to the destination
mtr :: Live traceroute and ping combined :: mtr host
  mtr -rw google.com :: A report of packet loss per hop
nc :: netcat: read and write network connections :: nc [-l] [-z] host port
  nc -zv server 22 :: Is port 22 open?
  nc -l 9000 > file :: Receive a file (send with: nc host 9000 < file)
nmap :: Scan hosts and ports (only networks you own!) :: nmap [options] target
  nmap -sn 192.168.1.0/24 :: Which devices are on my network?
  nmap -p 1-1000 192.168.1.10 :: Scan ports on one machine
whois :: Look up domain registration :: whois domain
  whois example.com :: Registrar and dates
tcpdump :: Capture network packets :: tcpdump [-i iface] [filter]
  sudo tcpdump -i any port 80 :: Watch HTTP traffic
  sudo tcpdump -w capture.pcap :: Save for Wireshark
ufw :: Uncomplicated firewall (Ubuntu) :: ufw [allow|deny|enable|status]
  sudo ufw allow 22/tcp :: Allow SSH
  sudo ufw enable :: Turn the firewall on
  sudo ufw status numbered :: Show rules
iptables :: Low-level packet filtering rules :: iptables [-L | -A chain rule]
  sudo iptables -L -n -v :: List rules
nmcli :: NetworkManager command line :: nmcli [device|connection] ...
  nmcli device wifi list :: Nearby Wi-Fi networks
  nmcli device wifi connect MyWiFi password secret :: Join a network
iw :: Wireless device configuration :: iw dev [iface] ...
  iw dev wlan0 link :: Signal and connection details
ethtool :: Show or change network card settings :: ethtool iface
  ethtool eth0 :: Link speed and duplex
http-server :: Serve the current folder over HTTP :: python3 -m http.server [port]
  python3 -m http.server 8000 :: Share a folder at http://your-ip:8000

## Packages
apt :: Debian/Ubuntu package manager :: apt [update|install|remove|search] ...
  sudo apt update && sudo apt upgrade :: Refresh lists and upgrade everything
  sudo apt install htop :: Install a package
  sudo apt remove --purge pkg :: Remove a package and its config
  apt search 'image editor' :: Search packages
  sudo apt autoremove :: Remove unused dependencies
apt-cache :: Query the apt package database :: apt-cache [show|policy|depends] pkg
  apt-cache policy nginx :: Installed and available versions
dpkg :: Low-level Debian package tool :: dpkg [-i | -l | -L | -S] ...
  sudo dpkg -i app.deb :: Install a .deb file
  dpkg -l | grep nginx :: Is it installed?
  dpkg -S /usr/bin/curl :: Which package owns this file?
dnf :: Fedora/RHEL package manager :: dnf [install|remove|upgrade|search] ...
  sudo dnf install git :: Install a package
  sudo dnf upgrade :: Upgrade everything
yum :: Older RHEL/CentOS package manager :: yum [install|update] ...
  sudo yum install wget :: Install a package
rpm :: Low-level RPM package tool :: rpm [-qa | -ivh | -qf] ...
  rpm -qa | grep kernel :: Installed kernels
  rpm -qf /etc/hosts :: Which package owns a file
pacman :: Arch Linux package manager :: pacman [-S|-Syu|-R|-Ss] ...
  sudo pacman -Syu :: Upgrade the whole system
  sudo pacman -S firefox :: Install a package
  pacman -Ss editor :: Search
zypper :: openSUSE package manager :: zypper [in|rm|up|se] ...
  sudo zypper in vim :: Install a package
apk :: Alpine Linux package manager :: apk [add|del|update] ...
  apk add --no-cache curl :: Install (common in Dockerfiles)
snap :: Install and manage snap packages :: snap [install|list|remove] ...
  sudo snap install code --classic :: Install VS Code
flatpak :: Install sandboxed desktop apps :: flatpak [install|run|update] ...
  flatpak install flathub org.gimp.GIMP :: Install GIMP from Flathub
brew :: Homebrew package manager (macOS and Linux) :: brew [install|upgrade|list] ...
  brew install wget :: Install a package
  brew upgrade :: Upgrade everything
pip :: Install Python packages :: pip install [-r file] package
  python3 -m pip install requests :: Install a package
  pip install -r requirements.txt :: Install a project's packages
npm :: Node.js package manager :: npm [install|run|ci] ...
  npm install :: Install a project's packages
  npm run build :: Run a script from package.json
  npx create-expo-app my-app :: Run a package without installing it

## Services & Power
systemctl :: Control systemd services :: systemctl [start|stop|restart|status|enable] unit
  sudo systemctl restart nginx :: Restart a service
  systemctl status ssh :: Is it running? Recent logs
  sudo systemctl enable --now docker :: Start now and at every boot
  systemctl list-units --failed :: Services that failed
journalctl :: Read systemd logs :: journalctl [-u unit] [-f] [--since]
  journalctl -u nginx -f :: Follow one service's logs
  journalctl --since '1 hour ago' :: Recent logs
  journalctl -b -p err :: Errors since this boot
  sudo journalctl --vacuum-size=200M :: Shrink old logs
service :: Older way to control services :: service name [start|stop|status]
  sudo service apache2 restart :: Restart a service
shutdown :: Power off or restart on a schedule :: shutdown [-h|-r] [time] :: !
  sudo shutdown -h now :: Power off now
  sudo shutdown -r +10 'Updating' :: Restart in 10 minutes with a message
  sudo shutdown -c :: Cancel a scheduled shutdown
reboot :: Restart the machine :: sudo reboot :: !
  sudo reboot :: Restart now
poweroff :: Turn the machine off :: sudo poweroff :: !
  sudo poweroff :: Power off now
systemd-analyze :: Analyse boot time :: systemd-analyze [blame]
  systemd-analyze blame :: Which services slow down boot
loginctl :: Manage user sessions :: loginctl [list-sessions|terminate-user]
  loginctl list-sessions :: Who has a session

## Git
git init :: Start a new repository :: git init [folder]
  git init :: Turn this folder into a repo
git clone :: Copy a remote repository :: git clone url [folder]
  git clone https://github.com/user/repo.git :: Download a repo
  git clone --depth 1 url :: Only the latest commit (fast)
git status :: Show what changed :: git status [-s]
  git status -s :: Short format
git add :: Stage changes for the next commit :: git add path | -A | -p
  git add . :: Stage everything here
  git add -p :: Pick changes piece by piece
git commit :: Save staged changes :: git commit [-m msg] [--amend]
  git commit -m 'Add login screen' :: Commit with a message
  git commit --amend --no-edit :: Add staged changes to the last commit
git log :: Show commit history :: git log [--oneline] [--graph] [-n N]
  git log --oneline --graph --all :: Compact history as a graph
  git log -p -- file.txt :: Every change to one file
git diff :: Show changes :: git diff [--staged] [commit] [-- path]
  git diff :: Unstaged changes
  git diff --staged :: What will be committed
  git diff main..feature :: Compare two branches
git branch :: List, create or delete branches :: git branch [-d] [name]
  git branch -a :: All branches, including remote ones
  git branch -d old-feature :: Delete a merged branch
git switch :: Change branches :: git switch [-c] branch
  git switch -c feature/login :: Create and switch to a branch
  git switch main :: Go back to main
git checkout :: Switch branches or restore files (older) :: git checkout branch | -- file
  git checkout -- file.txt :: Throw away changes to a file
git merge :: Join another branch into yours :: git merge branch
  git merge feature/login :: Merge a branch into the current one
git rebase :: Replay your commits on top of another branch :: git rebase [-i] branch
  git rebase main :: Update your branch with main
  git rebase -i HEAD~3 :: Edit, squash or reorder the last 3 commits
git pull :: Fetch and merge from the remote :: git pull [--rebase]
  git pull --rebase :: Update without merge commits
git push :: Upload commits :: git push [-u] [remote] [branch]
  git push -u origin main :: Push and remember the upstream
  git push --force-with-lease :: Safer force push after a rebase
git fetch :: Download remote changes without merging :: git fetch [--prune]
  git fetch --prune :: Also forget deleted remote branches
git remote :: Manage remote repositories :: git remote [-v] [add name url]
  git remote -v :: Show remotes
  git remote add origin https://github.com/me/app.git :: Connect to GitHub
git stash :: Put changes aside for later :: git stash [push|pop|list]
  git stash :: Save and clean your working folder
  git stash pop :: Bring the changes back
git reset :: Move HEAD and unstage changes :: git reset [--soft|--hard] [commit] :: !
  git reset HEAD~1 --soft :: Undo the last commit, keep the changes
  git reset --hard origin/main :: Throw everything away and match the remote
git restore :: Restore files :: git restore [--staged] path
  git restore --staged file.txt :: Unstage a file
  git restore file.txt :: Discard local changes to a file
git revert :: Undo a commit with a new commit :: git revert commit
  git revert a1b2c3d :: Safely undo a pushed commit
git tag :: Mark a release :: git tag [-a] name [commit]
  git tag -a v1.0.0 -m 'First release' :: Create an annotated tag
  git push --tags :: Upload tags
git blame :: Show who changed each line :: git blame file
  git blame -L 10,20 app.ts :: Only lines 10 to 20
git cherry-pick :: Copy a commit onto your branch :: git cherry-pick commit
  git cherry-pick a1b2c3d :: Apply one commit from another branch
git bisect :: Find the commit that broke something :: git bisect start | good | bad
  git bisect start && git bisect bad && git bisect good v1.0 :: Binary-search history
git config :: Set Git options :: git config [--global] key value
  git config --global user.name 'Your Name' :: Set your name
  git config --global init.defaultBranch main :: New repos use main

## Docker
docker run :: Start a new container :: docker run [-d] [-p host:ctr] [-v src:dst] image [cmd]
  docker run -it --rm ubuntu bash :: Throwaway Ubuntu shell
  docker run -d -p 8080:80 --name web nginx :: Run nginx in the background on port 8080
docker ps :: List containers :: docker ps [-a]
  docker ps -a :: Including stopped ones
docker images :: List images :: docker images
  docker images :: Downloaded and built images
docker build :: Build an image from a Dockerfile :: docker build -t name[:tag] path
  docker build -t myapp:1.0 . :: Build from the current folder
docker exec :: Run a command in a running container :: docker exec -it container cmd
  docker exec -it web sh :: Open a shell inside
docker logs :: Show a container's output :: docker logs [-f] container
  docker logs -f --tail 100 web :: Follow the last 100 lines
docker stop :: Stop containers :: docker stop container...
  docker stop web :: Stop gracefully
docker rm :: Remove containers :: docker rm [-f] container...
  docker rm -f web :: Stop and remove
docker rmi :: Remove images :: docker rmi image...
  docker rmi myapp:old :: Delete an image
docker pull :: Download an image :: docker pull image[:tag]
  docker pull postgres:17 :: Get a specific version
docker system prune :: Free disk space :: docker system prune [-a] :: !
  docker system prune -a :: Remove all unused containers, images and networks
docker compose :: Run multi-container apps :: docker compose [up|down|logs|ps]
  docker compose up -d :: Start everything in the background
  docker compose down -v :: Stop and remove volumes
  docker compose logs -f api :: Follow one service

## Terminal Tools
man :: Read a command's manual :: man [section] command
  man tar :: The tar manual (/ searches, q quits)
  man 5 crontab :: The crontab file format
tldr :: Short practical examples for a command :: tldr command
  tldr tar :: The most common tar uses
clear :: Clear the screen :: clear
  clear :: Or press Ctrl+L
reset :: Fix a garbled terminal :: reset
  reset :: Use after printing a binary file by mistake
tmux :: Terminal multiplexer: panes, windows, sessions :: tmux [new|attach|ls]
  tmux new -s work :: New named session
  tmux attach -t work :: Reattach after disconnecting
  tmux ls :: List sessions (Ctrl+b d detaches)
screen :: Older terminal multiplexer :: screen [-S name | -r]
  screen -S job :: Start a session (Ctrl+a d detaches)
  screen -r job :: Reattach
script :: Record a terminal session :: script [file]
  script session.txt :: Record everything until you type exit
bc :: Command-line calculator :: bc [-l]
  echo '2^10' | bc :: 1024
  echo 'scale=3; 10/3' | bc :: 3.333
expr :: Evaluate simple expressions :: expr a op b
  expr 7 \\* 6 :: 42 (escape the *)
sleep :: Pause for a while :: sleep duration
  sleep 5 :: Wait 5 seconds
  sleep 2m :: Wait 2 minutes
tput :: Control terminal colours and cursor :: tput [setaf N|bold|sgr0|cols]
  tput cols :: Terminal width
  echo "$(tput setaf 2)OK$(tput sgr0)" :: Print green text
xdg-open :: Open a file or URL with the default app :: xdg-open file|url
  xdg-open report.pdf :: Open in the PDF viewer
  xdg-open . :: Open this folder in the file manager
cowsay :: A talking cow (for fun) :: cowsay text
  fortune | cowsay :: A cow with wisdom

## Kernel & Modules
lsmod :: List loaded kernel modules :: lsmod
  lsmod | grep snd :: Sound modules
modprobe :: Load or remove kernel modules :: modprobe [-r] module
  sudo modprobe vboxdrv :: Load a module
  sudo modprobe -r pcspkr :: Remove the beep module
modinfo :: Show information about a module :: modinfo module
  modinfo e1000e :: Version, author and options
sysctl :: Read or change kernel settings :: sysctl [-a] [key=value]
  sysctl vm.swappiness :: Read a setting
  sudo sysctl -w vm.swappiness=10 :: Change it until reboot
`;
