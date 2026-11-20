// Linux commands, part 2: permissions, users, processes, system, disks, archives.
export default `
## Permissions
chmod :: Change who can read, write or run a file :: chmod [-R] mode file...
  chmod +x deploy.sh :: Make a script executable
  chmod 644 index.html :: Owner read/write, everyone else read
  chmod 700 ~/.ssh :: Only you can open the folder
  chmod -R u+rwX,go-rwx private/ :: Recursive, symbolic modes
chown :: Change a file's owner and group :: chown [-R] user[:group] file...
  sudo chown www-data:www-data -R /var/www :: Give a web folder to the web server
  sudo chown $USER file :: Take ownership of a file
chgrp :: Change a file's group :: chgrp [-R] group file
  sudo chgrp developers shared/ :: Set the folder's group
umask :: Set default permissions for new files :: umask [mask]
  umask :: Show the current mask, e.g. 0022
  umask 077 :: New files are private to you
sudo :: Run a command as another user (usually root) :: sudo [-u user] [-i] command
  sudo apt update :: Run one command as root
  sudo -i :: Open a root shell
  sudo -u postgres psql :: Run as another user
  sudo !! :: Re-run the last command with sudo
su :: Switch to another user :: su [-] [user]
  su - :: Become root with root's environment
  su - alice :: Become alice
visudo :: Safely edit the sudoers file :: sudo visudo
  sudo visudo :: Checks syntax before saving, so you can't lock yourself out
id :: Show your user and group IDs :: id [user]
  id :: Your uid, gid and groups
  id -nG alice :: Alice's group names
groups :: List the groups a user belongs to :: groups [user]
  groups :: Your groups
getfacl :: Show a file's access control list :: getfacl file
  getfacl shared/ :: Extra per-user permissions
setfacl :: Set access control lists :: setfacl -m u:user:perms file
  setfacl -m u:bob:rw report.txt :: Give bob read/write on one file
  setfacl -x u:bob report.txt :: Remove bob's entry
newgrp :: Start a shell with a new primary group :: newgrp group
  newgrp docker :: Use a group you were just added to, without logging out

## Users & Groups
whoami :: Print your user name :: whoami
  whoami :: Who am I logged in as?
who :: Show who is logged in :: who [-b]
  who :: Logged-in users and terminals
  who -b :: Time of the last boot
w :: Show who is logged in and what they're doing :: w [user]
  w :: Users, load averages and current commands
last :: Show recent logins :: last [-n N] [user]
  last -n 10 :: The last 10 logins
  last reboot :: Reboot history
useradd :: Create a user account :: useradd [-m] [-s shell] [-G groups] user
  sudo useradd -m -s /bin/bash alice :: Create alice with a home folder
adduser :: Friendly way to create a user (Debian/Ubuntu) :: adduser user
  sudo adduser bob :: Asks for a password and details
usermod :: Change a user account :: usermod [-aG groups] [-s shell] user
  sudo usermod -aG docker $USER :: Add yourself to a group (-a keeps other groups!)
  sudo usermod -s /usr/bin/zsh alice :: Change a user's shell
userdel :: Delete a user account :: userdel [-r] user :: !
  sudo userdel -r olduser :: Delete the user and their home folder
groupadd :: Create a group :: groupadd group
  sudo groupadd developers :: Create a group
groupdel :: Delete a group :: groupdel group
  sudo groupdel testers :: Delete a group
passwd :: Change a password :: passwd [user]
  passwd :: Change your own password
  sudo passwd -l bob :: Lock bob's account
chage :: View or set password expiry :: chage [-l] [-M days] user
  sudo chage -l alice :: Show expiry information
chsh :: Change your login shell :: chsh -s shell
  chsh -s $(which zsh) :: Make zsh your default shell
  chsh -s /usr/bin/fish :: Make fish your default shell

## Processes & Jobs
ps :: Show running processes :: ps [aux | -ef]
  ps aux :: Every process, with CPU and memory use
  ps aux | grep node :: Find a process
  ps -eo pid,%mem,cmd --sort=-%mem | head :: Top memory users
top :: Live view of processes :: top [-u user]
  top :: Press M to sort by memory, P by CPU, q to quit
  top -u www-data :: Only one user's processes
htop :: Friendlier interactive process viewer :: htop
  htop :: F3 to search, F9 to kill, F6 to sort
pgrep :: Find process IDs by name :: pgrep [-a] [-u user] pattern
  pgrep -a python :: PIDs and commands of python processes
pkill :: Signal processes by name :: pkill [-signal] pattern :: !
  pkill -f 'node server.js' :: Stop a process by its full command
  pkill -HUP nginx :: Ask nginx to reload
kill :: Send a signal to a process :: kill [-signal] pid :: !
  kill 1234 :: Ask process 1234 to stop (SIGTERM)
  kill -9 1234 :: Force it to stop (SIGKILL)
  kill -l :: List signal names
killall :: Signal all processes with a name :: killall [-signal] name :: !
  killall firefox :: Close every Firefox process
pidof :: Find the PID of a running program :: pidof program
  pidof sshd :: PIDs of the SSH server
pstree :: Show processes as a tree :: pstree [-p] [user]
  pstree -p :: Tree with PIDs
nice :: Start a command with a different priority :: nice [-n N] command
  nice -n 19 tar czf backup.tgz ~/ :: Run at the lowest priority
renice :: Change a running process's priority :: renice -n N -p pid
  sudo renice -n -5 -p 1234 :: Give a process more CPU priority
nohup :: Keep a command running after you log out :: nohup command &
  nohup ./server > server.log 2>&1 & :: Run in the background and survive logout
timeout :: Stop a command after a time limit :: timeout duration command
  timeout 10s curl https://slow.site :: Give up after 10 seconds
watch :: Re-run a command every few seconds :: watch [-n secs] [-d] command
  watch -n 1 'ls -l downloads' :: Refresh every second
  watch -d free -h :: Highlight what changed
time :: Measure how long a command takes :: time command
  time npm run build :: Real, user and system time
lsof :: List open files and network sockets :: lsof [-i :port] [-p pid]
  lsof -i :3000 :: What is using port 3000?
  lsof -p 1234 :: Files a process has open
  lsof +D /mnt/usb :: Who is using a mounted drive?
fuser :: Show which processes use a file or port :: fuser [-k] file|port/proto
  fuser 8080/tcp :: PID using TCP port 8080
  fuser -k 8080/tcp :: Kill it
strace :: Trace a program's system calls :: strace [-p pid] [-e trace=...] command
  strace -e trace=openat ls :: See which files a command opens
  sudo strace -p 1234 :: Attach to a running process
crontab :: Schedule repeating jobs :: crontab [-e | -l | -r]
  crontab -e :: Edit your scheduled jobs
  crontab -l :: List them
  0 3 * * * /home/me/backup.sh :: (crontab line) Run every day at 03:00
at :: Run a command once at a later time :: at time
  echo 'shutdown -h now' | at 23:00 :: Run tonight at 11 pm
  atq :: List pending jobs
systemd-run :: Run a command as a temporary service or timer :: systemd-run [--on-calendar=...] cmd
  systemd-run --user --on-active=30m notify-send 'Break!' :: A reminder in 30 minutes

## System Information
uname :: Show kernel and system details :: uname [-a -r -m]
  uname -a :: Everything
  uname -r :: Kernel version
hostname :: Show or set the computer's name :: hostname [-I]
  hostname :: The machine's name
  hostname -I :: All IP addresses
hostnamectl :: Show or change hostname and OS details :: hostnamectl [set-hostname name]
  hostnamectl :: OS, kernel and hardware summary
  sudo hostnamectl set-hostname web01 :: Rename the machine
uptime :: How long the system has been running :: uptime [-p]
  uptime :: Uptime, users and load averages
  uptime -p :: Pretty format, e.g. up 3 days
date :: Show or set the date and time :: date [+format]
  date +%Y-%m-%d :: Today as 2026-11-20
  date -d 'next friday' :: Date arithmetic
  date +%s :: Seconds since 1970 (Unix time)
cal :: Show a calendar :: cal [month] [year]
  cal -3 :: Last, this and next month
timedatectl :: Show or change time zone and clock :: timedatectl [set-timezone zone]
  timedatectl :: Time, zone and sync status
  sudo timedatectl set-timezone Africa/Lagos :: Change the time zone
lscpu :: Show CPU details :: lscpu
  lscpu :: Cores, threads, model and cache
nproc :: Number of CPU cores available :: nproc
  make -j$(nproc) :: Build using every core
free :: Show memory use :: free [-h]
  free -h :: RAM and swap in human sizes
vmstat :: Report memory, CPU and I/O activity :: vmstat [delay [count]]
  vmstat 2 5 :: 5 reports, 2 seconds apart
iostat :: Report disk I/O statistics :: iostat [-x] [delay]
  iostat -x 2 :: Extended disk stats every 2 seconds
lsblk :: List disks and partitions :: lsblk [-f]
  lsblk :: Disks as a tree
  lsblk -f :: With filesystems and labels
lsusb :: List USB devices :: lsusb [-t]
  lsusb :: Everything plugged into USB
lspci :: List PCI devices :: lspci [-k]
  lspci | grep -i vga :: Your graphics card
dmesg :: Show kernel messages :: dmesg [-T] [-w]
  sudo dmesg -T | tail :: Recent messages with readable times
  sudo dmesg -w :: Follow new messages (plug in a USB to see it)
env :: Show environment variables or run with changes :: env [VAR=value] [command]
  env | sort :: Every environment variable
  env -i bash :: Start a shell with an empty environment
printenv :: Print environment variables :: printenv [VAR]
  printenv PATH :: The value of PATH
lsb_release :: Show the Linux distribution :: lsb_release -a
  lsb_release -a :: Distribution name and version
os-release :: Distribution details file :: cat /etc/os-release
  cat /etc/os-release :: Works on every modern distro
arch :: Print the machine architecture :: arch
  arch :: e.g. x86_64 or aarch64
dmidecode :: Read hardware info from the BIOS :: sudo dmidecode [-t type]
  sudo dmidecode -t memory :: RAM sticks and speeds
  sudo dmidecode -s system-serial-number :: Serial number
sensors :: Show temperatures and fan speeds :: sensors
  sensors :: CPU temperature (from lm-sensors)
getconf :: Query system configuration values :: getconf name
  getconf LONG_BIT :: 32 or 64 bit
  getconf PAGESIZE :: Memory page size

## Disks & Filesystems
df :: Show free disk space :: df [-h] [-T] [path]
  df -h :: Every filesystem, human sizes
  df -h . :: Free space where you are
du :: Show how much space files use :: du [-sh] [--max-depth=N] path
  du -h --max-depth=1 | sort -h :: Biggest folders here
  du -sh ~/Downloads :: Total size of one folder
ncdu :: Interactive disk usage explorer :: ncdu [path]
  ncdu / :: Find what fills your disk (d deletes)
mount :: Attach a filesystem :: mount [-t type] [-o opts] device dir
  sudo mount /dev/sdb1 /mnt/usb :: Mount a USB drive
  mount | column -t :: What is mounted
  sudo mount -o remount,rw / :: Remount read-write
umount :: Detach a filesystem :: umount dir|device
  sudo umount /mnt/usb :: Safely unmount
findmnt :: Show mounted filesystems as a tree :: findmnt [target]
  findmnt -T . :: Which filesystem holds this folder
blkid :: Show partition UUIDs and types :: blkid [device]
  sudo blkid :: UUIDs for /etc/fstab
fdisk :: Edit partition tables :: fdisk [-l] device :: !
  sudo fdisk -l :: List every disk and partition
  sudo fdisk /dev/sdb :: Edit a disk's partitions (careful!)
parted :: Partition editor (GPT friendly) :: parted device [command] :: !
  sudo parted /dev/sdb print :: Show partitions
mkfs :: Create a filesystem (erases the partition!) :: mkfs.TYPE device :: !
  sudo mkfs.ext4 /dev/sdb1 :: Format as ext4
  sudo mkfs.vfat -F 32 /dev/sdb1 :: Format as FAT32 for any OS
fsck :: Check and repair a filesystem :: fsck [-y] device
  sudo fsck -y /dev/sdb1 :: Check and fix (unmount it first)
mkswap :: Prepare a swap area :: mkswap file|device
  sudo fallocate -l 2G /swapfile && sudo mkswap /swapfile :: Create a 2 GB swap file
swapon :: Turn swap on, or list it :: swapon [--show] [file]
  sudo swapon /swapfile :: Enable a swap file
  swapon --show :: List active swap
swapoff :: Turn swap off :: swapoff file|-a
  sudo swapoff /swapfile :: Disable a swap file
resize2fs :: Grow or shrink an ext4 filesystem :: resize2fs device [size]
  sudo resize2fs /dev/sda1 :: Grow to fill its partition
tune2fs :: Adjust ext filesystem settings :: tune2fs [-l] [-L label] device
  sudo tune2fs -L data /dev/sdb1 :: Set a label
fallocate :: Reserve space for a file instantly :: fallocate -l size file
  fallocate -l 1G test.img :: Create a 1 GB file

## Archives & Compression
tar :: Bundle files into an archive (and compress) :: tar [c|x|t][z|j|J]f archive [files]
  tar czf site.tar.gz site/ :: Create a gzip archive
  tar xzf site.tar.gz :: Extract it
  tar tf archive.tar :: List what's inside
  tar xf file.tar.xz -C /opt :: Extract into a folder
  tar czf - . | ssh host 'tar xzf - -C backup' :: Copy a folder over SSH
gzip :: Compress files (.gz) :: gzip [-d -k -9] file
  gzip -k big.log :: Compress and keep the original
  gzip -d file.gz :: Decompress
gunzip :: Decompress .gz files :: gunzip file.gz
  gunzip *.gz :: Decompress them all
zcat :: Print a compressed file :: zcat file.gz
  zcat access.log.2.gz | grep 404 :: Read without decompressing to disk
bzip2 :: Compress with bzip2 (.bz2) :: bzip2 [-d -k] file
  bzip2 -k data.csv :: Smaller than gzip, slower
xz :: Strong compression (.xz) :: xz [-d -k -T0] file
  xz -T0 -k disk.img :: Use every core
  xz -d file.xz :: Decompress
zstd :: Fast modern compression (.zst) :: zstd [-d] [-19] file
  zstd -19 data.tar :: High compression
  tar --zstd -cf code.tar.zst src/ :: tar with zstd
zip :: Create .zip archives :: zip [-r] [-e] archive.zip files
  zip -r project.zip project/ -x '*/node_modules/*' :: Zip a folder, skip node_modules
  zip -e secret.zip notes.txt :: Password-protect
unzip :: Extract .zip archives :: unzip [-l] [-d dir] archive.zip
  unzip photos.zip -d photos/ :: Extract into a folder
  unzip -l app.zip :: List the contents
7z :: 7-Zip: many archive formats :: 7z [a|x|l] archive [files]
  7z x archive.7z :: Extract
  7z a -p backup.7z docs/ :: Create with a password
`;
