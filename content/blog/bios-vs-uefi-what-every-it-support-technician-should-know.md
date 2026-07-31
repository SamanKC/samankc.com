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
BIOS and UEFI are firmware systems that prepare a computer before Windows starts. They initialise hardware, run startup checks, locate a bootable device, and hand control to the operating system.

Understanding them is essential for CompTIA A+ study and real-world IT troubleshooting.

# What Is BIOS?

BIOS stands for **Basic Input/Output System**.

It is the traditional firmware used on older computers. BIOS performs tasks such as:

- Initialising hardware
- Running POST
- Detecting storage devices
- Checking the boot order
- Starting the operating system

BIOS commonly works with the **MBR** partition style.

# What Is UEFI?

UEFI stands for **Unified Extensible Firmware Interface**.

It is the modern replacement for BIOS and provides:

- Faster startup
- Secure Boot
- Support for large drives
- Better hardware compatibility
- Graphical menus and mouse support
- Support for GPT partitions

Most modern computers use UEFI.

# BIOS vs UEFI

| Feature | BIOS | UEFI |
| --- | --- | --- |
| Typical systems | Older computers | Modern computers |
| Partition style | MBR | GPT |
| Secure Boot | Not supported | Supported |
| Drive support | Commonly limited to about 2 TB | Supports drives larger than 2 TB |
| Interface | Usually keyboard-based | Often graphical |
| Startup speed | Generally slower | Generally faster |

# MBR and GPT

BIOS usually boots from an **MBR** drive.

MBR supports:

- Drives up to about 2 TB
- Four primary partitions

UEFI usually boots from a **GPT** drive.

GPT provides:

- Support for larger drives
- More partitions
- Backup partition data
- Better reliability

# Secure Boot

Secure Boot is a UEFI security feature.

It checks whether startup software is trusted before allowing it to run. This helps block unauthorised boot loaders and certain types of pre-boot malware.

Secure Boot may sometimes need to be disabled temporarily when using older operating systems or unsigned diagnostic tools.

# Boot Order

The boot order tells BIOS or UEFI which device to check first.

Example:

```text
1. Windows Boot Manager
2. NVMe SSD
3. USB Drive
4. Network Boot
```

An incorrect boot order can cause errors such as:

```text
No Boot Device Found
```

# Common Firmware Settings

BIOS and UEFI commonly include settings for:

- Boot order
- Secure Boot
- TPM
- CPU virtualisation
- Storage controller mode
- System date and time
- Firmware passwords
- Hardware diagnostics

Changing storage mode or boot mode incorrectly can prevent Windows from loading.

# CMOS Battery

The CMOS battery helps preserve firmware settings when the computer is disconnected from power.

A weak battery may cause:

- Incorrect date and time
- Reset boot order
- Firmware settings not being saved
- CMOS checksum errors

# Common Problems

| Symptom | Possible Cause |
| --- | --- |
| SSD not detected | Loose connection, failed SSD, disabled controller |
| No Boot Device Found | Incorrect boot order, failed drive, damaged boot files |
| Windows Boot Manager missing | Corrupted EFI partition or wrong boot mode |
| Secure Boot violation | Untrusted or unsigned boot software |
| Date and time reset | Weak CMOS battery |

# Troubleshooting Workflow

```text
1. Confirm the computer powers on
2. Check whether POST completes
3. Enter BIOS or UEFI
4. Confirm the SSD is detected
5. Check the boot order
6. Confirm UEFI or Legacy mode
7. Review Secure Boot settings
8. Test the storage device
9. Repair Windows boot files if required
```

Make one change at a time and test the result before changing another setting.

# CompTIA A+ Key Points

Remember:

- BIOS is older firmware.
- UEFI is the modern replacement.
- BIOS commonly uses MBR.
- UEFI commonly uses GPT.
- Secure Boot is a UEFI feature.
- POST checks hardware before Windows starts.
- Boot order determines which device starts first.
- A weak CMOS battery can reset firmware settings.
- Firmware updates must not be interrupted.

# Conclusion

BIOS and UEFI connect the computer's hardware to the operating system startup process.

Knowing how they work helps IT Support technicians diagnose storage problems, boot failures, incorrect firmware settings, and Windows startup issues more quickly.
