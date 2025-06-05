#!/bin/bash

# system_info.sh - Script to gather and display system information in table format
# Created: $(date)

# Define color codes using \e instead of \033 for better compatibility
BLUE="\e[0;34m"
LBLUE="\e[1;34m"
GREEN="\e[0;32m"
LGREEN="\e[1;32m"
RED="\e[0;31m"
YELLOW="\e[0;33m"
CYAN="\e[0;36m"
LCYAN="\e[1;36m"
PURPLE="\e[0;35m"
LPURPLE="\e[1;35m"
GRAY="\e[0;37m"
WHITE="\e[1;37m"
NC="\e[0m" # No Color

# Function to properly output colored text
colored_text() {
    local color="$1"
    local text="$2"
    echo -e "${color}${text}${NC}"
}

# Box drawing characters (ASCII alternatives for better compatibility)
H_LINE=$'\u2500'    # ─
V_LINE=$'\u2502'    # │
TL_CORNER=$'\u250C' # ┌
TR_CORNER=$'\u2510' # ┐
BL_CORNER=$'\u2514' # └
BR_CORNER=$'\u2518' # ┘
L_JOINT=$'\u251C'   # ├
R_JOINT=$'\u2524'   # ┤
T_JOINT=$'\u252C'   # ┬
B_JOINT=$'\u2534'   # ┴
CROSS=$'\u253C'     # ┼

# Detect whether the current locale is using UTF-8
if [[ "$(locale charmap 2>/dev/null)" == "UTF-8" ]]; then
    H_LINE="─"
    V_LINE="│"
    TL_CORNER="┌"
    TR_CORNER="┐"
    BL_CORNER="└"
    BR_CORNER="┘"
    L_JOINT="├"
    R_JOINT="┤"
    T_JOINT="┬"
    B_JOINT="┴"
    CROSS="┼"
else
    # Fallback to plain ASCII if not UTF-8
    H_LINE="-"
    V_LINE="|"
    TL_CORNER="+"
    TR_CORNER="+"
    BL_CORNER="+"
    BR_CORNER="+"
    L_JOINT="+"
    R_JOINT="+"
    T_JOINT="+"
    B_JOINT="+"
    CROSS="+"
fi

# Calculate terminal width if possible
if command -v tput &>/dev/null; then
    TERM_WIDTH=$(tput cols)
    # Reduce width by 2 to prevent wrapping issues at window edge
    if [ $TERM_WIDTH -lt 82 ]; then
        WIDTH=80
    elif [ $TERM_WIDTH -gt 122 ]; then
        # Cap the width to prevent overly wide tables and ensure better readability
        WIDTH=120
    else
        WIDTH=$((TERM_WIDTH-2))
    fi
else
    WIDTH=80
fi

# Section Flag variables
PRINT_OVERVIEW=0
PRINT_CPU=0
PRINT_MEMORY=0
PRINT_GPU=0
PRINT_SCREEN=0
PRINT_DISK=0
PRINT_NETWORK=0
PRINT_LOAD=0
PRINT_USB=0
PRINT_BIOS=0

while [[ $# -gt 0 ]]; do
    case "$1" in
        --overview)      PRINT_OVERVIEW=1 ;;
        --cpu)           PRINT_CPU=1 ;;
        --memory)        PRINT_MEMORY=1 ;;
        --gpu)           PRINT_GPU=1 ;;
        --screen)        PRINT_SCREEN=1 ;;
        --disk)          PRINT_DISK=1 ;;
        --network)       PRINT_NETWORK=1 ;;
        --load)          PRINT_LOAD=1 ;;
        --usb)           PRINT_USB=1 ;;
        --bios)          PRINT_BIOS=1 ;;
        -h|--help)
            cat <<EOF

Usage: $0 [flags]

