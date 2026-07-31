---
title: 'BIOS vs UEFI: What Every IT Support Technician Should Know'
date: '2026-07-31'
excerpt: >-
  Learn how BIOS and UEFI initialise computer hardware, locate boot devices,
  manage startup settings, and help technicians troubleshoot common boot
  problems.
tags:
  - '"comptia-a-plus"'
  - '"bios"'
  - '"uefi"'
  - '"it-support"'
  - '"hardware"'
---
BIOS and UEFI are two of the most important technologies involved in starting a computer.
Before Windows loads, the computer must initialise its hardware, test essential components, locate a bootable device, and transfer control to the operating system.
BIOS or UEFI manages these early startup tasks.
Understanding how they work is essential for CompTIA A+ students, IT Support technicians, system administrators, and anyone troubleshooting computers that fail to start.
# What Is Firmware?
Firmware is specialised software stored directly on a hardware device.
Unlike a normal application installed inside Windows, firmware remains available even when:
- Windows is not installed
- The storage drive has failed
- The operating system is corrupted
- The computer cannot reach the login screen
The motherboard stores its firmware on a small flash memory chip.
When the computer powers on, the CPU begins executing instructions from this firmware.
Depending on the age and design of the computer, the firmware will usually be either:
- BIOS
- UEFI
# What Is BIOS?
BIOS stands for:
```text
Basic Input/Output System

BIOS is the traditional firmware interface used by older computers.

It performs several important startup functions:

* Initialises essential hardware
* Runs the Power-On Self-Test
* Detects storage devices
* Checks the configured boot order
* Locates a bootable operating system
* Transfers control to the boot loader

BIOS has been used in personal computers for several decades.

Although it remains available on some systems, it has largely been replaced by UEFI.

What Is UEFI?

UEFI stands for:

Unified Extensible Firmware Interface

UEFI is the modern replacement for BIOS.

It performs the same basic startup responsibilities but provides additional features, improved security, and support for modern hardware.

Most computers manufactured today use UEFI.

Common UEFI features include:

* Graphical configuration interface
* Mouse support
* Secure Boot
* Support for large storage drives
* Faster startup
* Better hardware support
* Network-based diagnostic tools
* Firmware update utilities

BIOS and UEFI in the Boot Process

BIOS or UEFI operates near the beginning of the computer startup process.

Power Button
      │
      ▼
Power Supply Starts
      │
      ▼
CPU Begins Executing Firmware
      │
      ▼
BIOS or UEFI Initialises Hardware
      │
      ▼
POST Runs
      │
      ▼
Boot Device Is Located
      │
      ▼
Boot Loader Starts
      │
      ▼
Windows Loads

Windows cannot start until the firmware successfully completes its responsibilities.

BIOS vs UEFI

Feature	BIOS	UEFI
Full name	Basic Input/Output System	Unified Extensible Firmware Interface
Typical systems	Older computers	Modern computers
Interface	Usually keyboard-based	Often graphical with mouse support
Partition style	MBR	Usually GPT
Maximum common boot drive size	Approximately 2 TB with MBR	Supports drives larger than 2 TB
Secure Boot	Not supported	Supported
Startup speed	Generally slower	Generally faster
Number of partitions	Limited under MBR	Supports more partitions with GPT
Firmware tools	Basic	More advanced
Modern hardware support	Limited	Better support

BIOS and MBR

Traditional BIOS systems commonly use the MBR partition style.

MBR stands for:

Master Boot Record

The Master Boot Record is located at the beginning of a storage device.

It contains information used to start the operating system, including:

* Partition information
* Boot code
* Location of the active partition

A simplified BIOS boot process looks like this:

BIOS
  │
  ▼
Boot Device
  │
  ▼
Master Boot Record
  │
  ▼
Boot Loader
  │
  ▼
Operating System

MBR has several limitations.

It commonly supports:

* Storage drives up to approximately 2 TB
* Four primary partitions

These limitations contributed to the adoption of GPT and UEFI.

UEFI and GPT

Modern UEFI systems commonly use GPT.

GPT stands for:

GUID Partition Table

GPT is a newer partitioning system designed to replace MBR.

Advantages of GPT include:

* Support for storage devices larger than 2 TB
* Support for more partitions
* Backup partition information
* Better protection against partition-table corruption
* Improved compatibility with modern systems

A simplified UEFI boot process looks like this:

UEFI
  │
  ▼
EFI System Partition
  │
  ▼
Windows Boot Manager
  │
  ▼
Windows Boot Loader
  │
  ▼
Windows Kernel

The EFI System Partition stores boot files used by UEFI.

On Windows systems, this partition usually contains Windows Boot Manager.

What Is the EFI System Partition?

The EFI System Partition is a small partition located on a GPT-formatted storage device.

It is commonly abbreviated as:

ESP

The partition contains boot-related files required by UEFI.

These may include:

* Windows Boot Manager
* Boot files
* Recovery tools
* Boot files for other operating systems

The EFI System Partition normally does not appear as a regular drive inside File Explorer.

Deleting or damaging it can prevent Windows from starting.

What Is Secure Boot?

Secure Boot is a UEFI security feature.

It helps prevent untrusted software from loading during the startup process.

Without Secure Boot, malicious software may attempt to start before Windows and gain control of the system.

Secure Boot checks whether startup components are digitally signed and trusted.

The simplified process is:

Computer Starts
      │
      ▼
UEFI Checks Boot Software
      │
      ▼
Is the Software Trusted?
      │
      ├── Yes → Continue Booting
      │
      └── No  → Block the Software

Secure Boot can help protect against:

* Bootkits
* Rootkits
* Unauthorised boot loaders
* Certain pre-boot malware attacks

When Secure Boot May Cause Problems

Secure Boot improves security, but it can occasionally prevent legitimate tools or operating systems from starting.

Examples include:

* Older Linux distributions
* Unsigned diagnostic tools
* Older bootable USB drives
* Custom operating systems
* Some hardware recovery utilities

An IT technician may temporarily disable Secure Boot for troubleshooting.

However, it should normally be re-enabled after the troubleshooting process is complete.

What Is Legacy Boot Mode?

Many UEFI systems provide a compatibility option commonly called:

Legacy Boot

Other names may include:

* Legacy BIOS
* CSM
* Compatibility Support Module

Legacy mode allows a UEFI motherboard to behave more like a traditional BIOS system.

It may be needed when booting:

* Older operating systems
* MBR-formatted storage devices
* Older expansion cards
* Legacy diagnostic utilities

However, Legacy Boot may disable or limit some modern features, including Secure Boot.

UEFI Mode vs Legacy Mode

Mode	Typical Partition Style	Secure Boot	Best Used For
UEFI	GPT	Supported	Modern Windows installations
Legacy BIOS	MBR	Not supported	Older operating systems and hardware
UEFI with CSM	GPT or MBR depending on configuration	Often disabled	Compatibility with older devices

What Is the Boot Order?

The boot order tells BIOS or UEFI which devices to check when searching for an operating system.

An example boot order may look like this:

1. Windows Boot Manager
2. NVMe SSD
3. USB Storage
4. Network Boot

The firmware checks the devices in order.

If the first device is not bootable, it moves to the next one.

Common Boot Devices

BIOS or UEFI may be able to boot from:

* NVMe SSD
* SATA SSD
* Hard disk drive
* USB flash drive
* DVD drive
* Network server
* External storage device

Network booting is commonly called PXE boot.

PXE stands for:

Preboot Execution Environment

It allows a computer to load installation or recovery files from a network server.

Why Boot Order Matters

An incorrect boot order can prevent a computer from loading Windows.

For example, imagine the boot order is:

1. USB Drive
2. Network Boot
3. Windows Boot Manager

If a non-bootable USB drive is connected, the system may:

* Display a boot error
* Pause during startup
* Attempt to start from the network
* Fail to load Windows immediately

Changing Windows Boot Manager to the first position may resolve the problem.

How to Enter BIOS or UEFI

The key used to enter firmware settings depends on the computer manufacturer.

Common keys include:

* Delete
* F1
* F2
* F10
* F12
* Esc

The key is usually pressed repeatedly immediately after powering on the computer.

Common manufacturer examples include:

Manufacturer	Common Firmware Key
Dell	F2
HP	F10 or Esc
Lenovo	F1 or F2
ASUS	Delete or F2
Acer	F2
MSI	Delete
Microsoft Surface	Hold Volume Up while powering on

The exact key may vary between models.

Entering UEFI from Windows

On a functioning Windows computer, you can also access UEFI through the recovery options.

Navigate to:

Settings
→ System
→ Recovery
→ Advanced startup
→ Restart now

After restarting, select:

Troubleshoot
→ Advanced options
→ UEFI Firmware Settings
→ Restart

This method is useful when the startup screen appears too quickly to press the firmware key.

Common BIOS and UEFI Settings

Firmware interfaces usually provide settings for:

* System date and time
* Boot order
* Secure Boot
* TPM
* CPU virtualisation
* Storage controller mode
* Integrated graphics
* Fan behaviour
* USB ports
* Network boot
* Firmware passwords
* Hardware diagnostics

CPU Virtualisation

Virtualisation allows a computer to run virtual machines efficiently.

Common processor virtualisation technologies include:

* Intel VT-x
* AMD-V

This feature may need to be enabled before using software such as:

* Hyper-V
* VMware Workstation
* VirtualBox
* Proxmox
* Android emulators

If virtualisation is disabled, virtual machine software may display an error or fail to start a VM.

TPM

TPM stands for:

Trusted Platform Module

The TPM stores security-related information.

It may be used for:

* BitLocker encryption
* Windows Hello
* Secure key storage
* Device authentication
* Windows 11 requirements

Modern computers may use a physical TPM chip or firmware-based TPM.

Common names include:

* Intel Platform Trust Technology
* AMD firmware TPM

Storage Controller Modes

Firmware settings may provide different storage controller modes.

Common options include:

* AHCI
* RAID
* IDE on older systems

AHCI is commonly used with SATA storage devices.

Changing the storage mode after Windows has already been installed can cause Windows to fail during startup.

A common symptom is a Blue Screen because Windows may not have the correct storage driver enabled.

Firmware Passwords

BIOS and UEFI may support several password types.

These can include:

* Administrator password
* Setup password
* Power-on password
* Drive password

A firmware administrator password prevents unauthorised users from changing firmware settings.

A power-on password may prevent the computer from starting until the correct password is entered.

These passwords are different from a Windows login password.

Resetting BIOS or UEFI Settings

Firmware settings can usually be returned to their default configuration.

The option may be called:

* Load Setup Defaults
* Restore Defaults
* Optimised Defaults
* Factory Defaults

Resetting the firmware may help when:

* Incorrect settings prevent booting
* Hardware is not detected
* Virtualisation settings were changed incorrectly
* Boot settings are misconfigured
* Overclocking causes instability

Be careful when resetting firmware settings on systems using RAID, BitLocker, or custom boot configurations.

What Is CMOS?

CMOS traditionally refers to the memory used to store BIOS settings.

These settings may include:

* System date
* System time
* Boot order
* Hardware configuration
* Firmware preferences

A small battery on the motherboard helps preserve these settings when the computer is disconnected from power.

This battery is commonly called the CMOS battery.

Symptoms of a Weak CMOS Battery

A weak or failed CMOS battery may cause:

* Incorrect system date and time
* Firmware settings resetting
* Boot order changes
* CMOS checksum errors
* Repeated firmware warnings
* The computer asking for setup confirmation

Desktop motherboards commonly use a CR2032 coin-cell battery.

What Is a BIOS or UEFI Update?

Manufacturers periodically release firmware updates.

These updates may:

* Improve hardware compatibility
* Fix security vulnerabilities
* Support newer processors
* Improve system stability
* Fix boot problems
* Add features

The process of installing a firmware update is often called:

Flashing the BIOS

Risks of Firmware Updates

Firmware updates must be handled carefully.

If power is lost or the update is interrupted, the motherboard firmware may become corrupted.

This could prevent the computer from starting.

Before updating firmware:

* Confirm the exact computer or motherboard model
* Download firmware from the manufacturer
* Read the update instructions
* Keep the computer connected to reliable power
* Do not restart during the update
* Suspend BitLocker when instructed
* Back up important files

Firmware should not be updated randomly when the system is already working correctly unless the update addresses a relevant security, compatibility, or stability issue.

Common BIOS and UEFI Problems

Computer Does Not Detect the SSD

Possible causes include:

* Loose storage connection
* Failed SSD
* Disabled storage controller
* Incorrect M.2 slot configuration
* Shared PCIe lanes
* Unsupported storage device
* Outdated firmware

Check whether the storage device appears inside the firmware interface.

If it does not appear there, Windows will normally be unable to use it.

Windows Boot Manager Is Missing

Possible causes include:

* Damaged EFI System Partition
* Corrupted boot files
* Incorrect boot mode
* Incorrect boot order
* Failed storage device
* Windows installed on another drive

Confirm that the system is using the correct UEFI or Legacy mode for the installed operating system.

No Boot Device Found

Possible causes include:

* SSD failure
* Disconnected storage device
* Incorrect boot order
* Damaged boot files
* Incorrect partition style
* UEFI and Legacy mode mismatch

The first step is to verify whether the storage device is detected in firmware.

Secure Boot Violation

A Secure Boot violation usually means the firmware does not trust the selected boot software.

Possible causes include:

* Unsigned boot loader
* Older operating system
* Custom recovery tool
* Incorrect Secure Boot keys
* Modified startup files

Confirm that the operating system and boot media support Secure Boot.

Date and Time Keep Resetting

This commonly suggests:

* Weak CMOS battery
* Firmware settings not being saved
* Motherboard problem

Replacing the CMOS battery often resolves the issue on desktop computers.

Troubleshooting Workflow

When troubleshooting firmware or boot problems, use a structured process.

1. Confirm the computer receives power
2. Check whether POST completes
3. Enter BIOS or UEFI
4. Confirm the storage device is detected
5. Check the boot order
6. Confirm UEFI or Legacy mode
7. Check Secure Boot settings
8. Review error messages
9. Test the storage device
10. Repair Windows boot files if necessary

Avoid changing multiple settings at the same time.

Make one change, test the result, and document what happened.

Real-World Example

A user reports:

“My computer was working yesterday, but now it displays ‘No Boot Device Found.’”

The computer powers on and the manufacturer logo appears.

This tells us:

* The power supply is working
* The CPU is executing firmware
* The display is functioning
* BIOS or UEFI is starting

The next step is to enter the firmware interface and check whether the SSD is detected.

Scenario 1: The SSD Is Not Detected

Possible causes include:

* Failed SSD
* Loose cable
* Incorrectly seated NVMe drive
* Disabled storage controller
* Motherboard or slot problem

Scenario 2: The SSD Is Detected

Possible causes include:

* Incorrect boot order
* Missing Windows Boot Manager entry
* Corrupted EFI System Partition
* Incorrect UEFI or Legacy mode
* Damaged Windows boot files

The firmware information helps determine whether the problem is related to hardware or software.

CompTIA A+ Exam Tips

For the CompTIA A+ exam, remember:

* BIOS is older firmware.
* UEFI is the modern replacement for BIOS.
* UEFI commonly uses GPT.
* Legacy BIOS commonly uses MBR.
* Secure Boot is a UEFI security feature.
* TPM supports encryption and hardware-based security.
* POST checks essential hardware before the operating system loads.
* Boot order determines which device the system checks first.
* A weak CMOS battery may cause date and firmware settings to reset.
* Firmware updates must not be interrupted.

Key Takeaways

BIOS and UEFI prepare the computer before the operating system starts.

The most important concepts are:

* BIOS is the traditional firmware interface.
* UEFI is the modern firmware standard.
* UEFI provides better security and modern hardware support.
* BIOS commonly uses MBR.
* UEFI commonly uses GPT.
* Secure Boot verifies trusted startup software.
* The boot order determines where the computer searches for an operating system.
* The CMOS battery preserves firmware settings.
* Incorrect firmware settings can prevent Windows from loading.
* Firmware updates must be completed carefully.

Understanding BIOS and UEFI makes it much easier to troubleshoot startup failures, storage detection problems, operating-system installation issues, and hardware configuration errors.
