import sys

def main():
    print("Hello from Python!")
    for arg in sys.argv[1:]:
        print(f"Argument: {arg}")

if __name__ == "__main__":
    main()