If you run $0 with no flags, ALL sections will be printed.
Otherwise, specify one or more of:

  --overview     Show only the “SYSTEM OVERVIEW” section
  --cpu          Show only the “CPU INFORMATION” section
  --memory       Show only the “MEMORY INFORMATION” section
  --gpu          Show only the “GPU INFORMATION” section
  --screen       Show only the “SCREEN INFORMATION” section
  --disk         Show only the “DISK INFORMATION” section
  --network      Show only the “NETWORK INFORMATION” section
  --load         Show only the “SYSTEM LOAD” section
  --usb          Show only the “USB DEVICES” section
  --bios         Show only the “BIOS/FIRMWARE INFORMATION” section

Combine flags as needed, e.g.:

  $0 --cpu --disk --network

EOF
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Try '$0 --help' for usage."
            exit 1
            ;;
    esac
    shift
done

########################################
# 6) DEFAULT TO ALL SECTIONS IF NONE SET
########################################
if [[ $PRINT_OVERVIEW -eq 0 && $PRINT_CPU -eq 0 && $PRINT_MEMORY -eq 0 && \
      $PRINT_GPU -eq 0 && $PRINT_SCREEN -eq 0 && $PRINT_DISK -eq 0 && \
      $PRINT_NETWORK -eq 0 && $PRINT_LOAD -eq 0 && $PRINT_USB -eq 0 && \
      $PRINT_BIOS -eq 0 ]]; then
    PRINT_OVERVIEW=1
    PRINT_CPU=1
    PRINT_MEMORY=1
    PRINT_GPU=1
    PRINT_SCREEN=1
    PRINT_DISK=1
    PRINT_NETWORK=1
    PRINT_LOAD=1
    PRINT_USB=1
    PRINT_BIOS=1
fi

########################################
# 7) HELPER FUNCTIONS
########################################

# Strip ANSI color codes to measure visible length
strip_ansi() {
    echo "$1" | sed 's/\x1b\[[0-9;]*m//g'
}

# Truncate a string to max_len (accounting for ANSI), adding “...” if truncated
truncate_string() {
    local str="$1"
    local max_len="$2"
    local visible_str
    visible_str=$(strip_ansi "$str")

    if [ "${#visible_str}" -gt "$max_len" ]; then
        # Truncate at (max_len - 3) visible chars, then append “...”
        # But we must cut the raw string; ANSI codes remain intact up to that point.
        echo "${str:0:$((max_len - 3))}..."
    else
        echo "$str"
    fi
}

# Run a command; if missing or no output, return fallback_message
run_command() {
    local command_to_run="$1"
    local fallback_message="$2"

    # Extract the base command (first word):
    local base_cmd
    base_cmd=$(echo "$command_to_run" | awk '{print $1}')

    if command -v "$base_cmd" &>/dev/null; then
        local result
        result=$(eval "$command_to_run" 2>/dev/null)
        if [ -n "$result" ]; then
            echo "$result"
        else
            echo "$fallback_message"
        fi
    else
        echo "$fallback_message"
    fi
}

