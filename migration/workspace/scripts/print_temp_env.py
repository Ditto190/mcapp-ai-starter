import os
import sys


def main():
    tmp = os.environ.get("TMP")
    temp = os.environ.get("TEMP")
    print(f"TMP={tmp}")
    print(f"TEMP={temp}")
    # Show which temp is used by tempfile module
    try:
        import tempfile

        print(f"tempfile.gettempdir()={tempfile.gettempdir()}")
    except Exception as e:
        print(f"tempfile not available: {e}")
    # Check existence of the configured folder
    configured = r"C:\\Users\\dylan.a.thomas\\AppData\\Local\\Temp"
    exists = os.path.exists(configured)
    print(f"Configured path {configured} exists: {exists}")


if __name__ == "__main__":
    main()
