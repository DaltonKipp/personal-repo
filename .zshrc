# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

typeset -g POWERLEVEL9K_INSTANT_PROMPT=off

# ======= PERFORMANCE OPTIMIZATIONS =======
# Skip global compinit for faster startup
skip_global_compinit=1

# Lazy load nvm (if you use Node.js)
export NVM_LAZY_LOAD=true

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH
# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"
export PATH=/home/linuxbrew/.linuxbrew/bin:/home/dalton/.local/bin:$PATH

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment one of the following lines to change the auto-update behavior
# zstyle ':omz:update' mode disabled  # disable automatic updates
# zstyle ':omz:update' mode auto      # update automatically without asking
# zstyle ':omz:update' mode reminder  # just remind me to update when it's time

# Uncomment the following line to change how often to auto-update (in days).
# zstyle ':omz:update' frequency 13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# You can also set it to another string to have that shown instead of the default red dots.
# e.g. COMPLETION_WAITING_DOTS="%F{yellow}waiting...%f"
# Caution: this setting can cause issues with multiline prompts in zsh < 5.7.1 (see #5765)
COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.

source $ZSH/oh-my-zsh.sh
source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh

plugins=(
  git
  sudo
  fzf
  zsh-autosuggestions
  zsh-syntax-highlighting
  docker                    # Docker completions
  kubectl                   # Kubernetes completions
  npm                       # Node.js completions
  pip                       # Python pip completions
  colorize                  # Syntax highlighting for files
  extract                   # Smart archive extraction
  web-search                # Quick web searches
  copypath                  # Copy file paths to clipboard
  copyfile                  # Copy file contents to clipboard
)

# User configuration

# ======= ENVIRONMENT VARIABLES & SHELL SETTINGS =======

# Better history settings
export HISTSIZE=10000
export SAVEHIST=10000
export HISTFILE=~/.zsh_history
setopt HIST_VERIFY
setopt SHARE_HISTORY
setopt APPEND_HISTORY
setopt INC_APPEND_HISTORY
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE

# Better directory navigation
setopt AUTO_CD
setopt AUTO_PUSHD
setopt PUSHD_IGNORE_DUPS

# Editor settings
export EDITOR="nvim"
export VISUAL="nvim"

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
alias zshconfig="nvim ~/.zshrc"
alias ohmyzsh="nvim ~/.oh-my-zsh"
source ~/powerlevel10k/powerlevel10k.zsh-theme

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# ------- Alias ------- #
alias cl="clear"
alias apt_update="sudo apt update && sudo apt upgrade"
alias brew_update="brew update && brew upgrade"
alias home="cd ~"

# ------- BAT ------- #
export BAT_THEME="Visual Studio Dark+"
alias bat="bat --color=always --paging=never"
alias cat="bat"

# ------- EZA ------- #
alias ls="eza -G -a --long --git --color=always --icons=always --no-filesize --no-permissions --no-user --no-time"

# ------- Zoxide ------- #
# Only initialize if zoxide is installed
command -v zoxide >/dev/null 2>&1 && eval "$(zoxide init zsh)"
command -v zoxide >/dev/null 2>&1 && alias cd="z"

# ------- thefuck ------- # 
# Only initialize if thefuck is installed
command -v thefuck >/dev/null 2>&1 && eval $(thefuck --alias)

# Git
GITSTATUS_LOG_LEVEL=DEBUG

# ======= ADDITIONAL HELPFUL ALIASES =======

# Git Aliases (Enhanced)
alias gs="git status"
alias ga="git add"
alias gc="git commit"
alias gca="git commit -a"
alias gcm="git commit -m"
alias gp="git push"
alias gl="git pull"
alias gd="git diff"
alias gb="git branch"
alias gco="git checkout"
alias glog="git log --oneline --graph --decorate"
alias gstash="git stash"
alias gpop="git stash pop"

# Directory Navigation (Enhanced)
alias ll="ls -alF"
alias la="ls -A"
alias l="ls -CF"
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias ~="cd ~"
alias -- -="cd -"

# File Operations
alias cp="cp -i"
alias mv="mv -i"
alias rm="rm -i"
alias mkdir="mkdir -pv"
alias grep="grep --color=auto"
alias fgrep="fgrep --color=auto"
alias egrep="egrep --color=auto"

# System Information
alias df="df -h"
alias du="du -h"
alias free="free -h"
alias ps="ps auxf"
alias top="htop"
alias ports="netstat -tulanp"

# Development Tools
alias python="python3"
alias pip="pip3"
alias py="python3"
alias serve="python3 -m http.server"
alias json="python3 -m json.tool"
alias myip="curl http://ipecho.net/plain; echo"
alias weather="curl wttr.in"

# Productivity
alias h="history"
alias j="jobs -l"
alias path='echo -e ${PATH//:/\\n}'
alias now='date +"%T"'
alias nowtime=now
alias nowdate='date +"%d-%m-%Y"'
alias reload="source ~/.zshrc"

# Docker (if you use Docker)
alias dps="docker ps"
alias dpa="docker ps -a"
alias di="docker images"
alias dex="docker exec -it"
alias dlog="docker logs"
alias dstop="docker stop"
alias dstart="docker start"

# Quick edits
alias vimrc="$EDITOR ~/.vimrc"
alias nvimrc="$EDITOR ~/.config/nvim/init.vim"
alias hosts="sudo $EDITOR /etc/hosts"

# System monitoring
alias mem="free -h"
alias cpu="top -o cpu"
alias disk="df -h"

# Network
alias ping="ping -c 5"
alias wget="wget -c"

# Safety Aliases (Important!)
alias rm="rm -i"
alias cp="cp -i"
alias mv="mv -i"
alias ln="ln -i"

# ======= USEFUL FUNCTIONS =======

# Create directory and cd into it
mkcd() {
  mkdir -p "$1" && cd "$1"
}

# Extract any archive
extract() {
  if [ -f $1 ] ; then
    case $1 in
      *.tar.bz2)   tar xjf $1     ;;
      *.tar.gz)    tar xzf $1     ;;
      *.bz2)       bunzip2 $1     ;;
      *.rar)       unrar e $1     ;;
      *.gz)        gunzip $1      ;;
      *.tar)       tar xf $1      ;;
      *.tbz2)      tar xjf $1     ;;
      *.tgz)       tar xzf $1     ;;
      *.zip)       unzip $1       ;;
      *.Z)         uncompress $1  ;;
      *.7z)        7z x $1        ;;
      *)     echo "'$1' cannot be extracted via extract()" ;;
    esac
  else
    echo "'$1' is not a valid file"
  fi
}

# Find files quickly
ff() {
  find . -type f -name "*$1*"
}

# Process finder
psg() {
  ps aux | grep -v grep | grep "$@" -i --color=always
}

# ======= BETTER COMPLETIONS =======

# Case-insensitive completions
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'

# Better completion menu
zstyle ':completion:*' menu select
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}

# Enable command-line completion for various tools
autoload -Uz compinit && compinit

# ======= SMART SOURCING =======

# Source additional config files if they exist
[ -f ~/.zsh_local ] && source ~/.zsh_local
[ -f ~/.zsh_work ] && source ~/.zsh_work

# Auto-Warpify
[[ "$-" == *i* ]] && printf \eP{"hook": "SourcedRcFileForWarp", "value": { "shell": "zsh", "uname": "$(uname)" }}�\
