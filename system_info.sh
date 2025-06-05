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

# Helper function to strip ANSI color codes for proper string length calculation
strip_ansi() {
    echo "$1" | sed 's/\x1b\[[0-9;]*m//g'
}

# Function to truncate long strings and add an ellipsis
truncate_string() {
    local str="$1"
    local max_len="$2"
    local visible_str=$(strip_ansi "$str")
    
    if [ ${#visible_str} -gt $max_len ]; then
        # Truncate and add ellipsis
        echo "${str:0:$((max_len-3))}..."
    else
        echo "$str"
    fi
}

# Function to create a box header
create_box_header() {
    local title="$1"
    # Strip color codes for proper length calculation
    local title_stripped=$(echo "$title" | sed 's/\x1b\[[0-9;]*m//g')
    local title_len=${#title_stripped}
    
    # Draw top border with consistent width
    echo -e "${LBLUE}${TL_CORNER}$(printf '%*s' "$((WIDTH-2))" | tr ' ' "${H_LINE}")${TR_CORNER}${NC}"
    
    # Calculate padding for perfect centering
    local total_padding=$((WIDTH-2-title_len))
    local left_pad=$((total_padding/2))
    local right_pad=$((total_padding-left_pad))
    
    # Ensure padding is never negative
    if [ $left_pad -lt 0 ]; then left_pad=0; fi
    if [ $right_pad -lt 0 ]; then right_pad=0; fi
    
    # Create title line with proper colors
    local left_space=$(printf '%*s' "$left_pad" '')
    local right_space=$(printf '%*s' "$right_pad" '')
    echo -e "${LBLUE}${V_LINE}${NC}${left_space}${LCYAN}${title}${NC}${right_space}${LBLUE}${V_LINE}${NC}"
    
    # Draw bottom border with consistent width
    echo -e "${LBLUE}${BL_CORNER}$(printf '%*s' "$((WIDTH-2))" | tr ' ' "${H_LINE}")${BR_CORNER}${NC}"
}

# Function to create section header
create_section_header() {
    local title="$1"
    # Strip color codes for proper length calculation
    local title_stripped=$(echo "$title" | sed 's/\x1b\[[0-9;]*m//g')
    local title_len=${#title_stripped}
    
    echo ""
    # Draw top border with consistent width
    echo -e "${LCYAN}${TL_CORNER}$(printf '%*s' "$((WIDTH-2))" | tr ' ' "${H_LINE}")${TR_CORNER}${NC}"
    
    # Fixed left padding of 1 space
    local left_pad=1
    # Calculate exact right padding
    local right_pad=$((WIDTH-2-title_len-left_pad))
    
    # Ensure padding is never negative
    if [ $right_pad -lt 0 ]; then right_pad=1; fi
    
    # Create properly formatted title row with specific spacing
    local left_space=$(printf '%*s' "$left_pad" '')
    local right_space=$(printf '%*s' "$right_pad" '')
    echo -e "${LCYAN}${V_LINE}${NC}${left_space}${LGREEN}${title}${NC}${right_space}${LCYAN}${V_LINE}${NC}"
    
    # Draw middle border with consistent width
    echo -e "${LCYAN}${L_JOINT}$(printf '%*s' "$((WIDTH-2))" | tr ' ' "${H_LINE}")${R_JOINT}${NC}"
}

# Function to create a table row
create_table_row() {
    local key="$1"
    local value="$2"
    local key_width=25
    local max_value_width=$((WIDTH-key_width-7)) # 7 accounts for spacing, colon, etc.
    
    # Truncate value if it's too long
    local visible_value=$(strip_ansi "$value")
    if [ ${#visible_value} -gt $max_value_width ]; then
        value=$(truncate_string "$value" $max_value_width)
        visible_value=$(strip_ansi "$value")
    fi
    
    # Calculate padding
    local padding=$((WIDTH-key_width-${#visible_value}-5))
    
    # Ensure padding is never negative
    if [ $padding -lt 0 ]; then
        padding=1
    fi
    
    # Create properly spaced and colored row
    local key_space=$(printf '%*s' "$((key_width-${#key}))" '')
    local right_space=$(printf '%*s' "$padding" '')
    echo -e "${LCYAN}${V_LINE}${NC} ${YELLOW}${key}${NC}${key_space}: ${WHITE}${value}${NC}${right_space}${LCYAN}${V_LINE}${NC}"
}

# Function to create a section footer
create_section_footer() {
    echo -e "${LCYAN}${BL_CORNER}$(printf '%*s' "$((WIDTH-2))" | tr ' ' "${H_LINE}")${BR_CORNER}${NC}"
}

# Function to create a subsection header
create_subsection_header() {
    local title="$1"
    local indent=3  # Use consistent 3-space indentation
    local visible_title=$(strip_ansi "$title")
    local max_title_width=$((WIDTH-indent-5))
    
    # Truncate title if it's too long
    if [ ${#visible_title} -gt $max_title_width ]; then
        title=$(truncate_string "$title" $max_title_width)
        visible_title=$(strip_ansi "$title")
    fi
    
    # Calculate exact right padding
    local padding=$((WIDTH-indent-${#visible_title}-3))
    
    # Ensure padding is never negative
    if [ $padding -lt 0 ]; then padding=1; fi
    
    # Format indentation and padding spaces
    local indent_space=$(printf '%*s' "$indent" '')
    local right_space=$(printf '%*s' "$padding" '')
    local underscore=$(printf '%*s' "${#visible_title}" | tr ' ' "-")
    
    # Draw the subsection header with proper alignment and colors
    echo -e "${LCYAN}${V_LINE}${NC} ${LPURPLE}${indent_space}${title}${NC}${right_space}${LCYAN}${V_LINE}${NC}"
    echo -e "${LCYAN}${V_LINE}${NC} ${LPURPLE}${indent_space}${underscore}${NC}${right_space}${LCYAN}${V_LINE}${NC}"
}

# Function to run a command with error handling and return output
run_command() {
    local command_to_run="$1"
    local fallback_message="$2"
    
    if command -v $(echo "$command_to_run" | awk '{print $1}') &>/dev/null; then
        local result=$(eval "$command_to_run" 2>/dev/null)
        if [ -n "$result" ]; then
            echo "$result"
        else
            echo "$fallback_message"
        fi
    else
        echo "$fallback_message"
    fi
}

# Function to format command output in a table
format_command_output() {
    local output="$1"
    local indent=4
    local max_content_width=$((WIDTH-indent-3))
    
    echo "$output" | while IFS= read -r line; do
        # Truncate long lines
        local visible_line=$(strip_ansi "$line")
        if [ ${#visible_line} -gt $max_content_width ]; then
            line=$(truncate_string "$line" $max_content_width)
            visible_line=$(strip_ansi "$line")
        fi
        
        # Calculate padding for right alignment
        local padding=$((WIDTH-indent-${#visible_line}-3))
        
        # Ensure padding is never negative
        if [ $padding -lt 0 ]; then
            padding=1
        fi
        
        # Format spaces for indentation and padding
        local indent_space=$(printf '%*s' "$indent" '')
        local right_space=$(printf '%*s' "$padding" '')
        
        # Format the output line with proper color handling
        echo -e "${LCYAN}${V_LINE}${NC} ${indent_space}${WHITE}${line}${NC}${right_space}${LCYAN}${V_LINE}${NC}"
    done
}
# Additional helper functions have been moved to the top of the script

# Script start
clear
timestamp=$(date "+%Y-%m-%d %H:%M:%S")

# Create main header
echo ""
# Create main header with proper color handling and emphasis
create_box_header "${LGREEN}SYSTEM INFORMATION REPORT${NC}"
create_table_row "Generated on" "$timestamp"
create_table_row "Hostname" "$(hostname)"
create_section_footer

# System Overview
create_section_header "SYSTEM OVERVIEW"

kernel_version=$(uname -r)
create_table_row "Kernel Version" "$kernel_version"

os_name=$(run_command "cat /etc/os-release | grep -E '^NAME=' | cut -d= -f2 | tr -d '\"'" "Unknown")
create_table_row "OS Name" "$os_name"

os_version=$(run_command "cat /etc/os-release | grep -E '^VERSION=' | cut -d= -f2 | tr -d '\"'" "Unknown")
create_table_row "OS Version" "$os_version"

uptime=$(uptime -p)
create_table_row "System Uptime" "$uptime"

user=$(whoami)
create_table_row "Current User" "$user"

create_section_footer

# CPU Information
create_section_header "CPU INFORMATION"

cpu_model=$(run_command "lscpu | grep -E 'Model name' | sed 's/Model name:[ \t]*//' | sed 's/  */ /g'" "Unknown")
create_table_row "CPU Model" "$cpu_model"

cpu_cores=$(run_command "lscpu | grep -E '^CPU\(s\):' | awk '{print \$2}'" "Unknown")
create_table_row "CPU Cores" "$cpu_cores"

cpu_threads=$(run_command "lscpu | grep -E 'Thread' | awk '{print \$4}'" "Unknown")
create_table_row "Threads per Core" "$cpu_threads"

cpu_sockets=$(run_command "lscpu | grep -E 'Socket' | awk '{print \$2}'" "Unknown")
create_table_row "CPU Sockets" "$cpu_sockets"

cpu_mhz=$(run_command "lscpu | grep -E 'CPU MHz' | awk '{print \$3}' | xargs printf '%.2f MHz'" "Unknown")
create_table_row "CPU Frequency" "$cpu_mhz"

cpu_max_mhz=$(run_command "lscpu | grep -E 'CPU max MHz' | awk '{print \$4}' | xargs printf '%.2f MHz'" "N/A")
if [ "$cpu_max_mhz" != "N/A" ]; then
    create_table_row "CPU Max Frequency" "$cpu_max_mhz"
fi

create_section_footer

# Memory Information
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

# GPU Information
create_section_header "GPU INFORMATION"

# Check if we have GPU information from lspci
gpu_info=$(run_command "lspci | grep -i 'vga\\|3d\\|2d'" "No GPU information available via lspci")
if [ "$gpu_info" != "No GPU information available via lspci" ]; then
    create_subsection_header "PCI GPU Devices"
    format_command_output "$gpu_info"
fi

# Check for OpenGL renderer information
opengl_info=$(run_command "glxinfo | grep 'OpenGL renderer'" "OpenGL renderer information not available")
if [ "$opengl_info" != "OpenGL renderer information not available" ]; then
    create_subsection_header "OpenGL Information"
    format_command_output "$opengl_info"
fi

# Check for NVIDIA GPUs
if command -v nvidia-smi &>/dev/null; then
    create_subsection_header "NVIDIA GPU Information"
    nvidia_info=$(run_command "nvidia-smi --query-gpu=name,driver_version,temperature.gpu,utilization.gpu,utilization.memory,memory.total,memory.free,memory.used --format=csv,noheader" "NVIDIA GPU information not available")
    if [ "$nvidia_info" != "NVIDIA GPU information not available" ]; then
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

# Screen Information
create_section_header "SCREEN INFORMATION"

screen_info=$(run_command "xrandr --current | grep ' connected'" "Screen resolution information not available")
if [ "$screen_info" != "Screen resolution information not available" ]; then
    create_subsection_header "Connected Displays"
    format_command_output "$screen_info"
else
    # Try alternative method
    screen_info=$(run_command "cat /sys/class/drm/*/modes 2>/dev/null" "No screen mode information available")
    if [ "$screen_info" != "No screen mode information available" ]; then
        create_subsection_header "Available Screen Modes"
        format_command_output "$screen_info"
    else
        create_table_row "Status" "No screen information available"
    fi
fi

create_section_footer

# Disk Information
create_section_header "DISK INFORMATION"

create_subsection_header "Disk Usage"
df_output=$(run_command "df -h | grep -v 'tmpfs\\|udev'" "Disk usage information not available")
format_command_output "$df_output"

create_subsection_header "Block Devices"
lsblk_output=$(run_command "lsblk -o NAME,SIZE,TYPE,MOUNTPOINT | grep -v '^loop'" "Block device information not available")
format_command_output "$lsblk_output"

create_section_footer

# Network Information
create_section_header "NETWORK INFORMATION"

create_subsection_header "Network Interfaces"
ip_output=$(run_command "ip -brief addr show 2>/dev/null" "Network interface information not available")
if [ "$ip_output" = "Network interface information not available" ]; then
    # Fallback to older method
    ip_output=$(run_command "ip addr | grep -E 'inet |^[0-9]+:'" "Network interface information not available")
fi
format_command_output "$ip_output"

create_subsection_header "Default Route"
route_output=$(run_command "ip route | grep default" "Default route information not available")
format_command_output "$route_output"

create_section_footer

# System Load
create_section_header "SYSTEM LOAD"

loadavg=$(run_command "cat /proc/loadavg" "System load information not available")
if [ "$loadavg" != "System load information not available" ]; then
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

# USB Devices
create_section_header "USB DEVICES"

usb_devices=$(run_command "lsusb" "USB device information not available")
format_command_output "$usb_devices"

create_section_footer

# BIOS/Firmware Information
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

# Final message
echo ""
# Define the completion message
completion_message="System information gathering complete!"
# Calculate the length of the message (without color codes)
message_len=${#completion_message}

# Calculate padding for perfect centering
total_padding=$((WIDTH-2-message_len))
# Integer division for left padding to ensure exact center positioning
left_pad=$((total_padding/2))
# Right padding calculated to ensure exact border positioning
right_pad=$((total_padding-left_pad))

# Format spaces for padding
left_space=$(printf '%*s' "$left_pad" '')
right_space=$(printf '%*s' "$right_pad" '')

# Draw footer with consistent width
echo -e "${LGREEN}${TL_CORNER}$(printf '%*s' "$((WIDTH-2))" | tr ' ' "${H_LINE}")${TR_CORNER}${NC}"
# Use echo -e for proper color code interpretation with explicit spacing
echo -e "${LGREEN}${V_LINE}${NC}${left_space}${WHITE}${completion_message}${NC}${right_space}${LGREEN}${V_LINE}${NC}"
echo -e "${LGREEN}${BL_CORNER}$(printf '%*s' "$((WIDTH-2))" | tr ' ' "${H_LINE}")${BR_CORNER}${NC}"
echo ""