# Create the main box header (centered title)
create_box_header() {
    local title="$1"
    # Strip ANSI for length:
    local title_stripped
    title_stripped=$(sed 's/\x1b\[[0-9;]*m//g' <<< "$title")
    local title_len=${#title_stripped}

    # Top border
    printf "${LBLUE}${TL_CORNER}"
    printf '%*s' $((WIDTH - 2)) '' | tr ' ' "${H_LINE}"
    printf "${TR_CORNER}${NC}\n"

    # Centered title line
    local total_padding=$(( WIDTH - 2 - title_len ))
    local left_pad=$(( total_padding / 2 ))
    local right_pad=$(( total_padding - left_pad ))
    if [ $left_pad -lt 0 ]; then left_pad=0; fi
    if [ $right_pad -lt 0 ]; then right_pad=0; fi

    printf "${LBLUE}${V_LINE}${NC}"
    printf '%*s' "$left_pad" ''
    printf "${LCYAN}%s${NC}" "$title"
    printf '%*s' "$right_pad" ''
    printf "${LBLUE}${V_LINE}${NC}\n"

    # Bottom border under title
    printf "${LBLUE}${BL_CORNER}"
    printf '%*s' $((WIDTH - 2)) '' | tr ' ' "${H_LINE}"
    printf "${BR_CORNER}${NC}\n"
}

# Create a section header (left‐aligned title)
create_section_header() {
    local title="$1"
    # Strip ANSI for length:
    local title_stripped
    title_stripped=$(sed 's/\x1b\[[0-9;]*m//g' <<< "$title")
    local title_len=${#title_stripped}

    echo ""
    # Top border of section
    printf "${LCYAN}${TL_CORNER}"
    printf '%*s' $((WIDTH - 2)) '' | tr ' ' "${H_LINE}"
    printf "${TR_CORNER}${NC}\n"

    # Title line with 1 space left padding
    local left_pad=1
    local right_pad=$(( WIDTH - 2 - title_len - left_pad ))
    if [ $right_pad -lt 0 ]; then right_pad=1; fi

    printf "${LCYAN}${V_LINE}${NC} "
    printf '%*s' "$left_pad" ''
    printf "${LGREEN}%s${NC}" "$title"
    printf '%*s' "$right_pad" ''
    printf "${LCYAN}${V_LINE}${NC}\n"

    # Middle border under title
    printf "${LCYAN}${L_JOINT}"
    printf '%*s' $((WIDTH - 2)) '' | tr ' ' "${H_LINE}"
    printf "${R_JOINT}${NC}\n"
}

# Create a section footer (just the bottom border)
create_section_footer() {
    printf "${LCYAN}${BL_CORNER}"
    printf '%*s' $((WIDTH - 2)) '' | tr ' ' "${H_LINE}"
    printf "${BR_CORNER}${NC}\n"
}

# Create a subsection header (indented, underlined)
create_subsection_header() {
    local title="$1"
    local indent=3
    local visible_title
    visible_title=$(strip_ansi "$title")
    local max_title_width=$(( WIDTH - indent - 5 ))

    if [ "${#visible_title}" -gt "$max_title_width" ]; then
        title=$(truncate_string "$title" "$max_title_width")
        visible_title=$(strip_ansi "$title")
    fi

    local padding=$(( WIDTH - indent - ${#visible_title} - 3 ))
    if [ $padding -lt 0 ]; then padding=1; fi

    local indent_space
    indent_space=$(printf '%*s' "$indent" '')
    local right_space
    right_space=$(printf '%*s' "$padding" '')
    local underscore
    underscore=$(printf '%*s' "${#visible_title}" '' | tr ' ' "-")

    # Title line
    printf "${LCYAN}${V_LINE}${NC} "
    printf "${LPURPLE}${indent_space}%s${NC}" "$visible_title"
    printf '%*s' "$padding" ''
    printf "${LCYAN}${V_LINE}${NC}\n"

    # Underline line
    printf "${LCYAN}${V_LINE}${NC} "
    printf "${LPURPLE}${indent_space}%s${NC}" "$underscore"
    printf '%*s' "$padding" ''
    printf "${LCYAN}${V_LINE}${NC}\n"
}

# Create a table row (fixed to exactly $WIDTH columns)
create_table_row() {
    local key="$1"
    local value="$2"
    local key_width=25
    # Max visible length for value:
    local max_value_width=$(( WIDTH - key_width - 7 ))

    local visible_value
    visible_value=$(strip_ansi "$value")

    if [ "${#visible_value}" -gt "$max_value_width" ]; then
        value=$(truncate_string "$value" "$max_value_width")
        visible_value=$(strip_ansi "$value")
    fi

    local padding=$(( WIDTH - key_width - ${#visible_value} - 5 ))
    if [ $padding -lt 0 ]; then padding=0; fi

    local key_len=${#key}
    local key_space
    key_space=$(printf '%*s' "$(( key_width - key_len ))" '')

    local right_space
    right_space=$(printf '%*s' "$padding" '')

    printf "${LCYAN}${V_LINE}${NC} "
    printf "${YELLOW}%s${NC}" "$key"
    printf '%*s' "$(( key_width - key_len ))" ''
    printf ": "
    printf "${WHITE}%s${NC}" "$value"
    printf '%*s' "$padding" ''
    printf "${LCYAN}${V_LINE}${NC}\n"
}

# Format multi‐line command output in a table block
format_command_output() {
    local output="$1"
    local indent=4
    local max_content_width=$(( WIDTH - indent - 3 ))

    # Read each line of output
    echo "$output" | while IFS= read -r line; do
        local visible_line
        visible_line=$(strip_ansi "$line")

        if [ "${#visible_line}" -gt "$max_content_width" ]; then
            line=$(truncate_string "$line" "$max_content_width")
            visible_line=$(strip_ansi "$line")
        fi

        local padding=$(( WIDTH - indent - ${#visible_line} - 3 ))
        if [ $padding -lt 0 ]; then padding=0; fi

        local indent_space
        indent_space=$(printf '%*s' "$indent" '')
        local right_space
        right_space=$(printf '%*s' "$padding" '')

        printf "${LCYAN}${V_LINE}${NC} "
        printf "${indent_space}%s${NC}" "$line"
        printf '%*s' "$padding" ''
        printf "${LCYAN}${V_LINE}${NC}\n"
    done
}


# SCRIPT START
clear
timestamp=$(date "+%Y-%m-%d %H:%M:%S")

# Main Header: SYSTEM INFORMATION REPORT
echo ""
create_box_header "SYSTEM INFORMATION REPORT"
create_table_row "Generated on" "$timestamp"
create_table_row "Hostname" "$(hostname)"
create_section_footer

# SYSTEM OVERVIEW
if [[ $PRINT_OVERVIEW -eq 1 ]]; then
    create_section_header "SYSTEM OVERVIEW"

    kernel_version=$(uname -r)
    create_table_row "Kernel Version" "$kernel_version"

    os_name=$(run_command "grep -E '^NAME=' /etc/os-release | cut -d= -f2 | tr -d '\"'" "Unknown")
    create_table_row "OS Name" "$os_name"

    os_version=$(run_command "grep -E '^VERSION=' /etc/os-release | cut -d= -f2 | tr -d '\"'" "Unknown")
    create_table_row "OS Version" "$os_version"

    uptime=$(uptime -p)
    create_table_row "System Uptime" "$uptime"

    user=$(whoami)
    create_table_row "Current User" "$user"

    create_section_footer
fi

# CPU INFORMATION
if [[ $PRINT_CPU -eq 1 ]]; then
    create_section_header "CPU INFORMATION"

    cpu_model=$(run_command "lscpu | grep -E 'Model name' | sed 's/Model name:[ \t]*//' | sed 's/  */ /g'" "Unknown")
    create_table_row "CPU Model" "$cpu_model"

    cpu_cores=$(run_command "lscpu | grep -E '^CPU\\(s\\):' | awk '{print \$2}'" "Unknown")
    create_table_row "CPU Cores" "$cpu_cores"

    cpu_threads=$(run_command "lscpu | grep -E 'Thread' | awk '{print \$4}'" "Unknown")
    create_table_row "Threads per Core" "$cpu_threads"

    cpu_sockets=$(run_command "lscpu | grep -E 'Socket' | awk '{print \$2}'" "Unknown")
    create_table_row "CPU Sockets" "$cpu_sockets"

    cpu_mhz=$(run_command "lscpu | grep -E 'CPU MHz' | awk '{print \$3}' | xargs printf '%.2f MHz'" "Unknown")
    create_table_row "CPU Frequency" "$cpu_mhz"

    cpu_max_mhz=$(run_command "lscpu | grep -E 'CPU max MHz' | awk '{print \$4}' | xargs printf '%.2f MHz'" "N/A")
    if [[ "$cpu_max_mhz" != "N/A" ]]; then
        create_table_row "CPU Max Frequency" "$cpu_max_mhz"
    fi

    create_section_footer
fi

# MEMORY INFORMATION
if [[ $PRINT_MEMORY -eq 1 ]]; then
    create_section_header "MEMORY INFORMATION"

    mem_total=$(run_command "free -h | grep Mem | awk '{print \$2}'" "Unknown")
    create_table_row "Total Memory" "$mem_total"

    mem_used=$(run_command "free -h | grep Mem | awk '{print \$3}'" "Unknown")
    create_table_row "Used Memory" "$mem_used"

    mem_free=$(run_command "free -h | grep Mem | awk '{print \$4}'" "Unknown")
    create_table_row "Free Memory" "$mem_free"

    mem_shared=$(run_command "free -h | grep Mem | awk '{print \$5}'" "Unknown")
    create_table_row "Shared Memory" "$mem_shared"

    mem_buffers=$(run_command "free -h | grep Mem | awk '{print \$6}'" "Unknown")
    create_table_row "Buffer/Cache" "$mem_buffers"

    mem_available=$(run_command "free -h | grep Mem | awk '{print \$7}'" "Unknown")
    create_table_row "Available Memory" "$mem_available"

    swap_total=$(run_command "free -h | grep Swap | awk '{print \$2}'" "Unknown")
    create_table_row "Swap Total" "$swap_total"

    swap_used=$(run_command "free -h | grep Swap | awk '{print \$3}'" "Unknown")
    create_table_row "Swap Used" "$swap_used"

    create_section_footer
fi

# GPU INFORMATION
if [[ $PRINT_GPU -eq 1 ]]; then
    create_section_header "GPU INFORMATION"

    # PCI GPU Devices
    gpu_info=$(run_command "lspci | grep -i 'vga\\|3d\\|2d'" "No GPU information available via lspci")
    if [[ "$gpu_info" != "No GPU information available via lspci" ]]; then
        create_subsection_header "PCI GPU Devices"
        format_command_output "$gpu_info"
    fi

    # OpenGL Renderer
    opengl_info=$(run_command "glxinfo | grep 'OpenGL renderer'" "OpenGL renderer information not available")
    if [[ "$opengl_info" != "OpenGL renderer information not available" ]]; then
        create_subsection_header "OpenGL Information"
        format_command_output "$opengl_info"
    fi

    # NVIDIA SMI
    if command -v nvidia-smi &>/dev/null; then
        create_subsection_header "NVIDIA GPU Information"
        nvidia_info=$(run_command \
            "nvidia-smi --query-gpu=name,driver_version,temperature.gpu,utilization.gpu,utilization.memory,memory.total,memory.free,memory.used --format=csv,noheader" \
            "NVIDIA GPU information not available")
        if [[ "$nvidia_info" != "NVIDIA GPU information not available" ]]; then
            IFS=',' read -r name driver temp util_gpu util_mem mem_total mem_free mem_used <<< "$nvidia_info"
            create_table_row "GPU Name" "$name"
            create_table_row "Driver Version" "$driver"
            create_table_row "Temperature" "$temp°C"
            create_table_row "GPU Utilization" "$util_gpu"
            create_table_row "Memory Utilization" "$util_mem"
            create_table_row "Total Memory" "$mem_total"
            create_table_row "Used Memory" "$mem_used"
            create_table_row "Free Memory" "$mem_free"
        else
            format_command_output "NVIDIA GPU information not available"
        fi
    fi

    create_section_footer
fi

# SCREEN INFORMATION
if [[ $PRINT_SCREEN -eq 1 ]]; then
    create_section_header "SCREEN INFORMATION"

    screen_info=$(run_command "xrandr --current | grep ' connected'" "Screen resolution information not available")
    if [[ "$screen_info" != "Screen resolution information not available" ]]; then
        create_subsection_header "Connected Displays"
        format_command_output "$screen_info"
    else
        screen_info=$(run_command "cat /sys/class/drm/*/modes 2>/dev/null" "No screen mode information available")
        if [[ "$screen_info" != "No screen mode information available" ]]; then
            create_subsection_header "Available Screen Modes"
            format_command_output "$screen_info"
        else
            create_table_row "Status" "No screen information available"
        fi
    fi

    create_section_footer
fi

# DISK INFORMATION
if [[ $PRINT_DISK -eq 1 ]]; then
    create_section_header "DISK INFORMATION"

    create_subsection_header "Disk Usage"
    df_output=$(run_command "df -h | grep -v 'tmpfs\\|udev'" "Disk usage information not available")
    format_command_output "$df_output"

    create_subsection_header "Block Devices"
    lsblk_output=$(run_command "lsblk -o NAME,SIZE,TYPE,MOUNTPOINT | grep -v '^loop'" "Block device information not available")
    format_command_output "$lsblk_output"

    create_section_footer
fi

# NETWORK INFORMATION
if [[ $PRINT_NETWORK -eq 1 ]]; then
    create_section_header "NETWORK INFORMATION"

    create_subsection_header "Network Interfaces"
    ip_output=$(run_command "ip -brief addr show 2>/dev/null" "Network interface information not available")
    if [[ "$ip_output" == "Network interface information not available" ]]; then
        ip_output=$(run_command "ip addr | grep -E 'inet |^[0-9]+:'" "Network interface information not available")
    fi
    format_command_output "$ip_output"

    create_subsection_header "Default Route"
    route_output=$(run_command "ip route | grep default" "Default route information not available")
    format_command_output "$route_output"

    create_section_footer
fi

# SYSTEM LOAD
if [[ $PRINT_LOAD -eq 1 ]]; then
    create_section_header "SYSTEM LOAD"

    loadavg=$(run_command "cat /proc/loadavg" "System load information not available")
    if [[ "$loadavg" != "System load information not available" ]]; then
        read -r load1 load5 load15 processes lastpid <<< "$loadavg"
        create_table_row "1 min load average" "$load1"
        create_table_row "5 min load average" "$load5"
        create_table_row "15 min load average" "$load15"
        create_table_row "Running/Total Processes" "$processes"
    fi

    create_subsection_header "Top Processes by CPU Usage"
    ps_output=$(run_command "ps -eo pid,ppid,user,%mem,%cpu,comm --sort=-%cpu | head -n 6" "Process information not available")
    format_command_output "$ps_output"

    create_section_footer
fi

# USB DEVICES
if [[ $PRINT_USB -eq 1 ]]; then
    create_section_header "USB DEVICES"

    usb_devices=$(run_command "lsusb" "USB device information not available")
    format_command_output "$usb_devices"

    create_section_footer
fi

# BIOS/FIRMWARE INFORMATION
if [[ $PRINT_BIOS -eq 1 ]]; then
    create_section_header "BIOS/FIRMWARE INFORMATION"

    if command -v dmidecode &>/dev/null; then
        bios_vendor=$(run_command "sudo dmidecode -t bios | grep Vendor | awk -F': ' '{print \$2}'" "Unknown")
        create_table_row "BIOS Vendor" "$bios_vendor"

        bios_version=$(run_command "sudo dmidecode -t bios | grep Version | head -1 | awk -F': ' '{print \$2}'" "Unknown")
        create_table_row "BIOS Version" "$bios_version"

        bios_date=$(run_command "sudo dmidecode -t bios | grep Release | awk -F': ' '{print \$2}'" "Unknown")
        create_table_row "BIOS Release Date" "$bios_date"
    else
        create_table_row "Status" "BIOS information requires dmidecode and root privileges"
    fi

    create_section_footer
fi

# FINAL COMPLETION MESSAGE
echo ""
completion_message="System information gathering complete!"
visible_msg=$(strip_ansi "$completion_message")
message_len=${#visible_msg}

total_padding=$(( WIDTH - 2 - message_len ))
left_pad=$(( total_padding / 2 ))
right_pad=$(( total_padding - left_pad ))
if [ $left_pad -lt 0 ]; then left_pad=0; fi
if [ $right_pad -lt 0 ]; then right_pad=0; fi

printf "${LGREEN}${TL_CORNER}"
printf '%*s' $((WIDTH - 2)) '' | tr ' ' "${H_LINE}"
printf "${TR_CORNER}${NC}\n"

printf "${LGREEN}${V_LINE}${NC}"
printf '%*s' "$left_pad" ''
printf "${WHITE}%s${NC}" "$completion_message"
printf '%*s' "$right_pad" ''
printf "${LGREEN}${V_LINE}${NC}\n"

printf "${LGREEN}${BL_CORNER}"
printf '%*s' $((WIDTH - 2)) '' | tr ' ' "${H_LINE}"
printf "${BR_CORNER}${NC}\n"
echo ""

exit 0